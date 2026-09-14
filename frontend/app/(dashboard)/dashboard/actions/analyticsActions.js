'use server';

import api from '@/lib/api';

export async function fetchAnalytics(days = 30) {
  try {
    const response = await api.get('/api/admin/appointments/analytics/', {
      params: { days },
    });
    return response.data;
  } catch (error) {
    console.error('Failed to fetch analytics:', error);
    return null;
  }
}
