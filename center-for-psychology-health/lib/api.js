// lib/api.js

import axios from "axios";


// ==========================================
// Create Axios Instance
// ==========================================
const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,

  // Cookie automatically send/receive করবে
  withCredentials: true,

  // Request timeout after 10 seconds
  timeout: 10000,

  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});


// ==========================================
// Response Interceptor
// ==========================================

api.interceptors.response.use(

  // =========================
  // Success Response
  // =========================
  (response) => response,


  // =========================
  // Error Response
  // =========================
  async (error) => {

    // Original request store করা হচ্ছে
    const originalRequest = error.config;

    /**
     * access token expire হলে backend 401 দিবে
     *
     * তখন:
     * 1. refresh token দিয়ে নতুন access token নিবে
     * 2. old request আবার retry করবে
     */

    if (
      error.response?.status === 401 &&
      !originalRequest._retry
    ) {

      // Infinite loop prevent
      originalRequest._retry = true;

      try {

        // ==========================================
        // Get New Access Token
        // ==========================================
        await api.post("/api/auth/refresh/");

        // ==========================================
        // Retry Previous Request
        // ==========================================
        return api(originalRequest);

      } catch (refreshError) {

        /**
         * যদি refresh token ও expire হয়ে যায়
         * তাহলে user কে login page এ পাঠানো হবে
         */

        window.location.href = "/auth/login";

        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export default api;