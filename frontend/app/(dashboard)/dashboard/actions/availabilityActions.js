'use server';

import { revalidatePath } from 'next/cache';
import api from '@/lib/api';

export async function fetchAvailability() {
  try {
    const response = await api.get('/api/consultants/availability/');
    return response.data;
  } catch (error) {
    console.error('Failed to fetch availability:', error);
    return [];
  }
}

export async function createAvailability(data) {
  try {
    const response = await api.post('/api/consultants/availability/', data);
    revalidatePath('/dashboard/availability');
    return { success: true, data: response.data };
  } catch (error) {
    const message = error.response?.data?.detail || 'Failed to add schedule.';
    return { success: false, error: message };
  }
}

export async function deleteAvailability(id) {
  try {
    await api.delete(`/api/consultants/availability/${id}/`);
    revalidatePath('/dashboard/availability');
    return { success: true };
  } catch (error) {
    return { success: false, error: 'Failed to delete schedule.' };
  }
}
