'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { Place } from '@/lib/types';
import { formatDistance } from '@/lib/scoring';
import { getCurrentVibeWindow, checkIsPlacePeakingNow } from '@/lib/vibeRadar';
import { getSanctuaryTransitProfile, formatTransitDistance, formatTransitProximity } from '@/lib/transit';
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
  Coins,
  Train,
  ArrowRight,
  Zap,
  MapPin,
  Star,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';

interface PlaceCardDrawerProps {
  place: Place | null;
  onClose: () => void;
  onOpenReport: (place: Place) => void;
  onOpenTransit?: (place: Place) => void;
  onOpenSmartCommute?: (place: Place) => void;
}

const FALLBACK_IMAGE =
  'https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=1000&auto=format&fit=crop&q=80';

function getBrandEmoji(brand: string): string {
  const b = brand.toLowerCase();
  if (b.includes('mcdonald')) return '🍔';
  if (b.includes('kfc')) return '🍗';
  if (b.includes('burger')) return '👑';
  if (b.includes('taco')) return '🌮';
  if (b.includes('subway')) return '🥪';
  if (b.includes('pizza') || b.includes('domino')) return '🍕';
  if (b.includes('starbucks') || b.includes('coffee') || b.includes('hortons')) return '☕';
  return '🍽️';
}

export default function PlaceCardDrawer({
  place,
  onClose,
  onOpenReport,
  onOpenTransit,
  onOpenSmartCommute,
}: PlaceCardDrawerProps) {
  const [isFavorited, setIsFavorited] = useState(false);
  const [copied, setCopied] = useState(false);
  const [isMobileMinimized, setIsMobileMinimized] = useState(true);

  // When a new place is selected, start in compact Peek Mode so the mobile map and transit lines are visible
  useEffect(() => {
    if (place) {
      setIsMobileMinimized(true);
    }
  }, [place?.id]);

  const transitProfile = useMemo(() => {
    if (!place) return null;
    return getSanctuaryTransitProfile(place.latitude, place.longitude);
  }, [place]);

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
    const cleanCity = place.city ? place.city.replace(/\s*\/\s*MMR(\s*Coast)?/i, '').trim() : 'Mumbai';
    const mapsLink = `https://www.google.com/maps/search/?api=1&query=${place.latitude},${place.longitude}`;
    const shareData = {
      title: `${place.name} · KHOJ`,
      text: `Discover ${place.name} (${place.neighborhood ? place.neighborhood + ', ' : ''}${cleanCity}) on KHOJ: ${place.description}\n📍 Maps: ${mapsLink}`,
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
    navigator.clipboard.writeText(`${place.name} (${place.neighborhood ? place.neighborhood + ', ' : ''}${cleanCity})\n${place.description}\n📍 Google Maps: ${mapsLink}`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (!place) return null;

  // Clean city name for accurate landmark knowledge graph search (e.g. Alibaug, Thane, Navi Mumbai, Matheran, Mumbai)
  const cleanCity = place.city ? place.city.replace(/\s*\/\s*MMR(\s*Coast)?/i, '').trim() : 'Mumbai';
  const cleanSearchTarget = [place.name, place.neighborhood, cleanCity].filter(Boolean).join(', ');

  // Directions link uses exact verified GPS coordinates for 100% foolproof turn-by-turn navigation
  const googleMapsDirectionsUrl = `https://www.google.com/maps/dir/?api=1&destination=${place.latitude},${place.longitude}`;
  
  // Landmark card link opens Google Places knowledge card with verified business name, photos, and ratings
  const googleMapsPlaceUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(cleanSearchTarget)}`;

  const { window: currentVibeWindow } = getCurrentVibeWindow();
  const peakInfo = checkIsPlacePeakingNow(place, currentVibeWindow);

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 md:left-auto md:right-6 md:bottom-6 md:w-[540px] lg:w-[580px] pb-safe transition-transform duration-300 ease-out font-sans">
      {/* 1. MOBILE COMPACT PEEK CARD (Shown on mobile when minimized so map, pins & lines stay 100% visible) */}
      {isMobileMinimized && (
        <div className="md:hidden bg-wabi/95 backdrop-blur-xl rounded-t-3xl border-2 border-sumi shadow-riso p-3.5 flex flex-col gap-2.5 animate-in slide-in-from-bottom-2 duration-200">
          {/* Top Bar: Tap to expand + Close */}
          <div 
            onClick={() => setIsMobileMinimized(false)}
            className="w-full flex items-center justify-between cursor-pointer"
          >
            <div className="flex items-center gap-2 min-w-0">
              <span className="w-2.5 h-2.5 rounded-full bg-vermilion flex-shrink-0 animate-pulse" />
              <span className="font-mono text-xs font-bold text-sumi truncate">
                {place.neighborhood ? `${place.neighborhood}, ${place.city}` : place.city}
              </span>
              {place.distance_meters !== undefined && (
                <span className="font-mono text-[10px] bg-sumi/10 px-2 py-0.5 rounded font-bold text-slate-700 flex-shrink-0">
                  {formatDistance(place.distance_meters)}
                </span>
              )}
            </div>

            <div className="flex items-center gap-1.5 flex-shrink-0">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setIsMobileMinimized(false);
                }}
                className="px-2 py-1 rounded-lg bg-amber-400 text-sumi border border-sumi font-mono text-[10px] font-black flex items-center gap-1 shadow-2xs hover:bg-amber-300"
                title="Expand Full Details"
              >
                <span>EXPAND</span>
                <ChevronUp className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onClose();
                }}
                className="p-1 rounded-lg text-slate-500 hover:text-sumi hover:bg-black/10"
                title="Close Place"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Middle Row: Photo + Name + Transit Distances */}
          <div 
            onClick={() => setIsMobileMinimized(false)}
            className="flex items-center gap-3 cursor-pointer"
          >
            <img
              src={place.photo_url}
              alt={place.name}
              onError={(e) => { (e.target as HTMLImageElement).src = FALLBACK_IMAGE; }}
              className="w-14 h-14 rounded-xl object-cover border-2 border-sumi shadow-xs flex-shrink-0"
            />
            <div className="min-w-0 flex-1">
              <h3 className="font-sans font-bold text-sm text-sumi truncate leading-tight">
                {place.name}
              </h3>
              {transitProfile && (
                <div className="flex items-center gap-2 text-[11px] font-mono text-slate-700 mt-1 flex-wrap">
                  <span className="text-rose-700 font-bold truncate">
                    🚆 {transitProfile.nearestRailway.station.name} ({formatTransitDistance(transitProfile.nearestRailway.distanceMeters)})
                  </span>
                  {transitProfile.nearestMetro && (
                    <span className="text-sky-700 font-bold truncate">
                      🚇 {transitProfile.nearestMetro.station.name} ({formatTransitDistance(transitProfile.nearestMetro.distanceMeters)})
                    </span>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Bottom Quick Action Bar */}
          <div className="flex items-center gap-2 pt-0.5">
            <a
              href={googleMapsPlaceUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 flex items-center justify-center gap-1.5 bg-white text-sumi border-2 border-sumi rounded-xl py-2 px-2 text-[11px] font-mono font-bold shadow-xs hover:bg-slate-50"
            >
              <MapPin className="w-3.5 h-3.5 text-vermilion" />
              <span className="truncate">GOOGLE CARD</span>
              <ArrowUpRight className="w-3.5 h-3.5 text-slate-400" />
            </a>
            <a
              href={googleMapsDirectionsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 flex items-center justify-center gap-1.5 bg-sumi text-white border-2 border-sumi rounded-xl py-2 px-2 text-[11px] font-mono font-bold shadow-xs hover:bg-slate-800"
            >
              <Navigation className="w-3.5 h-3.5 text-amber-300" />
              <span className="truncate">DIRECTIONS</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>
      )}

      {/* 2. FULL EXPANDED DRAWER (Always visible on desktop md:flex, or on mobile when !isMobileMinimized) */}
      <div className={`bg-wabi/95 backdrop-blur-xl md:rounded-3xl rounded-t-3xl border-2 border-sumi shadow-riso overflow-hidden max-h-[85dvh] md:max-h-[88vh] flex-col ${isMobileMinimized ? 'hidden md:flex' : 'flex'}`}>
        {/* Mobile Tactile Drag Pill (Tap to minimize back to peek card) */}
        <div 
          onClick={() => setIsMobileMinimized(true)}
          className="w-full py-2 cursor-pointer md:hidden flex justify-center flex-shrink-0"
          title="Tap to minimize to peek card"
        >
          <div className="w-12 h-1.5 bg-sumi/40 rounded-full hover:bg-sumi/60 transition-colors" />
        </div>

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
          
          {/* Top dark gradient vignette for readable buttons */}
          <div className="absolute inset-x-0 top-0 h-16 bg-gradient-to-b from-black/70 to-transparent pointer-events-none z-10" />

          {/* Bottom dark gradient vignette for bottom badges */}
          <div className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-black/70 to-transparent pointer-events-none z-10" />

          {/* Top Header Bar Over Photo */}
          <div className="absolute top-2.5 sm:top-3.5 inset-x-2.5 sm:inset-x-3.5 flex items-center justify-between gap-2 z-20 pointer-events-none">
            {/* Top Left: Category & Tier Badges (Compact & clean, never overlaps) */}
            <div className="flex items-center gap-1.5 min-w-0 pointer-events-auto">
              <span className="px-2.5 py-1 rounded-lg text-xs font-mono font-black uppercase tracking-wider bg-sumi/90 text-wabi border border-white/20 shadow-sm truncate">
                {place.category.toUpperCase()}
              </span>
              <span className={`px-2 py-1 rounded-lg text-xs font-mono font-black uppercase border shadow-sm truncate ${
                place.spot_tier === 'iconic'
                  ? 'bg-amber-400 text-sumi border-amber-500/50'
                  : place.spot_tier === 'underrated'
                  ? 'bg-cobalt text-white border-blue-400/50'
                  : 'bg-vermilion text-white border-rose-400/50'
              }`}>
                {place.spot_tier === 'iconic' ? '★ ICONIC' : place.spot_tier === 'underrated' ? '● UNDERRATED' : '✦ HIDDEN'}
              </span>
            </div>

            {/* Top Right: Unified Glass Action Cluster (Save, Minimize, Close) */}
            <div className="flex items-center gap-1 bg-sumi/80 backdrop-blur-md border border-white/20 rounded-xl p-0.5 shadow-sm pointer-events-auto flex-shrink-0">
              <button
                type="button"
                onClick={toggleFavorite}
                className={`p-1.5 rounded-lg transition-all active:scale-95 ${
                  isFavorited
                    ? 'bg-vermilion text-white'
                    : 'text-white hover:bg-white/20'
                }`}
                title="Save to favorites"
              >
                <Heart className={`w-4 h-4 ${isFavorited ? 'fill-current' : ''}`} />
              </button>
              <button
                type="button"
                onClick={() => setIsMobileMinimized(true)}
                className="p-1.5 rounded-lg text-white hover:bg-white/20 active:scale-95 transition-colors md:hidden"
                title="Minimize to peek card (explore map & lines)"
              >
                <ChevronDown className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={onClose}
                className="p-1.5 rounded-lg text-white hover:bg-white/20 active:scale-95 transition-colors"
                title="Close place"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Bottom Badges Over Photo (Clean, positioned at bottom corners) */}
          <div className="absolute bottom-2.5 sm:bottom-3.5 inset-x-2.5 sm:inset-x-3.5 flex items-center justify-between gap-2 z-20 pointer-events-none">
            {place.distance_meters !== undefined ? (
              <span className="px-2.5 py-0.5 rounded-lg text-[11px] font-mono font-bold bg-black/60 text-white backdrop-blur-md border border-white/20 shadow-sm pointer-events-auto">
                📍 {formatDistance(place.distance_meters)} away
              </span>
            ) : <span />}

            <div className="flex items-center gap-1.5 pointer-events-auto">
              {place.approx_cost && (
                <span className="px-2.5 py-0.5 rounded-lg text-[11px] font-mono font-bold bg-amber-400 text-sumi border border-amber-600 shadow-sm">
                  🪙 {place.approx_cost}
                </span>
              )}
              {peakInfo.isPeaking && (
                <span className="px-2 py-0.5 rounded-lg text-[10px] font-mono font-black uppercase bg-emerald-600 text-white border border-emerald-400 shadow-sm flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
                  <span>PEAK TIME</span>
                </span>
              )}
            </div>
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

          {/* Unverified OpenStreetMap Candidate Banner */}
          {place.verification_status === 'candidate_unverified' && (
            <div className="bg-amber-50 border-2 border-amber-400 rounded-2xl p-3 flex items-start gap-2.5 text-amber-950 shadow-2xs font-mono text-xs animate-in fade-in duration-100">
              <AlertTriangle className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
              <div className="flex-1 min-w-0">
                <span className="font-bold uppercase tracking-wider block text-[10px] text-amber-900">
                  OpenStreetMap Candidate (Unverified)
                </span>
                <p className="text-[11px] text-slate-700 mt-0.5 leading-relaxed">
                  Imported via community open data. Exact opening hours and menu are candidate facts not yet independently verified.
                </p>
                {place.source_url && (
                  <a
                    href={place.source_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-[10px] font-bold text-amber-900 underline mt-1.5 hover:text-black"
                  >
                    <span>Inspect OSM Entity</span>
                    <ArrowUpRight className="w-2.5 h-2.5" />
                  </a>
                )}
              </div>
            </div>
          )}

          {/* Live Vibe Radar Active Window Callout */}
          {peakInfo.isPeaking && (
            <div className="bg-emerald-50 border-2 border-emerald-500/50 rounded-2xl p-3.5 flex items-center gap-3 text-emerald-950 shadow-riso-sm">
              <div className="w-9 h-9 rounded-xl bg-emerald-600 text-white flex items-center justify-center flex-shrink-0 text-base shadow-sm">
                {currentVibeWindow.icon}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1.5 font-mono text-[11px] font-bold text-emerald-700 uppercase">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-600" />
                  <span>VIBE RADAR: PEAKING RIGHT NOW</span>
                </div>
                <p className="text-xs sm:text-sm font-semibold text-emerald-900 mt-0.5">
                  {peakInfo.reason}
                </p>
              </div>
            </div>
          )}

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

          {/* Custom-Crafted Mall & Fast Food Outlets Card */}
          {place.outlets && place.outlets.length > 0 && (
            <div className="bg-wabi rounded-2xl border-2 border-sumi shadow-riso-sm p-4 space-y-3 animate-in fade-in duration-150">
              {/* Header */}
              <div className="flex items-center justify-between pb-2 border-b-2 border-sumi/15">
                <div className="flex items-center gap-2">
                  <span className="text-xl">
                    {place.hub_type === 'mall' ? '🏬' : '🍔'}
                  </span>
                  <div>
                    <h3 className="font-mono font-black text-xs sm:text-sm text-sumi uppercase tracking-wide">
                      {place.hub_type === 'mall' ? 'FOOD COURT & POPULAR CHAINS' : 'FAST FOOD & DRIVE-THRU'}
                    </h3>
                    <span className="text-[10px] font-mono text-slate-500">
                      {place.total_outlets_count ? `${place.outlets.length} of ${place.total_outlets_count} food outlets featured` : 'Verified fast food counters'}
                    </span>
                  </div>
                </div>

                {place.hub_type === 'mall' && (
                  <span className="text-[10px] font-mono font-black px-2 py-0.5 rounded-full bg-indigo-100 text-indigo-900 border border-indigo-300 shadow-2xs">
                    MALL HUB
                  </span>
                )}
              </div>

              {/* 5-7 Curated Outlets Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {place.outlets.map((outlet, i) => (
                  <div
                    key={i}
                    className="flex items-start gap-2.5 p-2.5 rounded-xl bg-white border border-sumi/25 shadow-2xs hover:border-sumi transition-colors"
                  >
                    <span className="text-xl flex-shrink-0 mt-0.5 select-none">
                      {getBrandEmoji(outlet.brand)}
                    </span>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-baseline justify-between gap-1">
                        <span className="font-bold text-xs sm:text-sm text-sumi truncate">{outlet.name}</span>
                        {outlet.has_drive_thru && (
                          <span className="text-[9px] font-mono font-black text-rose-700 bg-rose-50 px-1 rounded border border-rose-300 flex-shrink-0">
                            DRIVE-THRU
                          </span>
                        )}
                      </div>
                      <span className="text-[11px] font-mono text-slate-600 block truncate font-medium">
                        {outlet.floor}
                      </span>
                      {outlet.timing && (
                        <span className="text-[10px] font-mono text-slate-400 block truncate">
                          {outlet.timing}
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              {/* "And Many More..." Interactive Link */}
              <a
                href={
                  place.more_outlets_url ||
                  `https://www.google.com/maps/search/food+restaurants+in+${encodeURIComponent(place.name)}+${encodeURIComponent(place.neighborhood || 'Mumbai')}`
                }
                target="_blank"
                rel="noopener noreferrer"
                className="w-full flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl bg-amber-50 hover:bg-amber-100 border-2 border-sumi text-sumi text-xs font-mono font-bold transition-all shadow-2xs hover:shadow-riso-sm hover:-translate-y-0.5 active:scale-98 text-center"
              >
                <span>
                  {place.more_outlets_text ||
                    `+ ${Math.max(10, (place.total_outlets_count || 30) - place.outlets.length)} more food outlets & cafes on Maps`}
                </span>
                <ArrowUpRight className="w-3.5 h-3.5 text-sumi flex-shrink-0" />
              </a>

              {/* Youth Amenities & Entertainment Badges */}
              {(place.amenities || (place.entertainment && place.entertainment.length > 0)) && (
                <div className="flex flex-wrap items-center gap-1.5 pt-1 border-t border-sumi/10">
                  {place.amenities?.heavy_ac && (
                    <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-lg bg-sky-50 text-sky-900 border border-sky-300 flex items-center gap-1">
                      <span>❄️</span>
                      <span>Heavy AC Chill</span>
                    </span>
                  )}
                  {place.amenities?.plug_points && (
                    <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-lg bg-amber-50 text-amber-900 border border-amber-300 flex items-center gap-1">
                      <span>⚡</span>
                      <span>Plug Points</span>
                    </span>
                  )}
                  {place.amenities?.free_wifi && (
                    <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-lg bg-emerald-50 text-emerald-900 border border-emerald-300 flex items-center gap-1">
                      <span>📶</span>
                      <span>Free Wi-Fi</span>
                    </span>
                  )}
                  {place.amenities?.late_night && (
                    <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-lg bg-rose-50 text-rose-900 border border-rose-300 flex items-center gap-1">
                      <span>🌙</span>
                      <span>Late Night</span>
                    </span>
                  )}
                  {place.entertainment?.map((ent, i) => (
                    <span
                      key={i}
                      className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-lg bg-purple-50 text-purple-900 border border-purple-300 flex items-center gap-1"
                    >
                      <span>🎮</span>
                      <span>{ent}</span>
                    </span>
                  ))}
                </div>
              )}
            </div>
          )}

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

            {/* Budget & Pocket Guide Row */}
            <div className="p-4 flex items-start gap-3.5">
              <div className="w-8 h-8 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center flex-shrink-0 mt-0.5 border border-amber-300/40">
                <Coins className="w-4 h-4 sm:w-5 sm:h-5" />
              </div>
              <div className="flex-1 min-w-0">
                <span className="text-xs font-mono font-bold uppercase tracking-wider text-slate-500 block">
                  Budget & Pocket Guide
                </span>
                <div className="flex flex-wrap items-center gap-2 mt-0.5">
                  <span className="text-xs sm:text-sm font-bold text-sumi">
                    {place.approx_cost || (place.budget_tier === 'free' ? 'Free Public Access' : 'Moderate')}
                  </span>
                  <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-sumi/10 uppercase text-slate-700">
                    {place.budget_tier === 'free'
                      ? '₹0 Free'
                      : place.budget_tier === 'pocket_friendly'
                      ? '₹ Pocket Friendly'
                      : place.budget_tier === 'moderate'
                      ? '₹₹ Moderate'
                      : '₹₹₹ Splurge'}
                  </span>
                </div>
              </div>
            </div>

            {/* Local Train & Metro Directions Row */}
            {transitProfile && (
              <div className="p-4 flex items-start gap-3.5 bg-amber-50/70 border-t border-sumi/10">
                <div className="w-8 h-8 rounded-xl bg-amber-200 text-amber-900 flex items-center justify-center flex-shrink-0 mt-0.5 border border-amber-400/40">
                  <Train className="w-4 h-4 sm:w-5 sm:h-5 text-rose-700" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-mono font-bold uppercase tracking-wider text-slate-600 block">
                      Local Train & Metro Access
                    </span>
                    {onOpenTransit && (
                      <button
                        onClick={() => onOpenTransit(place)}
                        className="text-[10px] font-mono font-bold text-vermilion hover:underline flex items-center gap-0.5"
                      >
                        <span>FULL GUIDE</span>
                        <ArrowRight className="w-3 h-3" />
                      </button>
                    )}
                  </div>
                  <div className="mt-1 space-y-1 text-xs">
                    {transitProfile.nearestRailway && (
                      <div className="flex items-baseline justify-between gap-2 text-sumi">
                        <span className="font-bold truncate">
                          🚆 {transitProfile.nearestRailway.station.name} ({transitProfile.nearestRailway.station.lines.join('/')})
                        </span>
                        <span className="font-mono text-[11px] text-slate-600 flex-shrink-0">
                          {formatTransitProximity(transitProfile.nearestRailway.distanceMeters, transitProfile.nearestRailway.walkMinutes)}
                        </span>
                      </div>
                    )}
                    {transitProfile.nearestMetro && (
                      <div className="flex items-baseline justify-between gap-2 text-sumi">
                        <span className="font-bold truncate">
                          🚇 {transitProfile.nearestMetro.station.name}
                        </span>
                        <span className="font-mono text-[11px] text-slate-600 flex-shrink-0">
                          {formatTransitProximity(transitProfile.nearestMetro.distanceMeters, transitProfile.nearestMetro.walkMinutes)}
                        </span>
                      </div>
                    )}
                    <p className="text-[11px] text-slate-600 font-sans pt-0.5 leading-relaxed">
                      {transitProfile.recommendedConnection}
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Action Hub (1: Google Landmark & Reviews, 2: Wander Here, 3: Local Metro, 4: Plan Foolproof) */}
          <div className="pt-2 flex flex-col gap-2.5">
            {/* 1. FIRST & HIGHLIGHTED: Official Google Maps Landmark Card & Live Reviews */}
            <a
              href={googleMapsPlaceUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full flex items-center justify-between gap-3 bg-white hover:bg-slate-50 text-sumi p-3 sm:p-3.5 rounded-2xl border-2 border-sumi shadow-sm hover:shadow-md transition-all active:scale-[0.99]"
              title="Open official Google Maps place card with reviews, photos, and live ratings"
            >
              <div className="flex items-center gap-2.5 sm:gap-3 min-w-0">
                <div className="w-10 h-10 rounded-xl bg-vermilion text-white flex items-center justify-center font-bold flex-shrink-0 border-2 border-sumi shadow-sm">
                  <MapPin className="w-5 h-5 text-white" />
                </div>
                <div className="min-w-0 text-left">
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <span className="font-mono font-black text-xs sm:text-sm tracking-wide uppercase text-sumi truncate">
                      GOOGLE MAPS LANDMARK & REVIEWS
                    </span>
                    <span className="inline-flex items-center gap-0.5 text-[9px] sm:text-[10px] font-mono font-bold bg-amber-100 text-amber-900 px-1.5 py-0.5 rounded border border-amber-300">
                      <Star className="w-2.5 h-2.5 fill-current text-amber-600" />
                      <span>OFFICIAL CARD</span>
                    </span>
                  </div>
                  <p className="text-[11px] sm:text-xs text-slate-600 font-sans truncate mt-0.5">
                    Live crowd ratings, guest reviews, food photos & menu
                  </p>
                </div>
              </div>
              <ArrowUpRight className="w-5 h-5 text-slate-500 hover:text-sumi transition-colors flex-shrink-0" />
            </a>

            {/* 2. SECOND: Wander Here (Turn-by-Turn GPS Navigation) + Share + Report */}
            <div className="flex items-center gap-2 sm:gap-2.5">
              <a
                href={googleMapsDirectionsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 flex items-center justify-center gap-2 bg-sumi hover:bg-slate-800 text-white font-mono font-bold py-3 sm:py-3.5 px-3 sm:px-4 rounded-xl border-2 border-sumi shadow-sm hover:shadow-md transition-colors text-xs uppercase tracking-wider active:scale-[0.98]"
              >
                <Navigation className="w-4 h-4 text-amber-300" />
                <span className="truncate">WANDER HERE (DIRECTIONS)</span>
                <ArrowUpRight className="w-4 h-4 flex-shrink-0" />
              </a>

              <button
                onClick={handleShare}
                className="p-3 sm:p-3.5 rounded-xl border-2 border-sumi bg-wabi text-slate-700 hover:text-sumi hover:bg-slate-100 shadow-sm transition-colors active:scale-95 flex-shrink-0"
                title="Share this spot"
              >
                {copied ? <Check className="w-4 h-4 text-emerald-600" /> : <Share2 className="w-4 h-4" />}
              </button>

              <button
                onClick={() => onOpenReport(place)}
                className="p-3 sm:p-3.5 rounded-xl border-2 border-sumi bg-wabi text-slate-500 hover:text-red-600 hover:bg-red-50 shadow-sm transition-colors active:scale-95 flex-shrink-0"
                title="Report issue (closed, private property, unsafe)"
              >
                <AlertTriangle className="w-4 h-4" />
              </button>
            </div>

            {/* 3. THIRD: Open Local Train & Metro Route */}
            {onOpenTransit && (
              <button
                onClick={() => onOpenTransit(place)}
                className="w-full flex items-center justify-center gap-2 bg-amber-400 hover:bg-amber-300 text-sumi font-mono font-bold py-2.5 px-3 rounded-xl border-2 border-sumi shadow-sm hover:shadow-md transition-colors text-xs uppercase tracking-wider active:scale-[0.98]"
              >
                <Train className="w-4 h-4 text-rose-700" />
                <span>OPEN LOCAL TRAIN & METRO ROUTE</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            )}

            {/* 4. FOURTH: Plan Foolproof Commute */}
            {onOpenSmartCommute && (
              <button
                onClick={() => onOpenSmartCommute(place)}
                className="w-full flex items-center justify-center gap-2 bg-sumi hover:bg-slate-800 text-white font-mono font-bold py-2.5 px-3 rounded-xl border-2 border-sumi shadow-sm hover:shadow-md transition-colors text-xs uppercase tracking-wider active:scale-[0.98]"
              >
                <Zap className="w-4 h-4 text-amber-300" />
                <span>PLAN FOOLPROOF COMMUTE (FAST/SLOW & CROWD RADAR)</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            )}

            {place.source === 'openstreetmap' && (
              <p className="text-center text-[10px] font-mono text-slate-400 pt-1">
                Data ©{' '}
                <a
                  href="https://www.openstreetmap.org/copyright"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="underline hover:text-sumi"
                >
                  OpenStreetMap
                </a>{' '}
                contributors under ODbL license.
              </p>
            )}
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
