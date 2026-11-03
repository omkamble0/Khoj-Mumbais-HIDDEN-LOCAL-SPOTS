'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Place, PlaceCategory } from '@/lib/types';
import { getCurrentVibeWindow, checkIsPlacePeakingNow, rollRastaRoulette } from '@/lib/vibeRadar';
import {
  Dices,
  Navigation,
  X,
  RotateCw,
  Clock,
  ArrowRight,
  Volume2,
  VolumeX,
  Sparkles,
  CheckCircle2,
} from 'lucide-react';

interface RastaRouletteModalProps {
  isOpen: boolean;
  onClose: () => void;
  places: Place[];
  userLocation: { lat: number; lng: number } | null;
  onSelectPlace: (place: Place) => void;
  currentCategory?: PlaceCategory;
  isBlinking?: boolean;
}

export default function RastaRouletteModal({
  isOpen,
  onClose,
  places,
  userLocation,
  onSelectPlace,
  currentCategory,
  isBlinking = false,
}: RastaRouletteModalProps) {
  const [mode, setMode] = useState<'pure' | 'peaking' | 'hidden' | 'near'>('pure');
  const [isRolling, setIsRolling] = useState(false);
  const [rolledPlace, setRolledPlace] = useState<Place | null>(null);
  
  // Triplet for slot tumbler: [previous, current, next]
  const [reelTriplet, setReelTriplet] = useState<Place[]>([]);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [justLanded, setJustLanded] = useState(false);

  const audioCtxRef = useRef<AudioContext | null>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const { window: currentWindow, timeString } = getCurrentVibeWindow();

  // Synthetic mechanical click sound via Web Audio API (Zero external audio files)
  const playMechanicalTick = useCallback((pitch = 600) => {
    if (!soundEnabled) return;
    try {
      if (!audioCtxRef.current) {
        const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
        audioCtxRef.current = new AudioContextClass();
      }
      const ctx = audioCtxRef.current;
      if (ctx.state === 'suspended') {
        ctx.resume();
      }
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(pitch, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(140, ctx.currentTime + 0.035);

      gain.gain.setValueAtTime(0.07, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.035);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start();
      osc.stop(ctx.currentTime + 0.035);
    } catch {
      // Audio not supported or blocked by user gesture policy
    }
  }, [soundEnabled]);

  // Synthetic celebration chime when landing
  const playChime = useCallback(() => {
    if (!soundEnabled) return;
    try {
      if (!audioCtxRef.current) {
        const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
        audioCtxRef.current = new AudioContextClass();
      }
      const ctx = audioCtxRef.current;
      if (ctx.state === 'suspended') {
        ctx.resume();
      }
      const freqs = [523.25, 659.25, 783.99, 1046.5]; // C5, E5, G5, C6
      freqs.forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, ctx.currentTime + idx * 0.08);
        gain.gain.setValueAtTime(0.08, ctx.currentTime + idx * 0.08);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + idx * 0.08 + 0.25);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(ctx.currentTime + idx * 0.08);
        osc.stop(ctx.currentTime + idx * 0.08 + 0.25);
      });
    } catch {}
  }, [soundEnabled]);

  // Spin Roulette with smooth deceleration physics over ~2.8 seconds
  const spinRoulette = useCallback(() => {
    if (isRolling || places.length === 0) return;
    if (timerRef.current) clearTimeout(timerRef.current);

    setIsRolling(true);
    setJustLanded(false);

    const winner = rollRastaRoulette(places, {
      mode,
      userLat: userLocation?.lat,
      userLng: userLocation?.lng,
      currentCategory,
    });

    const getRandomPlace = () => places[Math.floor(Math.random() * places.length)];

    // Initialize initial tumbler triplet
    setReelTriplet([getRandomPlace(), getRandomPlace(), getRandomPlace()]);

    const TOTAL_STEPS = 26;
    let step = 0;

    const executeStep = () => {
      step++;

      // Pick next rolling slice
      if (step < TOTAL_STEPS) {
        setReelTriplet([getRandomPlace(), getRandomPlace(), getRandomPlace()]);
        // Ticks get slightly lower pitch as it slows down
        const pitch = 700 - (step / TOTAL_STEPS) * 300;
        playMechanicalTick(pitch);

        // Smooth cubic deceleration easing: starts fast at 40ms, eases out to 380ms
        const progress = step / TOTAL_STEPS;
        const delay = Math.round(40 + Math.pow(progress, 2.5) * 360);

        timerRef.current = setTimeout(executeStep, delay);
      } else {
        // Final landing step: snap into the winner!
        if (winner) {
          const prev = getRandomPlace();
          const next = getRandomPlace();
          setReelTriplet([prev, winner, next]);
          setRolledPlace(winner);
          setIsRolling(false);
          setJustLanded(true);
          playChime();
        } else {
          setIsRolling(false);
        }
      }
    };

    executeStep();
  }, [isRolling, places, mode, userLocation, currentCategory, playMechanicalTick, playChime]);

  // Trigger spin when opened
  useEffect(() => {
    if (isOpen) {
      spinRoulette();
    } else {
      setRolledPlace(null);
      if (timerRef.current) clearTimeout(timerRef.current);
    }
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
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

  const activePlace = rolledPlace || (reelTriplet.length > 1 ? reelTriplet[1] : null);
  const peakInfo = activePlace ? checkIsPlacePeakingNow(activePlace, currentWindow) : null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-3 sm:p-4 bg-sumi/70 backdrop-blur-md font-sans select-none">
      <div 
        className="relative w-full max-w-lg bg-wabi border-2 border-sumi rounded-3xl shadow-riso overflow-hidden flex flex-col max-h-[92dvh] animate-scale-up"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header Bar */}
        <div className="bg-sumi text-wabi px-4 py-3 border-b-2 border-sumi flex items-center justify-between flex-shrink-0">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-vermilion text-white flex items-center justify-center border border-wabi/30 shadow-riso-sm">
              <Dices className={`w-4 h-4 ${isRolling ? 'animate-spin' : ''}`} />
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
                Serendipity Engine · Decelerating Reel
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1.5">
            {/* Audio Toggle */}
            <button
              onClick={() => setSoundEnabled((prev) => !prev)}
              className="w-8 h-8 rounded-xl bg-wabi/10 hover:bg-wabi/20 text-wabi flex items-center justify-center transition-colors border border-wabi/20"
              title={soundEnabled ? 'Mute mechanical clicks' : 'Enable click sound'}
            >
              {soundEnabled ? <Volume2 className="w-4 h-4 text-amber-300" /> : <VolumeX className="w-4 h-4 text-slate-400" />}
            </button>

            {/* Close Button */}
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-xl bg-wabi/10 hover:bg-vermilion text-wabi flex items-center justify-center transition-colors border border-wabi/20"
              title="Close (Esc)"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Live Vibe Banner & Mode Selectors */}
        <div className="p-3 bg-wabi-100 border-b border-sumi/20 space-y-2 flex-shrink-0">
          {/* Live Radar Pill */}
          <div className="flex items-center justify-between text-xs font-mono bg-wabi p-2 rounded-xl border border-sumi/20">
            <div className="flex items-center gap-1.5">
              <span className={`w-2 h-2 rounded-full ${isBlinking ? 'bg-emerald-500 animate-pulse' : 'bg-emerald-600'}`} />
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
              disabled={isRolling}
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
              disabled={isRolling}
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
              disabled={isRolling}
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
              disabled={isRolling}
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

        {/* Content Body with Mechanical Reel Window */}
        <div className="p-4 overflow-y-auto flex-1 space-y-4">
          {/* Mechanical Slot Tumbler Viewport */}
          <div className="relative bg-sumi text-wabi rounded-2xl p-3 border-2 border-sumi shadow-inner overflow-hidden">
            {/* Top & Bottom Vignette Shadow to simulate cylindrical reel drum */}
            <div className="absolute inset-x-0 top-0 h-8 bg-gradient-to-b from-sumi via-sumi/80 to-transparent z-10 pointer-events-none" />
            <div className="absolute inset-x-0 bottom-0 h-8 bg-gradient-to-t from-sumi via-sumi/80 to-transparent z-10 pointer-events-none" />

            {/* Target Alignment Indicator Arrows */}
            <div className="absolute inset-y-0 left-2 flex items-center z-20 pointer-events-none">
              <span className="text-vermilion font-black text-sm">▶</span>
            </div>
            <div className="absolute inset-y-0 right-2 flex items-center z-20 pointer-events-none">
              <span className="text-vermilion font-black text-sm">◀</span>
            </div>

            {/* Tumbler Rows */}
            <div className="flex flex-col gap-1 py-1 px-4">
              {/* Row 0: Preceding item (blurred when rolling) */}
              <div className="h-6 flex items-center justify-center opacity-30 text-xs font-mono truncate filter blur-[0.4px]">
                {reelTriplet[0]?.name || '...'}
              </div>

              {/* Row 1: Target Active Center Slot */}
              <div className={`py-2 px-3 rounded-xl border flex flex-col items-center justify-center text-center transition-all duration-150 ${
                isRolling 
                  ? 'bg-sumi-800 border-vermilion/50 scale-[0.99]' 
                  : 'bg-wabi/10 border-amber-400 shadow-sm scale-100'
              }`}>
                <span className="text-[10px] font-mono text-vermilion uppercase tracking-widest font-black mb-0.5">
                  {isRolling ? 'SPINNING THE COMPASS...' : '✦ SANCTUARY UNLOCKED ✦'}
                </span>
                <div className={`text-xl sm:text-2xl font-ananda font-normal text-wabi leading-tight truncate max-w-full transition-transform ${
                  justLanded ? 'scale-105 text-amber-300' : ''
                }`}>
                  {activePlace?.name || 'Exploring Mumbai...'}
                </div>
                {activePlace && (
                  <div className="mt-1 flex items-center justify-center gap-2 text-xs font-mono text-amber-200">
                    <span>📍 {activePlace.neighborhood || activePlace.city}</span>
                    <span>•</span>
                    <span className="uppercase tracking-wider">{activePlace.category}</span>
                  </div>
                )}
              </div>

              {/* Row 2: Subsequent item (blurred when rolling) */}
              <div className="h-6 flex items-center justify-center opacity-30 text-xs font-mono truncate filter blur-[0.4px]">
                {reelTriplet[2]?.name || '...'}
              </div>
            </div>
          </div>

          {/* Result Card (Reveals cleanly once stopped) */}
          {rolledPlace && !isRolling && (
            <div className={`bg-wabi border-2 border-sumi rounded-2xl overflow-hidden shadow-riso-sm space-y-0 transition-all duration-300 ${
              justLanded ? 'animate-fade-in' : ''
            }`}>
              {/* Photo Banner */}
              <div className="relative h-44 sm:h-48 w-full bg-sumi-900 overflow-hidden border-b-2 border-sumi">
                <img
                  src={rolledPlace.photo_url}
                  alt={rolledPlace.name}
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-2.5 left-2.5 flex items-center gap-1.5 z-10">
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
                  <div className="absolute bottom-2.5 left-2.5 flex items-center gap-1 px-2.5 py-1 rounded-lg bg-emerald-600 text-white text-[11px] font-mono font-bold shadow-md z-10">
                    <span className={`w-1.5 h-1.5 rounded-full ${isBlinking ? 'bg-white animate-ping' : 'bg-white'}`} />
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
        <div className="p-3 bg-wabi-100 border-t-2 border-sumi flex items-center justify-between gap-2 flex-shrink-0">
          {/* Reroll Button */}
          <button
            onClick={spinRoulette}
            disabled={isRolling}
            className="flex items-center gap-1.5 px-3.5 py-2 bg-wabi hover:bg-white border-2 border-sumi rounded-xl shadow-riso-sm text-xs font-mono font-bold text-sumi active:scale-95 transition-all disabled:opacity-50"
          >
            <RotateCw className={`w-3.5 h-3.5 ${isRolling ? 'animate-spin' : ''}`} />
            <span>REROLL 🎲</span>
          </button>

          {/* Action CTAs */}
          <div className="flex items-center gap-2">
            {rolledPlace && !isRolling && (
              <>
                <a
                  href={`https://www.google.com/maps/dir/?api=1&destination=${rolledPlace.latitude},${rolledPlace.longitude}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1 px-3 py-2 bg-wabi hover:bg-white border-2 border-sumi rounded-xl shadow-riso-sm text-xs font-mono font-bold text-sumi transition-all"
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
