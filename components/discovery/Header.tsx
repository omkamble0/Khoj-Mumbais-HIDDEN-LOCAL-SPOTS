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
          TIER 1: Brand & Search & Quick Action Pills
          - On Mobile: Line 1 (Brand + Actions), Line 2 (Dedicated Search Bar)
          - On Desktop: Single Wide Uncluttered Row
          ───────────────────────────────────────────────────────────── */}
      <div 
        className="relative w-full bg-cover bg-center overflow-hidden border-b border-sumi/15"
        style={{ backgroundImage: `url('/images/mumbai_art_and_culture_banner_hd.png')` }}
      >
        <div className="w-full bg-sumi/5 px-2.5 sm:px-4 py-1.5 sm:py-2.5">
          <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-stretch md:items-center justify-between gap-1.5 sm:gap-3">
            {/* Top Row on Mobile: Brand on Left, Quick Actions on Right */}
            <div className="flex items-center justify-between gap-2 flex-shrink-0">
              {/* Brand Pill */}
              <a 
                href="/" 
                className="flex items-center gap-2 bg-wabi/95 hover:bg-white backdrop-blur-md px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-xl border-2 border-sumi shadow-riso-sm flex-shrink-0 group active:scale-95 transition-transform"
                title="KHOJ Mumbai - Discover Hidden & Underrated Sanctuaries"
              >
                <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-vermilion flex items-center justify-center text-white border border-sumi shadow-xs flex-shrink-0 group-hover:scale-105 transition-transform">
                  <Compass className="w-4 h-4 text-white" />
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="font-ananda font-bold text-lg sm:text-xl text-sumi leading-none">
                    KHOJ<span className="text-vermilion">.</span>
                  </span>
                  <span className="font-marathi text-xs sm:text-sm text-slate-700 leading-none">खोज</span>
                  <span className="px-1 py-0.2 rounded text-[8px] sm:text-[9px] font-mono font-black bg-sumi text-wabi uppercase">
                    MUMBAI
                  </span>
                </div>
              </a>

              {/* Mobile Quick Action Pills (Visible on mobile right next to brand) */}
              <div className="flex md:hidden items-center gap-1.5 flex-shrink-0">
                <button
                  type="button"
                  onClick={onOpenRoulette}
                  className="p-1.5 bg-vermilion text-white border-2 border-sumi rounded-xl shadow-riso-sm text-xs font-mono font-bold active:scale-95 transition-transform"
                  title="Roll Rasta Roulette"
                  aria-label="Roll Rasta Roulette"
                >
                  <Dices className="w-4 h-4 text-white" />
                </button>

                <button
                  type="button"
                  onClick={onOpenSaved}
                  className="flex items-center gap-1 px-2 py-1.5 bg-wabi/95 border-2 border-sumi rounded-xl shadow-riso-sm text-xs font-mono font-bold text-sumi active:scale-95 transition-transform"
                  title="Saved sanctuaries"
                >
                  <Heart className={`w-3.5 h-3.5 ${savedCount > 0 ? 'text-vermilion fill-current' : 'text-slate-500'}`} />
                  <span className="font-mono text-xs">{savedCount}</span>
                </button>

                <button
                  type="button"
                  onClick={onLocateMe}
                  disabled={isLocating}
                  className="p-1.5 bg-wabi/95 border-2 border-sumi rounded-xl shadow-riso-sm text-xs font-mono font-bold text-sumi active:scale-95 transition-transform"
                  title="Recenter to my location"
                >
                  <LocateFixed className={`w-3.5 h-3.5 text-vermilion ${isLocating ? 'animate-spin' : ''}`} />
                </button>
              </div>
            </div>

            {/* Dedicated Full-Width Search Bar */}
            <div className="w-full md:flex-1 md:max-w-md min-w-0">
              <div className="relative group">
                <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-vermilion transition-colors" />
                <input
                  type="text"
                  value={localQuery}
                  onChange={(e) => setLocalQuery(e.target.value)}
                  placeholder="Search 464 hidden spots, ruins, cafes..."
                  className="w-full pl-9 pr-8 py-1.5 sm:py-2 text-xs sm:text-sm font-sans font-medium bg-white hover:bg-white focus:bg-white rounded-xl border-2 border-sumi focus:outline-none shadow-sm focus:shadow-riso-red text-sumi placeholder-slate-500 transition-all"
                />
                {localQuery && (
                  <button
                    onClick={() => {
                      setLocalQuery('');
                      onSearchChange('');
                    }}
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-sumi font-mono text-xs font-bold p-0.5"
                    title="Clear search"
                  >
                    ✕
                  </button>
                )}
              </div>
            </div>

            {/* Desktop Action Pills (Visible on md+ screens) */}
            <div className="hidden md:flex items-center gap-2 flex-shrink-0">
              <button
                type="button"
                onClick={onOpenRoulette}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-vermilion hover:bg-vermilion/90 text-white border-2 border-sumi rounded-xl shadow-riso-sm text-xs font-mono font-bold transition-all active:scale-95 flex-shrink-0"
                title="Roll Rasta Roulette for a random sanctuary"
              >
                <Dices className="w-3.5 h-3.5 text-white" />
                <span>ROULETTE 🎲</span>
              </button>

              <button
                type="button"
                onClick={onOpenSaved}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-wabi/95 hover:bg-white border-2 border-sumi rounded-xl shadow-riso-sm text-xs font-mono font-bold text-sumi transition-all flex-shrink-0 active:scale-95"
                title="Saved sanctuaries"
              >
                <Heart className={`w-3.5 h-3.5 ${savedCount > 0 ? 'text-vermilion fill-current' : 'text-slate-500'}`} />
                <span className="font-mono text-xs">SAVED ({savedCount})</span>
              </button>

              <button
                type="button"
                onClick={onLocateMe}
                disabled={isLocating}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-wabi/95 hover:bg-white border-2 border-sumi rounded-xl shadow-riso-sm text-xs font-mono font-bold text-sumi transition-all active:scale-95 flex-shrink-0"
                title="Recenter to my location"
              >
                <LocateFixed className={`w-3.5 h-3.5 text-vermilion ${isLocating ? 'animate-spin' : ''}`} />
                <span>{isLocating ? '...' : 'NEAR ME'}</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* ─────────────────────────────────────────────────────────────
          TIER 2: Unified Navigation & Filter Ribbon (Smooth Horizontal Glide)
          ───────────────────────────────────────────────────────────── */}
      <div className="w-full bg-wabi border-t border-sumi/15 px-2 sm:px-4 pt-1.5 pb-1">
        <div 
          ref={ribbonContainerRef}
          className="max-w-7xl mx-auto flex items-center gap-2 sm:gap-3 overflow-x-auto sliding-bar py-0.5 scroll-smooth select-none"
        >
          {/* A. Core View Switcher (MAP VIEW, LOOKBOOK, LOCAL & METRO) */}
          <div className="flex items-center bg-sumi/10 border-2 border-sumi rounded-xl p-0.5 shadow-2xs flex-shrink-0">
            <button
              type="button"
              onClick={() => onToggleView('map')}
              className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-mono font-bold transition-all ${
                viewMode === 'map' ? 'bg-sumi text-wabi shadow-sm font-black' : 'text-sumi hover:bg-white/60'
              }`}
            >
              <Map className="w-3.5 h-3.5" />
              <span>MAP VIEW</span>
            </button>
            <button
              type="button"
              onClick={() => onToggleView('zine')}
              className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-mono font-bold transition-all ${
                viewMode === 'zine' ? 'bg-vermilion text-white shadow-sm font-black' : 'text-sumi hover:bg-white/60'
              }`}
            >
              <LayoutGrid className="w-3.5 h-3.5" />
              <span>LOOKBOOK</span>
            </button>
            <button
              type="button"
              onClick={() => onToggleView('transit')}
              className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-mono font-bold transition-all ${
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
            <div className="h-5 w-px bg-sumi/30 flex-shrink-0" />
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

        {/* Tactile Glide Slider Indicator for the Ribbon */}
        <div className="max-w-7xl mx-auto pt-0.5">
          <TactileSliderBar
            containerRef={ribbonContainerRef}
            variant="lines"
            accentColor="bg-sumi"
            trackLabel="GLIDE VIEWS & FILTERS"
            className="pt-0.5"
          />
        </div>
      </div>
    </header>
  );
}
