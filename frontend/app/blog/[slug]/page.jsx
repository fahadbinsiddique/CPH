'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  ArrowLeft, Calendar, Clock, Eye, Tag, FileText,
  Loader2, BookOpen,
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { blogService } from '@/services/blogService';
import {
  parseImageSrc, formatDate, extractList,
  prepareContent, estimateReadTime, toErrorMessage,
} from '@/lib/blog-utils';
import AuthorCard from '@/components/blog/AuthorCard';
import ShareButtons from '@/components/blog/ShareButtons';
import TableOfContents from '@/components/blog/TableOfContents';
import RelatedPosts from '@/components/blog/RelatedPosts';

export default function BlogDetailPage() {
  const { slug } = useParams();
  const [blog, setBlog] = useState(null);
  const [related, setRelated] = useState([]);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [imgError, setImgError] = useState(false);

  useEffect(() => {
    let active = true;
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setLoading(true);
    setNotFound(false);

    blogService
      .getBySlug(slug)
      .then((res) => {
        if (!active) return;
        setBlog(res.data);
        setImgError(false);
      })
      .catch((err) => {
        if (!active) return;
        setNotFound(true);
        console.error(toErrorMessage(err));
      })
      .finally(() => active && setLoading(false));

    return () => {
      active = false;
    };
  }, [slug]);

  useEffect(() => {
    if (!blog) return undefined;
    let active = true;

    const load = (params) =>
      blogService
        .getAll({ page_size: 6, ...params })
        .then((res) => extractList(res.data).filter((p) => p.id !== blog.id));

    const byCategory = blog.category?.slug
      ? load({ category__slug: blog.category.slug })
      : Promise.resolve([]);

    byCategory
      .then((candidates) => {
        if (!active) return;
        if (candidates.length > 0) {
          setRelated(candidates.slice(0, 3));
          return undefined;
        }
        return load({});
      })
      .then((fallback) => {
        if (active && fallback) setRelated(fallback.slice(0, 3));
      })
      .catch(() => {});

    return () => {
      active = false;
    };
  }, [blog]);

  if (loading) {
    return (
      <div className="min-h-screen bg-white">
        <div className="mx-auto max-w-3xl px-4 py-12">
          <div className="mb-8 h-4 w-24 animate-pulse rounded bg-slate-200" />
          <div className="h-8 w-3/4 animate-pulse rounded-lg bg-slate-200" />
          <div className="mt-3 h-4 w-1/2 animate-pulse rounded bg-slate-200" />
          <div className="mt-8 h-64 w-full animate-pulse rounded-2xl bg-slate-200" />
          <div className="mt-8 space-y-3">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="h-4 animate-pulse rounded bg-slate-100" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (notFound || !blog) {
    return (
      <div className="min-h-screen bg-white">
        <div className="mx-auto flex max-w-xl flex-col items-center px-4 py-24 text-center">
          <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-slate-100">
            <BookOpen className="h-10 w-10 text-slate-300" />
          </div>
          <h1 className="text-2xl font-bold text-slate-900">Article not found</h1>
          <p className="mt-3 text-sm text-slate-500">
            This article may have been unpublished or the link is incorrect.
          </p>
          <Link href="/blog" className="mt-8">
            <Button variant="outline" className="gap-2">
              <ArrowLeft className="h-4 w-4" /> Back to blog
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  const { html: contentHtml, headings } = prepareContent(blog.content);
  const date = formatDate(blog.published_at, { month: 'long' });
  const imageSrc = parseImageSrc(blog.featured_image);
  const showImage = imageSrc && !imgError;
  const readTime = blog.read_time || estimateReadTime(blog.content);

  return (
    <div className="min-h-screen bg-white">
      {/* Hero */}
      <div className="border-b border-slate-100 bg-slate-50/60">
        <div className="mx-auto max-w-3xl px-4 py-10 sm:py-12">
          <Link
            href="/blog"
            className="mb-6 inline-flex items-center gap-2 text-sm font-medium text-slate-500 transition-colors hover:text-teal-700"
          >
            <ArrowLeft className="h-4 w-4" /> Back to blog
          </Link>

          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}>
            <div className="flex flex-wrap items-center gap-2">
              {blog.category && (
                <Link href={`/blog?category__slug=${blog.category.slug}`}>
                  <Badge variant="secondary" className="hover:bg-teal-50 hover:text-teal-700">
                    {blog.category.name}
                  </Badge>
                </Link>
              )}
              {blog.is_featured && (
                <Badge className="border-0 bg-teal-600 text-white">Featured</Badge>
              )}
            </div>

            <h1 className="mt-4 text-3xl font-bold leading-tight tracking-tight text-slate-900 sm:text-4xl sm:leading-tight">
              {blog.title}
            </h1>

            {blog.excerpt && (
              <p className="mt-4 text-lg leading-relaxed text-slate-500">{blog.excerpt}</p>
            )}

            <div className="mt-6 flex flex-wrap items-center gap-x-5 gap-y-2 border-y border-slate-100 py-4 text-sm text-slate-500">
              {blog.author?.full_name && (
                <span className="flex items-center gap-2 font-medium text-slate-700">
                  <span className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-teal-500 to-emerald-600 text-xs font-bold text-white">
                    {blog.author.full_name.charAt(0)}
                  </span>
                  {blog.author.full_name}
                </span>
              )}
              {date && (
                <span className="flex items-center gap-1.5">
                  <Calendar className="h-4 w-4" /> {date}
                </span>
              )}
              <span className="flex items-center gap-1.5">
                <Clock className="h-4 w-4" /> {readTime} min read
              </span>
              <span className="flex items-center gap-1.5">
                <Eye className="h-4 w-4" /> {blog.views ?? 0} views
              </span>
              <span className="ml-auto">
                <ShareButtons title={blog.title} />
              </span>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Body */}
      <div className="mx-auto max-w-3xl px-4 py-10">
        <motion.article
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
        >
          {/* Featured image */}
          {showImage ? (
            <div className="mb-8 overflow-hidden rounded-2xl bg-slate-100">
              <Image
                src={imageSrc}
                alt={blog.title}
                width={800}
                height={450}
                sizes="(max-width: 768px) 100vw, 768px"
                className="h-auto w-full object-cover"
                onError={() => setImgError(true)}
                priority
              />
            </div>
          ) : (
            <div className="mb-8 flex h-56 items-center justify-center rounded-2xl bg-gradient-to-br from-teal-50 to-indigo-50">
              <FileText className="h-14 w-14 text-teal-200" />
            </div>
          )}

          {/* Table of contents */}
          {headings.length >= 2 && <TableOfContents headings={headings} className="mb-8" />}

          {/* Content */}
          <div
            className="blog-prose prose prose-slate max-w-none prose-headings:font-bold prose-headings:text-slate-900 prose-headings:tracking-tight prose-a:text-teal-700 prose-a:no-underline hover:prose-a:underline prose-img:rounded-xl"
            dangerouslySetInnerHTML={{ __html: contentHtml }}
          />

          {/* Tags */}
          {blog.tags?.length > 0 && (
            <div className="mt-10 flex flex-wrap items-center gap-2 border-t border-slate-100 pt-6">
              <Tag className="h-4 w-4 text-slate-400" />
              {blog.tags.map((tag) => (
                <Link key={tag.id} href={`/blog?tags__slug=${tag.slug}`}>
                  <Badge variant="outline" className="cursor-pointer text-slate-500 hover:bg-slate-100">
                    #{tag.name}
                  </Badge>
                </Link>
              ))}
            </div>
          )}

          {/* Share */}
          <div className="mt-8 flex items-center justify-between rounded-2xl border border-slate-100 bg-slate-50/70 px-5 py-4">
            <div>
              <p className="text-sm font-semibold text-slate-800">Enjoyed this article?</p>
              <p className="text-xs text-slate-400">Share it with someone who might need it.</p>
            </div>
            <ShareButtons title={blog.title} />
          </div>

          {/* Author */}
          <AuthorCard author={blog.author} />
        </motion.article>

        {/* Related */}
        {related.length > 0 && <RelatedPosts posts={related} />}
      </div>
    </div>
  );
}
