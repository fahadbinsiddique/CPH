// lib/api.js

import axios from 'axios'
import useAuthStore from '@/store/authStore' // Zustand store

// ==========================================
// অপশন ১: Chrome DevTools Console Watermark
// ==========================================
if (typeof window !== 'undefined') {
  console.log(
    '%c (◣ _ ◢) Developed By: Fahad Bin Siddique',
    'background: #1e1e2f; color: #00ffcc; padding: 6px 12px; border-radius: 8px; font-weight: bold; font-family: sans-serif;'
  );
}


// Create Axios Instance

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,

  // Cookie automatically send/receive করবে
  withCredentials: true,

  // Request timeout after 10 seconds
  timeout: 10000,

  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
    
  },
})

// Response Interceptor

api.interceptors.response.use(
  // Success Response

  (response) => response,

  // Error Response

  async (error) => {
    // Original request store করা হচ্ছে
    const originalRequest = error.config

    /**
     * access token expire হলে backend 401 দিবে
     *
     * তখন:
     * 1. refresh token দিয়ে নতুন access token নিবে
     * 2. old request আবার retry করবে
     */

    if (
      error.response?.status === 401 &&
      !originalRequest._retry &&
      !originalRequest.url.includes('/api/auth/refresh/')
    ) {
      // Infinite loop prevent
      originalRequest._retry = true

      try {
        // Get New Access Token

        await api.post('/api/auth/refresh/')

        // Retry Previous Request

        return api(originalRequest)
      } catch (refreshError) {
        /**
         * যদি refresh token ও expire হয়ে যায়, তবে লুপ বন্ধ করতে হবে
         */
        if (typeof window !== 'undefined') {
          // ১. Zustand-এর মেমরি স্টেট ক্লিন করুন যাতে পুরোনো এরর আটকে না থাকে
          useAuthStore.getState().clearError()
          
          // ২. সরাসরি Zustand-এর logout না ডেকে ম্যানুয়ালি স্টেট রিসেট করুন 
          // যাতে ব্যাকগ্রাউন্ডে বারবার /api/auth/logout/ এপিআই কল হয়ে লুপ না হয়
          useAuthStore.setState({ user: null, isAuthenticated: false })

          // ৩. লোকাল স্টোরেজ থেকে জোরপূর্বক কি-টি মুছে দিন যাতে AuthGuard আর ফলস ডাটা না পায়
          localStorage.removeItem('auth-storage');

          // 4. ইউজারকে ধাক্কা দিয়ে মেইন হোমপেজে পাঠিয়ে দিন
          window.location.href = '/'
        }

        return Promise.reject(refreshError)
      }
    }

    return Promise.reject(error)
  },
)

export default api
