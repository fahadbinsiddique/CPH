'use client'

import { motion } from 'framer-motion'

/**
 * Progress header for the quiz experience. Renders a title row, a live
 * "Q n of total" readout and a smooth progress bar. `topOffset` is the
 * measured site-header height so it stays pinned below the fixed navbar.
 */
export default function AssessmentProgress({ current, total, title, percentage, topOffset = 0 }) {
  const completed = total > 0 ? Math.min(100, Math.round(((current + 1) / total) * 100)) : 0

  return (
    <div
      role="progressbar"
      aria-valuemin={0}
      aria-valuemax={total}
      aria-valuenow={current + 1}
      aria-label={`Question ${current + 1} of ${total}`}
      className="sticky z-20 border-b border-slate-200/70 bg-white/85 backdrop-blur-md"
      style={{ top: topOffset }}
    >
      <div className="mx-auto w-full max-w-2xl px-4 sm:px-6">
        <div className="flex items-center justify-between gap-4 py-3.5">
          <p className="min-w-0 truncate font-heading text-sm font-semibold text-slate-700">
            {title}
          </p>
          <p className="flex shrink-0 items-baseline gap-1 text-sm">
            <span className="font-heading font-bold text-teal-700">{current + 1}</span>
            <span className="text-slate-400">/ {total}</span>
          </p>
        </div>
        <div className="h-1.5 overflow-hidden rounded-full bg-slate-100">
          <motion.div
            className="h-full rounded-full bg-gradient-to-r from-teal-600 to-emerald-500"
            initial={false}
            animate={{ width: `${completed}%` }}
            transition={{ duration: 0.4, ease: 'easeOut' }}
          />
        </div>
      </div>
    </div>
  )
}