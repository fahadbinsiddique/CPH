'use client'

import { useEffect, useState } from 'react'
import { Plus, Search, Pencil, Trash2, Loader2, Eye, EyeOff, Star } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import AuthGuard from '@/components/shared/AuthGuard'
import { blogService } from '@/services/blogService'
import Image from 'next/image'

const STATUS_CONFIG = {
  published: { label: 'Published', color: 'bg-green-100 text-green-700' },
  draft: { label: 'Draft', color: 'bg-slate-100 text-slate-600' },
}

const EMPTY_FORM = {
  title: '',
  excerpt: '',
  content: '',
  status: 'draft',
  is_featured: false,
  category: '',
  featured_image: null,
}

export default function AdminBlogsPage() {
  const [blogs, setBlogs] = useState([])
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [modalOpen, setModalOpen] = useState(false)
  const [editingBlog, setEditingBlog] = useState(null)
  const [form, setForm] = useState(EMPTY_FORM)
  const [saving, setSaving] = useState(false)
  const [deletingId, setDeletingId] = useState(null)
  const [error, setError] = useState('')

  const fetchBlogs = () => {
    blogService
      .adminGetAll({ search })
      .then((res) => setBlogs(res.data.results || res.data))
      .catch(console.error)
      .finally(() => setLoading(false))
  }

  useEffect(() => {
    fetchBlogs()
  }, [search])

  useEffect(() => {
    blogService
      .getCategories()
      .then((res) => setCategories(res.data))
      .catch(console.error)
  }, [])

  const openCreate = () => {
    setEditingBlog(null)
    setForm(EMPTY_FORM)
    setError('')
    setModalOpen(true)
  }

  const openEdit = (blog) => {
    setEditingBlog(blog)
    setForm({
      title: blog.title,
      excerpt: blog.excerpt || '',
      content: blog.content || '',
      status: blog.status,
      is_featured: blog.is_featured,
      category: blog.category?.id || '',
      featured_image: null,
    })
    setError('')
    setModalOpen(true)
  }

  const handleSave = async () => {
    if (!form.title.trim() || !form.content.trim()) {
      setError('Title and content are required.')
      return
    }

    setSaving(true)
    setError('')

    try {
      const fd = new FormData()
      Object.entries(form).forEach(([key, val]) => {
        if (key === 'featured_image' && val) {
          fd.append(key, val)
        } else if (key !== 'featured_image') {
          fd.append(key, val)
        }
      })

      if (editingBlog) {
        await blogService.adminUpdate(editingBlog.id, fd)
      } else {
        await blogService.adminCreate(fd)
      }

      setModalOpen(false)
      fetchBlogs()
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to save blog.')
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async (id) => {
    if (!confirm('Delete this blog post?')) return
    setDeletingId(id)
    try {
      await blogService.adminDelete(id)
      setBlogs((prev) => prev.filter((b) => b.id !== id))
    } catch {
      console.error('Delete failed')
    } finally {
      setDeletingId(null)
    }
  }

  return (
    <AuthGuard allowedRoles={['admin']}>
      <div className="max-w-5xl">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-slate-800">Blog Management</h1>
            <p className="text-slate-400 text-sm">{blogs.length} total posts</p>
          </div>
          <Button onClick={openCreate} className="bg-blue-600 hover:bg-blue-700 text-white">
            <Plus className="w-4 h-4 mr-2" /> New Post
          </Button>
        </div>

        {/* Search */}
        <div className="relative mb-5">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <Input
            placeholder="Search posts..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9 h-10"
          />
        </div>

        {/* List */}
        {loading ? (
          <div className="flex justify-center py-20">
            <Loader2 className="w-7 h-7 animate-spin text-blue-600" />
          </div>
        ) : blogs.length > 0 ? (
          <div className="space-y-3">
            {blogs.map((blog) => {
              const config = STATUS_CONFIG[blog.status] || {
                label: blog.status || 'Unknown',
                color: 'bg-gray-100 text-slate-600',
              }

              return (
                <Card key={blog.id} className="border border-slate-100 shadow-sm rounded-2xl">
                  <CardContent className="p-4 flex items-center gap-4">
                    {/* Thumbnail */}
                    <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-blue-100 to-indigo-100 flex items-center justify-center flex-shrink-0 text-2xl overflow-hidden">
                      {`${blog.featured_image}` ? (
                        <Image
                          src={blog.featured_image}
                          alt=""
                          width={0}
                          height={0}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        '🧠'
                      )}
                    </div>

                    {/* Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <p className="font-medium text-slate-800 truncate">{`${blog.title}`}</p>
                        {blog.is_featured && (
                          <Star className="w-3.5 h-3.5 text-yellow-500 fill-yellow-500 flex-shrink-0" />
                        )}
                      </div>
                      <div className="flex items-center gap-3 mt-1">
                        <span
                          className={`text-xs font-medium px-2 py-0.5 rounded-full ${config.color}`}
                        >
                          {config?.label}
                        </span>
                        {blog.category && (
                          <span className="text-xs text-slate-400">{blog.category.name}</span>
                        )}
                        <span className="text-xs text-slate-400">{blog.read_time} min read</span>
                        <span className="text-xs text-slate-400">{blog.views} views</span>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-2 flex-shrink-0">
                      <Button
                        size="sm"
                        variant="ghost"
                        className="text-slate-400 hover:text-blue-600 h-8 w-8 p-0"
                        onClick={() => openEdit(blog)}
                      >
                        <Pencil className="w-4 h-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        className="text-slate-400 hover:text-red-500 h-8 w-8 p-0"
                        onClick={() => handleDelete(blog.id)}
                        disabled={deletingId === blog.id}
                      >
                        {deletingId === blog.id ? (
                          <Loader2 className="w-4 h-4 animate-spin" />
                        ) : (
                          <Trash2 className="w-4 h-4" />
                        )}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        ) : (
          <div className="text-center py-16 text-slate-400 text-sm">No blog posts yet</div>
        )}
      </div>

      {/* Create / Edit Modal */}
      <Dialog open={modalOpen} onOpenChange={setModalOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editingBlog ? 'Edit Post' : 'New Post'}</DialogTitle>
          </DialogHeader>

          <div className="space-y-4 py-2">
            {/* Title */}
            <div className="space-y-1.5">
              <Label className="text-slate-700">Title *</Label>
              <Input
                placeholder="Post title..."
                value={form.title}
                onChange={(e) => setForm((p) => ({ ...p, title: e.target.value }))}
                className="h-11"
              />
            </div>

            {/* Excerpt */}
            <div className="space-y-1.5">
              <Label className="text-slate-700">Excerpt</Label>
              <Textarea
                placeholder="Short description..."
                value={form.excerpt}
                onChange={(e) => setForm((p) => ({ ...p, excerpt: e.target.value }))}
                rows={2}
                className="resize-none"
              />
            </div>

            {/* Content */}
            <div className="space-y-1.5">
              <Label className="text-slate-700">Content *</Label>
              <Textarea
                placeholder="Write your article..."
                value={form.content}
                onChange={(e) => setForm((p) => ({ ...p, content: e.target.value }))}
                rows={10}
                className="resize-none font-mono text-sm"
              />
            </div>

            {/* Category + Status row */}
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label className="text-slate-700">Category</Label>
                <select
                  value={form.category}
                  onChange={(e) => setForm((p) => ({ ...p, category: e.target.value }))}
                  className="w-full h-10 px-3 rounded-lg border border-slate-200 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">No category</option>
                  {categories.map((cat) => (
                    <option key={cat.id} value={cat.id}>
                      {cat.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-1.5">
                <Label className="text-slate-700">Status</Label>
                <select
                  value={form.status}
                  onChange={(e) => setForm((p) => ({ ...p, status: e.target.value }))}
                  className="w-full h-10 px-3 rounded-lg border border-slate-200 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="draft">Draft</option>
                  <option value="published">Published</option>
                </select>
              </div>
            </div>

            {/* Featured image */}
            <div className="space-y-1.5">
              <Label className="text-slate-700">Featured Image</Label>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => setForm((p) => ({ ...p, featured_image: e.target.files[0] }))}
                className="w-full text-sm text-slate-500 file:mr-3 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-blue-50 file:text-blue-600 hover:file:bg-blue-100"
              />
            </div>

            {/* Featured toggle */}
            <div className="flex items-center gap-3">
              <input
                type="checkbox"
                id="featured"
                checked={form.is_featured}
                onChange={(e) => setForm((p) => ({ ...p, is_featured: e.target.checked }))}
                className="w-4 h-4 accent-blue-600"
              />
              <Label htmlFor="featured" className="text-slate-700 cursor-pointer">
                Mark as featured post
              </Label>
            </div>

            {error && (
              <p className="text-sm text-red-500 bg-red-50 px-3 py-2 rounded-lg">{error}</p>
            )}
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setModalOpen(false)}>
              Cancel
            </Button>
            <Button
              onClick={handleSave}
              disabled={saving}
              className="bg-blue-600 hover:bg-blue-700 text-white"
            >
              {saving ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" /> Saving...
                </>
              ) : editingBlog ? (
                'Update Post'
              ) : (
                'Publish Post'
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </AuthGuard>
  )
}
