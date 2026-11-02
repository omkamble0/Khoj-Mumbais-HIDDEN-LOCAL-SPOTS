'use client';

import dynamic from 'next/dynamic';
import React from 'react';
import { Place } from '@/lib/types';

interface DynamicMapProps {
  places: Place[];
  userLocation: { lat: number; lng: number } | null;
  selectedPlace: Place | null;
  onSelectPlace: (place: Place) => void;
  radiusKm: number;
}

const DiscoveryMap = dynamic(() => import('./DiscoveryMap'), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full flex flex-col items-center justify-center bg-slate-100 text-slate-500 gap-3">
      <div className="w-8 h-8 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
      <p className="text-sm font-medium">Loading Mumbai exploration map...</p>
    </div>
  ),
});

export default function DynamicMap(props: DynamicMapProps) {
  return <DiscoveryMap {...props} />;
}
