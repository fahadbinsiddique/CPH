import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowUpRight, Clock, Eye, Sparkles } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { parseImageSrc, formatDate } from '@/lib/blog-utils';

export default function FeaturedBlogCard({ blog }) {
  const {
    slug, title, excerpt, featured_image,
    author, category, read_time, views, published_at,
  } = blog;

  const [imgError, setImgError] = useState(false);
  const imageSrc = parseImageSrc(featured_image);
  const hasImage = imageSrc && !imgError;
  const date = formatDate(published_at);

  return (
    <Link href={`/blog/${slug}`} className="group relative block h-full overflow-hidden rounded-3xl">
      {/* Background image */}
      <div className="absolute inset-0">
        {hasImage ? (
          <Image
            src={imageSrc}
            alt={title || 'Featured article'}
            fill
            sizes="(max-width: 1024px) 100vw, 66vw"
            className="object-cover transition-transform duration-700 group-hover:scale-105"
            onError={() => setImgError(true)}
          />
        ) : (
          <div className="h-full w-full bg-gradient-to-br from-teal-600 to-indigo-700" />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/40 to-slate-950/10" />
      </div>

      {/* Content */}
      <div className="relative flex min-h-[22rem] flex-col justify-end p-6 sm:p-8">
        <div className="flex flex-wrap items-center gap-2">
          <Badge className="border-0 bg-white/15 text-white backdrop-blur-md">
            <Sparkles className="mr-1 h-3 w-3" /> Featured
          </Badge>
          {category && (
            <Badge className="border-0 bg-white/15 text-white backdrop-blur-md">
              {category.name}
            </Badge>
          )}
        </div>

        <h2 className="mt-4 text-2xl font-bold leading-tight text-white sm:text-3xl sm:leading-tight line-clamp-3">
          {title}
        </h2>

        {excerpt && (
          <p className="mt-3 max-w-2xl text-sm leading-relaxed text-slate-200 line-clamp-2 sm:line-clamp-3">
            {excerpt}
          </p>
        )}

        <div className="mt-5 flex flex-wrap items-center gap-x-4 gap-y-2 text-xs text-slate-300">
          {author?.full_name && (
            <span className="flex items-center gap-2">
              <span className="flex h-6 w-6 items-center justify-center rounded-full bg-white/20 text-[10px] font-bold text-white">
                {author.full_name.charAt(0)}
              </span>
              {author.full_name}
            </span>
          )}
          {date && <span>{date}</span>}
          <span className="flex items-center gap-1">
            <Clock className="h-3 w-3" /> {read_time || 1} min read
          </span>
          <span className="flex items-center gap-1">
            <Eye className="h-3 w-3" /> {views ?? 0}
          </span>
        </div>

        <span className="mt-5 inline-flex w-fit items-center gap-1.5 text-sm font-semibold text-teal-300">
          Read article
          <ArrowUpRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
        </span>
      </div>
    </Link>
  );
}
