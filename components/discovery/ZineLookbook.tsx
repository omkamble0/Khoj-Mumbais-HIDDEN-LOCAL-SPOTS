'use client';

import React, { useState } from 'react';
import { Place, FilterState } from '@/lib/types';
import { formatDistance } from '@/lib/scoring';
import { ArrowUpRight, ChevronLeft, ChevronRight, Zap, List, LayoutGrid, MapPin } from 'lucide-react';
import { getCurrentVibeWindow, checkIsPlacePeakingNow } from '@/lib/vibeRadar';

interface ZineLookbookProps {
  places: Place[];
  onSelectPlace: (place: Place) => void;
  filters: FilterState;
  onFilterChange: (updated: Partial<FilterState>) => void;
}

type CardViewSize = 'small' | 'medium';

const CATEGORY_STYLES: Record<string, { bg: string; text: string; border: string }> = {
  bars: { bg: '#9B1B30', text: '#F4B41A', border: '#141518' },
  cafes: { bg: '#C85A17', text: '#FDF5E6', border: '#141518' },
  gardens: { bg: '#2E7D32', text: '#FFF9C4', border: '#141518' },
  treks: { bg: '#556B2F', text: '#FDF5E6', border: '#141518' },
  waterfront: { bg: '#008080', text: '#F08080', border: '#141518' },
  viewpoints: { bg: '#A11950', text: '#DAA520', border: '#141518' },
  heritage: { bg: '#283593', text: '#F0E6D2', border: '#141518' },
  forts: { bg: '#8B4513', text: '#F0E6D2', border: '#141518' },
  walks: { bg: '#CD5C5C', text: '#EEDD82', border: '#141518' },
  spiritual: { bg: '#D84315', text: '#FFB300', border: '#141518' },
  culture: { bg: '#E91E63', text: '#FFFFFF', border: '#141518' },
  books: { bg: '#800020', text: '#FFD700', border: '#141518' },
  bazaars: { bg: '#212121', text: '#FFCC00', border: '#141518' },
};

function getBudgetStamp(tier?: string, cost?: string) {
  if (tier === 'free' || cost?.includes('₹0') || cost?.toLowerCase().includes('free')) {
    return { label: '₹ FUKAT', bg: 'bg-emerald-500 text-white border-emerald-600' };
  }
  if (tier === 'pocket_friendly' || cost?.includes('Pocket')) {
    return { label: '₹ KADAK', bg: 'bg-amber-400 text-sumi border-amber-600' };
  }
  if (tier === 'moderate' || cost?.includes('Vasool')) {
    return { label: '₹₹ VASOOL', bg: 'bg-orange-500 text-white border-orange-600' };
  }
  if (tier === 'splurge' || cost?.includes('Bhaari') || cost?.includes('Mehenga')) {
    return { label: '₹₹₹ BHAARI', bg: 'bg-rose-700 text-white border-rose-800' };
  }
  return { label: '₹ DESI', bg: 'bg-wabi text-sumi border-sumi/40' };
}

const FALLBACK_IMAGE =
  'https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=1000&auto=format&fit=crop&q=80';

export default function ZineLookbook({
  places,
  onSelectPlace,
}: ZineLookbookProps) {
  const [currentPage, setCurrentPage] = useState(1);
  const [viewSize, setViewSize] = useState<CardViewSize>('medium');

  const pageSize = 16;
  const totalPages = Math.max(1, Math.ceil(places.length / pageSize));
  const safeCurrentPage = Math.min(currentPage, totalPages);
  const startIndex = (safeCurrentPage - 1) * pageSize;
  const currentPlaces = places.slice(startIndex, startIndex + pageSize);

  const { window: currentWindow } = getCurrentVibeWindow();

  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="w-full px-2.5 sm:px-4 md:px-8 py-3 sm:py-6 bg-washi font-sans select-none">
      {/* ─────────────────────────────────────────────────────────────
          1. Compact Editorial Header Banner
          ───────────────────────────────────────────────────────────── */}
      <div className="max-w-7xl mx-auto mb-3 sm:mb-5 bg-sumi text-wabi p-3.5 sm:p-5 md:p-6 rounded-2xl border-2 border-sumi shadow-riso relative overflow-hidden">
        <div className="relative z-10 max-w-2xl">
          <div className="flex flex-wrap items-center gap-1.5 mb-1">
            <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-vermilion text-white tracking-wider uppercase">
              KHOJ LOOKBOOK
            </span>
            <span className="text-[10px] font-mono text-slate-300">
              {places.length} Hidden Sanctuaries Curated
            </span>
          </div>

          <h2 className="font-display font-normal text-2xl sm:text-3xl md:text-4xl tracking-wide text-wabi leading-tight mb-1">
            Get Lost. <span className="italic font-normal text-amber-300">Feel Found.</span>
          </h2>

          <p className="text-xs sm:text-sm text-slate-200 font-sans leading-relaxed line-clamp-2 sm:line-clamp-none">
            Curated quiet sanctuaries, Portuguese battlements engulfed by banyan roots, 66-million-year-old volcanic basalt columns, and sacred freshwater tanks.
          </p>
        </div>
      </div>

      {/* ─────────────────────────────────────────────────────────────
          2. Tactile View Size Selector (Small / Medium)
          ───────────────────────────────────────────────────────────── */}
      <div className="max-w-7xl mx-auto mb-3.5 flex items-center justify-between gap-2 border-b-2 border-sumi/15 pb-2 font-mono">
        <div className="text-xs text-slate-700 font-bold">
          SHOWING <span className="text-sumi font-black">{startIndex + 1}–{Math.min(startIndex + pageSize, places.length)}</span> OF <span className="text-sumi font-black">{places.length}</span> SPOTS
        </div>

        {/* View Size Controls: ONLY SMALL & MEDIUM */}
        <div className="flex items-center gap-1 bg-white border-2 border-sumi rounded-xl p-0.5 shadow-2xs">
          <button
            type="button"
            onClick={() => setViewSize('small')}
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-bold transition-all active:scale-95 ${
              viewSize === 'small'
                ? 'bg-sumi text-wabi shadow-sm font-black'
                : 'text-slate-600 hover:text-sumi'
            }`}
            title="Small List View (fits 5 spots per screen on phone)"
          >
            <List className="w-3.5 h-3.5" />
            <span className="text-[11px]">SMALL</span>
          </button>

          <button
            type="button"
            onClick={() => setViewSize('medium')}
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-bold transition-all active:scale-95 ${
              viewSize === 'medium'
                ? 'bg-sumi text-wabi shadow-sm font-black'
                : 'text-slate-600 hover:text-sumi'
            }`}
            title="Medium Grid View (2-column cards on phone)"
          >
            <LayoutGrid className="w-3.5 h-3.5" />
            <span className="text-[11px]">MEDIUM</span>
          </button>
        </div>
      </div>

      {/* ─────────────────────────────────────────────────────────────
          3. SIZABLE CARDS CONTAINER: SMALL & MEDIUM MODES
          ───────────────────────────────────────────────────────────── */}

      {/* MODE A: SMALL COMPACT LIST VIEW */}
      {viewSize === 'small' && (
        <div className="max-w-5xl mx-auto flex flex-col gap-2.5 pb-12">
          {currentPlaces.map((place) => {
            const stamp = getBudgetStamp(place.budget_tier, place.approx_cost);
            return (
              <article
                key={place.id}
                onClick={() => onSelectPlace(place)}
                className="group cursor-pointer bg-wabi hover:bg-white rounded-2xl border-2 border-sumi shadow-riso-sm hover:shadow-riso hover:-translate-y-0.5 transition-all p-2 sm:p-2.5 flex items-center gap-3 active:scale-[0.99]"
              >
                {/* Left Thumbnail */}
                <div className="w-18 h-18 sm:w-20 sm:h-20 rounded-xl overflow-hidden border-2 border-sumi flex-shrink-0 bg-sumi-900 relative">
                  <img
                    src={place.photo_url}
                    alt={place.name}
                    loading="lazy"
                    onError={(e) => { (e.target as HTMLImageElement).src = FALLBACK_IMAGE; }}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                  />
                  <span className="absolute bottom-1 left-1 px-1 py-0.2 rounded text-[8px] font-mono font-bold bg-sumi/90 text-wabi uppercase">
                    {place.category.slice(0, 4)}
                  </span>
                </div>

                {/* Right Info */}
                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between gap-1 text-[11px] font-mono text-slate-500">
                    <span className="truncate font-semibold text-slate-700 flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-vermilion" />
                      <span>{place.neighborhood || place.city}</span>
                    </span>
                    {place.distance_meters !== undefined && (
                      <span className="font-bold text-sumi flex-shrink-0">
                        {formatDistance(place.distance_meters)}
                      </span>
                    )}
                  </div>

                  <h3 className="font-sans font-bold text-sm sm:text-base text-sumi truncate group-hover:text-vermilion transition-colors mt-0.5">
                    {place.name}
                  </h3>

                  <div className="flex items-center gap-1.5 mt-1 flex-wrap">
                    <span className={`px-1.5 py-0.2 rounded text-[9px] font-mono font-bold uppercase ${stamp.bg}`}>
                      {stamp.label}
                    </span>
                    <span className="px-1.5 py-0.2 rounded text-[9px] font-mono font-bold uppercase bg-sumi text-wabi">
                      {place.spot_tier === 'iconic' ? '★ ICONIC' : place.spot_tier === 'underrated' ? '● UNDERRATED' : '✦ HIDDEN'}
                    </span>
                    {place.vibe_tags[0] && (
                      <span className="text-[10px] font-mono text-slate-500 truncate">
                        #{place.vibe_tags[0]}
                      </span>
                    )}
                  </div>
                </div>

                {/* Right Arrow */}
                <ArrowUpRight className="w-4 h-4 text-slate-400 group-hover:text-vermilion group-hover:translate-x-0.5 transition-all flex-shrink-0 mr-1" />
              </article>
            );
          })}
        </div>
      )}

      {/* MODE B: MEDIUM 2-COLUMN GRID (Perfect for phone browsing!) */}
      {viewSize === 'medium' && (
        <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-2.5 sm:gap-4 pb-12">
          {currentPlaces.map((place) => {
            const stamp = getBudgetStamp(place.budget_tier, place.approx_cost);
            return (
              <article
                key={place.id}
                onClick={() => onSelectPlace(place)}
                className="group cursor-pointer bg-wabi rounded-2xl border-2 border-sumi shadow-riso-sm hover:shadow-riso hover:-translate-y-1 transition-all overflow-hidden flex flex-col justify-between active:scale-[0.99]"
              >
                {/* Photo Header */}
                <div className="relative h-28 sm:h-36 w-full bg-sumi-900 overflow-hidden border-b-2 border-sumi flex-shrink-0">
                  <img
                    src={place.photo_url}
                    alt={place.name}
                    loading="lazy"
                    onError={(e) => { (e.target as HTMLImageElement).src = FALLBACK_IMAGE; }}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute top-1.5 left-1.5 flex flex-wrap gap-1 z-10">
                    <span
                      style={{
                        backgroundColor: CATEGORY_STYLES[place.category]?.bg || '#141518',
                        color: CATEGORY_STYLES[place.category]?.text || '#FDFBF7',
                      }}
                      className="px-1.5 py-0.5 rounded text-[9px] font-mono font-black uppercase border border-sumi"
                    >
                      {place.category.replace('_', ' ')}
                    </span>
                  </div>
                  {place.distance_meters !== undefined && (
                    <span className="absolute top-1.5 right-1.5 px-1.5 py-0.5 rounded text-[9px] font-mono font-bold bg-wabi/95 text-sumi border border-sumi/40 shadow-xs">
                      {formatDistance(place.distance_meters)}
                    </span>
                  )}
                </div>

                {/* Info Body */}
                <div className="p-2 sm:p-3 flex flex-col justify-between flex-1 gap-1.5">
                  <div>
                    <span className="text-[10px] font-mono text-slate-500 truncate block">
                      {place.neighborhood || place.city}
                    </span>
                    <h3 className="font-sans font-bold text-xs sm:text-sm text-sumi line-clamp-1 group-hover:text-vermilion transition-colors">
                      {place.name}
                    </h3>
                  </div>

                  <div className="flex items-center justify-between pt-1 border-t border-sumi/10">
                    <span className={`px-1.5 py-0.2 rounded text-[8px] sm:text-[9px] font-mono font-black uppercase ${stamp.bg}`}>
                      {stamp.label}
                    </span>
                    <span className="text-[10px] font-mono font-bold text-sumi group-hover:text-vermilion flex items-center">
                      VIEW ➔
                    </span>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      )}

      {/* ─────────────────────────────────────────────────────────────
          4. Pagination Bar
          ───────────────────────────────────────────────────────────── */}
      {totalPages > 1 && (
        <div className="max-w-7xl mx-auto mb-16 flex flex-col sm:flex-row items-center justify-between gap-3 bg-wabi p-3.5 sm:p-4 rounded-2xl border-2 border-sumi shadow-riso font-mono">
          <div className="text-xs text-slate-600 font-bold">
            SHOWING <span className="text-sumi font-black">{startIndex + 1}–{Math.min(startIndex + pageSize, places.length)}</span> OF <span className="text-sumi font-black">{places.length}</span> (PAGE {safeCurrentPage} OF {totalPages})
          </div>

          <div className="flex items-center gap-1.5 sm:gap-2">
            <button
              type="button"
              onClick={() => handlePageChange(safeCurrentPage - 1)}
              disabled={safeCurrentPage === 1}
              className="px-3 py-1.5 rounded-xl border-2 border-sumi font-bold text-xs bg-white text-sumi hover:bg-amber-100 disabled:opacity-40 disabled:pointer-events-none transition-all flex items-center gap-1"
            >
              <ChevronLeft className="w-3.5 h-3.5" />
              <span>PREV</span>
            </button>

            <span className="px-3 py-1.5 bg-sumi text-wabi rounded-xl font-black text-xs">
              {safeCurrentPage}
            </span>

            <button
              type="button"
              onClick={() => handlePageChange(safeCurrentPage + 1)}
              disabled={safeCurrentPage === totalPages}
              className="px-3 py-1.5 rounded-xl border-2 border-sumi font-bold text-xs bg-white text-sumi hover:bg-amber-100 disabled:opacity-40 disabled:pointer-events-none transition-all flex items-center gap-1"
            >
              <span>NEXT</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
