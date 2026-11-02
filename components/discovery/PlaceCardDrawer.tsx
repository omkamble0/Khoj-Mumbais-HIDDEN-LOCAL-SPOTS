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
    <div className="fixed bottom-0 left-0 right-0 z-50 md:left-auto md:right-6 md:bottom-6 md:w-[460px] transition-transform duration-300 ease-out font-sans">
      <div className="bg-wabi/95 backdrop-blur-xl md:rounded-3xl rounded-t-3xl border-2 border-sumi shadow-riso overflow-hidden max-h-[85vh] flex flex-col">
        {/* Card Header Media & Actions */}
        <div className="relative h-52 w-full bg-sumi-900 flex-shrink-0 border-b-2 border-sumi overflow-hidden">
          <img
            src={place.photo_url}
            alt={place.name}
            onError={(e) => {
              (e.target as HTMLImageElement).src = FALLBACK_IMAGE;
            }}
            className="w-full h-full object-cover opacity-90 hover:scale-105 transition-transform duration-500 contrast-105"
          />
          {/* Subtle Halftone Dot Pattern */}
          <div className="absolute inset-0 bg-riso-dots opacity-25 pointer-events-none" />

          {/* Close & Favorite Top Actions */}
          <div className="absolute top-3 right-3 flex items-center gap-2 z-10">
            <button
              onClick={toggleFavorite}
              className={`p-2.5 rounded-xl border-2 border-sumi shadow-riso-sm transition-all ${
                isFavorited
                  ? 'bg-vermilion text-white'
                  : 'bg-wabi text-sumi hover:bg-rose-50'
              }`}
              title="Save to favorites"
            >
              <Heart className={`w-4 h-4 ${isFavorited ? 'fill-current' : ''}`} />
            </button>
            <button
              onClick={onClose}
              className="p-2.5 rounded-xl bg-wabi text-sumi border-2 border-sumi shadow-riso-sm hover:bg-slate-200 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Top English Tag & Tier Badge */}
          <div className="absolute top-3 left-3 flex items-center gap-1.5 z-10">
            <span className="px-2.5 py-1 rounded text-xs font-mono font-bold uppercase tracking-wider bg-sumi text-wabi border border-sumi shadow-riso-sm">
              {place.category.toUpperCase()}
            </span>
            <span className={`px-2.5 py-1 rounded text-xs font-mono font-black uppercase border border-sumi shadow-riso-sm ${
              place.spot_tier === 'iconic'
                ? 'bg-amber-400 text-sumi'
                : place.spot_tier === 'underrated'
                ? 'bg-cobalt text-white'
                : 'bg-vermilion text-white'
            }`}>
              {place.spot_tier === 'iconic' ? '★ ICONIC' : place.spot_tier === 'underrated' ? '● UNDERRATED' : '✦ HIDDEN'}
            </span>
            {place.distance_meters !== undefined && (
              <span className="text-xs font-mono font-bold bg-wabi text-sumi border border-sumi px-2.5 py-1 rounded shadow-riso-sm">
                {formatDistance(place.distance_meters)}
              </span>
            )}
          </div>

          {/* Subtitle & Coordinates Banner */}
          <div className="absolute bottom-2.5 left-3 right-3 bg-sumi/95 backdrop-blur-md text-wabi p-3 rounded-2xl border border-white/20">
            <h2 className="font-display font-bold text-2xl md:text-3xl leading-snug tracking-wide text-white drop-shadow-md">
              {place.name}
            </h2>
            <div className="flex items-center justify-between text-xs font-mono text-slate-200 mt-1 font-medium">
              <span>{place.neighborhood ? `${place.neighborhood}, ${place.city}` : place.city}</span>
              <span className="text-amber-300 font-bold tracking-wider">
                {place.latitude.toFixed(4)}°N, {place.longitude.toFixed(4)}°E
              </span>
            </div>
          </div>
        </div>

        {/* Scrollable Content Body */}
        <div className="p-4.5 overflow-y-auto space-y-4 text-sm">
          {/* Key Metrics Grid */}
          <div className="grid grid-cols-3 gap-2.5">
            {/* Hiddenness Score */}
            <div className="bg-wabi-100 border-2 border-sumi p-2.5 rounded-xl flex flex-col items-center justify-center text-center shadow-riso-sm">
              <div className="flex items-center gap-1.5 text-sumi font-black font-mono text-base">
                <EyeOff className="w-4 h-4 text-vermilion" />
                <span>{Math.round(place.hiddenness_score * 100)}%</span>
              </div>
              <span className="text-xs font-mono uppercase text-slate-600 font-bold mt-0.5">Hidden Score</span>
            </div>

            {/* Crowd Level */}
            <div className="bg-wabi-100 border-2 border-sumi p-2.5 rounded-xl flex flex-col items-center justify-center text-center shadow-riso-sm">
              <div className="flex items-center gap-1.5 text-sumi font-black font-mono text-xs">
                <Users className="w-4 h-4 text-matcha" />
                <span>
                  {place.crowd_level <= 1
                    ? 'Very Quiet'
                    : place.crowd_level === 2
                    ? 'Low Crowd'
                    : 'Moderate'}
                </span>
              </div>
              <span className="text-xs font-mono uppercase text-slate-600 font-bold mt-0.5">Crowd Level</span>
            </div>

            {/* Atmosphere / Vibe */}
            <div className="bg-wabi-100 border-2 border-sumi p-2.5 rounded-xl flex flex-col items-center justify-center text-center shadow-riso-sm">
              <div className="flex items-center gap-1.5 text-sumi font-black font-mono text-base">
                <Sparkles className="w-4 h-4 text-ochre" />
                <span>{Math.round(place.vibe_score * 100)}%</span>
              </div>
              <span className="text-xs font-mono uppercase text-slate-600 font-bold mt-0.5">Vibe Rating</span>
            </div>
          </div>

          {/* Description */}
          <p className="text-slate-800 leading-relaxed text-sm font-sans">
            {place.description}
          </p>

          {/* Recommended Time */}
          <div className="flex items-start gap-2.5 bg-amber-50/90 border-2 border-sumi p-3 rounded-xl text-sumi shadow-riso-sm">
            <Clock className="w-4 h-4 text-vermilion flex-shrink-0 mt-0.5" />
            <div>
              <span className="font-mono font-bold text-xs uppercase block text-slate-600">
                Golden Hour / Recommended Time:
              </span>
              <span className="font-sans font-semibold text-sm text-sumi">
                {place.best_time_to_visit}
              </span>
            </div>
          </div>

          {/* Safety Notice Badge */}
          <div className="flex items-start gap-2.5 p-3 rounded-xl border-2 border-sumi bg-matcha-50 text-matcha-700 shadow-riso-sm">
            <ShieldCheck className="w-4 h-4 text-matcha flex-shrink-0 mt-0.5" />
            <div className="text-xs font-sans">
              <span className="font-bold">
                {place.safety_level === 'high' ? 'Verified Public & Safe' : 'Daylight Visit Advised'}:
              </span>{' '}
              <span className="text-slate-700">{place.safety_notes}</span>
            </div>
          </div>

          {/* Vibe Tags */}
          <div className="flex flex-wrap gap-2 pt-1">
            {place.vibe_tags.map((tag) => (
              <span
                key={tag}
                className="px-2.5 py-1 bg-wabi-200 border border-sumi/30 text-sumi rounded-lg text-xs font-mono font-bold"
              >
                #{tag}
              </span>
            ))}
          </div>

          {/* Action Row */}
          <div className="pt-2 flex flex-col gap-2.5 border-t border-sumi/15">
            <div className="flex items-center gap-2">
              <a
                href={googleMapsDirectionsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 flex items-center justify-center gap-2 bg-sumi hover:bg-vermilion text-wabi font-mono font-bold py-3 px-4 rounded-xl border-2 border-sumi shadow-riso transition-all text-xs uppercase tracking-wider group"
              >
                <Navigation className="w-4 h-4 text-amber-300" />
                <span>Wander Here (Directions)</span>
                <ArrowUpRight className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
              </a>

              <button
                onClick={handleShare}
                className="p-2.5 rounded-xl border-2 border-sumi bg-wabi text-slate-700 hover:text-sumi hover:bg-amber-100 shadow-riso-sm transition-colors"
                title="Share this spot"
              >
                {copied ? <Check className="w-4 h-4 text-emerald-600" /> : <Share2 className="w-4 h-4" />}
              </button>

              <button
                onClick={() => onOpenReport(place)}
                className="p-2.5 rounded-xl border-2 border-sumi bg-wabi text-slate-500 hover:text-red-600 hover:bg-red-50 shadow-riso-sm transition-colors"
                title="Report issue (closed, private property, unsafe)"
              >
                <AlertTriangle className="w-4 h-4" />
              </button>
            </div>

            <a
              href={googleMapsPlaceUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-center text-[10px] font-mono text-slate-500 hover:text-vermilion font-bold underline"
            >
              Verify official landmark card & reviews on Google Maps ↗
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
