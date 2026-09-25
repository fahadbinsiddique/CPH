'use server';

import { revalidateTag, revalidatePath } from 'next/cache';
import serverApi from '@/lib/serverApi';
import { CACHE_TAGS } from './cacheTags';

/**
 * Update appointment status with optimistic updates support
 */
export async function updateAppointmentStatus(id, status) {
  try {
    const data = await serverApi.patch(`/api/appointments/${id}/status/`, { status });
    
    // Targeted revalidation - only invalidate what changed
    revalidateTag(CACHE_TAGS.APPOINTMENTS);
    revalidatePath('/dashboard/appointments');
    revalidatePath('/dashboard/bookings');
    revalidatePath('/dashboard');
    
    return { success: true, data };
  } catch (error) {
    console.error('[updateAppointmentStatus] Failed:', error);
    return { 
      success: false, 
      error: error.message || 'Failed to update appointment status',
      code: error.code || 'UPDATE_FAILED'
    };
  }
}

/**
 * Add notes to appointment
 */
export async function addAppointmentNote(id, notes) {
  try {
    const data = await serverApi.patch(`/api/appointments/${id}/status/`, { notes });
    revalidateTag(CACHE_TAGS.APPOINTMENTS);
    revalidatePath('/dashboard/appointments');
    revalidatePath('/dashboard');
    return { success: true, data };
  } catch (error) {
    console.error('[addAppointmentNote] Failed:', error);
    return { success: false, error: error.message || 'Failed to save note' };
  }
}

/**
 * Cancel appointment
 */
export async function cancelAppointment(id) {
  try {
    const data = await serverApi.patch(`/api/appointments/${id}/status/`, { status: 'cancelled' });
    revalidateTag(CACHE_TAGS.APPOINTMENTS);
    revalidatePath('/dashboard/appointments');
    revalidatePath('/dashboard/bookings');
    revalidatePath('/dashboard');
    return { success: true, data };
  } catch (error) {
    console.error('[cancelAppointment] Failed:', error);
    return { success: false, error: error.message || 'Failed to cancel appointment' };
  }
}

/**
 * Fetch appointments with cache tag for ISR support
 * Uses force-cache by default, revalidated via tags on mutations
 */
export async function fetchAppointments(options = {}) {
  const { cache = 'force-cache', tags = [CACHE_TAGS.APPOINTMENTS] } = options;
  
  try {
    const data = await serverApi.get('/api/appointments/', { 
      next: { cache, tags } 
    });
    return data.results || data;
  } catch (error) {
    console.error('[fetchAppointments] Failed:', error);
    return [];
  }
}

/**
 * Fetch appointments for admin (all appointments)
 */
export async function fetchAdminAppointments(options = {}) {
  const { cache = 'force-cache', tags = [CACHE_TAGS.APPOINTMENTS] } = options;
  
  try {
    const data = await serverApi.get('/api/appointments/', { 
      next: { cache, tags } 
    });
    return data.results || data;
  } catch (error) {
    console.error('[fetchAdminAppointments] Failed:', error);
    return [];
  }
}

/**
 * Fetch single appointment by ID
 */
export async function fetchAppointmentById(id, options = {}) {
  const { cache = 'force-cache', tags = [CACHE_TAGS.APPOINTMENTS] } = options;
  
  try {
    const data = await serverApi.get(`/api/appointments/${id}/`, { 
      next: { cache, tags } 
    });
    return data;
  } catch (error) {
    console.error('[fetchAppointmentById] Failed:', error);
    return null;
  }
}