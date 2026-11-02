'use client';

import React from 'react';
import { Compass, MapPin, LocateFixed, Search } from 'lucide-react';

interface HeaderProps {
  currentCity: string;
  onLocateMe: () => void;
  isLocating: boolean;
  searchQuery: string;
  onSearchChange: (q: string) => void;
}

export default function Header({
  currentCity,
  onLocateMe,
  isLocating,
  searchQuery,
  onSearchChange,
}: HeaderProps) {
  return (
    <header className="absolute top-4 left-4 right-4 z-30 flex flex-col md:flex-row items-center justify-between gap-2.5 pointer-events-none">
      {/* Brand & City Pill */}
      <div className="flex items-center gap-2.5 pointer-events-auto bg-white/95 backdrop-blur-md px-3.5 py-2 rounded-2xl shadow-sm border border-slate-200/80 w-full md:w-auto justify-between md:justify-start">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-500 flex items-center justify-center text-white shadow-md">
            <Compass className="w-4 h-4 animate-spin-slow" />
          </div>
          <div>
            <h1 className="font-bold text-sm text-slate-900 leading-tight">HiddenSpot</h1>
            <p className="text-[10px] text-slate-500 font-medium">Quiet & Underrated Places</p>
          </div>
        </div>

        <div className="flex items-center gap-1.5 pl-3 border-l border-slate-200 text-xs font-semibold text-emerald-800 bg-emerald-50/80 px-2.5 py-1 rounded-xl">
          <MapPin className="w-3.5 h-3.5 text-emerald-600" />
          <span>{currentCity}</span>
        </div>
      </div>

      {/* Search Input & Geolocation Button */}
      <div className="flex items-center gap-2 pointer-events-auto w-full md:w-auto">
        <div className="relative flex-1 md:w-64">
          <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search fort, quiet garden, view..."
            className="w-full pl-8 pr-3 py-2 text-xs bg-white/95 backdrop-blur-md rounded-2xl border border-slate-200/80 shadow-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 text-slate-800 placeholder-slate-400"
          />
        </div>

        <button
          onClick={onLocateMe}
          disabled={isLocating}
          className="flex items-center gap-1.5 px-3 py-2 bg-white/95 backdrop-blur-md rounded-2xl border border-slate-200/80 shadow-sm text-xs font-semibold text-slate-700 hover:text-emerald-700 hover:border-emerald-200 transition-colors"
          title="Recenter to my location"
        >
          <LocateFixed className={`w-3.5 h-3.5 text-emerald-600 ${isLocating ? 'animate-spin' : ''}`} />
          <span className="hidden sm:inline">{isLocating ? 'Locating...' : 'Near Me'}</span>
        </button>
      </div>
    </header>
  );
}
