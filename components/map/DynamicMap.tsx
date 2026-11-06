'use client';

import dynamic from 'next/dynamic';
import React, { Component, ReactNode } from 'react';
import { Place } from '@/lib/types';
import { TransitStation } from '@/lib/transit';
import { AlertCircle, RefreshCw } from 'lucide-react';

interface DynamicMapProps {
  places: Place[];
  userLocation: { lat: number; lng: number } | null;
  selectedPlace: Place | null;
  onSelectPlace: (place: Place) => void;
  radiusKm: number;
  showTransitOverlay?: boolean;
  onToggleTransitOverlay?: (show: boolean) => void;
  selectedTransitStation?: TransitStation | null;
  onSelectTransitStation?: (station: TransitStation | null) => void;
  onOpenTransitGuide?: (station?: TransitStation, place?: Place) => void;
}

// Error Boundary to prevent any client-side Leaflet exception from white-screening the page
class MapErrorBoundary extends Component<{ children: ReactNode }, { hasError: boolean }> {
  constructor(props: { children: ReactNode }) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error: any, errorInfo: any) {
    console.error('Leaflet Map Error caught by boundary:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="w-full h-full min-h-[400px] flex flex-col items-center justify-center bg-wabi p-6 text-center border-2 border-dashed border-sumi/20 rounded-2xl">
          <AlertCircle className="w-10 h-10 text-vermilion mb-2" />
          <h3 className="font-display font-bold text-lg tracking-wide text-sumi">Map Preview Unavailable</h3>
          <p className="text-sm text-slate-600 max-w-sm mt-1 mb-4 font-sans">
            The interactive map canvas encountered a rendering conflict. You can switch to the Zine Lookbook view to browse all Mumbai sanctuaries.
          </p>
          <button
            onClick={() => this.setState({ hasError: false })}
            className="flex items-center gap-1.5 px-3.5 py-2 bg-sumi text-wabi rounded-xl text-xs font-mono font-bold hover:bg-vermilion transition-colors shadow-riso-sm"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Reload Map Canvas</span>
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}

const DiscoveryMap = dynamic(() => import('./DiscoveryMap'), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full min-h-[400px] flex flex-col items-center justify-center bg-wabi text-slate-500 gap-3">
      <div className="w-8 h-8 border-4 border-vermilion border-t-transparent rounded-full animate-spin"></div>
      <p className="text-xs font-mono font-bold text-sumi uppercase tracking-wider">
        Loading Mumbai Sanctuary Map...
      </p>
    </div>
  ),
});

export default function DynamicMap(props: DynamicMapProps) {
  return (
    <MapErrorBoundary>
      <DiscoveryMap {...props} />
    </MapErrorBoundary>
  );
}
