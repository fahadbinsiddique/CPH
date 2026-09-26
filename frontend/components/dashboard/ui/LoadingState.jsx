'use client';

import { Loader2 } from 'lucide-react';

export default function LoadingState({ label = 'Loading...' }) {
  return (
    <div 
      className="flex flex-col items-center justify-center space-y-4 py-16 sm:py-24 lg:py-40" 
      role="status" 
      aria-live="polite"
      aria-label={label}
    >
      <div className="relative" aria-hidden="true">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
        <div className="absolute inset-0 h-12 w-12 animate-ping rounded-full border-2 border-primary/30 opacity-20" />
      </div>
      <p className="text-sm font-medium tracking-wide text-muted-foreground">{label}</p>
    </div>
  );
}