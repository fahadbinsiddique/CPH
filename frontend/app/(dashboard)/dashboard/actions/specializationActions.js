'use server';

import { revalidatePath } from 'next/cache';
import api from '@/lib/api';

export async function fetchSpecializations() {
  try {
    const response = await api.get('/api/admin/consultants/specializations/');
    return response.data;
  } catch (error) {
    console.error('Failed to fetch specializations:', error);
    return [];
  }
}

export async function createSpecialization(data) {
  try {
    const response = await api.post('/api/admin/consultants/specializations/', data);
    revalidatePath('/dashboard/specializations');
    return { success: true, data: response.data };
  } catch (error) {
    const message = error.response?.data?.name?.[0] || 'Failed to create specialization.';
    return { success: false, error: message };
  }
}

export async function updateSpecialization(id, data) {
  try {
    const response = await api.patch(`/api/admin/consultants/specializations/${id}/`, data);
    revalidatePath('/dashboard/specializations');
    return { success: true, data: response.data };
  } catch (error) {
    const message = error.response?.data?.name?.[0] || 'Failed to update specialization.';
    return { success: false, error: message };
  }
}

export async function deleteSpecialization(id) {
  try {
    await api.delete(`/api/admin/consultants/specializations/${id}/`);
    revalidatePath('/dashboard/specializations');
    return { success: true };
  } catch (error) {
    return { success: false, error: 'Failed to delete specialization.' };
  }
}
