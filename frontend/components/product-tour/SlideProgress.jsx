'use client';

import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { ACCENTS } from './slideDefs';

export default function SlideProgress({ index, total, accent = 'teal' }) {
  const a = ACCENTS[accent] || ACCENTS.teal;
  const pct = ((index + 1) / total) * 100;

  return (
    <div className="shrink-0 px-4 sm:px-6">
      <div className="h-1.5 w-full overflow-hidden rounded-full bg-slate-200/70">
        <motion.div
          className={cn('h-full rounded-full bg-gradient-to-r', a.grad)}
          initial={false}
          animate={{ width: `${pct}%` }}
          transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
        />
      </div>
    </div>
  );
}