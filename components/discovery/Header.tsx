'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Compass, LocateFixed, Search, Map, LayoutGrid, Heart, Dices, Train } from 'lucide-react';
import FilterBar from './FilterBar';
import { FilterState } from '@/lib/types';
import TactileSliderBar from '@/components/transit/TactileSliderBar';

interface HeaderProps {
  currentCity: string;
  onLocateMe: () => void;
  isLocating: boolean;
  searchQuery: string;
  onSearchChange: (q: string) => void;
  viewMode: 'map' | 'zine' | 'transit';
  onToggleView: (mode: 'map' | 'zine' | 'transit') => void;
  totalSpots: number;
  savedCount: number;
  onOpenSaved: () => void;
  onOpenRoulette: () => void;
  filters?: FilterState;
  onFilterChange?: (updated: Partial<FilterState>) => void;
  showPlacesOverlay?: boolean;
  onTogglePlacesOverlay?: () => void;
  showTransitOverlay?: boolean;
  onToggleTransitOverlay?: (show: boolean) => void;
}

export default function Header({
  currentCity,
  onLocateMe,
  isLocating,
  searchQuery,
  onSearchChange,
  viewMode,
  onToggleView,
  totalSpots,
  savedCount,
  onOpenSaved,
  onOpenRoulette,
  filters,
  onFilterChange,
  showPlacesOverlay,
  onTogglePlacesOverlay,
  showTransitOverlay,
  onToggleTransitOverlay,
}: HeaderProps) {
  const [localQuery, setLocalQuery] = useState(searchQuery);
  const ribbonContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setLocalQuery(searchQuery);
  }, [searchQuery]);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (localQuery !== searchQuery) {
        onSearchChange(localQuery);
      }
    }, 120);
    return () => clearTimeout(timer);
  }, [localQuery, searchQuery, onSearchChange]);

  return (
    <header className="relative w-full border-b-2 border-sumi shadow-sm font-sans flex-shrink-0 bg-wabi z-30 select-none">
      {/* ─────────────────────────────────────────────────────────────
          TIER 1: Compact Streamlined Brand, Search & Quick Actions
          - Single unified row across mobile and desktop
          - Ultra-low vertical footprint to maximize map & cards view
          ───────────────────────────────────────────────────────────── */}
      <div 
        className="relative w-full bg-cover bg-center overflow-hidden border-b border-sumi/15"
        style={{ backgroundImage: `url('/images/mumbai_art_and_culture_banner_hd.png')` }}
      >
        <div className="w-full bg-sumi/5 px-2 sm:px-4 py-1 sm:py-1.5">
          <div className="max-w-7xl mx-auto flex items-center justify-between gap-1.5 sm:gap-3">
            {/* 1. Brand Pill (Compact on Mobile, Full on Desktop) */}
            <a 
              href="/" 
              className="flex items-center gap-1 sm:gap-2 bg-wabi/95 hover:bg-white backdrop-blur-md px-1.5 sm:px-2.5 py-0.5 sm:py-1 rounded-xl border-2 border-sumi shadow-2xs flex-shrink-0 group active:scale-95 transition-transform"
              title="KHOJ Mumbai - Discover Hidden & Underrated Sanctuaries"
            >
              <div className="w-6 h-6 sm:w-7 sm:h-7 rounded-lg bg-vermilion flex items-center justify-center text-white border border-sumi shadow-xs flex-shrink-0 group-hover:scale-105 transition-transform">
                <Compass className="w-3.5 h-3.5 text-white" />
              </div>
              <div className="flex items-center gap-1">
                <span className="font-ananda font-bold text-base sm:text-lg text-sumi leading-none">
                  KHOJ<span className="text-vermilion">.</span>
                </span>
                <span className="hidden sm:inline font-marathi text-xs text-slate-700 leading-none">खोज</span>
                <span className="hidden md:inline px-1 py-0.2 rounded text-[8px] font-mono font-black bg-sumi text-wabi uppercase">
                  MUMBAI
                </span>
              </div>
            </a>

            {/* 2. Responsive Search Bar (Fills remaining horizontal space) */}
            <div className="flex-1 max-w-lg min-w-0">
              <div className="relative group">
                <Search className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-vermilion transition-colors" />
                <input
                  type="text"
                  value={localQuery}
                  onChange={(e) => setLocalQuery(e.target.value)}
                  placeholder="Search 464 spots, ruins, cafes..."
                  className="w-full pl-8 pr-7 py-0.5 sm:py-1 text-xs font-sans font-medium bg-white hover:bg-white focus:bg-white rounded-xl border-2 border-sumi focus:outline-none shadow-2xs focus:shadow-riso-red text-sumi placeholder-slate-400 transition-all truncate"
                />
                {localQuery && (
                  <button
                    onClick={() => {
                      setLocalQuery('');
                      onSearchChange('');
                    }}
                    className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 hover:text-sumi font-mono text-xs font-bold p-0.5"
                    title="Clear search"
                  >
                    ✕
                  </button>
                )}
              </div>
            </div>

            {/* 3. Action Pills (Compact icon buttons on Mobile, labeled pills on Desktop) */}
            <div className="flex items-center gap-1 sm:gap-1.5 flex-shrink-0">
              <button
                type="button"
                onClick={onOpenRoulette}
                className="p-1 sm:px-2.5 sm:py-1 bg-vermilion hover:bg-vermilion/90 text-white border-2 border-sumi rounded-xl shadow-2xs text-xs font-mono font-bold active:scale-95 transition-transform flex items-center gap-1"
                title="Roll Rasta Roulette for a random sanctuary"
                aria-label="Roll Rasta Roulette"
              >
                <Dices className="w-3.5 h-3.5 text-white" />
                <span className="hidden lg:inline">ROULETTE 🎲</span>
              </button>

              <button
                type="button"
                onClick={onOpenSaved}
                className="flex items-center gap-1 px-1.5 py-1 sm:px-2.5 bg-wabi/95 hover:bg-white border-2 border-sumi rounded-xl shadow-2xs text-xs font-mono font-bold text-sumi active:scale-95 transition-transform"
                title="Saved sanctuaries"
              >
                <Heart className={`w-3.5 h-3.5 ${savedCount > 0 ? 'text-vermilion fill-current' : 'text-slate-500'}`} />
                <span className="font-mono text-xs">{savedCount}</span>
                <span className="hidden lg:inline font-mono text-xs">SAVED</span>
              </button>

              <button
                type="button"
                onClick={onLocateMe}
                disabled={isLocating}
                className="p-1 sm:px-2.5 sm:py-1 bg-wabi/95 hover:bg-white border-2 border-sumi rounded-xl shadow-2xs text-xs font-mono font-bold text-sumi active:scale-95 transition-transform flex items-center gap-1"
                title="Recenter to my location"
              >
                <LocateFixed className={`w-3.5 h-3.5 text-vermilion ${isLocating ? 'animate-spin' : ''}`} />
                <span className="hidden lg:inline">{isLocating ? '...' : 'NEAR ME'}</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* ─────────────────────────────────────────────────────────────
          TIER 2: Ultra-Compact Navigation & Filter Ribbon
          ───────────────────────────────────────────────────────────── */}
      <div className="w-full bg-wabi border-t border-sumi/15 px-2 sm:px-4 py-0.5 sm:py-1">
        <div 
          ref={ribbonContainerRef}
          className="max-w-7xl mx-auto flex items-center gap-1.5 sm:gap-2.5 overflow-x-auto sliding-bar py-0.5 scroll-smooth select-none"
        >
          {/* A. Core View Switcher (MAP, LOOKBOOK, LOCAL & METRO) */}
          <div className="flex items-center bg-sumi/10 border-2 border-sumi rounded-xl p-0.5 shadow-2xs flex-shrink-0">
            <button
              type="button"
              onClick={() => onToggleView('map')}
              className={`flex items-center gap-1 px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-lg text-xs font-mono font-bold transition-all ${
                viewMode === 'map' ? 'bg-sumi text-wabi shadow-sm font-black' : 'text-sumi hover:bg-white/60'
              }`}
            >
              <Map className="w-3.5 h-3.5" />
              <span>MAP</span>
            </button>
            <button
              type="button"
              onClick={() => onToggleView('zine')}
              className={`flex items-center gap-1 px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-lg text-xs font-mono font-bold transition-all ${
                viewMode === 'zine' ? 'bg-vermilion text-white shadow-sm font-black' : 'text-sumi hover:bg-white/60'
              }`}
            >
              <LayoutGrid className="w-3.5 h-3.5" />
              <span>LOOKBOOK</span>
            </button>
            <button
              type="button"
              onClick={() => onToggleView('transit')}
              className={`flex items-center gap-1 px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-lg text-xs font-mono font-bold transition-all ${
                viewMode === 'transit' ? 'bg-amber-400 text-sumi shadow-sm font-black' : 'text-sumi hover:bg-white/60'
              }`}
              title="Mumbai Local Train & Metro Smart Directions"
            >
              <Train className="w-3.5 h-3.5 text-rose-600" />
              <span>LOCAL & METRO</span>
            </button>
          </div>

          {/* Vertical Divider */}
          {filters && onFilterChange && (
            <div className="h-4 w-px bg-sumi/30 flex-shrink-0" />
          )}

          {/* B. Integrated Category Carousel & Filters Studio Trigger */}
          {filters && onFilterChange && (
            <div className="flex items-center gap-2 flex-1 min-w-0">
              <FilterBar
                filters={filters}
                onChange={onFilterChange}
                totalFound={totalSpots}
                showPlacesOverlay={showPlacesOverlay}
                onTogglePlacesOverlay={onTogglePlacesOverlay}
                showTransitOverlay={showTransitOverlay}
                onToggleTransitOverlay={onToggleTransitOverlay}
                isEmbedded={true}
              />
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
