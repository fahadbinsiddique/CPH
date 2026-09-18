'use server';

import { revalidatePath } from 'next/cache';
import serverApi from '@/lib/serverApi';

export async function fetchBlogs() {
  try {
    const data = await serverApi.get('/api/admin/blogs/');
    return data;
  } catch (error) {
    console.error('Failed to fetch blogs:', error);
    return [];
  }
}

export async function fetchBlogById(id) {
  try {
    const data = await serverApi.get(`/api/admin/blogs/${id}/`);
    return data;
  } catch (error) {
    console.error('Failed to fetch blog:', error);
    return null;
  }
}

export async function deleteBlog(id) {
  try {
    await serverApi.delete(`/api/admin/blogs/${id}/`);
    revalidatePath('/dashboard/blogs');
    return { success: true };
  } catch (error) {
    console.error('Failed to delete blog:', error);
    return { success: false, error: error.message || 'Failed to delete blog post' };
  }
}
