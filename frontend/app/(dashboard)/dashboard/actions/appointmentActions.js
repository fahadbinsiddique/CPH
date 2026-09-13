'use server';

import { revalidatePath, revalidateTag } from 'next/cache';
import api from '@/lib/api';

export async function updateAppointmentStatus(id, status) {
  try {
    const response = await api.patch(`/api/appointments/${id}/status/`, { status });
    revalidateTag('appointments');
    revalidatePath('/dashboard/appointments');
    revalidatePath('/dashboard');
    return { success: true, data: response.data };
  } catch (error) {
    console.error('Failed to update appointment status:', error);
    return { success: false, error: 'Failed to update appointment status' };
  }
}

export async function addAppointmentNote(id, notes) {
  try {
    const response = await api.patch(`/api/appointments/${id}/status/`, { notes });
    revalidateTag('appointments');
    revalidatePath('/dashboard/appointments');
    revalidatePath('/dashboard');
    return { success: true, data: response.data };
  } catch (error) {
    console.error('Failed to add appointment note:', error);
    return { success: false, error: 'Failed to save note' };
  }
}

export async function fetchAppointments() {
  try {
    const response = await api.get('/api/appointments/');
    return response.data.results || response.data;
  } catch (error) {
    console.error('Failed to fetch appointments:', error);
    return [];
  }
}