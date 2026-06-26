'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Loader2, Save, User, Mail, CheckCircle, AlertCircle } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import useAuthStore from '@/store/authStore';
import api from '@/lib/api';

export default function ProfilePage() {
  const { user, fetchMe } = useAuthStore();
  const [formData, setFormData] = useState({ full_name: '', email: '' });
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  // Fix: Sync component state safely when store data hydrates/updates
  useEffect(() => {
    if (user) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setFormData({
        full_name: user.full_name || '',
        email: user.email || '',
      });
    }
  }, [user]);

  const handleChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
    if (success) setSuccess(false);
    if (error) setError('');
  };

  const handleSave = async (e) => {
    e.preventDefault();
    if (!formData.full_name.trim() || !formData.email.trim()) {
      setError('Full Name and Email fields cannot be empty.');
      return;
    }

    setSaving(true);
    setError('');
    setSuccess(false);

    try {
      await api.patch('/api/auth/me/update/', formData);
      await fetchMe();
      setSuccess(true);
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.detail || 'Something went wrong while updating profile.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ type: 'spring', stiffness: 260, damping: 25 }}
      className="max-w-2xl"
    >
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Account Profile</h1>
        <p className="text-xs text-slate-400 mt-0.5">Update your personal information and account setups.</p>
      </div>

      <Card className="border border-slate-100 bg-white/80 backdrop-blur-md shadow-sm rounded-2xl overflow-hidden relative">
        <div className="absolute top-0 left-0 right-0 h-[3px] bg-gradient-to-r from-indigo-500 via-blue-500 to-cyan-400" />
        
        <CardContent className="p-8">
          {/* Header Avatar Section */}
          <div className="flex items-center gap-5 mb-8 pb-8 border-b border-slate-100/80">
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Avatar className="w-20 h-20 shadow-md ring-4 ring-indigo-50">
                <AvatarFallback className="bg-gradient-to-tr from-indigo-500 to-blue-600 text-white font-bold text-3xl shadow-inner">
                  {user?.full_name?.charAt(0).toUpperCase() || 'U'}
                </AvatarFallback>
              </Avatar>
            </motion.div>
            <div>
              <p className="text-lg font-bold text-slate-800 tracking-tight">{user?.full_name || 'Loading Account...'}</p>
              <span className="inline-flex items-center mt-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-indigo-50 text-indigo-600 border border-indigo-100 capitalize">
                {user?.role || 'Guest'}
              </span>
            </div>
          </div>

          {/* Form Controls */}
          <form onSubmit={handleSave} className="space-y-5">
            <div className="space-y-2">
              <Label className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-2">
                <User className="w-3.5 h-3.5 text-indigo-500" /> Full Name
              </Label>
              <Input
                name="full_name"
                value={formData.full_name}
                onChange={handleChange}
                placeholder="Enter your full name"
                className="h-11 rounded-xl border-slate-200 focus-visible:ring-indigo-500/20 focus-visible:border-indigo-500 transition-all bg-white/50"
              />
            </div>

            {/* Email Address (Read-Only Version) */}
            <div className="space-y-2 opacity-75">
              <Label className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-2">
                <Mail className="w-3.5 h-3.5 text-indigo-500" /> Email Address 
              </Label>
              <Input
                name="email"
                type="email"
                value={formData.email}
                
                placeholder="name@example.com"
                disabled
                className="h-11 rounded-xl border-slate-200 focus-visible:ring-indigo-500/20 focus-visible:border-indigo-500 transition-all bg-white/50"
              />
            </div>

            {/* Notification Messages with AnimatePresence */}
            <AnimatePresence mode="wait">
              {success && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="flex items-center gap-2 text-sm font-medium text-emerald-700 bg-emerald-50/70 border border-emerald-100 px-4 py-3 rounded-xl mt-4"
                >
                  <CheckCircle className="w-4 h-4 flex-shrink-0" />
                  <span>Profile settings updated successfully.</span>
                </motion.div>
              )}

              {error && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="flex items-center gap-2 text-sm font-medium text-rose-700 bg-rose-50/70 border border-rose-100 px-4 py-3 rounded-xl mt-4"
                >
                  <AlertCircle className="w-4 h-4 flex-shrink-0" />
                  <span>{error}</span>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Action Trigger Button */}
            <div className="pt-2">
              <Button
                type="submit"
                disabled={saving}
                className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-sm h-11 px-6 rounded-xl shadow-sm hover:shadow shadow-indigo-600/10 transition-all w-full sm:w-auto"
              >
                {saving ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Saving Changes...
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4 mr-2" />
                    Save Settings
                  </>
                )}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </motion.div>
  );
}