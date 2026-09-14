'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, FileText, BookOpen } from 'lucide-react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import AuthGuard from '@/components/shared/AuthGuard';
import PageHeader from '@/components/dashboard/ui/PageHeader';
import BlogForm from '@/components/dashboard/blogs/BlogForm';
import useUnsavedChanges from '@/hooks/useUnsavedChanges';

export default function BlogEditClient({ initialBlog, notFound }) {
  const router = useRouter();
  const { setDirty, confirmLeave, dialog } = useUnsavedChanges();
  const [blog] = useState(initialBlog);

  const goBack = () => confirmLeave(() => router.push('/dashboard/blogs'));

  const handleSaved = () => {
    router.push('/dashboard/blogs');
  };

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
