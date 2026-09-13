'use client';

import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { isValidElement, createElement } from 'react';

export default function PageHeader({ badge, badgeIcon: BadgeIcon, title, subtitle, actions, eyebrow }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      className="relative overflow-hidden rounded-2xl border border-stone-200/60 bg-white/80 p-6 shadow-sm backdrop-blur-sm"
    >
      <div className="relative flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="space-y-1">
          {eyebrow && <p className="text-xs font-semibold tracking-wider text-teal-600 uppercase">{eyebrow}</p>}
          <div className="flex flex-wrap items-center gap-2">
            {badge && (
              <span
                className={cn(
                  'inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-semibold',
                  'bg-teal-50 text-teal-700 border-teal-200/60'
                )}
              >
                {isValidElement(BadgeIcon) ? BadgeIcon : BadgeIcon ? createElement(BadgeIcon, { className: 'h-3.5 w-3.5' }) : null}
                {badge}
              </span>
            )}
            {title && (
              <h1 className="text-2xl font-bold tracking-tight text-stone-900 sm:text-3xl">{title}</h1>
            )}
          </div>
          {subtitle && <p className="max-w-2xl text-sm font-medium text-stone-500">{subtitle}</p>}
        </div>
        {actions && <div className="flex shrink-0 items-center gap-2">{actions}</div>}
      </div>
    </motion.div>
  );
}