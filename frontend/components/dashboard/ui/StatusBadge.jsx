'use client';

import { Badge } from '@/components/ui/badge';
import { getStatusConfig } from '@/lib/status';
import { cn } from '@/lib/utils';

export default function StatusBadge({ status, config, className }) {
  const item = getStatusConfig(status, config);
  const Icon = item.icon;
  return (
    <Badge
      className={cn(
        'inline-flex items-center gap-1.5 rounded-xl border px-2.5 py-1 text-[10px] font-semibold',
        item.chip,
        className
      )}
    >
      {Icon && <Icon className="h-3 w-3" />}
      {item.label}
    </Badge>
  );
}