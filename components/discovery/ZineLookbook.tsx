'use client';

import React from 'react';
import { Place, FilterState } from '@/lib/types';
import { formatDistance } from '@/lib/scoring';
import { ArrowUpRight } from 'lucide-react';
import FilterBar from './FilterBar';

interface ZineLookbookProps {
  places: Place[];
  onSelectPlace: (place: Place) => void;
  filters: FilterState;
  onFilterChange: (updated: Partial<FilterState>) => void;
}

const FALLBACK_IMAGE =
  'https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=1000&auto=format&fit=crop&q=80';

export default function ZineLookbook({
  places,
  onSelectPlace,
  filters,
  onFilterChange,
}: ZineLookbookProps) {
  return (
    <div className="w-full h-full overflow-y-auto px-4 md:px-8 py-6 bg-washi font-sans">
      {/* Hero Header Banner */}
      <div className="max-w-6xl mx-auto mb-6 bg-sumi text-wabi p-6 md:p-8 rounded-3xl border-2 border-sumi shadow-riso relative overflow-hidden">
        <div className="relative z-10 max-w-2xl">
          <div className="flex items-center gap-2 mb-2">
            <span className="px-2.5 py-1 rounded text-xs font-mono font-bold bg-vermilion text-white tracking-wider uppercase">
              MUMBAI ISSUE #01 · KHOJ
            </span>
            <span className="text-xs font-mono text-slate-300">
              18.9453° N, 72.8258° E · HIDDEN LOCAL SPOTS
            </span>
          </div>

          <h2 className="font-display font-bold text-4xl md:text-6xl tracking-wide text-wabi leading-tight mb-2">
            Get Lost. <span className="italic font-normal text-amber-300">Feel Found.</span>
          </h2>

          <p className="text-sm md:text-base text-slate-200 font-sans leading-relaxed">
            Curated quiet sanctuaries, Portuguese battlements engulfed by banyan roots, 66-million-year-old volcanic basalt columns, and sacred freshwater tanks where the city whispers.
          </p>
        </div>
      </div>

      {/* Integrated Filter Bar (Never overlapping!) */}
      <div className="max-w-6xl mx-auto mb-6">
        <FilterBar
          filters={filters}
          onChange={onFilterChange}
          totalFound={places.length}
        />
      </div>

      {/* Grid of Clean Editorial Cards */}
      <div className="max-w-6xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 pb-24">
        {places.map((place, idx) => {
          return (
            <article
              key={place.id}
              onClick={() => onSelectPlace(place)}
              className="group cursor-pointer bg-wabi rounded-2xl border-2 border-sumi shadow-riso hover:shadow-riso-red hover:translate-y-[-2px] transition-all duration-200 overflow-hidden flex flex-col justify-between"
            >
              {/* Card Media with Dither Dot Texture */}
              <div className="relative h-56 w-full bg-sumi-800 overflow-hidden border-b-2 border-sumi">
                <img
                  src={place.photo_url}
                  alt={place.name}
                  loading="lazy"
                  decoding="async"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = FALLBACK_IMAGE;
                  }}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-90 contrast-105"
                />

                {/* Dither dot overlay effect */}
                <div className="absolute inset-0 bg-riso-dots opacity-25 pointer-events-none" />

                {/* English Category Tag */}
                <div className="absolute top-3 left-3 flex items-center gap-1.5">
                  <span className="px-2.5 py-1 rounded-md text-xs font-mono font-black uppercase tracking-wider bg-wabi text-sumi border border-sumi shadow-riso-sm">
                    #{String(idx + 1).padStart(2, '0')} {place.category.replace('_', ' ')}
                  </span>
                </div>

                {/* Tier & Hiddenness Stamp */}
                <div className="absolute top-3 right-3 flex items-center gap-1">
                  <span className={`px-2.5 py-1 rounded-lg font-mono text-xs font-black uppercase border border-sumi shadow-riso-sm ${
                    place.spot_tier === 'iconic'
                      ? 'bg-amber-400 text-sumi'
                      : place.spot_tier === 'underrated'
                      ? 'bg-cobalt text-white'
                      : 'bg-vermilion text-white'
                  }`}>
                    {place.spot_tier === 'iconic' ? '★ ICONIC' : place.spot_tier === 'underrated' ? '● UNDERRATED' : '✦ HIDDEN'}
                  </span>
                </div>

                {/* Subtitle bottom banner */}
                <div className="absolute bottom-2.5 left-3 right-3 flex items-center justify-between text-xs font-mono text-white bg-sumi/85 backdrop-blur-sm px-3 py-1.5 rounded-lg border border-white/20">
                  <span className="truncate">{place.neighborhood || place.city}</span>
                  {place.distance_meters !== undefined && (
                    <span className="text-amber-300 font-bold ml-2">
                      {formatDistance(place.distance_meters)}
                    </span>
                  )}
                </div>
              </div>

              {/* Card Body */}
              <div className="p-4.5 flex flex-col flex-1 justify-between gap-3">
                <div>
                  <div className="flex items-center gap-2 text-xs font-mono uppercase text-slate-500 mb-1.5">
                    <span>REF: {place.id.slice(0, 10)}</span>
                    <span>•</span>
                    <span className="text-emerald-700 font-bold">
                      {place.safety_level === 'high' ? 'VERIFIED SAFE & PUBLIC' : 'DAYLIGHT VISIT'}
                    </span>
                  </div>

                  <h3 className="font-display font-bold text-xl md:text-2xl text-sumi leading-snug tracking-wide group-hover:text-vermilion transition-colors">
                    {place.name}
                  </h3>

                  <p className="text-sm text-slate-700 line-clamp-2 mt-2 leading-relaxed font-sans">
                    {place.description}
                  </p>
                </div>

                {/* Vibe Tags & Action Footer */}
                <div className="pt-2.5 border-t border-sumi/10 flex items-center justify-between">
                  <div className="flex items-center gap-1.5">
                    {place.vibe_tags.slice(0, 2).map((t) => (
                      <span
                        key={t}
                        className="text-xs font-mono bg-wabi-200 border border-sumi/20 px-2 py-0.5 rounded text-slate-700 font-bold"
                      >
                        #{t}
                      </span>
                    ))}
                  </div>

                  <span className="inline-flex items-center gap-1 text-xs font-mono font-bold text-sumi group-hover:text-vermilion">
                    EXPLORE <ArrowUpRight className="w-3.5 h-3.5" />
                  </span>
                </div>
              </div>
            </article>
          );
        })}
      </div>
    </div>
  );
}
