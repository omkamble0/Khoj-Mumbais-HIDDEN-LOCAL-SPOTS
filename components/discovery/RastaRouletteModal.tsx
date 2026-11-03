'use client';

import React, { useState, useEffect } from 'react';
import { Place, PlaceCategory } from '@/lib/types';
import { getCurrentVibeWindow, checkIsPlacePeakingNow, rollRastaRoulette } from '@/lib/vibeRadar';
import {
  Sparkles,
  Dices,
  Navigation,
  Compass,
  X,
  RotateCw,
  Clock,
  ArrowRight,
  Flame,
  Zap,
} from 'lucide-react';

interface RastaRouletteModalProps {
  isOpen: boolean;
  onClose: () => void;
  places: Place[];
  userLocation: { lat: number; lng: number } | null;
  onSelectPlace: (place: Place) => void;
  currentCategory?: PlaceCategory;
}

export default function RastaRouletteModal({
  isOpen,
  onClose,
  places,
  userLocation,
  onSelectPlace,
  currentCategory,
}: RastaRouletteModalProps) {
  const [mode, setMode] = useState<'pure' | 'peaking' | 'hidden' | 'near'>('pure');
  const [isRolling, setIsRolling] = useState(false);
  const [rolledPlace, setRolledPlace] = useState<Place | null>(null);
  const [displayTitle, setDisplayTitle] = useState('Spinning the Rasta Reel...');
  const [rollCount, setRollCount] = useState(0);

  const { window: currentWindow, timeString } = getCurrentVibeWindow();

  // Trigger spin animation
  const spinRoulette = () => {
    if (isRolling || places.length === 0) return;
    setIsRolling(true);

    const winner = rollRastaRoulette(places, {
      mode,
      userLat: userLocation?.lat,
      userLng: userLocation?.lng,
      currentCategory,
    });

    let counter = 0;
    const interval = setInterval(() => {
      counter++;
      const randomFlicker = places[Math.floor(Math.random() * places.length)];
      setDisplayTitle(randomFlicker?.name || 'Exploring Mumbai...');

      if (counter >= 12) {
        clearInterval(interval);
        setRolledPlace(winner);
        setDisplayTitle(winner?.name || '');
        setIsRolling(false);
        setRollCount((prev) => prev + 1);
      }
    }, 75);
  };

  // Initial spin on open
  useEffect(() => {
    if (isOpen) {
      spinRoulette();
    } else {
      setRolledPlace(null);
    }
  }, [isOpen]);

  // Handle escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const peakInfo = rolledPlace ? checkIsPlacePeakingNow(rolledPlace, currentWindow) : null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-3 sm:p-4 bg-sumi/65 backdrop-blur-md animate-fade-in font-sans">
      <div 
        className="relative w-full max-w-lg bg-wabi border-2 border-sumi rounded-3xl shadow-riso overflow-hidden flex flex-col max-h-[92dvh] animate-scale-up"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header Bar */}
        <div className="bg-sumi text-wabi px-4 py-3 border-b-2 border-sumi flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-vermilion text-white flex items-center justify-center border border-wabi shadow-sm">
              <Dices className="w-4 h-4 animate-spin-slow" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-ananda font-normal text-lg sm:text-xl tracking-wide text-white leading-none">
                  RASTA ROULETTE
                </span>
                <span className="font-ananda text-xs text-amber-300 font-normal">
                  रस्ता रूलेट
                </span>
              </div>
              <p className="text-[10px] font-mono text-slate-300">
                Serendipity Generator · Mumbai Hidden Sanctuaries
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-7 h-7 rounded-full bg-wabi/10 hover:bg-vermilion text-wabi flex items-center justify-center transition-colors border border-wabi/20"
            title="Close"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Live Vibe Banner & Mode Selectors */}
        <div className="p-3 bg-wabi-100 border-b border-sumi/20 space-y-2">
          {/* Live Radar Pill */}
          <div className="flex items-center justify-between text-xs font-mono bg-wabi p-2 rounded-xl border border-sumi/20">
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="font-bold text-sumi">VIBE RADAR:</span>
              <span className="text-vermilion font-bold">{currentWindow.label}</span>
              <span className="text-slate-500 text-[11px]">({timeString})</span>
            </div>
            <span className="text-[10px] font-bold text-slate-600 hidden xs:inline">
              {currentWindow.tagline}
            </span>
          </div>

          {/* Mode Selector Tabs */}
          <div className="grid grid-cols-4 gap-1 text-[11px] font-mono font-bold">
            <button
              onClick={() => {
                setMode('pure');
                spinRoulette();
              }}
              className={`py-1.5 px-1 rounded-lg border text-center transition-all ${
                mode === 'pure'
                  ? 'bg-sumi text-wabi border-sumi shadow-sm'
                  : 'bg-wabi text-sumi border-sumi/20 hover:bg-wabi-200'
              }`}
            >
              🎲 Pure Luck
            </button>
            <button
              onClick={() => {
                setMode('peaking');
                spinRoulette();
              }}
              className={`py-1.5 px-1 rounded-lg border text-center transition-all ${
                mode === 'peaking'
                  ? 'bg-vermilion text-white border-sumi shadow-sm'
                  : 'bg-wabi text-sumi border-sumi/20 hover:bg-wabi-200'
              }`}
            >
              ⚡ Peak Now
            </button>
            <button
              onClick={() => {
                setMode('hidden');
                spinRoulette();
              }}
              className={`py-1.5 px-1 rounded-lg border text-center transition-all ${
                mode === 'hidden'
                  ? 'bg-sumi text-wabi border-sumi shadow-sm'
                  : 'bg-wabi text-sumi border-sumi/20 hover:bg-wabi-200'
              }`}
            >
              ✦ Hidden
            </button>
            <button
              onClick={() => {
                setMode('near');
                spinRoulette();
              }}
              className={`py-1.5 px-1 rounded-lg border text-center transition-all ${
                mode === 'near'
                  ? 'bg-sumi text-wabi border-sumi shadow-sm'
                  : 'bg-wabi text-sumi border-sumi/20 hover:bg-wabi-200'
              }`}
            >
              📍 Near Me
            </button>
          </div>
        </div>

        {/* Content Body */}
        <div className="p-4 overflow-y-auto flex-1 space-y-4">
          {/* Reel Spinner Display */}
          <div className="relative bg-sumi text-wabi rounded-2xl p-4 border-2 border-sumi shadow-inner text-center overflow-hidden">
            <div className="absolute inset-0 bg-riso-dots opacity-10 pointer-events-none" />
            <div className="text-[10px] font-mono text-vermilion uppercase tracking-widest font-bold mb-1">
              {isRolling ? '⚡ SPINNING COMPASS...' : '✨ SANCTUARY UNLOCKED'}
            </div>
            <div className="text-xl sm:text-2xl font-ananda font-normal text-wabi leading-tight truncate px-2">
              {displayTitle}
            </div>
            {rolledPlace && !isRolling && (
              <div className="mt-1 flex items-center justify-center gap-2 text-xs font-mono text-amber-300">
                <span>📍 {rolledPlace.neighborhood || rolledPlace.city}</span>
                <span>•</span>
                <span className="uppercase">{rolledPlace.category}</span>
              </div>
            )}
          </div>

          {/* Place Card Result (revealed when not rolling) */}
          {rolledPlace && !isRolling && (
            <div className="bg-wabi border-2 border-sumi rounded-2xl overflow-hidden shadow-riso-sm space-y-0">
              {/* Photo Banner */}
              <div className="relative h-44 sm:h-48 w-full bg-sumi-900 overflow-hidden border-b-2 border-sumi">
                <img
                  src={rolledPlace.photo_url}
                  alt={rolledPlace.name}
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-2.5 left-2.5 flex items-center gap-1.5">
                  <span className="px-2 py-0.5 rounded-md text-[10px] font-mono font-bold bg-sumi text-wabi uppercase shadow-sm">
                    {rolledPlace.category}
                  </span>
                  {rolledPlace.spot_tier === 'hidden_gem' && (
                    <span className="px-2 py-0.5 rounded-md text-[10px] font-mono font-bold bg-amber-400 text-sumi shadow-sm">
                      ✦ HIDDEN GEM
                    </span>
                  )}
                </div>

                {peakInfo?.isPeaking && (
                  <div className="absolute bottom-2.5 left-2.5 flex items-center gap-1 px-2.5 py-1 rounded-lg bg-emerald-600 text-white text-[11px] font-mono font-bold shadow-md">
                    <span className="w-1.5 h-1.5 rounded-full bg-white animate-ping" />
                    <span>{peakInfo.badgeText}</span>
                  </div>
                )}
              </div>

              {/* Place Information */}
              <div className="p-3.5 space-y-2.5">
                <div>
                  <h3 className="text-lg font-bold text-sumi font-sans leading-snug">
                    {rolledPlace.name}
                  </h3>
                  <p className="text-xs text-slate-700 line-clamp-2 mt-0.5">
                    {rolledPlace.description}
                  </p>
                </div>

                {/* Timing & Peak Reason */}
                {peakInfo?.isPeaking && (
                  <div className="flex items-center gap-1.5 text-xs font-mono text-emerald-800 bg-emerald-50 border border-emerald-200 px-2.5 py-1.5 rounded-xl">
                    <Clock className="w-3.5 h-3.5 flex-shrink-0 text-emerald-600" />
                    <span className="font-semibold">{peakInfo.reason}</span>
                  </div>
                )}

                {/* Vibe Tags */}
                <div className="flex flex-wrap gap-1">
                  {rolledPlace.vibe_tags.slice(0, 4).map((tag) => (
                    <span
                      key={tag}
                      className="px-2 py-0.5 bg-wabi-100 text-slate-700 border border-sumi/15 rounded text-[10px] font-mono font-medium"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Action Footer */}
        <div className="p-3 bg-wabi-100 border-t-2 border-sumi flex items-center justify-between gap-2">
          {/* Reroll Button */}
          <button
            onClick={spinRoulette}
            disabled={isRolling}
            className="flex items-center gap-1.5 px-3 py-2 bg-wabi hover:bg-wabi-200 border-2 border-sumi rounded-xl shadow-riso-sm text-xs font-mono font-bold text-sumi active:scale-95 transition-all"
          >
            <RotateCw className={`w-3.5 h-3.5 ${isRolling ? 'animate-spin' : ''}`} />
            <span>REROLL 🎲</span>
          </button>

          {/* Action CTAs */}
          <div className="flex items-center gap-2">
            {rolledPlace && (
              <>
                <a
                  href={`https://www.google.com/maps/dir/?api=1&destination=${rolledPlace.latitude},${rolledPlace.longitude}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1 px-3 py-2 bg-wabi hover:bg-wabi-200 border-2 border-sumi rounded-xl shadow-riso-sm text-xs font-mono font-bold text-sumi transition-all"
                  title="Open Google Maps Directions"
                >
                  <Navigation className="w-3.5 h-3.5 text-vermilion" />
                  <span className="hidden sm:inline">DIRECTIONS</span>
                </a>

                <button
                  onClick={() => {
                    onSelectPlace(rolledPlace);
                    onClose();
                  }}
                  className="flex items-center gap-1.5 px-3.5 py-2 bg-vermilion hover:bg-vermilion/90 text-white border-2 border-sumi rounded-xl shadow-riso hover:shadow-riso-sm active:scale-95 text-xs font-mono font-bold transition-all"
                >
                  <span>INSPECT SPOT</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

