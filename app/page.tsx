'use client';

import React, { useState, useEffect, useCallback } from 'react';
import DynamicMap from '@/components/map/DynamicMap';
import Header from '@/components/discovery/Header';
import FilterBar from '@/components/discovery/FilterBar';
import PlaceCardDrawer from '@/components/discovery/PlaceCardDrawer';
import ReportModal from '@/components/discovery/ReportModal';
import { Place, FilterState } from '@/lib/types';

// Default center: Mumbai (Bandra / Dadar central coordinates)
const DEFAULT_MUMBAI_CENTER = { lat: 19.0418, lng: 72.8398 };

export default function HomePage() {
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(
    DEFAULT_MUMBAI_CENTER
  );
  const [places, setPlaces] = useState<Place[]>([]);
  const [selectedPlace, setSelectedPlace] = useState<Place | null>(null);
  const [reportingPlace, setReportingPlace] = useState<Place | null>(null);
  const [isLocating, setIsLocating] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const [filters, setFilters] = useState<FilterState>({
    category: 'all',
    radiusKm: 25,
    maxCrowdLevel: 5,
    minHiddenness: 0.0,
    searchQuery: '',
  });

  // Fetch places from our nearby API route
  const fetchPlaces = useCallback(async () => {
    try {
      setIsLoading(true);
      const center = userLocation || DEFAULT_MUMBAI_CENTER;
      const params = new URLSearchParams({
        lat: center.lat.toString(),
        lng: center.lng.toString(),
        radiusKm: filters.radiusKm.toString(),
        category: filters.category,
        maxCrowd: filters.maxCrowdLevel.toString(),
        minHiddenness: filters.minHiddenness.toString(),
        q: filters.searchQuery,
      });

      const res = await fetch(`/api/places/nearby?${params.toString()}`);
      if (!res.ok) throw new Error('API fetch failed');
      const data = await res.json();
      setPlaces(data.places || []);
    } catch (err) {
      console.error('Failed to load places:', err);
    } finally {
      setIsLoading(false);
    }
  }, [userLocation, filters]);

  // Request browser geolocation
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
        console.warn('Geolocation denied or unavailable, using Mumbai center:', err.message);
        setUserLocation(DEFAULT_MUMBAI_CENTER);
        setIsLocating(false);
      },
      { timeout: 10000, enableHighAccuracy: true }
    );
  };

  // Re-fetch on filter or location changes
  useEffect(() => {
    fetchPlaces();
  }, [fetchPlaces]);

  const handleFilterChange = (updated: Partial<FilterState>) => {
    setFilters((prev) => ({ ...prev, ...updated }));
  };

  return (
    <main className="relative w-screen h-screen overflow-hidden bg-slate-100 flex flex-col">
      {/* Top Header */}
      <Header
        currentCity="Mumbai"
        onLocateMe={handleLocateMe}
        isLocating={isLocating}
        searchQuery={filters.searchQuery}
        onSearchChange={(q) => handleFilterChange({ searchQuery: q })}
      />

      {/* Floating Filter Bar */}
      <div className="absolute top-24 md:top-20 left-4 right-4 md:left-6 md:right-auto md:w-[460px] z-20 pointer-events-auto">
        <FilterBar
          filters={filters}
          onChange={handleFilterChange}
          totalFound={places.length}
        />
      </div>

      {/* Interactive Map Core */}
      <div className="flex-1 w-full h-full relative z-0">
        <DynamicMap
          places={places}
          userLocation={userLocation}
          selectedPlace={selectedPlace}
          onSelectPlace={(p) => setSelectedPlace(p)}
          radiusKm={filters.radiusKm}
        />
      </div>

      {/* Place Detail Card Drawer */}
      <PlaceCardDrawer
        place={selectedPlace}
        onClose={() => setSelectedPlace(null)}
        onOpenReport={(p) => setReportingPlace(p)}
      />

      {/* Safety Report Modal */}
      {reportingPlace && (
        <ReportModal
          place={reportingPlace}
          isOpen={!!reportingPlace}
          onClose={() => setReportingPlace(null)}
        />
      )}
    </main>
  );
}
