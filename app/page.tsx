'use client';

import React, { useState, useEffect, useMemo } from 'react';
import DynamicMap from '@/components/map/DynamicMap';
import Header from '@/components/discovery/Header';
import FilterBar from '@/components/discovery/FilterBar';
import PlaceCardDrawer from '@/components/discovery/PlaceCardDrawer';
import ZineLookbook from '@/components/discovery/ZineLookbook';
import ReportModal from '@/components/discovery/ReportModal';
import SavedPlacesDrawer from '@/components/discovery/SavedPlacesDrawer';
import { Place, FilterState } from '@/lib/types';
import { calculateDistanceMeters, computeCompositeScore } from '@/lib/scoring';
import initialPlacesData from '@/data/places_mumbai.json';

// Default center: Mumbai (Bandra / Dadar central coordinates)
const DEFAULT_MUMBAI_CENTER = { lat: 19.0418, lng: 72.8398 };

export default function HomePage() {
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(
    DEFAULT_MUMBAI_CENTER
  );
  const [allPlaces, setAllPlaces] = useState<Place[]>(
    Array.isArray(initialPlacesData) ? (initialPlacesData as Place[]) : []
  );
  const [selectedPlace, setSelectedPlace] = useState<Place | null>(null);
  const [reportingPlace, setReportingPlace] = useState<Place | null>(null);
  const [isLocating, setIsLocating] = useState(false);
  const [viewMode, setViewMode] = useState<'map' | 'zine'>('map');
  const [isSavedDrawerOpen, setIsSavedDrawerOpen] = useState(false);
  const [savedPlaceIds, setSavedPlaceIds] = useState<string[]>([]);

  const [filters, setFilters] = useState<FilterState>({
    category: 'all',
    spotTier: 'all',
    radiusKm: 40,
    maxCrowdLevel: 5,
    searchQuery: '',
  });

  // Load master places dataset & saved favorites once on mount
  useEffect(() => {
    async function loadInitialPlaces() {
      try {
        const res = await fetch('/api/places/nearby?radiusKm=100');
        if (res.ok) {
          const data = await res.json();
          setAllPlaces(data.places || []);
        }
      } catch (e) {
        console.error('Failed to load initial places:', e);
      }
    }
    loadInitialPlaces();

    try {
      const favs = JSON.parse(localStorage.getItem('hidden_favs') || '[]');
      setSavedPlaceIds(favs);
    } catch {
      setSavedPlaceIds([]);
    }
  }, []);

  // Update favorites list whenever drawer state or storage changes
  const refreshFavorites = () => {
    try {
      const favs = JSON.parse(localStorage.getItem('hidden_favs') || '[]');
      setSavedPlaceIds(favs);
    } catch {
      setSavedPlaceIds([]);
    }
  };

  const handleRemoveFavorite = (placeId: string) => {
    const updated = savedPlaceIds.filter((id) => id !== placeId);
    setSavedPlaceIds(updated);
    localStorage.setItem('hidden_favs', JSON.stringify(updated));
  };

  const handleClearAllFavorites = () => {
    setSavedPlaceIds([]);
    localStorage.setItem('hidden_favs', JSON.stringify([]));
  };

  const savedPlaces = useMemo(() => {
    return allPlaces.filter((p) => savedPlaceIds.includes(p.id));
  }, [allPlaces, savedPlaceIds]);

  // INSTANT in-memory filtering: 0ms latency on filter clicks and search typing!
  const filteredPlaces = useMemo(() => {
    const center = userLocation || DEFAULT_MUMBAI_CENTER;
    const radiusMeters = filters.radiusKm * 1000;
    const query = filters.searchQuery.toLowerCase().trim();

    return allPlaces
      .map((place) => {
        const distance = calculateDistanceMeters(
          center.lat,
          center.lng,
          place.latitude,
          place.longitude
        );
        return {
          ...place,
          distance_meters: Math.round(distance),
          composite_score: computeCompositeScore(place, distance),
        };
      })
      .filter((place) => {
        // Distance radius filter
        if (place.distance_meters !== undefined && place.distance_meters > radiusMeters) {
          return false;
        }

        // Category filter
        if (filters.category !== 'all' && place.category !== filters.category) {
          return false;
        }

        // Spot tier filter
        if (filters.spotTier !== 'all' && place.spot_tier !== filters.spotTier) {
          return false;
        }

        // Crowd filter
        if (place.crowd_level > filters.maxCrowdLevel) {
          return false;
        }

        // Instant text query search
        if (query) {
          const mName = place.name.toLowerCase().includes(query);
          const mShort = place.short_name?.toLowerCase().includes(query);
          const mDesc = place.description.toLowerCase().includes(query);
          const mNeighbor = place.neighborhood?.toLowerCase().includes(query);
          const mCat = place.category.toLowerCase().includes(query);
          const mTags = place.vibe_tags.some((t) => t.toLowerCase().includes(query));
          if (!mName && !mShort && !mDesc && !mNeighbor && !mCat && !mTags) {
            return false;
          }
        }

        return true;
      })
      .sort((a, b) => (b.composite_score || 0) - (a.composite_score || 0));
  }, [allPlaces, userLocation, filters]);

  // Instant location toggle
  const handleLocateMe = () => {
    if (!navigator.geolocation) {
      alert('Geolocation is not supported by your browser.');
      return;
    }
    setIsLocating(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setUserLocation({
          lat: pos.coords.latitude,
          lng: pos.coords.longitude,
        });
        setIsLocating(false);
      },
      (err) => {
        console.warn('Geolocation denied, keeping Mumbai center:', err.message);
        setUserLocation(DEFAULT_MUMBAI_CENTER);
        setIsLocating(false);
      },
      { timeout: 8000, enableHighAccuracy: true }
    );
  };

  const handleFilterChange = (updated: Partial<FilterState>) => {
    setFilters((prev) => ({ ...prev, ...updated }));
  };

  const handleSelectFromZine = (place: Place) => {
    setSelectedPlace(place);
    setViewMode('map');
  };

  return (
    <div className="relative w-screen h-screen overflow-hidden bg-wabi flex flex-col font-kaluk">
      {/* 1. Global Non-Overlapping App Header */}
      <Header
        currentCity="Mumbai"
        onLocateMe={handleLocateMe}
        isLocating={isLocating}
        searchQuery={filters.searchQuery}
        onSearchChange={(q) => handleFilterChange({ searchQuery: q })}
        viewMode={viewMode}
        onToggleView={(m) => setViewMode(m)}
        totalSpots={filteredPlaces.length}
        savedCount={savedPlaces.length}
        onOpenSaved={() => {
          refreshFavorites();
          setIsSavedDrawerOpen(true);
        }}
      />

      {/* 2. Interactive Workspace (Map vs Zine Lookbook) */}
      <main className="relative flex-1 w-full h-[calc(100vh-80px)] overflow-hidden">
        {viewMode === 'map' ? (
          <div className="w-full h-full relative z-0">
            {/* Docked Map Filter Island */}
            <div className="absolute top-4 left-4 right-4 md:left-6 md:right-auto md:w-[500px] z-20 pointer-events-auto">
              <FilterBar
                filters={filters}
                onChange={handleFilterChange}
                totalFound={filteredPlaces.length}
              />
            </div>

            {/* Map Canvas */}
            <DynamicMap
              places={filteredPlaces}
              userLocation={userLocation}
              selectedPlace={selectedPlace}
              onSelectPlace={(p) => setSelectedPlace(p)}
              radiusKm={filters.radiusKm}
            />
          </div>
        ) : (
          <div className="w-full h-full relative z-0">
            {/* Zine Lookbook View */}
            <ZineLookbook
              places={filteredPlaces}
              onSelectPlace={handleSelectFromZine}
              filters={filters}
              onFilterChange={handleFilterChange}
            />
          </div>
        )}
      </main>

      {/* 3. Place Detail Card Drawer */}
      <PlaceCardDrawer
        place={selectedPlace}
        onClose={() => {
          setSelectedPlace(null);
          refreshFavorites();
        }}
        onOpenReport={(p) => setReportingPlace(p)}
      />

      {/* 4. Saved Places Tray */}
      <SavedPlacesDrawer
        isOpen={isSavedDrawerOpen}
        onClose={() => setIsSavedDrawerOpen(false)}
        savedPlaces={savedPlaces}
        onSelectPlace={(p) => {
          setSelectedPlace(p);
          setViewMode('map');
        }}
        onRemoveFavorite={handleRemoveFavorite}
        onClearAll={handleClearAllFavorites}
      />

      {/* 5. Safety Report Modal */}
      {reportingPlace && (
        <ReportModal
          place={reportingPlace}
          isOpen={!!reportingPlace}
          onClose={() => setReportingPlace(null)}
        />
      )}
    </div>
  );
}
