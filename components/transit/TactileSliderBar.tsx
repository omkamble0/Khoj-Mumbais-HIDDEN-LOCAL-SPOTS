'use client';

import React, { useEffect, useRef, useState, useCallback } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

export interface TactileSliderBarProps {
  containerRef: React.RefObject<HTMLDivElement | null>;
  variant?: 'lines' | 'stations';
  accentColor?: string;
  trackLabel?: string;
  className?: string;
  subtle?: boolean;
}

export default function TactileSliderBar({
  containerRef,
  variant = 'stations',
  accentColor = 'bg-sumi',
  trackLabel,
  className = '',
  subtle = true,
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
  const thumbWidthPercent = canScroll ? Math.max(16, Math.min(65, isNaN(rawRatio) ? 25 : rawRatio)) : 100;
  const thumbLeftPercent = canScroll ? scrollRatio * (100 - thumbWidthPercent) : 0;

  // Don't occupy any vertical screen space if the content doesn't overflow
  if (!canScroll) {
    return null;
  }

  // Subtle Minimalist Micro-Indicator (Default across mobile & compact headers)
  if (subtle) {
    return (
      <div
        className={`flex items-center justify-center select-none w-full py-0.5 ${className}`}
        aria-label={trackLabel || 'Horizontal scrolling indicator'}
      >
        {/* Subtle Hairline Micro-Track (only 3.5px tall, unobtrusive) */}
        <div
          ref={trackRef}
          onPointerDown={handleTrackPointerDown}
          className="relative w-20 sm:w-28 h-1 bg-sumi/15 hover:bg-sumi/25 rounded-full cursor-pointer overflow-hidden transition-colors"
          title="Glide horizontally to explore more"
        >
          {/* Subtle Gliding Indicator Thumb */}
          <div
            onPointerDown={handleThumbPointerDown}
            style={{
              width: `${thumbWidthPercent}%`,
              left: `${thumbLeftPercent}%`,
            }}
            className={`absolute top-0 bottom-0 rounded-full transition-all cursor-grab active:cursor-grabbing ${
              isDragging ? 'bg-vermilion' : accentColor || 'bg-sumi/60'
            }`}
          />
        </div>
      </div>
    );
  }

  return (
    <div
      className={`flex items-center gap-1.5 pt-0.5 select-none w-full ${className}`}
      aria-label={trackLabel || 'Horizontal sliding bar'}
    >
      {/* Left Glide Step Button (Hidden on mobile phones where natural swipe gesture is preferred) */}
      <button
        type="button"
        onClick={() => handleStep('left')}
        disabled={scrollProgress.scrollLeft <= 4}
        className="hidden sm:flex w-5 h-5 rounded-md border border-sumi/40 bg-wabi hover:bg-white text-sumi items-center justify-center shadow-2xs disabled:opacity-30 disabled:pointer-events-none transition-all active:scale-95 flex-shrink-0"
        title="Scroll left"
      >
        <ChevronLeft className="w-3 h-3 stroke-[2.5]" />
      </button>

      {/* Tactile Sliding Track */}
      <div
        ref={trackRef}
        onPointerDown={handleTrackPointerDown}
        className="relative flex-1 h-1.5 sm:h-2 bg-sumi/10 hover:bg-sumi/15 rounded-full cursor-pointer overflow-hidden transition-colors"
        title="Click or drag to glide horizontally"
      >
        {/* Draggable Sliding Thumb */}
        <div
          onPointerDown={handleThumbPointerDown}
          style={{
            width: `${thumbWidthPercent}%`,
            left: `${thumbLeftPercent}%`,
          }}
          className={`absolute top-0 bottom-0 rounded-full transition-transform cursor-grab active:cursor-grabbing ${
            isDragging
              ? 'bg-vermilion scale-y-110 shadow-sm'
              : `${accentColor} hover:bg-vermilion text-wabi`
          }`}
        />
      </div>

      {/* Right Glide Step Button (Hidden on mobile phones where natural swipe gesture is preferred) */}
      <button
        type="button"
        onClick={() => handleStep('right')}
        disabled={scrollProgress.scrollLeft >= maxScroll - 4}
        className="hidden sm:flex w-5 h-5 rounded-md border border-sumi/40 bg-wabi hover:bg-white text-sumi items-center justify-center shadow-2xs disabled:opacity-30 disabled:pointer-events-none transition-all active:scale-95 flex-shrink-0"
        title="Scroll right"
      >
        <ChevronRight className="w-3 h-3 stroke-[2.5]" />
      </button>
    </div>
  );
}

