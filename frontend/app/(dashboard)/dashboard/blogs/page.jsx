'use client';

import { useEffect, useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { Plus, Search, Pencil, Trash2, Star, FileText, Eye } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';
import AuthGuard from '@/components/shared/AuthGuard';
import PageHeader from '@/components/dashboard/ui/PageHeader';
import LoadingState from '@/components/dashboard/ui/LoadingState';
import EmptyState from '@/components/dashboard/ui/EmptyState';
import ConfirmDialog from '@/components/dashboard/ui/ConfirmDialog';
import { blogService } from '@/services/blogService';
import { parseImageSrc, extractList } from '@/lib/blog-utils';
import { BLOG_STATUS } from '@/lib/status';
import { containerVariants, itemVariants } from '@/lib/motion';

const statusChip = (status) => BLOG_STATUS[status]?.chip || 'bg-slate-100 text-slate-600 border-slate-200';

function ListImage({ src, alt }) {
  const [error, setError] = useState(false);
  const imageSrc = parseImageSrc(src);

  if (!imageSrc || error) {
    return (
      <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-teal-100 to-indigo-100">
        <FileText className="h-6 w-6 text-teal-600" />
      </div>
    );
  }

  return (
    <Image
      src={imageSrc}
      alt={alt || 'Post cover'}
      fill
      sizes="56px"
      className="object-cover"
      onError={() => setError(true)}
    />
  );
}

function AdminBlogsPage() {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [deletingId, setDeletingId] = useState(null);
  const [confirmDelete, setConfirmDelete] = useState(null);

  const fetchBlogs = useCallback(() => {
    blogService
      .adminGetAll({ search })
      .then((res) => setBlogs(extractList(res.data)))
      .catch(() => toast.error('Failed to load blog posts'))
      .finally(() => setLoading(false));
  }, [search]);

  useEffect(() => {
    fetchBlogs();
  }, [fetchBlogs]);

  const handleDelete = async (id) => {
    setDeletingId(id);
    try {
      await blogService.adminDelete(id);
      setBlogs((prev) => prev.filter((b) => b.id !== id));
      toast.success('Blog post deleted');
      setConfirmDelete(null);
    } catch {
      toast.error('Failed to delete blog post');
      setConfirmDelete(null);
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <AuthGuard allowedRoles={['admin']}>
      <motion.div variants={containerVariants} initial="hidden" animate="show" className="space-y-6">
        <PageHeader
          badge="Content Studio"
          badgeIcon={FileText}
          title="Blog Management"
          subtitle={`${blogs.length} posts`}
          actions={
            <Link href="/dashboard/blogs/create">
              <Button className="dash-cta">
                <Plus className="h-4 w-4" /> New Post
              </Button>
            </Link>
          }
        />

        <motion.div variants={itemVariants}>
          <div className="relative">
            <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <Input
              placeholder="Search posts by title or status..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="h-12 rounded-xl border-slate-200/60 bg-white/80 pl-10 shadow-sm focus-visible:border-teal-500 focus-visible:ring-teal-500/20"
            />
          </div>
        </motion.div>

        {loading ? (
          <LoadingState label="Loading posts..." />
        ) : blogs.length > 0 ? (
          <div className="space-y-3">
            {blogs.map((blog) => (
              <motion.div key={blog.id} variants={itemVariants}>
                <Card className="group dash-card dash-card-hover relative overflow-hidden">
                  <div className="dash-accent" />
                  <CardContent className="flex items-center gap-4 p-4">
                    <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-xl">
                      <ListImage src={blog.featured_image} alt={blog.title} />
                    </div>

                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        <p className="truncate font-bold text-slate-800">{blog.title}</p>
                        {blog.is_featured && (
                          <Star className="h-3.5 w-3.5 shrink-0 fill-yellow-500 text-yellow-500" />
                        )}
                      </div>
                      <div className="mt-1 flex flex-wrap items-center gap-3">
                        <span
                          className={`rounded-full border px-2 py-0.5 text-xs font-medium capitalize ${statusChip(blog.status)}`}
                        >
                          {blog.status}
                        </span>
                        {blog.category && <span className="text-xs text-slate-400">{blog.category.name}</span>}
                        <span className="text-xs text-slate-400">{blog.read_time} min read</span>
                        <span className="text-xs text-slate-400">{blog.views} views</span>
                      </div>
                    </div>

                    <div className="flex shrink-0 items-center gap-2">
                      <Link
                        href={`/blog/${blog.slug}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label="View post"
                        className="flex h-9 w-9 items-center justify-center rounded-lg text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-700"
                      >
                        <Eye className="h-4 w-4" />
                      </Link>
                      <Link
                        href={`/dashboard/blogs/${blog.id}/edit`}
                        aria-label="Edit post"
                        className="flex h-9 w-9 items-center justify-center rounded-lg text-slate-400 transition-colors hover:bg-teal-50 hover:text-teal-600"
                      >
                        <Pencil className="h-4 w-4" />
                      </Link>
                      <Button
                        size="sm"
                        variant="ghost"
                        className="h-9 w-9 p-0 text-slate-400 hover:bg-rose-50 hover:text-rose-500"
                        onClick={() => setConfirmDelete(blog)}
                        disabled={deletingId === blog.id}
                        aria-label="Delete post"
                      >
                        {deletingId === blog.id ? (
                          <Trash2 className="h-4 w-4 animate-pulse text-rose-500" />
                        ) : (
                          <Trash2 className="h-4 w-4" />
                        )}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        ) : (
          <EmptyState
            icon={FileText}
            title="No blog posts yet"
            description="Write your first article to start sharing wellness insights with your audience."
            action={
              <Link href="/dashboard/blogs/create">
                <Button className="dash-cta">
                  <Plus className="h-4 w-4" /> Write a Post
                </Button>
              </Link>
            }
          />
        )}

        <ConfirmDialog
          open={!!confirmDelete}
          onOpenChange={(open) => !open && setConfirmDelete(null)}
          title="Delete this blog post?"
          description={`"${confirmDelete?.title || ''}" will be permanently removed.`}
          confirmLabel="Delete"
          onConfirm={() => handleDelete(confirmDelete.id)}
          loading={deletingId === confirmDelete?.id}
        />
      </motion.div>
    </AuthGuard>
  );
}

export default AdminBlogsPage;
