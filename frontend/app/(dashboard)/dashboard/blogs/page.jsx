'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Plus, Search, Pencil, Trash2, Star, FileText } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { toast } from 'sonner';
import AuthGuard from '@/components/shared/AuthGuard';
import PageHeader from '@/components/dashboard/ui/PageHeader';
import LoadingState from '@/components/dashboard/ui/LoadingState';
import EmptyState from '@/components/dashboard/ui/EmptyState';
import ConfirmDialog from '@/components/dashboard/ui/ConfirmDialog';
import { blogService } from '@/services/blogService';
import Image from 'next/image';
import { BLOG_STATUS } from '@/lib/status';
import { containerVariants, itemVariants } from '@/lib/motion';

const EMPTY_FORM = {
  title: '',
  excerpt: '',
  content: '',
  status: 'draft',
  is_featured: false,
  category: '',
  featured_image: null,
};

export default function AdminBlogsPage() {
  const [blogs, setBlogs] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [editingBlog, setEditingBlog] = useState(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState(null);
  const [confirmDelete, setConfirmDelete] = useState(null);
  const [error, setError] = useState('');

  const fetchBlogs = () => {
    blogService
      .adminGetAll({ search })
      .then((res) => setBlogs(res.data.results || res.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchBlogs();
  }, [search]);

  useEffect(() => {
    blogService
      .getCategories()
      .then((res) => setCategories(res.data))
      .catch(console.error);
  }, []);

  const openCreate = () => {
    setEditingBlog(null);
    setForm(EMPTY_FORM);
    setError('');
    setModalOpen(true);
  };

  const openEdit = (blog) => {
    setEditingBlog(blog);
    setForm({
      title: blog.title,
      excerpt: blog.excerpt || '',
      content: blog.content || '',
      status: blog.status,
      is_featured: blog.is_featured,
      category: blog.category ? String(blog.category.id) : '',
      featured_image: null,
    });
    setError('');
    setModalOpen(true);
  };

  const handleSave = async () => {
    if (!form.title.trim() || !form.content.trim()) {
      setError('Title and content are required.');
      return;
    }

    setSaving(true);
    setError('');

    try {
      const fd = new FormData();
      Object.entries(form).forEach(([key, val]) => {
        if (key === 'featured_image' && val) {
          fd.append(key, val);
        } else if (key !== 'featured_image') {
          fd.append(key, val);
        }
      });

      if (editingBlog) {
        await blogService.adminUpdate(editingBlog.id, fd);
        toast.success('Blog post updated');
      } else {
        await blogService.adminCreate(fd);
        toast.success('Blog post created');
      }

      setModalOpen(false);
      fetchBlogs();
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to save blog.');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    setDeletingId(id);
    try {
      await blogService.adminDelete(id);
      setBlogs((prev) => prev.filter((b) => b.id !== id));
      toast.success('Blog post deleted');
      setConfirmDelete(null);
    } catch {
      console.error('Delete failed');
      toast.error('Failed to delete blog post');
      setConfirmDelete(null);
    } finally {
      setDeletingId(null);
    }
  };

  const statusChip = (status) => {
    const config = BLOG_STATUS[status];
    return config?.chip || 'bg-slate-100 text-slate-600 border-slate-200';
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="show"
      className="space-y-6"
    >
      <PageHeader
        badge="Content Studio"
        badgeIcon={FileText}
        title="Blog Management"
        subtitle={`${blogs.length} total posts`}
        actions={
          <Button onClick={openCreate} className="dash-cta">
            <Plus className="h-4 w-4" /> New Post
          </Button>
        }
      />

      <motion.div variants={itemVariants}>
        <div className="relative">
          <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <Input
            placeholder="Search posts..."
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
                  <div className="flex h-14 w-14 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-gradient-to-br from-teal-100 to-indigo-100 text-2xl">
                    {blog.featured_image ? (
                      <Image
                        src={blog.featured_image}
                        alt=""
                        width={0}
                        height={0}
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <FileText className="h-6 w-6 text-teal-600" />
                    )}
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
                        className={`rounded-full border px-2 py-0.5 text-xs font-medium ${statusChip(blog.status)}`}
                      >
                        {blog.status}
                      </span>
                      {blog.category && <span className="text-xs text-slate-400">{blog.category.name}</span>}
                      <span className="text-xs text-slate-400">{blog.read_time} min read</span>
                      <span className="text-xs text-slate-400">{blog.views} views</span>
                    </div>
                  </div>

                  <div className="flex shrink-0 items-center gap-2">
                    <Button
                      size="sm"
                      variant="ghost"
                      className="h-8 w-8 p-0 text-slate-400 hover:bg-teal-50 hover:text-teal-600"
                      onClick={() => openEdit(blog)}
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      className="h-8 w-8 p-0 text-slate-400 hover:bg-rose-50 hover:text-rose-500"
                      onClick={() => setConfirmDelete(blog)}
                      disabled={deletingId === blog.id}
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
            <Button onClick={openCreate} className="dash-cta">
              <Plus className="h-4 w-4" /> Write a Post
            </Button>
          }
        />
      )}

      <Dialog open={modalOpen} onOpenChange={setModalOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editingBlog ? 'Edit Post' : 'New Post'}</DialogTitle>
          </DialogHeader>

          <div className="space-y-4 py-2">
            <div className="space-y-1.5">
              <Label className="text-sm font-medium text-slate-700">Title *</Label>
              <Input
                placeholder="Post title..."
                value={form.title}
                onChange={(e) => setForm((p) => ({ ...p, title: e.target.value }))}
                className="h-11 rounded-xl border-slate-200 shadow-sm focus-visible:border-teal-500 focus-visible:ring-teal-500/20"
              />
            </div>

            <div className="space-y-1.5">
              <Label className="text-sm font-medium text-slate-700">Excerpt</Label>
              <Textarea
                placeholder="Short description..."
                value={form.excerpt}
                onChange={(e) => setForm((p) => ({ ...p, excerpt: e.target.value }))}
                rows={2}
                className="rounded-xl border-slate-200 shadow-sm resize-none focus-visible:border-teal-500 focus-visible:ring-teal-500/20"
              />
            </div>

            <div className="space-y-1.5">
              <Label className="text-sm font-medium text-slate-700">Content *</Label>
              <Textarea
                placeholder="Write your article..."
                value={form.content}
                onChange={(e) => setForm((p) => ({ ...p, content: e.target.value }))}
                rows={10}
                className="rounded-xl border-slate-200 font-mono text-sm shadow-sm resize-none focus-visible:border-teal-500 focus-visible:ring-teal-500/20"
              />
            </div>

            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <div className="space-y-1.5">
                <Label className="text-sm font-medium text-slate-700">Category</Label>
                <Select
                  value={form.category}
                  onValueChange={(category) => setForm((p) => ({ ...p, category }))}
                >
                  <SelectTrigger className="h-11 rounded-xl border-slate-200 bg-white shadow-sm">
                    <SelectValue placeholder="No category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">No category</SelectItem>
                    {categories.map((cat) => (
                      <SelectItem key={cat.id} value={String(cat.id)}>
                        {cat.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-1.5">
                <Label className="text-sm font-medium text-slate-700">Status</Label>
                <Select
                  value={form.status}
                  onValueChange={(status) => setForm((p) => ({ ...p, status }))}
                >
                  <SelectTrigger className="h-11 rounded-xl border-slate-200 bg-white shadow-sm">
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="draft">Draft</SelectItem>
                    <SelectItem value="published">Published</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-1.5">
              <Label className="text-sm font-medium text-slate-700">Featured Image</Label>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => setForm((p) => ({ ...p, featured_image: e.target.files[0] }))}
                className="w-full text-sm text-slate-500 file:mr-3 file:rounded-lg file:border-0 file:bg-teal-50 file:px-4 file:py-2 file:text-sm file:font-medium file:text-teal-600 hover:file:bg-teal-100"
              />
            </div>

            <div className="flex items-center gap-3">
              <input
                type="checkbox"
                id="featured"
                checked={form.is_featured}
                onChange={(e) => setForm((p) => ({ ...p, is_featured: e.target.checked }))}
                className="h-4 w-4 accent-teal-600"
              />
              <Label htmlFor="featured" className="cursor-pointer text-sm font-medium text-slate-700">
                Mark as featured post
              </Label>
            </div>

            {error && (
              <p className="rounded-lg bg-rose-50 px-3 py-2 text-sm text-rose-600">{error}</p>
            )}
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setModalOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSave} disabled={saving} className="dash-cta">
              {saving
                ? 'Saving...'
                : editingBlog
                  ? 'Update Post'
                  : 'Publish Post'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

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
  );
}