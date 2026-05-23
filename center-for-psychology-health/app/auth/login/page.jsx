"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Eye, EyeOff, Lock, User, AlertCircle, ArrowRight } from 'lucide-react';

const LoginPage = () => {
  const router = useRouter();

  // ফর্ম স্টেট
  const [formData, setFormData] = useState({
    username: '',
    password: ''
  });

  // স্টেট ম্যানেজমেন্ট
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // ইনপুট চেঞ্জ হ্যান্ডলার
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (error) setError('');
  };

  // ফর্ম সাবমিট হ্যান্ডলার
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      // Django Login API Call
      const res = await fetch('http://localhost:8000/api/auth/login/', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json' 
        },
        credentials: 'include', // ব্রাউজারকে ব্যাকএন্ডের HttpOnly Cookie গ্রহণ করতে বাধ্য করবে
        body: JSON.stringify(formData)
      });

      const result = await res.json();
      
      if (res.ok && result.success) {
        console.log("Login successful! User data:", result.data);
        
        localStorage.setItem('user_role', result.data.user_type);
        
        // ডাইনামিক ফেচিং পেজে রিডাইরেক্ট
        router.push('/blog'); 
        router.refresh(); 
      } else {
        setError(result.detail || "Invalid credential");
      }
      
    } catch (err) {
      setError("Cannot connect to server. Please check if Django is running.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full min-h-screen flex items-center justify-center bg-[#FAFAFA] px-4 relative">
      {/* মেন্টাল ওয়েলনেস ব্যাকগ্রাউন্ড ভাইব */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-[500px] bg-gradient-to-b from-teal-50/40 via-indigo-50/20 to-transparent blur-3xl pointer-events-none -z-10" />

      <div className="w-full max-w-md">
        <Card className="border-slate-200/80 bg-white/80 backdrop-blur-md shadow-xl shadow-teal-900/5 rounded-2xl">
          <CardHeader className="space-y-1 text-center">
            <CardTitle className="text-2xl font-bold tracking-tight text-slate-800">
              Welcome back
            </CardTitle>
            <CardDescription className="text-slate-500">
              Enter your credentials to access your wellness space
            </CardDescription>
          </CardHeader>
          
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              
              {/* এরর মেসেজ অ্যালার্ট */}
              {error && (
                <Alert variant="destructive" className="bg-red-50 text-red-900 border-red-200 py-3 rounded-xl">
                  <AlertCircle className="h-4 w-4 text-red-600" />
                  <AlertDescription className="text-sm font-medium">
                    {error}
                  </AlertDescription>
                </Alert>
              )}

              {/* Username Field */}
              <div className="space-y-1.5">
                <Label htmlFor="username" className="text-slate-700 font-medium text-sm">Username</Label>
                <div className="relative">
                  <User className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                  <Input
                    id="username"
                    name="username"
                    type="text"
                    placeholder="username"
                    required
                    value={formData.username}
                    onChange={handleChange}
                    className="pl-9 bg-slate-50/50 border-slate-200 focus-visible:ring-teal-500 h-10 rounded-xl"
                  />
                </div>
              </div>

              {/* Password Field */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <Label htmlFor="password" className="text-slate-700 font-medium text-sm">Password</Label>
                  <a href="/forgot-password" className="text-xs text-teal-600 hover:underline font-medium">
                    Forgot password?
                  </a>
                </div>
                <div className="relative">
                  <Lock className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                  <Input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    required
                    value={formData.password}
                    onChange={handleChange}
                    className="pl-9 pr-10 bg-slate-50/50 border-slate-200 focus-visible:ring-teal-500 h-10 rounded-xl"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-600 transition-colors"
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              {/* Submit Button */}
              <Button 
                type="submit" 
                disabled={isLoading}
                className="w-full bg-teal-600 hover:bg-teal-700 text-white font-medium h-10 rounded-xl transition-all shadow-md shadow-teal-600/10 mt-2 flex items-center justify-center gap-2 group"
              >
                {isLoading ? "Signing in..." : "Sign In"}
                {!isLoading && <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />}
              </Button>
            </form>
          </CardContent>
          
          <CardFooter className="justify-center border-t border-slate-100 py-4">
            <p className="text-xs text-slate-500">
              Dont have an account?
            
              <a href="/auth/register" className="text-teal-600 font-semibold hover:underline">
                Create one for free
              </a>
            </p>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};

export default LoginPage;