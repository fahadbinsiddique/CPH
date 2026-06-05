'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Eye, EyeOff, Brain, Loader2, User, Mail, Lock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import useAuthStore from '@/store/authStore';

export default function RegisterPage() {
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
  console.log('formdata', formData);
  

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    setFormError('');
    clearError();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError('');

    if (!formData.full_name || !formData.email || !formData.password) {
      setFormError('সব field পূরণ করো');
      return;
    }



    if (formData.password !== formData.confirm_password) {
      setFormError('Password মিলছে না');
      return;
    }

    const result = await register(formData);

    if (result.success) {
      router.push('/auth/login');
    } else {
      const errMsg = Object.values(result.error || {})[0];
      setFormError(Array.isArray(errMsg) ? errMsg[0] : errMsg || 'Registration failed');
    }
  };

  const fields = [
    { name: 'full_name', label: 'পুরো নাম', placeholder: 'আপনার নাম', type: 'text', Icon: User },
    { name: 'email', label: 'Email', placeholder: 'example@email.com', type: 'email', Icon: Mail },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: 'easeOut' }}
        className="w-full max-w-md"
      >
        {/* Logo */}
        <div className="flex flex-col items-center mb-8">
          <div className="w-14 h-14 bg-blue-600 rounded-2xl flex items-center justify-center mb-3 shadow-lg">
            <Brain className="text-white w-7 h-7" />
          </div>
          <h1 className="text-2xl font-semibold text-slate-800">Center for Psychology</h1>
          <p className="text-slate-500 text-sm mt-1">Mental wellness, একটু কাছে</p>
        </div>

        <Card className="border-0 shadow-xl shadow-slate-200/60">
          <CardHeader className="pb-4">
            <CardTitle className="text-xl text-slate-800">নতুন Account</CardTitle>
            <CardDescription>তোমার তথ্য দিয়ে register করো</CardDescription>
          </CardHeader>

          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Full name & Email */}
              {fields.map(({ name, label, placeholder, type, Icon }) => (
                <div key={name} className="space-y-1.5">
                  <Label htmlFor={name} className="text-slate-700">{label}</Label>
                  <div className="relative">
                    <Icon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <Input
                      id={name}
                      name={name}
                      type={type}
                      placeholder={placeholder}
                      value={formData[name]}
                      onChange={handleChange}
                      className="h-11 pl-9"
                      disabled={isLoading}
                    />
                  </div>
                </div>
              ))}

              {/* Password */}
              <div className="space-y-1.5">
                <Label htmlFor="password" className="text-slate-700">Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <Input
                    id="password"
                    name="password"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="কমপক্ষে ৮ character"
                    value={formData.password}
                    onChange={handleChange}
                    className="h-11 pl-9 pr-10"
                    disabled={isLoading}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((v) => !v)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Confirm Password */}
              <div className="space-y-1.5">
                <Label htmlFor="confirm_password" className="text-slate-700">Password নিশ্চিত করো</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <Input
                    id="confirm_password"
                    name="confirm_password"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="আবার password দাও"
                    value={formData.confirm_password}
                    onChange={handleChange}
                    className="h-11 pl-9"
                    disabled={isLoading}
                  />
                </div>
              </div>

              {/* Error */}
              {formError && (
                <motion.p
                  initial={{ opacity: 0, y: -6 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-sm text-red-500 bg-red-50 px-3 py-2 rounded-lg"
                >
                  {formError}
                </motion.p>
              )}

              {/* Submit */}
              <Button
                type="submit"
                className="w-full h-11 bg-blue-600 hover:bg-blue-700 text-white"
                disabled={isLoading}
              >
                {isLoading ? (
                  <span className="flex items-center gap-2">
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Register হচ্ছে...
                  </span>
                ) : (
                  'Register করো'
                )}
              </Button>
            </form>

            {/* Login link */}
            <p className="text-center text-sm text-slate-500 mt-5">
              Already account আছে?{' '}
              <Link href="/auth/login" className="text-blue-600 font-medium hover:underline">
                Login করো
              </Link>
            </p>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}