'use client';

import React, { useState, useEffect } from 'react';
import { Place, FilterState } from '@/lib/types';
import { formatDistance } from '@/lib/scoring';
import { ArrowUpRight, ChevronLeft, ChevronRight } from 'lucide-react';
import FilterBar from './FilterBar';

interface ZineLookbookProps {
  places: Place[];
  onSelectPlace: (place: Place) => void;
  filters: FilterState;
  onFilterChange: (updated: Partial<FilterState>) => void;
}

const FALLBACK_IMAGE =
  'https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=1000&auto=format&fit=crop&q=80';

const PAGE_SIZE = 9;

export default function ZineLookbook({
  places,
  onSelectPlace,
  filters,
  onFilterChange,
}: ZineLookbookProps) {
  const [currentPage, setCurrentPage] = useState(1);

  // Automatically reset to page 1 whenever filters change or places count changes
  useEffect(() => {
    setCurrentPage(1);
  }, [places.length, filters.category, filters.spotTier, filters.radiusKm, filters.searchQuery]);

  const totalPages = Math.ceil(places.length / PAGE_SIZE) || 1;
  const safeCurrentPage = Math.min(currentPage, totalPages);
  const startIndex = (safeCurrentPage - 1) * PAGE_SIZE;
  const currentPlaces = places.slice(startIndex, startIndex + PAGE_SIZE);

  const handlePageChange = (newPage: number) => {
    if (newPage < 1 || newPage > totalPages) return;
    setCurrentPage(newPage);
    if (typeof window !== 'undefined') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    <div className="w-full px-3 sm:px-4 md:px-8 py-4 sm:py-6 bg-washi font-sans">
      {/* Hero Header Banner */}
      <div className="max-w-6xl mx-auto mb-4 sm:mb-6 bg-sumi text-wabi p-4 sm:p-6 md:p-8 rounded-2xl sm:rounded-3xl border-2 border-sumi shadow-riso relative overflow-hidden">
        <div className="relative z-10 max-w-2xl">
          <div className="flex flex-wrap items-center gap-1.5 sm:gap-2 mb-2">
            <span className="px-2 sm:px-2.5 py-0.5 sm:py-1 rounded text-[10px] sm:text-xs font-mono font-bold bg-vermilion text-white tracking-wider uppercase">
              MUMBAI
            </span>
            <span className="text-[10px] sm:text-xs font-mono text-slate-300">
              KHOJ HIDDEN LOCAL SPOTS
            </span>
          </div>

          <h2 className="font-display font-normal text-3xl sm:text-4xl md:text-5xl tracking-wide text-wabi leading-tight mb-2">
            Get Lost. <span className="italic font-normal text-amber-300">Feel Found.</span>
          </h2>

          <p className="text-xs sm:text-sm md:text-base text-slate-200 font-sans leading-relaxed">
            Curated quiet sanctuaries, Portuguese battlements engulfed by banyan roots, 66-million-year-old volcanic basalt columns, and sacred freshwater tanks where the city whispers.
          </p>
        </div>
      </div>

      {/* Integrated Filter Bar (Never overlapping!) */}
      <div className="max-w-6xl mx-auto mb-4 sm:mb-6">
        <FilterBar
          filters={filters}
          onChange={onFilterChange}
          totalFound={places.length}
        />
      </div>

      {/* Grid of Clean Editorial Cards (9 spots per page) */}
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 sm:gap-8 pb-12">
        {currentPlaces.map((place) => {
          return (
            <article
              key={place.id}
              onClick={() => onSelectPlace(place)}
              className="group cursor-pointer bg-wabi rounded-3xl border-2 border-sumi shadow-riso hover:shadow-riso-red hover:-translate-y-1.5 transition-all duration-300 overflow-hidden flex flex-col justify-between active:scale-[0.99]"
            >
              {/* Card Media (Expansive, cinematic framing) */}
              <div className="relative h-56 sm:h-64 md:h-72 w-full bg-sumi-900 overflow-hidden border-b-2 border-sumi flex-shrink-0">
                <img
                  src={place.photo_url}
                  alt={place.name}
                  loading="lazy"
                  decoding="async"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = FALLBACK_IMAGE;
                  }}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 opacity-90 contrast-105"
                />

                {/* Subtle Halftone Dot Texture */}
                <div className="absolute inset-0 bg-riso-dots opacity-20 pointer-events-none" />

                {/* Floating Category & Tier Tag on Top Left */}
                <div className="absolute top-3.5 left-3.5 flex items-center gap-2 z-10">
                  <span className="px-3 py-1 rounded-xl text-xs font-mono font-bold uppercase tracking-wider bg-sumi/90 text-wabi backdrop-blur-md border border-white/20 shadow-sm">
                    {place.category.replace('_', ' ')}
                  </span>
                  <span className={`px-2.5 py-1 rounded-xl text-xs font-mono font-black uppercase backdrop-blur-md border shadow-sm ${place.spot_tier === 'iconic'
                      ? 'bg-amber-400 text-sumi border-amber-500/40'
                      : place.spot_tier === 'underrated'
                        ? 'bg-cobalt text-white border-blue-400/40'
                        : 'bg-vermilion text-white border-rose-400/40'
                    }`}>
                    {place.spot_tier === 'iconic' ? '★ ICONIC' : place.spot_tier === 'underrated' ? '● UNDERRATED' : '✦ HIDDEN'}
                  </span>
                </div>

                {/* Distance Pill on Top Right */}
                {place.distance_meters !== undefined && (
                  <div className="absolute top-3.5 right-3.5 z-10">
                    <span className="px-3 py-1 rounded-xl text-xs font-mono font-bold bg-wabi/95 text-sumi backdrop-blur-md border border-sumi/30 shadow-sm">
                      {formatDistance(place.distance_meters)}
                    </span>
                  </div>
                )}
              </div>

              {/* Card Content (Expansive, spacious editorial layout with room to breathe) */}
              <div className="p-6 sm:p-7 flex flex-col flex-1 justify-between gap-5">
                <div className="space-y-2.5">
                  {/* Location Subtitle */}
                  <div className="flex items-center justify-between text-xs sm:text-sm font-mono text-slate-500">
                    <span className="font-semibold text-slate-700 tracking-wide flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-vermilion inline-block flex-shrink-0"></span>
                      <span>{place.neighborhood ? `${place.neighborhood}, ${place.city}` : place.city}</span>
                    </span>
                    <span className="text-emerald-700 font-bold tracking-wider uppercase text-xs flex-shrink-0">
                      {place.safety_level === 'high' ? 'Verified Safe' : 'Daylight Visit'}
                    </span>
                  </div>

                  {/* Place Title: Crisp, bold modern typography matching Image 3 (no forced squished text) */}
                  <h3 className="font-sans font-bold text-xl sm:text-2xl text-sumi tracking-tight leading-snug group-hover:text-vermilion transition-colors">
                    {place.name}
                  </h3>

                  {/* Narrative Snippet (Spacious and readable) */}
                  <p className="text-sm sm:text-[15px] text-slate-700 leading-relaxed font-sans line-clamp-4 pt-1">
                    {place.description}
                  </p>
                </div>

                {/* Footer Strip with Tags and Action */}
                <div className="pt-4 border-t border-sumi/15 flex items-center justify-between">
                  <div className="flex flex-wrap items-center gap-2">
                    {place.vibe_tags.slice(0, 3).map((t) => (
                      <span
                        key={t}
                        className="text-xs font-mono bg-wabi-100 border border-sumi/20 px-3 py-1 rounded-lg text-slate-700 font-medium"
                      >
                        #{t}
                      </span>
                    ))}
                  </div>

                  <span className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-mono font-bold text-sumi group-hover:text-vermilion group-hover:translate-x-1 transition-all flex-shrink-0">
                    VIEW SPOT <ArrowUpRight className="w-4 h-4" />
                  </span>
                </div>
              </div>
            </article>
          );
        })}
      </div>

      {/* Pagination Bar (Editorial 9-place pagination) */}
      {totalPages > 1 && (
        <div className="max-w-7xl mx-auto mb-24 flex flex-col sm:flex-row items-center justify-between gap-4 bg-wabi p-4 sm:p-5 rounded-2xl border-2 border-sumi shadow-riso font-mono">
          <div className="text-xs text-slate-600 font-bold">
            SHOWING <span className="text-sumi font-black">{startIndex + 1}–{Math.min(startIndex + PAGE_SIZE, places.length)}</span> OF <span className="text-sumi font-black">{places.length}</span> SANCTUARIES (PAGE {safeCurrentPage} OF {totalPages})
          </div>

          <div className="flex items-center gap-1.5 sm:gap-2">
            {/* Prev button */}
            <button
              onClick={() => handlePageChange(safeCurrentPage - 1)}
              disabled={safeCurrentPage === 1}
              className="flex items-center gap-1 px-3 py-1.5 rounded-xl border-2 border-sumi text-xs font-bold transition-all disabled:opacity-30 disabled:pointer-events-none bg-wabi hover:bg-amber-100 shadow-riso-sm"
              aria-label="Previous Page"
            >
              <ChevronLeft className="w-4 h-4" />
              <span>PREV</span>
            </button>

            {/* Page Numbers */}
            <div className="flex items-center gap-1">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => {
                if (totalPages > 7) {
                  if (p !== 1 && p !== totalPages && Math.abs(p - safeCurrentPage) > 1) {
                    if (p === 2 || p === totalPages - 1) {
                      return <span key={p} className="px-1 text-slate-400 font-bold">...</span>;
                    }
                    return null;
                  }
                }
                return (
                  <button
                    key={p}
                    onClick={() => handlePageChange(p)}
                    className={`w-8 h-8 rounded-xl font-bold text-xs flex items-center justify-center border-2 transition-all ${safeCurrentPage === p
                        ? 'bg-sumi text-wabi border-sumi shadow-riso-sm'
                        : 'bg-wabi text-sumi border-sumi/30 hover:border-sumi hover:bg-amber-100'
                      }`}
                  >
                    {p}
                  </button>
                );
              })}
            </div>

            {/* Next button */}
            <button
              onClick={() => handlePageChange(safeCurrentPage + 1)}
              disabled={safeCurrentPage === totalPages}
              className="flex items-center gap-1 px-3 py-1.5 rounded-xl border-2 border-sumi text-xs font-bold transition-all disabled:opacity-30 disabled:pointer-events-none bg-wabi hover:bg-amber-100 shadow-riso-sm"
              aria-label="Next Page"
            >
              <span>NEXT</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
