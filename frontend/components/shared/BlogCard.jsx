import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Clock, Eye, Tag, FileText } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { parseImageSrc, formatDate } from '@/lib/blog-utils';

export default function BlogCard({ blog, featured = false }) {
  const {
    slug, title, excerpt, featured_image,
    category, read_time, views, published_at, tags,
  } = blog;

  const [imgError, setImgError] = useState(false);
  const imageSrc = parseImageSrc(featured_image);
  const showImage = imageSrc && !imgError;
  const date = formatDate(published_at);

  return (
    <Link href={`/blog/${slug}`} className="group block h-full">
      <Card
        className={`h-full overflow-hidden rounded-2xl border border-slate-100 shadow-sm transition-all duration-300 group-hover:-translate-y-1 group-hover:border-teal-200 group-hover:shadow-lg group-hover:shadow-teal-600/5 ${
          featured ? 'sm:flex sm:flex-row' : ''
        }`}
      >
        {/* Image */}
        <div
          className={`relative overflow-hidden bg-gradient-to-br from-blue-100 to-indigo-100 ${
            featured ? 'h-52 sm:h-auto sm:min-h-full sm:w-1/2' : 'h-44'
          }`}
        >
          {showImage ? (
            <Image
              src={imageSrc}
              alt={title || 'Blog post cover'}
              width={featured ? 640 : 400}
              height={featured ? 400 : 200}
              className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
              onError={() => setImgError(true)}
              sizes={featured ? '(max-width: 640px) 100vw, 50vw' : '(max-width: 640px) 100vw, 400px'}
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center">
              <FileText className="h-10 w-10 text-blue-200 transition-colors group-hover:text-blue-300" />
            </div>
          )}
        </div>

        <CardContent className={`flex flex-col p-5 ${featured ? 'sm:flex-1' : ''}`}>
          {/* Category */}
          {category && (
            <Badge variant="secondary" className="mb-3 w-fit text-xs">
              {category.name}
            </Badge>
          )}

          {/* Title */}
          <h3
            className={`font-bold leading-snug text-slate-800 transition-colors group-hover:text-teal-700 line-clamp-2 ${
              featured ? 'text-xl sm:text-2xl' : 'text-base'
            }`}
          >
            {title}
          </h3>

          {/* Excerpt */}
          {excerpt && (
            <p className={`mt-2 text-sm leading-relaxed text-slate-400 line-clamp-2 ${featured ? 'sm:line-clamp-3' : ''}`}>
              {excerpt}
            </p>
          )}

          {/* Tags */}
          {tags?.length > 0 && (
            <div className="mt-3 flex flex-wrap gap-1.5">
              {tags.slice(0, 3).map((tag) => (
                <span key={tag.id} className="text-xs text-slate-400">
                  <Tag className="mr-1 inline h-3 w-3" />
                  {tag.name}
                </span>
              ))}
            </div>
          )}

          {/* Meta */}
          <div className="mt-auto flex items-center justify-between pt-4 text-xs text-slate-400 border-t border-slate-100">
            <div className="flex items-center gap-3">
              <span className="flex items-center gap-1">
                <Clock className="h-3 w-3" /> {read_time || 1} min read
              </span>
              <span className="flex items-center gap-1">
                <Eye className="h-3 w-3" /> {views ?? 0}
              </span>
            </div>
            {date && <span>{date}</span>}
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
