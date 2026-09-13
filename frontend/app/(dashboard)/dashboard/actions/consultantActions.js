'use server';

import { revalidatePath, revalidateTag } from 'next/cache';
import api from '@/lib/api';

export async function verifyConsultant(id, value) {
  try {
    const response = await api.patch(`/api/admin/consultants/${id}/verify/`, { is_verified: value });
    revalidateTag('consultants');
    revalidatePath('/dashboard/consultants');
    revalidatePath('/dashboard');
    return { success: true, data: response.data };
  } catch (error) {
    console.error('Failed to verify consultant:', error);
    return { success: false, error: 'Failed to update verification status' };
  }
}

export async function deleteConsultant(id) {
  try {
    await api.delete(`/api/admin/consultants/${id}/`);
    revalidateTag('consultants');
    revalidatePath('/dashboard/consultants');
    revalidatePath('/dashboard');
    return { success: true };
  } catch (error) {
    console.error('Failed to delete consultant:', error);
    return { success: false, error: 'Failed to delete consultant' };
  }
}

export async function createConsultant(formData) {
  try {
    const response = await api.post('/api/admin/consultants/create/', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    revalidateTag('consultants');
    revalidatePath('/dashboard/consultants');
    revalidatePath('/dashboard');
    return { success: true, data: response.data };
  } catch (error) {
    console.error('Failed to create consultant:', error);
    const data = error.response?.data;
    const availabilityMsg = Array.isArray(data?.availability)
      ? data.availability.join(' ')
      : typeof data?.availability === 'string'
      ? data.availability
      : '';
    return {
      success: false,
      error:
        data?.email?.[0] ||
        availabilityMsg ||
        data?.detail ||
        'Failed to create consultant.',
    };
  }
}

export async function updateConsultant(id, formData) {
  try {
    const response = await api.patch(`/api/admin/consultants/${id}/`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    revalidateTag('consultants');
    revalidatePath('/dashboard/consultants');
    revalidatePath('/dashboard');
    return { success: true, data: response.data };
  } catch (error) {
    console.error('Failed to update consultant:', error);
    const data = error.response?.data;
    const availabilityMsg = Array.isArray(data?.availability)
      ? data.availability.join(' ')
      : typeof data?.availability === 'string'
      ? data.availability
      : '';
    return {
      success: false,
      error:
        data?.email?.[0] ||
        availabilityMsg ||
        data?.detail ||
        'Failed to update consultant.',
    };
  }
}

export async function fetchConsultants() {
  try {
    const response = await api.get('/api/admin/consultants/');
    return response.data.results || response.data;
  } catch (error) {
    console.error('Failed to fetch consultants:', error);
    return [];
  }
}

export async function fetchSpecializations() {
  try {
    const response = await api.get('/api/admin/consultants/specializations/');
    return response.data;
  } catch (error) {
    console.error('Failed to fetch specializations:', error);
    return [];
  }
}