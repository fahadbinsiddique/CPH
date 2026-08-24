'use client';

import { useEffect, useState } from 'react';
import { Loader2, Wand2, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
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
import ImageUploader from '@/components/blog/ImageUploader';
import TagInput from '@/components/blog/TagInput';
import TopProgressBar from '@/components/blog/TopProgressBar';
import RichTextEditor from '@/components/editor/RichTextEditor';
import { blogService } from '@/services/blogService';
import { slugifyTitle, toErrorMessage } from '@/lib/blog-utils';
import { cn } from '@/lib/utils';

const EXCERPT_MAX = 300;
const TAG_MAX = 10;

export default function BlogForm({ initialData, setDirty, confirmLeave, onSaved }) {
  const isEdit = Boolean(initialData);

  const [title, setTitle] = useState(initialData?.title || '');
  const [slug, setSlug] = useState(initialData?.slug || '');
  const [slugTouched, setSlugTouched] = useState(Boolean(initialData?.slug));
  const [excerpt, setExcerpt] = useState(initialData?.excerpt || '');
  const [content, setContent] = useState(initialData?.content || '');
  const [category, setCategory] = useState(
    initialData?.category ? String(initialData.category.id) : ''
  );
  const [tags, setTags] = useState(initialData?.tags || []);
  const [status, setStatus] = useState(initialData?.status || 'draft');
  const [isFeatured, setIsFeatured] = useState(Boolean(initialData?.is_featured));
  const [featuredImage, setFeaturedImage] = useState(null);

  const [categories, setCategories] = useState([]);
  const [allTags, setAllTags] = useState([]);
  const [saving, setSaving] = useState(false);
  const [editorUploading, setEditorUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [error, setError] = useState('');

  // Load categories and tag options once.
  useEffect(() => {
    let active = true;
    Promise.all([
      blogService.getCategories().catch(() => ({ data: [] })),
      blogService.adminGetTags().catch(() => ({ data: [] })),
    ]).then(([catRes, tagRes]) => {
      if (!active) return;
      setCategories(catRes.data.results || catRes.data || []);
      setAllTags(tagRes.data.results || tagRes.data || []);
    });
    return () => {
      active = false;
    };
  }, []);

  const markDirty = () => setDirty?.(true);

  const handleTitleChange = (value) => {
    setTitle(value);
    markDirty();
    if (!slugTouched) {
      setSlug(slugifyTitle(value));
    }
  };

  const regenerateSlug = () => {
    setSlug(slugifyTitle(title));
    markDirty();
  };

  const handleCreateTag = async (name) => {
    const res = await blogService.adminCreateTag({ name });
    const created = res.data.results ? res.data.results : res.data;
    setAllTags((prev) => [...prev, created]);
    return created;
  };

  const handleUploadEditorImage = async (file) => {
    setEditorUploading(true);
    markDirty();
    try {
      const res = await blogService.uploadImage(file);
      return res.data.url;
    } catch (err) {
      toast.error(toErrorMessage(err));
      return null;
    } finally {
      setEditorUploading(false);
    }
  };

  const handleSave = async (targetStatus = status) => {
    if (!title.trim()) {
      setError('Title is required.');
      toast.error('Please add a title.');
      return;
    }
    const stripped = content.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
    if (!stripped) {
      setError('Content is required.');
      toast.error('Please write some article content.');
      return;
    }
    if (!slug.trim()) {
      setError('Slug is required.');
      return;
    }

    setSaving(true);
    setError('');
    setUploadProgress(0);

    const fd = new FormData();
    fd.append('title', title.trim());
    fd.append('slug', slugifyTitle(slug.trim()));
    fd.append('excerpt', excerpt.trim());
    fd.append('content', content);
    fd.append('status', targetStatus);
    fd.append('is_featured', String(isFeatured));
    if (category) fd.append('category', category);
    tags.forEach((tag) => fd.append('tags', String(tag.id)));
    if (featuredImage) fd.append('featured_image', featuredImage);

    const config = {
      onUploadProgress: (e) => {
        setUploadProgress(e.total ? Math.round((e.loaded / e.total) * 100) : -1);
      },
      timeout: 60000,
    };

    try {
      const res = isEdit
        ? await blogService.adminUpdate(initialData.id, fd, config)
        : await blogService.adminCreate(fd, config);
      const saved = res.data.results ? res.data.results : res.data;
      toast.success(isEdit ? 'Blog post updated' : 'Blog post created');
      setDirty?.(false);
      onSaved?.(saved);
    } catch (err) {
      const message = toErrorMessage(err);
      setError(message);
      toast.error(message);
    } finally {
      setSaving(false);
    }
  };

  const submitting = saving || editorUploading;

  return (
    <>
      <TopProgressBar active={submitting} progress={saving ? uploadProgress : null} />

      <div className="space-y-6">
        {/* Title & slug */}
        <Card className="dash-card">
          <CardContent className="space-y-4 p-5">
            <div className="space-y-1.5">
              <Label htmlFor="blog-title" className="text-sm font-medium text-slate-700">
                Title <span className="text-rose-500">*</span>
              </Label>
              <Input
                id="blog-title"
                value={title}
                onChange={(e) => handleTitleChange(e.target.value)}
                placeholder="An engaging article title..."
                className="h-11 rounded-xl border-slate-200 shadow-sm focus-visible:border-teal-500 focus-visible:ring-teal-500/20"
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="blog-slug" className="text-sm font-medium text-slate-700">
                Slug <span className="text-rose-500">*</span>
              </Label>
              <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
                <div className="relative flex-1">
                  <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-sm text-slate-400">
                    /blog/
                  </span>
                  <Input
                    id="blog-slug"
                    value={slug}
                    onChange={(e) => {
                      setSlug(slugifyTitle(e.target.value))
                      setSlugTouched(true)
                      markDirty()
                    }}
                    placeholder="auto-generated-from-title"
                    className="h-11 rounded-xl border-slate-200 pl-14 shadow-sm focus-visible:border-teal-500 focus-visible:ring-teal-500/20"
                  />
                </div>
                <Button
                  type="button"
                  variant="outline"
                  onClick={regenerateSlug}
                  className="h-11 gap-2 border-slate-200 text-slate-600 hover:border-teal-300 hover:text-teal-700 sm:shrink-0"
                >
                  <Wand2 className="h-4 w-4" /> Regenerate
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Excerpt */}
        <Card className="dash-card">
          <CardContent className="space-y-3 p-5">
            <div className="flex items-center justify-between">
              <Label htmlFor="blog-excerpt" className="text-sm font-medium text-slate-700">
                Short summary / excerpt
              </Label>
              <span
                className={cn(
                  'text-xs font-medium',
                  excerpt.length > EXCERPT_MAX ? 'text-rose-500' : 'text-slate-400',
                )}
              >
                {excerpt.length}/{EXCERPT_MAX}
              </span>
            </div>
            <Textarea
              id="blog-excerpt"
              value={excerpt}
              maxLength={EXCERPT_MAX}
              onChange={(e) => {
                setExcerpt(e.target.value)
                markDirty()
              }}
              rows={3}
              placeholder="A short summary shown on cards and search results..."
              className="rounded-xl border-slate-200 resize-none shadow-sm focus-visible:border-teal-500 focus-visible:ring-teal-500/20"
            />
          </CardContent>
        </Card>

        {/* Cover image */}
        <Card className="dash-card">
          <CardContent className="p-5">
            <ImageUploader
              value={featuredImage}
              currentUrl={initialData?.featured_image}
              onChange={(file) => {
                setFeaturedImage(file)
                markDirty()
              }}
              uploading={saving}
            />
          </CardContent>
        </Card>

        {/* Category, status, featured */}
        <Card className="dash-card">
          <CardContent className="grid gap-5 p-5 sm:grid-cols-2">
            <div className="space-y-1.5">
              <Label className="text-sm font-medium text-slate-700">Category</Label>
              <Select
                value={category || 'none'}
                onValueChange={(value) => {
                  setCategory(value === 'none' ? '' : value)
                  markDirty()
                }}
              >
                <SelectTrigger className="h-11 rounded-xl border-slate-200 bg-white shadow-sm">
                  <SelectValue placeholder="No category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">No category</SelectItem>
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
                value={status}
                onValueChange={(value) => {
                  setStatus(value)
                  markDirty()
                }}
              >
                <SelectTrigger className="h-11 rounded-xl border-slate-200 bg-white shadow-sm">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="draft">Draft</SelectItem>
                  <SelectItem value="published">Published</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-center gap-3 sm:col-span-2">
              <input
                type="checkbox"
                id="featured"
                checked={isFeatured}
                onChange={(e) => {
                  setIsFeatured(e.target.checked)
                  markDirty()
                }}
                className="h-4 w-4 accent-teal-600"
              />
              <Label
                htmlFor="featured"
                className="cursor-pointer text-sm font-medium text-slate-700"
              >
                Mark as featured post
              </Label>
            </div>
          </CardContent>
        </Card>

        {/* Tags */}
        <Card className="dash-card">
          <CardContent className="space-y-3 p-5">
            <Label className="text-sm font-medium text-slate-700">Tags</Label>
            <TagInput
              allTags={allTags}
              value={tags}
              onChange={(next) => {
                setTags(next)
                markDirty()
              }}
              onCreateTag={handleCreateTag}
              max={TAG_MAX}
            />
          </CardContent>
        </Card>

        {/* Content */}
        <Card className="dash-card">
          <CardContent className="space-y-3 p-5">
            <Label className="text-sm font-medium text-slate-700">
              Content <span className="text-rose-500">*</span>
            </Label>
            <RichTextEditor
              value={content}
              onChange={(html) => {
                setContent(html)
                markDirty()
              }}
              uploadImage={handleUploadEditorImage}
            />
          </CardContent>
        </Card>

        {/* Error */}
        {error && (
          <div className="flex items-start gap-3 rounded-xl border border-rose-200 bg-rose-50 px-4 py-3">
            <X className="mt-0.5 h-4 w-4 shrink-0 text-rose-500" />
            <p className="text-sm text-rose-600">{error}</p>
          </div>
        )}

        {/* Sticky action bar */}
        <div className="sticky bottom-4 z-20 flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-slate-200/60 bg-white/90 p-4 shadow-lg shadow-slate-900/5 backdrop-blur-md">
          <div className="flex items-center gap-2 text-xs text-slate-400">
            {saving ? (
              <span className="flex items-center gap-2 text-teal-600">
                <Loader2 className="h-4 w-4 animate-spin" />
                {uploadProgress >= 0 ? `Saving... ${uploadProgress}%` : 'Saving...'}
              </span>
            ) : (
              <span>
                {isEdit ? 'Editing' : 'Creating'} · {status === 'published' ? 'Published' : 'Draft'}
              </span>
            )}
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <Button
              type="button"
              variant="outline"
              disabled={submitting}
              onClick={() => confirmLeave(() => onSaved?.({ cancel: true }))}
              className="border-slate-200 text-slate-600 hover:border-slate-300 hover:text-slate-800"
            >
              Cancel
            </Button>
            <Button
              type="button"
              variant="outline"
              disabled={submitting}
              onClick={() => handleSave('draft')}
              className="gap-2 border-amber-200 bg-amber-50 text-amber-700 hover:bg-amber-100 hover:text-amber-800"
            >
              {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
              Save as Draft
            </Button>
            <Button
              type="button"
              disabled={submitting}
              onClick={() => handleSave('published')}
              className="dash-cta"
            >
              {saving ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : status === 'published' ? (
                'Update Post'
              ) : (
                'Publish'
              )}
            </Button>
          </div>
        </div>
      </div>
    </>
  )
}
