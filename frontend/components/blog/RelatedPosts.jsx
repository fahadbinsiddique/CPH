import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import BlogCard from '@/components/shared/BlogCard';

export default function RelatedPosts({ posts }) {
  if (!posts || posts.length === 0) return null;

  return (
    <section className="mt-14 border-t border-slate-100 pt-10">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-slate-900">Related articles</h2>
        <Link
          href="/blog"
          className="flex items-center gap-1 text-sm font-semibold text-teal-700 transition-colors hover:text-teal-800"
        >
          View all <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
      <div className="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {posts.map((post) => (
          <BlogCard key={post.id} blog={post} />
        ))}
      </div>
    </section>
  );
}
