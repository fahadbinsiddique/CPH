'use server';

import serverApi from '@/lib/serverApi';

export async function fetchAnalytics(days = 30) {
  try {
    const data = await serverApi.get('/api/admin/appointments/analytics/', {
      params: { days },
    });
    return data;
  } catch (error) {
    console.error('Failed to fetch analytics:', error);
    return null;
  }
}
