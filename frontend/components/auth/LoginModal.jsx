'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Eye, EyeOff, Brain, Loader2, Lock, Mail } from 'lucide-react';
import { toast } from "sonner"
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

import useAuthStore from '@/store/authStore';
import Image from 'next/image';
import { consumeResumePath } from '@/lib/authGate';
import useUiStore from '@/store/uiStore';

export default function LoginModal({ isOpen, setIsOpen, onRedirect }) {
  const router = useRouter();
  const { login, isLoading, error, clearError } = useAuthStore();
  const closeLoginModal = useUiStore((s) => s.closeLoginModal);

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
      setFormError('Please enter both your email and password.');
      return;
    }

    const result = await login(formData);

    if (result?.success) {
      toast.success("Login successfully!",
            { description: "successfully Login with your secure credentials.",position: "top-center"}

        );
      closeLoginModal();

      // Seamlessly resume the action the user intended to perform (e.g. booking).
      const resumePath = consumeResumePath();
      if (resumePath) {
        router.push(resumePath);
        return;
      }
    } else {
      setFormError(
        result?.error?.error ||
          'Invalid credentials. Please check your email and password try again.'
      );
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent
        className="sm:max-w-md overflow-y-auto bg-slate-50/90 backdrop-blur-md p-0 shadow-2xl font-sans flex flex-col max-h-[90vh]"
      >
        {/* Main Container with subtle top gradient */}
        <div className="bg-gradient-to-b from-blue-50/60 via-transparent to-transparent px-6 pt-10 pb-6 flex-1">

          {/* Premium Brand Header */}
          <div className="flex flex-col items-center mb-8 text-center">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.3 }}
              className="flex items-center justify-center rounded-2xl bg-gradient-to-tr from-teal-600 to-blue-600 shadow-md shadow-teal-600/10 mb-4"
            >
              <Image
              alt='Centre for Psychological Health'
              src={"/logo2.jpg"}
              height={150}
              width={150}
              />
            </motion.div>

            <DialogTitle className="text-2xl font-bold tracking-tight text-slate-900 font-sans">
              Centre for Psychological Health
            </DialogTitle>

          </div>

          {/* Decorative Divider */}
          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center" aria-hidden="true">
              <div className="w-full border-t border-slate-200/60" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-slate-50 px-3 text-slate-400 tracking-widest font-medium">Secure Sign In</span>
            </div>
          </div>

          {/* Form Area */}
          <div className="mt-6">


            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Email Input */}
              <div className="space-y-2">
                <Label htmlFor="modal-username" className="text-xs font-semibold uppercase tracking-wider text-slate-600">
                  Email Address
                </Label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400 group-focus-within:text-teal-600 transition-colors">
                    <Mail size={18} />
                  </div>
                  <Input
                    id="modal-username"
                    name="username"
                    type="email"
                    placeholder="name@example.com"
                    value={formData.username}
                    onChange={handleChange}
                    className="h-12 pl-11 bg-white border-slate-200 hover:border-slate-300 focus-visible:ring-teal-600/20 focus-visible:border-teal-600 transition-all rounded-xl text-slate-800"
                    disabled={isLoading}
                  />
                </div>
              </div>

              {/* Password Input */}
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <Label htmlFor="modal-password" className="text-xs font-semibold uppercase tracking-wider text-slate-600">
                    Password
                  </Label>
                  <Link
                    href="/auth/forgot-password"
                    onClick={() => setIsOpen(false)}
                    className="text-xs font-semibold text-teal-600 transition hover:text-teal-700 hover:underline"
                  >
                    Forgot password?
                  </Link>
                </div>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400 group-focus-within:text-teal-600 transition-colors">
                    <Lock size={18} />
                  </div>
                  <Input
                    id="modal-password"
                    name="password"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="••••••••"
                    value={formData.password}
                    onChange={handleChange}
                    className="h-12 pl-11 pr-11 bg-white border-slate-200 hover:border-slate-300 focus-visible:ring-teal-600/20 focus-visible:border-teal-600 transition-all rounded-xl text-slate-800"
                    disabled={isLoading}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((prev) => !prev)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 transition hover:text-slate-600 p-1 rounded-md"
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                  >
                    {showPassword ? (
                      <EyeOff className="w-4 h-4" />
                    ) : (
                      <Eye className="w-4 h-4" />
                    )}
                  </button>
                </div>
              </div>

              {/* Error Alert Box */}
              {(formError || error?.error) && (
                <motion.div
                  initial={{ opacity: 0, y: -6 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="rounded-xl border border-red-100 bg-red-50/80 p-3.5 text-sm text-red-600 shadow-sm flex items-start gap-2.5"
                >
                  <span className="font-medium">{formError || error?.error}</span>
                </motion.div>
              )}

              {/* Premium Gradient Submit Button */}
              <Button
                type="submit"
                disabled={isLoading}
                className="h-12 w-full bg-gradient-to-r from-teal-600 to-emerald-600 text-white font-bold text-base shadow-md shadow-teal-600/10 hover:shadow-lg hover:shadow-teal-600/20 active:scale-[0.99] transition-all rounded-xl mt-2"
              >
                {isLoading ? (
                  <span className="flex items-center gap-2">
                    <Loader2 className="w-4 h-4 animate-spin stroke-[2.5]" />
                    Verifying Credentials...
                  </span>
                ) : (
                  'Sign In to Account'
                )}
              </Button>
            </form>
          </div>
        </div>

        {/* Bottom Sticky Footer */}
        <div className="p-6 bg-slate-100/60 border-t border-slate-200/60 text-center">
          <p className="text-sm text-slate-600 font-medium">
            Don&apos;t have an account?{' '}
            <Button
              variant="link"
              onClick={() => onRedirect()}
              className="font-bold text-teal-600 transition hover:text-teal-700 hover:underline"
            >
              Create an account
            </Button>
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
}
