'use client';

import React from 'react';
import { Map, LayoutGrid, Train, Dices, Heart } from 'lucide-react';

interface MobileBottomNavProps {
  viewMode: 'map' | 'zine' | 'transit';
  onToggleView: (mode: 'map' | 'zine' | 'transit') => void;
  onOpenRoulette: () => void;
  onOpenSaved: () => void;
  savedCount: number;
}

export default function MobileBottomNav({
  viewMode,
  onToggleView,
  onOpenRoulette,
  onOpenSaved,
  savedCount,
}: MobileBottomNavProps) {
  return (
    <nav 
      aria-label="Mobile Navigation"
      className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-wabi/95 backdrop-blur-md border-t-2 border-sumi shadow-riso-lg pb-safe select-none"
    >
      <div className="grid grid-cols-5 items-center h-14 px-1 max-w-md mx-auto">
        {/* 1. Map View */}
        <button
          type="button"
          onClick={() => onToggleView('map')}
          className={`flex flex-col items-center justify-center gap-0.5 py-1 rounded-xl transition-all active:scale-90 ${
            viewMode === 'map'
              ? 'text-sumi font-black'
              : 'text-slate-500 hover:text-sumi'
          }`}
        >
          <div className={`p-1 rounded-lg transition-colors ${viewMode === 'map' ? 'bg-sumi text-wabi shadow-xs' : ''}`}>
            <Map className="w-4 h-4" />
          </div>
          <span className="text-[10px] font-mono tracking-tight leading-none">MAP</span>
        </button>

        {/* 2. Zine Lookbook */}
        <button
          type="button"
          onClick={() => onToggleView('zine')}
          className={`flex flex-col items-center justify-center gap-0.5 py-1 rounded-xl transition-all active:scale-90 ${
            viewMode === 'zine'
              ? 'text-vermilion font-black'
              : 'text-slate-500 hover:text-sumi'
          }`}
        >
          <div className={`p-1 rounded-lg transition-colors ${viewMode === 'zine' ? 'bg-vermilion text-white shadow-xs' : ''}`}>
            <LayoutGrid className="w-4 h-4" />
          </div>
          <span className="text-[10px] font-mono tracking-tight leading-none">LOOKBOOK</span>
        </button>

        {/* 3. Local & Metro Transit */}
        <button
          type="button"
          onClick={() => onToggleView('transit')}
          className={`flex flex-col items-center justify-center gap-0.5 py-1 rounded-xl transition-all active:scale-90 ${
            viewMode === 'transit'
              ? 'text-amber-600 font-black'
              : 'text-slate-500 hover:text-sumi'
          }`}
        >
          <div className={`p-1 rounded-lg transition-colors ${viewMode === 'transit' ? 'bg-amber-400 text-sumi border border-sumi shadow-xs' : ''}`}>
            <Train className="w-4 h-4 text-rose-600" />
          </div>
          <span className="text-[10px] font-mono tracking-tight leading-none">TRANSIT</span>
        </button>

        {/* 4. Rasta Roulette */}
        <button
          type="button"
          onClick={onOpenRoulette}
          className="flex flex-col items-center justify-center gap-0.5 py-1 text-slate-600 hover:text-sumi transition-all active:scale-90"
        >
          <div className="p-1 rounded-lg bg-vermilion text-white shadow-riso-sm">
            <Dices className="w-4 h-4 text-white" />
          </div>
          <span className="text-[10px] font-mono tracking-tight leading-none font-bold text-sumi">ROULETTE</span>
        </button>

        {/* 5. Saved Sanctuaries */}
        <button
          type="button"
          onClick={onOpenSaved}
          className="flex flex-col items-center justify-center gap-0.5 py-1 text-slate-600 hover:text-sumi transition-all active:scale-90 relative"
        >
          <div className="p-1 rounded-lg relative">
            <Heart className={`w-4 h-4 ${savedCount > 0 ? 'text-vermilion fill-vermilion' : 'text-slate-500'}`} />
            {savedCount > 0 && (
              <span className="absolute -top-1 -right-1 px-1 min-w-[14px] h-[14px] rounded-full bg-vermilion text-white text-[8px] font-mono font-black flex items-center justify-center shadow-xs">
                {savedCount}
              </span>
            )}
          </div>
          <span className="text-[10px] font-mono tracking-tight leading-none font-bold">SAVED</span>
        </button>
      </div>
    </nav>
  );
}
