'use server';

import { revalidatePath } from 'next/cache';
import serverApi from '@/lib/serverApi';

export async function fetchSpecializations() {
  try {
    const data = await serverApi.get('/api/admin/consultants/specializations/');
    return data;
  } catch (error) {
    console.error('Failed to fetch specializations:', error);
    return [];
  }
}

export async function createSpecialization(data) {
  try {
    const result = await serverApi.post('/api/admin/consultants/specializations/', data);
    revalidatePath('/dashboard/specializations');
    return { success: true, data: result };
  } catch (error) {
    const message = error.data?.name?.[0] || error.message || 'Failed to create specialization.';
    return { success: false, error: message };
  }
}

export async function updateSpecialization(id, data) {
  try {
    const result = await serverApi.patch(`/api/admin/consultants/specializations/${id}/`, data);
    revalidatePath('/dashboard/specializations');
    return { success: true, data: result };
  } catch (error) {
    const message = error.data?.name?.[0] || error.message || 'Failed to update specialization.';
    return { success: false, error: message };
  }
}

export async function deleteSpecialization(id) {
  try {
    await serverApi.delete(`/api/admin/consultants/specializations/${id}/`);
    revalidatePath('/dashboard/specializations');
    return { success: true };
  } catch (error) {
    return { success: false, error: error.message || 'Failed to delete specialization.' };
  }
}
