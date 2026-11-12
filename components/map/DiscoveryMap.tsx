'use client';

import React, { useEffect, useRef, useState, useMemo } from 'react';
import L from 'leaflet';
import { Place } from '@/lib/types';
import { getCurrentVibeWindow, checkIsPlacePeakingNow } from '@/lib/vibeRadar';
import {
  TRANSIT_STATIONS,
  TRANSIT_LINE_TRACKS,
  TransitStation,
  TransitLineType,
  getSanctuaryTransitProfile,
  getSanctuariesNearStation,
  SmartCommutePlan,
} from '@/lib/transit';
import { Train, X, Compass, ExternalLink, Zap, MapPin } from 'lucide-react';
import TactileSliderBar from '@/components/transit/TactileSliderBar';

export type TransitFilterMode = 'all' | 'local' | 'metro' | TransitLineType;

export interface TransitLineFilterChip {
  id: TransitLineType;
  code: string;
  name: string;
  color: string;
  sliderAccent: string;
  isMetro: boolean;
}

export const TRANSIT_FILTER_CHIPS: TransitLineFilterChip[] = [
  { id: 'western', code: 'WR', name: 'Western Railway', color: '#be123c', sliderAccent: 'bg-rose-700', isMetro: false },
  { id: 'central', code: 'CR', name: 'Central Main', color: '#d97706', sliderAccent: 'bg-amber-600', isMetro: false },
  { id: 'harbour', code: 'HR', name: 'Harbour Line', color: '#2563eb', sliderAccent: 'bg-blue-600', isMetro: false },
  { id: 'metro_1', code: 'M1', name: 'Metro 1 Blue', color: '#0284c7', sliderAccent: 'bg-sky-600', isMetro: true },
  { id: 'metro_2a', code: 'M2A', name: 'Metro 2A Yellow', color: '#ca8a04', sliderAccent: 'bg-yellow-600', isMetro: true },
  { id: 'metro_7', code: 'M7', name: 'Metro 7 Red', color: '#dc2626', sliderAccent: 'bg-red-600', isMetro: true },
  { id: 'metro_3', code: 'M3', name: 'Aqua Line 3', color: '#0d9488', sliderAccent: 'bg-teal-600', isMetro: true },
  { id: 'metro_navi', code: 'NMM', name: 'Navi Mumbai', color: '#ea580c', sliderAccent: 'bg-orange-600', isMetro: true },
];

interface DiscoveryMapProps {
  places: Place[];
  userLocation: { lat: number; lng: number } | null;
  selectedPlace: Place | null;
  onSelectPlace: (place: Place) => void;
  radiusKm: number;
  showTransitOverlay?: boolean;
  onToggleTransitOverlay?: (show: boolean) => void;
  showPlacesOverlay?: boolean;
  onTogglePlacesOverlay?: (show: boolean) => void;
  transitFilterMode?: TransitFilterMode;
  selectedTransitStation?: TransitStation | null;
  onSelectTransitStation?: (station: TransitStation | null) => void;
  onOpenTransitGuide?: (station?: TransitStation, place?: Place) => void;
  activeCommutePlan?: SmartCommutePlan | null;
  onClearCommutePlan?: () => void;
  onOpenSmartCommuteModal?: () => void;
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
  showTransitOverlay = false,
  onToggleTransitOverlay,
  showPlacesOverlay = true,
  onTogglePlacesOverlay,
  transitFilterMode: externalTransitFilterMode = 'all',
  selectedTransitStation,
  onSelectTransitStation,
  onOpenTransitGuide,
  activeCommutePlan,
  onClearCommutePlan,
  onOpenSmartCommuteModal,
}: DiscoveryMapProps) {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const markersLayerRef = useRef<L.LayerGroup | null>(null);
  const transitLayerRef = useRef<L.LayerGroup | null>(null);
  const routeConnectorLayerRef = useRef<L.LayerGroup | null>(null);
  const stationBufferCircleRef = useRef<L.Circle | null>(null);
  const markerPoolRef = useRef<Map<string, L.Marker>>(new Map());
  const radiusCircleRef = useRef<L.Circle | null>(null);
  const userMarkerRef = useRef<L.Marker | null>(null);
  const prevSelectedIdRef = useRef<string | null>(null);
  const currentPlaceIdsRef = useRef<string>('');
  const onSelectPlaceRef = useRef(onSelectPlace);
  onSelectPlaceRef.current = onSelectPlace;
  const selectedPlaceRef = useRef(selectedPlace);
  selectedPlaceRef.current = selectedPlace;
  const onSelectTransitStationRef = useRef(onSelectTransitStation);
  onSelectTransitStationRef.current = onSelectTransitStation;
  const onOpenTransitGuideRef = useRef(onOpenTransitGuide);
  onOpenTransitGuideRef.current = onOpenTransitGuide;

  const [internalTransitOverlay, setInternalTransitOverlay] = useState(showTransitOverlay);
  const [internalPlacesOverlay, setInternalPlacesOverlay] = useState(showPlacesOverlay);
  const [internalTransitFilterMode, setInternalTransitFilterMode] = useState<TransitFilterMode>(externalTransitFilterMode);

  useEffect(() => {
    setInternalTransitOverlay(showTransitOverlay);
  }, [showTransitOverlay]);

  useEffect(() => {
    setInternalPlacesOverlay(showPlacesOverlay);
  }, [showPlacesOverlay]);

  useEffect(() => {
    setInternalTransitFilterMode(externalTransitFilterMode);
  }, [externalTransitFilterMode]);

  const transitFilterMode = internalTransitFilterMode;

  const handleToggleTransit = () => {
    const nextVal = !internalTransitOverlay;
    setInternalTransitOverlay(nextVal);
    onToggleTransitOverlay?.(nextVal);
  };

  const handleTogglePlaces = () => {
    const nextVal = !internalPlacesOverlay;
    setInternalPlacesOverlay(nextVal);
    onTogglePlacesOverlay?.(nextVal);
  };

  const rafIdRef = useRef<number | null>(null);

  // Viewport Culling & Isolated Destination Mode (Batched via requestAnimationFrame)
  const syncVisibleMarkers = () => {
    const map = mapInstanceRef.current;
    const layer = markersLayerRef.current;
    if (!map || !layer) return;

    // When places layer is toggled OFF, clear all place markers
    if (!internalPlacesOverlay) {
      layer.clearLayers();
      return;
    }

    const bounds = map.getBounds().pad(0.25);
    const pool = markerPoolRef.current;
    const currentSelectedId = selectedPlaceRef.current?.id;

    pool.forEach((marker, placeId) => {
      // 🎯 ISOLATED DESTINATION MODE:
      // When a sanctuary destination is selected, HIDE ALL OTHER SPOTS from the map!
      // Only keep the selected destination marker visible until deselected.
      if (currentSelectedId) {
        if (placeId === currentSelectedId) {
          if (!layer.hasLayer(marker)) layer.addLayer(marker);
        } else {
          if (layer.hasLayer(marker)) layer.removeLayer(marker);
        }
        return;
      }

      // Normal mode: viewport spatial culling
      const latLng = marker.getLatLng();
      const isVisible = bounds.contains(latLng);
      const isAttached = layer.hasLayer(marker);

      if (isVisible && !isAttached) {
        layer.addLayer(marker);
      } else if (!isVisible && isAttached) {
        layer.removeLayer(marker);
      }
    });
  };

  const scheduleSyncVisibleMarkers = () => {
    if (typeof window === 'undefined') return;
    if (rafIdRef.current !== null) {
      cancelAnimationFrame(rafIdRef.current);
    }
    rafIdRef.current = requestAnimationFrame(() => {
      syncVisibleMarkers();
      rafIdRef.current = null;
    });
  };

  const syncVisibleMarkersRef = useRef(scheduleSyncVisibleMarkers);
  syncVisibleMarkersRef.current = scheduleSyncVisibleMarkers;

  // Re-sync markers when places overlay toggle state changes
  useEffect(() => {
    syncVisibleMarkersRef.current();
  }, [internalPlacesOverlay]);

  // Initialize Map safely & bind adaptive zoom + viewport culling
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
        minZoom: 6,
        maxZoom: 19,
        maxBounds: INDIA_BOUNDS,
        maxBoundsViscosity: 0.1,
        zoomControl: false,
        preferCanvas: true,
      });

      const updateZoomClass = () => {
        if (!mapContainerRef.current) return;
        if (map.getZoom() < 14) {
          mapContainerRef.current.classList.add('map-zoom-city');
        } else {
          mapContainerRef.current.classList.remove('map-zoom-city');
        }
      };
      updateZoomClass();

      map.on('moveend', () => {
        syncVisibleMarkersRef.current();
      });
      map.on('zoomend', () => {
        updateZoomClass();
        syncVisibleMarkersRef.current();
      });

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution:
          '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
        subdomains: ['a', 'b', 'c'],
        minZoom: 6,
        maxZoom: 19,
      }).addTo(map);

      L.control.zoom({ position: 'bottomright' }).addTo(map);

      // Dedicated layers
      transitLayerRef.current = L.layerGroup().addTo(map);
      routeConnectorLayerRef.current = L.layerGroup().addTo(map);
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

  // 🚆 Render Mumbai Suburban Railway & Metro Network Overlay
  useEffect(() => {
    const map = mapInstanceRef.current;
    const transitLayer = transitLayerRef.current;
    if (!map || !transitLayer) return;

    transitLayer.clearLayers();

    if (!internalTransitOverlay) return;

    try {
      // 1. Draw Railway & Metro Tracks (Polylines) filtered by transitFilterMode
      const visibleTracks = TRANSIT_LINE_TRACKS.filter((track) => {
        if (transitFilterMode === 'all') return true;
        if (transitFilterMode === 'local') return track.id === 'western' || track.id === 'central' || track.id === 'harbour';
        if (transitFilterMode === 'metro') return track.id.startsWith('metro');
        return track.id === transitFilterMode;
      });

      visibleTracks.forEach((track) => {
        // High-contrast casing shadow line
        L.polyline(track.coordinates, {
          color: '#141518',
          weight: 4.5,
          opacity: 0.4,
          lineCap: 'round',
          lineJoin: 'round',
          interactive: false,
        }).addTo(transitLayer);

        // Core line with authentic railway corridor color
        L.polyline(track.coordinates, {
          color: track.color,
          weight: 3.5,
          opacity: 0.95,
          dashArray: track.id.startsWith('metro') ? '6, 6' : undefined,
          lineCap: 'round',
          lineJoin: 'round',
          interactive: false,
        }).addTo(transitLayer);
      });

      // 2. Draw Station Badges & Interchanges
      // In Focused Destination Mode, only show connected nearest stations to prevent visual clutter
      const relevantStationIds = selectedPlace
        ? (() => {
            const prof = getSanctuaryTransitProfile(selectedPlace.latitude, selectedPlace.longitude);
            const ids = new Set<string>([prof.nearestRailway.station.id]);
            if (prof.nearestMetro) ids.add(prof.nearestMetro.station.id);
            if (selectedTransitStation) ids.add(selectedTransitStation.id);
            return ids;
          })()
        : null;

      TRANSIT_STATIONS.forEach((station) => {
        // Filter stations according to selected transitFilterMode
        const isStationInFilter = (() => {
          if (transitFilterMode === 'all') return true;
          if (transitFilterMode === 'local') {
            return station.lines.some((l) => l === 'western' || l === 'central' || l === 'harbour');
          }
          if (transitFilterMode === 'metro') {
            return station.lines.some((l) => l.startsWith('metro'));
          }
          return station.lines.includes(transitFilterMode as TransitLineType);
        })();

        if (!isStationInFilter) return;

        // If a destination is selected, hide unrelated stations
        if (relevantStationIds && !relevantStationIds.has(station.id)) {
          return;
        }

        const isSelected = selectedTransitStation?.id === station.id;
        const isM1 = station.lines.includes('metro_1');
        const isM2A = station.lines.includes('metro_2a');
        const isM7 = station.lines.includes('metro_7');
        const isM3 = station.lines.includes('metro_3');
        const isMNavi = station.lines.includes('metro_navi');
        const isMetro = isM1 || isM2A || isM7 || isM3 || isMNavi;
        const isWR = station.lines.includes('western');
        const isCR = station.lines.includes('central');
        const isHR = station.lines.includes('harbour');
        const isMultiLine = station.lines.length > 1;

        const lineColor = isMultiLine
          ? '#0f172a'
          : isM1
          ? '#0284c7' // Metro 1 Sky Blue
          : isM2A
          ? '#ca8a04' // Metro 2A Radiant Yellow
          : isM7
          ? '#dc2626' // Metro 7 Red
          : isM3
          ? '#0d9488' // Metro 3 Aqua Teal
          : isMNavi
          ? '#ea580c' // Navi Mumbai Tangerine Orange
          : isWR
          ? '#be123c' // Western Crimson Maroon
          : isCR
          ? '#d97706' // Central Ochre Amber
          : isHR
          ? '#2563eb' // Harbour Royal Cobalt
          : '#141518';

        const lineBadge = isMultiLine
          ? 'HUB ⇄'
          : isWR
          ? 'WR'
          : isCR
          ? 'CR'
          : isHR
          ? 'HR'
          : isM1
          ? 'M1'
          : isM2A
          ? 'M2A'
          : isM7
          ? 'M7'
          : isM3
          ? 'M3'
          : isMNavi
          ? 'NMM'
          : 'TR';

        const stationHtml = `
          <div class="transit-station-pin flex flex-col items-center select-none cursor-pointer group" data-station-id="${station.id}">
            <div class="station-pill ${isSelected ? 'station-selected' : ''} px-2 py-0.5 rounded-lg border-2 border-sumi flex items-center gap-1 bg-white text-sumi hover:bg-amber-100 hover:border-vermilion transition-all font-mono whitespace-nowrap shadow-sm">
              <span class="w-2 h-2 rounded-full flex-shrink-0" style="background-color: ${lineColor};"></span>
              <span class="text-[10px] font-bold text-sumi">${station.name}</span>
              <span class="text-[8px] font-black px-1 rounded text-white" style="background-color: ${lineColor};">${lineBadge}</span>
              ${station.fast_train_stop ? '<span class="text-[8px] text-rose-600 font-black">⚡</span>' : ''}
            </div>
            <div class="w-1.5 h-1.5 rounded-full bg-sumi -mt-0.5"></div>
          </div>
        `;

        const stationIcon = L.divIcon({
          className: 'transit-station-div',
          html: stationHtml,
          iconSize: [0, 0],
          iconAnchor: [0, 0],
        });

        const marker = L.marker([station.latitude, station.longitude], {
          icon: stationIcon,
          zIndexOffset: isSelected ? 400 : 200,
        });

        marker.on('click', () => {
          onSelectTransitStationRef.current?.(station);
          map.panTo([station.latitude, station.longitude], { animate: true, duration: 0.5 });
        });

        transitLayer.addLayer(marker);
      });

      // 3. Draw Station Reachable Buffer Circle (when a station is selected)
      if (selectedTransitStation) {
        if (stationBufferCircleRef.current) {
          transitLayer.removeLayer(stationBufferCircleRef.current);
        }
        stationBufferCircleRef.current = L.circle(
          [selectedTransitStation.latitude, selectedTransitStation.longitude],
          {
            radius: 3500, // 3.5 km hop-off radius
            color: '#ff3e18',
            fillColor: '#f59e0b',
            fillOpacity: 0.07,
            weight: 2,
            dashArray: '6, 8',
          }
        ).addTo(transitLayer);
      }
    } catch (err) {
      console.warn('Error rendering transit overlay:', err);
    }
  }, [internalTransitOverlay, transitFilterMode, selectedTransitStation, selectedPlace]);

  // 🧭 Multi-Leg Commuter Route Tracing (when activeCommutePlan is set) OR direct sanctuary-to-station link
  useEffect(() => {
    const map = mapInstanceRef.current;
    const routeLayer = routeConnectorLayerRef.current;
    if (!map || !routeLayer) return;

    routeLayer.clearLayers();

    if (activeCommutePlan) {
      try {
        const origStn = activeCommutePlan.originStation;
        const destStn = activeCommutePlan.destinationStation;
        const destPlace = activeCommutePlan.destinationPlace;

        // Leg 1: User Location to Origin Station
        if (userLocation) {
          L.polyline([[userLocation.lat, userLocation.lng], [origStn.latitude, origStn.longitude]], {
            color: '#059669',
            weight: 3.5,
            dashArray: '6, 8',
            opacity: 0.85,
          }).addTo(routeLayer);
        }

        // Leg 2: Rail track between Origin & Destination Station
        if (origStn.id !== destStn.id) {
          L.polyline([[origStn.latitude, origStn.longitude], [destStn.latitude, destStn.longitude]], {
            color: '#141518',
            weight: 6,
            opacity: 0.4,
          }).addTo(routeLayer);

          L.polyline([[origStn.latitude, origStn.longitude], [destStn.latitude, destStn.longitude]], {
            color: '#ff3e18',
            weight: 4,
            opacity: 0.95,
          }).addTo(routeLayer);
        }

        // Leg 3: Destination Station to Sanctuary
        L.polyline([[destStn.latitude, destStn.longitude], [destPlace.latitude, destPlace.longitude]], {
          color: '#ff3e18',
          weight: 3.5,
          dashArray: '5, 7',
          className: 'commute-route-connector',
          opacity: 0.9,
        }).addTo(routeLayer);

        // Fit map bounds to show complete trip
        const bounds = L.latLngBounds([
          [origStn.latitude, origStn.longitude],
          [destPlace.latitude, destPlace.longitude],
        ]);
        if (userLocation) {
          bounds.extend([userLocation.lat, userLocation.lng]);
        }
        map.fitBounds(bounds, { padding: [80, 80], maxZoom: 15 });
        return;
      } catch (err) {
        console.warn('Error tracing smart commute plan:', err);
      }
    }

    if (!selectedPlace) return;

    try {
      const transitProfile = getSanctuaryTransitProfile(selectedPlace.latitude, selectedPlace.longitude);
      const stn = transitProfile.nearestRailway.station;

      // Dashed commuter connector line between destination and nearest station
      const lineCoords: [number, number][] = [
        [selectedPlace.latitude, selectedPlace.longitude],
        [stn.latitude, stn.longitude],
      ];

      L.polyline(lineCoords, {
        color: '#ff3e18',
        weight: 3,
        dashArray: '6, 8',
        className: 'commute-route-connector',
        opacity: 0.9,
      }).addTo(routeLayer);
    } catch (err) {
      console.warn('Error drawing transit connector route:', err);
    }
  }, [selectedPlace, activeCommutePlan, userLocation]);

  // Rebuild Place Markers ONLY when the filtered places list ACTUALLY changes
  useEffect(() => {
    const map = mapInstanceRef.current;
    const layer = markersLayerRef.current;
    if (!map || !layer) return;

    const newIds = places.map((p) => p.id).join(',');
    if (newIds === currentPlaceIdsRef.current && layer.getLayers().length > 0) {
      return;
    }
    currentPlaceIdsRef.current = newIds;

    try {
      layer.clearLayers();
      const newPool = new Map<string, L.Marker>();
      const { window: currentWindow } = getCurrentVibeWindow();

      places.forEach((place) => {
        const isSelected = selectedPlace?.id === place.id;
        const theme = CATEGORY_COLORS[place.category] || { dot: '#ff3e18', border: '#e52c07', bg: '#fff1ee' };
        const isPeaking = checkIsPlacePeakingNow(place, currentWindow).isPeaking;
        
        const displayName = place.short_name || place.name.split(' ')[0] + ' ' + (place.name.split(' ')[1] || '');

        const tierBadge =
          place.spot_tier === 'iconic'
            ? '★'
            : place.spot_tier === 'hidden_gem'
            ? '✦'
            : '●';

        const markerHtml = `
          <div id="pin-${place.id}" class="custom-pin cursor-pointer flex flex-col items-center group -translate-x-1/2 -translate-y-full pointer-events-auto select-none" data-place-id="${place.id}">
            <div class="origin-bottom flex flex-col items-center group-hover:-translate-y-1 group-hover:scale-105 transition-transform duration-100 ease-out">
              <div class="pin-pill ${isSelected ? 'pin-selected' : ''} px-2.5 py-1 rounded-xl border-2 border-sumi flex items-center gap-1.5 shadow-riso-sm font-sans whitespace-nowrap bg-wabi text-sumi group-hover:bg-white group-hover:border-vermilion transition-colors duration-100">
                <span class="w-2.5 h-2.5 rounded-full flex-shrink-0 relative flex items-center justify-center" style="background-color: ${theme.dot};">
                  ${isPeaking ? `<span class="absolute w-3.5 h-3.5 rounded-full border border-emerald-500 bg-emerald-500/25"></span>` : ''}
                </span>
                <span class="pin-label text-xs font-bold tracking-normal">${displayName}</span>
                <span class="pin-tier text-xs font-mono font-bold opacity-80">${tierBadge}</span>
                ${isPeaking ? `<span class="pin-tier text-[10px] text-emerald-600 font-bold" title="Peaking Now">⚡</span>` : ''}
              </div>

              <div class="pin-tail ${isSelected ? 'tail-selected' : ''} w-2 h-2 rotate-45 -mt-1 border-r-2 border-b-2 shadow-sm border-sumi bg-wabi group-hover:border-vermilion group-hover:bg-white transition-colors duration-100"></div>
            </div>

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

        newPool.set(place.id, marker);
      });

      markerPoolRef.current = newPool;
      syncVisibleMarkers();
    } catch (err) {
      console.warn('Error updating markers:', err);
    }
  }, [places]);

  // Fast 0ms selected marker visual toggle without destroying Leaflet layers
  useEffect(() => {
    const prevId = prevSelectedIdRef.current;
    const currentId = selectedPlace?.id || null;
    selectedPlaceRef.current = selectedPlace;

    // Immediately trigger syncVisibleMarkers to isolate or restore all sanctuary pins
    syncVisibleMarkersRef.current();

    if (prevId) {
      const prevEl = document.getElementById(`pin-${prevId}`);
      if (prevEl) {
        prevEl.querySelector('.pin-pill')?.classList.remove('pin-selected');
        prevEl.querySelector('.pin-tail')?.classList.remove('tail-selected');
      }
    }

    if (currentId) {
      const marker = markerPoolRef.current.get(currentId);
      if (marker && markersLayerRef.current && !markersLayerRef.current.hasLayer(marker)) {
        markersLayerRef.current.addLayer(marker);
      }
      const currEl = document.getElementById(`pin-${currentId}`);
      if (currEl) {
        currEl.querySelector('.pin-pill')?.classList.add('pin-selected');
        currEl.querySelector('.pin-tail')?.classList.add('tail-selected');
      }
    }

    prevSelectedIdRef.current = currentId;
  }, [selectedPlace]);

  // Smoothly center & fit bounds when selectedPlace changes
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map) return;

    if (!selectedPlace) {
      map.invalidateSize();
      syncVisibleMarkersRef.current();
      return;
    }

    try {
      const transitProfile = getSanctuaryTransitProfile(selectedPlace.latitude, selectedPlace.longitude);
      const stn = transitProfile.nearestRailway.station;

      // Fit bounds to show BOTH the destination sanctuary AND its nearest transit station
      const bounds = L.latLngBounds([
        [selectedPlace.latitude, selectedPlace.longitude],
        [stn.latitude, stn.longitude],
      ]);

      const isDesktop = typeof window !== 'undefined' && window.innerWidth >= 768;

      map.fitBounds(bounds, {
        paddingTopLeft: [70, 70],
        paddingBottomRight: isDesktop ? [480, 70] : [70, 260],
        maxZoom: 16,
        animate: true,
      });
    } catch (err) {
      map.panTo([selectedPlace.latitude, selectedPlace.longitude], {
        animate: true,
        duration: 0.5,
      });
    }
  }, [selectedPlace]);

  // Reachable count for currently selected transit station
  const stationReachableCount = useMemo(() => {
    if (!selectedTransitStation) return 0;
    return getSanctuariesNearStation(selectedTransitStation, places, 3500).length;
  }, [selectedTransitStation, places]);

  return (
    <div className="relative w-full h-full min-h-[400px]">
      <div ref={mapContainerRef} className="w-full h-full min-h-[400px] z-0" style={{ minHeight: '100%' }} />

      {/* Floating Active Commute Route Banner (Top-center) */}
      {activeCommutePlan && (
        <div className="absolute top-16 left-1/2 -translate-x-1/2 bg-sumi text-wabi rounded-2xl border-2 border-sumi shadow-riso px-3.5 py-2 sm:px-4 sm:py-2.5 flex items-center gap-2.5 sm:gap-4 z-30 font-mono text-xs max-w-[95vw] animate-in fade-in slide-in-from-top-3">
          <div className="flex items-center gap-2 min-w-0">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse flex-shrink-0" />
            <div className="truncate">
              <span className="font-bold text-amber-300">
                📍 {activeCommutePlan.originStation.name} ➔ 🚆 {activeCommutePlan.destinationStation.name} ➔ 🎯 {activeCommutePlan.destinationPlace.name}
              </span>
            </div>
            <span className="hidden md:inline-block px-2 py-0.5 rounded bg-amber-400 text-sumi font-black text-[10px]">
              ⏱️ ~{activeCommutePlan.totalDurationMinutes}m
            </span>
          </div>

          <div className="flex items-center gap-2 flex-shrink-0">
            <button
              onClick={onOpenSmartCommuteModal}
              className="px-3 py-1 bg-vermilion text-white font-bold rounded-xl hover:bg-rose-600 transition-colors text-[11px] flex items-center gap-1 shadow-sm"
            >
              <span>ITINERARY</span>
              <ExternalLink className="w-3 h-3" />
            </button>
            <button
              onClick={onClearCommutePlan}
              className="p-1 hover:bg-white/10 rounded-lg text-slate-400 hover:text-white transition-colors"
              title="Clear journey"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Floating Isolated Destination Focus Badge */}
      {selectedPlace && (
        <div className="absolute top-4 left-4 z-20 animate-in fade-in slide-in-from-top-2">
          <div className="flex items-center gap-2.5 bg-sumi/95 text-wabi backdrop-blur-md px-3.5 py-2 rounded-2xl border-2 border-sumi shadow-riso font-mono text-xs max-w-[90vw]">
            <span className="w-2.5 h-2.5 rounded-full bg-vermilion animate-pulse flex-shrink-0" />
            <div className="truncate">
              <span className="text-slate-400 text-[10px] uppercase font-bold block">
                FOCUSED DESTINATION
              </span>
              <span className="font-bold text-amber-300 text-xs sm:text-sm truncate block">
                {selectedPlace.name}
              </span>
            </div>
            <button
              onClick={() => onSelectPlace(null as any)}
              className="ml-1 px-2.5 py-1 rounded-xl bg-wabi/10 hover:bg-vermilion hover:text-white text-slate-300 border border-white/20 transition-all font-bold text-[11px] flex items-center gap-1 flex-shrink-0"
              title="Show all Mumbai sanctuaries"
            >
              <span>SHOW ALL PLACES</span>
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}

      {/* Floating Places & Transit Layer Pure ON/OFF Toggle Buttons (Bottom-left, zero clutter) */}
      <div className="absolute bottom-6 left-4 z-20 flex items-center gap-2">
        <button
          onClick={handleTogglePlaces}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border-2 border-sumi shadow-riso-sm font-mono text-xs font-bold transition-all active:scale-95 ${
            internalPlacesOverlay
              ? 'bg-emerald-400 text-sumi hover:bg-emerald-300'
              : 'bg-wabi/90 backdrop-blur-md text-slate-600 hover:bg-white hover:text-sumi'
          }`}
          title="Toggle hidden sanctuary pins on the map"
        >
          <MapPin className="w-3.5 h-3.5 text-sumi" />
          <span>SPOTS: {internalPlacesOverlay ? 'ON' : 'OFF'}</span>
        </button>

        <button
          onClick={handleToggleTransit}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border-2 border-sumi shadow-riso-sm font-mono text-xs font-bold transition-all active:scale-95 ${
            internalTransitOverlay
              ? 'bg-amber-400 text-sumi hover:bg-amber-300'
              : 'bg-wabi/90 backdrop-blur-md text-slate-600 hover:bg-white hover:text-sumi'
          }`}
          title="Toggle Mumbai Local Train & Metro station overlay on map"
        >
          <Train className="w-3.5 h-3.5 text-rose-600" />
          <span>TRANSIT: {internalTransitOverlay ? 'ON' : 'OFF'}</span>
        </button>

        {internalTransitOverlay && transitFilterMode !== 'all' && (
          <div className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl border-2 border-sumi bg-sumi text-wabi shadow-riso-sm font-mono text-[11px] font-bold animate-in fade-in">
            <span
              className="w-2 h-2 rounded-full border border-white/50 flex-shrink-0"
              style={{
                backgroundColor:
                  TRANSIT_FILTER_CHIPS.find((c) => c.id === transitFilterMode)?.color || '#ea580c',
              }}
            />
            <span>
              {transitFilterMode === 'local' && '🚆 Locals'}
              {transitFilterMode === 'metro' && '🚇 Metros'}
              {TRANSIT_FILTER_CHIPS.find((c) => c.id === transitFilterMode)?.code}
            </span>
          </div>
        )}
      </div>

      {/* Floating Station Hub HUD (Appears when a railway or metro station is selected) */}
      {selectedTransitStation && (
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 bg-wabi/95 backdrop-blur-md border-2 border-sumi rounded-2xl shadow-riso px-3.5 py-2 sm:px-4 sm:py-2.5 flex items-center gap-2 sm:gap-3 z-30 font-mono text-xs max-w-[95vw] animate-in fade-in slide-in-from-bottom-2">
          <div className="flex items-center gap-2 min-w-0">
            <span className="w-2.5 h-2.5 rounded-full bg-vermilion animate-pulse flex-shrink-0" />
            <div className="truncate">
              <span className="font-bold text-sumi text-xs sm:text-sm">
                🚆 {selectedTransitStation.name}
              </span>
              {selectedTransitStation.marathi_name && (
                <span className="font-marathi text-slate-700 font-medium text-xs ml-1 hidden xs:inline">
                  ({selectedTransitStation.marathi_name})
                </span>
              )}
              <span className="text-slate-500 text-[11px] ml-1.5 hidden sm:inline">
                ({selectedTransitStation.lines.join('/')}) · {stationReachableCount} spots within 3.5km
              </span>
            </div>
          </div>

          <div className="flex items-center gap-1.5 flex-shrink-0">
            <button
              onClick={() => onOpenTransitGuide?.(selectedTransitStation)}
              className="px-2.5 py-1 sm:px-3 sm:py-1.5 bg-sumi text-wabi hover:bg-vermilion rounded-xl font-bold text-[10px] sm:text-xs transition-colors flex items-center gap-1 shadow-riso-sm"
              title="Open full transit blueprint for this station"
            >
              <span>GUIDE</span>
              <ExternalLink className="w-3 h-3 text-amber-300" />
            </button>
            <button
              onClick={() => onSelectTransitStation?.(null)}
              className="p-1 sm:p-1.5 hover:bg-sumi/10 rounded-lg text-slate-500 hover:text-sumi font-bold transition-colors"
              title="Deselect station"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
