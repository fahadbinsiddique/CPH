'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Eye, EyeOff, Brain, Loader2, User, Mail, Lock } from 'lucide-react';
import { toast } from "sonner"
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetTitle,
} from '@/components/ui/sheet';

import useAuthStore from '@/store/authStore';
import Image from 'next/image';

export default function RegisterDrawer({ isOpen, setIsOpen, onSuccessRedirect }) {
  const router = useRouter();
  const { register, isLoading, clearError } = useAuthStore();

  const [formData, setFormData] = useState({
    full_name: '',
    email: '',
    password: '',
    confirm_password: '',
  });

  const [showPassword, setShowPassword] = useState(false);
  const [formError, setFormError] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setFormError('');
    clearError();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError('');

    // Validate the form before submission.
    if (!formData.full_name || !formData.email || !formData.password || !formData.confirm_password) {
      setFormError('Please fill in all the required fields.');
      return;
    }

    if (formData.password.length < 8) {
      setFormError('Password must be at least 8 characters long.');
      return;
    }

    if (formData.password !== formData.confirm_password) {
      setFormError('Passwords do not match. Please check again.');
      return;
    }

    const result = await register(formData);

    if (result?.success) {

        toast.success("Account created successfully!", 
            { description: "Please sign in with your secure credentials.",position: "top-right"}
              
        );

        setTimeout(() => {
        setIsOpen(false);
        
        if (onSuccessRedirect) {
          onSuccessRedirect();
        }
      }, 200);


    } else {
      // Extract the relevant backend error message.
      const backendError = result?.error;
      if (typeof backendError === 'string') {
        setFormError(backendError);
      } else if (backendError && typeof backendError === 'object') {
        const firstKey = Object.keys(backendError)[0];
        const firstVal = backendError[firstKey];
        setFormError(Array.isArray(firstVal) ? firstVal[0] : firstVal || 'Registration failed.');
      } else {
        setFormError('Something went wrong. Please try again.');
      }
    }
  };

  const staticFields = [
    { name: 'full_name', label: 'Full Name', placeholder: 'John Doe', type: 'text', Icon: User },
    { name: 'email', label: 'Email Address', placeholder: 'name@example.com', type: 'email', Icon: Mail },
  ];

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetContent
        side="right"
        className="w-full sm:max-w-md overflow-y-auto bg-slate-50/90 backdrop-blur-md p-0 shadow-2xl border-l border-slate-200/60 font-sans flex flex-col"
      >
        {/* Top Gradient Content Area */}
        <div className="bg-gradient-to-b from-blue-50/60 via-transparent to-transparent px-6 pt-10 pb-6 flex-1">
          
          {/* Brand Premium Header */}
          <div className="flex flex-col items-center mb-8 text-center">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.3 }}
              className="flex items-center justify-center  rounded-2xl bg-gradient-to-tr from-teal-600 to-blue-600 shadow-md shadow-teal-600/10 mb-4"
            >
              <Image
                alt='Centre for Psychological Health'
                src={"/logo2.jpg"}
                height={150}
                width={150}
                />
            </motion.div>

            <SheetTitle className="text-2xl font-bold tracking-tight text-slate-900 font-sans">
              Create Account
            </SheetTitle>
          
          </div>

          {/* Decorative Divider */}
          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center" aria-hidden="true">
              <div className="w-full border-t border-slate-200/60" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-slate-50 px-3 text-slate-400 tracking-widest font-medium">Your Details</span>
            </div>
          </div>

          {/* Form Content */}
          <div className="mt-4">
            <form onSubmit={handleSubmit} className="space-y-4">
              
              {/* Render Full Name and Email */}
              {staticFields.map(({ name, label, placeholder, type, Icon }) => (
                <div key={name} className="space-y-1.5">
                  <Label htmlFor={`drawer-${name}`} className="text-xs font-semibold uppercase tracking-wider text-slate-600">
                    {label}
                  </Label>
                  <div className="relative group">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400 group-focus-within:text-teal-600 transition-colors">
                      <Icon size={18} />
                    </div>
                    <Input
                      id={`drawer-${name}`}
                      name={name}
                      type={type}
                      placeholder={placeholder}
                      value={formData[name]}
                      onChange={handleChange}
                      className="h-12 pl-11 bg-white border-slate-200 hover:border-slate-300 focus-visible:ring-teal-600/20 focus-visible:border-teal-600 transition-all rounded-xl text-slate-800"
                      disabled={isLoading}
                    />
                  </div>
                </div>
              ))}

              {/* Password Field */}
              <div className="space-y-1.5">
                <Label htmlFor="drawer-password" className="text-xs font-semibold uppercase tracking-wider text-slate-600">
                  Password
                </Label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400 group-focus-within:text-teal-600 transition-colors">
                    <Lock size={18} />
                  </div>
                  <Input
                    id="drawer-password"
                    name="password"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Minimum 8 characters"
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
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Confirm Password Field */}
              <div className="space-y-1.5">
                <Label htmlFor="drawer-confirm-password" className="text-xs font-semibold uppercase tracking-wider text-slate-600">
                  Confirm Password
                </Label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400 group-focus-within:text-teal-600 transition-colors">
                    <Lock size={18} />
                  </div>
                  <Input
                    id="drawer-confirm-password"
                    name="confirm_password"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Repeat your password"
                    value={formData.confirm_password}
                    onChange={handleChange}
                    className="h-12 pl-11 pr-11 bg-white border-slate-200 hover:border-slate-300 focus-visible:ring-teal-600/20 focus-visible:border-teal-600 transition-all rounded-xl text-slate-800"
                    disabled={isLoading}
                  />
                </div>
              </div>

              {/* Error Box */}
              {formError && (
                <motion.div
                  initial={{ opacity: 0, y: -6 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="rounded-xl border border-red-100 bg-red-50/80 p-3.5 text-sm text-red-600 shadow-sm flex items-start gap-2.5 mt-2"
                >
                  <span className="font-medium">{formError}</span>
                </motion.div>
              )}

              {/* Premium Sign Up Button */}
              <Button
                type="submit"
                disabled={isLoading}
                className="h-12 w-full bg-gradient-to-r from-teal-600 to-emerald-600 text-white font-bold text-base shadow-md shadow-teal-600/10 hover:shadow-lg hover:shadow-teal-600/20 active:scale-[0.99] transition-all rounded-xl mt-4"
              >
                {isLoading ? (
                  <span className="flex items-center gap-2">
                    <Loader2 className="w-4 h-4 animate-spin stroke-[2.5]" />
                    Creating Account...
                  </span>
                ) : (
                  'Get Started Now'
                )}
              </Button>
            </form>
          </div>
        </div>

        {/* Sticky Footer */}
        <div className="p-6 bg-slate-100/60 border-t border-slate-200/60 text-center">
          <p className="text-sm text-slate-600 font-medium">
            Already have an account?{' '}
            <Button
              
              variant="link"
              onClick={() => onSuccessRedirect()}
              className="font-bold text-teal-600 transition hover:text-teal-700 hover:underline"
            >
              Sign In
            </Button>
          </p>
        </div>
      </SheetContent>
    </Sheet>
  );
}