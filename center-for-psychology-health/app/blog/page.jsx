'use client';

import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Tag, Loader2, BookOpen } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import BlogCard from '@/components/shared/BlogCard';
import { blogService } from '@/services/blogService';
import { useDebounce } from '@/hooks/useDebounce';

export default function BlogListPage() {
  const [blogs, setBlogs] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');

  const debouncedSearch = useDebounce(search, 400);

  const fetchBlogs = useCallback(async () => {
    setLoading(true);
    try {
      const params = {};
      if (debouncedSearch) params.search = debouncedSearch;
      if (selectedCategory) params['category__slug'] = selectedCategory;
      const res = await blogService.getAll(params);
      setBlogs(res.data.results || res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [debouncedSearch, selectedCategory]);

  // eslint-disable-next-line react-hooks/set-state-in-effect
  useEffect(() => { fetchBlogs(); }, [fetchBlogs]);

  useEffect(() => {
    blogService.getCategories()
      .then(res => setCategories(res.data))
      .catch(console.error);
  }, []);

  const featured = blogs.filter(b => b.is_featured);
  const regular = blogs.filter(b => !b.is_featured);

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <div className="bg-white border-b border-slate-100">
        <div className="max-w-5xl mx-auto px-4 py-12 text-center">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className="w-12 h-12 bg-blue-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <BookOpen className="w-6 h-6 text-blue-600" />
            </div>
            <h1 className="text-3xl font-bold text-slate-800 mb-2">Blog</h1>
            <p className="text-slate-400">
              Mental health insights, tips and research
            </p>
          </motion.div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 py-8">
        {/* Search & Filter */}
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-4 mb-8">
          <div className="relative mb-3">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <Input
              placeholder="Search articles..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="pl-9 h-10"
            />
          </div>

          {categories.length > 0 && (
            <div className="flex flex-wrap gap-2">
              <Badge
                variant={!selectedCategory ? 'default' : 'outline'}
                className="cursor-pointer"
                onClick={() => setSelectedCategory('')}
              >
                All
              </Badge>
              {categories.map(cat => (
                <Badge
                  key={cat.slug}
                  variant={selectedCategory === cat.slug ? 'default' : 'outline'}
                  className="cursor-pointer"
                  onClick={() => setSelectedCategory(
                    selectedCategory === cat.slug ? '' : cat.slug
                  )}
                >
                  {cat.name}
                  <span className="ml-1 text-xs opacity-60">({cat.blog_count})</span>
                </Badge>
              ))}
            </div>
          )}
        </div>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="bg-white rounded-2xl p-4 border border-slate-100">
                <Skeleton className="h-44 w-full rounded-xl mb-4" />
                <Skeleton className="h-4 w-3/4 mb-2" />
                <Skeleton className="h-3 w-full mb-1" />
                <Skeleton className="h-3 w-2/3" />
              </div>
            ))}
          </div>
        ) : (
          <>
            {/* Featured */}
            {featured.length > 0 && !search && !selectedCategory && (
              <div className="mb-8">
                <h2 className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-4">
                  Featured
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  {featured.slice(0, 2).map((blog, i) => (
                    <motion.div
                      key={blog.id}
                      initial={{ opacity: 0, y: 16 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.05 }}
                    >
                      <BlogCard blog={blog} featured />
                    </motion.div>
                  ))}
                </div>
              </div>
            )}

            {/* All posts */}
            <div>
              {(search || selectedCategory) ? null : (
                <h2 className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-4">
                  Latest Articles
                </h2>
              )}

              {blogs.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                  <AnimatePresence>
                    {(search || selectedCategory ? blogs : regular).map((blog, i) => (
                      <motion.div
                        key={blog.id}
                        initial={{ opacity: 0, y: 16 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0 }}
                        transition={{ delay: i * 0.04 }}
                      >
                        <BlogCard blog={blog} />
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </div>
              ) : (
                <div className="text-center py-16 text-slate-400">
                  No articles found
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}