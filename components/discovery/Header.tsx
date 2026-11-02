'use client';

import React from 'react';
import { Compass, LocateFixed, Search, Map, LayoutGrid, Sparkles } from 'lucide-react';

interface HeaderProps {
  currentCity: string;
  onLocateMe: () => void;
  isLocating: boolean;
  searchQuery: string;
  onSearchChange: (q: string) => void;
  viewMode: 'map' | 'zine';
  onToggleView: (mode: 'map' | 'zine') => void;
  totalSpots: number;
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
}: HeaderProps) {
  return (
    <header className="absolute top-3 left-3 right-3 z-30 flex flex-col gap-2.5 pointer-events-none">
      {/* Top Micro Ticker (Indo-Japanese Coordinate HUD) */}
      <div className="pointer-events-auto flex items-center justify-between text-[10px] font-mono tracking-wider bg-sumi text-wabi-100 px-3.5 py-1.5 rounded-full border border-sumi/20 shadow-riso-sm">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-vermilion animate-pulse"></span>
          <span className="font-bold text-vermilion">秘境 · KHOJ</span>
          <span className="text-slate-400 hidden sm:inline">|</span>
          <span className="text-slate-300 hidden sm:inline">MUMBAI REGION 18°58′N · 72°50′E</span>
        </div>
        <div className="flex items-center gap-2 font-mono">
          <span className="text-amber-400">● {totalSpots} SANCTUARIES</span>
          <span className="text-slate-400">|</span>
          <span className="text-emerald-400">WABI-SABI VIBES</span>
        </div>
      </div>

      {/* Main Navigation Bar */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-2.5 pointer-events-none">
        {/* Brand & City Seal */}
        <div className="pointer-events-auto flex items-center gap-3 bg-wabi/95 backdrop-blur-md px-4 py-2.5 rounded-2xl border-2 border-sumi shadow-riso">
          <div className="w-9 h-9 rounded-xl bg-vermilion flex items-center justify-center text-white shadow-sm border border-sumi flex-shrink-0">
            <Compass className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <h1 className="font-serif font-black text-xl text-sumi tracking-tight">
                KHOJ<span className="text-vermilion font-mono">.</span>
              </h1>
              <span className="hanko-stamp text-[10px] bg-vermilion/10 text-vermilion border-vermilion font-bold">
                खोज · 秘境
              </span>
            </div>
            <p className="text-[10px] font-mono uppercase tracking-wider text-slate-600">
              Hidden Local Sanctuaries
            </p>
          </div>
        </div>

        {/* Search & View Toggle Actions */}
        <div className="flex items-center gap-2 pointer-events-auto">
          {/* Search Box */}
          <div className="relative flex-1 md:w-64">
            <Search className="w-3.5 h-3.5 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="Search ruins, cliffs, serene tanks..."
              className="w-full pl-9 pr-3 py-2 text-xs bg-wabi/95 backdrop-blur-md rounded-xl border-2 border-sumi shadow-riso-sm focus:outline-none focus:ring-2 focus:ring-vermilion text-sumi placeholder-slate-500 font-medium"
            />
          </div>

          {/* View Mode Switcher: Map vs Zine */}
          <div className="flex items-center bg-wabi border-2 border-sumi rounded-xl p-0.5 shadow-riso-sm">
            <button
              onClick={() => onToggleView('map')}
              className={`flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-mono font-bold transition-all ${
                viewMode === 'map'
                  ? 'bg-sumi text-wabi'
                  : 'text-sumi hover:bg-slate-200/60'
              }`}
              title="Interactive Map"
            >
              <Map className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">MAP</span>
            </button>
            <button
              onClick={() => onToggleView('zine')}
              className={`flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-mono font-bold transition-all ${
                viewMode === 'zine'
                  ? 'bg-vermilion text-white'
                  : 'text-sumi hover:bg-slate-200/60'
              }`}
              title="Zine Editorial Lookbook"
            >
              <LayoutGrid className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">ZINE</span>
            </button>
          </div>

          {/* Near Me GPS Button */}
          <button
            onClick={onLocateMe}
            disabled={isLocating}
            className="flex items-center gap-1.5 px-3 py-2 bg-wabi/95 backdrop-blur-md rounded-xl border-2 border-sumi shadow-riso-sm text-xs font-mono font-bold text-sumi hover:bg-amber-100 transition-colors flex-shrink-0"
            title="Recenter to my location"
          >
            <LocateFixed className={`w-3.5 h-3.5 text-vermilion ${isLocating ? 'animate-spin' : ''}`} />
            <span className="hidden sm:inline">{isLocating ? 'LOCATING...' : 'NEAR ME'}</span>
          </button>
        </div>
      </div>
    </header>
  );
}
