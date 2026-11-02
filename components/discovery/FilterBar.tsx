'use client';

import React from 'react';
import { PlaceCategory, FilterState } from '@/lib/types';
import { Compass, Trees, Mountain, Landmark, Droplets, Sparkles, Moon, SlidersHorizontal } from 'lucide-react';

interface FilterBarProps {
  filters: FilterState;
  onChange: (updated: Partial<FilterState>) => void;
  totalFound: number;
}

const CATEGORIES: { id: PlaceCategory; num: string; label: string; icon: React.ReactNode }[] = [
  { id: 'all', num: '00', label: '#ALL SPOTS', icon: <Compass className="w-3.5 h-3.5" /> },
  { id: 'quiet_chill', num: '01', label: '#QUIET HAVENS', icon: <Moon className="w-3.5 h-3.5" /> },
  { id: 'viewpoint', num: '02', label: '#VIEWPOINTS', icon: <Mountain className="w-3.5 h-3.5" /> },
  { id: 'historical', num: '03', label: '#ANCIENT FORTS', icon: <Landmark className="w-3.5 h-3.5" /> },
  { id: 'nature_forest', num: '04', label: '#FOREST TREKS', icon: <Trees className="w-3.5 h-3.5" /> },
  { id: 'waterfront', num: '05', label: '#COAST & TANKS', icon: <Droplets className="w-3.5 h-3.5" /> },
  { id: 'hidden_gem', num: '06', label: '#LOCAL SECRETS', icon: <Sparkles className="w-3.5 h-3.5" /> },
];

const RADII = [5, 10, 20, 40];

export default function FilterBar({ filters, onChange, totalFound }: FilterBarProps) {
  return (
    <div className="flex flex-col gap-2 w-full bg-wabi/95 backdrop-blur-md p-3 rounded-2xl border-2 border-sumi shadow-riso">
      {/* Category Pills (BEAMS JTB Inspired) */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar">
        {CATEGORIES.map((cat) => {
          const isActive = filters.category === cat.id;
          return (
            <button
              key={cat.id}
              onClick={() => onChange({ category: cat.id })}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-mono font-bold whitespace-nowrap transition-all duration-150 border-2 ${
                isActive
                  ? 'bg-vermilion text-white border-sumi shadow-riso-sm translate-y-[-1px]'
                  : 'bg-wabi-100 text-sumi border-sumi/30 hover:border-sumi hover:bg-wabi-200'
              }`}
            >
              <span className="text-[10px] opacity-75">{cat.num}</span>
              <span>{cat.label}</span>
            </button>
          );
        })}
      </div>

      {/* Secondary Controls: Radius & Quiet/Crowd Toggles */}
      <div className="flex items-center justify-between text-xs border-t border-sumi/15 pt-2">
        <div className="flex items-center gap-1 font-mono">
          <span className="text-[11px] font-bold text-slate-500 uppercase mr-1">Radius:</span>
          {RADII.map((r) => (
            <button
              key={r}
              onClick={() => onChange({ radiusKm: r })}
              className={`px-2 py-0.5 rounded-md font-mono text-[11px] font-bold border transition-colors ${
                filters.radiusKm === r
                  ? 'bg-sumi text-wabi border-sumi'
                  : 'bg-wabi-100 text-slate-700 border-sumi/20 hover:border-sumi'
              }`}
            >
              {r}km
            </button>
          ))}
        </div>

        {/* Low Crowd Wabi-Sabi Toggle */}
        <button
          onClick={() =>
            onChange({
              maxCrowdLevel: filters.maxCrowdLevel === 2 ? 5 : 2,
            })
          }
          className={`flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-mono font-bold border transition-all ${
            filters.maxCrowdLevel === 2
              ? 'bg-matcha text-white border-sumi shadow-riso-sm'
              : 'bg-wabi-100 text-sumi border-sumi/30 hover:border-sumi'
          }`}
          title="Filter for quiet solitude"
        >
          <SlidersHorizontal className="w-3 h-3" />
          <span>{filters.maxCrowdLevel === 2 ? 'QUIET SOLITUDE' : 'ANY CROWD'}</span>
        </button>

        {/* Total Badge */}
        <span className="font-mono text-[11px] font-bold bg-wabi-200 text-sumi border border-sumi/30 px-2 py-0.5 rounded-full">
          {totalFound} SPOTS
        </span>
      </div>
    </div>
  );
}
