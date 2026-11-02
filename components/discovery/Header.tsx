'use client';

import React, { useState, useEffect } from 'react';
import { Compass, LocateFixed, Search, Map, LayoutGrid, Heart } from 'lucide-react';

interface HeaderProps {
  currentCity: string;
  onLocateMe: () => void;
  isLocating: boolean;
  searchQuery: string;
  onSearchChange: (q: string) => void;
  viewMode: 'map' | 'zine';
  onToggleView: (mode: 'map' | 'zine') => void;
  totalSpots: number;
  savedCount: number;
  onOpenSaved: () => void;
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
}: HeaderProps) {
  const [localQuery, setLocalQuery] = useState(searchQuery);

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
    <header className="relative w-full border-b-2 border-sumi shadow-sm font-sans flex-shrink-0 bg-wabi">
      {/* Top Telemetry Strip */}
      <div className="bg-sumi text-wabi-100 px-3 sm:px-4 py-1.5 flex items-center justify-between text-xs font-mono tracking-wider overflow-hidden">
        <div className="flex items-center gap-2 min-w-0">
          <span className="w-2 h-2 rounded-full bg-vermilion animate-pulse flex-shrink-0"></span>
          <span className="font-bold text-vermilion text-xs sm:text-sm flex-shrink-0">KHOJ</span>
          <span className="text-slate-500 hidden sm:inline">|</span>
          <span className="text-slate-300 font-medium truncate text-[11px] sm:text-xs">MUMBAI · 18°58′N, 72°50′E</span>
        </div>
        <div className="flex items-center gap-2 sm:gap-2.5 flex-shrink-0">
          <span className="text-amber-400 font-bold text-[11px] sm:text-xs">● {totalSpots} SANCTUARIES</span>
          <span className="text-slate-500 hidden sm:inline">|</span>
          <span className="text-emerald-400 font-semibold hidden sm:inline text-[11px] sm:text-xs">VERIFIED PUBLIC ACCESS</span>
        </div>
      </div>

      {/* Main Navigation Bar with Mumbai Art & Culture Collage Banner Background */}
      <div 
        className="relative w-full bg-cover bg-center overflow-hidden border-b-2 border-sumi shadow-sm min-h-[80px] sm:min-h-[88px] flex items-center"
        style={{ backgroundImage: `url('/images/mumbai_art_and_culture_banner_hd.png')` }}
      >
        <div className="w-full h-full bg-sumi/5 py-2.5 sm:py-3">
          <div className="max-w-7xl mx-auto px-3 sm:px-4 flex flex-col md:flex-row items-center justify-between gap-2.5 sm:gap-4">
            {/* Brand & Mobile Action Bar */}
            <div className="flex items-center justify-between w-full md:w-auto gap-2 sm:gap-3">
              {/* Elevated Tactile 3D Pop-up Brand Pill (matches SAVED, MAP VIEW, LOOKBOOK) */}
              <a 
                href="/" 
                className="flex items-center gap-2.5 sm:gap-3 bg-wabi/95 hover:bg-white backdrop-blur-md px-3 sm:px-4 py-1.5 sm:py-2 rounded-2xl border-2 border-sumi shadow-riso hover:shadow-riso-red hover:-translate-y-0.5 transition-all group flex-shrink-0"
                title="KHOJ Mumbai - Discover Hidden & Underrated Sanctuaries"
              >
                <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-vermilion flex items-center justify-center text-white border-2 border-sumi shadow-riso-sm flex-shrink-0 group-hover:scale-105 transition-transform">
                  <Compass className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                </div>
                <div>
                  <div className="flex items-center gap-1.5 sm:gap-2">
                    <span className="font-ananda font-normal text-xl sm:text-2xl lg:text-3xl tracking-wide text-sumi leading-none">
                      KHOJ<span className="text-vermilion">.</span>
                    </span>
                    <span className="font-ananda text-xs sm:text-sm lg:text-base text-slate-700 tracking-wide font-normal">
                      खोज
                    </span>
                    <span className="px-1.5 py-0.5 rounded text-[9px] sm:text-[10px] lg:text-xs font-mono font-bold bg-sumi text-wabi uppercase shadow-sm">
                      Mumbai
                    </span>
                  </div>
                  <p className="text-[9px] sm:text-[10px] lg:text-xs font-mono uppercase tracking-wider text-slate-600 font-semibold mt-0.5">
                    Hidden & Underrated Places
                  </p>
                </div>
              </a>

              {/* Mobile Actions: Near Me, Saved & View Toggle */}
              <div className="flex md:hidden items-center gap-1.5">
                <button
                  onClick={onLocateMe}
                  disabled={isLocating}
                  className="p-1.5 sm:p-2 bg-wabi/95 border-2 border-sumi rounded-xl shadow-riso-sm text-xs font-mono font-bold text-sumi hover:bg-white flex items-center justify-center active:scale-95 transition-transform"
                  title="Recenter to my location"
                  aria-label="Find spots near me"
                >
                  <LocateFixed className={`w-3.5 h-3.5 sm:w-4 sm:h-4 text-vermilion ${isLocating ? 'animate-spin' : ''}`} />
                </button>

                <button
                  onClick={onOpenSaved}
                  className="flex items-center gap-1 px-2 py-1.5 bg-wabi/95 border-2 border-sumi rounded-xl shadow-riso-sm text-xs font-mono font-bold text-sumi hover:bg-white active:scale-95 transition-transform"
                  title="View saved sanctuaries"
                >
                  <Heart className={`w-3.5 h-3.5 ${savedCount > 0 ? 'text-vermilion fill-current' : 'text-slate-500'}`} />
                  <span className="font-mono text-xs">{savedCount}</span>
                </button>

                <div className="flex items-center bg-wabi-100/90 border-2 border-sumi rounded-xl p-0.5 shadow-riso-sm">
                  <button
                    onClick={() => onToggleView('map')}
                    className={`flex items-center gap-1 px-2 sm:px-2.5 py-1 rounded-lg text-xs font-mono font-bold transition-all ${
                      viewMode === 'map' ? 'bg-sumi text-wabi shadow-sm' : 'text-sumi'
                    }`}
                  >
                    <Map className="w-3.5 h-3.5" />
                    <span className="text-[11px] font-mono">MAP</span>
                  </button>
                  <button
                    onClick={() => onToggleView('zine')}
                    className={`flex items-center gap-1 px-2 sm:px-2.5 py-1 rounded-lg text-xs font-mono font-bold transition-all ${
                      viewMode === 'zine' ? 'bg-vermilion text-white shadow-sm' : 'text-sumi'
                    }`}
                  >
                    <LayoutGrid className="w-3.5 h-3.5" />
                    <span className="text-[11px] font-mono">ZINE</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Search Bar (Centered over the lined notebook section) */}
            <div className="w-full md:flex-1 md:max-w-md">
              <div className="relative group">
                <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-vermilion transition-colors" />
                <input
                  type="text"
                  value={localQuery}
                  onChange={(e) => setLocalQuery(e.target.value)}
                  placeholder="Search ruins, cliffs, serene tanks, parks..."
                  className="w-full pl-10 pr-9 py-2 sm:py-2.5 text-xs sm:text-sm font-sans font-medium bg-wabi/95 hover:bg-white focus:bg-white backdrop-blur-md rounded-2xl border-2 border-sumi focus:outline-none shadow-riso focus:shadow-riso-red text-sumi placeholder-slate-500 transition-all"
                />
                {localQuery && (
                  <button
                    onClick={() => setLocalQuery('')}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-sumi font-mono text-xs font-bold p-0.5"
                    title="Clear search"
                  >
                    ✕
                  </button>
                )}
              </div>
            </div>

            {/* Desktop View Switcher, Saved & Geolocation (Elevated Pop-up pills over right collage) */}
            <div className="hidden md:flex items-center gap-2 flex-shrink-0">
              <button
                onClick={onOpenSaved}
                className="flex items-center gap-1.5 px-3.5 py-2 bg-wabi/95 hover:bg-white border-2 border-sumi rounded-2xl shadow-riso hover:shadow-riso-red hover:-translate-y-0.5 text-xs font-mono font-bold text-sumi transition-all"
                title="Saved sanctuaries"
              >
                <Heart className={`w-3.5 h-3.5 ${savedCount > 0 ? 'text-vermilion fill-current' : 'text-slate-500'}`} />
                <span>SAVED ({savedCount})</span>
              </button>

              <div className="flex items-center bg-wabi/95 border-2 border-sumi rounded-2xl p-1 shadow-riso">
                <button
                  onClick={() => onToggleView('map')}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-mono font-bold transition-all ${
                    viewMode === 'map' ? 'bg-sumi text-wabi shadow-sm' : 'text-sumi hover:bg-wabi-100'
                  }`}
                >
                  <Map className="w-3.5 h-3.5" />
                  <span>MAP VIEW</span>
                </button>
                <button
                  onClick={() => onToggleView('zine')}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-mono font-bold transition-all ${
                    viewMode === 'zine' ? 'bg-vermilion text-white shadow-sm' : 'text-sumi hover:bg-wabi-100'
                  }`}
                >
                  <LayoutGrid className="w-3.5 h-3.5" />
                  <span>LOOKBOOK</span>
                </button>
              </div>

              <button
                onClick={onLocateMe}
                disabled={isLocating}
                className="flex items-center gap-1.5 px-3.5 py-2 bg-wabi/95 hover:bg-white border-2 border-sumi rounded-2xl shadow-riso hover:shadow-riso-red hover:-translate-y-0.5 text-xs font-mono font-bold text-sumi transition-all"
                title="Recenter to my location"
              >
                <LocateFixed className={`w-3.5 h-3.5 text-vermilion ${isLocating ? 'animate-spin' : ''}`} />
                <span>{isLocating ? 'LOCATING...' : 'NEAR ME'}</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
