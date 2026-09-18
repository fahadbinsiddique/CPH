'use server';

import { revalidatePath, revalidateTag } from 'next/cache';
import serverApi from '@/lib/serverApi';

export async function fetchAdminStats() {
  try {
    const data = await serverApi.get('/api/admin/appointments/stats/');
    return data;
  } catch (error) {
    console.error('Failed to fetch admin stats:', error);
    return null;
  }
}

export async function fetchAdminAppointments() {
  try {
    const data = await serverApi.get('/api/appointments/');
    return data.results || data;
  } catch (error) {
    console.error('Failed to fetch admin appointments:', error);
    return [];
  }
}
