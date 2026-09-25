'use server';

import { revalidateTag, revalidatePath } from 'next/cache';
import serverApi from '@/lib/serverApi';
import { CACHE_TAGS } from './cacheTags';

/**
 * Fetch admin stats with cache tag for ISR
 * Revalidated on appointment/consultant/user mutations
 */
export async function fetchAdminStats(options = {}) {
  const { cache = 'force-cache', tags = [CACHE_TAGS.ADMIN_STATS] } = options;
  
  try {
    const data = await serverApi.get('/api/admin/appointments/stats/', { 
      next: { cache, tags } 
    });
    return data;
  } catch (error) {
    console.error('[fetchAdminStats] Failed:', error);
    return null;
  }
}

/**
 * Fetch all appointments for admin view
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
 * Fetch user management stats
 */
export async function fetchUserStats(options = {}) {
  const { cache = 'force-cache', tags = [CACHE_TAGS.USERS] } = options;
  
  try {
    const data = await serverApi.get('/api/admin/users/stats/', { 
      next: { cache, tags } 
    });
    return data;
  } catch (error) {
    console.error('[fetchUserStats] Failed:', error);
    return null;
  }
}

/**
 * Revalidate all dashboard-related caches
 * Call after bulk operations or when cross-cutting changes occur
 */
export async function revalidateDashboard() {
  revalidateTag(CACHE_TAGS.APPOINTMENTS);
  revalidateTag(CACHE_TAGS.ADMIN_STATS);
  revalidateTag(CACHE_TAGS.CONSULTANTS);
  revalidateTag(CACHE_TAGS.USERS);
  revalidatePath('/dashboard');
  revalidatePath('/dashboard/appointments');
  revalidatePath('/dashboard/users');
  revalidatePath('/dashboard/consultants');
}