'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  Clock, Eye, Calendar, ArrowLeft,
  Tag, User, Loader2
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { blogService } from '@/services/blogService';

export default function BlogDetailPage() {
  const { slug } = useParams();
  const router = useRouter();
  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    blogService.getBySlug(slug)
      .then(res => setBlog(res.data))
      .catch(() => router.push('/blog'))
      .finally(() => setLoading(false));
  }, [slug]);

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center">
      <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
    </div>
  );

  if (!blog) return null;

  const {
    title, content, excerpt, featured_image,
    author, category, tags, read_time,
    views, published_at,
  } = blog;

  const date = published_at
    ? new Date(published_at).toLocaleDateString('en-US', {
        year: 'numeric', month: 'long', day: 'numeric'
      })
    : '';

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-3xl mx-auto px-4 py-10">

        {/* Back */}
        <button
          onClick={() => router.back()}
          className="flex items-center gap-2 text-slate-400 hover:text-slate-600 mb-8 text-sm"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Blog
        </button>

        <motion.article
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          {/* Category */}
          {category && (
            <Badge variant="secondary" className="mb-4">
              {category.name}
            </Badge>
          )}

          {/* Title */}
          <h1 className="text-3xl font-bold text-slate-800 leading-tight mb-4">
            {title}
          </h1>

          {/* Excerpt */}
          {excerpt && (
            <p className="text-lg text-slate-500 leading-relaxed mb-6">
              {excerpt}
            </p>
          )}

          {/* Meta */}
          <div className="flex flex-wrap items-center gap-4 text-sm text-slate-400 mb-8 pb-6 border-b border-slate-100">
            <span className="flex items-center gap-1.5">
              <User className="w-4 h-4" />
              {author?.full_name}
            </span>
            <span className="flex items-center gap-1.5">
              <Calendar className="w-4 h-4" />
              {date}
            </span>
            <span className="flex items-center gap-1.5">
              <Clock className="w-4 h-4" />
              {read_time} min read
            </span>
            <span className="flex items-center gap-1.5">
              <Eye className="w-4 h-4" />
              {views} views
            </span>
          </div>

          {/* Featured image */}
          {featured_image && (
            <div className="rounded-2xl overflow-hidden mb-8 bg-slate-100">
              <Image
                src={featured_image}
                alt={title}
                width={800}
                height={400}
                className="w-full object-cover max-h-80"
              />
            </div>
          )}

          {/* Content */}
          <div
            className="prose prose-slate max-w-none prose-headings:font-semibold prose-a:text-blue-600 prose-img:rounded-xl"
            dangerouslySetInnerHTML={{ __html: content }}
          />

          {/* Tags */}
          {tags?.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-8 pt-6 border-t border-slate-100">
              <Tag className="w-4 h-4 text-slate-400 mt-0.5" />
              {tags.map(tag => (
                <Link key={tag.id} href={`/blog?tags__slug=${tag.slug}`}>
                  <Badge variant="outline" className="cursor-pointer hover:bg-slate-100">
                    #{tag.name}
                  </Badge>
                </Link>
              ))}
            </div>
          )}

          {/* Author card */}
          <div className="mt-10 p-5 bg-slate-50 rounded-2xl flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold text-xl flex-shrink-0">
              {author?.full_name?.charAt(0)}
            </div>
            <div>
              <p className="font-semibold text-slate-800">{author?.full_name}</p>
              <p className="text-sm text-slate-400">Author</p>
            </div>
          </div>
        </motion.article>
      </div>
    </div>
  );
}