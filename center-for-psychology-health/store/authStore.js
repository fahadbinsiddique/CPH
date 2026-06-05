import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import api from '@/lib/api';

const useAuthStore = create(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,

      register: async (data) => {
        set({ isLoading: true, error: null });
        try {
          const res = await api.post('/api/auth/register/', data);
          set({
            user: res.data.user,
            isAuthenticated: true,
            isLoading: false,
          });
          return { success: true };
        } catch (err) {
          const error = err.response?.data || { error: 'Registration failed' };
          set({ error, isLoading: false });
          return { success: false, error };
        }
      },

      login: async (data) => {
        set({ isLoading: true, error: null });
        try {
          const res = await api.post('/api/auth/login/', data);
          set({
            user: res.data.user,
            isAuthenticated: true,
            isLoading: false,
          });
          return { success: true, user: res.data.user };
        } catch (err) {
          const error = err.response?.data || { error: 'Login failed' };
          set({ error, isLoading: false });
          return { success: false, error };
        }
      },

      logout: async () => {
        try {
          await api.post('/api/auth/logout/');
        } finally {
          set({ user: null, isAuthenticated: false });
        }
      },

      fetchMe: async () => {
        try {
          const res = await api.get('/api/auth/me/');
          set({ user: res.data, isAuthenticated: true });
        } catch {
          set({ user: null, isAuthenticated: false });
        }
      },

      clearError: () => set({ error: null }),
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({
        user: state.user,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);

export default useAuthStore;