'use client';

import React, { useState, useEffect, useMemo, useCallback } from 'react';
import DynamicMap from '@/components/map/DynamicMap';
import Header from '@/components/discovery/Header';
import FilterBar from '@/components/discovery/FilterBar';
import PlaceCardDrawer from '@/components/discovery/PlaceCardDrawer';
import ZineLookbook from '@/components/discovery/ZineLookbook';
import TransitNavigatorView from '@/components/transit/TransitNavigatorView';
import ReportModal from '@/components/discovery/ReportModal';
import SavedPlacesDrawer from '@/components/discovery/SavedPlacesDrawer';
import RastaRouletteModal from '@/components/discovery/RastaRouletteModal';
import SmartCommuteModal from '@/components/transit/SmartCommuteModal';
import { Place, FilterState } from '@/lib/types';
import { calculateDistanceMeters, computeCompositeScore } from '@/lib/scoring';
import { TransitStation, SmartCommutePlan, getSanctuaryTransitProfile } from '@/lib/transit';
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
  const [viewMode, setViewMode] = useState<'map' | 'zine' | 'transit'>('map');
  const [showTransitOverlay, setShowTransitOverlay] = useState(false);
  const [showPlacesOverlay, setShowPlacesOverlay] = useState(true);
  const [selectedTransitStation, setSelectedTransitStation] = useState<TransitStation | null>(null);
  const [activeCommutePlan, setActiveCommutePlan] = useState<SmartCommutePlan | null>(null);
  const [isSmartCommuteModalOpen, setIsSmartCommuteModalOpen] = useState(false);
  const [isSavedDrawerOpen, setIsSavedDrawerOpen] = useState(false);
  const [isRouletteOpen, setIsRouletteOpen] = useState(false);
  const [savedPlaceIds, setSavedPlaceIds] = useState<string[]>([]);

  const [filters, setFilters] = useState<FilterState>({
    category: 'all',
    spotTier: 'all',
    budget: 'all',
    radiusKm: 120,
    maxCrowdLevel: 5,
    searchQuery: '',
    transitAccess: 'all',
  });

  // Load master places dataset & saved favorites once on mount
  useEffect(() => {
    async function loadInitialPlaces() {
      try {
        const res = await fetch('/api/places/nearby?radiusKm=500');
        if (res.ok) {
          const data = await res.json();
          if (Array.isArray(data.places) && data.places.length >= initialPlacesData.length) {
            setAllPlaces(data.places);
          }
        }
      } catch (e) {
        console.warn('Using bundled initial places dataset:', e);
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

  // 1. Calculate distances & scores ONLY when userLocation or allPlaces change (Never on search typing!)
  const placesWithScores = useMemo(() => {
    const center = userLocation || DEFAULT_MUMBAI_CENTER;
    return allPlaces.map((place) => {
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
    });
  }, [allPlaces, userLocation]);

  // 2. High-speed in-memory filtering: pure O(N) array filter running in <0.2ms
  const filteredPlaces = useMemo(() => {
    const radiusMeters = filters.radiusKm * 1000;
    const query = filters.searchQuery.toLowerCase().trim();

    return placesWithScores
      .filter((place) => {
        // Distance radius filter (skip distance cutoff when All MMR / 120km is active)
        if (filters.radiusKm < 120 && place.distance_meters !== undefined && place.distance_meters > radiusMeters) {
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

        // Budget / Pocket-friendly filter
        if (filters.budget !== 'all' && place.budget_tier !== filters.budget) {
          return false;
        }

        // Transit proximity / Travelling options filter
        if (filters.transitAccess && filters.transitAccess !== 'all') {
          const profile = getSanctuaryTransitProfile(place.latitude, place.longitude);
          if (filters.transitAccess === 'near_metro') {
            if (!profile.nearestMetro || profile.nearestMetro.distanceMeters > 1000) return false;
          } else if (filters.transitAccess === 'near_railway') {
            if (profile.nearestRailway.distanceMeters > 1000) return false;
          } else if (filters.transitAccess === 'walkable_transit') {
            const railDist = profile.nearestRailway.distanceMeters;
            const metroDist = profile.nearestMetro ? profile.nearestMetro.distanceMeters : Infinity;
            if (Math.min(railDist, metroDist) > 800) return false;
          }
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
          const mCost = place.approx_cost?.toLowerCase().includes(query);
          if (!mName && !mShort && !mDesc && !mNeighbor && !mCat && !mTags && !mCost) {
            return false;
          }
        }

        return true;
      })
      .sort((a, b) => (b.composite_score || 0) - (a.composite_score || 0));
  }, [placesWithScores, filters]);

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

  const handleFilterChange = useCallback((updated: Partial<FilterState>) => {
    setFilters((prev) => ({ ...prev, ...updated }));
  }, []);

  const handleSearchChange = useCallback((q: string) => {
    setFilters((prev) => ({ ...prev, searchQuery: q }));
  }, []);

  const handleSelectPlace = useCallback((place: Place) => {
    setSelectedPlace(place);
  }, []);

  const handleSelectFromZine = useCallback((place: Place) => {
    setSelectedPlace(place);
    setViewMode('map');
  }, []);

  return (
    <div className={`relative w-screen bg-wabi flex flex-col font-sans ${viewMode === 'map' ? 'h-[100dvh] overflow-hidden' : 'min-h-[100dvh] overflow-y-auto'}`}>
      {/* 1. Global App Header (At the top of the page - stays at top and scrolls away in lookbook) */}
      <Header
        currentCity="Mumbai"
        onLocateMe={handleLocateMe}
        isLocating={isLocating}
        searchQuery={filters.searchQuery}
        onSearchChange={handleSearchChange}
        viewMode={viewMode}
        onToggleView={(m) => setViewMode(m)}
        totalSpots={filteredPlaces.length}
        savedCount={savedPlaces.length}
        onOpenSaved={() => {
          refreshFavorites();
          setIsSavedDrawerOpen(true);
        }}
        onOpenRoulette={() => setIsRouletteOpen(true)}
      />

      {/* 2. Interactive Workspace (Map vs Zine Lookbook vs Transit Navigator) */}
      <main className={`relative w-full ${viewMode === 'map' ? 'flex-1 overflow-hidden' : 'flex-1'}`}>
        {viewMode === 'map' ? (
          <div className="w-full h-full relative z-0">
            {/* Docked Map Filter Island (Visible when browsing all spots; tucks away when a destination is selected) */}
            {!selectedPlace && (
              <div className="absolute top-3 left-3 right-3 sm:top-4 sm:left-6 sm:right-auto sm:max-w-2xl z-20 pointer-events-auto animate-in fade-in duration-200">
                <FilterBar
                  filters={filters}
                  onChange={handleFilterChange}
                  totalFound={filteredPlaces.length}
                  showPlacesOverlay={showPlacesOverlay}
                  onTogglePlacesOverlay={() => setShowPlacesOverlay((prev) => !prev)}
                />
              </div>
            )}

            {/* Map Canvas */}
            <DynamicMap
              places={filteredPlaces}
              userLocation={userLocation}
              selectedPlace={selectedPlace}
              onSelectPlace={handleSelectPlace}
              radiusKm={filters.radiusKm}
              showTransitOverlay={showTransitOverlay}
              onToggleTransitOverlay={(v) => setShowTransitOverlay(v)}
              showPlacesOverlay={showPlacesOverlay}
              onTogglePlacesOverlay={(v) => setShowPlacesOverlay(v)}
              selectedTransitStation={selectedTransitStation}
              onSelectTransitStation={(stn) => setSelectedTransitStation(stn)}
              onOpenTransitGuide={(stn, place) => {
                if (stn) setSelectedTransitStation(stn);
                if (place) setSelectedPlace(place);
                setViewMode('transit');
              }}
              activeCommutePlan={activeCommutePlan}
              onClearCommutePlan={() => setActiveCommutePlan(null)}
              onOpenSmartCommuteModal={() => setIsSmartCommuteModalOpen(true)}
            />
          </div>
        ) : viewMode === 'zine' ? (
          <div className="w-full relative z-0">
            {/* Zine Lookbook View */}
            <ZineLookbook
              places={filteredPlaces}
              onSelectPlace={handleSelectFromZine}
              filters={filters}
              onFilterChange={handleFilterChange}
            />
          </div>
        ) : (
          <div className="w-full relative z-0">
            {/* Mumbai Local Train & Metro Smart Directions View */}
            <TransitNavigatorView
              places={allPlaces}
              initialSelectedPlace={selectedPlace}
              initialSelectedStation={selectedTransitStation}
              onSelectPlace={(p) => setSelectedPlace(p)}
              onViewOnMap={(p, stn) => {
                setSelectedPlace(p);
                if (stn) setSelectedTransitStation(stn);
                setShowTransitOverlay(true);
                setViewMode('map');
              }}
              onExploreStationOnMap={(stn) => {
                setSelectedTransitStation(stn);
                setShowTransitOverlay(true);
                setViewMode('map');
              }}
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
        onOpenTransit={(p) => {
          setSelectedPlace(p);
          setViewMode('transit');
        }}
        onOpenSmartCommute={(p) => {
          setSelectedPlace(p);
          setIsSmartCommuteModalOpen(true);
        }}
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

      {/* 6. Rasta Roulette (Serendipity Generator) Modal */}
      <RastaRouletteModal
        isOpen={isRouletteOpen}
        onClose={() => setIsRouletteOpen(false)}
        places={allPlaces}
        userLocation={userLocation}
        onSelectPlace={(place) => {
          setSelectedPlace(place);
          setViewMode('map');
        }}
        currentCategory={filters.category}
      />

      {/* 7. Smart Commute Route Planning Modal */}
      <SmartCommuteModal
        isOpen={isSmartCommuteModalOpen}
        onClose={() => setIsSmartCommuteModalOpen(false)}
        destinationPlace={selectedPlace}
        userLocation={userLocation}
        allPlaces={allPlaces}
        onSelectDestination={(p) => setSelectedPlace(p)}
        onTraceOnMap={(plan) => {
          setActiveCommutePlan(plan);
          setSelectedPlace(plan.destinationPlace);
          setSelectedTransitStation(plan.destinationStation);
          setShowTransitOverlay(true);
          setViewMode('map');
        }}
      />
    </div>
  );
}
