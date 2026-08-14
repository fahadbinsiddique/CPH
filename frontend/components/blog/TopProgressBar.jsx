'use client';

import { AnimatePresence, motion } from 'framer-motion';

/**
 * Fixed top progress bar shown during submissions.
 * - `progress` number 0-100 renders a determinate bar.
 * - `progress` null renders an indeterminate sliding bar.
 * - Hidden entirely when `active` is false.
 */
export default function TopProgressBar({ active, progress }) {
  return (
    <AnimatePresence>
      {active && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-x-0 top-0 z-[99] h-1 overflow-hidden bg-slate-100"
          aria-hidden="true"
        >
          <motion.div
            className="h-full bg-gradient-to-r from-teal-500 via-emerald-500 to-teal-500"
            style={progress !== null ? { width: `${Math.max(0, Math.min(100, progress))}%` } : { width: '35%' }}
            animate={
              progress === null
                ? { x: ['-100%', '300%'] }
                : { x: 0 }
            }
            transition={
              progress === null
                ? { repeat: Infinity, duration: 1.2, ease: 'easeInOut' }
                : { duration: 0.3, ease: 'easeOut' }
            }
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
}
