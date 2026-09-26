'use server';

import { revalidatePath, revalidateTag } from 'next/cache';
import serverApi from '@/lib/serverApi';
import { CACHE_TAGS } from './cacheTags';

export async function fetchBlogs() {
  try {
    // Matching tag so deleteBlog/create/update below can invalidate this
    // entry; previously fetchBlogs carried no tag, so revalidation never
    // reached it.
    const data = await serverApi.get('/api/admin/blogs/', {
      next: { revalidate: 60, tags: [CACHE_TAGS.BLOGS] },
    });
    return data;
  } catch (error) {
    console.error('Failed to fetch blogs:', error);
    return [];
  }
}

export async function fetchBlogById(id) {
  try {
    const data = await serverApi.get(`/api/admin/blogs/${id}/`, {
      next: { revalidate: 60, tags: [CACHE_TAGS.BLOGS] },
    });
    return data;
  } catch (error) {
    console.error('Failed to fetch blog:', error);
    return null;
  }
}

export async function deleteBlog(id) {
  try {
    await serverApi.delete(`/api/admin/blogs/${id}/`);
    revalidateTag(CACHE_TAGS.BLOGS);
    revalidatePath('/dashboard/blogs');
    return { success: true };
  } catch (error) {
    console.error('Failed to delete blog:', error);
    return { success: false, error: error.message || 'Failed to delete blog post' };
  }
}
