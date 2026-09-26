'use server';

import serverApi from '@/lib/serverApi';
import { CACHE_TAGS } from './cacheTags';

export async function fetchUsers() {
  try {
    // Tagged so revalidateTag(CACHE_TAGS.USERS) in adminActions can reach it.
    const data = await serverApi.get('/api/admin/users/', {
      next: { revalidate: 60, tags: [CACHE_TAGS.USERS] },
    });
    return data.results || data;
  } catch (error) {
    console.error('Failed to fetch users:', error);
    return [];
  }
}
