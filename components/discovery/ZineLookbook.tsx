'use client';

import React from 'react';
import { Place } from '@/lib/types';
import { formatDistance } from '@/lib/scoring';
import { ArrowUpRight, Compass, EyeOff, MapPin, Sparkles } from 'lucide-react';

interface ZineLookbookProps {
  places: Place[];
  onSelectPlace: (place: Place) => void;
}

export default function ZineLookbook({ places, onSelectPlace }: ZineLookbookProps) {
  return (
    <div className="w-full h-full overflow-y-auto px-4 md:px-8 py-28 md:py-32 bg-washi">
      {/* Hero Header Ticker (Inspired by 'elsewhere.' and Ghibli/Beams slides) */}
      <div className="max-w-6xl mx-auto mb-8 bg-sumi text-wabi p-6 md:p-8 rounded-3xl border-2 border-sumi shadow-riso relative overflow-hidden">
        {/* Background Decorative Stamp */}
        <div className="absolute right-4 -bottom-6 text-slate-800 font-serif font-black text-8xl md:text-9xl select-none opacity-40 pointer-events-none">
          探索
        </div>

        <div className="relative z-10 max-w-2xl">
          <div className="flex items-center gap-2 mb-3">
            <span className="hanko-stamp bg-vermilion text-white border-white text-xs">
              KHOJ ISSUE #01 · खोज
            </span>
            <span className="text-[11px] font-mono tracking-widest text-slate-300">
              18.9453° N · 72.8258° E · WABI-SABI LOCATIONS
            </span>
          </div>

          <h2 className="font-serif font-black text-3xl md:text-5xl tracking-tight text-wabi leading-none mb-3">
            KHOJ. <span className="italic font-normal text-amber-300">Get Lost. Feel Found.</span>
          </h2>

          <p className="text-xs md:text-sm text-slate-300 font-sans leading-relaxed">
            Curated quiet sanctuaries, Portuguese battlements engulfed by banyan roots, 66-million-year-old basalt columns, and sacred freshwater tanks where the city whispers.
          </p>
        </div>
      </div>

      {/* Grid of Riso / Dither Inspired Editorial Cards (Image 1 & 2 inspired) */}
      <div className="max-w-6xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 pb-24">
        {places.map((place, idx) => {
          return (
            <article
              key={place.id}
              onClick={() => onSelectPlace(place)}
              className="group cursor-pointer bg-wabi rounded-2xl border-2 border-sumi shadow-riso hover:shadow-riso-red hover:translate-y-[-2px] transition-all duration-200 overflow-hidden flex flex-col justify-between"
            >
              {/* Card Media with Dither / Grain Texture */}
              <div className="relative h-56 w-full bg-sumi-800 overflow-hidden border-b-2 border-sumi">
                <img
                  src={place.photo_url}
                  alt={place.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-90 contrast-110"
                />
                
                {/* Dither dot overlay effect */}
                <div className="absolute inset-0 bg-riso-dots opacity-30 pointer-events-none" />

                {/* Hanko Stamp Pill */}
                <div className="absolute top-3 left-3 flex items-center gap-1.5">
                  <span className="px-2 py-0.5 rounded-md text-[10px] font-mono font-black uppercase tracking-wider bg-wabi text-sumi border border-sumi shadow-riso-sm">
                    #{String(idx + 1).padStart(2, '0')} {place.category.replace('_', ' ')}
                  </span>
                </div>

                {/* Hiddenness Stamp */}
                <div className="absolute top-3 right-3 bg-vermilion text-white border border-sumi rounded-lg px-2 py-0.5 font-mono text-xs font-black shadow-riso-sm">
                  {Math.round(place.hiddenness_score * 100)}% HIDDEN
                </div>

                {/* Subtitle bottom banner */}
                <div className="absolute bottom-2 left-3 right-3 flex items-center justify-between text-[11px] font-mono text-white bg-sumi/80 backdrop-blur-sm px-2.5 py-1 rounded-lg border border-white/20">
                  <span className="truncate">{place.neighborhood || place.city}</span>
                  {place.distance_meters !== undefined && (
                    <span className="text-amber-300 font-bold ml-2">
                      {formatDistance(place.distance_meters)}
                    </span>
                  )}
                </div>
              </div>

              {/* Card Editorial Text Body (Image 1 style typography) */}
              <div className="p-4 flex flex-col flex-1 justify-between gap-3">
                <div>
                  <div className="flex items-center gap-2 text-[10px] font-mono uppercase text-slate-500 mb-1">
                    <span>ARCHIVE REF: {place.id.slice(0, 10)}</span>
                    <span>•</span>
                    <span className="text-emerald-700 font-bold">
                      {place.safety_level === 'high' ? 'SAFE & PUBLIC' : 'DAYLIGHT VISIT'}
                    </span>
                  </div>

                  <h3 className="font-serif font-black text-lg text-sumi leading-snug group-hover:text-vermilion transition-colors">
                    {place.name}
                  </h3>

                  <p className="text-xs text-slate-600 line-clamp-2 mt-1.5 leading-relaxed font-sans">
                    {place.description}
                  </p>
                </div>

                {/* Vibe Tags & Action Footer */}
                <div className="pt-2 border-t border-sumi/10 flex items-center justify-between">
                  <div className="flex items-center gap-1">
                    {place.vibe_tags.slice(0, 2).map((t) => (
                      <span
                        key={t}
                        className="text-[10px] font-mono bg-wabi-200 border border-sumi/20 px-1.5 py-0.5 rounded text-slate-700"
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

