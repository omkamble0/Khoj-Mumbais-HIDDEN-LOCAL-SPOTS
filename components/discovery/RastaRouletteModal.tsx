'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Place, PlaceCategory } from '@/lib/types';
import { getCurrentVibeWindow, checkIsPlacePeakingNow, rollRastaRoulette } from '@/lib/vibeRadar';
import { formatDistance } from '@/lib/scoring';
import {
  Dices,
  Navigation,
  X,
  RotateCw,
  Clock,
  ArrowRight,
  Volume2,
  VolumeX,
  Swords,
  Sparkles,
  History,
  CheckCircle2,
  ShieldCheck,
  EyeOff,
  Flame,
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

type VibeMoodId = 'any' | 'peaking' | 'drinks' | 'chai' | 'sunset' | 'silence';

export default function RastaRouletteModal({
  isOpen,
  onClose,
  places,
  userLocation,
  onSelectPlace,
  currentCategory,
  isBlinking = false,
}: RastaRouletteModalProps) {
  // Modal state: 'idle' (setup/rethink) | 'spinning' | 'result'
  const [modalStage, setModalStage] = useState<'idle' | 'spinning' | 'result'>('idle');

  // Game mode: 'single' (1 spot) vs 'duel' (2-spot face-off)
  const [gameMode, setGameMode] = useState<'single' | 'duel'>('single');
  const [selectedMood, setSelectedMood] = useState<VibeMoodId>('any');

  // Single mode result
  const [winnerPlace, setWinnerPlace] = useState<Place | null>(null);

  // Duel mode results: [contenderA, contenderB]
  const [duelPair, setDuelPair] = useState<[Place | null, Place | null]>([null, null]);

  // Rolling tumbler visual preview
  const [displayCardsA, setDisplayCardsA] = useState<Place[]>([]);
  const [displayCardsB, setDisplayCardsB] = useState<Place[]>([]);

  // Roll History (so user can rethink and revisit earlier rolls)
  const [rollHistory, setRollHistory] = useState<Place[]>([]);

  const [soundEnabled, setSoundEnabled] = useState(true);
  const [justLanded, setJustLanded] = useState(false);

  const audioCtxRef = useRef<AudioContext | null>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const { window: currentWindow, timeString } = getCurrentVibeWindow();

  // Synthetic mechanical click sound via Web Audio API
  const playMechanicalTick = useCallback((pitch = 600) => {
    if (!soundEnabled) return;
    try {
      if (!audioCtxRef.current) {
        const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
        audioCtxRef.current = new AudioContextClass();
      }
      const ctx = audioCtxRef.current;
      if (ctx.state === 'suspended') ctx.resume();
      
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(pitch, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(140, ctx.currentTime + 0.035);

      gain.gain.setValueAtTime(0.06, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.035);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start();
      osc.stop(ctx.currentTime + 0.035);
    } catch {}
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
      if (ctx.state === 'suspended') ctx.resume();
      
      const freqs = [523.25, 659.25, 783.99, 1046.5]; // C5, E5, G5, C6
      freqs.forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, ctx.currentTime + idx * 0.07);
        gain.gain.setValueAtTime(0.07, ctx.currentTime + idx * 0.07);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + idx * 0.07 + 0.22);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(ctx.currentTime + idx * 0.07);
        osc.stop(ctx.currentTime + idx * 0.07 + 0.22);
      });
    } catch {}
  }, [soundEnabled]);

  // Filter candidate pool based on selected user mood
  const getFilteredPool = useCallback(() => {
    if (!places || places.length === 0) return [];
    let pool = [...places];

    if (selectedMood === 'peaking') {
      pool = pool.filter((p) => checkIsPlacePeakingNow(p, currentWindow).isPeaking);
    } else if (selectedMood === 'drinks') {
      pool = pool.filter((p) => p.category === 'bars');
    } else if (selectedMood === 'chai') {
      pool = pool.filter((p) => p.category === 'cafes' || p.category === 'books');
    } else if (selectedMood === 'sunset') {
      pool = pool.filter((p) => p.category === 'viewpoints' || p.category === 'waterfront' || p.category === 'forts');
    } else if (selectedMood === 'silence') {
      pool = pool.filter((p) => p.crowd_level <= 2 && (p.hiddenness_score >= 0.7 || p.spot_tier === 'hidden_gem'));
    }

    if (pool.length === 0) return places;
    return pool;
  }, [places, selectedMood, currentWindow]);

  // Main Spin Engine with deceleration physics over ~2.8 seconds
  const handleStartSpin = useCallback(() => {
    const pool = getFilteredPool();
    if (pool.length === 0) return;
    if (timerRef.current) clearTimeout(timerRef.current);

    setModalStage('spinning');
    setJustLanded(false);

    const getRandom = () => pool[Math.floor(Math.random() * pool.length)];

    // Pre-calculate winner(s)
    const targetA = getRandom();
    let targetB = getRandom();
    if (gameMode === 'duel' && pool.length > 1) {
      while (targetB.id === targetA.id) {
        targetB = getRandom();
      }
    }

    const TOTAL_STEPS = 25;
    let step = 0;

    const executeSpinStep = () => {
      step++;

      if (step < TOTAL_STEPS) {
        // Visual tumbler updates
        setDisplayCardsA([getRandom(), getRandom(), getRandom()]);
        if (gameMode === 'duel') {
          setDisplayCardsB([getRandom(), getRandom(), getRandom()]);
        }

        // Ticks lower in pitch as gear slows down
        const pitch = 720 - (step / TOTAL_STEPS) * 320;
        playMechanicalTick(pitch);

        // Cubic deceleration easing: starts snappy (40ms), slows down smoothly to 380ms
        const progress = step / TOTAL_STEPS;
        const delay = Math.round(38 + Math.pow(progress, 2.4) * 360);

        timerRef.current = setTimeout(executeSpinStep, delay);
      } else {
        // Final landing step: snap into winner(s) with celebration
        if (gameMode === 'single') {
          setWinnerPlace(targetA);
          setRollHistory((prev) => [targetA, ...prev.filter((p) => p.id !== targetA.id)].slice(0, 6));
        } else {
          setDuelPair([targetA, targetB]);
          setRollHistory((prev) => [targetA, targetB, ...prev.filter((p) => p.id !== targetA.id && p.id !== targetB.id)].slice(0, 6));
        }
        setModalStage('result');
        setJustLanded(true);
        playChime();
      }
    };

    executeSpinStep();
  }, [getFilteredPool, gameMode, playMechanicalTick, playChime]);

  // Reset when closed or opened
  useEffect(() => {
    if (isOpen) {
      // Don't auto-spin! Open into the interactive setup stage so the user can rethink and choose.
      if (!winnerPlace && duelPair[0] === null) {
        setModalStage('idle');
      }
    } else {
      if (timerRef.current) clearTimeout(timerRef.current);
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

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-3 sm:p-4 bg-sumi/75 backdrop-blur-md font-sans select-none animate-fade-in">
      <div 
        className="relative w-full max-w-xl bg-wabi border-2 border-sumi rounded-3xl shadow-[6px_6px_0px_#141518] overflow-hidden flex flex-col max-h-[92dvh] animate-scale-up"
        onClick={(e) => e.stopPropagation()}
      >
        {/* 1. Header Navigation Bar */}
        <div className="bg-sumi text-wabi px-4 py-3 border-b-2 border-sumi flex items-center justify-between flex-shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-vermilion text-white flex items-center justify-center border border-wabi/30 shadow-riso-sm">
              <Dices className={`w-4 h-4 ${modalStage === 'spinning' ? 'animate-spin' : ''}`} />
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
                Mumbai Serendipity Machine · Rethink Your Destination
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1.5">
            {/* Audio Click Toggle */}
            <button
              onClick={() => setSoundEnabled((prev) => !prev)}
              className="w-8 h-8 rounded-xl bg-wabi/10 hover:bg-wabi/20 text-wabi flex items-center justify-center transition-colors border border-wabi/20"
              title={soundEnabled ? 'Mute click sounds' : 'Enable click sound'}
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

        {/* 2. Top Controls & Live Radar Telemetry */}
        <div className="p-3 bg-wabi-100 border-b border-sumi/20 space-y-2 flex-shrink-0">
          <div className="flex items-center justify-between text-xs font-mono bg-wabi p-2 rounded-xl border border-sumi/20">
            <div className="flex items-center gap-1.5 min-w-0">
              <span className={`w-2 h-2 rounded-full flex-shrink-0 ${isBlinking ? 'bg-emerald-500 animate-pulse' : 'bg-emerald-600'}`} />
              <span className="font-bold text-sumi">MUMBAI RADAR:</span>
              <span className="text-vermilion font-bold truncate">{currentWindow.icon} {currentWindow.label}</span>
              <span className="text-slate-500 text-[11px] hidden sm:inline">({timeString})</span>
            </div>
            
            {/* Mode Switcher: 1 Spot vs 2-Spot Duel */}
            <div className="flex items-center bg-wabi-200 border border-sumi/30 rounded-lg p-0.5 text-[10px] font-mono font-bold flex-shrink-0">
              <button
                onClick={() => setGameMode('single')}
                disabled={modalStage === 'spinning'}
                className={`px-2 py-0.5 rounded transition-all ${
                  gameMode === 'single' ? 'bg-sumi text-wabi shadow-sm' : 'text-sumi hover:bg-wabi'
                }`}
              >
                1 SPOT
              </button>
              <button
                onClick={() => setGameMode('duel')}
                disabled={modalStage === 'spinning'}
                className={`px-2 py-0.5 rounded transition-all flex items-center gap-1 ${
                  gameMode === 'duel' ? 'bg-vermilion text-white shadow-sm' : 'text-sumi hover:bg-wabi'
                }`}
              >
                <Swords className="w-3 h-3" />
                <span>2-WAY DUEL</span>
              </button>
            </div>
          </div>

          {/* Vibe Mood Pills (Lets the user rethink what they actually want) */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-0.5 text-[11px] font-mono font-bold no-scrollbar">
            <span className="text-[10px] text-slate-500 uppercase flex-shrink-0">MOOD:</span>
            {[
              { id: 'any', label: '🎲 Any Sanctuary' },
              { id: 'peaking', label: '⚡ Peaking Now' },
              { id: 'drinks', label: '🍻 Drinks & Adda' },
              { id: 'chai', label: '☕ Chai & Read' },
              { id: 'sunset', label: '🌅 Sunset Vista' },
              { id: 'silence', label: '🤫 Pure Silence' },
            ].map((m) => (
              <button
                key={m.id}
                onClick={() => setSelectedMood(m.id as VibeMoodId)}
                disabled={modalStage === 'spinning'}
                className={`px-2.5 py-1 rounded-lg border whitespace-nowrap transition-all flex-shrink-0 ${
                  selectedMood === m.id
                    ? 'bg-sumi text-wabi border-sumi shadow-sm'
                    : 'bg-wabi text-sumi border-sumi/20 hover:bg-wabi-200'
                }`}
              >
                {m.label}
              </button>
            ))}
          </div>
        </div>

        {/* 3. Main Stage Area */}
        <div className="p-4 overflow-y-auto flex-1 space-y-4">
          {/* STAGE A: IDLE (Setup & Rethink before spinning) */}
          {modalStage === 'idle' && (
            <div className="bg-wabi border-2 border-sumi rounded-2xl p-6 text-center space-y-5 shadow-riso-sm">
              <div className="w-16 h-16 rounded-2xl bg-amber-100 border-2 border-sumi flex items-center justify-center mx-auto shadow-riso-sm">
                <Dices className="w-8 h-8 text-vermilion animate-bounce" />
              </div>

              <div className="space-y-1.5 max-w-sm mx-auto">
                <h3 className="text-xl font-bold font-sans text-sumi">
                  Can’t decide where to wander?
                </h3>
                <p className="text-xs text-slate-600 font-sans leading-relaxed">
                  {gameMode === 'duel'
                    ? 'We will spin two competing sanctuaries head-to-head. Compare them side-by-side, rethink your mood, and pick your favorite!'
                    : 'Pick your mood above, pull the compass lever, and let the Mumbai Serendipity Engine roll a hidden sanctuary for you.'}
                </p>
              </div>

              {/* Big 3D Rubber Action Button */}
              <button
                onClick={handleStartSpin}
                className="w-full sm:w-auto min-w-[240px] px-8 py-3.5 bg-vermilion hover:bg-vermilion/90 text-white font-mono font-black text-sm uppercase tracking-wider rounded-2xl border-2 border-sumi shadow-[4px_4px_0px_#141518] hover:shadow-[2px_2px_0px_#141518] hover:translate-x-[2px] hover:translate-y-[2px] active:translate-x-[4px] active:translate-y-[4px] active:shadow-none transition-all flex items-center justify-center gap-2 mx-auto"
              >
                <Dices className="w-5 h-5 text-white" />
                <span>{gameMode === 'duel' ? '⚔️ SPIN THE FACE-OFF' : '🎲 PULL COMPASS LEVER'}</span>
              </button>
            </div>
          )}

          {/* STAGE B: SPINNING (Mechanical Tumbler Reel with Physics) */}
          {modalStage === 'spinning' && (
            <div className="space-y-3">
              <div className="text-center font-mono text-xs font-bold text-vermilion uppercase tracking-widest animate-pulse">
                ⚡ DECELERATING COMPASS REEL...
              </div>

              <div className={`grid gap-3 ${gameMode === 'duel' ? 'grid-cols-2' : 'grid-cols-1'}`}>
                {/* Reel A */}
                <div className="relative bg-sumi text-wabi rounded-2xl p-3 border-2 border-sumi shadow-inner overflow-hidden">
                  <div className="absolute inset-x-0 top-0 h-6 bg-gradient-to-b from-sumi to-transparent z-10 pointer-events-none" />
                  <div className="absolute inset-x-0 bottom-0 h-6 bg-gradient-to-t from-sumi to-transparent z-10 pointer-events-none" />
                  <div className="text-[10px] font-mono text-amber-300 font-bold mb-1 text-center">
                    {gameMode === 'duel' ? 'CONTENDER A' : 'TARGET SANCTUARY'}
                  </div>

                  <div className="flex flex-col gap-1 text-center">
                    <div className="h-5 text-xs font-mono opacity-30 truncate">
                      {displayCardsA[0]?.name || '...'}
                    </div>
                    <div className="py-2.5 px-2 bg-wabi/10 border border-vermilion/50 rounded-xl text-center">
                      <div className="text-lg sm:text-xl font-ananda text-white truncate">
                        {displayCardsA[1]?.name || 'Spinning...'}
                      </div>
                      <div className="text-[11px] font-mono text-amber-300 mt-0.5">
                        📍 {displayCardsA[1]?.neighborhood || 'Mumbai'}
                      </div>
                    </div>
                    <div className="h-5 text-xs font-mono opacity-30 truncate">
                      {displayCardsA[2]?.name || '...'}
                    </div>
                  </div>
                </div>

                {/* Reel B (In Duel Mode) */}
                {gameMode === 'duel' && (
                  <div className="relative bg-sumi text-wabi rounded-2xl p-3 border-2 border-sumi shadow-inner overflow-hidden">
                    <div className="absolute inset-x-0 top-0 h-6 bg-gradient-to-b from-sumi to-transparent z-10 pointer-events-none" />
                    <div className="absolute inset-x-0 bottom-0 h-6 bg-gradient-to-t from-sumi to-transparent z-10 pointer-events-none" />
                    <div className="text-[10px] font-mono text-rose-300 font-bold mb-1 text-center">
                      CONTENDER B
                    </div>

                    <div className="flex flex-col gap-1 text-center">
                      <div className="h-5 text-xs font-mono opacity-30 truncate">
                        {displayCardsB[0]?.name || '...'}
                      </div>
                      <div className="py-2.5 px-2 bg-wabi/10 border border-rose-400/50 rounded-xl text-center">
                        <div className="text-lg sm:text-xl font-ananda text-white truncate">
                          {displayCardsB[1]?.name || 'Spinning...'}
                        </div>
                        <div className="text-[11px] font-mono text-rose-300 mt-0.5">
                          📍 {displayCardsB[1]?.neighborhood || 'Mumbai'}
                        </div>
                      </div>
                      <div className="h-5 text-xs font-mono opacity-30 truncate">
                        {displayCardsB[2]?.name || '...'}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* STAGE C: RESULT (Single Sanctuary Card OR 2-Way Face-off Comparison) */}
          {modalStage === 'result' && (
            <div className="space-y-4">
              {/* C1: Single Mode Result */}
              {gameMode === 'single' && winnerPlace && (
                <div className={`bg-wabi border-2 border-sumi rounded-2xl overflow-hidden shadow-riso transition-all ${justLanded ? 'animate-scale-up' : ''}`}>
                  {/* Photo Header */}
                  <div className="relative h-48 sm:h-52 w-full bg-sumi-900 border-b-2 border-sumi overflow-hidden">
                    <img
                      src={winnerPlace.photo_url}
                      alt={winnerPlace.name}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-sumi/70 via-transparent to-transparent pointer-events-none" />

                    {/* Top Badges */}
                    <div className="absolute top-2.5 left-2.5 flex items-center gap-1.5 z-10">
                      <span className="px-2.5 py-0.5 rounded-md text-[10px] font-mono font-bold bg-sumi text-wabi uppercase shadow-sm">
                        {winnerPlace.category}
                      </span>
                      <span className="px-2 py-0.5 rounded-md text-[10px] font-mono font-bold bg-amber-400 text-sumi shadow-sm">
                        {winnerPlace.spot_tier === 'hidden_gem' ? '✦ HIDDEN GEM' : winnerPlace.spot_tier === 'iconic' ? '★ ICONIC' : '● UNDERRATED'}
                      </span>
                    </div>

                    {/* Live Peak Badge */}
                    {checkIsPlacePeakingNow(winnerPlace, currentWindow).isPeaking && (
                      <div className="absolute bottom-2.5 left-2.5 flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-emerald-600 text-white text-[11px] font-mono font-bold shadow-md z-10">
                        <span className={`w-1.5 h-1.5 rounded-full ${isBlinking ? 'bg-white animate-ping' : 'bg-white'}`} />
                        <span>{currentWindow.icon} PEAK TIME RIGHT NOW</span>
                      </div>
                    )}
                  </div>

                  {/* Body Info */}
                  <div className="p-4 space-y-3">
                    <div>
                      <div className="flex items-center justify-between text-xs font-mono text-slate-500">
                        <span>📍 {winnerPlace.neighborhood ? `${winnerPlace.neighborhood}, ${winnerPlace.city}` : winnerPlace.city}</span>
                        <span className="text-sumi font-bold font-mono">
                          {Math.round(winnerPlace.hiddenness_score * 100)}% HIDDEN
                        </span>
                      </div>
                      <h3 className="text-xl font-bold font-sans text-sumi mt-0.5">
                        {winnerPlace.name}
                      </h3>
                      <p className="text-xs text-slate-700 mt-1 line-clamp-3">
                        {winnerPlace.description}
                      </p>
                    </div>

                    {/* Vibe Tags */}
                    <div className="flex flex-wrap gap-1">
                      {winnerPlace.vibe_tags.slice(0, 4).map((tag) => (
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

              {/* C2: 2-Way Duel Mode (Rethink & Compare) */}
              {gameMode === 'duel' && duelPair[0] && duelPair[1] && (
                <div className="space-y-3">
                  <div className="flex items-center justify-between text-xs font-mono px-1">
                    <span className="font-bold text-sumi">⚔️ THE SHOWDOWN: RETHINK & PICK ONE</span>
                    <span className="text-slate-500">Tap your favorite to proceed</span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {/* Contender A Card */}
                    <div className="bg-wabi border-2 border-sumi rounded-2xl overflow-hidden shadow-riso-sm flex flex-col justify-between hover:border-vermilion transition-all group">
                      <div>
                        <div className="relative h-32 w-full bg-sumi-900 border-b border-sumi overflow-hidden">
                          <img src={duelPair[0].photo_url} alt={duelPair[0].name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                          <div className="absolute top-2 left-2 px-2 py-0.5 rounded bg-sumi text-wabi text-[10px] font-mono font-bold uppercase">
                            CONTENDER A
                          </div>
                        </div>
                        <div className="p-3 space-y-1">
                          <div className="text-[10px] font-mono text-slate-500">
                            📍 {duelPair[0].neighborhood || duelPair[0].city} · {Math.round(duelPair[0].hiddenness_score * 100)}% Hidden
                          </div>
                          <h4 className="font-bold text-base text-sumi line-clamp-1">{duelPair[0].name}</h4>
                          <p className="text-[11px] text-slate-600 line-clamp-2">{duelPair[0].description}</p>
                        </div>
                      </div>
                      <div className="p-3 pt-0">
                        <button
                          onClick={() => {
                            onSelectPlace(duelPair[0]!);
                            onClose();
                          }}
                          className="w-full py-2 bg-sumi hover:bg-vermilion text-wabi text-xs font-mono font-bold rounded-xl transition-all shadow-sm"
                        >
                          PICK CONTENDER A 👉
                        </button>
                      </div>
                    </div>

                    {/* Contender B Card */}
                    <div className="bg-wabi border-2 border-sumi rounded-2xl overflow-hidden shadow-riso-sm flex flex-col justify-between hover:border-vermilion transition-all group">
                      <div>
                        <div className="relative h-32 w-full bg-sumi-900 border-b border-sumi overflow-hidden">
                          <img src={duelPair[1].photo_url} alt={duelPair[1].name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                          <div className="absolute top-2 left-2 px-2 py-0.5 rounded bg-rose-600 text-white text-[10px] font-mono font-bold uppercase">
                            CONTENDER B
                          </div>
                        </div>
                        <div className="p-3 space-y-1">
                          <div className="text-[10px] font-mono text-slate-500">
                            📍 {duelPair[1].neighborhood || duelPair[1].city} · {Math.round(duelPair[1].hiddenness_score * 100)}% Hidden
                          </div>
                          <h4 className="font-bold text-base text-sumi line-clamp-1">{duelPair[1].name}</h4>
                          <p className="text-[11px] text-slate-600 line-clamp-2">{duelPair[1].description}</p>
                        </div>
                      </div>
                      <div className="p-3 pt-0">
                        <button
                          onClick={() => {
                            onSelectPlace(duelPair[1]!);
                            onClose();
                          }}
                          className="w-full py-2 bg-sumi hover:bg-vermilion text-wabi text-xs font-mono font-bold rounded-xl transition-all shadow-sm"
                        >
                          PICK CONTENDER B 👉
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Rethink Tray: Roll History (In case the user liked an earlier roll better!) */}
              {rollHistory.length > 1 && (
                <div className="bg-wabi-100 p-2.5 rounded-xl border border-sumi/20 space-y-1.5">
                  <div className="flex items-center gap-1.5 text-[10px] font-mono text-slate-600 font-bold uppercase">
                    <History className="w-3 h-3 text-vermilion" />
                    <span>RETHINK TRAY · PREVIOUSLY ROLLED IN THIS SESSION:</span>
                  </div>
                  <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar">
                    {rollHistory.map((p) => (
                      <button
                        key={p.id}
                        onClick={() => {
                          setWinnerPlace(p);
                          setGameMode('single');
                        }}
                        className={`px-2 py-1 rounded-lg border text-[11px] font-mono font-semibold whitespace-nowrap transition-all ${
                          winnerPlace?.id === p.id
                            ? 'bg-vermilion text-white border-sumi shadow-sm'
                            : 'bg-wabi text-sumi border-sumi/20 hover:bg-white'
                        }`}
                      >
                        {p.short_name || p.name.split(' ')[0]}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* 4. Action Footer */}
        <div className="p-3 bg-wabi-100 border-t-2 border-sumi flex items-center justify-between gap-2 flex-shrink-0">
          {/* Spin / Rethink Button */}
          <button
            onClick={handleStartSpin}
            disabled={modalStage === 'spinning'}
            className="flex items-center gap-2 px-4 py-2.5 bg-wabi hover:bg-white border-2 border-sumi rounded-xl shadow-[2px_2px_0px_#141518] text-xs font-mono font-bold text-sumi active:scale-95 transition-all disabled:opacity-50"
          >
            <RotateCw className={`w-3.5 h-3.5 ${modalStage === 'spinning' ? 'animate-spin' : ''}`} />
            <span>{modalStage === 'result' ? 'REROLL (RETHINK) 🎲' : 'SPIN THE COMPASS'}</span>
          </button>

          {/* Action CTAs in Result Mode */}
          {modalStage === 'result' && gameMode === 'single' && winnerPlace && (
            <div className="flex items-center gap-2">
              <a
                href={`https://www.google.com/maps/dir/?api=1&destination=${winnerPlace.latitude},${winnerPlace.longitude}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 px-3 py-2 bg-wabi hover:bg-white border-2 border-sumi rounded-xl shadow-riso-sm text-xs font-mono font-bold text-sumi transition-all"
                title="Open Google Maps Directions"
              >
                <Navigation className="w-3.5 h-3.5 text-vermilion" />
                <span className="hidden sm:inline">DIRECTIONS</span>
              </a>

              <button
                onClick={() => {
                  onSelectPlace(winnerPlace);
                  onClose();
                }}
                className="flex items-center gap-1.5 px-3.5 py-2 bg-vermilion hover:bg-vermilion/90 text-white border-2 border-sumi rounded-xl shadow-[3px_3px_0px_#141518] active:scale-95 text-xs font-mono font-bold transition-all"
              >
                <span>LOCK IN & INSPECT</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
