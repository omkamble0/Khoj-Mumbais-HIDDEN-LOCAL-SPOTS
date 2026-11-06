'use client';

import React, { useState, useMemo, useEffect, useRef, useCallback } from 'react';
import { Place } from '@/lib/types';
import {
  TRANSIT_STATIONS,
  TransitStation,
  TransitLineType,
  getSanctuariesNearStation,
  getSanctuaryTransitProfile,
  getMumbaiTransitCrowdAdvisory,
  planSmartCommute,
  SmartCommutePlan,
} from '@/lib/transit';
import {
  Train,
  Navigation,
  Compass,
  Clock,
  ArrowRight,
  Search,
  ExternalLink,
  Shield,
  Zap,
  Info,
  MapPin,
  Coins,
  ChevronRight,
  ChevronLeft,
  Sparkles,
  AlertTriangle,
} from 'lucide-react';

interface TransitNavigatorViewProps {
  places: Place[];
  onSelectPlace: (place: Place) => void;
  onViewOnMap: (place: Place, station?: TransitStation) => void;
  onExploreStationOnMap?: (station: TransitStation) => void;
  initialSelectedPlace?: Place | null;
  initialSelectedStation?: TransitStation | null;
}

const LINE_TABS: { id: TransitLineType | 'all'; label: string; badge: string; color: string }[] = [
  { id: 'all', label: 'ALL LINES', badge: 'ALL', color: 'bg-sumi text-wabi' },
  { id: 'western', label: 'WESTERN LINE', badge: 'WR', color: 'bg-rose-600 text-white' },
  { id: 'central', label: 'CENTRAL MAIN', badge: 'CR', color: 'bg-amber-600 text-white' },
  { id: 'harbour', label: 'HARBOUR LINE', badge: 'HR', color: 'bg-blue-600 text-white' },
  { id: 'metro_1', label: 'METRO 1 (BLUE)', badge: 'M1', color: 'bg-sky-600 text-white' },
  { id: 'metro_2a', label: 'METRO 2A (YELLOW)', badge: 'M2A', color: 'bg-amber-400 text-sumi font-black' },
  { id: 'metro_7', label: 'METRO 7 (RED)', badge: 'M7', color: 'bg-red-600 text-white' },
  { id: 'metro_3', label: 'AQUA METRO 3', badge: 'M3', color: 'bg-emerald-600 text-white' },
  { id: 'metro_navi', label: 'NAVI MUMBAI METRO', badge: 'NMM', color: 'bg-orange-600 text-white' },
];

interface TactileSliderBarProps {
  containerRef: React.RefObject<HTMLDivElement>;
  variant?: 'lines' | 'stations';
  accentColor?: string;
  trackLabel?: string;
  className?: string;
}

function TactileSliderBar({
  containerRef,
  variant = 'stations',
  accentColor = 'bg-sumi',
  trackLabel,
  className = '',
}: TactileSliderBarProps) {
  const trackRef = useRef<HTMLDivElement>(null);
  const [scrollProgress, setScrollProgress] = useState({
    scrollLeft: 0,
    scrollWidth: 1,
    clientWidth: 1,
    canScroll: true,
  });
  const [isDragging, setIsDragging] = useState(false);

  const updateProgress = useCallback(() => {
    const el = containerRef.current;
    if (!el) return;
    const canScroll = el.scrollWidth > el.clientWidth + 1;
    setScrollProgress({
      scrollLeft: el.scrollLeft,
      scrollWidth: Math.max(1, el.scrollWidth),
      clientWidth: Math.max(1, el.clientWidth),
      canScroll,
    });
  }, [containerRef]);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    updateProgress();

    // ResizeObserver tracks element resize and container reflow
    let ro: ResizeObserver | null = null;
    if (typeof ResizeObserver !== 'undefined') {
      ro = new ResizeObserver(() => {
        updateProgress();
      });
      ro.observe(el);
      if (el.parentElement) {
        ro.observe(el.parentElement);
      }
    }

    el.addEventListener('scroll', updateProgress, { passive: true });
    window.addEventListener('resize', updateProgress);

    // Font loading check
    if (typeof document !== 'undefined' && 'fonts' in document) {
      document.fonts.ready.then(updateProgress).catch(() => {});
    }

    // Staggered timeouts to guarantee layout settlement
    const t1 = setTimeout(updateProgress, 50);
    const t2 = setTimeout(updateProgress, 150);
    const t3 = setTimeout(updateProgress, 400);

    return () => {
      el.removeEventListener('scroll', updateProgress);
      window.removeEventListener('resize', updateProgress);
      ro?.disconnect();
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
    };
  }, [containerRef, updateProgress]);

  // Click on track to jump
  const handleTrackPointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    const track = trackRef.current;
    const container = containerRef.current;
    if (!track || !container || !scrollProgress.canScroll) return;

    const trackRect = track.getBoundingClientRect();
    const clickX = e.clientX - trackRect.left;
    const clickRatio = Math.max(0, Math.min(1, clickX / trackRect.width));
    const maxScroll = container.scrollWidth - container.clientWidth;

    container.scrollTo({
      left: clickRatio * maxScroll,
      behavior: 'smooth',
    });
  };

  // Drag thumb
  const handleThumbPointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    const track = trackRef.current;
    const container = containerRef.current;
    if (!track || !container || !scrollProgress.canScroll) return;

    e.stopPropagation();
    e.preventDefault();

    setIsDragging(true);
    const startX = e.clientX;
    const startScrollLeft = container.scrollLeft;
    const trackRect = track.getBoundingClientRect();
    const maxScroll = container.scrollWidth - container.clientWidth;
    const rawRatio = (scrollProgress.clientWidth / scrollProgress.scrollWidth) * 100;
    const currentThumbWidth = Math.max(12, Math.min(65, isNaN(rawRatio) ? 20 : rawRatio));
    const usableTrackWidth = trackRect.width - (currentThumbWidth / 100) * trackRect.width;

    const handlePointerMove = (moveEvent: PointerEvent) => {
      if (usableTrackWidth <= 0 || maxScroll <= 0) return;
      const deltaX = moveEvent.clientX - startX;
      const scrollDelta = (deltaX / usableTrackWidth) * maxScroll;
      container.scrollLeft = startScrollLeft + scrollDelta;
    };

    const handlePointerUp = () => {
      setIsDragging(false);
      window.removeEventListener('pointermove', handlePointerMove);
      window.removeEventListener('pointerup', handlePointerUp);
    };

    window.addEventListener('pointermove', handlePointerMove);
    window.addEventListener('pointerup', handlePointerUp);
  };

  const handleStep = (direction: 'left' | 'right') => {
    const el = containerRef.current;
    if (!el || !scrollProgress.canScroll) return;
    const stepAmount = variant === 'lines' ? 220 : 340;
    el.scrollBy({
      left: direction === 'left' ? -stepAmount : stepAmount,
      behavior: 'smooth',
    });
  };

  const canScroll = scrollProgress.canScroll;
  const maxScroll = Math.max(1, scrollProgress.scrollWidth - scrollProgress.clientWidth);
  const scrollRatio = canScroll && maxScroll > 0 ? Math.max(0, Math.min(1, scrollProgress.scrollLeft / maxScroll)) : 0;

  const rawRatio = scrollProgress.scrollWidth > 0 ? (scrollProgress.clientWidth / scrollProgress.scrollWidth) * 100 : 100;
  const thumbWidthPercent = canScroll ? Math.max(12, Math.min(65, isNaN(rawRatio) ? 20 : rawRatio)) : 100;
  const thumbLeftPercent = canScroll ? scrollRatio * (100 - thumbWidthPercent) : 0;

  return (
    <div
      className={`flex items-center gap-1.5 pt-1.5 select-none w-full ${className}`}
      aria-label={trackLabel || 'Horizontal sliding bar'}
    >
      {/* Left Glide Step Button */}
      <button
        type="button"
        onClick={() => handleStep('left')}
        disabled={!canScroll || scrollProgress.scrollLeft <= 4}
        className="w-6 h-6 rounded-lg border-2 border-sumi bg-wabi hover:bg-white text-sumi flex items-center justify-center shadow-riso-sm disabled:opacity-30 disabled:pointer-events-none transition-all active:scale-95 flex-shrink-0"
        title="Scroll left"
      >
        <ChevronLeft className="w-3.5 h-3.5 stroke-[2.5]" />
      </button>

      {/* Tactile Sliding Track */}
      <div
        ref={trackRef}
        onPointerDown={handleTrackPointerDown}
        className="relative flex-1 h-3.5 bg-sumi/10 hover:bg-sumi/15 rounded-full border-2 border-sumi cursor-pointer overflow-hidden transition-colors"
        title={canScroll ? "Click or drag to glide horizontally" : "All items in view"}
      >
        {/* Draggable Sliding Thumb */}
        <div
          onPointerDown={handleThumbPointerDown}
          style={{
            width: `${thumbWidthPercent}%`,
            left: `${thumbLeftPercent}%`,
          }}
          className={`absolute top-0.5 bottom-0.5 rounded-full border border-sumi shadow-riso-sm transition-transform cursor-grab active:cursor-grabbing flex items-center justify-center ${
            isDragging
              ? 'bg-vermilion scale-y-110 shadow-riso'
              : !canScroll
              ? 'bg-sumi/40 pointer-events-none'
              : `${accentColor} hover:bg-vermilion text-wabi`
          }`}
        >
          {/* Subtle tactile grip ridges inside the thumb */}
          {canScroll && (
            <div className="flex items-center justify-center gap-0.5 opacity-80 pointer-events-none">
              <span className="w-0.5 h-1.5 bg-wabi/80 rounded-full" />
              <span className="w-0.5 h-1.5 bg-wabi/80 rounded-full" />
              <span className="w-0.5 h-1.5 bg-wabi/80 rounded-full" />
            </div>
          )}
        </div>
      </div>

      {/* Right Glide Step Button */}
      <button
        type="button"
        onClick={() => handleStep('right')}
        disabled={!canScroll || scrollProgress.scrollLeft >= maxScroll - 4}
        className="w-6 h-6 rounded-lg border-2 border-sumi bg-wabi hover:bg-white text-sumi flex items-center justify-center shadow-riso-sm disabled:opacity-30 disabled:pointer-events-none transition-all active:scale-95 flex-shrink-0"
        title="Scroll right"
      >
        <ChevronRight className="w-3.5 h-3.5 stroke-[2.5]" />
      </button>
    </div>
  );
}

export default function TransitNavigatorView({
  places,
  onSelectPlace,
  onViewOnMap,
  onExploreStationOnMap,
  initialSelectedPlace,
  initialSelectedStation,
}: TransitNavigatorViewProps) {
  const [selectedLine, setSelectedLine] = useState<TransitLineType | 'all'>('western');
  const [selectedStationId, setSelectedStationId] = useState<string>(
    initialSelectedStation?.id || 'stn-bandra'
  );
  const [tripOriginStationId, setTripOriginStationId] = useState<string>('stn-bandra');
  const [sanctuarySearchQuery, setSanctuarySearchQuery] = useState('');
  const [selectedSanctuaryId, setSelectedSanctuaryId] = useState<string | null>(
    initialSelectedPlace?.id || null
  );

  useEffect(() => {
    if (initialSelectedStation) {
      setSelectedStationId(initialSelectedStation.id);
      setTripOriginStationId(initialSelectedStation.id);
      const line = initialSelectedStation.lines[0];
      if (line) setSelectedLine(line);
    }
  }, [initialSelectedStation]);

  useEffect(() => {
    if (initialSelectedPlace) {
      setSelectedSanctuaryId(initialSelectedPlace.id);
    }
  }, [initialSelectedPlace]);

  const lineTabsContainerRef = useRef<HTMLDivElement>(null);
  const stationsContainerRef = useRef<HTMLDivElement>(null);

  const handleHorizontalWheel = (
    e: React.WheelEvent<HTMLDivElement>,
    targetRef: React.RefObject<HTMLDivElement>
  ) => {
    if (Math.abs(e.deltaY) > Math.abs(e.deltaX) && targetRef.current) {
      if (targetRef.current.scrollWidth > targetRef.current.clientWidth) {
        targetRef.current.scrollLeft += e.deltaY;
      }
    }
  };

  const handleSelectLine = (lineId: TransitLineType | 'all') => {
    setSelectedLine(lineId);
    if (stationsContainerRef.current) {
      stationsContainerRef.current.scrollTo({ left: 0, behavior: 'smooth' });
    }
    if (lineId !== 'all') {
      const stationsOnLine = TRANSIT_STATIONS.filter((stn) => stn.lines.includes(lineId));
      if (stationsOnLine.length > 0 && !stationsOnLine.some((s) => s.id === selectedStationId)) {
        setSelectedStationId(stationsOnLine[0].id);
      }
    }
  };

  useEffect(() => {
    if (stationsContainerRef.current && selectedStationId) {
      const activeEl = stationsContainerRef.current.querySelector(
        `[data-station-id="${selectedStationId}"]`
      ) as HTMLElement | null;
      if (activeEl) {
        activeEl.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
      }
    }
  }, [selectedStationId]);

  useEffect(() => {
    if (lineTabsContainerRef.current && selectedLine) {
      const activeTab = lineTabsContainerRef.current.querySelector(
        `[data-line-id="${selectedLine}"]`
      ) as HTMLElement | null;
      if (activeTab) {
        activeTab.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
      }
    }
  }, [selectedLine]);

  // Live crowd rush hour advisory
  const crowdAdvisory = useMemo(() => getMumbaiTransitCrowdAdvisory(), []);

  // Filter stations based on selected line
  const filteredStations = useMemo(() => {
    if (selectedLine === 'all') return TRANSIT_STATIONS;
    return TRANSIT_STATIONS.filter((stn) => stn.lines.includes(selectedLine));
  }, [selectedLine]);

  // Current active station object
  const activeStation = useMemo(() => {
    return (
      TRANSIT_STATIONS.find((s) => s.id === selectedStationId) ||
      filteredStations[0] ||
      TRANSIT_STATIONS[0]
    );
  }, [selectedStationId, filteredStations]);

  // Sanctuaries reachable from this active station
  const sanctuariesAtStation = useMemo(() => {
    return getSanctuariesNearStation(activeStation, places, 3500);
  }, [activeStation, places]);

  // Search results for Sanctuary Direct Route Finder
  const sanctuarySearchResults = useMemo(() => {
    if (!sanctuarySearchQuery.trim()) return [];
    const q = sanctuarySearchQuery.toLowerCase().trim();
    return places
      .filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.neighborhood?.toLowerCase().includes(q) ||
          p.category.toLowerCase().includes(q)
      )
      .slice(0, 5);
  }, [sanctuarySearchQuery, places]);

  const activeSanctuary = useMemo(() => {
    if (!selectedSanctuaryId) return null;
    return places.find((p) => p.id === selectedSanctuaryId) || null;
  }, [selectedSanctuaryId, places]);

  const activeSanctuaryTransitProfile = useMemo(() => {
    if (!activeSanctuary) return null;
    return getSanctuaryTransitProfile(activeSanctuary.latitude, activeSanctuary.longitude);
  }, [activeSanctuary]);

  // Smart Commute Plan for Selected Sanctuary
  const smartTripPlan = useMemo(() => {
    if (!activeSanctuary) return null;
    const originStn = TRANSIT_STATIONS.find((s) => s.id === tripOriginStationId) || TRANSIT_STATIONS[0];
    return planSmartCommute(originStn.latitude, originStn.longitude, activeSanctuary, originStn.id);
  }, [activeSanctuary, tripOriginStationId]);

  return (
    <div className="w-full px-3 sm:px-6 md:px-10 py-6 sm:py-8 bg-washi font-sans min-h-screen space-y-8">
      {/* ─────────────────────────────────────────────────────────────
          1. HERO BANNER: The Lifeline of Mumbai
          ───────────────────────────────────────────────────────────── */}
      <div className="max-w-7xl mx-auto bg-sumi text-wabi rounded-3xl border-2 border-sumi shadow-riso p-6 sm:p-8 md:p-10 relative overflow-hidden">
        {/* Background Decorative Accent */}
        <div className="absolute right-0 top-0 bottom-0 w-1/3 bg-gradient-to-l from-white/5 to-transparent pointer-events-none" />
        <div className="absolute -right-12 -bottom-12 opacity-10 pointer-events-none">
          <Train className="w-80 h-80 text-white" />
        </div>

        <div className="relative z-10 max-w-3xl space-y-3">
          <div className="flex flex-wrap items-center gap-2">
            <span className="px-2.5 py-1 rounded-lg text-xs font-mono font-bold bg-vermilion text-white uppercase tracking-wider">
              MUMBAI SMART TRANSIT
            </span>
            <span className="text-xs font-mono text-slate-300">
              SUBURBAN LOCAL & METRO NAVIGATOR
            </span>
          </div>

          <h1 className="font-display font-normal text-3xl sm:text-4xl md:text-5xl text-wabi leading-tight">
            The Lifelines to <span className="text-amber-300 italic">Every Hidden Sanctuary</span>.
          </h1>

          <p className="text-slate-300 text-sm sm:text-base leading-relaxed max-w-2xl font-sans">
            Mumbai's local trains and underground metros are the city's pulse. Hop off at any station along the Western, Central, or Metro line and walk straight into Portuguese fortresses, colonial reading halls, or fragrant spice alleys.
          </p>

          {/* Live Rush Hour Radar Box */}
          <div className="pt-2">
            <div className="bg-wabi/10 border border-white/20 rounded-2xl p-3.5 sm:p-4 backdrop-blur-md flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs font-mono">
              <div className="flex items-center gap-2.5">
                <span className={`px-2.5 py-1 rounded-lg font-black ${crowdAdvisory.color}`}>
                  {crowdAdvisory.badge}
                </span>
                <span className="text-slate-200 font-bold">{crowdAdvisory.status}</span>
              </div>
              <p className="text-slate-300 text-[11px] sm:text-xs">
                {crowdAdvisory.directionTip}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* ─────────────────────────────────────────────────────────────
          2. SANCTUARY TRANSIT BLUEPRINT FINDER (Search Any Spot)
          ───────────────────────────────────────────────────────────── */}
      <div className="max-w-7xl mx-auto bg-wabi rounded-3xl border-2 border-sumi shadow-riso p-5 sm:p-7 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b-2 border-sumi/15 pb-3">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-amber-400 text-sumi flex items-center justify-center font-bold border border-sumi/30 shadow-sm">
              <Navigation className="w-4 h-4" />
            </div>
            <div>
              <h2 className="font-mono font-black text-sm sm:text-base text-sumi uppercase tracking-wider">
                Sanctuary Transit Blueprint
              </h2>
              <p className="text-xs text-slate-600 font-mono">
                Type any sanctuary name to get station exits, walking minutes & last-mile connections
              </p>
            </div>
          </div>
          <span className="text-xs font-mono text-slate-500 font-bold">
            427 SANCTUARIES MAPPED
          </span>
        </div>

        {/* Search input with live suggestion pills */}
        <div className="relative">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={sanctuarySearchQuery}
            onChange={(e) => {
              setSanctuarySearchQuery(e.target.value);
              setSelectedSanctuaryId(null);
            }}
            placeholder="Search spot (e.g. 'Kyani', 'Kanheri Caves', 'Bandstand', 'Banganga', 'Subko')..."
            className="w-full pl-10 pr-4 py-2.5 rounded-xl border-2 border-sumi bg-white text-sm font-sans focus:outline-none focus:shadow-riso-sm"
          />

          {sanctuarySearchResults.length > 0 && !selectedSanctuaryId && (
            <div className="absolute top-full left-0 right-0 mt-1 bg-white rounded-2xl border-2 border-sumi shadow-riso z-30 divide-y divide-sumi/10 overflow-hidden">
              {sanctuarySearchResults.map((place) => (
                <div
                  key={place.id}
                  onClick={() => {
                    setSelectedSanctuaryId(place.id);
                    setSanctuarySearchQuery(place.name);
                  }}
                  className="p-3 hover:bg-amber-50 cursor-pointer flex items-center justify-between transition-colors"
                >
                  <div>
                    <h4 className="font-bold text-sm text-sumi">{place.name}</h4>
                    <span className="text-xs font-mono text-slate-500">
                      📍 {place.neighborhood || place.city} · {place.category.toUpperCase()}
                    </span>
                  </div>
                  <span className="text-xs font-mono font-bold text-vermilion">SELECT ➔</span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Selected Sanctuary Transit Card */}
        {activeSanctuary && activeSanctuaryTransitProfile && (
          <div className="bg-wabi-100 border-2 border-sumi rounded-2xl p-4 sm:p-5 shadow-riso-sm space-y-4 animate-in fade-in duration-150">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-sumi/20 pb-3">
              <div>
                <span className="text-[10px] font-mono font-bold uppercase px-2 py-0.5 rounded bg-sumi text-wabi">
                  {activeSanctuary.category}
                </span>
                <h3 className="font-display font-normal text-2xl text-sumi mt-1">
                  {activeSanctuary.name}
                </h3>
                <p className="text-xs font-mono text-slate-600">
                  📍 {activeSanctuary.neighborhood ? `${activeSanctuary.neighborhood}, ${activeSanctuary.city}` : activeSanctuary.city}
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => onSelectPlace(activeSanctuary)}
                  className="px-3.5 py-1.5 rounded-xl border-2 border-sumi bg-white hover:bg-wabi text-xs font-mono font-bold text-sumi shadow-sm"
                >
                  VIEW DETAILS
                </button>
                <button
                  onClick={() => onViewOnMap(activeSanctuary, activeSanctuaryTransitProfile.nearestRailway.station)}
                  className="px-3.5 py-1.5 rounded-xl bg-sumi hover:bg-vermilion text-white text-xs font-mono font-bold shadow-sm flex items-center gap-1.5"
                >
                  <span>VIEW ROUTE ON MAP ➔</span>
                </button>
              </div>
            </div>

            {/* Smart Origin Boarding Picker & Route Calculator */}
            <div className="bg-white/80 p-3.5 rounded-2xl border-2 border-sumi/20 space-y-3">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs font-mono">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-sumi flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-emerald-600" />
                    <span>SELECT DEPARTURE STATION:</span>
                  </span>
                  <select
                    value={tripOriginStationId}
                    onChange={(e) => setTripOriginStationId(e.target.value)}
                    className="bg-wabi border-2 border-sumi/40 font-bold text-sumi rounded-xl px-2.5 py-1 focus:outline-none cursor-pointer"
                  >
                    {TRANSIT_STATIONS.map((stn) => (
                      <option key={stn.id} value={stn.id}>
                        {stn.name} ({stn.lines.join('/')})
                      </option>
                    ))}
                  </select>
                </div>

                {smartTripPlan && (
                  <div className="flex items-center gap-2 font-bold text-[11px]">
                    <span className="px-2.5 py-1 rounded-xl bg-amber-400 text-sumi border border-sumi/20 shadow-sm">
                      ⏱️ ~{smartTripPlan.totalDurationMinutes} mins total
                    </span>
                  </div>
                )}
              </div>

              {/* Smart Boarding Warning Banner */}
              {smartTripPlan?.trainTypeAdvice.warning && (
                <div className="p-3 bg-amber-50 rounded-xl border border-amber-400/80 text-xs font-mono text-amber-900 flex items-start gap-2 leading-relaxed">
                  <AlertTriangle className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
                  <span><strong>IMPORTANT:</strong> {smartTripPlan.trainTypeAdvice.warning}</span>
                </div>
              )}

              {/* Dynamic Step-by-Step Commute Plan */}
              {smartTripPlan && (
                <div className="space-y-2 pt-1">
                  {smartTripPlan.steps.map((st, i) => (
                    <div key={st.id} className="p-3 bg-white rounded-xl border border-sumi/20 flex items-start gap-2.5 text-xs font-mono shadow-sm">
                      <span className="w-5 h-5 rounded-full bg-sumi text-wabi font-black text-[10px] flex items-center justify-center flex-shrink-0 mt-0.5">
                        {i + 1}
                      </span>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-sumi text-xs sm:text-sm">{st.title}</span>
                          <span className={`text-[10px] font-black uppercase px-2 py-0.5 rounded ${st.badgeColor || 'bg-sumi/10 text-slate-700'}`}>
                            {st.badge}
                          </span>
                        </div>
                        <p className="text-slate-800 text-xs font-sans mt-0.5 font-medium">{st.instruction}</p>
                        <p className="text-[11px] text-slate-500 mt-0.5">{st.detail}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Transit Blueprint Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 font-mono text-xs">
              {/* Box 1: Nearest Local Train Station */}
              <div className="bg-white p-3.5 rounded-xl border border-sumi/30 shadow-sm space-y-1.5">
                <div className="flex items-center justify-between text-slate-500 text-[11px] font-bold">
                  <span>🚆 NEAREST LOCAL TRAIN</span>
                  <span className="px-1.5 py-0.5 bg-rose-100 text-rose-800 rounded font-black">
                    {activeSanctuaryTransitProfile.nearestRailway.station.lines[0].toUpperCase()}
                  </span>
                </div>
                <h4 className="font-bold text-base text-sumi">
                  {activeSanctuaryTransitProfile.nearestRailway.station.name} Station
                </h4>
                <div className="text-slate-600 text-[11px] space-y-0.5 pt-1">
                  <div>📏 Distance: <strong>{activeSanctuaryTransitProfile.nearestRailway.distanceKm} km</strong></div>
                  <div>🚶 Walking: <strong>~{activeSanctuaryTransitProfile.nearestRailway.walkMinutes} mins</strong></div>
                  <div>🛺 Auto Time: <strong>~{activeSanctuaryTransitProfile.nearestRailway.rickshawMinutes} mins</strong></div>
                </div>
              </div>

              {/* Box 2: Metro Station */}
              <div className="bg-white p-3.5 rounded-xl border border-sumi/30 shadow-sm space-y-1.5">
                <div className="flex items-center justify-between text-slate-500 text-[11px] font-bold">
                  <span>🚇 NEAREST METRO</span>
                  <span className="px-1.5 py-0.5 bg-cyan-100 text-cyan-800 rounded font-black">
                    METRO
                  </span>
                </div>
                {activeSanctuaryTransitProfile.nearestMetro ? (
                  <>
                    <h4 className="font-bold text-base text-sumi">
                      {activeSanctuaryTransitProfile.nearestMetro.station.name}
                    </h4>
                    <div className="text-slate-600 text-[11px] space-y-0.5 pt-1">
                      <div>📏 Distance: <strong>{activeSanctuaryTransitProfile.nearestMetro.distanceKm} km</strong></div>
                      <div>🚶 Walking: <strong>~{activeSanctuaryTransitProfile.nearestMetro.walkMinutes} mins</strong></div>
                    </div>
                  </>
                ) : (
                  <p className="text-xs text-slate-500 pt-2">
                    Best accessed directly via Western/Central local railway line.
                  </p>
                )}
              </div>

              {/* Box 3: Last-Mile Connection & Exit Route */}
              <div className="bg-white p-3.5 rounded-xl border border-sumi/30 shadow-sm space-y-1.5">
                <div className="flex items-center justify-between text-slate-500 text-[11px] font-bold">
                  <span>🛺 LAST-MILE FEEDER</span>
                  <span className="px-1.5 py-0.5 bg-emerald-100 text-emerald-800 rounded font-black">
                    FEEDER
                  </span>
                </div>
                <div className="text-sumi font-bold text-sm">
                  {activeSanctuaryTransitProfile.nearestRailway.station.auto_rickshaw_available
                    ? 'Meter Auto / Rickshaw Stand'
                    : 'Kaali-Peeli Taxi Stand or Bus'}
                </div>
                <p className="text-[11px] text-slate-600 pt-1 leading-snug">
                  {activeSanctuaryTransitProfile.recommendedConnection}
                </p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* ─────────────────────────────────────────────────────────────
          3. STATION-FIRST DISCOVERY ("Hop Off Here & Explore")
          ───────────────────────────────────────────────────────────── */}
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header & Line Switcher Section */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-4 border-b-2 border-sumi/10 pb-4">
          <div className="space-y-1">
            <h2 className="font-display font-normal text-2xl sm:text-3xl text-sumi">
              Station-to-Sanctuary <span className="text-vermilion italic font-normal">Hop-Off Guide</span>
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 font-mono">
              Pick any station across Western, Central, or Metro line to discover all hidden sanctuaries within reach
            </p>
          </div>

          {/* Line Switcher with Dedicated Sliding Bar */}
          <div className="w-full lg:max-w-xl space-y-1.5">
            <div className="flex items-center justify-between text-[11px] font-mono text-slate-600 font-bold uppercase tracking-wider">
              <span className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-vermilion" />
                TRANSIT LINES ({LINE_TABS.length})
              </span>
              <span className="text-[10px] text-slate-500 font-normal">
                Slide to browse lines →
              </span>
            </div>

            {/* Line Switcher Tabs */}
            <div
              ref={lineTabsContainerRef}
              onWheel={(e) => handleHorizontalWheel(e, lineTabsContainerRef)}
              className="flex items-center gap-1.5 overflow-x-auto sliding-bar py-1 select-none scroll-smooth"
            >
              {LINE_TABS.map((tab) => {
                const isActive = selectedLine === tab.id;
                return (
                  <button
                    key={tab.id}
                    data-line-id={tab.id}
                    onClick={() => handleSelectLine(tab.id)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-mono font-bold whitespace-nowrap border-2 transition-all flex-shrink-0 ${
                      isActive
                        ? 'bg-sumi text-wabi border-sumi shadow-riso-sm -translate-y-0.5'
                        : 'bg-white text-sumi border-sumi/30 hover:border-sumi hover:bg-wabi'
                    }`}
                  >
                    {tab.label}
                  </button>
                );
              })}
            </div>

            {/* Horizontal Sliding Bar for Lines */}
            <TactileSliderBar
              containerRef={lineTabsContainerRef}
              variant="lines"
              accentColor="bg-sumi"
              trackLabel="Transit Line Slider"
            />
          </div>
        </div>

        {/* Station Cards Carousel with Dedicated Sliding Bar */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-[11px] font-mono text-slate-600 font-bold uppercase tracking-wider">
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-amber-500" />
              <span>
                {filteredStations.length} STATIONS ON {LINE_TABS.find((t) => t.id === selectedLine)?.label || 'NETWORK'}
              </span>
            </span>
            <span className="text-[10px] text-slate-500 font-normal hidden sm:inline">
              Slide or drag bar below to browse all stations →
            </span>
          </div>

          {/* Station Horizontal Scroller Cards */}
          <div
            ref={stationsContainerRef}
            onWheel={(e) => handleHorizontalWheel(e, stationsContainerRef)}
            className="flex items-center gap-2 overflow-x-auto sliding-bar pb-2 pt-1 select-none scroll-smooth"
          >
            {filteredStations.map((stn) => {
              const isSelected = selectedStationId === stn.id;
              return (
                <button
                  key={stn.id}
                  data-station-id={stn.id}
                  onClick={() => setSelectedStationId(stn.id)}
                  className={`p-3 rounded-2xl border-2 text-left transition-all flex-shrink-0 min-w-[160px] sm:min-w-[190px] ${
                    isSelected
                      ? 'bg-amber-400 border-sumi text-sumi shadow-riso font-bold -translate-y-1'
                      : 'bg-wabi border-sumi/30 hover:border-sumi hover:bg-white text-slate-800'
                  }`}
                >
                  <div className="text-[10px] font-mono text-slate-600 uppercase flex items-center justify-between">
                    <span>{stn.zone}</span>
                    {stn.fast_train_stop && <span className="text-rose-600 font-bold">⚡ FAST</span>}
                  </div>
                  <div className="text-sm sm:text-base font-bold font-sans mt-0.5 truncate">
                    {stn.name}
                  </div>
                  <div className="text-xs font-marathi font-medium text-slate-700 opacity-90 mt-0.5">
                    {stn.marathi_name}
                  </div>
                </button>
              );
            })}
          </div>

          {/* Horizontal Sliding Bar for Stations */}
          <TactileSliderBar
            containerRef={stationsContainerRef}
            variant="stations"
            accentColor="bg-amber-400"
            trackLabel="Stations Slider"
          />
        </div>

        {/* Active Station Card & Reachable Sanctuaries List */}
        <div className="bg-wabi rounded-3xl border-2 border-sumi shadow-riso p-5 sm:p-7 space-y-5">
          {/* Active Station Header */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 border-b-2 border-sumi/15 pb-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-vermilion animate-ping" />
                <span className="text-xs font-mono font-bold text-vermilion uppercase tracking-wider">
                  CURRENT STATION HUB
                </span>
              </div>
              <h3 className="font-sans font-black text-2xl sm:text-3xl text-sumi flex flex-wrap items-baseline gap-2">
                <span>{activeStation.name}</span>
                {activeStation.marathi_name && (
                  <span className="font-marathi font-medium text-xl sm:text-2xl text-slate-600">
                    ({activeStation.marathi_name})
                  </span>
                )}
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 font-mono">
                🚪 <strong>Exit Advice:</strong> {activeStation.exit_tips}
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-2 font-mono text-xs">
              {onExploreStationOnMap && (
                <button
                  onClick={() => onExploreStationOnMap(activeStation)}
                  className="flex items-center gap-1.5 px-3.5 py-2 bg-sumi hover:bg-vermilion text-wabi rounded-xl text-xs font-mono font-bold shadow-riso-sm hover:shadow-riso hover:-translate-y-0.5 transition-all"
                  title="View this station and surrounding sanctuaries on interactive map"
                >
                  <MapPin className="w-3.5 h-3.5 text-amber-300" />
                  <span>EXPLORE ON MAP ➔</span>
                </button>
              )}
              <span className="px-3 py-2 rounded-xl bg-wabi-200 border border-sumi/30 font-bold text-sumi">
                {sanctuariesAtStation.length} SANCTUARIES NEARBY
              </span>
            </div>
          </div>

          {/* Sanctuaries List Grid */}
          {sanctuariesAtStation.length === 0 ? (
            <div className="p-8 text-center text-slate-500 font-mono text-xs">
              No spots mapped directly within 3.5 km of {activeStation.name}. Try picking Bandra, Charni Road, Churchgate, or Dadar!
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {sanctuariesAtStation.map((place) => (
                <div
                  key={place.id}
                  className="bg-white rounded-2xl border-2 border-sumi shadow-riso-sm hover:shadow-riso hover:-translate-y-1 transition-all p-4 flex flex-col justify-between group"
                >
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-xs font-mono">
                      <span className="font-bold text-vermilion uppercase text-[10px] bg-rose-50 px-2 py-0.5 rounded border border-rose-200">
                        {place.category}
                      </span>
                      <span className="font-black text-slate-600 text-[11px]">
                        🚶 {place.walk_minutes} MINS ({place.distance_to_station}m)
                      </span>
                    </div>

                    <h4 className="font-bold text-lg text-sumi group-hover:text-vermilion transition-colors leading-snug">
                      {place.name}
                    </h4>

                    <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                      {place.description}
                    </p>

                    {place.approx_cost && (
                      <span className="inline-block text-[10px] font-mono font-bold bg-amber-100 text-amber-900 border border-amber-300 px-2 py-0.5 rounded">
                        🪙 {place.approx_cost}
                      </span>
                    )}
                  </div>

                  <div className="pt-3 mt-3 border-t border-sumi/10 flex items-center justify-between text-xs font-mono font-bold">
                    <button
                      onClick={() => onSelectPlace(place)}
                      className="text-sumi hover:text-vermilion underline"
                    >
                      READ FIELD NOTES
                    </button>
                    <button
                      onClick={() => onViewOnMap(place, activeStation)}
                      className="flex items-center gap-1 text-vermilion hover:translate-x-0.5 transition-transform"
                    >
                      <span>VIEW ROUTE ON MAP</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* ─────────────────────────────────────────────────────────────
          4. TRAVELER'S LOCAL TRANSIT FIELD CHEATSHEET
          ───────────────────────────────────────────────────────────── */}
      <div className="max-w-7xl mx-auto bg-sumi text-wabi rounded-3xl border-2 border-sumi shadow-riso p-6 sm:p-8 space-y-6">
        <div className="border-b border-white/20 pb-4">
          <div className="flex items-center gap-2 mb-1">
            <span className="w-2 h-2 rounded-full bg-amber-400" />
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-amber-400">
              TRAVELER ESSENTIALS
            </span>
          </div>
          <h3 className="font-display font-normal text-2xl sm:text-3xl text-wabi">
            Mumbai Local & Metro Survival Guide
          </h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 font-mono text-xs">
          {/* Card 1: UTS App */}
          <div className="bg-white/5 border border-white/10 rounded-2xl p-4 space-y-2">
            <div className="flex items-center gap-2 text-amber-300 font-bold text-sm">
              <Zap className="w-4 h-4 text-amber-400" />
              <span>📱 Skip The Queues: UTS App</span>
            </div>
            <p className="text-slate-300 text-xs leading-relaxed">
              Never stand in railway station ticket lines. Download the official <strong>UTS (Unreserved Ticketing System)</strong> app by Indian Railways on your phone. Book paperless tickets via UPI from within 2km of the station.
            </p>
          </div>

          {/* Card 2: Fast vs Slow Trains */}
          <div className="bg-white/5 border border-white/10 rounded-2xl p-4 space-y-2">
            <div className="flex items-center gap-2 text-rose-300 font-bold text-sm">
              <Train className="w-4 h-4 text-rose-400" />
              <span>⚡ Fast vs Slow Trains</span>
            </div>
            <p className="text-slate-300 text-xs leading-relaxed">
              On display indicators, <strong>'F'</strong> means Fast (skips smaller halts like Marine Lines, Charni Road, Matunga Road, Khar Road). <strong>'S'</strong> means Slow (stops at all stations). Board slow trains when visiting local neighborhood gems.
            </p>
          </div>

          {/* Card 3: The Auto Rickshaw Meter Rule */}
          <div className="bg-white/5 border border-white/10 rounded-2xl p-4 space-y-2">
            <div className="flex items-center gap-2 text-emerald-300 font-bold text-sm">
              <Coins className="w-4 h-4 text-emerald-400" />
              <span>🛺 The Auto-Meter Rule</span>
            </div>
            <p className="text-slate-300 text-xs leading-relaxed">
              North of Bandra and Sion, auto-rickshaws run strictly by electronic meter. In South Mumbai (Churchgate to Dadar), take metered Kaali-Peeli black-and-yellow taxis. Always politely insist on meter before boarding.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
