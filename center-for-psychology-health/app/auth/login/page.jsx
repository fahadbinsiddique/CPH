'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Eye, EyeOff, Brain, Loader2 } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

import useAuthStore from '@/store/authStore';

export default function LoginPage() {
  const router = useRouter();

  const { login, isLoading, error, clearError } = useAuthStore();

  const [formData, setFormData] = useState({
    username: '',
    password: '',
  });

  const [showPassword, setShowPassword] = useState(false);
  const [formError, setFormError] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    setFormError('');
    clearError();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setFormError('');

    if (!formData.username || !formData.password) {
      setFormError('Please fill in all required fields.');
      return;
    }

    const result = await login(formData);

    if (result?.success) {
      const role = result?.user?.role;

      switch (role) {
        case 'admin':
          router.push('/dashboard/admin');
          break;

        case 'consultant':
          router.push('/dashboard/consultant');
          break;

        default:
          router.push('/blog');
      }
    } else {
      setFormError(
        result?.error?.error ||
          'Unable to sign in. Please check your credentials and try again.'
      );
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 flex items-center justify-center px-4 py-10">
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: 'easeOut' }}
        className="w-full max-w-md"
      >
        {/* Brand */}
        <div className="flex flex-col items-center mb-8">
          <div className="flex items-center justify-center w-14 h-14 rounded-2xl bg-blue-600 shadow-lg mb-4">
            <Brain className="w-7 h-7 text-white" />
          </div>

          <h1 className="text-2xl font-bold tracking-tight text-slate-900">
            Center for Psychology
          </h1>

          <p className="mt-1 text-sm text-slate-500 text-center">
            Supporting mental wellness with professional care and guidance.
          </p>
        </div>

        {/* Card */}
        <Card className="border-0 shadow-2xl shadow-slate-200/60">
          <CardHeader className="space-y-2">
            <CardTitle className="text-2xl font-semibold text-slate-900">
              Welcome Back
            </CardTitle>

            <CardDescription className="text-slate-500">
              Sign in to access your account and continue your journey.
            </CardDescription>
          </CardHeader>

          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Email */}
              <div className="space-y-2">
                <Label htmlFor="email" className="text-slate-700">
                  Email Address
                </Label>

                <Input
                  id="username"
                  name="username"
                  type="email"
                  placeholder="you@example.com"
                  value={formData.username}
                  onChange={handleChange}
                  className="h-11"
                  disabled={isLoading}
                />
              </div>

              {/* Password */}
              <div className="space-y-2">
                <Label htmlFor="password" className="text-slate-700">
                  Password
                </Label>

                <div className="relative">
                  <Input
                    id="password"
                    name="password"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Enter your password"
                    value={formData.password}
                    onChange={handleChange}
                    className="h-11 pr-11"
                    disabled={isLoading}
                  />

                  <button
                    type="button"
                    onClick={() => setShowPassword((prev) => !prev)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 transition hover:text-slate-600"
                    aria-label={
                      showPassword ? 'Hide password' : 'Show password'
                    }
                  >
                    {showPassword ? (
                      <EyeOff className="w-4 h-4" />
                    ) : (
                      <Eye className="w-4 h-4" />
                    )}
                  </button>
                </div>
              </div>

              {/* Error Message */}
              {(formError || error?.error) && (
                <motion.div
                  initial={{ opacity: 0, y: -6 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="rounded-lg border border-red-100 bg-red-50 px-3 py-2 text-sm text-red-600"
                >
                  {formError || error?.error}
                </motion.div>
              )}

              {/* Forgot Password */}
              <div className="flex justify-end">
                <Link
                  href="/auth/forgot-password"
                  className="text-sm font-medium text-blue-600 transition hover:text-blue-700 hover:underline"
                >
                  Forgot password?
                </Link>
              </div>

              {/* Submit Button */}
              <Button
                type="submit"
                disabled={isLoading}
                className="h-11 w-full bg-blue-600 text-white hover:bg-blue-700"
              >
                {isLoading ? (
                  <span className="flex items-center gap-2">
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Signing in...
                  </span>
                ) : (
                  'Sign In'
                )}
              </Button>
            </form>

            {/* Register */}
            <p className="mt-6 text-center text-sm text-slate-500">
              Don&apos;t have an account?{' '}
              <Link
                href="/auth/register"
                className="font-medium text-blue-600 transition hover:text-blue-700 hover:underline"
              >
                Create an account
              </Link>
            </p>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}