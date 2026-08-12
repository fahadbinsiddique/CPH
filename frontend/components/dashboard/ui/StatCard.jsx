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
  iconClassName = 'bg-gradient-to-br from-teal-100 to-emerald-100 text-teal-700',
  gradient = 'from-teal-50/20 to-emerald-50/20',
  description,
  trend,
  href,
}) {
  const content = (
    <Card className="group dash-card dash-card-hover relative h-full overflow-hidden">
      <div
        className={cn(
          'absolute inset-0 bg-gradient-to-br opacity-0 transition-opacity duration-700 group-hover:opacity-100',
          gradient
        )}
      />
      <div className="dash-accent" />
      <CardContent className="relative z-10 p-6">
        <div className="flex items-start justify-between">
          <div
            className={cn(
              'flex h-14 w-14 items-center justify-center rounded-2xl shadow-sm transition-transform duration-300 group-hover:scale-110',
              iconClassName
            )}
          >
            <Icon className="h-6 w-6" />
          </div>
          <div className="flex flex-col items-end gap-1">
            {typeof trend === 'number' && (
              <span
                className={cn(
                  'inline-flex items-center rounded-full border px-2 py-0.5 text-[10px] font-semibold',
                  trend >= 0
                    ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                    : 'bg-rose-50 text-rose-700 border-rose-200'
                )}
              >
                {trend >= 0 ? '↑' : '↓'} {Math.abs(trend)}%
              </span>
            )}
            {description && (
              <span className="inline-flex items-center rounded-full border border-slate-200 bg-white/50 px-2 py-0.5 text-[10px] text-slate-500">
                {description}
              </span>
            )}
          </div>
        </div>
        <div className="mt-4">
          <p className="text-3xl font-bold tracking-tight text-slate-900">{value ?? '—'}</p>
          <p className="mt-0.5 text-xs font-semibold tracking-wider text-slate-400 uppercase">{label}</p>
        </div>
        <div className="mt-3 h-0.5 w-full overflow-hidden rounded-full bg-slate-100">
          <div
            className={cn(
              'h-full w-1/3 rounded-full bg-gradient-to-r transition-all duration-1000 group-hover:w-full',
              'bg-gradient-to-r from-teal-400 to-emerald-400'
            )}
          />
        </div>
        {href && (
          <div className="mt-3 flex justify-end">
            <span className="inline-flex h-7 items-center gap-0.5 rounded-xl px-2 text-[10px] font-medium text-slate-400 transition-colors hover:bg-teal-50/80 hover:text-teal-600">
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