'use client';

import React from 'react';
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
  return (
    <header className="sticky top-0 left-0 right-0 z-40 bg-wabi/95 backdrop-blur-md border-b-2 border-sumi shadow-sm font-kaluk">
      {/* Top Telemetry Strip */}
      <div className="bg-sumi text-wabi-100 px-4 py-1 flex items-center justify-between text-[11px] font-mono tracking-wider">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-vermilion animate-pulse"></span>
          <span className="font-bold text-vermilion">KHOJ</span>
          <span className="text-slate-500">|</span>
          <span className="text-slate-300">MUMBAI REGION · 18°58′N, 72°50′E</span>
        </div>
        <div className="flex items-center gap-2.5">
          <span className="text-amber-400 font-bold">● {totalSpots} SANCTUARIES</span>
          <span className="text-slate-500 hidden sm:inline">|</span>
          <span className="text-emerald-400 hidden sm:inline">VERIFIED PUBLIC ACCESS</span>
        </div>
      </div>

      {/* Main Navigation Bar */}
      <div className="max-w-7xl mx-auto px-4 py-2.5 flex flex-col md:flex-row items-center justify-between gap-3">
        {/* Brand */}
        <div className="flex items-center justify-between w-full md:w-auto gap-3">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-vermilion flex items-center justify-center text-white border-2 border-sumi shadow-riso-sm flex-shrink-0">
              <Compass className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-display font-black text-2xl tracking-tight text-sumi">
                  KHOJ<span className="text-vermilion">.</span>
                </span>
                <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-sumi text-wabi uppercase">
                  Mumbai
                </span>
              </div>
              <p className="text-[10px] font-mono uppercase tracking-wider text-slate-500 -mt-0.5">
                Hidden & Underrated Places
              </p>
            </div>
          </div>

          {/* Mobile Actions: Saved & View Toggle */}
          <div className="flex md:hidden items-center gap-2">
            <button
              onClick={onOpenSaved}
              className="flex items-center gap-1 px-2.5 py-1.5 bg-wabi border-2 border-sumi rounded-xl shadow-riso-sm text-xs font-mono font-bold text-sumi hover:bg-amber-100"
              title="View saved sanctuaries"
            >
              <Heart className={`w-3.5 h-3.5 ${savedCount > 0 ? 'text-vermilion fill-current' : 'text-slate-500'}`} />
              <span>{savedCount}</span>
            </button>

            <div className="flex items-center bg-wabi-200 border-2 border-sumi rounded-xl p-0.5 shadow-riso-sm">
              <button
                onClick={() => onToggleView('map')}
                className={`flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-mono font-bold transition-all ${
                  viewMode === 'map' ? 'bg-sumi text-wabi' : 'text-sumi'
                }`}
              >
                <Map className="w-3.5 h-3.5" />
                <span>MAP</span>
              </button>
              <button
                onClick={() => onToggleView('zine')}
                className={`flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-mono font-bold transition-all ${
                  viewMode === 'zine' ? 'bg-vermilion text-white' : 'text-sumi'
                }`}
              >
                <LayoutGrid className="w-3.5 h-3.5" />
                <span>ZINE</span>
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
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="Search ruins, cliffs, serene tanks, parks..."
              className="w-full pl-9 pr-3 py-2 text-xs font-sans font-medium bg-wabi-100 rounded-xl border-2 border-sumi focus:outline-none focus:ring-2 focus:ring-vermilion text-sumi placeholder-slate-500 shadow-riso-sm"
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
