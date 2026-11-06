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
  ChevronLeft,
  ChevronRight,
  SlidersHorizontal,
  ChevronDown,
  ChevronUp,
  RotateCcw,
  X,
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

const BUDGET_TIERS: { id: BudgetTier; label: string; desc: string }[] = [
  { id: 'all', label: 'All Budgets', desc: 'All sanctuaries' },
  { id: 'free', label: '₹0 Free', desc: 'Promenades, parks, viewpoints & forts' },
  { id: 'pocket_friendly', label: '₹ Pocket Friendly', desc: 'Chai tapris, Irani cafes, street buys & cheap pints' },
  { id: 'moderate', label: '₹₹ ₹300–800', desc: 'Suburban diners, permit rooms & courtyard cafes' },
  { id: 'splurge', label: '₹₹₹ Splurge (₹800+)', desc: 'Specialty roasteries, craft dens & lounges' },
];

const RADII = [10, 25, 50, 120];

export default function FilterBar({ filters, onChange, totalFound }: FilterBarProps) {
  const categoryScrollRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const [isFilterDrawerOpen, setIsFilterDrawerOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [canScrollCatLeft, setCanScrollCatLeft] = useState(false);
  const [canScrollCatRight, setCanScrollCatRight] = useState(true);

  // Monitor Category horizontal scroll position
  const updateCatScroll = useCallback(() => {
    if (!categoryScrollRef.current) return;
    const { scrollLeft, scrollWidth, clientWidth } = categoryScrollRef.current;
    const maxScroll = scrollWidth - clientWidth;
    if (maxScroll > 0) {
      setCanScrollCatLeft(scrollLeft > 4);
      setCanScrollCatRight(scrollLeft < maxScroll - 4);
    } else {
      setCanScrollCatLeft(false);
      setCanScrollCatRight(false);
    }
  }, []);

  useEffect(() => {
    updateCatScroll();
    window.addEventListener('resize', updateCatScroll);
    return () => {
      window.removeEventListener('resize', updateCatScroll);
    };
  }, [updateCatScroll]);

  // Click outside to close drawer
  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsFilterDrawerOpen(false);
      }
    };
    if (isFilterDrawerOpen) {
      document.addEventListener('mousedown', handleOutsideClick);
    }
    return () => {
      document.removeEventListener('mousedown', handleOutsideClick);
    };
  }, [isFilterDrawerOpen]);

  const slideCategories = (offset: number) => {
    if (categoryScrollRef.current) {
      categoryScrollRef.current.scrollBy({ left: offset, behavior: 'smooth' });
    }
  };

  const activeFilterCount =
    (filters.spotTier !== 'all' ? 1 : 0) +
    (filters.budget !== 'all' ? 1 : 0) +
    (filters.radiusKm !== 120 ? 1 : 0);

  const currentCategoryObj = CATEGORIES.find((c) => c.id === filters.category) || CATEGORIES[0];

  // Drag-to-slide mouse interaction
  const attachDragScroll = (ref: React.RefObject<HTMLDivElement>, onScrollUpdate: () => void) => {
    let isDown = false;
    let startX = 0;
    let scrollLeft = 0;

    return {
      onMouseDown: (e: React.MouseEvent) => {
        if (!ref.current) return;
        isDown = true;
        startX = e.pageX - ref.current.offsetLeft;
        scrollLeft = ref.current.scrollLeft;
      },
      onMouseLeave: () => {
        isDown = false;
      },
      onMouseUp: () => {
        isDown = false;
      },
      onMouseMove: (e: React.MouseEvent) => {
        if (!isDown || !ref.current) return;
        e.preventDefault();
        const x = e.pageX - ref.current.offsetLeft;
        const walk = (x - startX) * 1.5;
        ref.current.scrollLeft = scrollLeft - walk;
        onScrollUpdate();
      },
    };
  };

  const catDragHandlers = attachDragScroll(categoryScrollRef, updateCatScroll);

  return (
    <div ref={containerRef} className="relative font-sans select-none max-w-full">
      {/* 1. Minimized Mode: Takes zero space on the map */}
      {isMinimized ? (
        <button
          onClick={() => setIsMinimized(false)}
          className="flex items-center gap-2 px-3 py-2 bg-wabi/95 backdrop-blur-md rounded-2xl border-2 border-sumi shadow-riso hover:bg-white text-sumi text-xs font-mono font-bold transition-all hover:scale-105 active:scale-95"
          title="Expand filter bar"
        >
          <span className="w-2 h-2 rounded-full bg-vermilion" />
          <span className="uppercase">{currentCategoryObj.label}</span>
          <span className="text-slate-400">·</span>
          <span className="text-amber-700 font-black">{totalFound} SPOTS</span>
          {activeFilterCount > 0 && (
            <span className="px-1.5 py-0.5 rounded-full bg-amber-400 text-sumi text-[10px] font-black">
              {activeFilterCount} Active
            </span>
          )}
          <SlidersHorizontal className="w-3.5 h-3.5 ml-1 text-slate-700" />
        </button>
      ) : (
        /* 2. Compact Active Bar: Ultra-slim single row with expandable filter popover */
        <div className="bg-wabi/95 backdrop-blur-md p-1.5 sm:p-2 rounded-2xl border-2 border-sumi shadow-riso font-sans space-y-1.5">
          {/* Main Horizontal Row (~36px height) */}
          <div className="flex items-center gap-1.5 sm:gap-2">
            {/* Scrollable Categories Strip */}
            <div className="relative flex-1 min-w-0 flex items-center">
              {canScrollCatLeft && (
                <button
                  onClick={() => slideCategories(-150)}
                  className="absolute left-0 top-1/2 -translate-y-1/2 z-20 w-5 h-5 rounded-full bg-wabi border border-sumi shadow-sm flex items-center justify-center text-sumi hover:bg-wabi-200"
                  title="Scroll left"
                >
                  <ChevronLeft className="w-3 h-3" />
                </button>
              )}

              <div
                ref={categoryScrollRef}
                onScroll={updateCatScroll}
                {...catDragHandlers}
                className="sliding-bar flex items-center gap-1 sm:gap-1.5 overflow-x-auto scroll-smooth py-0.5 px-0.5 cursor-grab active:cursor-grabbing"
              >
                {CATEGORIES.map((cat) => {
                  const isActive = filters.category === cat.id;
                  return (
                    <button
                      key={cat.id}
                      onClick={() => onChange({ category: cat.id })}
                      className={`flex items-center gap-1 sm:gap-1.5 px-2.5 py-1 sm:py-1.5 rounded-xl text-[11px] sm:text-xs font-mono font-bold whitespace-nowrap transition-all border flex-shrink-0 ${
                        isActive
                          ? 'bg-sumi text-wabi border-sumi shadow-sm'
                          : 'bg-wabi-100 text-sumi border-sumi/25 hover:border-sumi hover:bg-wabi-200'
                      }`}
                    >
                      {cat.icon}
                      <span className="tracking-wide">{cat.label}</span>
                    </button>
                  );
                })}
              </div>

              {canScrollCatRight && (
                <button
                  onClick={() => slideCategories(150)}
                  className="absolute right-0 top-1/2 -translate-y-1/2 z-20 w-5 h-5 rounded-full bg-wabi border border-sumi shadow-sm flex items-center justify-center text-sumi hover:bg-wabi-200"
                  title="Scroll right"
                >
                  <ChevronRight className="w-3 h-3" />
                </button>
              )}
            </div>

            {/* Quick Filters Toggle Button */}
            <button
              onClick={() => setIsFilterDrawerOpen((prev) => !prev)}
              className={`flex items-center gap-1.5 px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-xl text-[11px] sm:text-xs font-mono font-bold whitespace-nowrap border-2 transition-all flex-shrink-0 active:scale-95 ${
                isFilterDrawerOpen || activeFilterCount > 0
                  ? 'bg-amber-400 text-sumi border-sumi shadow-riso-sm font-black'
                  : 'bg-wabi-100 text-sumi border-sumi/30 hover:bg-white hover:border-sumi'
              }`}
              title="Filter by Budget, Tier & Distance"
            >
              <SlidersHorizontal className="w-3.5 h-3.5" />
              <span className="hidden xs:inline">FILTERS</span>
              {activeFilterCount > 0 && (
                <span className="w-4 h-4 rounded-full bg-sumi text-wabi text-[10px] flex items-center justify-center font-mono font-bold">
                  {activeFilterCount}
                </span>
              )}
              <ChevronDown
                className={`w-3 h-3 transition-transform ${isFilterDrawerOpen ? 'rotate-180' : ''}`}
              />
            </button>

            {/* Spot Counter Pill */}
            <div className="hidden md:flex items-center px-2 py-1 rounded-xl bg-wabi-200 border border-sumi/30 text-[10px] font-mono font-bold text-sumi whitespace-nowrap flex-shrink-0">
              ● {totalFound}
            </div>

            {/* Minimize to Pill Button */}
            <button
              onClick={() => {
                setIsMinimized(true);
                setIsFilterDrawerOpen(false);
              }}
              className="p-1 rounded-xl text-slate-500 hover:text-sumi hover:bg-wabi-200 transition-colors flex-shrink-0"
              title="Minimize filter bar to see full map"
            >
              <ChevronUp className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* 3. Expandable Dropdown Tray (Only opens when user clicks FILTERS) */}
          {isFilterDrawerOpen && (
            <div className="pt-2 border-t border-sumi/20 space-y-2 animate-in fade-in duration-100">
              {/* Row A: Budget / Price Filter */}
              <div className="flex items-center gap-1.5 text-xs font-mono overflow-x-auto sliding-bar pb-0.5">
                <span className="text-[10px] font-bold text-slate-600 uppercase flex items-center gap-1 mr-1 flex-shrink-0">
                  <Coins className="w-3 h-3 text-amber-600" />
                  <span>BUDGET:</span>
                </span>
                {BUDGET_TIERS.map((tier) => {
                  const isActive = filters.budget === tier.id;
                  return (
                    <button
                      key={tier.id}
                      onClick={() => onChange({ budget: tier.id })}
                      className={`px-2 py-0.5 sm:py-1 rounded-lg text-[10px] sm:text-[11px] font-mono font-bold whitespace-nowrap border transition-all flex-shrink-0 ${
                        isActive
                          ? 'bg-amber-400 text-sumi border-sumi shadow-sm font-black'
                          : 'bg-wabi-100 text-slate-700 border-sumi/20 hover:border-sumi hover:bg-wabi-200'
                      }`}
                      title={tier.desc}
                    >
                      {tier.label}
                    </button>
                  );
                })}
              </div>

              {/* Row B: Tier & Distance Radius */}
              <div className="flex flex-wrap sm:flex-nowrap items-center justify-between gap-2 text-xs font-mono pt-1.5 border-t border-sumi/10">
                {/* Tiers */}
                <div className="flex items-center gap-1 flex-shrink-0">
                  <span className="text-[10px] font-bold text-slate-600 uppercase mr-1">TIER:</span>
                  {SPOT_TIERS.map((tier) => (
                    <button
                      key={tier.id}
                      onClick={() => onChange({ spotTier: tier.id })}
                      className={`px-2 py-0.5 rounded-lg text-[10px] font-mono font-bold whitespace-nowrap border transition-colors flex-shrink-0 ${
                        filters.spotTier === tier.id
                          ? 'bg-sumi text-wabi border-sumi shadow-sm'
                          : 'bg-wabi-100 text-slate-700 border-sumi/20 hover:border-sumi hover:bg-wabi-200'
                      }`}
                    >
                      {tier.label}
                    </button>
                  ))}
                </div>

                {/* Radius Filter & Reset All */}
                <div className="flex items-center gap-2 flex-shrink-0 ml-auto">
                  <div className="flex items-center gap-1">
                    <span className="text-[10px] font-bold text-slate-600 uppercase">RADIUS:</span>
                    {RADII.map((r) => (
                      <button
                        key={r}
                        onClick={() => onChange({ radiusKm: r })}
                        className={`px-1.5 py-0.5 rounded font-mono text-[10px] font-bold border transition-colors flex-shrink-0 ${
                          filters.radiusKm === r
                            ? 'bg-vermilion text-white border-sumi shadow-sm'
                            : 'bg-wabi-100 text-slate-700 border-sumi/20 hover:border-sumi hover:bg-wabi-200'
                        }`}
                      >
                        {r >= 120 ? 'All' : `${r}km`}
                      </button>
                    ))}
                  </div>

                  {activeFilterCount > 0 && (
                    <button
                      onClick={() => onChange({ budget: 'all', spotTier: 'all', radiusKm: 120 })}
                      className="flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-mono font-bold text-vermilion hover:bg-vermilion/10 border border-vermilion/30 transition-colors"
                      title="Reset all filters to default"
                    >
                      <RotateCcw className="w-2.5 h-2.5" />
                      <span>RESET</span>
                    </button>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
