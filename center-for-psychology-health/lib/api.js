// lib/api.js

import axios from 'axios'
import useAuthStore from '@/store/authStore'

// Development console watermark.
if (typeof window !== 'undefined') {
  console.log(
    '%c (◣ _ ◢) Developed By: Fahad Bin Siddique',
    'background: #1e1e2f; color: #00ffcc; padding: 6px 12px; border-radius: 8px; font-weight: bold; font-family: sans-serif;'
  );
}


// Create the Axios instance.

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,

  // Automatically send and receive cookies.
  withCredentials: true,

  // Request timeout after 10 seconds.
  timeout: 10000,

  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
    
  },
})

// Response interceptor.

api.interceptors.response.use(
  // Successful response.

  (response) => response,

  // Error response.

  async (error) => {
    // Preserve the original request before retrying.
    const originalRequest = error.config

    /**
     * The backend returns 401 when the access token has expired.
     *
     * In that case:
     * 1. A refresh token is used to obtain a new access token.
     * 2. The original request is retried.
     */

    if (
      error.response?.status === 401 &&
      !originalRequest._retry &&
      !originalRequest.url.includes('/api/auth/refresh/')
    ) {
      // Prevent retry loops.
      originalRequest._retry = true

      try {
        // Get a new access token.

        await api.post('/api/auth/refresh/')

        // Retry the previous request.

        return api(originalRequest)
      } catch (refreshError) {
        /**
         * If the refresh token is also expired, stop the retry loop.
         */
        if (typeof window !== 'undefined') {
          // Clear the in-memory auth state so stale errors do not persist.
          useAuthStore.getState().clearError()
          
          // Reset the auth state manually instead of calling logout repeatedly in the background.
          useAuthStore.setState({ user: null, isAuthenticated: false })

          // Remove the persisted auth data so the guard does not receive stale values.
          localStorage.removeItem('auth-storage');

          // Send the user back to the home page.
          window.location.href = '/'
        }

        return Promise.reject(refreshError)
      }
    }

    return Promise.reject(error)
  },
)

export default api
