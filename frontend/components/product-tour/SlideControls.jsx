'use client';

import { Heart, LayoutGrid, Maximize2, Minimize2, X } from 'lucide-react';
import { cn } from '@/lib/utils';

function ControlButton({ label, hint, active, onClick, children }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      title={hint || label}
      className={cn(
        'inline-flex h-9 items-center gap-1.5 rounded-xl border border-slate-200/70 bg-white/80 px-3 text-xs font-semibold text-slate-600 shadow-sm transition-all duration-200 hover:border-teal-300 hover:bg-teal-50 hover:text-teal-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-500 focus-visible:ring-offset-1',
        active && 'border-teal-300 bg-teal-50 text-teal-700'
      )}
    >
      {children}
      <span className="hidden sm:inline">{label}</span>
    </button>
  );
}

export default function SlideControls({ isFullscreen, onToggleFullscreen, onOpenOverview, onExit }) {
  return (
    <header className="relative z-20 flex shrink-0 items-center gap-3 border-b border-slate-200/50 bg-white/70 px-4 py-3 backdrop-blur-md sm:px-6">
      <div className="flex min-w-0 items-center gap-2.5">
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-gradient-to-r from-teal-600 to-emerald-600 shadow-md shadow-teal-600/20">
          <Heart className="h-[18px] w-[18px] text-white" />
        </div>
        <div className="min-w-0 leading-tight">
          <p className="truncate text-sm font-bold text-slate-900">Center for Psychology Health</p>
          <p className="text-[10px] font-semibold uppercase tracking-wider text-teal-600">Interactive Product Tour</p>
        </div>
      </div>

      <div className="ml-auto flex items-center gap-1.5 sm:gap-2">
        <ControlButton label="Overview" onClick={onOpenOverview}>
          <LayoutGrid className="h-4 w-4" />
        </ControlButton>
        <ControlButton
          label={isFullscreen ? 'Exit Fullscreen' : 'Fullscreen'}
          hint={isFullscreen ? 'Exit fullscreen (Esc)' : 'Fullscreen (F)'}
          active={isFullscreen}
          onClick={onToggleFullscreen}
        >
          {isFullscreen ? <Minimize2 className="h-4 w-4" /> : <Maximize2 className="h-4 w-4" />}
        </ControlButton>
        <ControlButton label="Exit Tour" hint="Exit tour" onClick={onExit}>
          <X className="h-4 w-4" />
        </ControlButton>
      </div>
    </header>
  );
}