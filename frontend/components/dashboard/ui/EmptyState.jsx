'use client';

import { motion } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { itemVariants } from '@/lib/motion';

export default function EmptyState({ icon: Icon, title, description, action, className = '' }) {
  return (
    <motion.div variants={itemVariants}>
      <Card className={`border-dashed border-slate-200 bg-white/50 shadow-inner backdrop-blur-sm ${className}`}>
        <CardContent className="mx-auto flex max-w-sm flex-col items-center p-6 text-center sm:p-8 lg:p-12">
          {Icon && (
            <div className="mb-5 flex h-20 w-20 items-center justify-center rounded-full border border-slate-200/60 bg-gradient-to-br from-slate-100 to-slate-50 text-slate-300">
              <Icon className="h-10 w-10" />
            </div>
          )}
          <h3 className="mb-1 text-xl font-bold tracking-tight text-slate-800">{title}</h3>
          {description && <p className="mb-6 max-w-xs text-sm text-slate-400">{description}</p>}
          {action}
        </CardContent>
      </Card>
    </motion.div>
  );
}