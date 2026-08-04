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
  ChevronRight,
  Calendar,
  Clock,
  Award,
} from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import useAuthStore from '@/store/authStore';
import api from '@/lib/api';

const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.06, delayChildren: 0.1 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 15 },
  show: {
    opacity: 1,
    y: 0,
    transition: { type: 'spring', stiffness: 300, damping: 24 },
  },
};

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

  // Get role color
  const roleColors = {
    admin: 'from-purple-500 to-violet-600',
    consultant: 'from-indigo-500 to-blue-600',
    client: 'from-teal-500 to-emerald-600',
  };

  const roleBadgeColors = {
    admin: 'bg-purple-50 text-purple-700 border-purple-200',
    consultant: 'bg-indigo-50 text-indigo-700 border-indigo-200',
    client: 'bg-teal-50 text-teal-700 border-teal-200',
  };

  const roleColor = roleColors[user?.role] || roleColors.client;
  const roleBadge = roleBadgeColors[user?.role] || roleBadgeColors.client;

  // Get initials
  const getInitials = (name) => {
    if (!name) return 'U';
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="show"
      className="max-w-3xl"
    >
      {/* Header */}
      <motion.div variants={itemVariants} className="mb-6">
        <div className="flex items-center gap-2 mb-1">
          <Badge className="bg-teal-50 text-teal-700 border-teal-200">
            <Sparkles className="w-3 h-3 mr-1" />
            My Profile
          </Badge>
        </div>
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900">
          Account Settings
        </h1>
        <p className="text-sm text-slate-500 font-medium mt-0.5">
          Manage your personal information and account preferences.
        </p>
      </motion.div>

      <motion.div variants={itemVariants}>
        <Card className="border border-slate-200/60 bg-white/80 backdrop-blur-sm shadow-sm hover:shadow-xl hover:border-teal-500/20 rounded-2xl overflow-hidden transition-all duration-500">
          {/* Top gradient accent */}
          <div className={`h-1 bg-gradient-to-r ${roleColor} scale-x-0 group-hover:scale-x-100 transition-transform duration-700 origin-left`} />

          <CardContent className="p-6 sm:p-8">
            {/* Profile Header */}
            <div className="flex flex-col sm:flex-row items-center gap-6 pb-8 border-b border-slate-200/60">
              {/* Avatar with edit overlay */}
              <div className="relative">
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onHoverStart={() => setIsHoveringAvatar(true)}
                  onHoverEnd={() => setIsHoveringAvatar(false)}
                  className="relative"
                >
                  <Avatar className="w-24 h-24 shadow-lg ring-4 ring-teal-50/80">
                    <AvatarFallback
                      className={`bg-gradient-to-br ${roleColor} text-white font-bold text-3xl shadow-inner`}
                    >
                      {getInitials(user?.full_name)}
                    </AvatarFallback>
                  </Avatar>
                  {isHoveringAvatar && (
                    <div className="absolute inset-0 bg-black/30 rounded-full flex items-center justify-center transition-opacity duration-300">
                      <Camera className="w-6 h-6 text-white" />
                    </div>
                  )}
                </motion.div>
                <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-emerald-500 rounded-full border-2 border-white shadow-sm animate-pulse" />
              </div>

              <div className="flex-1 text-center sm:text-left">
                <div className="flex items-center gap-2 flex-wrap justify-center sm:justify-start">
                  <h2 className="text-2xl font-bold text-slate-900">
                    {user?.full_name || 'User'}
                  </h2>
                  <Badge className={`${roleBadge} capitalize font-semibold`}>
                    {user?.role || 'Guest'}
                  </Badge>
                </div>
                <p className="text-sm text-slate-500 mt-1">{user?.email}</p>
                <div className="flex items-center gap-4 mt-2 text-xs text-slate-400">
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3 h-3 text-teal-400" />
                    Joined {new Date(user?.created_at).toLocaleDateString()}
                  </span>
                  <span className="text-slate-200">|</span>
                  <span className="flex items-center gap-1">
                    <Shield className="w-3 h-3 text-teal-400" />
                    Verified Account
                  </span>
                </div>
              </div>
            </div>

            {/* Form */}
            <form onSubmit={handleSave} className="space-y-6 pt-6">
              <div className="space-y-2">
                <Label className="text-xs font-semibold uppercase tracking-wider text-slate-500 flex items-center gap-2">
                  <User className="w-3.5 h-3.5 text-teal-500" />
                  Full Name
                </Label>
                <Input
                  name="full_name"
                  value={formData.full_name}
                  onChange={handleChange}
                  placeholder="Enter your full name"
                  className="h-12 rounded-xl border-slate-200 focus-visible:ring-teal-500/20 focus-visible:border-teal-500 transition-all bg-white/50 shadow-sm text-base"
                />
              </div>

              <div className="space-y-2 opacity-75">
                <Label className="text-xs font-semibold uppercase tracking-wider text-slate-500 flex items-center gap-2">
                  <Mail className="w-3.5 h-3.5 text-teal-500" />
                  Email Address
                </Label>
                <Input
                  name="email"
                  type="email"
                  value={formData.email}
                  placeholder="name@example.com"
                  disabled
                  className="h-12 rounded-xl border-slate-200 bg-slate-50/50 text-slate-600 shadow-sm text-base"
                />
                <p className="text-[11px] text-slate-400 flex items-center gap-1">
                  <Shield className="w-3 h-3 text-teal-400" />
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
                    className="flex items-center gap-3 text-sm font-medium text-emerald-700 bg-emerald-50/80 border border-emerald-200/60 px-4 py-3 rounded-xl shadow-sm"
                  >
                    <div className="p-1 bg-emerald-100 rounded-full">
                      <CheckCircle className="w-4 h-4 text-emerald-600" />
                    </div>
                    <span>Profile settings updated successfully!</span>
                  </motion.div>
                )}

                {error && (
                  <motion.div
                    initial={{ opacity: 0, height: 0, y: -10 }}
                    animate={{ opacity: 1, height: 'auto', y: 0 }}
                    exit={{ opacity: 0, height: 0, y: -10 }}
                    className="flex items-center gap-3 text-sm font-medium text-rose-700 bg-rose-50/80 border border-rose-200/60 px-4 py-3 rounded-xl shadow-sm"
                  >
                    <div className="p-1 bg-rose-100 rounded-full">
                      <AlertCircle className="w-4 h-4 text-rose-600" />
                    </div>
                    <span>{error}</span>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Actions */}
              <div className="flex flex-col sm:flex-row items-center gap-3 pt-2">
                <Button
                  type="submit"
                  disabled={saving}
                  className="w-full sm:w-auto bg-gradient-to-r from-teal-600 to-emerald-600 hover:from-teal-700 hover:to-emerald-700 text-white rounded-xl px-8 h-12 font-semibold shadow-lg shadow-teal-600/20 transition-all group"
                >
                  {saving ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    <>
                      <Save className="w-4 h-4 mr-2 group-hover:scale-110 transition-transform" />
                      Save Changes
                    </>
                  )}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  className="w-full sm:w-auto rounded-xl border-slate-200 hover:border-teal-300 hover:text-teal-700"
                  onClick={() => {
                    if (user) {
                      setFormData({
                        full_name: user.full_name || '',
                        email: user.email || '',
                      });
                    }
                  }}
                >
                  <Edit2 className="w-4 h-4 mr-2" />
                  Reset
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </motion.div>

      {/* Quick Stats / Profile Cards */}
      <motion.div variants={itemVariants} className="mt-6 grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white/60 backdrop-blur-sm rounded-xl p-4 border border-slate-200/60 flex items-center gap-3">
          <div className="p-2 bg-teal-50 rounded-xl">
            <Award className="w-4 h-4 text-teal-600" />
          </div>
          <div>
            <p className="text-xs text-slate-400 font-medium">Role</p>
            <p className="text-sm font-semibold text-slate-700 capitalize">{user?.role || 'Guest'}</p>
          </div>
        </div>
        <div className="bg-white/60 backdrop-blur-sm rounded-xl p-4 border border-slate-200/60 flex items-center gap-3">
          <div className="p-2 bg-teal-50 rounded-xl">
            <Calendar className="w-4 h-4 text-teal-600" />
          </div>
          <div>
            <p className="text-xs text-slate-400 font-medium">Member Since</p>
            <p className="text-sm font-semibold text-slate-700">
              {user?.created_at ? new Date(user.created_at).toLocaleDateString() : 'N/A'}
            </p>
          </div>
        </div>
        <div className="bg-white/60 backdrop-blur-sm rounded-xl p-4 border border-slate-200/60 flex items-center gap-3">
          <div className="p-2 bg-teal-50 rounded-xl">
            <Heart className="w-4 h-4 text-teal-600" />
          </div>
          <div>
            <p className="text-xs text-slate-400 font-medium">Status</p>
            <p className="text-sm font-semibold text-emerald-600 flex items-center gap-1">
              <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />
              Active
            </p>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}