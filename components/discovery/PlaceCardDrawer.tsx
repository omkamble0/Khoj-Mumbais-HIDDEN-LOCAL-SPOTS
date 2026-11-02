'use client';

import React, { useState, useEffect } from 'react';
import { Place } from '@/lib/types';
import { formatDistance } from '@/lib/scoring';
import {
  Navigation,
  ShieldCheck,
  EyeOff,
  Users,
  Clock,
  Heart,
  AlertTriangle,
  X,
  ExternalLink,
  Sparkles,
} from 'lucide-react';

interface PlaceCardDrawerProps {
  place: Place | null;
  onClose: () => void;
  onOpenReport: (place: Place) => void;
}

export default function PlaceCardDrawer({
  place,
  onClose,
  onOpenReport,
}: PlaceCardDrawerProps) {
  const [isFavorited, setIsFavorited] = useState(false);

  useEffect(() => {
    if (!place) return;
    try {
      const favs = JSON.parse(localStorage.getItem('hidden_favs') || '[]');
      setIsFavorited(favs.includes(place.id));
    } catch {
      setIsFavorited(false);
    }
  }, [place]);

  const toggleFavorite = () => {
    if (!place) return;
    try {
      const favs: string[] = JSON.parse(localStorage.getItem('hidden_favs') || '[]');
      let updated: string[];
      if (favs.includes(place.id)) {
        updated = favs.filter((id) => id !== place.id);
        setIsFavorited(false);
      } else {
        updated = [...favs, place.id];
        setIsFavorited(true);
      }
      localStorage.setItem('hidden_favs', JSON.stringify(updated));
    } catch (e) {
      console.error(e);
    }
  };

  if (!place) return null;

  const googleMapsUrl = `https://www.google.com/maps/dir/?api=1&destination=${place.latitude},${place.longitude}`;

  const getSafetyBadge = (level: string) => {
    switch (level) {
      case 'high':
        return { label: 'Public & Safe', color: 'bg-emerald-50 text-emerald-700 border-emerald-200' };
      case 'medium':
        return { label: 'Daylight / Care Required', color: 'bg-amber-50 text-amber-700 border-amber-200' };
      default:
        return { label: 'Exercise Caution', color: 'bg-rose-50 text-rose-700 border-rose-200' };
    }
  };

  const safetyInfo = getSafetyBadge(place.safety_level);

  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 md:left-auto md:right-6 md:bottom-6 md:w-[420px] transition-transform duration-300 ease-out">
      <div className="bg-white/95 backdrop-blur-xl md:rounded-3xl rounded-t-3xl shadow-2xl border border-slate-200/90 overflow-hidden max-h-[85vh] flex flex-col">
        {/* Card Header Media & Actions */}
        <div className="relative h-44 w-full bg-slate-900 flex-shrink-0">
          <img
            src={place.photo_url}
            alt={place.name}
            className="w-full h-full object-cover opacity-90 hover:scale-105 transition-transform duration-500"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-black/30" />

          {/* Close & Favorite Top Actions */}
          <div className="absolute top-3 right-3 flex items-center gap-2">
            <button
              onClick={toggleFavorite}
              className={`p-2 rounded-full backdrop-blur-md transition-colors ${
                isFavorited
                  ? 'bg-rose-500 text-white shadow-md'
                  : 'bg-black/40 text-white hover:bg-black/60'
              }`}
              title="Save to favorites"
            >
              <Heart className={`w-4 h-4 ${isFavorited ? 'fill-current' : ''}`} />
            </button>
            <button
              onClick={onClose}
              className="p-2 rounded-full bg-black/40 hover:bg-black/60 text-white backdrop-blur-md transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Subtitle & Neighborhood Tag */}
          <div className="absolute bottom-3 left-4 right-4">
            <div className="flex items-center gap-2 mb-1">
              <span className="text-[11px] font-semibold uppercase tracking-wider text-emerald-400 bg-emerald-950/70 backdrop-blur-sm px-2 py-0.5 rounded-full border border-emerald-500/30">
                {place.category.replace('_', ' ')}
              </span>
              {place.distance_meters !== undefined && (
                <span className="text-[11px] text-slate-200 font-medium bg-black/40 px-2 py-0.5 rounded-full">
                  {formatDistance(place.distance_meters)}
                </span>
              )}
            </div>
            <h2 className="text-lg font-bold text-white leading-tight drop-shadow-sm">
              {place.name}
            </h2>
            <p className="text-xs text-slate-300 font-medium">
              {place.neighborhood ? `${place.neighborhood}, ${place.city}` : place.city}
            </p>
          </div>
        </div>

        {/* Scrollable Content Body */}
        <div className="p-4 overflow-y-auto space-y-3.5 text-xs">
          {/* Key Metrics Grid */}
          <div className="grid grid-cols-3 gap-2">
            {/* Hiddenness Score */}
            <div className="bg-slate-50 border border-slate-100 p-2 rounded-xl flex flex-col items-center justify-center text-center">
              <div className="flex items-center gap-1 text-slate-700 font-bold text-sm">
                <EyeOff className="w-3.5 h-3.5 text-purple-600" />
                <span>{Math.round(place.hiddenness_score * 100)}%</span>
              </div>
              <span className="text-[10px] text-slate-500 font-medium">Hidden Score</span>
            </div>

            {/* Crowd Level */}
            <div className="bg-slate-50 border border-slate-100 p-2 rounded-xl flex flex-col items-center justify-center text-center">
              <div className="flex items-center gap-1 text-slate-700 font-bold text-sm">
                <Users className="w-3.5 h-3.5 text-blue-600" />
                <span>
                  {place.crowd_level <= 1
                    ? 'Very Quiet'
                    : place.crowd_level === 2
                    ? 'Low Crowd'
                    : 'Moderate'}
                </span>
              </div>
              <span className="text-[10px] text-slate-500 font-medium">Typical Crowd</span>
            </div>

            {/* Quality / Vibe */}
            <div className="bg-slate-50 border border-slate-100 p-2 rounded-xl flex flex-col items-center justify-center text-center">
              <div className="flex items-center gap-1 text-slate-700 font-bold text-sm">
                <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                <span>{Math.round(place.vibe_score * 100)}%</span>
              </div>
              <span className="text-[10px] text-slate-500 font-medium">Vibe Score</span>
            </div>
          </div>

          {/* Description */}
          <p className="text-slate-600 leading-relaxed text-xs">{place.description}</p>

          {/* Best Time & Visiting Advice */}
          <div className="flex items-start gap-2 bg-emerald-50/70 border border-emerald-100 p-2.5 rounded-xl text-emerald-950">
            <Clock className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
            <div>
              <span className="font-semibold text-[11px] block text-emerald-900">
                Recommended Time:
              </span>
              <span className="text-xs text-emerald-800">{place.best_time_to_visit}</span>
            </div>
          </div>

          {/* Safety Notice Badge */}
          <div className={`flex items-start gap-2 p-2.5 rounded-xl border ${safetyInfo.color}`}>
            <ShieldCheck className="w-4 h-4 flex-shrink-0 mt-0.5" />
            <div className="text-[11px]">
              <span className="font-bold">{safetyInfo.label}: </span>
              <span className="opacity-90">{place.safety_notes}</span>
            </div>
          </div>

          {/* Vibe Tags */}
          <div className="flex flex-wrap gap-1.5 pt-1">
            {place.vibe_tags.map((tag) => (
              <span
                key={tag}
                className="px-2 py-0.5 bg-slate-100 text-slate-600 rounded-md text-[11px] font-medium"
              >
                #{tag}
              </span>
            ))}
          </div>

          {/* Action Row */}
          <div className="pt-2 flex items-center gap-2 border-t border-slate-100">
            <a
              href={googleMapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 flex items-center justify-center gap-2 bg-slate-900 hover:bg-slate-800 text-white font-semibold py-2.5 px-4 rounded-xl shadow-md transition-all text-xs"
            >
              <Navigation className="w-3.5 h-3.5" />
              <span>Directions (Google Maps)</span>
              <ExternalLink className="w-3 h-3 opacity-60" />
            </a>

            <button
              onClick={() => onOpenReport(place)}
              className="p-2.5 rounded-xl border border-slate-200 text-slate-400 hover:text-red-600 hover:border-red-200 hover:bg-red-50 transition-colors"
              title="Report issue (closed, private property, unsafe)"
            >
              <AlertTriangle className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
