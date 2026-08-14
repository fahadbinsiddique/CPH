'use client';

import { motion } from 'framer-motion';
import { SearchX, RotateCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function BlogEmptyState({ onReset }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col items-center justify-center px-6 py-20 text-center"
    >
      <div className="mb-5 flex h-20 w-20 items-center justify-center rounded-full bg-slate-100">
        <SearchX className="h-10 w-10 text-slate-300" />
      </div>
      <h3 className="text-lg font-bold text-slate-800">No articles found</h3>
      <p className="mt-2 max-w-sm text-sm text-slate-400">
        We couldn&apos;t find any posts matching your search. Try a different keyword or browse all articles.
      </p>
      {onReset && (
        <Button variant="outline" onClick={onReset} className="mt-6 gap-2">
          <RotateCcw className="h-4 w-4" />
          Clear filters
        </Button>
      )}
    </motion.div>
  );
}
