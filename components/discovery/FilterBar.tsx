'use client';

import React, { useRef, useState, useEffect, useCallback } from 'react';
import {
  PlaceCategory,
  FilterState,
  SpotTier,
  BudgetTier,
  TransitAccessFilter,
  TransitFilterMode,
} from '@/lib/types';
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
  AlertCircle,
  Train,
  Zap,
} from 'lucide-react';
import { TRANSIT_FILTER_CHIPS } from '@/components/map/DiscoveryMap';
import TactileSliderBar from '@/components/transit/TactileSliderBar';

interface FilterBarProps {
  filters: FilterState;
  onChange: (updated: Partial<FilterState>) => void;
  totalFound: number;
  showPlacesOverlay?: boolean;
  onTogglePlacesOverlay?: () => void;
  showTransitOverlay?: boolean;
  onToggleTransitOverlay?: (show: boolean) => void;
}

interface CategoryConfig {
  id: PlaceCategory;
  label: string;
  marathi: string;
  icon: React.ReactNode;
  primary: string;
  secondary: string;
  border: string;
  vibe: string;
}

const CATEGORIES: CategoryConfig[] = [
  {
    id: 'all',
    label: 'All Sanctuaries',
    marathi: 'सर्व ठिकाणे',
    icon: <Compass className="w-3.5 h-3.5" />,
    primary: '#141518',
    secondary: '#FDFBF7',
    border: '#141518',
    vibe: 'Every curated Mumbai sanctuary',
  },
  {
    id: 'bars',
    label: 'Permit Rooms & Bars',
    marathi: 'परमिट रूम • बार',
    icon: <Wine className="w-3.5 h-3.5" />,
    primary: '#9B1B30',
    secondary: '#F4B41A',
    border: '#9B1B30',
    vibe: 'Deep Crimson & Mustard: Late-night quarters & retro-dives',
  },
  {
    id: 'cafes',
    label: 'Cafés & Chai',
    marathi: 'इराणी कॅफे • कटिंग चहा',
    icon: <Coffee className="w-3.5 h-3.5" />,
    primary: '#C85A17',
    secondary: '#FDF5E6',
    border: '#C85A17',
    vibe: 'Cutting Chai Orange & Cream: Bun maska & Irani nostalgia',
  },
  {
    id: 'forts',
    label: 'Forts & Ruins',
    marathi: 'किल्ले • बुरुज',
    icon: <Shield className="w-3.5 h-3.5" />,
    primary: '#8B4513',
    secondary: '#708090',
    border: '#8B4513',
    vibe: 'Rusted Iron & Slate: Weathered coastal ramparts & cannons',
  },
  {
    id: 'walks',
    label: 'Quiet Walks',
    marathi: 'शांत पायवाटा',
    icon: <Footprints className="w-3.5 h-3.5" />,
    primary: '#CD5C5C',
    secondary: '#EEDD82',
    border: '#CD5C5C',
    vibe: 'Terracotta Brown: Gaothan lanes & village heritage trails',
  },
  {
    id: 'treks',
    label: 'Volcanic Treks',
    marathi: 'डोंगर वाटा • ट्रेक्स',
    icon: <Mountain className="w-3.5 h-3.5" />,
    primary: '#556B2F',
    secondary: '#8A3324',
    border: '#556B2F',
    vibe: 'Olive Khaki & Burnt Sienna: Yeoor Hills & volcanic trails',
  },
  {
    id: 'gardens',
    label: 'Botanical Gardens',
    marathi: 'वनस्पती उद्यान',
    icon: <Flower2 className="w-3.5 h-3.5" />,
    primary: '#2E7D32',
    secondary: '#FFF9C4',
    border: '#2E7D32',
    vibe: 'Betel Leaf Green & Pale Lemon: Botanical illustrations',
  },
  {
    id: 'viewpoints',
    label: 'Secret Viewpoints',
    marathi: 'सूर्यास्त कडा • दृश्य',
    icon: <Eye className="w-3.5 h-3.5" />,
    primary: '#A11950',
    secondary: '#DAA520',
    border: '#A11950',
    vibe: 'Sunset Magenta & Goldenrod: Cliff sunsets & skyline views',
  },
  {
    id: 'waterfront',
    label: 'Seafaces & Tanks',
    marathi: 'समुद्रकिनारा • तलाव',
    icon: <Droplets className="w-3.5 h-3.5" />,
    primary: '#008080',
    secondary: '#F08080',
    border: '#008080',
    vibe: 'Vintage Teal & Coral: Breezy coastal shores & historic tanks',
  },
  {
    id: 'heritage',
    label: 'Living Heritage',
    marathi: 'ऐतिहासिक वारसा',
    icon: <Landmark className="w-3.5 h-3.5" />,
    primary: '#283593',
    secondary: '#F0E6D2',
    border: '#283593',
    vibe: 'Royal Indigo & Parchment: Colonial blueprints & stone arches',
  },
  {
    id: 'books',
    label: 'Book Nooks & Libs',
    marathi: 'ग्रंथ दालन • पुस्तके',
    icon: <BookOpen className="w-3.5 h-3.5" />,
    primary: '#800020',
    secondary: '#FFD700',
    border: '#800020',
    vibe: 'Antique Burgundy & Gold: Quiet corners & vintage paper scent',
  },
  {
    id: 'culture',
    label: 'Art & Culture',
    marathi: 'कला दालन • संस्कृती',
    icon: <Palette className="w-3.5 h-3.5" />,
    primary: '#E91E63',
    secondary: '#1A237E',
    border: '#E91E63',
    vibe: 'Rani Pink & Deep Navy: Pop-art contrast & subculture spaces',
  },
  {
    id: 'spiritual',
    label: 'Sacred Havens',
    marathi: 'आध्यात्मिक शांतता',
    icon: <Sparkles className="w-3.5 h-3.5" />,
    primary: '#D84315',
    secondary: '#FFB300',
    border: '#D84315',
    vibe: 'Marigold Yellow & Deep Saffron: Temple bells & quiet dargahs',
  },
  {
    id: 'bazaars',
    label: 'Historic Bazaars',
    marathi: 'ऐतिहासिक बाजार',
    icon: <ShoppingBag className="w-3.5 h-3.5" />,
    primary: '#212121',
    secondary: '#FFCC00',
    border: '#212121',
    vibe: 'Rickshaw Yellow & Matte Black: Flea chaos & vintage antiquities',
  },
];

const SPOT_TIERS: { id: SpotTier; label: string; badge: string; desc: string }[] = [
  { id: 'all', label: 'All Curation Tiers', badge: 'ALL', desc: 'Every curated sanctuary' },
  { id: 'hidden_gem', label: '✦ Hidden Gems', badge: 'HIDDEN', desc: 'Under-the-radar, zero commercial footprint' },
  { id: 'underrated', label: '● Underrated', badge: 'QUIET', desc: 'Overlooked local spots with deep character' },
  { id: 'iconic', label: '★ Iconic Classics', badge: 'ICONIC', desc: 'Timeless Mumbai institutions with legendary history' },
];

const DESI_BUDGET_TIERS: {
  id: BudgetTier;
  label: string;
  stampText: string;
  slang: string;
  desc: string;
  icon: string;
  accentBg: string;
  accentText: string;
  stampBorder: string;
}[] = [
  {
    id: 'all',
    label: 'All Budgets',
    stampText: '₹ ANY',
    slang: 'All Pockets',
    desc: 'All spending ranges',
    icon: '🪙',
    accentBg: 'bg-wabi',
    accentText: 'text-sumi',
    stampBorder: 'border-sumi/40',
  },
  {
    id: 'free',
    label: '₹0 Fukat (Free)',
    stampText: '₹ FUKAT',
    slang: 'Kadak Budget',
    desc: 'Public seafaces, parks, viewpoints & ruins',
    icon: '🌿',
    accentBg: 'bg-emerald-500 text-white',
    accentText: 'text-emerald-800',
    stampBorder: 'border-emerald-600',
  },
  {
    id: 'pocket_friendly',
    label: '₹ Pocket Friendly',
    stampText: '₹ KADAK',
    slang: 'Under ₹300',
    desc: 'Chai tapris, Irani cafes, cheap pints',
    icon: '☕',
    accentBg: 'bg-amber-400 text-sumi',
    accentText: 'text-amber-900',
    stampBorder: 'border-amber-600',
  },
  {
    id: 'moderate',
    label: '₹₹ Paisa Vasool',
    stampText: '₹₹ VASOOL',
    slang: '₹300–800',
    desc: 'Suburban diners, casual resto-bars, courtyard cafes',
    icon: '🍽️',
    accentBg: 'bg-orange-500 text-white',
    accentText: 'text-orange-950',
    stampBorder: 'border-orange-600',
  },
  {
    id: 'splurge',
    label: '₹₹₹ Bhaari Pockets',
    stampText: '₹₹₹ BHAARI',
    slang: '₹800+ Splurge',
    desc: 'Sea-facing lounges, craft roasteries & bespoke bars',
    icon: '✨',
    accentBg: 'bg-rose-700 text-white',
    accentText: 'text-rose-950',
    stampBorder: 'border-rose-700',
  },
];

const RADII = [
  { km: 10, label: '10 km', desc: 'Walking, cycling & neighbourhood bubble' },
  { km: 25, label: '25 km', desc: 'Core Town & Suburbs (South & Bandra hub)' },
  { km: 50, label: '50 km', desc: 'Greater Mumbai, Thane & Navi Mumbai' },
  { km: 120, label: 'All MMR', desc: 'Full Mumbai Metropolitan Region' },
];

const TRANSIT_ACCESS_OPTIONS: { id: TransitAccessFilter; label: string; badge: string; desc: string; icon: string }[] = [
  { id: 'all', label: 'Any Transit Distance', badge: 'ANY DISTANCE', desc: 'Show all locations regardless of transit', icon: '🧭' },
  { id: 'walkable_transit', label: 'Quick Walk (<800m)', badge: '<800m BRISK WALK', desc: 'Under 8–10 min brisk walk to transit', icon: '🚶' },
  { id: 'near_metro', label: 'Near Metro (<1km)', badge: '<1km METRO', desc: 'Under 10-12 min walk to nearest Metro', icon: '🚇' },
  { id: 'near_railway', label: 'Near Local Train (<1km)', badge: '<1km LOCAL TRAIN', desc: 'Under 10-12 min walk to Railway station', icon: '🚆' },
];

interface QuickPreset {
  id: string;
  label: string;
  icon: string;
  badge: string;
  filters: Partial<FilterState>;
}

const QUICK_PRESETS: QuickPreset[] = [
  {
    id: 'sobo_dive_crawl',
    label: 'SoBo Dive Crawl',
    icon: '🍺',
    badge: 'BUDGET DIVE',
    filters: { category: 'bars', budget: 'pocket_friendly', transitLine: 'western' },
  },
  {
    id: 'irani_nostalgia',
    label: 'Irani Chai Nostalgia',
    icon: '☕',
    badge: 'RETRO CHAI',
    filters: { category: 'cafes', budget: 'pocket_friendly' },
  },
  {
    id: 'fukat_escape',
    label: 'Zero-Rupee Havens',
    icon: '🌿',
    badge: '₹0 FUKAT',
    filters: { budget: 'free', radiusKm: 25 },
  },
  {
    id: 'metro_3_crawl',
    label: 'Aqua Line 3 Crawl',
    icon: '🚇',
    badge: 'METRO 3 AQUA',
    filters: { transitLine: 'metro_3', transitAccess: 'walkable_transit' },
  },
  {
    id: 'pure_hidden_gems',
    label: 'Pure Hidden Gems',
    icon: '✦',
    badge: 'ZERO COMMERCE',
    filters: { spotTier: 'hidden_gem' },
  },
];

type StudioTab = 'transit' | 'budget' | 'category' | 'radius';

export default function FilterBar({
  filters,
  onChange,
  totalFound,
  showPlacesOverlay = true,
  onTogglePlacesOverlay,
  showTransitOverlay = false,
  onToggleTransitOverlay,
}: FilterBarProps) {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const filterIslandRef = useRef<HTMLDivElement>(null);
  const studioChipsRef = useRef<HTMLDivElement>(null);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<StudioTab>('transit');
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  // Tab-specific active filter counts
  const transitActiveCount =
    (filters.transitLine && filters.transitLine !== 'all' ? 1 : 0) +
    (filters.transitAccess && filters.transitAccess !== 'all' ? 1 : 0);

  const budgetActiveCount =
    (filters.budget !== 'all' ? 1 : 0) +
    (filters.spotTier !== 'all' ? 1 : 0);

  const categoryActiveCount = filters.category !== 'all' ? 1 : 0;
  const radiusActiveCount = filters.radiusKm !== 120 ? 1 : 0;

  // Active filter count (excluding default 'all' category)
  const activeSecondaryCount =
    transitActiveCount + budgetActiveCount + radiusActiveCount + (filters.category !== 'all' ? 1 : 0);

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

  // Click outside to dismiss filter modal & Escape key support
  useEffect(() => {
    const handleOutside = (e: MouseEvent) => {
      if (filterIslandRef.current && !filterIslandRef.current.contains(e.target as Node)) {
        setIsModalOpen(false);
      }
    };
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsModalOpen(false);
      }
    };

    if (isModalOpen) {
      document.addEventListener('mousedown', handleOutside);
      document.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      document.removeEventListener('mousedown', handleOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
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
      transitAccess: 'all',
      transitLine: 'all',
    });
  };

  // Find active tier, budget, transit & line labels for quick display
  const activeTierObj = SPOT_TIERS.find((t) => t.id === filters.spotTier);
  const activeBudgetObj = DESI_BUDGET_TIERS.find((b) => b.id === filters.budget);
  const activeTransitObj = TRANSIT_ACCESS_OPTIONS.find((t) => t.id === filters.transitAccess);
  const activeLineObj = TRANSIT_FILTER_CHIPS.find((c) => c.id === filters.transitLine);

  return (
    <div ref={filterIslandRef} className="relative font-sans select-none w-full max-w-full">
      {/* ─────────────────────────────────────────────────────────────
          1. ELEGANT FLOATING ISLAND BAR (Tactile, 48px height)
          ───────────────────────────────────────────────────────────── */}
      <div className="bg-wabi/95 backdrop-blur-md rounded-2xl border-2 border-sumi shadow-riso px-2 py-1.5 flex items-center gap-2 transition-all">
        {/* A. Dedicated Filter Studio Button */}
        <button
          onClick={() => setIsModalOpen((prev) => !prev)}
          className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-mono font-bold tracking-wide transition-all border-2 flex-shrink-0 active:scale-95 ${
            isModalOpen || activeSecondaryCount > 0
              ? 'bg-amber-400 text-sumi border-sumi shadow-riso-sm font-black'
              : 'bg-white text-sumi border-sumi/40 hover:border-sumi hover:bg-wabi-100 hover:-translate-y-0.5'
          }`}
          title="Open complete filters (Transit corridors, Budget, Curation & Distance)"
        >
          <SlidersHorizontal className="w-3.5 h-3.5 text-sumi" />
          <span className="hidden sm:inline">FILTERS</span>
          {activeSecondaryCount > 0 ? (
            <span className="px-1.5 py-0.2 rounded-full bg-sumi text-wabi text-[10px] font-mono font-black animate-pulse">
              {activeSecondaryCount}
            </span>
          ) : (
            <span className="text-[10px] text-slate-500 font-mono hidden xs:inline">▾</span>
          )}
        </button>

        {/* Vertical divider */}
        <div className="h-5 w-px bg-sumi/20 flex-shrink-0" />

        {/* B. Category Carousel Track with Authentic Color Schemes */}
        <div className="relative flex-1 min-w-0 flex items-center overflow-hidden">
          {canScrollLeft && (
            <div className="absolute left-0 top-0 bottom-0 w-8 bg-gradient-to-r from-wabi/90 to-transparent pointer-events-none z-10" />
          )}

          {canScrollLeft && (
            <button
              onClick={() => slide(-180)}
              className="absolute left-0 top-1/2 -translate-y-1/2 z-20 w-6 h-6 rounded-full bg-wabi border border-sumi shadow-riso-sm flex items-center justify-center text-sumi hover:bg-white transition-all hover:scale-105 active:scale-95"
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
                  style={
                    isActive
                      ? {
                          backgroundColor: cat.primary,
                          borderColor: '#141518',
                          color: cat.secondary,
                        }
                      : {
                          borderColor: 'rgba(20, 21, 24, 0.25)',
                        }
                  }
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-mono font-bold whitespace-nowrap transition-all border-2 flex-shrink-0 active:scale-95 ${
                    isActive
                      ? 'shadow-riso-sm font-black -translate-y-[1px]'
                      : 'bg-white/90 text-sumi hover:border-sumi hover:bg-white hover:-translate-y-0.5'
                  }`}
                  title={`${cat.label} • ${cat.vibe}`}
                >
                  <span style={{ color: isActive ? cat.secondary : cat.primary }}>{cat.icon}</span>
                  <span>{cat.label}</span>
                </button>
              );
            })}
          </div>

          {canScrollRight && (
            <div className="absolute right-0 top-0 bottom-0 w-8 bg-gradient-to-l from-wabi/90 to-transparent pointer-events-none z-10" />
          )}

          {canScrollRight && (
            <button
              onClick={() => slide(180)}
              className="absolute right-0 top-1/2 -translate-y-1/2 z-20 w-6 h-6 rounded-full bg-wabi border border-sumi shadow-riso-sm flex items-center justify-center text-sumi hover:bg-white transition-all hover:scale-105 active:scale-95"
              title="Scroll right"
            >
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Vertical divider */}
        <div className="h-5 w-px bg-sumi/20 flex-shrink-0 hidden md:block" />

        {/* C. Live Sanctuary Counter Pill / Interactive ON-OFF Spot Toggle */}
        <button
          type="button"
          onClick={onTogglePlacesOverlay}
          disabled={!onTogglePlacesOverlay}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border-2 font-mono text-[11px] font-bold whitespace-nowrap flex-shrink-0 transition-all select-none shadow-riso-sm active:scale-95 ${
            onTogglePlacesOverlay ? 'cursor-pointer hover:shadow-riso hover:-translate-y-0.5' : 'cursor-default'
          } ${
            showPlacesOverlay
              ? 'bg-wabi border-sumi text-sumi hover:bg-white hover:border-vermilion'
              : 'bg-slate-200/90 border-slate-400 text-slate-500 hover:bg-slate-200'
          }`}
          title={
            onTogglePlacesOverlay
              ? showPlacesOverlay
                ? 'Spots Layer: ON (Click to toggle OFF)'
                : 'Spots Layer: OFF (Click to toggle ON)'
              : `${totalFound} spots in database`
          }
        >
          <span
            className={`w-2 h-2 rounded-full transition-colors ${
              showPlacesOverlay ? 'bg-vermilion animate-pulse' : 'bg-slate-400'
            }`}
          />
          <span className={showPlacesOverlay ? '' : 'line-through opacity-75'}>
            {totalFound} SPOTS
          </span>
          {onTogglePlacesOverlay && (
            <span
              className={`text-[9px] px-1.5 py-0.2 rounded font-black tracking-wide transition-all ${
                showPlacesOverlay
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'bg-slate-400 text-white'
              }`}
            >
              {showPlacesOverlay ? 'ON' : 'OFF'}
            </span>
          )}
        </button>
      </div>

      {/* ─────────────────────────────────────────────────────────────
          2. ACTIVE FILTER QUICK CHIPS (Visible whenever filters are on)
          ───────────────────────────────────────────────────────────── */}
      {activeSecondaryCount > 0 && (
        <div className="mt-1.5 flex items-center gap-1.5 overflow-x-auto sliding-bar py-0.5 px-1 animate-in fade-in duration-100">
          <span className="text-[10px] font-mono font-bold uppercase text-slate-600 flex-shrink-0">
            Active:
          </span>

          {filters.category !== 'all' && (
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-lg bg-sumi text-wabi text-[11px] font-mono font-bold flex-shrink-0 shadow-sm">
              <span>{CATEGORIES.find((c) => c.id === filters.category)?.label}</span>
              <button
                onClick={() => onChange({ category: 'all' })}
                className="hover:text-vermilion hover:scale-110 transition-transform ml-0.5"
                title="Remove category filter"
              >
                <X className="w-3 h-3" />
              </button>
            </span>
          )}

          {filters.transitLine && filters.transitLine !== 'all' && (
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-lg bg-teal-800 text-white text-[11px] font-mono font-bold flex-shrink-0 shadow-sm">
              <span>
                {filters.transitLine === 'local' && '🚆 Local Trains'}
                {filters.transitLine === 'metro' && '🚇 Metro Lines'}
                {activeLineObj && `${activeLineObj.code} ${activeLineObj.name}`}
              </span>
              <button
                onClick={() => onChange({ transitLine: 'all' })}
                className="hover:text-amber-300 hover:scale-110 transition-transform ml-0.5"
                title="Remove transit line filter"
              >
                <X className="w-3 h-3" />
              </button>
            </span>
          )}

          {filters.transitAccess && filters.transitAccess !== 'all' && (
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-lg bg-teal-50 border border-teal-300 text-teal-950 text-[11px] font-mono font-bold flex-shrink-0 shadow-sm">
              <span>{activeTransitObj?.icon} {activeTransitObj?.label}</span>
              <button
                onClick={() => onChange({ transitAccess: 'all' })}
                className="hover:text-vermilion hover:scale-110 transition-transform ml-0.5"
                title="Remove transit proximity filter"
              >
                <X className="w-3 h-3" />
              </button>
            </span>
          )}

          {filters.budget !== 'all' && (
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-lg bg-amber-100 border border-amber-400 text-amber-950 text-[11px] font-mono font-bold flex-shrink-0 shadow-sm">
              <span>{activeBudgetObj?.icon} {activeBudgetObj?.label}</span>
              <button
                onClick={() => onChange({ budget: 'all' })}
                className="hover:text-vermilion hover:scale-110 transition-transform ml-0.5"
                title="Remove budget filter"
              >
                <X className="w-3 h-3" />
              </button>
            </span>
          )}

          {filters.spotTier !== 'all' && (
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-lg bg-indigo-50 border border-indigo-300 text-indigo-950 text-[11px] font-mono font-bold flex-shrink-0 shadow-sm">
              <span>{activeTierObj?.label}</span>
              <button
                onClick={() => onChange({ spotTier: 'all' })}
                className="hover:text-vermilion hover:scale-110 transition-transform ml-0.5"
                title="Remove tier filter"
              >
                <X className="w-3 h-3" />
              </button>
            </span>
          )}

          {filters.radiusKm !== 120 && (
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-lg bg-rose-50 border border-rose-300 text-rose-950 text-[11px] font-mono font-bold flex-shrink-0 shadow-sm">
              <span>Within {filters.radiusKm}km</span>
              <button
                onClick={() => onChange({ radiusKm: 120 })}
                className="hover:text-vermilion hover:scale-110 transition-transform ml-0.5"
                title="Reset radius"
              >
                <X className="w-3 h-3" />
              </button>
            </span>
          )}

          <button
            onClick={handleResetFilters}
            className="text-[10px] font-mono font-bold text-vermilion hover:underline ml-1 flex-shrink-0 uppercase"
          >
            Clear All
          </button>
        </div>
      )}

      {/* ─────────────────────────────────────────────────────────────
          3. CURATOR'S COMPACT FILTER STUDIO (Smart, Tabbed, Elevated)
          ───────────────────────────────────────────────────────────── */}
      {isModalOpen && (
        <>
          {/* Subtle backdrop overlay for distraction-free focus */}
          <div
            onClick={() => setIsModalOpen(false)}
            className="fixed inset-0 bg-sumi/25 backdrop-blur-[2px] z-40 transition-opacity animate-in fade-in duration-150"
          />

          <div className="absolute top-full left-0 mt-2 w-full sm:max-w-xl bg-wabi rounded-3xl border-2 border-sumi shadow-riso shadow-2xl shadow-sumi/25 p-3.5 sm:p-4 z-50 animate-in fade-in slide-in-from-top-2 duration-150 flex flex-col gap-2.5">
            {/* Header Row */}
            <div className="flex items-center justify-between pb-2 border-b-2 border-sumi/15">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-sumi text-wabi flex items-center justify-center shadow-sm">
                  <SlidersHorizontal className="w-3.5 h-3.5" />
                </div>
                <div>
                  <h3 className="font-mono font-black text-xs sm:text-sm text-sumi uppercase tracking-wider">
                    FILTERS & CURATION PREFERENCES
                  </h3>
                  <span className="text-[10px] font-mono text-slate-500">
                    Custom permutations: transit corridors, desi budgets & zones
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-1.5">
                {activeSecondaryCount > 0 && (
                  <button
                    onClick={handleResetFilters}
                    className="flex items-center gap-1 text-[10px] font-mono font-bold text-vermilion hover:bg-vermilion/10 px-2 py-1 rounded-lg border border-vermilion/30 transition-colors"
                  >
                    <RotateCcw className="w-3 h-3" />
                    <span>RESET</span>
                  </button>
                )}
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="p-1 rounded-lg text-slate-500 hover:text-sumi hover:bg-wabi-200 transition-colors"
                  title="Close (Esc)"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Quick Curator Presets (One-click Bombay vibes) */}
            <div className="flex items-center gap-1.5 overflow-x-auto sliding-bar pb-1 pt-0.5 select-none">
              <span className="text-[10px] font-mono font-black text-sumi uppercase flex-shrink-0 flex items-center gap-1">
                <Zap className="w-3 h-3 text-amber-500 fill-amber-500" />
                PRESETS:
              </span>
              {QUICK_PRESETS.map((preset) => (
                <button
                  key={preset.id}
                  onClick={() => onChange(preset.filters)}
                  className="px-2.5 py-1 rounded-xl border border-sumi/30 bg-white hover:bg-amber-100 hover:border-sumi text-slate-800 text-[10px] font-mono font-bold whitespace-nowrap flex-shrink-0 transition-all active:scale-95 shadow-xs"
                >
                  <span>{preset.icon} {preset.label}</span>
                </button>
              ))}
            </div>

            {/* Smart Segmented Switcher (Compact 4-tab bar) */}
            <div className="grid grid-cols-4 gap-1 p-1 rounded-xl bg-sumi/5 border border-sumi/20 font-mono text-xs font-bold select-none">
              <button
                type="button"
                onClick={() => setActiveTab('transit')}
                className={`py-1.5 px-1 rounded-lg flex items-center justify-center gap-1 transition-all text-[11px] ${
                  activeTab === 'transit'
                    ? 'bg-sumi text-wabi shadow-sm font-black'
                    : 'text-slate-700 hover:bg-white/60'
                }`}
              >
                <span>🚆 TRANSIT</span>
                {transitActiveCount > 0 && (
                  <span className="w-4 h-4 rounded-full bg-vermilion text-white text-[9px] flex items-center justify-center font-black">
                    {transitActiveCount}
                  </span>
                )}
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('budget')}
                className={`py-1.5 px-1 rounded-lg flex items-center justify-center gap-1 transition-all text-[11px] ${
                  activeTab === 'budget'
                    ? 'bg-sumi text-wabi shadow-sm font-black'
                    : 'text-slate-700 hover:bg-white/60'
                }`}
              >
                <span>🪙 BUDGET</span>
                {budgetActiveCount > 0 && (
                  <span className="w-4 h-4 rounded-full bg-vermilion text-white text-[9px] flex items-center justify-center font-black">
                    {budgetActiveCount}
                  </span>
                )}
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('category')}
                className={`py-1.5 px-1 rounded-lg flex items-center justify-center gap-1 transition-all text-[11px] ${
                  activeTab === 'category'
                    ? 'bg-sumi text-wabi shadow-sm font-black'
                    : 'text-slate-700 hover:bg-white/60'
                }`}
              >
                <span>🎯 SPOTS</span>
                {categoryActiveCount > 0 && (
                  <span className="w-4 h-4 rounded-full bg-vermilion text-white text-[9px] flex items-center justify-center font-black">
                    {categoryActiveCount}
                  </span>
                )}
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('radius')}
                className={`py-1.5 px-1 rounded-lg flex items-center justify-center gap-1 transition-all text-[11px] ${
                  activeTab === 'radius'
                    ? 'bg-sumi text-wabi shadow-sm font-black'
                    : 'text-slate-700 hover:bg-white/60'
                }`}
              >
                <span>🧭 RADIUS</span>
                {radiusActiveCount > 0 && (
                  <span className="w-4 h-4 rounded-full bg-vermilion text-white text-[9px] flex items-center justify-center font-black">
                    {radiusActiveCount}
                  </span>
                )}
              </button>
            </div>

            {/* Tab Panel Body (Compact height ~235px) */}
            <div className="min-h-[225px] max-h-[265px] overflow-y-auto no-scrollbar py-0.5 space-y-3">
              {/* ─────────────────────────────────────────────────────────────
                  TAB 1: 🚆 TRANSIT & CORRIDORS
                  ───────────────────────────────────────────────────────────── */}
              {activeTab === 'transit' && (
                <div className="space-y-3 animate-in fade-in duration-100">
                  {/* 1. Quick Mode Row */}
                  <div className="space-y-1">
                    <div className="flex items-center justify-between text-[11px] font-mono font-bold text-sumi">
                      <span>1. TRANSIT NETWORK MODE</span>
                      <span className="text-[10px] text-slate-500 font-normal">
                        {filters.transitLine === 'local' && 'Suburban locals (WR, CR, HR)'}
                        {filters.transitLine === 'metro' && 'Metro corridors (Lines 1–7, NMM)'}
                        {(!filters.transitLine || filters.transitLine === 'all') && 'All transit networks'}
                      </span>
                    </div>
                    <div className="grid grid-cols-3 gap-1.5 font-mono text-xs">
                      <button
                        type="button"
                        onClick={() => onChange({ transitLine: 'all' })}
                        className={`py-1.5 px-2 rounded-xl border-2 font-bold transition-all text-center ${
                          !filters.transitLine || filters.transitLine === 'all'
                            ? 'bg-sumi text-wabi border-sumi shadow-riso-sm'
                            : 'bg-white text-slate-800 border-sumi/30 hover:bg-wabi-100'
                        }`}
                      >
                        ALL LINES
                      </button>
                      <button
                        type="button"
                        onClick={() => onChange({ transitLine: 'local' })}
                        className={`py-1.5 px-2 rounded-xl border-2 font-bold transition-all text-center ${
                          filters.transitLine === 'local'
                            ? 'bg-rose-700 text-white border-sumi shadow-riso-sm'
                            : 'bg-white text-slate-800 border-sumi/30 hover:bg-rose-50'
                        }`}
                      >
                        🚆 LOCALS
                      </button>
                      <button
                        type="button"
                        onClick={() => onChange({ transitLine: 'metro' })}
                        className={`py-1.5 px-2 rounded-xl border-2 font-bold transition-all text-center ${
                          filters.transitLine === 'metro'
                            ? 'bg-teal-700 text-white border-sumi shadow-riso-sm'
                            : 'bg-white text-slate-800 border-sumi/30 hover:bg-teal-50'
                        }`}
                      >
                        🚇 METROS
                      </button>
                    </div>
                  </div>

                  {/* 2. Specific Line Corridors with Tactile Slider Bar */}
                  <div className="space-y-1 pt-1 border-t border-sumi/10">
                    <div className="flex items-center justify-between text-[11px] font-mono font-bold text-sumi">
                      <span>2. SPECIFIC LINE CORRIDORS</span>
                      <span className="text-[10px] text-slate-500 font-normal">
                        {activeLineObj ? activeLineObj.name : 'Glide horizontally to pick a line'}
                      </span>
                    </div>

                    <div
                      ref={studioChipsRef}
                      onWheel={(e) => {
                        if (e.deltaY !== 0 && studioChipsRef.current) {
                          studioChipsRef.current.scrollLeft += e.deltaY;
                        }
                      }}
                      className="flex items-center gap-1.5 overflow-x-auto sliding-bar py-1 select-none"
                    >
                      {TRANSIT_FILTER_CHIPS.map((chip) => {
                        const isActive = filters.transitLine === chip.id;
                        return (
                          <button
                            key={chip.id}
                            type="button"
                            onClick={() => onChange({ transitLine: isActive ? 'all' : chip.id })}
                            className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl text-xs font-mono font-bold whitespace-nowrap border-2 transition-all flex-shrink-0 active:scale-95 ${
                              isActive
                                ? 'bg-sumi text-wabi border-sumi font-black -translate-y-0.5 shadow-riso-sm'
                                : 'bg-white text-slate-900 border-sumi/30 hover:border-sumi hover:bg-wabi-100'
                            }`}
                            title={`Filter by ${chip.name} (${chip.code})`}
                          >
                            <span
                              className="w-2.5 h-2.5 rounded-full border border-black/30 flex-shrink-0 shadow-xs"
                              style={{ backgroundColor: chip.color }}
                            />
                            <span className="font-black tracking-wide">{chip.code}</span>
                            <span className={`text-[11px] font-sans font-medium hidden xs:inline ${isActive ? 'text-wabi/90' : 'text-slate-600'}`}>
                              {chip.name.split(' ')[0]}
                            </span>
                          </button>
                        );
                      })}
                    </div>

                    {/* Horizontal Sliding Bar below Western Railway and line chips */}
                    <TactileSliderBar
                      containerRef={studioChipsRef}
                      variant="lines"
                      accentColor={
                        TRANSIT_FILTER_CHIPS.find((c) => c.id === filters.transitLine)?.sliderAccent || 'bg-sumi'
                      }
                      trackLabel="Transit Line Slider"
                      className="mt-0.5 mb-1"
                    />
                  </div>

                  {/* 3. Commute Walkability Proximity */}
                  <div className="space-y-1 pt-1 border-t border-sumi/10">
                    <div className="flex items-center justify-between text-[11px] font-mono font-bold text-sumi">
                      <span>3. COMMUTE WALKABILITY</span>
                      <span className="text-[10px] text-slate-500 font-normal">
                        {activeTransitObj?.desc || 'Distance from station'}
                      </span>
                    </div>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5 font-mono text-[11px]">
                      {TRANSIT_ACCESS_OPTIONS.map((opt) => {
                        const isActive = (filters.transitAccess || 'all') === opt.id;
                        return (
                          <button
                            key={opt.id}
                            type="button"
                            onClick={() => onChange({ transitAccess: opt.id })}
                            className={`py-1.5 px-2 rounded-xl border text-center transition-all truncate font-bold ${
                              isActive
                                ? 'bg-teal-700 text-white border-sumi shadow-xs'
                                : 'bg-white text-slate-700 border-sumi/25 hover:bg-teal-50'
                            }`}
                          >
                            {opt.icon} {opt.badge}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* 4. Map Overlay Quick Toggle */}
                  {onToggleTransitOverlay && (
                    <div className="pt-1 flex items-center justify-between text-xs font-mono border-t border-sumi/10">
                      <span className="text-slate-700 font-bold flex items-center gap-1.5">
                        <Train className="w-3.5 h-3.5 text-rose-600" />
                        <span>Transit Tracks & Lines On Map Canvas</span>
                      </span>
                      <button
                        type="button"
                        onClick={() => onToggleTransitOverlay(!showTransitOverlay)}
                        className={`px-3 py-1 rounded-xl border-2 text-xs font-bold font-mono transition-all active:scale-95 ${
                          showTransitOverlay
                            ? 'bg-amber-400 text-sumi border-sumi shadow-riso-sm'
                            : 'bg-slate-200 text-slate-600 border-slate-300 hover:bg-slate-300'
                        }`}
                      >
                        {showTransitOverlay ? 'ON (VISIBLE)' : 'OFF (HIDDEN)'}
                      </button>
                    </div>
                  )}
                </div>
              )}

              {/* ─────────────────────────────────────────────────────────────
                  TAB 2: 🪙 DESI BUDGET & OBSCURITY TIERS
                  ───────────────────────────────────────────────────────────── */}
              {activeTab === 'budget' && (
                <div className="space-y-3 animate-in fade-in duration-100">
                  {/* 1. Spending & Budget Tiers with Desi Stamps */}
                  <div className="space-y-1">
                    <div className="flex items-center justify-between text-[11px] font-mono font-bold text-sumi">
                      <span>1. DESI BUDGET & TICKET STAMP</span>
                      <span className="text-[10px] text-slate-500 font-normal">
                        {activeBudgetObj?.desc || 'Spending indicator'}
                      </span>
                    </div>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-1.5">
                      {DESI_BUDGET_TIERS.map((tier) => {
                        const isActive = filters.budget === tier.id;
                        return (
                          <button
                            key={tier.id}
                            onClick={() => onChange({ budget: tier.id })}
                            className={`p-2 rounded-xl border-2 text-left transition-all ${
                              isActive
                                ? `${tier.accentBg} border-sumi shadow-riso-sm font-bold scale-[1.01]`
                                : 'bg-white hover:bg-wabi-100 border-sumi/25 text-slate-800'
                            }`}
                          >
                            <div className="flex items-center justify-between text-xs">
                              <span className="font-bold flex items-center gap-1">
                                <span>{tier.icon}</span>
                                <span>{tier.label}</span>
                              </span>
                              {isActive && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                            </div>
                            <div className="flex items-center justify-between text-[10px] font-mono mt-1">
                              <span className="opacity-90">{tier.slang}</span>
                              <span
                                className={`px-1 rounded border text-[9px] font-black ${
                                  isActive
                                    ? 'bg-white/20 border-white/40'
                                    : `${tier.stampBorder} ${tier.accentText}`
                                }`}
                              >
                                {tier.stampText}
                              </span>
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* 2. Obscurity & Spot Tier */}
                  <div className="space-y-1 pt-1 border-t border-sumi/10">
                    <div className="flex items-center justify-between text-[11px] font-mono font-bold text-sumi">
                      <span>2. OBSCURITY & CURATION TIER</span>
                      <span className="text-[10px] text-slate-500 font-normal">
                        {activeTierObj?.desc || 'Character & obscurity level'}
                      </span>
                    </div>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5 font-mono">
                      {SPOT_TIERS.map((tier) => {
                        const isActive = filters.spotTier === tier.id;
                        return (
                          <button
                            key={tier.id}
                            onClick={() => onChange({ spotTier: tier.id })}
                            className={`py-1.5 px-2 rounded-xl border-2 text-center transition-all ${
                              isActive
                                ? 'bg-sumi text-wabi border-sumi shadow-sm font-bold scale-[1.01]'
                                : 'bg-white hover:bg-wabi-100 border-sumi/25 text-slate-800 text-xs'
                            }`}
                          >
                            <div className="text-xs font-bold truncate">{tier.label}</div>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </div>
              )}

              {/* ─────────────────────────────────────────────────────────────
                  TAB 3: 🎯 CATEGORIES & SANCTUARY TYPES (Bespoke Colors)
                  ───────────────────────────────────────────────────────────── */}
              {activeTab === 'category' && (
                <div className="space-y-2 animate-in fade-in duration-100">
                  <div className="flex items-center justify-between text-[11px] font-mono font-bold text-sumi">
                    <span>CURATED SANCTUARY THEMES (14 CATEGORIES)</span>
                    <span className="text-[10px] text-slate-500 font-normal">
                      {filters.category === 'all'
                        ? 'Showing all categories'
                        : CATEGORIES.find((c) => c.id === filters.category)?.label}
                    </span>
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-1.5">
                    {CATEGORIES.map((cat) => {
                      const isActive = filters.category === cat.id;
                      return (
                        <button
                          key={cat.id}
                          onClick={() => onChange({ category: cat.id })}
                          style={
                            isActive
                              ? {
                                  backgroundColor: cat.primary,
                                  borderColor: '#141518',
                                  color: cat.secondary,
                                }
                              : undefined
                          }
                          className={`flex items-center gap-2 p-2 rounded-xl border-2 text-left transition-all ${
                            isActive
                              ? 'shadow-riso-sm font-black scale-[1.01]'
                              : 'bg-white hover:bg-wabi-100 border-sumi/25 text-slate-800 text-xs font-medium'
                          }`}
                        >
                          <span style={{ color: isActive ? cat.secondary : cat.primary }}>{cat.icon}</span>
                          <div className="truncate">
                            <div className="font-bold truncate text-xs">{cat.label}</div>
                            <div className="text-[9px] opacity-75 font-mono truncate">{cat.marathi}</div>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* ─────────────────────────────────────────────────────────────
                  TAB 4: 🧭 TRAVEL RADIUS & REGIONS
                  ───────────────────────────────────────────────────────────── */}
              {activeTab === 'radius' && (
                <div className="space-y-2 animate-in fade-in duration-100">
                  <div className="flex items-center justify-between text-[11px] font-mono font-bold text-sumi">
                    <span>DISTANCE CUTOFF FROM MUMBAI CENTER</span>
                    <span className="text-[10px] text-slate-500 font-normal">
                      {RADII.find((r) => r.km === filters.radiusKm)?.desc || 'Select travel range'}
                    </span>
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 font-mono">
                    {RADII.map((r) => {
                      const isActive = filters.radiusKm === r.km;
                      return (
                        <button
                          key={r.km}
                          onClick={() => onChange({ radiusKm: r.km })}
                          className={`p-2.5 rounded-xl border-2 text-left transition-all ${
                            isActive
                              ? 'bg-vermilion text-white border-sumi shadow-riso-sm font-bold scale-[1.01]'
                              : 'bg-white hover:bg-wabi-100 border-sumi/25 text-slate-800'
                          }`}
                        >
                          <div className="text-sm font-black">{r.label}</div>
                          <div className={`text-[10px] mt-0.5 line-clamp-1 ${isActive ? 'text-white/80' : 'text-slate-500'}`}>
                            {r.desc}
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>

            {/* Footer Submit CTA & Live Matches */}
            <div className="pt-2 border-t-2 border-sumi/15 flex items-center justify-between gap-3">
              <div className="text-xs font-mono text-slate-600">
                {totalFound === 0 ? (
                  <span className="text-rose-600 font-bold flex items-center gap-1">
                    <AlertCircle className="w-3.5 h-3.5" />
                    <span>0 MATCHES FOUND</span>
                  </span>
                ) : (
                  <>
                    <span className="font-black text-sumi text-sm">{totalFound}</span> SANCTUARIES MATCHED
                  </>
                )}
              </div>

              <div className="flex items-center gap-2">
                {totalFound === 0 && (
                  <button
                    onClick={handleResetFilters}
                    className="px-3 py-1.5 rounded-xl border border-sumi/40 bg-wabi-200 text-sumi text-xs font-mono font-bold hover:bg-wabi-300"
                  >
                    RESET
                  </button>
                )}
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-sumi hover:bg-vermilion text-wabi text-xs font-mono font-bold tracking-wider transition-all shadow-riso hover:shadow-riso-sm active:scale-95"
                >
                  EXPLORE RESULTS ➔
                </button>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
