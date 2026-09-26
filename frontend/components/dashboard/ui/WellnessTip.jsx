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
      className={`flex items-center gap-3 rounded-xl border border-accent/20 bg-accent-soft p-4 shadow-neu-inset ${className}`}
      role="complementary"
      aria-label={`Wellness tip: ${title}`}
    >
      <div className="rounded-lg bg-card p-2 shadow-neu" aria-hidden="true">
        <Icon className="h-5 w-5 text-accent" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-semibold text-foreground">{title}</p>
        <p className="line-clamp-2 text-xs text-muted-foreground sm:truncate">{message}</p>
      </div>
      {typeof badgeLabel === 'string' ? (
        <Badge className="border-accent/30 bg-card/70 text-xs text-accent-soft-foreground shrink-0" aria-label={badgeLabel}>
          {badgeLabel}
        </Badge>
      ) : (
        <Badge className="border-accent/30 bg-card/70 text-xs shrink-0">{badgeLabel}</Badge>
      )}
    </div>
  );
}