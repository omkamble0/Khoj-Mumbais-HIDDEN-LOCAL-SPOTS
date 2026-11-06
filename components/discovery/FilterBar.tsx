'use client';

import React, { useRef, useState, useEffect, useCallback } from 'react';
import { PlaceCategory, FilterState, SpotTier, BudgetTier } from '@/lib/types';
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
  Coins,
  SlidersHorizontal,
  ChevronLeft,
  ChevronRight,
  RotateCcw,
  X,
  Check,
} from 'lucide-react';

interface FilterBarProps {
  filters: FilterState;
  onChange: (updated: Partial<FilterState>) => void;
  totalFound: number;
}

const CATEGORIES: { id: PlaceCategory; label: string; icon: React.ReactNode }[] = [
  { id: 'all', label: 'All Sanctuaries', icon: <Compass className="w-3.5 h-3.5" /> },
  { id: 'cafes', label: 'Cafés & Chai', icon: <Coffee className="w-3.5 h-3.5" /> },
  { id: 'bars', label: 'Permit Rooms & Bars', icon: <Wine className="w-3.5 h-3.5" /> },
  { id: 'forts', label: 'Forts & Ruins', icon: <Shield className="w-3.5 h-3.5" /> },
  { id: 'walks', label: 'Quiet Walks', icon: <Footprints className="w-3.5 h-3.5" /> },
  { id: 'treks', label: 'Volcanic Treks', icon: <Mountain className="w-3.5 h-3.5" /> },
  { id: 'gardens', label: 'Botanical Gardens', icon: <Flower2 className="w-3.5 h-3.5" /> },
  { id: 'viewpoints', label: 'Secret Viewpoints', icon: <Eye className="w-3.5 h-3.5" /> },
  { id: 'waterfront', label: 'Seafaces & Tanks', icon: <Droplets className="w-3.5 h-3.5" /> },
  { id: 'heritage', label: 'Living Heritage', icon: <Landmark className="w-3.5 h-3.5" /> },
  { id: 'books', label: 'Book Nooks & Libs', icon: <BookOpen className="w-3.5 h-3.5" /> },
  { id: 'culture', label: 'Art & Culture', icon: <Palette className="w-3.5 h-3.5" /> },
  { id: 'spiritual', label: 'Sacred Havens', icon: <Sparkles className="w-3.5 h-3.5" /> },
  { id: 'bazaars', label: 'Historic Bazaars', icon: <ShoppingBag className="w-3.5 h-3.5" /> },
];

const SPOT_TIERS: { id: SpotTier; label: string; badge: string; desc: string }[] = [
  { id: 'all', label: 'All Tiers', badge: 'ALL', desc: 'Every curated sanctuary' },
  { id: 'hidden_gem', label: '✦ Hidden Gems', badge: 'HIDDEN', desc: 'Under-the-radar, zero commercial footprint' },
  { id: 'underrated', label: '● Underrated', badge: 'QUIET', desc: 'Overlooked local sanctuaries with deep character' },
  { id: 'iconic', label: '★ Iconic Classics', badge: 'ICONIC', desc: 'Timeless Mumbai institutions with legendary vibes' },
];

const BUDGET_TIERS: { id: BudgetTier; label: string; badge: string; desc: string; icon: string }[] = [
  { id: 'all', label: 'All Budgets', badge: 'ALL', desc: 'All spending levels', icon: '🪙' },
  { id: 'free', label: '₹0 Free Spots', badge: 'FREE', desc: 'Public seafaces, parks, viewpoints & forts', icon: '🌿' },
  { id: 'pocket_friendly', label: '₹ Under ₹300', badge: '<₹300', desc: 'Chai tapris, Irani tea houses, cheap pints', icon: '☕' },
  { id: 'moderate', label: '₹₹ ₹300–800', badge: 'MID', desc: 'Suburban diners, casual bars, courtyard cafes', icon: '🍽️' },
  { id: 'splurge', label: '₹₹₹ ₹800+ Splurge', badge: 'SPLURGE', desc: 'Specialty roasteries, craft cocktail dens', icon: '✨' },
];

const RADII = [
  { km: 10, label: '10 km' },
  { km: 25, label: '25 km' },
  { km: 50, label: '50 km' },
  { km: 120, label: 'All MMR' },
];

export default function FilterBar({ filters, onChange, totalFound }: FilterBarProps) {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const filterIslandRef = useRef<HTMLDivElement>(null);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  // Active filter count (excluding default 'all' category)
  const activeSecondaryCount =
    (filters.spotTier !== 'all' ? 1 : 0) +
    (filters.budget !== 'all' ? 1 : 0) +
    (filters.radiusKm !== 120 ? 1 : 0);

  // Monitor scroll position for edge fade indicators & arrows
  const checkScroll = useCallback(() => {
    if (!scrollContainerRef.current) return;
    const { scrollLeft, scrollWidth, clientWidth } = scrollContainerRef.current;
    setCanScrollLeft(scrollLeft > 6);
    setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 6);
  }, []);

  useEffect(() => {
    checkScroll();
    window.addEventListener('resize', checkScroll);
    return () => window.removeEventListener('resize', checkScroll);
  }, [checkScroll]);

  // Click outside to dismiss filter modal
  useEffect(() => {
    const handleOutside = (e: MouseEvent) => {
      if (filterIslandRef.current && !filterIslandRef.current.contains(e.target as Node)) {
        setIsModalOpen(false);
      }
    };
    if (isModalOpen) {
      document.addEventListener('mousedown', handleOutside);
    }
    return () => document.removeEventListener('mousedown', handleOutside);
  }, [isModalOpen]);

  const slide = (offset: number) => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: offset, behavior: 'smooth' });
    }
  };

  const handleResetFilters = () => {
    onChange({
      category: 'all',
      spotTier: 'all',
      budget: 'all',
      radiusKm: 120,
    });
  };

  // Find active tier & budget labels for quick display
  const activeTierObj = SPOT_TIERS.find((t) => t.id === filters.spotTier);
  const activeBudgetObj = BUDGET_TIERS.find((b) => b.id === filters.budget);

  return (
    <div ref={filterIslandRef} className="relative font-sans select-none w-full max-w-full">
      {/* ─────────────────────────────────────────────────────────────
          1. ELEGANT FLOATING ISLAND BAR (Slim, tactile, 48px height)
          ───────────────────────────────────────────────────────────── */}
      <div className="bg-wabi/95 backdrop-blur-md rounded-2xl border-2 border-sumi shadow-riso px-2 py-1.5 flex items-center gap-2 transition-all">
        {/* A. Dedicated Filter Studio Button */}
        <button
          onClick={() => setIsModalOpen((prev) => !prev)}
          className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-mono font-bold tracking-wide transition-all border-2 flex-shrink-0 active:scale-95 ${
            isModalOpen || activeSecondaryCount > 0
              ? 'bg-amber-400 text-sumi border-sumi shadow-riso-sm font-black'
              : 'bg-white text-sumi border-sumi/40 hover:border-sumi hover:bg-wabi-100'
          }`}
          title="Open Budget, Tier & Distance filters"
        >
          <SlidersHorizontal className="w-3.5 h-3.5 text-sumi" />
          <span className="hidden sm:inline">FILTERS</span>
          {activeSecondaryCount > 0 ? (
            <span className="px-1.5 py-0.2 rounded-full bg-sumi text-wabi text-[10px] font-mono font-black">
              {activeSecondaryCount}
            </span>
          ) : (
            <span className="text-[10px] text-slate-500 font-mono hidden xs:inline">▾</span>
          )}
        </button>

        {/* Vertical divider */}
        <div className="h-5 w-px bg-sumi/20 flex-shrink-0" />

        {/* B. Category Carousel Track with Gradient Fades */}
        <div className="relative flex-1 min-w-0 flex items-center">
          {/* Left Arrow Button */}
          {canScrollLeft && (
            <button
              onClick={() => slide(-180)}
              className="absolute left-0 top-1/2 -translate-y-1/2 z-20 w-6 h-6 rounded-full bg-wabi border border-sumi shadow-riso-sm flex items-center justify-center text-sumi hover:bg-white transition-all hover:scale-105"
              title="Scroll left"
            >
              <ChevronLeft className="w-3.5 h-3.5" />
            </button>
          )}

          {/* Scrolling Pills */}
          <div
            ref={scrollContainerRef}
            onScroll={checkScroll}
            className="sliding-bar flex items-center gap-1.5 overflow-x-auto scroll-smooth py-0.5 px-1 cursor-grab active:cursor-grabbing"
          >
            {CATEGORIES.map((cat) => {
              const isActive = filters.category === cat.id;
              return (
                <button
                  key={cat.id}
                  onClick={() => onChange({ category: cat.id })}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-mono font-bold whitespace-nowrap transition-all border flex-shrink-0 active:scale-95 ${
                    isActive
                      ? 'bg-sumi text-wabi border-sumi shadow-riso-sm font-black -translate-y-[1px]'
                      : 'bg-white/80 text-sumi border-sumi/25 hover:border-sumi hover:bg-white'
                  }`}
                >
                  <span className={isActive ? 'text-vermilion' : 'text-slate-600'}>{cat.icon}</span>
                  <span>{cat.label}</span>
                </button>
              );
            })}
          </div>

          {/* Right Arrow Button */}
          {canScrollRight && (
            <button
              onClick={() => slide(180)}
              className="absolute right-0 top-1/2 -translate-y-1/2 z-20 w-6 h-6 rounded-full bg-wabi border border-sumi shadow-riso-sm flex items-center justify-center text-sumi hover:bg-white transition-all hover:scale-105"
              title="Scroll right"
            >
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Vertical divider */}
        <div className="h-5 w-px bg-sumi/20 flex-shrink-0 hidden md:block" />

        {/* C. Live Sanctuary Counter */}
        <div className="hidden md:flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-wabi-200 border border-sumi/30 text-[11px] font-mono font-bold text-sumi whitespace-nowrap flex-shrink-0">
          <span className="w-1.5 h-1.5 rounded-full bg-vermilion animate-pulse" />
          <span>{totalFound} SPOTS</span>
        </div>
      </div>

      {/* ─────────────────────────────────────────────────────────────
          2. ACTIVE FILTER QUICK CHIPS (Only appears when filters are on)
          ───────────────────────────────────────────────────────────── */}
      {activeSecondaryCount > 0 && (
        <div className="mt-1.5 flex items-center gap-1.5 overflow-x-auto sliding-bar py-0.5 px-1">
          <span className="text-[10px] font-mono font-bold uppercase text-slate-600 flex-shrink-0">
            Active Filters:
          </span>

          {filters.budget !== 'all' && (
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-lg bg-amber-100 border border-amber-400 text-amber-900 text-[11px] font-mono font-bold flex-shrink-0 shadow-sm">
              <span>{activeBudgetObj?.icon} {activeBudgetObj?.label}</span>
              <button
                onClick={() => onChange({ budget: 'all' })}
                className="hover:text-vermilion ml-0.5"
                title="Remove budget filter"
              >
                <X className="w-3 h-3" />
              </button>
            </span>
          )}

          {filters.spotTier !== 'all' && (
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-lg bg-indigo-50 border border-indigo-300 text-indigo-900 text-[11px] font-mono font-bold flex-shrink-0 shadow-sm">
              <span>{activeTierObj?.label}</span>
              <button
                onClick={() => onChange({ spotTier: 'all' })}
                className="hover:text-vermilion ml-0.5"
                title="Remove tier filter"
              >
                <X className="w-3 h-3" />
              </button>
            </span>
          )}

          {filters.radiusKm !== 120 && (
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-lg bg-rose-50 border border-rose-300 text-rose-900 text-[11px] font-mono font-bold flex-shrink-0 shadow-sm">
              <span>Within {filters.radiusKm}km</span>
              <button
                onClick={() => onChange({ radiusKm: 120 })}
                className="hover:text-vermilion ml-0.5"
                title="Reset radius"
              >
                <X className="w-3 h-3" />
              </button>
            </span>
          )}

          <button
            onClick={handleResetFilters}
            className="text-[10px] font-mono font-bold text-vermilion hover:underline ml-1 flex-shrink-0"
          >
            Clear All
          </button>
        </div>
      )}

      {/* ─────────────────────────────────────────────────────────────
          3. CURATOR'S FILTER STUDIO (Pop-down Modal / Floating Card)
          ───────────────────────────────────────────────────────────── */}
      {isModalOpen && (
        <div className="absolute top-full left-0 mt-2 w-full sm:max-w-xl bg-wabi rounded-3xl border-2 border-sumi shadow-riso p-4 sm:p-5 z-50 animate-in fade-in slide-in-from-top-2 duration-150 space-y-4">
          {/* Header Row */}
          <div className="flex items-center justify-between pb-3 border-b-2 border-sumi/15">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-sumi text-wabi flex items-center justify-center">
                <SlidersHorizontal className="w-3.5 h-3.5" />
              </div>
              <div>
                <h3 className="font-mono font-black text-xs sm:text-sm text-sumi uppercase tracking-wider">
                  Filter Sanctuaries
                </h3>
                <span className="text-[11px] font-mono text-slate-500">
                  Refine by pocket budget, obscurity tier & travel radius
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              {activeSecondaryCount > 0 && (
                <button
                  onClick={handleResetFilters}
                  className="flex items-center gap-1 text-[11px] font-mono font-bold text-vermilion hover:bg-vermilion/10 px-2 py-1 rounded-lg border border-vermilion/30 transition-colors"
                >
                  <RotateCcw className="w-3 h-3" />
                  <span>RESET</span>
                </button>
              )}
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1 rounded-lg text-slate-500 hover:text-sumi hover:bg-wabi-200 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Section 1: Budget & Pocket Guide */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs font-mono">
              <span className="font-bold text-sumi flex items-center gap-1.5">
                <Coins className="w-3.5 h-3.5 text-amber-600" />
                <span>1. BUDGET & SPENDING TIER</span>
              </span>
              <span className="text-[10px] text-slate-500 uppercase">
                {activeBudgetObj?.desc || 'Filter by cost'}
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-1.5">
              {BUDGET_TIERS.map((tier) => {
                const isActive = filters.budget === tier.id;
                return (
                  <button
                    key={tier.id}
                    onClick={() => onChange({ budget: tier.id })}
                    className={`p-2.5 rounded-xl border text-left transition-all relative ${
                      isActive
                        ? 'bg-amber-400 border-sumi text-sumi shadow-riso-sm font-bold'
                        : 'bg-white hover:bg-wabi-100 border-sumi/25 text-slate-800'
                    }`}
                  >
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-bold">{tier.icon} {tier.label}</span>
                      {isActive && <Check className="w-3 h-3 text-sumi" />}
                    </div>
                    <div className="text-[10px] text-slate-600 font-mono mt-0.5 line-clamp-1">
                      {tier.desc}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Section 2: Obscurity & Spot Tier */}
          <div className="space-y-2 pt-1 border-t border-sumi/15">
            <div className="flex items-center justify-between text-xs font-mono">
              <span className="font-bold text-sumi flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
                <span>2. OBSCURITY & TIER</span>
              </span>
              <span className="text-[10px] text-slate-500 uppercase">
                {activeTierObj?.desc || 'Select obscurity'}
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5 font-mono">
              {SPOT_TIERS.map((tier) => {
                const isActive = filters.spotTier === tier.id;
                return (
                  <button
                    key={tier.id}
                    onClick={() => onChange({ spotTier: tier.id })}
                    className={`py-2 px-2.5 rounded-xl border text-center transition-all ${
                      isActive
                        ? 'bg-sumi text-wabi border-sumi shadow-sm font-bold'
                        : 'bg-white hover:bg-wabi-100 border-sumi/25 text-slate-800 text-xs'
                    }`}
                  >
                    <div className="text-xs font-bold truncate">{tier.label}</div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Section 3: Proximity Radius */}
          <div className="space-y-2 pt-1 border-t border-sumi/15">
            <div className="flex items-center justify-between text-xs font-mono">
              <span className="font-bold text-sumi flex items-center gap-1.5">
                <Compass className="w-3.5 h-3.5 text-matcha" />
                <span>3. TRAVEL RADIUS</span>
              </span>
              <span className="text-[10px] text-slate-500 uppercase">
                Distance cutoff from Mumbai center
              </span>
            </div>

            <div className="grid grid-cols-4 gap-1.5 font-mono">
              {RADII.map((r) => {
                const isActive = filters.radiusKm === r.km;
                return (
                  <button
                    key={r.km}
                    onClick={() => onChange({ radiusKm: r.km })}
                    className={`py-2 rounded-xl border text-center font-bold text-xs transition-all ${
                      isActive
                        ? 'bg-vermilion text-white border-sumi shadow-sm'
                        : 'bg-white hover:bg-wabi-100 border-sumi/25 text-slate-800'
                    }`}
                  >
                    {r.label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Footer Submit CTA */}
          <div className="pt-2 border-t-2 border-sumi/15 flex items-center justify-between gap-3">
            <div className="text-xs font-mono text-slate-600">
              <span className="font-black text-sumi text-sm">{totalFound}</span> SANCTUARIES MATCHED
            </div>

            <button
              onClick={() => setIsModalOpen(false)}
              className="px-5 py-2.5 rounded-xl bg-sumi hover:bg-vermilion text-wabi text-xs font-mono font-bold tracking-wider transition-all shadow-riso hover:shadow-riso-sm active:scale-95"
            >
              EXPLORE RESULTS ➔
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
