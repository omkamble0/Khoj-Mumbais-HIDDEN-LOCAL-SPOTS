'use client';

import React from 'react';
import { PlaceCategory, FilterState, SpotTier } from '@/lib/types';
import {
  Compass,
  Coffee,
  Shield,
  Trees,
  Mountain,
  Droplets,
  Landmark,
  SlidersHorizontal,
} from 'lucide-react';

interface FilterBarProps {
  filters: FilterState;
  onChange: (updated: Partial<FilterState>) => void;
  totalFound: number;
}

const CATEGORIES: { id: PlaceCategory; label: string; icon: React.ReactNode }[] = [
  { id: 'all', label: 'ALL SPOTS', icon: <Compass className="w-3.5 h-3.5" /> },
  { id: 'cafes', label: 'CAFÉS', icon: <Coffee className="w-3.5 h-3.5" /> },
  { id: 'forts', label: 'FORTS', icon: <Shield className="w-3.5 h-3.5" /> },
  { id: 'parks', label: 'PARKS', icon: <Trees className="w-3.5 h-3.5" /> },
  { id: 'viewpoints', label: 'VIEWPOINTS', icon: <Mountain className="w-3.5 h-3.5" /> },
  { id: 'waterfront', label: 'WATERFRONT', icon: <Droplets className="w-3.5 h-3.5" /> },
  { id: 'heritage', label: 'HERITAGE', icon: <Landmark className="w-3.5 h-3.5" /> },
];

const SPOT_TIERS: { id: SpotTier; label: string }[] = [
  { id: 'all', label: 'All Tiers' },
  { id: 'hidden_gem', label: '✦ Hidden' },
  { id: 'underrated', label: '● Underrated' },
  { id: 'iconic', label: '★ Iconic' },
];

const RADII = [5, 10, 20, 40];

export default function FilterBar({ filters, onChange, totalFound }: FilterBarProps) {
  return (
    <div className="bg-wabi/95 backdrop-blur-md p-3 rounded-2xl border-2 border-sumi shadow-riso font-kaluk space-y-2">
      {/* Category Pills (Cafés, Forts, Parks, Viewpoints, etc.) */}
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
              {cat.icon}
              <span>{cat.label}</span>
            </button>
          );
        })}
      </div>

      {/* Spot Tier & Radius Strip */}
      <div className="flex flex-wrap items-center justify-between gap-2 text-xs border-t border-sumi/15 pt-2">
        {/* Tier Selector (Hidden vs Underrated vs Iconic) */}
        <div className="flex items-center gap-1">
          {SPOT_TIERS.map((tier) => (
            <button
              key={tier.id}
              onClick={() => onChange({ spotTier: tier.id })}
              className={`px-2 py-0.5 rounded-lg text-[11px] font-mono font-bold border transition-colors ${
                filters.spotTier === tier.id
                  ? 'bg-sumi text-wabi border-sumi'
                  : 'bg-wabi-100 text-slate-700 border-sumi/20 hover:border-sumi'
              }`}
            >
              {tier.label}
            </button>
          ))}
        </div>

        {/* Radius Filter & Total Count */}
        <div className="flex items-center gap-2 font-mono">
          <div className="flex items-center gap-1">
            <span className="text-[10px] font-bold text-slate-500 uppercase">RADIUS:</span>
            {RADII.map((r) => (
              <button
                key={r}
                onClick={() => onChange({ radiusKm: r })}
                className={`px-2 py-0.5 rounded font-mono text-[10px] font-bold border transition-colors ${
                  filters.radiusKm === r
                    ? 'bg-vermilion text-white border-sumi'
                    : 'bg-wabi-100 text-slate-700 border-sumi/20 hover:border-sumi'
                }`}
              >
                {r}k
              </button>
            ))}
          </div>

          <span className="font-mono text-[10px] font-black bg-wabi-200 text-sumi border border-sumi/40 px-2 py-0.5 rounded-full">
            {totalFound} SPOTS
          </span>
        </div>
      </div>
    </div>
  );
}
