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

const CATEGORY_STYLES: Record<string, { bg: string; text: string; label: string }> = {
  viewpoint: { bg: '#ff3e18', text: '#ffffff', label: 'VIEW' },
  ruin_historic: { bg: '#173664', text: '#ffffff', label: 'FORT' },
  historical: { bg: '#8b4513', text: '#ffffff', label: 'HERITAGE' },
  nature_forest: { bg: '#2d5339', text: '#ffffff', label: 'FOREST' },
  scenic: { bg: '#cf9866', text: '#141518', label: 'SCENIC' },
  quiet_chill: { bg: '#3a5043', text: '#ffffff', label: 'CALM' },
  waterfront: { bg: '#1f6e8c', text: '#ffffff', label: 'COAST' },
  hidden_gem: { bg: '#ff3e18', text: '#ffffff', label: 'SECRET' },
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

  // Initialize Map safely (immune to StrictMode double mount)
  useEffect(() => {
    if (!mapContainerRef.current) return;
    if (mapInstanceRef.current) return;

    try {
      // Clear any lingering leaflet instance id
      if ((mapContainerRef.current as any)._leaflet_id) {
        (mapContainerRef.current as any)._leaflet_id = null;
      }

      const initialLat = userLocation?.lat || 19.0418;
      const initialLng = userLocation?.lng || 72.8398;

      const map = L.map(mapContainerRef.current, {
        center: [initialLat, initialLng],
        zoom: 12,
        zoomControl: false,
      });

      L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution:
          '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
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

  // Update Place Markers in Kaluk Sans English
  useEffect(() => {
    const map = mapInstanceRef.current;
    const layer = markersLayerRef.current;
    if (!map || !layer) return;

    try {
      layer.clearLayers();

      places.forEach((place) => {
        const isSelected = selectedPlace?.id === place.id;
        const theme = CATEGORY_STYLES[place.category] || { bg: '#ff3e18', text: '#fff', label: 'SPOT' };

        const markerHtml = `
          <div class="custom-pin cursor-pointer flex flex-col items-center group transition-transform duration-200">
            <div class="relative flex items-center justify-center ${
              isSelected ? 'scale-125 z-50' : ''
            }">
              <div class="px-2 py-0.5 rounded-lg border-2 border-sumi flex items-center gap-1 shadow-riso-sm transition-all font-kaluk"
                   style="background-color: ${isSelected ? '#ffffff' : theme.bg}; color: ${isSelected ? '#141518' : theme.text};">
                <span class="text-[9px] font-bold tracking-wider">${theme.label}</span>
                <span class="text-[10px] font-mono font-black border-l border-current/30 pl-1">
                  ${Math.round(place.hiddenness_score * 100)}%
                </span>
              </div>
              <div class="w-1.5 h-1.5 rotate-45 -mt-1 border-r border-b border-sumi shadow-sm"
                   style="background-color: ${isSelected ? '#ffffff' : theme.bg}"></div>
            </div>
          </div>
        `;

        const customIcon = L.divIcon({
          className: 'place-marker-icon',
          html: markerHtml,
          iconSize: [60, 48],
          iconAnchor: [30, 40],
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
    } catch (err) {
      console.warn('Error updating markers:', err);
    }
  }, [places, selectedPlace, onSelectPlace]);

  // Pan to selected place
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map || !selectedPlace) return;
    try {
      map.panTo([selectedPlace.latitude, selectedPlace.longitude], {
        animate: true,
        duration: 0.6,
      });
    } catch (err) {
      console.warn('Error panning map:', err);
    }
  }, [selectedPlace]);

  return (
    <div className="relative w-full h-full min-h-[400px]">
      <div ref={mapContainerRef} className="w-full h-full min-h-[400px] z-0" style={{ minHeight: '100%' }} />
    </div>
  );
}
