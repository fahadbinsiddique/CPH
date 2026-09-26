'use client';

import { motion } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { itemVariants } from '@/lib/motion';
import { useReducedMotion } from '@/hooks/useReducedMotion';

export default function EmptyState({ icon: Icon, title, description, action, className = '' }) {
  const reduceMotion = useReducedMotion();
  const motionProps = reduceMotion ? {} : { variants: itemVariants };

  return (
    <motion.div {...motionProps}>
      <Card variant="bordered" className={`border-dashed border-border bg-card/60 shadow-neu-inset backdrop-blur-sm ${className}`}>
        <CardContent className="mx-auto flex max-w-sm flex-col items-center p-5 text-center sm:p-8 lg:p-12">
          {Icon && (
            <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full border border-border bg-muted text-muted-foreground/70 sm:mb-5 sm:h-20 sm:w-20" aria-hidden="true">
              <Icon className="h-8 w-8 sm:h-10 sm:w-10" />
            </div>
          )}
          <h3 className="font-heading mb-1 text-lg font-semibold tracking-tight text-foreground sm:text-xl">{title}</h3>
          {description && <p className="mb-5 max-w-xs text-sm text-muted-foreground sm:mb-6">{description}</p>}
          {action}
        </CardContent>
      </Card>
    </motion.div>
  );
}