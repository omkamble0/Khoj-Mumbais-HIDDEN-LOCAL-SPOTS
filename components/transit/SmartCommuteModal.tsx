'use client';

import React, { useState, useMemo } from 'react';
import { Place } from '@/lib/types';
import {
  TRANSIT_STATIONS,
  TransitStation,
  planSmartCommute,
  SmartCommutePlan,
} from '@/lib/transit';
import {
  Train,
  Navigation,
  Compass,
  Clock,
  Coins,
  MapPin,
  AlertTriangle,
  CheckCircle2,
  X,
  ExternalLink,
  ChevronRight,
  Zap,
  ShieldCheck,
  LocateFixed,
  ArrowRight,
} from 'lucide-react';

interface SmartCommuteModalProps {
  isOpen: boolean;
  onClose: () => void;
  destinationPlace: Place | null;
  userLocation: { lat: number; lng: number } | null;
  onTraceOnMap: (plan: SmartCommutePlan) => void;
  allPlaces: Place[];
  onSelectDestination?: (place: Place) => void;
}

export default function SmartCommuteModal({
  isOpen,
  onClose,
  destinationPlace,
  userLocation,
  onTraceOnMap,
  allPlaces,
  onSelectDestination,
}: SmartCommuteModalProps) {
  const [selectedOriginStationId, setSelectedOriginStationId] = useState<string>('');
  const [sanctuarySearchQuery, setSanctuarySearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState<'itinerary' | 'insider_tips'>('itinerary');

  // Fallback destination if none opened
  const currentDestination = useMemo(() => {
    return destinationPlace || allPlaces[0] || null;
  }, [destinationPlace, allPlaces]);

  // Compute smart route plan
  const plan: SmartCommutePlan | null = useMemo(() => {
    if (!currentDestination) return null;
    const originLat = userLocation?.lat || 19.0418;
    const originLng = userLocation?.lng || 72.8398;
    return planSmartCommute(
      originLat,
      originLng,
      currentDestination,
      selectedOriginStationId || undefined
    );
  }, [currentDestination, userLocation, selectedOriginStationId]);

  // Sanctuary search results for changing destination
  const searchResults = useMemo(() => {
    if (!sanctuarySearchQuery.trim()) return [];
    const q = sanctuarySearchQuery.toLowerCase().trim();
    return allPlaces
      .filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.neighborhood?.toLowerCase().includes(q) ||
          p.category.toLowerCase().includes(q)
      )
      .slice(0, 5);
  }, [sanctuarySearchQuery, allPlaces]);

  if (!isOpen || !currentDestination || !plan) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-sumi/60 backdrop-blur-sm animate-in fade-in duration-200 font-sans">
      <div className="relative w-full max-w-2xl bg-wabi rounded-3xl border-2 border-sumi shadow-riso max-h-[90vh] flex flex-col overflow-hidden animate-in zoom-in-95 duration-200">
        
        {/* Header Strip */}
        <div className="bg-sumi text-wabi px-5 py-4 border-b-2 border-sumi flex items-center justify-between flex-shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-vermilion text-white flex items-center justify-center border-2 border-white/20 shadow-sm">
              <Train className="w-4 h-4 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono font-bold text-amber-400 uppercase tracking-wider">
                  MUMBAI SMART TRANSIT ENGINE
                </span>
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              </div>
              <h2 className="font-display font-normal text-xl sm:text-2xl text-white">
                Foolproof Commute Blueprint
              </h2>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white transition-colors"
            title="Close"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Origin & Destination Bar */}
        <div className="bg-wabi-100 p-4 border-b-2 border-sumi/15 flex-shrink-0 space-y-2.5">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs font-mono">
            {/* Origin Station Dropdown */}
            <div className="bg-white p-2.5 rounded-xl border border-sumi/30 shadow-sm flex flex-col justify-between">
              <span className="text-[10px] text-slate-500 font-bold uppercase flex items-center gap-1">
                <MapPin className="w-3 h-3 text-emerald-600" />
                <span>FROM (ORIGIN STATION)</span>
              </span>
              <select
                value={selectedOriginStationId || plan.originStation.id}
                onChange={(e) => setSelectedOriginStationId(e.target.value)}
                className="mt-1 bg-transparent font-bold text-sumi focus:outline-none cursor-pointer truncate"
              >
                {TRANSIT_STATIONS.map((stn) => (
                  <option key={stn.id} value={stn.id}>
                    {stn.name} ({stn.lines.join('/')}) {stn.id === plan.originStation.id && !selectedOriginStationId ? '★ (Nearest)' : ''}
                  </option>
                ))}
              </select>
            </div>

            {/* Destination Sanctuary */}
            <div className="bg-white p-2.5 rounded-xl border border-sumi/30 shadow-sm flex flex-col justify-between">
              <span className="text-[10px] text-slate-500 font-bold uppercase flex items-center gap-1">
                <Navigation className="w-3 h-3 text-vermilion" />
                <span>TO (SANCTUARY)</span>
              </span>
              <div className="font-bold text-sumi mt-1 truncate">
                {currentDestination.name}
              </div>
            </div>
          </div>

          {/* Quick Metrics & Crowding Radar Strip */}
          <div className="flex flex-wrap items-center justify-between gap-2 pt-1">
            <div className="flex items-center gap-2">
              <span className={`px-2.5 py-1 rounded-xl text-xs font-mono font-bold flex items-center gap-1.5 ${
                plan.crowdAdvisory.level === 'low'
                  ? 'bg-emerald-100 text-emerald-900 border border-emerald-300'
                  : plan.crowdAdvisory.level === 'high'
                  ? 'bg-rose-100 text-rose-900 border border-rose-300'
                  : 'bg-amber-100 text-amber-900 border border-amber-300'
              }`}>
                <span>{plan.crowdAdvisory.headline}</span>
              </span>

              <span className="px-2.5 py-1 rounded-xl text-xs font-mono font-bold bg-white text-sumi border border-sumi/30 shadow-sm">
                ⏱️ ~{plan.totalDurationMinutes} mins total
              </span>

              <span className="px-2.5 py-1 rounded-xl text-xs font-mono font-bold bg-amber-400 text-sumi border border-sumi/30 shadow-sm">
                🪙 ~₹{plan.totalEstimatedCost} cost
              </span>
            </div>

            {/* Train Type Chip */}
            <div className="text-[11px] font-mono font-bold text-slate-700">
              {plan.trainTypeAdvice.label}
            </div>
          </div>
        </div>

        {/* Scrollable Step-by-Step Blueprint Body */}
        <div className="p-5 overflow-y-auto space-y-4 flex-1">
          {/* Warning Banner if slow train mandatory */}
          {plan.trainTypeAdvice.warning && (
            <div className="p-3.5 bg-amber-50 rounded-2xl border-2 border-amber-400/80 text-xs font-mono text-amber-900 flex items-start gap-2.5 shadow-sm">
              <AlertTriangle className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
              <div className="leading-relaxed">
                <strong>CRITICAL BOARDING RULE:</strong> {plan.trainTypeAdvice.warning}
              </div>
            </div>
          )}

          {/* Crowding Directional Advice */}
          <div className="p-3 bg-white rounded-2xl border border-sumi/20 text-xs text-slate-700 font-mono leading-relaxed">
            💡 <strong>Rush Hour Radar:</strong> {plan.crowdAdvisory.description}
          </div>

          {/* Chronological Step Cards */}
          <div className="space-y-3 relative before:absolute before:inset-0 before:left-5 before:w-0.5 before:bg-sumi/20 before:pointer-events-none">
            {plan.steps.map((step, idx) => (
              <div
                key={step.id}
                className="relative flex items-start gap-3.5 bg-white p-3.5 sm:p-4 rounded-2xl border-2 border-sumi shadow-riso-sm hover:shadow-riso transition-all"
              >
                {/* Step Index Badge */}
                <div className="w-8 h-8 rounded-full bg-sumi text-wabi font-mono font-black text-xs flex items-center justify-center flex-shrink-0 border-2 border-sumi z-10">
                  {idx + 1}
                </div>

                {/* Step Content */}
                <div className="flex-1 min-w-0 space-y-1">
                  <div className="flex flex-wrap items-center justify-between gap-1">
                    <span className="font-bold text-sm sm:text-base text-sumi">
                      {step.title}
                    </span>
                    {step.badge && (
                      <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-black uppercase ${step.badgeColor || 'bg-sumi/10 text-sumi'}`}>
                        {step.badge}
                      </span>
                    )}
                  </div>

                  <p className="text-xs sm:text-sm text-slate-800 font-medium leading-snug">
                    {step.instruction}
                  </p>

                  <p className="text-[11px] sm:text-xs text-slate-500 font-mono pt-0.5 leading-relaxed">
                    {step.detail}
                  </p>

                  <div className="flex items-center gap-3 pt-1 text-[11px] font-mono text-slate-600">
                    <span>⏱️ {step.durationMinutes} mins</span>
                    {step.cost !== undefined && step.cost > 0 && (
                      <span>🪙 ₹{step.cost}</span>
                    )}
                    {step.distanceMeters !== undefined && (
                      <span>📏 {step.distanceMeters}m</span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Sticky Action Footer */}
        <div className="p-4 bg-wabi border-t-2 border-sumi flex flex-col sm:flex-row items-center justify-between gap-3 flex-shrink-0">
          <div className="text-xs font-mono text-slate-600 hidden sm:block">
            📍 <strong>{plan.originStation.name}</strong> ➔ <strong>{plan.destinationStation.name}</strong> ➔ <strong>{currentDestination.name}</strong>
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <button
              onClick={() => {
                onTraceOnMap(plan);
                onClose();
              }}
              className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-5 py-3 bg-sumi hover:bg-vermilion text-wabi font-mono font-bold text-xs rounded-xl border-2 border-sumi shadow-riso hover:shadow-riso-red hover:-translate-y-0.5 transition-all uppercase tracking-wider"
            >
              <Navigation className="w-4 h-4 text-amber-300" />
              <span>TRACE JOURNEY ON MAP ➔</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
