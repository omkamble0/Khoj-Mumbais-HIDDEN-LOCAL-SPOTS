'use client';

import React from 'react';
import { PlaceCategory, FilterState } from '@/lib/types';
import { Compass, Trees, Mountain, Landmark, Droplets, Sparkles, SlidersHorizontal, Moon } from 'lucide-react';

interface FilterBarProps {
  filters: FilterState;
  onChange: (updated: Partial<FilterState>) => void;
  totalFound: number;
}

const CATEGORIES: { id: PlaceCategory; label: string; icon: React.ReactNode }[] = [
  { id: 'all', label: 'All Hidden Spots', icon: <Compass className="w-3.5 h-3.5" /> },
  { id: 'quiet_chill', label: 'Quiet & Calm', icon: <Moon className="w-3.5 h-3.5" /> },
  { id: 'viewpoint', label: 'Viewpoints', icon: <Mountain className="w-3.5 h-3.5" /> },
  { id: 'historical', label: 'Heritage & Forts', icon: <Landmark className="w-3.5 h-3.5" /> },
  { id: 'nature_forest', label: 'Forest Trails', icon: <Trees className="w-3.5 h-3.5" /> },
  { id: 'waterfront', label: 'Lakeside & Sea', icon: <Droplets className="w-3.5 h-3.5" /> },
  { id: 'hidden_gem', label: 'Local Secrets', icon: <Sparkles className="w-3.5 h-3.5" /> },
];

const RADII = [5, 10, 20, 40];

export default function FilterBar({ filters, onChange, totalFound }: FilterBarProps) {
  return (
    <div className="flex flex-col gap-2.5 w-full bg-white/95 backdrop-blur-md p-3 rounded-2xl shadow-sm border border-slate-200/80">
      {/* Category Horizontal Scrolling Pills */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
        {CATEGORIES.map((cat) => {
          const isActive = filters.category === cat.id;
          return (
            <button
              key={cat.id}
              onClick={() => onChange({ category: cat.id })}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all duration-150 ${
                isActive
                  ? 'bg-slate-900 text-white shadow-sm ring-2 ring-slate-900/10'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200/70 border border-slate-200/50'
              }`}
            >
              {cat.icon}
              <span>{cat.label}</span>
            </button>
          );
        })}
      </div>

      {/* Secondary Controls: Radius & Quiet/Crowd Toggles */}
      <div className="flex items-center justify-between text-xs text-slate-600 border-t border-slate-100 pt-2">
        <div className="flex items-center gap-1.5">
          <span className="font-medium text-slate-500">Radius:</span>
          {RADII.map((r) => (
            <button
              key={r}
              onClick={() => onChange({ radiusKm: r })}
              className={`px-2 py-0.5 rounded-md font-medium text-xs transition-colors ${
                filters.radiusKm === r
                  ? 'bg-emerald-600 text-white font-semibold'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {r}km
            </button>
          ))}
        </div>

        {/* Quiet Filter Toggle */}
        <button
          onClick={() =>
            onChange({
              maxCrowdLevel: filters.maxCrowdLevel === 2 ? 5 : 2,
            })
          }
          className={`flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-medium transition-all ${
            filters.maxCrowdLevel === 2
              ? 'bg-emerald-50 text-emerald-700 border border-emerald-200 font-semibold'
              : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
          }`}
          title="Only show empty and low-crowd places"
        >
          <SlidersHorizontal className="w-3 h-3" />
          <span>{filters.maxCrowdLevel === 2 ? 'Low Crowd Only' : 'Any Crowd'}</span>
        </button>

        {/* Match Count Badge */}
        <span className="text-[11px] font-semibold text-slate-400 bg-slate-50 px-2 py-0.5 rounded-full">
          {totalFound} spots
        </span>
      </div>
    </div>
  );
}
