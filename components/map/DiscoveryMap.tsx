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

// Map category to color scheme
const CATEGORY_COLORS: Record<string, string> = {
  viewpoint: '#f59e0b', // Amber
  ruin_historic: '#8b5cf6', // Violet
  historical: '#6366f1', // Indigo
  nature_forest: '#10b981', // Emerald
  scenic: '#06b6d4', // Cyan
  quiet_chill: '#14b8a6', // Teal
  waterfront: '#3b82f6', // Blue
  hidden_gem: '#ec4899', // Pink
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

    // Clean, modern, free raster tiles: CartoDB Voyager
    L.tileLayer(
      'https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png',
      {
        attribution:
          '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="https://carto.com/attributions">CARTO</a>',
        subdomains: 'abcd',
        maxZoom: 19,
      }
    ).addTo(map);

    // Reposition zoom controls to bottom-right
    L.control.zoom({ position: 'bottomright' }).addTo(map);

    markersLayerRef.current = L.layerGroup().addTo(map);
    mapInstanceRef.current = map;

    return () => {
      map.remove();
      mapInstanceRef.current = null;
    };
  }, []);

  // Update User Location Marker & Radius Circle
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map || !userLocation) return;

    // Pulse animation user marker
    const userIcon = L.divIcon({
      className: 'user-location-pin',
      html: `
        <div class="relative flex items-center justify-center w-8 h-8">
          <div class="absolute w-8 h-8 bg-blue-500 rounded-full opacity-30 animate-ping"></div>
          <div class="w-4 h-4 bg-blue-600 border-2 border-white rounded-full shadow-lg"></div>
        </div>
      `,
      iconSize: [32, 32],
      iconAnchor: [16, 16],
    });

    if (userMarkerRef.current) {
      userMarkerRef.current.setLatLng([userLocation.lat, userLocation.lng]);
    } else {
      userMarkerRef.current = L.marker([userLocation.lat, userLocation.lng], {
        icon: userIcon,
        zIndexOffset: 1000,
      }).addTo(map);
    }

    // Draw radius boundary
    if (radiusCircleRef.current) {
      radiusCircleRef.current.setLatLng([userLocation.lat, userLocation.lng]);
      radiusCircleRef.current.setRadius(radiusKm * 1000);
    } else {
      radiusCircleRef.current = L.circle([userLocation.lat, userLocation.lng], {
        radius: radiusKm * 1000,
        color: '#3b82f6',
        fillColor: '#3b82f6',
        fillOpacity: 0.05,
        weight: 1.5,
        dashArray: '4, 8',
      }).addTo(map);
    }
  }, [userLocation, radiusKm]);

  // Update Place Markers
  useEffect(() => {
    const map = mapInstanceRef.current;
    const layer = markersLayerRef.current;
    if (!map || !layer) return;

    layer.clearLayers();

    places.forEach((place) => {
      const isSelected = selectedPlace?.id === place.id;
      const color = CATEGORY_COLORS[place.category] || '#10b981';

      const markerHtml = `
        <div class="custom-pin cursor-pointer flex flex-col items-center group transition-transform duration-200">
          <div class="relative flex items-center justify-center ${
            isSelected ? 'scale-125 z-50' : ''
          }">
            <div class="w-8 h-8 rounded-full shadow-md flex items-center justify-center border-2 ${
              isSelected ? 'border-slate-900 bg-white ring-4 ring-emerald-400' : 'border-white'
            }" style="background-color: ${isSelected ? '#ffffff' : color}">
              <span class="text-xs font-bold ${isSelected ? 'text-slate-900' : 'text-white'}">
                ${Math.round(place.hiddenness_score * 100)}%
              </span>
            </div>
            <div class="w-1.5 h-1.5 rotate-45 -mt-1 shadow-sm" style="background-color: ${
              isSelected ? '#0f172a' : color
            }"></div>
          </div>
        </div>
      `;

      const customIcon = L.divIcon({
        className: 'place-marker-icon',
        html: markerHtml,
        iconSize: [36, 44],
        iconAnchor: [18, 40],
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

  // Pan to selected place when updated from list
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map || !selectedPlace) return;
    map.panTo([selectedPlace.latitude, selectedPlace.longitude], {
      animate: true,
      duration: 0.6,
    });
  }, [selectedPlace]);

  return (
    <div className="relative w-full h-full">
      <div ref={mapContainerRef} className="w-full h-full z-0" />
    </div>
  );
}
