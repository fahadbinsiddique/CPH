'use server';

import { revalidatePath, revalidateTag } from 'next/cache';
import serverApi from '@/lib/serverApi';

export async function updateAppointmentStatus(id, status) {
  try {
    const data = await serverApi.patch(`/api/appointments/${id}/status/`, { status });
    revalidateTag('appointments');
    revalidatePath('/dashboard/appointments');
    revalidatePath('/dashboard');
    return { success: true, data };
  } catch (error) {
    console.error('Failed to update appointment status:', error);
    return { success: false, error: error.message || 'Failed to update appointment status' };
  }
}

export async function addAppointmentNote(id, notes) {
  try {
    const data = await serverApi.patch(`/api/appointments/${id}/status/`, { notes });
    revalidateTag('appointments');
    revalidatePath('/dashboard/appointments');
    revalidatePath('/dashboard');
    return { success: true, data };
  } catch (error) {
    console.error('Failed to add appointment note:', error);
    return { success: false, error: error.message || 'Failed to save note' };
  }
}

export async function cancelAppointment(id) {
  try {
    const data = await serverApi.patch(`/api/appointments/${id}/status/`, { status: 'cancelled' });
    revalidateTag('appointments');
    revalidatePath('/dashboard/appointments');
    revalidatePath('/dashboard/bookings');
    revalidatePath('/dashboard');
    return { success: true, data };
  } catch (error) {
    console.error('Failed to cancel appointment:', error);
    return { success: false, error: error.message || 'Failed to cancel appointment' };
  }
}

export async function fetchAppointments() {
  try {
    const data = await serverApi.get('/api/appointments/');
    return data.results || data;
  } catch (error) {
    console.error('Failed to fetch appointments:', error);
    return [];
  }
}
