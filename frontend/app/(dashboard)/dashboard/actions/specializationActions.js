'use server';

import { revalidatePath, revalidateTag } from 'next/cache';
import serverApi from '@/lib/serverApi';
import { CACHE_TAGS } from './cacheTags';

export async function fetchSpecializations() {
  try {
    // Shares the CONSULTANTS tag: verifyConsultant/createConsultant in
    // consultantActions invalidate this list too.
    const data = await serverApi.get('/api/admin/consultants/specializations/', {
      next: { revalidate: 60, tags: [CACHE_TAGS.CONSULTANTS] },
    });
    return data;
  } catch (error) {
    console.error('Failed to fetch specializations:', error);
    return [];
  }
}

export async function createSpecialization(data) {
  try {
    const result = await serverApi.post('/api/admin/consultants/specializations/', data);
    revalidateTag(CACHE_TAGS.CONSULTANTS);
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
    revalidateTag(CACHE_TAGS.CONSULTANTS);
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
    revalidateTag(CACHE_TAGS.CONSULTANTS);
    revalidatePath('/dashboard/specializations');
    return { success: true };
  } catch (error) {
    return { success: false, error: error.message || 'Failed to delete specialization.' };
  }
}
