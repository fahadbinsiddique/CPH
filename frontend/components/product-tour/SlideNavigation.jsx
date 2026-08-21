'use client';

import { ArrowLeft, ArrowRight } from 'lucide-react';
import { cn } from '@/lib/utils';

const pad = (n) => String(n).padStart(2, '0');

export default function SlideNavigation({ index, total, onPrev, onNext }) {
  return (
    <footer className="flex shrink-0 items-center justify-between gap-3 border-t border-slate-200/50 bg-white/70 px-4 py-3 backdrop-blur-md sm:px-6">
      <button
        type="button"
        onClick={onPrev}
        disabled={index === 0}
        aria-label="Previous slide"
        className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 shadow-sm transition-all duration-200 hover:border-teal-300 hover:bg-teal-50 hover:text-teal-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-500 focus-visible:ring-offset-1 disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:border-slate-200 disabled:hover:bg-white disabled:hover:text-slate-700"
      >
        <ArrowLeft className="h-4 w-4" />
        <span className="hidden sm:inline">Back</span>
      </button>

      <div className="flex items-center gap-2 text-sm font-bold tabular-nums text-slate-500">
        <span className="text-teal-700">{pad(index + 1)}</span>
        <span className="text-slate-300">/</span>
        <span>{pad(total)}</span>
      </div>

      <button
        type="button"
        onClick={onNext}
        disabled={index === total - 1}
        aria-label="Next slide"
        className={cn(
          'inline-flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold text-white shadow-lg shadow-teal-600/20 transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-500 focus-visible:ring-offset-1 disabled:cursor-not-allowed disabled:opacity-40 disabled:shadow-none',
          index === total - 1
            ? 'bg-slate-300'
            : 'bg-gradient-to-r from-teal-600 to-emerald-600 hover:from-teal-700 hover:to-emerald-700'
        )}
      >
        <span className="hidden sm:inline">Next</span>
        <ArrowRight className="h-4 w-4" />
      </button>
    </footer>
  );
}