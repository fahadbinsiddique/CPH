'use client';

import { Fragment, useMemo, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { CheckCircle2, Search, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { ACCENTS } from './slideDefs';

const pad = (n) => String(n).padStart(2, '0');

function SlideThumb({ slide, active, onClick }) {
  const a = ACCENTS[slide.accent] || ACCENTS.teal;
  const Icon = slide.icon;
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={`Jump to slide ${slide.index}: ${slide.title}`}
      className={cn(
        'group flex flex-col items-start gap-2.5 rounded-2xl border bg-white p-3 text-left transition-all duration-200 hover:-translate-y-0.5 hover:border-teal-300 hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-500',
        active ? 'border-teal-400 ring-1 ring-teal-300' : 'border-slate-200/70'
      )}
    >
      <div className={cn('relative h-16 w-full overflow-hidden rounded-xl bg-gradient-to-br', a.grad, 'opacity-90')}>
        <div className="absolute inset-0 flex items-center justify-center">
          <Icon className="h-6 w-6 text-white/90" />
        </div>
        <span className="absolute left-1.5 top-1.5 rounded-md bg-black/20 px-1.5 py-0.5 text-[10px] font-bold tabular-nums text-white">
          {pad(slide.index)}
        </span>
        {active && (
          <span className="absolute right-1.5 top-1.5 rounded-full bg-white/95 text-teal-700">
            <CheckCircle2 className="h-4 w-4" />
          </span>
        )}
      </div>
      <div className="min-w-0">
        <p className="truncate text-xs font-bold text-slate-800">{slide.title}</p>
        <p className="truncate text-[10px] font-medium uppercase tracking-wider text-slate-400">{slide.section}</p>
      </div>
    </button>
  );
}

export default function SlideOverview({ open, onClose, slides, current, onSelect }) {
  const [query, setQuery] = useState('');

  const groups = useMemo(() => {
    const filtered = slides.filter(
      (s) =>
        !query ||
        s.title.toLowerCase().includes(query.toLowerCase()) ||
        s.section.toLowerCase().includes(query.toLowerCase())
    );
    const map = new Map();
    filtered.forEach((s) => {
      if (!map.has(s.section)) map.set(s.section, []);
      map.get(s.section).push(s);
    });
    return [...map.entries()];
  }, [slides, query]);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="absolute inset-0 z-30 bg-stone-900/40 backdrop-blur-sm"
          onClick={onClose}
        >
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 24 }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            onClick={(e) => e.stopPropagation()}
            className="absolute inset-x-2 top-16 bottom-2 flex max-h-full flex-col overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-2xl sm:inset-x-8 lg:inset-x-auto lg:left-1/2 lg:top-12 lg:bottom-8 lg:w-full lg:max-w-4xl lg:-translate-x-1/2"
          >
            <div className="flex shrink-0 items-center gap-3 border-b border-slate-100 px-5 py-4">
              <div>
                <h3 className="text-base font-bold text-slate-900">Slide Overview</h3>
                <p className="text-xs text-slate-400">
                  {slides.length} slides · click to jump to any section
                </p>
              </div>
              <div className="ml-auto flex items-center gap-2">
                <div className="relative hidden sm:block">
                  <Search className="absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-slate-400" />
                  <input
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="Search slides..."
                    aria-label="Search slides"
                    className="w-52 rounded-xl border border-slate-200 bg-slate-50 py-2 pl-8 pr-3 text-sm text-slate-700 outline-none focus:border-teal-300 focus:ring-2 focus:ring-teal-400/30"
                  />
                </div>
                <button
                  type="button"
                  onClick={onClose}
                  aria-label="Close overview"
                  className="flex h-9 w-9 items-center justify-center rounded-xl border border-slate-200 text-slate-500 transition-colors hover:bg-slate-50 hover:text-slate-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-500"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            </div>

            <div className="cph-scroll flex-1 overflow-y-auto px-5 py-5">
              {groups.length === 0 ? (
                <p className="py-16 text-center text-sm text-slate-400">No slides match your search.</p>
              ) : (
                groups.map(([section, items]) => (
                  <div key={section} className="mb-6 last:mb-0">
                    <p className="mb-3 text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-400">
                      {section}
                    </p>
                    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
                      {items.map((s) => (
                        <SlideThumb
                          key={s.id}
                          slide={s}
                          active={s.index - 1 === current}
                          onClick={() => onSelect(s.index - 1)}
                        />
                      ))}
                    </div>
                  </div>
                ))
              )}
            </div>

            <div className="shrink-0 border-t border-slate-100 px-5 py-3 text-center text-[11px] font-medium text-slate-400">
              Tip: use ← → arrows to navigate, Space for next, Home / End for first / last, F for fullscreen.
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}