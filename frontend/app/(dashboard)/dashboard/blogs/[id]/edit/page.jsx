'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { ArrowLeft, FileText, Loader2, BookOpen } from 'lucide-react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import AuthGuard from '@/components/shared/AuthGuard';
import PageHeader from '@/components/dashboard/ui/PageHeader';
import BlogForm from '@/components/dashboard/blogs/BlogForm';
import useUnsavedChanges from '@/hooks/useUnsavedChanges';
import { blogService } from '@/services/blogService';
import { toErrorMessage } from '@/lib/blog-utils';

export default function EditBlogPage() {
  const { id } = useParams();
  const router = useRouter();
  const { setDirty, confirmLeave, dialog } = useUnsavedChanges();

  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    let active = true;
    blogService
      .adminGetOne(id)
      .then((res) => active && setBlog(res.data))
      .catch((err) => {
        console.error(toErrorMessage(err));
        active && setNotFound(true);
      })
      .finally(() => active && setLoading(false));
    return () => {
      active = false;
    };
  }, [id]);

  const goBack = () => confirmLeave(() => router.push('/dashboard/blogs'));

  const handleSaved = (saved) => {
    if (saved?.cancel) {
      router.push('/dashboard/blogs');
      return;
    }
    router.push('/dashboard/blogs');
  };

  if (loading) {
    return (
      <AuthGuard allowedRoles={['admin']}>
        <div className="flex min-h-[60vh] flex-col items-center justify-center gap-4">
          <Loader2 className="h-10 w-10 animate-spin text-teal-600" />
          <p className="text-sm font-medium text-slate-400">Loading post...</p>
        </div>
      </AuthGuard>
    );
  }

  if (notFound || !blog) {
    return (
      <AuthGuard allowedRoles={['admin']}>
        <div className="flex min-h-[60vh] flex-col items-center justify-center text-center">
          <div className="mb-5 flex h-20 w-20 items-center justify-center rounded-full bg-slate-100">
            <BookOpen className="h-10 w-10 text-slate-300" />
          </div>
          <h2 className="text-xl font-bold text-slate-900">Post not found</h2>
          <p className="mt-2 text-sm text-slate-500">This blog post may have been deleted.</p>
          <Button variant="outline" className="mt-6 gap-2" onClick={() => router.push('/dashboard/blogs')}>
            <ArrowLeft className="h-4 w-4" /> Back to posts
          </Button>
        </div>
      </AuthGuard>
    );
  }

  return (
    <AuthGuard allowedRoles={['admin']}>
      <div className="space-y-6">
        <button
          type="button"
          onClick={goBack}
          className="inline-flex items-center gap-2 text-sm font-medium text-slate-500 transition-colors hover:text-teal-700"
        >
          <ArrowLeft className="h-4 w-4" /> Back to posts
        </button>

        <PageHeader
          badge="Content Studio"
          badgeIcon={FileText}
          title="Edit Post"
          subtitle={blog.title}
        />

        <motion.div
          key={blog.id}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
        >
          <BlogForm
            initialData={blog}
            setDirty={setDirty}
            confirmLeave={confirmLeave}
            onSaved={handleSaved}
          />
        </motion.div>

        {dialog}
      </div>
    </AuthGuard>
  );
}
