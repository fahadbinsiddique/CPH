'use server';

import api from '@/lib/api';

export async function fetchUsers() {
  try {
    const response = await api.get('/api/admin/users/');
    return response.data.results || response.data;
  } catch (error) {
    console.error('Failed to fetch users:', error);
    return [];
  }
}
