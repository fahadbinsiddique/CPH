import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import api from '@/lib/api';

const useAuthStore = create(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,
      isLoading: false,
      isHydrated: false,
      error: null,

      register: async (data) => {
        set({ isLoading: true, error: null });
        try {
          const res = await api.post('/api/auth/register/', data);
          // Extract the user object directly to avoid double-nesting from the backend.
          const actualUser = res.data.user?.user || res.data.user;
          set({
            user: actualUser,
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
          // Extract the user object directly to avoid double-nesting from the backend.
          const actualUser = res.data.user?.user || res.data.user;
          set({
            user: actualUser,
            isAuthenticated: true,
            isLoading: false,
          });
          return { success: true, user: actualUser };
        } catch (err) {
          const error = err.response?.data || { error: 'Login failed' };
          set({ error, isLoading: false });
          return { success: false, error };
        }
      },

      logout: async () => {
        try {
          // Send the logout request to the Django backend.
          await api.post('/api/auth/logout/');
        } catch (err) {
          // Allow the frontend logout flow to continue even when the backend returns an error.
          console.warn("Backend logout endpoint failed or session already cleared:", err);
        } finally {
          // Reset the frontend auth state completely.
          set({ user: null, isAuthenticated: false, error: null, isHydrated: false });
          
          if (typeof window !== 'undefined') {

            // Clear common auth cookies from the browser.
            const cookiesToClear = ['access', 'refresh', 'access_token', 'refresh_token', 'csrftoken', 'sessionid'];
            
            cookiesToClear.forEach(cookieName => {
              // Clear cookies from the root path and dashboard path.
              document.cookie = `${cookieName}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
              document.cookie = `${cookieName}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/dashboard;`;
            });
            
            // Clear the persisted Zustand storage.
            useAuthStore.persist.clearStorage(); 
            
            // Redirect the user to the home page.
            window.location.href = '/';
          }
        }
      },

      fetchMe: async () => {
        try {
          const res = await api.get('/api/auth/me/');
          // Apply the same nesting safety to the fetchMe response.
          const actualUser = res.data.user || res.data;
          set({ user: actualUser, isAuthenticated: true });
        } catch {
          set({ user: null, isAuthenticated: false });
          // Do NOT remove 'auth-storage' here — a transient 401 during refresh
          // should not destroy the persisted session. Only explicit logout
          // (which already clears storage) should do that.
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
      // Reload the persisted state into memory after rehydration.
      onRehydrateStorage: () => (state) => {
        if (state) {
          state.isHydrated = true;
        }
      },
    }
  )
);

export default useAuthStore;
