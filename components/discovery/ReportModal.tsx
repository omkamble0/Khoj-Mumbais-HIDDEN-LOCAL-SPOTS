'use client';

import React, { useState } from 'react';
import { Place } from '@/lib/types';
import { AlertTriangle, X, CheckCircle2 } from 'lucide-react';

interface ReportModalProps {
  place: Place;
  isOpen: boolean;
  onClose: () => void;
}

export default function ReportModal({ place, isOpen, onClose }: ReportModalProps) {
  const [reason, setReason] = useState<'private_property' | 'unsafe' | 'closed' | 'wrong_location'>('private_property');
  const [details, setDetails] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await fetch('/api/places/report', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          placeId: place.id,
          reason,
          details,
        }),
      });
      setSubmitted(true);
      setTimeout(() => {
        setSubmitted(false);
        onClose();
      }, 1800);
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4">
      <div className="bg-white rounded-2xl max-w-md w-full p-5 shadow-2xl relative border border-slate-200">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-700"
        >
          <X className="w-4 h-4" />
        </button>

        {submitted ? (
          <div className="flex flex-col items-center justify-center py-8 text-center gap-3">
            <CheckCircle2 className="w-12 h-12 text-emerald-500 animate-bounce" />
            <h3 className="text-lg font-bold text-slate-800">Report Logged</h3>
            <p className="text-xs text-slate-500 max-w-xs">
              Thank you for keeping local discovery safe and legal. Our verification queue has received this flag.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div className="flex items-center gap-2.5 text-amber-600">
              <AlertTriangle className="w-5 h-5 flex-shrink-0" />
              <div>
                <h3 className="font-bold text-slate-900 text-sm">Report Safety or Access Issue</h3>
                <p className="text-xs text-slate-500 truncate max-w-[280px]">{place.name}</p>
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-xs font-semibold text-slate-700">Select Issue:</label>
              <div className="grid grid-cols-2 gap-2 text-xs">
                {[
                  { id: 'private_property', label: 'Private Property / No Trespassing' },
                  { id: 'unsafe', label: 'Hazardous / Unsafe Terrain' },
                  { id: 'closed', label: 'Permanently Closed / Fenced' },
                  { id: 'wrong_location', label: 'Inaccurate Pin / Coordinates' },
                ].map((item) => (
                  <button
                    type="button"
                    key={item.id}
                    onClick={() => setReason(item.id as any)}
                    className={`p-2.5 rounded-xl border text-left font-medium transition-all ${
                      reason === item.id
                        ? 'border-emerald-600 bg-emerald-50 text-emerald-900'
                        : 'border-slate-200 hover:bg-slate-50 text-slate-700'
                    }`}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-slate-700">Additional Details (Optional):</label>
              <textarea
                value={details}
                onChange={(e) => setDetails(e.target.value)}
                rows={2}
                placeholder="e.g. A new gate has been locked by municipal authorities..."
                className="w-full text-xs p-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={onClose}
                className="px-3.5 py-1.5 rounded-xl text-xs font-medium text-slate-600 hover:bg-slate-100"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-4 py-1.5 rounded-xl text-xs font-semibold bg-red-600 text-white hover:bg-red-700 shadow-sm"
              >
                {isSubmitting ? 'Submitting...' : 'Submit Flag'}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}

