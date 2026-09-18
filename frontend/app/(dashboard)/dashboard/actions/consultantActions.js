'use server';

import { revalidatePath, revalidateTag } from 'next/cache';
import serverApi from '@/lib/serverApi';

export async function verifyConsultant(id, value) {
  try {
    const data = await serverApi.patch(`/api/admin/consultants/${id}/verify/`, { is_verified: value });
    revalidateTag('consultants');
    revalidatePath('/dashboard/consultants');
    revalidatePath('/dashboard');
    return { success: true, data };
  } catch (error) {
    console.error('Failed to verify consultant:', error);
    return { success: false, error: error.message || 'Failed to update verification status' };
  }
}

export async function deleteConsultant(id) {
  try {
    await serverApi.delete(`/api/admin/consultants/${id}/`);
    revalidateTag('consultants');
    revalidatePath('/dashboard/consultants');
    revalidatePath('/dashboard');
    return { success: true };
  } catch (error) {
    console.error('Failed to delete consultant:', error);
    return { success: false, error: error.message || 'Failed to delete consultant' };
  }
}

export async function createConsultant(formData) {
  try {
    const data = await serverApi.post('/api/admin/consultants/create/', formData);
    revalidateTag('consultants');
    revalidatePath('/dashboard/consultants');
    revalidatePath('/dashboard');
    return { success: true, data };
  } catch (error) {
    console.error('Failed to create consultant:', error);
    const errData = error.data;
    const availabilityMsg = Array.isArray(errData?.availability)
      ? errData.availability.join(' ')
      : typeof errData?.availability === 'string'
        ? errData.availability
        : '';
    return {
      success: false,
      error:
        errData?.email?.[0] ||
        availabilityMsg ||
        errData?.detail ||
        error.message ||
        'Failed to create consultant.',
    };
  }
}

export async function updateConsultant(id, formData) {
  try {
    const data = await serverApi.patch(`/api/admin/consultants/${id}/`, formData);
    revalidateTag('consultants');
    revalidatePath('/dashboard/consultants');
    revalidatePath('/dashboard');
    return { success: true, data };
  } catch (error) {
    console.error('Failed to update consultant:', error);
    const errData = error.data;
    const availabilityMsg = Array.isArray(errData?.availability)
      ? errData.availability.join(' ')
      : typeof errData?.availability === 'string'
        ? errData.availability
        : '';
    return {
      success: false,
      error:
        errData?.email?.[0] ||
        availabilityMsg ||
        errData?.detail ||
        error.message ||
        'Failed to update consultant.',
    };
  }
}

export async function fetchConsultants() {
  try {
    const data = await serverApi.get('/api/admin/consultants/');
    return data.results || data;
  } catch (error) {
    console.error('Failed to fetch consultants:', error);
    return [];
  }
}

export async function fetchSpecializations() {
  try {
    const data = await serverApi.get('/api/admin/consultants/specializations/');
    return data;
  } catch (error) {
    console.error('Failed to fetch specializations:', error);
    return [];
  }
}
