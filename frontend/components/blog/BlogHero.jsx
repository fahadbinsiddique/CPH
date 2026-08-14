'use client';

import { motion } from 'framer-motion';
import { Search, X, BookOpen } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';

export default function BlogHero({ search, onSearchChange, categories, selectedCategory, onSelectCategory }) {
  return (
    <div className="relative overflow-hidden border-b border-slate-100 bg-gradient-to-b from-teal-50/60 via-white to-slate-50/40">
      <div className="pointer-events-none absolute inset-0" aria-hidden="true">
        <div className="absolute -left-24 -top-24 h-72 w-72 rounded-full bg-teal-100/40 blur-3xl" />
        <div className="absolute -right-24 -top-10 h-72 w-72 rounded-full bg-indigo-100/40 blur-3xl" />
      </div>

      <div className="relative mx-auto max-w-6xl px-4 py-14 sm:py-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          className="mx-auto max-w-2xl text-center"
        >
          <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-teal-600 to-emerald-600 shadow-lg shadow-teal-600/20">
            <BookOpen className="h-7 w-7 text-white" />
          </div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
            Insights for a healthier mind
          </h1>
          <p className="mx-auto mt-3 max-w-xl text-base text-slate-500">
            Expert articles, guides and mental wellness tips to support your emotional wellbeing.
          </p>
        </motion.div>

        {/* Search */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          className="mx-auto mt-8 max-w-xl"
        >
          <div className="relative">
            <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
            <Input
              value={search}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="Search articles by title, topic or keyword..."
              className="h-13 rounded-2xl border-slate-200 bg-white/90 py-4 pl-12 pr-12 text-base shadow-sm backdrop-blur-sm focus-visible:border-teal-500 focus-visible:ring-teal-500/20"
            />
            {search && (
              <button
                type="button"
                aria-label="Clear search"
                onClick={() => onSearchChange('')}
                className="absolute right-3 top-1/2 flex h-7 w-7 -translate-y-1/2 items-center justify-center rounded-full text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-600"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>

          {/* Category chips */}
          {categories.length > 0 && (
            <div className="mt-4 flex flex-wrap items-center justify-center gap-2">
              <Badge
                variant={!selectedCategory ? 'default' : 'outline'}
                className="cursor-pointer px-3 py-1.5 text-sm capitalize transition-all"
                onClick={() => onSelectCategory('')}
              >
                All
              </Badge>
              {categories.map((cat) => (
                <Badge
                  key={cat.slug}
                  variant={selectedCategory === cat.slug ? 'default' : 'outline'}
                  className="cursor-pointer px-3 py-1.5 text-sm capitalize transition-all"
                  onClick={() => onSelectCategory(selectedCategory === cat.slug ? '' : cat.slug)}
                >
                  {cat.name}
                  {typeof cat.blog_count === 'number' && (
                    <span className="ml-1 text-xs opacity-60">({cat.blog_count})</span>
                  )}
                </Badge>
              ))}
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
}
