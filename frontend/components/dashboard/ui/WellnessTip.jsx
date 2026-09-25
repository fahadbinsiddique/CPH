'use client';

import { Heart } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

export default function WellnessTip({ 
  icon: Icon = Heart, 
  title, 
  message, 
  badgeLabel = 'Daily',
  className = '' 
}) {
  return (
    <div 
      className={`flex items-center gap-3 rounded-2xl border border-teal-200/60 bg-gradient-to-r from-teal-50/80 to-emerald-50/80 p-4 backdrop-blur-sm ${className}`}
      role="complementary"
      aria-label={`Wellness tip: ${title}`}
    >
      <div className="rounded-xl bg-white p-2 shadow-sm" aria-hidden="true">
        <Icon className="h-5 w-5 text-teal-500" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-semibold text-stone-700">{title}</p>
        <p className="text-xs text-stone-500 truncate">{message}</p>
      </div>
      {typeof badgeLabel === 'string' ? (
        <Badge className="border-teal-200 bg-white/60 text-xs text-teal-600 shrink-0" aria-label={badgeLabel}>
          {badgeLabel}
        </Badge>
      ) : (
        <Badge className="border-teal-200 bg-white/60 text-xs shrink-0">{badgeLabel}</Badge>
      )}
    </div>
  );
}