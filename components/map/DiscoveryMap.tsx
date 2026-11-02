'use client';

import React, { useEffect, useRef } from 'react';
import L from 'leaflet';
import { Place } from '@/lib/types';

interface DiscoveryMapProps {
  places: Place[];
  userLocation: { lat: number; lng: number } | null;
  selectedPlace: Place | null;
  onSelectPlace: (place: Place) => void;
  radiusKm: number;
}

// Indo-Japanese earthy & vibrant palette
const CATEGORY_COLORS: Record<string, { bg: string; text: string; kanji: string }> = {
  viewpoint: { bg: '#ff3e18', text: '#ffffff', kanji: '景' }, // Vermilion / View
  ruin_historic: { bg: '#173664', text: '#ffffff', kanji: '城' }, // Cobalt / Fort
  historical: { bg: '#8b4513', text: '#ffffff', kanji: '古' }, // Rust / Ancient
  nature_forest: { bg: '#2d5339', text: '#ffffff', kanji: '森' }, // Matcha / Forest
  scenic: { bg: '#cf9866', text: '#141518', kanji: '山' }, // Ochre / Nature
  quiet_chill: { bg: '#4a5d4e', text: '#ffffff', kanji: '静' }, // Sage / Quiet
  waterfront: { bg: '#1f6e8c', text: '#ffffff', kanji: '水' }, // Deep Water
  hidden_gem: { bg: '#ff3e18', text: '#ffffff', kanji: '秘' }, // Secret
};

export default function DiscoveryMap({
  places,
  userLocation,
  selectedPlace,
  onSelectPlace,
  radiusKm,
}: DiscoveryMapProps) {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const markersLayerRef = useRef<L.LayerGroup | null>(null);
  const radiusCircleRef = useRef<L.Circle | null>(null);
  const userMarkerRef = useRef<L.Marker | null>(null);

  // Initialize Map
  useEffect(() => {
    if (!mapContainerRef.current || mapInstanceRef.current) return;

    // Default to Mumbai center
    const initialLat = userLocation?.lat || 19.0418;
    const initialLng = userLocation?.lng || 72.8398;

    const map = L.map(mapContainerRef.current, {
      center: [initialLat, initialLng],
      zoom: 12,
      zoomControl: false,
    });

    // Free OpenStreetMap Standard Tiles (No API key required)
    L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution:
        '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      maxZoom: 19,
    }).addTo(map);

    L.control.zoom({ position: 'bottomright' }).addTo(map);

    markersLayerRef.current = L.layerGroup().addTo(map);
    mapInstanceRef.current = map;

    // Trigger size calculation after DOM render
    setTimeout(() => {
      map.invalidateSize();
    }, 100);

    return () => {
      map.remove();
      mapInstanceRef.current = null;
    };
  }, []);

  // Update User Location Marker & Radius
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map || !userLocation) return;

    const userIcon = L.divIcon({
      className: 'user-location-pin',
      html: `
        <div class="relative flex items-center justify-center w-10 h-10">
          <div class="absolute w-10 h-10 bg-vermilion rounded-full opacity-25 animate-ping"></div>
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

    // Radius circle in dark sumi dashed line
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
  }, [userLocation, radiusKm]);

  // Update Place Markers (Japanese Hanko Stamp / Riso Style)
  useEffect(() => {
    const map = mapInstanceRef.current;
    const layer = markersLayerRef.current;
    if (!map || !layer) return;

    layer.clearLayers();

    places.forEach((place) => {
      const isSelected = selectedPlace?.id === place.id;
      const theme = CATEGORY_COLORS[place.category] || { bg: '#ff3e18', text: '#fff', kanji: '秘' };

      const markerHtml = `
        <div class="custom-pin cursor-pointer flex flex-col items-center group transition-transform duration-200">
          <div class="relative flex items-center justify-center ${
            isSelected ? 'scale-125 z-50' : ''
          }">
            <!-- Hanko Stamp Box -->
            <div class="px-1.5 py-1 rounded-lg border-2 border-sumi flex items-center gap-1 shadow-riso-sm transition-all"
                 style="background-color: ${isSelected ? '#ffffff' : theme.bg}; color: ${isSelected ? '#141518' : theme.text};">
              <span class="text-[10px] font-black font-serif">${theme.kanji}</span>
              <span class="text-[10px] font-mono font-bold">
                ${Math.round(place.hiddenness_score * 100)}%
              </span>
            </div>
            <!-- Pin Pointer Tail -->
            <div class="w-1.5 h-1.5 rotate-45 -mt-1 border-r border-b border-sumi shadow-sm"
                 style="background-color: ${isSelected ? '#ffffff' : theme.bg}"></div>
          </div>
        </div>
      `;

      const customIcon = L.divIcon({
        className: 'place-marker-icon',
        html: markerHtml,
        iconSize: [48, 48],
        iconAnchor: [24, 40],
      });

      const marker = L.marker([place.latitude, place.longitude], {
        icon: customIcon,
      });

      marker.on('click', () => {
        onSelectPlace(place);
        map.panTo([place.latitude, place.longitude], { animate: true, duration: 0.5 });
      });

      marker.addTo(layer);
    });
  }, [places, selectedPlace, onSelectPlace]);

  // Pan to selected place
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map || !selectedPlace) return;
    map.panTo([selectedPlace.latitude, selectedPlace.longitude], {
      animate: true,
      duration: 0.6,
    });
  }, [selectedPlace]);

  return (
    <div className="relative w-full h-full min-h-[400px]">
      <div ref={mapContainerRef} className="w-full h-full min-h-[400px] z-0" style={{ minHeight: '100%' }} />
    </div>
  );
}
