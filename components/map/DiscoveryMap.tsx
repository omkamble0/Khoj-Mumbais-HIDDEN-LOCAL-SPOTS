'use client';

import React, { useEffect, useRef } from 'react';
import L from 'leaflet';
import { Place } from '@/lib/types';
import { getCurrentVibeWindow, checkIsPlacePeakingNow } from '@/lib/vibeRadar';

interface DiscoveryMapProps {
  places: Place[];
  userLocation: { lat: number; lng: number } | null;
  selectedPlace: Place | null;
  onSelectPlace: (place: Place) => void;
  radiusKm: number;
  isBlinking?: boolean;
  onToggleBlinking?: () => void;
}

// Category Theme Accents
const CATEGORY_COLORS: Record<string, { dot: string; border: string; bg: string }> = {
  cafes: { dot: '#d97706', border: '#b45309', bg: '#fffbeb' },      // Amber
  bars: { dot: '#be185d', border: '#9d174d', bg: '#fdf2f8' },       // Deep Wine Rose
  forts: { dot: '#2563eb', border: '#1d4ed8', bg: '#eff6ff' },      // Blue
  walks: { dot: '#059669', border: '#047857', bg: '#ecfdf5' },      // Emerald Walk
  treks: { dot: '#15803d', border: '#166534', bg: '#f0fdf4' },      // Forest Trek
  gardens: { dot: '#10b981', border: '#059669', bg: '#d1fae5' },    // Garden Green
  viewpoints: { dot: '#ff3e18', border: '#e52c07', bg: '#fff1ee' }, // Vermilion
  waterfront: { dot: '#0891b2', border: '#0e7490', bg: '#ecfeff' }, // Cyan
  heritage: { dot: '#7c3aed', border: '#6d28d9', bg: '#f5f3ff' },   // Purple
  books: { dot: '#b45309', border: '#92400e', bg: '#fef3c7' },      // Warm Ochre
  culture: { dot: '#e11d48', border: '#be123c', bg: '#ffe4e6' },    // Rose
  spiritual: { dot: '#6366f1', border: '#4f46e5', bg: '#e0e7ff' },  // Indigo
  bazaars: { dot: '#ea580c', border: '#c2410c', bg: '#ffedd5' },    // Terracotta
};

// Generous India Geographical Bounding Box (Lat: 5.0°N to 38.0°N, Lng: 65.0°E to 100.0°E)
const INDIA_BOUNDS: L.LatLngBoundsExpression = [
  [5.0, 65.0],
  [38.0, 100.0],
];

export default function DiscoveryMap({
  places,
  userLocation,
  selectedPlace,
  onSelectPlace,
  radiusKm,
  isBlinking = false,
  onToggleBlinking,
}: DiscoveryMapProps) {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const markersLayerRef = useRef<L.LayerGroup | null>(null);
  const radiusCircleRef = useRef<L.Circle | null>(null);
  const userMarkerRef = useRef<L.Marker | null>(null);
  const prevSelectedIdRef = useRef<string | null>(null);
  const currentPlaceIdsRef = useRef<string>('');
  const onSelectPlaceRef = useRef(onSelectPlace);
  onSelectPlaceRef.current = onSelectPlace;

  // Initialize Map safely & bind adaptive zoom
  useEffect(() => {
    if (!mapContainerRef.current) return;
    if (mapInstanceRef.current) return;

    try {
      if ((mapContainerRef.current as any)._leaflet_id) {
        (mapContainerRef.current as any)._leaflet_id = null;
      }

      const initialLat = userLocation?.lat || 19.0418;
      const initialLng = userLocation?.lng || 72.8398;

      const map = L.map(mapContainerRef.current, {
        center: [initialLat, initialLng],
        zoom: 12,
        minZoom: 6, // Prevents zooming out to the entire globe (keeps map strictly within India)
        maxZoom: 19,
        maxBounds: INDIA_BOUNDS,
        maxBoundsViscosity: 0.1, // Smooth, frictionless drag without heavy physics calculation lag
        zoomControl: false,
        preferCanvas: true,
      });

      // Adaptive Zoom density check: at zoom < 13, markers collapse to sleek non-overlapping dots
      const updateZoomClass = () => {
        if (!mapContainerRef.current) return;
        if (map.getZoom() < 13) {
          mapContainerRef.current.classList.add('map-zoom-city');
        } else {
          mapContainerRef.current.classList.remove('map-zoom-city');
        }
      };
      updateZoomClass();
      map.on('zoomend', updateZoomClass);

      // Lightweight OpenStreetMap tiles (smooth native tile streaming without clipping stalls)
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution:
          '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
        subdomains: ['a', 'b', 'c'],
        minZoom: 6,
        maxZoom: 19,
      }).addTo(map);

      L.control.zoom({ position: 'bottomright' }).addTo(map);

      markersLayerRef.current = L.layerGroup().addTo(map);
      mapInstanceRef.current = map;

      setTimeout(() => {
        if (mapInstanceRef.current) {
          mapInstanceRef.current.invalidateSize();
        }
      }, 200);
    } catch (err) {
      console.warn('Map initialization warning:', err);
    }

    return () => {
      try {
        if (mapInstanceRef.current) {
          mapInstanceRef.current.remove();
          mapInstanceRef.current = null;
        }
      } catch (err) {
        console.warn('Map cleanup error:', err);
      }
    };
  }, []);

  // Update User Location Marker & Radius
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map || !userLocation) return;

    try {
      const userIcon = L.divIcon({
        className: 'user-location-pin',
        html: `
          <div class="relative flex items-center justify-center w-10 h-10">
            <div class="absolute w-10 h-10 bg-vermilion rounded-full opacity-30 animate-ping"></div>
            <div class="w-5 h-5 bg-vermilion border-2 border-white rounded-full shadow-riso-sm flex items-center justify-center">
              <span class="w-1.5 h-1.5 bg-white rounded-full"></span>
            </div>
          </div>
        `,
        iconSize: [40, 40],
        iconAnchor: [20, 20],
      });

      if (userMarkerRef.current) {
        userMarkerRef.current.setLatLng([userLocation.lat, userLocation.lng]);
      } else {
        userMarkerRef.current = L.marker([userLocation.lat, userLocation.lng], {
          icon: userIcon,
          zIndexOffset: 1000,
        }).addTo(map);
      }

      if (radiusCircleRef.current) {
        radiusCircleRef.current.setLatLng([userLocation.lat, userLocation.lng]);
        radiusCircleRef.current.setRadius(radiusKm * 1000);
      } else {
        radiusCircleRef.current = L.circle([userLocation.lat, userLocation.lng], {
          radius: radiusKm * 1000,
          color: '#ff3e18',
          fillColor: '#ff3e18',
          fillOpacity: 0.04,
          weight: 1.5,
          dashArray: '5, 8',
        }).addTo(map);
      }
    } catch (err) {
      console.warn('Error updating user location marker:', err);
    }
  }, [userLocation, radiusKm]);

  // Rebuild Place Markers ONLY when the filtered places list ACTUALLY changes
  useEffect(() => {
    const map = mapInstanceRef.current;
    const layer = markersLayerRef.current;
    if (!map || !layer) return;

    // Check if place IDs or blinking state actually changed - prevents redundant rebuilds
    const newIds = `${places.map((p) => p.id).join(',')}_blink_${isBlinking}`;
    if (newIds === currentPlaceIdsRef.current && layer.getLayers().length > 0) {
      return;
    }
    currentPlaceIdsRef.current = newIds;

    try {
      layer.clearLayers();
      const { window: currentWindow } = getCurrentVibeWindow();

      places.forEach((place) => {
        const isSelected = selectedPlace?.id === place.id;
        const theme = CATEGORY_COLORS[place.category] || { dot: '#ff3e18', border: '#e52c07', bg: '#fff1ee' };
        const isPeaking = checkIsPlacePeakingNow(place, currentWindow).isPeaking;
        
        // Display real name (short_name or name)
        const displayName = place.short_name || place.name.split(' ')[0] + ' ' + (place.name.split(' ')[1] || '');

        // Tier icon badge
        const tierBadge =
          place.spot_tier === 'iconic'
            ? '★'
            : place.spot_tier === 'hidden_gem'
            ? '✦'
            : '●';

        const markerHtml = `
          <div id="pin-${place.id}" class="custom-pin cursor-pointer flex flex-col items-center group -translate-x-1/2 -translate-y-full pointer-events-auto select-none" data-place-id="${place.id}">
            <!-- Animated Pop-up Assembly -->
            <div class="origin-bottom flex flex-col items-center group-hover:-translate-y-1 group-hover:scale-105 transition-transform duration-100 ease-out">
              <!-- Tactile Pill with Real Place Name -->
              <div class="pin-pill ${isSelected ? 'pin-selected' : ''} px-2.5 py-1 rounded-xl border-2 border-sumi flex items-center gap-1.5 shadow-riso-sm font-sans whitespace-nowrap bg-wabi text-sumi group-hover:bg-white group-hover:border-vermilion transition-colors duration-100">
                <span class="w-2.5 h-2.5 rounded-full flex-shrink-0 relative flex items-center justify-center" style="background-color: ${theme.dot};">
                  ${isPeaking ? (isBlinking ? `<span class="absolute w-4 h-4 rounded-full bg-emerald-500 opacity-60 animate-ping"></span>` : `<span class="absolute w-3.5 h-3.5 rounded-full border border-emerald-500 bg-emerald-500/25"></span>`) : ''}
                </span>
                <span class="pin-label text-xs font-bold tracking-normal">${displayName}</span>
                <span class="pin-tier text-xs font-mono font-bold opacity-80">${tierBadge}</span>
                ${isPeaking ? `<span class="pin-tier text-[10px] text-emerald-600 font-bold" title="Peaking Now">⚡</span>` : ''}
              </div>

              <!-- Tail pointer arrow -->
              <div class="pin-tail ${isSelected ? 'tail-selected' : ''} w-2 h-2 rotate-45 -mt-1 border-r-2 border-b-2 shadow-sm border-sumi bg-wabi group-hover:border-vermilion group-hover:bg-white transition-colors duration-100"></div>
            </div>

            <!-- Contact Target Dot on exact coordinates -->
            <div class="w-1.5 h-1.5 rounded-full bg-sumi -mt-0.5"></div>
          </div>
        `;

        const customIcon = L.divIcon({
          className: 'place-name-pin',
          html: markerHtml,
          iconSize: [0, 0],
          iconAnchor: [0, 0],
        });

        const marker = L.marker([place.latitude, place.longitude], {
          icon: customIcon,
          zIndexOffset: isSelected ? 500 : 0,
        });

        marker.on('mouseover', () => {
          marker.setZIndexOffset(1000);
        });

        marker.on('mouseout', () => {
          const isCurrentlySelected = prevSelectedIdRef.current === place.id;
          marker.setZIndexOffset(isCurrentlySelected ? 500 : 0);
        });

        marker.on('click', () => {
          onSelectPlaceRef.current(place);
        });

        marker.addTo(layer);
      });
    } catch (err) {
      console.warn('Error updating markers:', err);
    }
  }, [places, isBlinking]);

  // Fast 0ms selected marker visual toggle without destroying Leaflet layers
  useEffect(() => {
    const prevId = prevSelectedIdRef.current;
    const currentId = selectedPlace?.id || null;
    if (prevId === currentId) return;

    if (prevId) {
      const prevEl = document.getElementById(`pin-${prevId}`);
      if (prevEl) {
        prevEl.querySelector('.pin-pill')?.classList.remove('pin-selected');
        prevEl.querySelector('.pin-tail')?.classList.remove('tail-selected');
      }
    }

    if (currentId) {
      const currEl = document.getElementById(`pin-${currentId}`);
      if (currEl) {
        currEl.querySelector('.pin-pill')?.classList.add('pin-selected');
        currEl.querySelector('.pin-tail')?.classList.add('tail-selected');
      }
    }

    prevSelectedIdRef.current = currentId;
  }, [selectedPlace]);

  // Single smooth panTo without conflict
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map || !selectedPlace) return;
    try {
      map.panTo([selectedPlace.latitude, selectedPlace.longitude], {
        animate: true,
        duration: 0.5,
      });
    } catch (err) {
      console.warn('Error panning map:', err);
    }
  }, [selectedPlace]);

  return (
    <div className="relative w-full h-full min-h-[400px]">
      <div ref={mapContainerRef} className="w-full h-full min-h-[400px] z-0" style={{ minHeight: '100%' }} />

      {/* Floating Radar Pulse / Blinking Toggle */}
      {onToggleBlinking && (
        <div className="absolute bottom-6 left-3 sm:left-6 z-20 pointer-events-auto flex items-center gap-2">
          <button
            onClick={onToggleBlinking}
            className="flex items-center gap-2 px-3 py-1.5 rounded-xl border-2 border-sumi bg-wabi/95 hover:bg-white text-sumi shadow-riso hover:shadow-riso-sm text-xs font-mono font-bold transition-all active:scale-95"
            title={isBlinking ? 'Click to stop blinking animations' : 'Click to enable blinking animations'}
          >
            <span className={`w-2 h-2 rounded-full ${isBlinking ? 'bg-emerald-500 animate-ping' : 'bg-slate-400'}`} />
            <span>{isBlinking ? 'BLINKING: ON' : 'STOP BLINKING: ACTIVE'}</span>
          </button>
        </div>
      )}
    </div>
  );
}
