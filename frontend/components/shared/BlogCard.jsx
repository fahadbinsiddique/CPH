import Link from 'next/link';
import Image from 'next/image';
import { Clock, Eye, Tag } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';

export default function BlogCard({ blog, featured = false }) {
  const {
    slug, title, excerpt, featured_image,
    author, category, read_time, views,
    published_at, tags,
  } = blog;

  const date = published_at
    ? new Date(published_at).toLocaleDateString('en-US', {
        year: 'numeric', month: 'short', day: 'numeric'
      })
    : '';

  return (
    <Link href={`/blog/${slug}`}>
      <Card className={`
        border border-slate-100 shadow-sm hover:shadow-md
        transition-all duration-200 rounded-2xl overflow-hidden
        group cursor-pointer h-full
        ${featured ? 'md:flex' : ''}
      `}>
        {/* Image */}
        <div className={`
          bg-gradient-to-br from-blue-100 to-indigo-100 overflow-hidden flex-shrink-0
          ${featured ? 'md:w-48 h-44 md:h-auto' : 'h-44'}
        `}>
          {featured_image ? (
            <Image
              src={featured_image}
              alt={title}
              width={400}
              height={200}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <span className="text-4xl">🧠</span>
            </div>
          )}
        </div>

        <CardContent className="p-4 flex flex-col">
          {/* Category */}
          {category && (
            <Badge variant="secondary" className="text-xs w-fit mb-2">
              {category.name}
            </Badge>
          )}

          {/* Title */}
          <h3 className="font-semibold text-slate-800 leading-snug mb-2 group-hover:text-blue-600 transition-colors line-clamp-2">
            {title}
          </h3>

          {/* Excerpt */}
          {excerpt && (
            <p className="text-sm text-slate-400 line-clamp-2 mb-3 flex-1">
              {excerpt}
            </p>
          )}

          {/* Tags */}
          {tags?.length > 0 && (
            <div className="flex flex-wrap gap-1 mb-3">
              {tags.slice(0, 3).map(tag => (
                <span key={tag.id} className="text-xs text-slate-400">
                  #{tag.name}
                </span>
              ))}
            </div>
          )}

          {/* Meta */}
          <div className="flex items-center justify-between text-xs text-slate-400 mt-auto pt-3 border-t border-slate-100">
            <div className="flex items-center gap-3">
              <span className="flex items-center gap-1">
                <Clock className="w-3 h-3" /> {read_time} min read
              </span>
              <span className="flex items-center gap-1">
                <Eye className="w-3 h-3" /> {views}
              </span>
            </div>
            <span>{date}</span>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}