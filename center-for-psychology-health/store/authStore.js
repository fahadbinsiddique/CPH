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
          // 🚀 ব্যাকএন্ডের ডাবল নেস্টিং জট ভেঙে সরাসরি ইউজার অবজেক্ট বের করা হলো
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
          // 🚀 ব্যাকএন্ডের ডাবল নেস্টিং জট ভেঙে সরাসরি ইউজার অবজেক্ট বের করা হলো
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

      // logout: async () => {
      //   try {
      //     await api.post('/api/auth/logout/');
      //   } finally {
      //     set({ user: null, isAuthenticated: false, error: null });
      //     if (typeof window !== 'undefined') {
      //       // 🚀 Zustand-এর অফিশিয়াল মেথড দিয়ে স্টোরেজ পুরোপুরি ক্লিয়ার করুন
      //       useAuthStore.persist.clear(); 
      //       window.location.href = '/';
      //     }
      //   }
      // },

      logout: async () => {
        try {
          // জ্যাঙ্গো ব্যাকএন্ডে লগআউট রিকোয়েস্ট পাঠান
          await api.post('/api/auth/logout/');
        } catch (err) {
          // যদি ব্যাকএন্ড কোনো কারণে ৪০০ বা ৫০0 এরর দেয়, 
          // তাও ফ্রন্টএন্ড লগআউট প্রসেস যেন আটকে না থাকে
          console.warn("Backend logout endpoint failed or session already cleared:", err);
        } finally {
          // ১. ফ্রন্টএন্ড স্টেট পুরোপুরি রিসেট করুন
          set({ user: null, isAuthenticated: false, error: null });
          
          if (typeof window !== 'undefined') {

            // ৩. 🚀 কুকি বোমা: ব্রাউজারের সমস্ত সম্ভাব্য টোকেন কুকি জোর করে ডিলিট করা
            // এখানে তোমার প্রজেক্টের আসল কুকির নাম (যেমন 'access', 'refresh', 'sessionid', 'csrftoken') বসাতে পারো।
            // নিচের লাইনগুলো ব্রাউজারকে বাধ্য করবে কুকিগুলোকে এক্ষুনি এক্সপায়ার করে দিতে।
            const cookiesToClear = ['access', 'refresh', 'access_token', 'refresh_token', 'csrftoken', 'sessionid'];
            
            cookiesToClear.forEach(cookieName => {
              // সাধারণ রুট, ড্যাশবোর্ড রুট এবং রুট ডোমেইন সবখান থেকে ক্লিয়ার করা হচ্ছে
              document.cookie = `${cookieName}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
              document.cookie = `${cookieName}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/dashboard;`;
            });
            
            // ২. 🚀 Zustand-এর আসল স্টোরেজ ক্লিয়ার করার মেথড (FIXED)
            useAuthStore.persist.clearStorage(); 
            
            // ৩. ড্রয়ার সিস্টেমে যেহেতু মেইন হোমপেজে লগইন আছে, তাই সরাসরি রুটে পাঠান
            window.location.href = '/';
          }
        }
      },

      fetchMe: async () => {
        try {
          const res = await api.get('/api/auth/me/');
          // 🚀 fetchMe তেও নেস্টিং সেফটি দেওয়া হলো
          const actualUser = res.data.user || res.data;
          set({ user: actualUser, isAuthenticated: true });
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
      // 🚀 এটি রিফ্রেশ দিলে লোকাল স্টোরেজ থেকে মেমরিতে ডাটা রিলোড হওয়া নিশ্চিত করে
      onRehydrateStorage: () => (state) => {
        if (state) {
          state.isLoading = false;
        }
      },
    }
  )
);

export default useAuthStore;