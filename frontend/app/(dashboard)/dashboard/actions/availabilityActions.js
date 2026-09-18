'use server';

import { revalidatePath } from 'next/cache';
import serverApi from '@/lib/serverApi';

export async function fetchAvailability() {
  try {
    const data = await serverApi.get('/api/consultants/availability/');
    return data;
  } catch (error) {
    console.error('Failed to fetch availability:', error);
    return [];
  }
}

export async function createAvailability(data) {
  try {
    const result = await serverApi.post('/api/consultants/availability/', data);
    revalidatePath('/dashboard/availability');
    return { success: true, data: result };
  } catch (error) {
    const message = error.data?.detail || error.message || 'Failed to add schedule.';
    return { success: false, error: message };
  }
}

export async function deleteAvailability(id) {
  try {
    await serverApi.delete(`/api/consultants/availability/${id}/`);
    revalidatePath('/dashboard/availability');
    return { success: true };
  } catch (error) {
    return { success: false, error: error.message || 'Failed to delete schedule.' };
  }
}
