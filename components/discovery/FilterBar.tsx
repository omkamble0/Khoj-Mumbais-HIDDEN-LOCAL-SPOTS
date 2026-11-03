'use client';

import React, { useRef, useState, useEffect, useCallback } from 'react';
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
  ChevronLeft,
  ChevronRight,
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
  const categoryScrollRef = useRef<HTMLDivElement>(null);
  const tierScrollRef = useRef<HTMLDivElement>(null);

  const [catScrollProgress, setCatScrollProgress] = useState(0);
  const [tierScrollProgress, setTierScrollProgress] = useState(0);
  const [canScrollCatLeft, setCanScrollCatLeft] = useState(false);
  const [canScrollCatRight, setCanScrollCatRight] = useState(true);
  const [canScrollTierLeft, setCanScrollTierLeft] = useState(false);
  const [canScrollTierRight, setCanScrollTierRight] = useState(true);

  // Monitor Category horizontal scroll position
  const updateCatScroll = useCallback(() => {
    if (!categoryScrollRef.current) return;
    const { scrollLeft, scrollWidth, clientWidth } = categoryScrollRef.current;
    const maxScroll = scrollWidth - clientWidth;
    if (maxScroll > 0) {
      setCatScrollProgress(Math.min(1, Math.max(0, scrollLeft / maxScroll)));
      setCanScrollCatLeft(scrollLeft > 4);
      setCanScrollCatRight(scrollLeft < maxScroll - 4);
    } else {
      setCatScrollProgress(0);
      setCanScrollCatLeft(false);
      setCanScrollCatRight(false);
    }
  }, []);

  // Monitor Tier horizontal scroll position
  const updateTierScroll = useCallback(() => {
    if (!tierScrollRef.current) return;
    const { scrollLeft, scrollWidth, clientWidth } = tierScrollRef.current;
    const maxScroll = scrollWidth - clientWidth;
    if (maxScroll > 0) {
      setTierScrollProgress(Math.min(1, Math.max(0, scrollLeft / maxScroll)));
      setCanScrollTierLeft(scrollLeft > 4);
      setCanScrollTierRight(scrollLeft < maxScroll - 4);
    } else {
      setTierScrollProgress(0);
      setCanScrollTierLeft(false);
      setCanScrollTierRight(false);
    }
  }, []);

  useEffect(() => {
    updateCatScroll();
    updateTierScroll();
    window.addEventListener('resize', updateCatScroll);
    window.addEventListener('resize', updateTierScroll);
    return () => {
      window.removeEventListener('resize', updateCatScroll);
      window.removeEventListener('resize', updateTierScroll);
    };
  }, [updateCatScroll, updateTierScroll]);

  const slideCategories = (offset: number) => {
    if (categoryScrollRef.current) {
      categoryScrollRef.current.scrollBy({ left: offset, behavior: 'smooth' });
    }
  };

  const slideTiers = (offset: number) => {
    if (tierScrollRef.current) {
      tierScrollRef.current.scrollBy({ left: offset, behavior: 'smooth' });
    }
  };

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
  const tierDragHandlers = attachDragScroll(tierScrollRef, updateTierScroll);

  return (
    <div className="bg-wabi/95 backdrop-blur-md p-2.5 sm:p-3.5 rounded-2xl border-2 border-sumi shadow-riso font-sans space-y-2 sm:space-y-2.5 select-none">
      {/* 1. All Spots / Category Horizontal Menu Bar */}
      <div className="relative group/cat">
        {/* Left Arrow Sliding Button */}
        {canScrollCatLeft && (
          <button
            onClick={() => slideCategories(-200)}
            className="absolute -left-1.5 top-1/2 -translate-y-1/2 z-20 w-6 h-6 sm:w-7 sm:h-7 rounded-full bg-wabi border border-sumi shadow-riso-sm flex items-center justify-center text-sumi hover:bg-amber-100 hover:scale-105 transition-all"
            title="Slide left"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
        )}

        {/* Right Arrow Sliding Button */}
        {canScrollCatRight && (
          <button
            onClick={() => slideCategories(200)}
            className="absolute -right-1.5 top-1/2 -translate-y-1/2 z-20 w-6 h-6 sm:w-7 sm:h-7 rounded-full bg-wabi border border-sumi shadow-riso-sm flex items-center justify-center text-sumi hover:bg-amber-100 hover:scale-105 transition-all"
            title="Slide right"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        )}

        {/* Horizontal Scrolling Pill Strip */}
        <div
          ref={categoryScrollRef}
          onScroll={updateCatScroll}
          {...catDragHandlers}
          className="sliding-bar flex items-center gap-1.5 sm:gap-2 overflow-x-auto pb-1.5 scroll-smooth cursor-grab active:cursor-grabbing"
        >
          {CATEGORIES.map((cat) => {
            const isActive = filters.category === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => onChange({ category: cat.id })}
                className={`flex items-center gap-1.5 sm:gap-2 px-2.5 sm:px-3.5 py-1.5 sm:py-2 rounded-xl text-xs font-mono font-bold whitespace-nowrap transition-all duration-150 border-2 flex-shrink-0 ${
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

        {/* Tactile Horizontal Sliding Progress Bar */}
        <div className="w-full px-1 pt-1 flex items-center gap-1.5">
          <div className="flex-1 h-1 bg-sumi/10 rounded-full overflow-hidden relative">
            <div
              className="h-full bg-vermilion rounded-full transition-all duration-100 ease-out shadow-sm"
              style={{
                width: '30%',
                transform: `translateX(${catScrollProgress * 233.3}%)`,
              }}
            />
          </div>
          <span className="text-[9px] font-mono font-bold text-slate-500 uppercase tracking-widest hidden sm:inline">
            SLIDE ↔
          </span>
        </div>
      </div>

      {/* 2. All Tiers & Radius Horizontal Menu Bar */}
      <div className="relative border-t border-sumi/15 pt-2">
        {/* Left Arrow Sliding Button for Tiers */}
        {canScrollTierLeft && (
          <button
            onClick={() => slideTiers(-160)}
            className="absolute -left-1.5 top-1/2 -translate-y-1/2 z-20 w-5 h-5 sm:w-6 sm:h-6 rounded-full bg-wabi border border-sumi shadow-riso-sm flex items-center justify-center text-sumi hover:bg-amber-100 hover:scale-105 transition-all"
            title="Slide left"
          >
            <ChevronLeft className="w-3.5 h-3.5" />
          </button>
        )}

        {/* Right Arrow Sliding Button for Tiers */}
        {canScrollTierRight && (
          <button
            onClick={() => slideTiers(160)}
            className="absolute -right-1.5 top-1/2 -translate-y-1/2 z-20 w-5 h-5 sm:w-6 sm:h-6 rounded-full bg-wabi border border-sumi shadow-riso-sm flex items-center justify-center text-sumi hover:bg-amber-100 hover:scale-105 transition-all"
            title="Slide right"
          >
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        )}

        {/* Horizontal Scrolling Tiers & Radius Row */}
        <div
          ref={tierScrollRef}
          onScroll={updateTierScroll}
          {...tierDragHandlers}
          className="sliding-bar flex items-center justify-between gap-2 overflow-x-auto pb-1.5 text-xs scroll-smooth cursor-grab active:cursor-grabbing"
        >
          {/* Tier Selector (Hidden vs Underrated vs Iconic) */}
          <div className="flex items-center gap-1 sm:gap-1.5 flex-shrink-0">
            {SPOT_TIERS.map((tier) => (
              <button
                key={tier.id}
                onClick={() => onChange({ spotTier: tier.id })}
                className={`px-2 sm:px-3 py-1 rounded-lg text-[11px] sm:text-xs font-mono font-bold whitespace-nowrap border transition-colors flex-shrink-0 ${
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
          <div className="flex items-center gap-2 sm:gap-2.5 font-mono flex-shrink-0 ml-auto">
            <div className="flex items-center gap-1 sm:gap-1.5">
              <span className="text-[10px] sm:text-xs font-bold text-slate-600 uppercase hidden xs:inline">
                RADIUS:
              </span>
              {RADII.map((r) => (
                <button
                  key={r}
                  onClick={() => onChange({ radiusKm: r })}
                  className={`px-1.5 sm:px-2.5 py-0.5 sm:py-1 rounded-md font-mono text-[11px] sm:text-xs font-bold border transition-colors flex-shrink-0 ${
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

        {/* Tactile Horizontal Sliding Progress Bar for Tiers */}
        <div className="w-full px-1 pt-1">
          <div className="h-1 bg-sumi/10 rounded-full overflow-hidden relative">
            <div
              className="h-full bg-sumi rounded-full transition-all duration-100 ease-out shadow-sm"
              style={{
                width: '40%',
                transform: `translateX(${tierScrollProgress * 150}%)`,
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
