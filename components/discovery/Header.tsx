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
    <header className="sticky top-0 left-0 right-0 z-40 bg-wabi/95 backdrop-blur-md border-b-2 border-sumi shadow-sm font-sans flex-shrink-0">
      {/* Top Telemetry Strip */}
      <div className="bg-sumi text-wabi-100 px-3 sm:px-4 py-1.5 flex items-center justify-between text-xs font-mono tracking-wider overflow-hidden">
        <div className="flex items-center gap-2 min-w-0">
          <span className="w-2 h-2 rounded-full bg-vermilion animate-pulse flex-shrink-0"></span>
          <span className="font-bold text-vermilion text-xs sm:text-sm flex-shrink-0">KHOJ</span>
          <span className="text-slate-500 hidden sm:inline">|</span>
          <span className="text-slate-300 font-medium truncate text-[11px] sm:text-xs">MUMBAI · 18°58′N, 72°50′E</span>
        </div>
        <div className="flex items-center gap-2 sm:gap-2.5 flex-shrink-0">
          <span className="text-amber-400 font-bold text-[11px] sm:text-xs">● {totalSpots} SPOTS</span>
          <span className="text-slate-500 hidden sm:inline">|</span>
          <span className="text-emerald-400 font-semibold hidden sm:inline">VERIFIED PUBLIC ACCESS</span>
        </div>
      </div>

      {/* Main Navigation Bar */}
      <div className="max-w-7xl mx-auto px-3 sm:px-4 py-2.5 sm:py-3 flex flex-col md:flex-row items-center justify-between gap-2.5 sm:gap-3">
        {/* Brand & Mobile Action Bar */}
        <div className="flex items-center justify-between w-full md:w-auto gap-2 sm:gap-3">
          <div className="flex items-center gap-2.5 sm:gap-3">
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-vermilion flex items-center justify-center text-white border-2 border-sumi shadow-riso-sm flex-shrink-0">
              <Compass className="w-4 h-4 sm:w-5 sm:h-5" />
            </div>
            <div>
              <div className="flex items-center gap-1.5 sm:gap-2">
                <span className="font-ananda font-normal text-2xl sm:text-4xl tracking-wide text-sumi leading-none">
                  KHOJ<span className="text-vermilion">.</span>
                </span>
                <span className="font-ananda text-sm sm:text-base text-slate-700 tracking-wide font-normal hidden sm:inline">
                  खोज
                </span>
                <span className="px-1.5 py-0.5 rounded text-[10px] sm:text-xs font-mono font-bold bg-sumi text-wabi uppercase">
                  Mumbai
                </span>
              </div>
              <p className="text-[10px] sm:text-xs font-mono uppercase tracking-wider text-slate-500 font-semibold">
                Hidden & Underrated Places
              </p>
            </div>
          </div>

          {/* Mobile Actions: Near Me, Saved & View Toggle */}
          <div className="flex md:hidden items-center gap-1.5">
            <button
              onClick={onLocateMe}
              disabled={isLocating}
              className="p-1.5 sm:p-2 bg-wabi border-2 border-sumi rounded-xl shadow-riso-sm text-xs font-mono font-bold text-sumi hover:bg-amber-100 flex items-center justify-center active:scale-95 transition-transform"
              title="Recenter to my location"
              aria-label="Find spots near me"
            >
              <LocateFixed className={`w-3.5 h-3.5 sm:w-4 sm:h-4 text-vermilion ${isLocating ? 'animate-spin' : ''}`} />
            </button>

            <button
              onClick={onOpenSaved}
              className="flex items-center gap-1 px-2 py-1.5 bg-wabi border-2 border-sumi rounded-xl shadow-riso-sm text-xs font-mono font-bold text-sumi hover:bg-amber-100 active:scale-95 transition-transform"
              title="View saved sanctuaries"
            >
              <Heart className={`w-3.5 h-3.5 ${savedCount > 0 ? 'text-vermilion fill-current' : 'text-slate-500'}`} />
              <span className="font-mono text-xs">{savedCount}</span>
            </button>

            <div className="flex items-center bg-wabi-200 border-2 border-sumi rounded-xl p-0.5 shadow-riso-sm">
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

        {/* Search Bar (English Search) */}
        <div className="w-full md:flex-1 md:max-w-md">
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
            <input
              type="text"
              value={localQuery}
              onChange={(e) => setLocalQuery(e.target.value)}
              placeholder="Search ruins, cliffs, serene tanks, parks..."
              className="w-full pl-10 pr-4 py-2 sm:py-2.5 text-xs sm:text-sm font-sans font-medium bg-wabi-100 rounded-xl border-2 border-sumi focus:outline-none focus:ring-2 focus:ring-vermilion text-sumi placeholder-slate-500 shadow-riso-sm"
            />
          </div>
        </div>

        {/* Desktop View Switcher, Saved & Geolocation */}
        <div className="hidden md:flex items-center gap-2 flex-shrink-0">
          <button
            onClick={onOpenSaved}
            className="flex items-center gap-1.5 px-3 py-2 bg-wabi border-2 border-sumi rounded-xl shadow-riso-sm text-xs font-mono font-bold text-sumi hover:bg-amber-100 transition-colors"
            title="Saved sanctuaries"
          >
            <Heart className={`w-3.5 h-3.5 ${savedCount > 0 ? 'text-vermilion fill-current' : 'text-slate-500'}`} />
            <span>SAVED ({savedCount})</span>
          </button>

          <div className="flex items-center bg-wabi-200 border-2 border-sumi rounded-xl p-0.5 shadow-riso-sm">
            <button
              onClick={() => onToggleView('map')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-mono font-bold transition-all ${
                viewMode === 'map' ? 'bg-sumi text-wabi' : 'text-sumi hover:bg-wabi'
              }`}
            >
              <Map className="w-3.5 h-3.5" />
              <span>MAP VIEW</span>
            </button>
            <button
              onClick={() => onToggleView('zine')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-mono font-bold transition-all ${
                viewMode === 'zine' ? 'bg-vermilion text-white' : 'text-sumi hover:bg-wabi'
              }`}
            >
              <LayoutGrid className="w-3.5 h-3.5" />
              <span>ZINE LOOKBOOK</span>
            </button>
          </div>

          <button
            onClick={onLocateMe}
            disabled={isLocating}
            className="flex items-center gap-1.5 px-3.5 py-2 bg-wabi border-2 border-sumi rounded-xl shadow-riso-sm text-xs font-mono font-bold text-sumi hover:bg-amber-100 transition-colors"
            title="Recenter to my location"
          >
            <LocateFixed className={`w-3.5 h-3.5 text-vermilion ${isLocating ? 'animate-spin' : ''}`} />
            <span>{isLocating ? 'LOCATING...' : 'NEAR ME'}</span>
          </button>
        </div>
      </div>
    </header>
  );
}
