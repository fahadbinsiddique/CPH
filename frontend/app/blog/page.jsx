'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowDown, Loader2, AlertTriangle, RotateCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import BlogHero from '@/components/blog/BlogHero';
import BlogCard from '@/components/shared/BlogCard';
import FeaturedBlogCard from '@/components/blog/FeaturedBlogCard';
import BlogCardSkeleton from '@/components/blog/BlogCardSkeleton';
import BlogEmptyState from '@/components/blog/BlogEmptyState';
import ErrorBoundary from '@/components/shared/ErrorBoundary';
import { blogService } from '@/services/blogService';
import { useDebounce } from '@/hooks/useDebounce';
import { extractList, toErrorMessage } from '@/lib/blog-utils';
import { toast } from 'sonner';

export default function BlogListPage() {
  const [blogs, setBlogs] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(false);
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState(() =>
    typeof window === 'undefined' ? '' : new URLSearchParams(window.location.search).get('category__slug') || ''
  );
  const [selectedTag, setSelectedTag] = useState(() =>
    typeof window === 'undefined' ? '' : new URLSearchParams(window.location.search).get('tags__slug') || ''
  );
  const [error, setError] = useState(false);
  const [reloadKey, setReloadKey] = useState(0);
  const pageRef = useRef(1);

  const debouncedSearch = useDebounce(search, 400);

  const fetchPage = useCallback(
    async (page, append) => {
      const params = { page };
      if (debouncedSearch) params.search = debouncedSearch;
      if (selectedCategory) params.category__slug = selectedCategory;
      if (selectedTag) params.tags__slug = selectedTag;
      try {
        const res = await blogService.getAll(params);
        const results = extractList(res.data);
        setBlogs((prev) => (append ? [...prev, ...results] : results));
        setHasMore(Boolean(res.data?.next));
        setError(false);
      } catch (err) {
        setError(true);
        toast.error(toErrorMessage(err));
      }
    },
    [debouncedSearch, selectedCategory, selectedTag]
  );

  const loadInitial = useCallback(async () => {
    setLoading(true);
    setLoadingMore(false);
    pageRef.current = 1;
    await fetchPage(1, false);
    setLoading(false);
  }, [fetchPage]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    loadInitial();
  }, [loadInitial, reloadKey]);

  useEffect(() => {
    blogService
      .getCategories()
      .then((res) => setCategories(extractList(res.data)))
      .catch(() => {});
  }, []);

  const loadMore = async () => {
    if (loadingMore || !hasMore) return;
    setLoadingMore(true);
    const nextPage = pageRef.current + 1;
    await fetchPage(nextPage, true);
    pageRef.current = nextPage;
    setLoadingMore(false);
  };

  const resetFilters = () => {
    setSearch('');
    setSelectedCategory('');
    setSelectedTag('');
  };

  const isFiltering = Boolean(debouncedSearch || selectedCategory || selectedTag);
  const featured = blogs.find((b) => b.is_featured);
  const gridBlogs = isFiltering ? blogs : blogs.filter((b) => !b.is_featured);

  return (
    <ErrorBoundary>
      <div className="min-h-screen bg-slate-50">
        <BlogHero
          search={search}
          onSearchChange={setSearch}
          categories={categories}
          selectedCategory={selectedCategory}
          onSelectCategory={setSelectedCategory}
        />

        <div className="mx-auto max-w-6xl px-4 py-10">
          {loading && blogs.length === 0 ? (
            <div className="space-y-10">
              <BlogCardSkeleton featured />
              <div>
                <div className="mb-4 h-4 w-32 rounded bg-slate-200 animate-pulse" />
                <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
                  {Array.from({ length: 6 }).map((_, i) => (
                    <BlogCardSkeleton key={i} />
                  ))}
                </div>
              </div>
            </div>
          ) : error && blogs.length === 0 ? (
            <div className="flex flex-col items-center justify-center px-6 py-20 text-center">
              <div className="mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-rose-50">
                <AlertTriangle className="h-8 w-8 text-rose-500" />
              </div>
              <h3 className="text-lg font-bold text-slate-800">Couldn&apos;t load articles</h3>
              <p className="mt-2 max-w-sm text-sm text-slate-400">
                Something went wrong while fetching the blog feed. Please try again.
              </p>
              <Button onClick={() => setReloadKey((k) => k + 1)} className="mt-6 gap-2">
                <RotateCcw className="h-4 w-4" /> Try Again
              </Button>
            </div>
          ) : (
            <>
              {/* Featured hero */}
              {featured && !isFiltering && (
                <motion.div
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
                  className="mb-10"
                >
                  <FeaturedBlogCard blog={featured} />
                </motion.div>
              )}

              {/* Grid */}
              <div>
                <div className="mb-5 flex items-center justify-between">
                  <h2 className="text-sm font-semibold uppercase tracking-wider text-slate-500">
                    {isFiltering ? 'Search results' : 'Latest articles'}
                  </h2>
                  {isFiltering && (
                    <button
                      type="button"
                      onClick={resetFilters}
                      className="text-sm font-medium text-teal-700 transition-colors hover:text-teal-800"
                    >
                      Clear filters
                    </button>
                  )}
                </div>

                {gridBlogs.length > 0 ? (
                  <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
                    <AnimatePresence>
                      {gridBlogs.map((blog, i) => (
                        <motion.div
                          key={blog.id}
                          initial={{ opacity: 0, y: 16 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0 }}
                          transition={{ delay: Math.min(i * 0.04, 0.3) }}
                        >
                          <BlogCard blog={blog} />
                        </motion.div>
                      ))}
                    </AnimatePresence>
                  </div>
                ) : (
                  <BlogEmptyState onReset={resetFilters} />
                )}
              </div>

              {/* Load more */}
              {hasMore && (
                <div className="mt-10 flex justify-center">
                  <Button
                    variant="outline"
                    onClick={loadMore}
                    disabled={loadingMore}
                    className="gap-2 rounded-xl border-slate-200 bg-white px-8 text-slate-600 shadow-sm hover:border-teal-300 hover:text-teal-700"
                  >
                    {loadingMore ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <ArrowDown className="h-4 w-4" />
                    )}
                    {loadingMore ? 'Loading...' : 'Load more articles'}
                  </Button>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </ErrorBoundary>
  );
}
