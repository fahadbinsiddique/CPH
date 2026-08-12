'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Loader2,
  Save,
  User,
  Mail,
  CheckCircle,
  AlertCircle,
  Sparkles,
  Shield,
  Heart,
  Camera,
  Edit2,
  Calendar,
  Award,
} from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import PageHeader from '@/components/dashboard/ui/PageHeader';
import useAuthStore from '@/store/authStore';
import api from '@/lib/api';
import { containerVariants, itemVariants } from '@/lib/motion';
import { getRoleStyle, getInitials, ROLE_LABEL } from '@/lib/roles';

export default function ProfilePage() {
  const { user, fetchMe } = useAuthStore();
  const [formData, setFormData] = useState({ full_name: '', email: '' });
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');
  const [isHoveringAvatar, setIsHoveringAvatar] = useState(false);

  useEffect(() => {
    if (user) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setFormData({
        full_name: user.full_name || '',
        email: user.email || '',
      });
    }
  }, [user]);

  const roleStyle = getRoleStyle(user?.role);

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
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
    <motion.div variants={containerVariants} initial="hidden" animate="show" className="max-w-3xl space-y-6">
      <PageHeader
        badge="My Profile"
        badgeIcon={Sparkles}
        title="Account Settings"
        subtitle="Manage your personal information and account preferences."
      />

      <motion.div variants={itemVariants}>
        <Card className="group dash-card dash-card-hover relative overflow-hidden">
          <div className="dash-accent" />

          <CardContent className="p-6 sm:p-8">
            {/* Profile Header */}
            <div className="flex flex-col items-center gap-6 border-b border-slate-200/60 pb-8 sm:flex-row">
              <div className="relative">
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onHoverStart={() => setIsHoveringAvatar(true)}
                  onHoverEnd={() => setIsHoveringAvatar(false)}
                  className="relative"
                >
                  <Avatar className="h-24 w-24 shadow-lg ring-4 ring-teal-50/80">
                    <AvatarFallback
                      className={`bg-gradient-to-br text-3xl font-bold text-white shadow-inner ${roleStyle.gradient}`}
                    >
                      {getInitials(user?.full_name)}
                    </AvatarFallback>
                  </Avatar>
                  {isHoveringAvatar && (
                    <div className="absolute inset-0 flex items-center justify-center rounded-full bg-black/30 transition-opacity duration-300">
                      <Camera className="h-6 w-6 text-white" />
                    </div>
                  )}
                </motion.div>
                <div className="absolute -right-1 -bottom-1 h-4 w-4 animate-pulse rounded-full border-2 border-white bg-emerald-500 shadow-sm" />
              </div>

              <div className="flex-1 text-center sm:text-left">
                <div className="flex flex-wrap items-center justify-center gap-2 sm:justify-start">
                  <h2 className="text-2xl font-bold text-slate-900">{user?.full_name || 'User'}</h2>
                  <Badge className={`${roleStyle.badge} font-semibold capitalize`}>
                    {ROLE_LABEL[user?.role] || user?.role || 'Guest'}
                  </Badge>
                </div>
                <p className="mt-1 text-sm text-slate-500">{user?.email}</p>
                <div className="mt-2 flex items-center justify-center gap-4 text-xs text-slate-400 sm:justify-start">
                  <span className="flex items-center gap-1">
                    <Calendar className="h-3 w-3 text-teal-400" />
                    Joined {new Date(user?.created_at).toLocaleDateString()}
                  </span>
                  <span className="text-slate-200">|</span>
                  <span className="flex items-center gap-1">
                    <Shield className="h-3 w-3 text-teal-400" />
                    Verified Account
                  </span>
                </div>
              </div>
            </div>

            {/* Form */}
            <form onSubmit={handleSave} className="space-y-6 pt-6">
              <div className="space-y-2">
                <Label className="flex items-center gap-2 text-xs font-semibold tracking-wider text-slate-500 uppercase">
                  <User className="h-3.5 w-3.5 text-teal-500" />
                  Full Name
                </Label>
                <Input
                  name="full_name"
                  value={formData.full_name}
                  onChange={handleChange}
                  placeholder="Enter your full name"
                  className="h-12 rounded-xl border-slate-200 bg-white/50 text-base shadow-sm transition-all focus-visible:border-teal-500 focus-visible:ring-teal-500/20"
                />
              </div>

              <div className="space-y-2 opacity-75">
                <Label className="flex items-center gap-2 text-xs font-semibold tracking-wider text-slate-500 uppercase">
                  <Mail className="h-3.5 w-3.5 text-teal-500" />
                  Email Address
                </Label>
                <Input
                  name="email"
                  type="email"
                  value={formData.email}
                  placeholder="name@example.com"
                  disabled
                  className="h-12 rounded-xl border-slate-200 bg-slate-50/50 text-base text-slate-600 shadow-sm"
                />
                <p className="flex items-center gap-1 text-[11px] text-slate-400">
                  <Shield className="h-3 w-3 text-teal-400" />
                  Email cannot be changed. Contact support for assistance.
                </p>
              </div>

              {/* Message Alerts */}
              <AnimatePresence mode="wait">
                {success && (
                  <motion.div
                    initial={{ opacity: 0, height: 0, y: -10 }}
                    animate={{ opacity: 1, height: 'auto', y: 0 }}
                    exit={{ opacity: 0, height: 0, y: -10 }}
                    className="flex items-center gap-3 rounded-xl border border-emerald-200/60 bg-emerald-50/80 px-4 py-3 text-sm font-medium text-emerald-700 shadow-sm"
                  >
                    <div className="rounded-full bg-emerald-100 p-1">
                      <CheckCircle className="h-4 w-4 text-emerald-600" />
                    </div>
                    <span>Profile settings updated successfully!</span>
                  </motion.div>
                )}

                {error && (
                  <motion.div
                    initial={{ opacity: 0, height: 0, y: -10 }}
                    animate={{ opacity: 1, height: 'auto', y: 0 }}
                    exit={{ opacity: 0, height: 0, y: -10 }}
                    className="flex items-center gap-3 rounded-xl border border-rose-200/60 bg-rose-50/80 px-4 py-3 text-sm font-medium text-rose-700 shadow-sm"
                  >
                    <div className="rounded-full bg-rose-100 p-1">
                      <AlertCircle className="h-4 w-4 text-rose-600" />
                    </div>
                    <span>{error}</span>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Actions */}
              <div className="flex flex-col items-center gap-3 pt-2 sm:flex-row">
                <Button type="submit" disabled={saving} className="dash-cta group h-12 w-full px-8 sm:w-auto">
                  {saving ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    <>
                      <Save className="mr-2 h-4 w-4 transition-transform group-hover:scale-110" />
                      Save Changes
                    </>
                  )}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  className="w-full rounded-xl border-slate-200 hover:border-teal-300 hover:text-teal-700 sm:w-auto"
                  onClick={() => {
                    if (user) {
                      setFormData({
                        full_name: user.full_name || '',
                        email: user.email || '',
                      });
                    }
                  }}
                >
                  <Edit2 className="mr-2 h-4 w-4" />
                  Reset
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </motion.div>

      {/* Quick Stats / Profile Cards */}
      <motion.div variants={itemVariants} className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div className="flex items-center gap-3 rounded-xl border border-slate-200/60 bg-white/60 p-4 backdrop-blur-sm">
          <div className="rounded-xl bg-teal-50 p-2">
            <Award className="h-4 w-4 text-teal-600" />
          </div>
          <div>
            <p className="text-xs font-medium text-slate-400">Role</p>
            <p className="text-sm font-semibold text-slate-700 capitalize">
              {ROLE_LABEL[user?.role] || user?.role || 'Guest'}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3 rounded-xl border border-slate-200/60 bg-white/60 p-4 backdrop-blur-sm">
          <div className="rounded-xl bg-teal-50 p-2">
            <Calendar className="h-4 w-4 text-teal-600" />
          </div>
          <div>
            <p className="text-xs font-medium text-slate-400">Member Since</p>
            <p className="text-sm font-semibold text-slate-700">
              {user?.created_at ? new Date(user.created_at).toLocaleDateString() : 'N/A'}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3 rounded-xl border border-slate-200/60 bg-white/60 p-4 backdrop-blur-sm">
          <div className="rounded-xl bg-teal-50 p-2">
            <Heart className="h-4 w-4 text-teal-600" />
          </div>
          <div>
            <p className="text-xs font-medium text-slate-400">Status</p>
            <p className="flex items-center gap-1 text-sm font-semibold text-emerald-600">
              <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-500" />
              Active
            </p>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}