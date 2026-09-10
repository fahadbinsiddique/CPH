'use client';

import { motion } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { itemVariants } from '@/lib/motion';

export default function EmptyState({ icon: Icon, title, description, action, className = '' }) {
  return (
    <motion.div variants={itemVariants}>
      <Card variant="bordered" className={`border-dashed border-stone-200/80 bg-white/50 shadow-inner backdrop-blur-sm ${className}`}>
        <CardContent className="mx-auto flex max-w-sm flex-col items-center p-6 text-center sm:p-8 lg:p-12">
          {Icon && (
            <div className="mb-5 flex h-20 w-20 items-center justify-center rounded-full border border-stone-200/60 bg-gradient-to-br from-stone-100 to-stone-50 text-stone-300">
              <Icon className="h-10 w-10" />
            </div>
          )}
          <h3 className="mb-1 text-xl font-bold tracking-tight text-stone-800">{title}</h3>
          {description && <p className="mb-6 max-w-xs text-sm text-stone-400">{description}</p>}
          {action}
        </CardContent>
      </Card>
    </motion.div>
  );
}