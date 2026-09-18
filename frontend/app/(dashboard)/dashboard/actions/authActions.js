'use server';

import serverApi from '@/lib/serverApi';

export async function updateProfile(formData) {
  try {
    const data = await serverApi.patch('/api/auth/me/update/', formData);
    return { success: true, data };
  } catch (error) {
    return {
      success: false,
      error: error.data?.detail || error.message || 'Failed to update profile.',
    };
  }
}

export async function changePassword(old_password, new_password) {
  try {
    await serverApi.post('/api/auth/change-password/', { old_password, new_password });
    return { success: true };
  } catch (error) {
    return {
      success: false,
      error: error.data?.error || error.message || 'Failed to change password.',
    };
  }
}
