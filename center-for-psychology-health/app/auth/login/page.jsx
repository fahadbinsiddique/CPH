"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation'; // ১. useRouter ইম্পোর্ট করুন
import { Eye, EyeOff, Mail, Lock } from 'lucide-react';

export default function LoginPage() {
  const router = useRouter(); // ২. হুকটি ইনিশিয়ালাইজ করুন
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [isLoading, setIsLoading] = useState(false); // লোডিং স্টেট

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      console.log("Login Data submitted:", formData);
      
      // -------------------------------------------------------------
      // এখানে পরে ব্যাকএন্ডের আসল এপিআই (authService.js) কল হবে।
      // আপাতত আমরা ১ সেকেন্ডের একটা নকল (Mock) সাকসেস লজিক বানাচ্ছি:
      // -------------------------------------------------------------
      await new Promise((resolve) => setTimeout(resolve, 1000)); 

      // ৩. লগইন সফল হলে ড্যাশবোর্ডে রিডাইরেক্ট করুন
      router.push('/'); 
      
    } catch (error) {
      console.error("Login failed:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="space-y-2 text-center lg:text-left">
        <h2 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">Welcome Back</h2>
        <p className="text-sm text-slate-500 dark:text-slate-400">Login to access your dashboard and sessions</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Email Field */}
        <div className="space-y-1">
          <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Email Address</label>
          <div className="relative">
            <Mail className="absolute left-3 top-3 h-5 w-5 text-slate-400" />
            <input
              type="email"
              required
              placeholder="name@example.com"
              className="w-full pl-10 pr-4 py-2 border border-slate-200 dark:border-slate-700 rounded-lg bg-transparent outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            />
          </div>
        </div>

        {/* Password Field */}
        <div className="space-y-1">
          <div className="flex justify-between items-center">
            <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Password</label>
            <Link href="/auth/forgot-password" className="text-xs text-indigo-600 hover:underline">Forgot password?</Link>
          </div>
          <div className="relative">
            <Lock className="absolute left-3 top-3 h-5 w-5 text-slate-400" />
            <input
              type={showPassword ? "text" : "password"}
              required
              placeholder="••••••••"
              className="w-full pl-10 pr-10 py-2 border border-slate-200 dark:border-slate-700 rounded-lg bg-transparent outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
            />
            <button
              type="button"
              className="absolute right-3 top-3 text-slate-400 hover:text-slate-600"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
            </button>
          </div>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isLoading}
          className="w-full bg-slate-900 hover:bg-slate-800 disabled:bg-slate-400 text-white py-2.5 rounded-lg font-medium transition shadow-sm"
        >
          {isLoading ? "Signing In..." : "Sign In"}
        </button>
      </form>

      <div className="text-center text-sm text-slate-500 dark:text-slate-400">
        Dont have an account?
        <Link href="/auth/register" className="text-indigo-600 font-semibold hover:underline">
          Sign Up
        </Link>
      </div>
    </div>
  );
}