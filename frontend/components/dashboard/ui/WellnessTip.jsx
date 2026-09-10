'use client';

import { Heart } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

export default function WellnessTip({ icon: Icon = Heart, title, message, badgeLabel = 'Daily' }) {
  return (
    <div className="flex items-center gap-3 rounded-2xl border border-teal-200/60 bg-gradient-to-r from-teal-50/80 to-emerald-50/80 p-4 backdrop-blur-sm">
      <div className="rounded-xl bg-white p-2 shadow-sm">
        <Icon className="h-5 w-5 text-teal-500" />
      </div>
      <div className="flex-1">
        <p className="text-sm font-semibold text-stone-700">{title}</p>
        <p className="text-xs text-stone-500">{message}</p>
      </div>
      {typeof badgeLabel === 'string' ? (
        <Badge className="border-teal-200 bg-white/60 text-xs text-teal-600">{badgeLabel}</Badge>
      ) : (
        <Badge className="border-teal-200 bg-white/60 text-xs">{badgeLabel}</Badge>
      )}
    </div>
  );
}