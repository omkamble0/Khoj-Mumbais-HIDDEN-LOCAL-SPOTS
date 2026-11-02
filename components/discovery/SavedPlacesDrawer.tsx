'use client';

import React from 'react';
import { Place } from '@/lib/types';
import { X, Heart, Navigation, ArrowUpRight, Trash2 } from 'lucide-react';
import { formatDistance } from '@/lib/scoring';

interface SavedPlacesDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  savedPlaces: Place[];
  onSelectPlace: (place: Place) => void;
  onRemoveFavorite: (placeId: string) => void;
  onClearAll: () => void;
}

const FALLBACK_IMAGE =
  'https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=1000&auto=format&fit=crop&q=80';

export default function SavedPlacesDrawer({
  isOpen,
  onClose,
  savedPlaces,
  onSelectPlace,
  onRemoveFavorite,
  onClearAll,
}: SavedPlacesDrawerProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-sumi/40 backdrop-blur-sm transition-opacity font-sans">
      <div className="relative w-full max-w-lg md:max-w-xl h-full bg-wabi border-l-2 border-sumi shadow-2xl flex flex-col justify-between overflow-hidden pb-safe">
        {/* Header */}
        <div className="p-4 sm:p-5 bg-wabi border-b-2 border-sumi flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-vermilion text-white flex items-center justify-center border-2 border-sumi shadow-riso-sm flex-shrink-0">
              <Heart className="w-5 h-5 fill-current" />
            </div>
            <div>
              <h2 className="font-display font-normal text-2xl md:text-3xl text-sumi tracking-wide leading-snug">Saved Sanctuaries</h2>
              <p className="text-xs font-mono text-slate-500 uppercase tracking-wider font-semibold">
                {savedPlaces.length} {savedPlaces.length === 1 ? 'place' : 'places'} bookmarked
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {savedPlaces.length > 0 && (
              <button
                onClick={onClearAll}
                className="p-2 text-slate-500 hover:text-red-600 rounded-lg hover:bg-red-50 border border-transparent hover:border-red-200 transition-colors"
                title="Clear all saved places"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            )}
            <button
              onClick={onClose}
              className="p-2 rounded-xl bg-wabi text-sumi border-2 border-sumi shadow-riso-sm hover:bg-slate-200 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Content List */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-3.5">
          {savedPlaces.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center p-6 space-y-3">
              <div className="w-14 h-14 rounded-2xl bg-wabi-200 border-2 border-sumi flex items-center justify-center text-slate-400">
                <Heart className="w-7 h-7" />
              </div>
              <h3 className="font-bold text-sm text-sumi">No saved sanctuaries yet</h3>
              <p className="text-xs text-slate-500 max-w-xs font-sans">
                Explore places on the map or lookbook and tap the heart icon to curate your weekend crawl.
              </p>
            </div>
          ) : (
            savedPlaces.map((place) => (
              <div
                key={place.id}
                onClick={() => {
                  onSelectPlace(place);
                  onClose();
                }}
                className="group cursor-pointer bg-wabi rounded-2xl border-2 border-sumi shadow-riso-sm hover:shadow-riso hover:translate-y-[-1px] transition-all overflow-hidden flex items-center gap-3.5 p-3 sm:p-3.5"
              >
                {/* Thumbnail */}
                <div className="relative w-24 h-24 rounded-xl overflow-hidden flex-shrink-0 border border-sumi bg-sumi-800">
                  <img
                    src={place.photo_url}
                    alt={place.name}
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = FALLBACK_IMAGE;
                    }}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                  />
                  <div className="absolute inset-0 bg-riso-dots opacity-20" />
                </div>

                {/* Details */}
                <div className="flex-1 min-w-0 space-y-0.5">
                  <div className="flex items-center gap-1.5 mb-1">
                    <span className="text-[10px] font-mono font-bold uppercase px-2 py-0.5 rounded bg-sumi text-wabi">
                      {place.category}
                    </span>
                    <span className={`text-[10px] font-mono font-black px-2 py-0.5 rounded ${
                      place.spot_tier === 'iconic'
                        ? 'bg-amber-400 text-sumi'
                        : place.spot_tier === 'underrated'
                        ? 'bg-cobalt text-white'
                        : 'bg-vermilion text-white'
                    }`}>
                      {place.spot_tier === 'iconic' ? '★ ICONIC' : place.spot_tier === 'underrated' ? '● UNDERRATED' : '✦ HIDDEN'}
                    </span>
                  </div>

                  <h4 className="font-display font-normal text-xl md:text-2xl text-sumi truncate tracking-wide leading-snug group-hover:text-vermilion transition-colors">
                    {place.name}
                  </h4>

                  <p className="text-xs font-mono text-slate-500 truncate">
                    {place.neighborhood ? `${place.neighborhood}, Mumbai` : place.city}
                  </p>

                  {place.distance_meters !== undefined && (
                    <span className="text-xs font-mono text-amber-700 font-bold inline-block">
                      {formatDistance(place.distance_meters)} away
                    </span>
                  )}
                </div>

                {/* Remove button */}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onRemoveFavorite(place.id);
                  }}
                  className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors flex-shrink-0"
                  title="Remove from saved"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        {savedPlaces.length > 0 && (
          <div className="p-3 bg-wabi border-t-2 border-sumi flex items-center justify-between text-xs font-mono text-slate-500">
            <span>Saved in browser storage</span>
            <span className="font-bold text-sumi">{savedPlaces.length} Selected</span>
          </div>
        )}
      </div>
    </div>
  );
}

