'use client';

import { useRouter } from 'next/navigation';
import { ArrowLeft, PenLine } from 'lucide-react';
import { motion } from 'framer-motion';
import AuthGuard from '@/components/shared/AuthGuard';
import PageHeader from '@/components/dashboard/ui/PageHeader';
import BlogForm from '@/components/dashboard/blogs/BlogForm';
import useUnsavedChanges from '@/hooks/useUnsavedChanges';

export default function CreateBlogPage() {
  const router = useRouter();
  const { setDirty, confirmLeave, dialog } = useUnsavedChanges();

  const goBack = () => confirmLeave(() => router.push('/dashboard/blogs'));

  const handleSaved = (saved) => {
    if (saved?.cancel) {
      router.push('/dashboard/blogs');
      return;
    }
    router.push('/dashboard/blogs');
  };

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
          badgeIcon={PenLine}
          title="Write a New Post"
          subtitle="Draft, format and publish your next article with the rich editor."
        />

        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
        >
          <BlogForm
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
