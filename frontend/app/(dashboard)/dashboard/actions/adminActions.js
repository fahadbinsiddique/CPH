'use server';

import { revalidatePath, revalidateTag } from 'next/cache';
import api from '@/lib/api';

export async function fetchAdminStats() {
  try {
    const response = await api.get('/api/admin/appointments/stats/');
    return response.data;
  } catch (error) {
    console.error('Failed to fetch admin stats:', error);
    return null;
  }
}

export async function fetchAdminAppointments() {
  try {
    const response = await api.get('/api/appointments/');
    return response.data.results || response.data;
  } catch (error) {
    console.error('Failed to fetch admin appointments:', error);
    return [];
  }
}