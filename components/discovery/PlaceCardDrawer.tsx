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
  ArrowUpRight,
  Sparkles,
  Share2,
  Check,
} from 'lucide-react';

interface PlaceCardDrawerProps {
  place: Place | null;
  onClose: () => void;
  onOpenReport: (place: Place) => void;
}

const FALLBACK_IMAGE =
  'https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=1000&auto=format&fit=crop&q=80';

export default function PlaceCardDrawer({
  place,
  onClose,
  onOpenReport,
}: PlaceCardDrawerProps) {
  const [isFavorited, setIsFavorited] = useState(false);
  const [copied, setCopied] = useState(false);

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

  const handleShare = async () => {
    if (!place) return;
    const shareData = {
      title: `${place.name} · KHOJ`,
      text: `Check out ${place.name} in ${place.neighborhood || 'Mumbai'} on KHOJ: ${place.description}`,
      url: window.location.href,
    };
    if (navigator.share) {
      try {
        await navigator.share(shareData);
        return;
      } catch (err) {
        // Fallback to clipboard
      }
    }
    navigator.clipboard.writeText(`${place.name} - ${window.location.href}`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (!place) return null;

  // Query by exact Place Name + Neighborhood + Mumbai so Google Maps pins to the verified POI entity
  // instead of reverse-geocoding coordinates to a random street or apartment block
  const destinationQuery = encodeURIComponent(
    `${place.name}, ${place.neighborhood ? place.neighborhood + ', ' : ''}Mumbai`
  );
  const googleMapsDirectionsUrl = `https://www.google.com/maps/dir/?api=1&destination=${destinationQuery}`;
  const googleMapsPlaceUrl = `https://www.google.com/maps/search/?api=1&query=${destinationQuery}`;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 md:left-auto md:right-6 md:bottom-6 md:w-[540px] lg:w-[580px] pb-safe transition-transform duration-300 ease-out font-sans">
      <div className="bg-wabi/95 backdrop-blur-xl md:rounded-3xl rounded-t-3xl border-2 border-sumi shadow-riso overflow-hidden max-h-[85dvh] md:max-h-[88vh] flex flex-col">
        {/* Mobile Tactile Drag Pill */}
        <div className="w-12 h-1.5 bg-sumi/30 rounded-full mx-auto my-2 md:hidden flex-shrink-0" />

        {/* 1. Cinematic Hero Photo (Expansive view) */}
        <div className="relative h-52 sm:h-64 md:h-72 w-full bg-sumi-900 flex-shrink-0 border-b-2 border-sumi overflow-hidden">
          <img
            src={place.photo_url}
            alt={place.name}
            onError={(e) => {
              (e.target as HTMLImageElement).src = FALLBACK_IMAGE;
            }}
            className="w-full h-full object-cover hover:scale-105 transition-transform duration-700 contrast-105"
          />
          {/* Subtle Halftone Dot Pattern */}
          <div className="absolute inset-0 bg-riso-dots opacity-20 pointer-events-none" />
          
          {/* Soft bottom vignette gradient for smooth transition */}
          <div className="absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-sumi/60 to-transparent pointer-events-none" />

          {/* Floating Top Left Badges */}
          <div className="absolute top-3.5 left-3.5 flex flex-wrap items-center gap-2 z-10">
            <span className="px-3 py-1 rounded-xl text-xs font-mono font-bold uppercase tracking-wider bg-sumi/90 text-wabi backdrop-blur-md border border-white/20 shadow-sm">
              {place.category.toUpperCase()}
            </span>
            <span className={`px-2.5 py-1 rounded-xl text-xs font-mono font-black uppercase backdrop-blur-md border shadow-sm ${
              place.spot_tier === 'iconic'
                ? 'bg-amber-400 text-sumi border-amber-500/50'
                : place.spot_tier === 'underrated'
                ? 'bg-cobalt text-white border-blue-400/50'
                : 'bg-vermilion text-white border-rose-400/50'
            }`}>
              {place.spot_tier === 'iconic' ? '★ ICONIC' : place.spot_tier === 'underrated' ? '● UNDERRATED' : '✦ HIDDEN'}
            </span>
            {place.distance_meters !== undefined && (
              <span className="text-xs font-mono font-bold bg-wabi/95 text-sumi backdrop-blur-md border border-sumi/30 px-3 py-1 rounded-xl shadow-sm">
                {formatDistance(place.distance_meters)}
              </span>
            )}
          </div>

          {/* Floating Top Right Actions */}
          <div className="absolute top-3.5 right-3.5 flex items-center gap-2 z-10">
            <button
              onClick={toggleFavorite}
              className={`p-2.5 rounded-xl border border-sumi/40 backdrop-blur-md shadow-md transition-all active:scale-95 ${
                isFavorited
                  ? 'bg-vermilion text-white'
                  : 'bg-wabi/90 text-sumi hover:bg-white'
              }`}
              title="Save to favorites"
            >
              <Heart className={`w-4 h-4 ${isFavorited ? 'fill-current' : ''}`} />
            </button>
            <button
              onClick={onClose}
              className="p-2.5 rounded-xl bg-wabi/90 backdrop-blur-md text-sumi border border-sumi/40 shadow-md hover:bg-white active:scale-95 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* 2. Scrollable Editorial Body (Spacious & uncluttered) */}
        <div className="p-5 sm:p-6 md:p-7 overflow-y-auto space-y-4 sm:space-y-5">
          {/* Title & Location Header: Clean, modern, highly readable typography */}
          <div className="space-y-1.5 pb-1">
            <h2 className="font-sans font-bold text-2xl sm:text-3xl lg:text-4xl text-sumi leading-snug tracking-tight break-words">
              {place.name}
            </h2>
            <div className="flex flex-wrap items-center justify-between gap-2 text-xs sm:text-sm font-mono pt-1">
              <span className="text-slate-700 font-semibold tracking-wide flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-vermilion inline-block"></span>
                <span>{place.neighborhood ? `${place.neighborhood}, ${place.city}` : place.city}</span>
              </span>
              <span className="text-amber-800 font-bold bg-amber-100/90 border border-amber-300/60 px-2.5 py-1 rounded-md tracking-wider text-xs">
                {place.latitude.toFixed(4)}°N, {place.longitude.toFixed(4)}°E
              </span>
            </div>
          </div>

          {/* Unified Telemetry Strip (Roomy metrics) */}
          <div className="bg-wabi-100/90 border border-sumi/20 rounded-2xl p-4 shadow-riso-sm grid grid-cols-3 divide-x divide-sumi/15">
            {/* Hiddenness Score */}
            <div className="flex flex-col items-center justify-center text-center px-2">
              <div className="flex items-center gap-1.5 text-sumi font-black font-mono text-base sm:text-lg">
                <EyeOff className="w-4 h-4 sm:w-5 sm:h-5 text-vermilion flex-shrink-0" />
                <span>{Math.round(place.hiddenness_score * 100)}%</span>
              </div>
              <span className="text-xs font-mono uppercase text-slate-500 font-bold mt-1 tracking-wider">
                Hiddenness
              </span>
            </div>

            {/* Crowd Level */}
            <div className="flex flex-col items-center justify-center text-center px-2">
              <div className="flex items-center gap-1.5 text-sumi font-black font-mono text-sm sm:text-base">
                <Users className="w-4 h-4 sm:w-5 sm:h-5 text-matcha flex-shrink-0" />
                <span className="truncate">
                  {place.crowd_level <= 1
                    ? 'Very Quiet'
                    : place.crowd_level === 2
                    ? 'Low Crowd'
                    : 'Moderate'}
                </span>
              </div>
              <span className="text-xs font-mono uppercase text-slate-500 font-bold mt-1 tracking-wider">
                Crowd Level
              </span>
            </div>

            {/* Atmosphere / Vibe */}
            <div className="flex flex-col items-center justify-center text-center px-2">
              <div className="flex items-center gap-1.5 text-sumi font-black font-mono text-base sm:text-lg">
                <Sparkles className="w-4 h-4 sm:w-5 sm:h-5 text-ochre flex-shrink-0" />
                <span>{Math.round(place.vibe_score * 100)}%</span>
              </div>
              <span className="text-xs font-mono uppercase text-slate-500 font-bold mt-1 tracking-wider">
                Vibe Score
              </span>
            </div>
          </div>

          {/* Narrative Description (Generous line height, readable typography) */}
          <p className="text-slate-800 text-sm sm:text-base leading-relaxed font-sans pt-0.5">
            {place.description}
          </p>

          {/* Integrated Field Notes (Best Time + Access & Safety) */}
          <div className="bg-wabi-100/70 border border-sumi/20 rounded-2xl overflow-hidden shadow-riso-sm divide-y divide-sumi/15">
            {/* Best Time Row */}
            <div className="p-4 flex items-start gap-3.5">
              <div className="w-8 h-8 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center flex-shrink-0 mt-0.5 border border-amber-300/40">
                <Clock className="w-4 h-4 sm:w-5 sm:h-5" />
              </div>
              <div className="flex-1 min-w-0">
                <span className="text-xs font-mono font-bold uppercase tracking-wider text-slate-500 block">
                  Golden Hour / Best Window
                </span>
                <p className="text-xs sm:text-sm font-semibold text-sumi mt-0.5">
                  {place.best_time_to_visit}
                </p>
              </div>
            </div>

            {/* Safety & Access Row */}
            <div className="p-4 flex items-start gap-3.5">
              <div className="w-8 h-8 rounded-xl bg-matcha-50 text-matcha-700 flex items-center justify-center flex-shrink-0 mt-0.5 border border-matcha/30">
                <ShieldCheck className="w-4 h-4 sm:w-5 sm:h-5" />
              </div>
              <div className="flex-1 min-w-0">
                <span className="text-xs font-mono font-bold uppercase tracking-wider text-slate-500 block">
                  Access & Safety Profile
                </span>
                <p className="text-xs sm:text-sm text-slate-700 mt-0.5">
                  <span className="font-bold text-sumi">
                    {place.safety_level === 'high' ? 'Verified Public & Safe' : 'Daylight Visit Advised'}:
                  </span>{' '}
                  {place.safety_notes}
                </p>
              </div>
            </div>
          </div>

          {/* Action Row (Wander Here, Share, Report, & Google Maps above hashtags) */}
          <div className="pt-2 flex flex-col gap-2.5">
            <div className="flex items-center gap-2 sm:gap-2.5">
              <a
                href={googleMapsDirectionsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 flex items-center justify-center gap-2 bg-sumi hover:bg-vermilion text-wabi font-mono font-bold py-3 sm:py-3.5 px-3 sm:px-4 rounded-xl border-2 border-sumi shadow-riso hover:shadow-riso-red hover:-translate-y-0.5 transition-all text-xs uppercase tracking-wider group active:scale-[0.99]"
              >
                <Navigation className="w-4 h-4 text-amber-300 group-hover:rotate-45 transition-transform" />
                <span className="truncate">WANDER HERE (DIRECTIONS)</span>
                <ArrowUpRight className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform flex-shrink-0" />
              </a>

              <button
                onClick={handleShare}
                className="p-3 sm:p-3.5 rounded-xl border-2 border-sumi bg-wabi text-slate-700 hover:text-sumi hover:bg-amber-100 shadow-riso-sm transition-all active:scale-95 flex-shrink-0"
                title="Share this spot"
              >
                {copied ? <Check className="w-4 h-4 text-emerald-600" /> : <Share2 className="w-4 h-4" />}
              </button>

              <button
                onClick={() => onOpenReport(place)}
                className="p-3 sm:p-3.5 rounded-xl border-2 border-sumi bg-wabi text-slate-500 hover:text-red-600 hover:bg-red-50 shadow-riso-sm transition-all active:scale-95 flex-shrink-0"
                title="Report issue (closed, private property, unsafe)"
              >
                <AlertTriangle className="w-4 h-4" />
              </button>
            </div>

            <a
              href={googleMapsPlaceUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-center text-[11px] sm:text-xs font-mono text-slate-500 hover:text-vermilion font-medium underline tracking-wide py-0.5 transition-colors"
            >
              Verify official landmark card & reviews on Google Maps ↗
            </a>
          </div>

          {/* Vibe Tags Strip (At the very end of the card) */}
          <div className="pt-3 pb-2 border-t border-sumi/15">
            <div className="flex flex-wrap gap-1.5 sm:gap-2">
              {place.vibe_tags.map((tag) => (
                <span
                  key={tag}
                  className="px-2.5 sm:px-3 py-1 bg-wabi-100/90 text-slate-600 rounded-lg text-[11px] sm:text-xs font-mono font-medium border border-sumi/15 hover:border-sumi/40 hover:bg-wabi-200 transition-colors"
                >
                  #{tag}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
