'use client';

import React from 'react';
import { PlaceCategory, FilterState, SpotTier } from '@/lib/types';
import {
  Compass,
  Footprints,
  Mountain,
  Flower2,
  Coffee,
  Shield,
  Eye,
  Droplets,
  Landmark,
  BookOpen,
  Palette,
  Sparkles,
  ShoppingBag,
  Wine,
} from 'lucide-react';

interface FilterBarProps {
  filters: FilterState;
  onChange: (updated: Partial<FilterState>) => void;
  totalFound: number;
}

const CATEGORIES: { id: PlaceCategory; label: string; icon: React.ReactNode }[] = [
  { id: 'all', label: 'ALL SPOTS', icon: <Compass className="w-3.5 h-3.5" /> },
  { id: 'cafes', label: 'CAFÉS', icon: <Coffee className="w-3.5 h-3.5" /> },
  { id: 'bars', label: 'BARS', icon: <Wine className="w-3.5 h-3.5" /> },
  { id: 'forts', label: 'FORTS', icon: <Shield className="w-3.5 h-3.5" /> },
  { id: 'walks', label: 'WALKS', icon: <Footprints className="w-3.5 h-3.5" /> },
  { id: 'treks', label: 'TREKS', icon: <Mountain className="w-3.5 h-3.5" /> },
  { id: 'gardens', label: 'GARDENS', icon: <Flower2 className="w-3.5 h-3.5" /> },
  { id: 'viewpoints', label: 'VIEWPOINTS', icon: <Eye className="w-3.5 h-3.5" /> },
  { id: 'waterfront', label: 'WATERFRONT', icon: <Droplets className="w-3.5 h-3.5" /> },
  { id: 'heritage', label: 'HERITAGE', icon: <Landmark className="w-3.5 h-3.5" /> },
  { id: 'books', label: 'BOOKS & LIBS', icon: <BookOpen className="w-3.5 h-3.5" /> },
  { id: 'culture', label: 'ART & CULTURE', icon: <Palette className="w-3.5 h-3.5" /> },
  { id: 'spiritual', label: 'SACRED PLACES', icon: <Sparkles className="w-3.5 h-3.5" /> },
  { id: 'bazaars', label: 'BAZAARS', icon: <ShoppingBag className="w-3.5 h-3.5" /> },
];

const SPOT_TIERS: { id: SpotTier; label: string }[] = [
  { id: 'all', label: 'All Tiers' },
  { id: 'hidden_gem', label: '✦ Hidden' },
  { id: 'underrated', label: '● Underrated' },
  { id: 'iconic', label: '★ Iconic' },
];

const RADII = [10, 25, 50, 120];

export default function FilterBar({ filters, onChange, totalFound }: FilterBarProps) {
  return (
    <div className="bg-wabi/95 backdrop-blur-md p-2.5 sm:p-3.5 rounded-2xl border-2 border-sumi shadow-riso font-sans space-y-2 sm:space-y-2.5">
      {/* Category Horizontal Scrolling Pills */}
      <div className="flex items-center gap-1.5 sm:gap-2 overflow-x-auto no-scrollbar pb-1">
        {CATEGORIES.map((cat) => {
          const isActive = filters.category === cat.id;
          return (
            <button
              key={cat.id}
              onClick={() => onChange({ category: cat.id })}
              className={`flex items-center gap-1.5 sm:gap-2 px-2.5 sm:px-3.5 py-1.5 sm:py-2 rounded-xl text-xs font-mono font-bold whitespace-nowrap transition-all duration-150 border-2 ${
                isActive
                  ? 'bg-vermilion text-white border-sumi shadow-riso-sm translate-y-[-1px]'
                  : 'bg-wabi-100 text-sumi border-sumi/30 hover:border-sumi hover:bg-wabi-200'
              }`}
            >
              {cat.icon}
              <span className="tracking-wide">{cat.label}</span>
            </button>
          );
        })}
      </div>

      {/* Spot Tier & Radius Strip (Single horizontal scrollable row on mobile, full width flex on desktop) */}
      <div className="flex items-center justify-between gap-2 overflow-x-auto no-scrollbar border-t border-sumi/15 pt-2 text-xs">
        {/* Tier Selector (Hidden vs Underrated vs Iconic) */}
        <div className="flex items-center gap-1 sm:gap-1.5 flex-shrink-0">
          {SPOT_TIERS.map((tier) => (
            <button
              key={tier.id}
              onClick={() => onChange({ spotTier: tier.id })}
              className={`px-2 sm:px-3 py-1 rounded-lg text-[11px] sm:text-xs font-mono font-bold whitespace-nowrap border transition-colors ${
                filters.spotTier === tier.id
                  ? 'bg-sumi text-wabi border-sumi shadow-sm'
                  : 'bg-wabi-100 text-slate-700 border-sumi/20 hover:border-sumi hover:bg-wabi-200'
              }`}
            >
              {tier.label}
            </button>
          ))}
        </div>

        {/* Radius Filter & Total Count */}
        <div className="flex items-center gap-2 sm:gap-2.5 font-mono flex-shrink-0">
          <div className="flex items-center gap-1 sm:gap-1.5">
            <span className="text-[10px] sm:text-xs font-bold text-slate-600 uppercase hidden xs:inline">RADIUS:</span>
            {RADII.map((r) => (
              <button
                key={r}
                onClick={() => onChange({ radiusKm: r })}
                className={`px-1.5 sm:px-2.5 py-0.5 sm:py-1 rounded-md font-mono text-[11px] sm:text-xs font-bold border transition-colors ${
                  filters.radiusKm === r
                    ? 'bg-vermilion text-white border-sumi shadow-sm'
                    : 'bg-wabi-100 text-slate-700 border-sumi/20 hover:border-sumi hover:bg-wabi-200'
                }`}
              >
                {r >= 120 ? 'All' : `${r}km`}
              </button>
            ))}
          </div>

          <span className="font-mono text-[10px] sm:text-xs font-black bg-wabi-200 text-sumi border border-sumi/40 px-2 sm:px-2.5 py-0.5 sm:py-1 rounded-full shadow-sm whitespace-nowrap">
            {totalFound} SPOTS
          </span>
        </div>
      </div>
    </div>
  );
}
