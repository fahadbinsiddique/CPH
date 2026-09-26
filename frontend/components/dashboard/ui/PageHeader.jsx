'use client';

import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { isValidElement, createElement } from 'react';
import { useReducedMotion } from '@/hooks/useReducedMotion';
import { fadeInUp } from '@/lib/motion';

export default function PageHeader({ badge, badgeIcon: BadgeIcon, title, subtitle, actions, eyebrow }) {
  const reduceMotion = useReducedMotion();
  const motionProps = reduceMotion ? {} : { 
    initial: fadeInUp.hidden, 
    animate: fadeInUp.show 
  };

  return (
    <motion.div
      {...motionProps}
      className="relative overflow-hidden rounded-xl bg-card p-4 shadow-neu sm:p-6"
    >
      <div className="relative flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="min-w-0 space-y-1">
          {eyebrow && <p className="text-xs font-semibold tracking-wider text-foreground/80 uppercase">{eyebrow}</p>}
          <div className="flex flex-wrap items-center gap-2">
            {badge && (
              <span
                className={cn(
                  'inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-semibold',
                  'border-primary/25 bg-primary/10 text-foreground'
                )}
              >
                {BadgeIcon ? (
                  <span className="inline-flex text-primary" aria-hidden="true">
                    {isValidElement(BadgeIcon) ? BadgeIcon : createElement(BadgeIcon, { className: 'h-3.5 w-3.5' })}
                  </span>
                ) : null}
                {badge}
              </span>
            )}
            {title && (
              <h1 className="font-heading text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">{title}</h1>
            )}
          </div>
          {subtitle && <p className="max-w-2xl text-sm text-muted-foreground">{subtitle}</p>}
        </div>
        {actions && <div className="flex w-full shrink-0 flex-wrap items-center gap-2 sm:w-auto">{actions}</div>}
      </div>
    </motion.div>
  );
}