'use server';

import { revalidatePath } from 'next/cache';
import api from '@/lib/api';

export async function fetchBlogs() {
  try {
    const response = await api.get('/api/admin/blogs/');
    return response.data;
  } catch (error) {
    console.error('Failed to fetch blogs:', error);
    return [];
  }
}

export async function fetchBlogById(id) {
  try {
    const response = await api.get(`/api/admin/blogs/${id}/`);
    return response.data;
  } catch (error) {
    console.error('Failed to fetch blog:', error);
    return null;
  }
}

export async function deleteBlog(id) {
  try {
    await api.delete(`/api/admin/blogs/${id}/`);
    revalidatePath('/dashboard/blogs');
    return { success: true };
  } catch (error) {
    console.error('Failed to delete blog:', error);
    return { success: false, error: 'Failed to delete blog post' };
  }
}
