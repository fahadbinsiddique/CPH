'use server';

import serverApi from '@/lib/serverApi';

export async function fetchUsers() {
  try {
    const data = await serverApi.get('/api/admin/users/');
    return data.results || data;
  } catch (error) {
    console.error('Failed to fetch users:', error);
    return [];
  }
}
