'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Card, CardContent } from '@/components/ui/card';
import { statVariants } from '@/lib/motion';

export default function StatCard({
  icon: Icon,
  label,
  value,
  iconClassName = 'bg-primary/10 text-primary',
  description,
  trend,
  href,
  progress = 0.33,
}) {
  const content = (
    <Card variant="raised" className="group relative h-full overflow-hidden">
      <div className="dash-accent" />
      <CardContent className="relative z-10 p-4 sm:p-6">
        <div className="flex items-start justify-between gap-2">
          <div
            className={cn(
              'flex h-11 w-11 shrink-0 items-center justify-center rounded-xl shadow-neu-inset transition-transform duration-200 group-hover:scale-105 sm:h-14 sm:w-14',
              iconClassName
            )}
          >
            <Icon className="h-5 w-5 sm:h-6 sm:w-6" />
          </div>
          <div className="flex flex-col items-end gap-1">
            {typeof trend === 'number' && (
              <span
                className={cn(
                  'inline-flex items-center rounded-full border px-2 py-0.5 text-[10px] font-semibold',
                  trend >= 0
                    ? 'border-accent/30 bg-accent/10 text-accent-soft-foreground'
                    : 'border-destructive/30 bg-destructive/10 text-destructive'
                )}
              >
                {trend >= 0 ? '↑' : '↓'} {Math.abs(trend)}%
              </span>
            )}
            {description && (
              <span className="hidden max-w-full truncate rounded-full border border-border bg-card px-2 py-0.5 text-[10px] text-muted-foreground sm:inline-flex">
                {description}
              </span>
            )}
          </div>
        </div>
        <div className="mt-4">
          <p className="font-heading text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">{value ?? '—'}</p>
          <p className="mt-0.5 text-[10px] font-semibold tracking-wider text-muted-foreground uppercase sm:text-[11px]">
            {label}
          </p>
        </div>
        <div className="mt-3 h-1 w-full overflow-hidden rounded-full bg-muted">
          <div
            className="h-full rounded-full bg-gradient-to-r from-primary to-accent transition-all duration-1000"
            style={{ width: `${progress * 100}%` }}
          />
        </div>
        {href && (
          <div className="mt-3 flex justify-end">
            <span className="inline-flex h-9 cursor-pointer items-center gap-0.5 rounded-lg px-2 text-[10px] font-medium text-muted-foreground transition-colors hover:bg-primary/10 hover:text-foreground sm:h-7">
              View Details
              <ChevronRight className="h-3 w-3" />
            </span>
          </div>
        )}
      </CardContent>
    </Card>
  );

  if (href) {
    return (
      <motion.div variants={statVariants} whileHover={{ y: -4 }} className="h-full">
        <Link href={href} className="block h-full">
          {content}
        </Link>
      </motion.div>
    );
  }

  return (
    <motion.div variants={statVariants} whileHover={{ y: -4 }} className="h-full">
      {content}
    </motion.div>
  );
}