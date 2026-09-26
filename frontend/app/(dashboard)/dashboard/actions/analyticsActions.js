'use server';

import serverApi from '@/lib/serverApi';
import { CACHE_TAGS } from './cacheTags';

export async function fetchAnalytics(days = 30) {
  try {
    // Tagged APPOINTMENTS because every series here is derived from
    // appointment rows — so the revalidateTag(CACHE_TAGS.APPOINTMENTS) calls
    // in appointmentActions invalidate this chart too. `revalidate` is
    // repeated because passing `next` replaces serverApi's default rather
    // than merging into it.
    const data = await serverApi.get('/api/admin/appointments/analytics/', {
      params: { days },
      next: { revalidate: 60, tags: [CACHE_TAGS.APPOINTMENTS] },
    });
    return data;
  } catch (error) {
    console.error('Failed to fetch analytics:', error);
    return null;
  }
}
