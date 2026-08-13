'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Loader2, Lock, Bell, BellOff, Shield, Eye, EyeOff, CheckCircle, AlertCircle, Settings } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import PageHeader from '@/components/dashboard/ui/PageHeader';
import api from '@/lib/api';
import { containerVariants, itemVariants } from '@/lib/motion';
import { usePushNotifications } from '@/hooks/usePushNotifications';

function Toggle({ checked, onChange }) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      onClick={() => onChange(!checked)}
      className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer items-center rounded-full transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-500 focus-visible:ring-offset-2 ${
        checked ? 'bg-teal-600' : 'bg-slate-200'
      }`}
    >
      <span
        className={`inline-block h-4 w-4 transform rounded-full bg-white shadow-sm transition-transform duration-200 ${
          checked ? 'translate-x-4' : 'translate-x-0.5'
        }`}
      />
    </button>
  );
}

function PushNotificationToggle() {
  const { permission, isSubscribed, loading, subscribe, unsubscribe } = usePushNotifications();

  if (permission === 'denied') {
    return (
      <div className="flex items-center justify-between py-2.5 border-b border-slate-100">
        <div>
          <p className="text-sm font-medium text-slate-700">Push Notifications</p>
          <p className="text-xs text-rose-500">
            Blocked in browser settings. Please allow manually.
          </p>
        </div>
        <BellOff className="h-5 w-5 text-slate-300" />
      </div>
    );
  }

  return (
    <div className="flex items-center justify-between py-2.5 border-b border-slate-100">
      <div>
        <p className="text-sm font-medium text-slate-700">Push Notifications</p>
        <p className="text-xs text-slate-400">
          {isSubscribed
            ? 'You will receive real-time booking and system alerts.'
            : 'Get instant updates about appointment updates directly on your device.'}
        </p>
      </div>
      <Button
        size="sm"
        variant={isSubscribed ? 'outline' : 'default'}
        className={
          isSubscribed
            ? 'border-rose-200 text-rose-600 hover:bg-rose-50 rounded-xl text-xs h-9'
            : 'bg-teal-600 hover:bg-teal-700 text-white rounded-xl text-xs h-9'
        }
        onClick={isSubscribed ? unsubscribe : subscribe}
        disabled={loading}
      >
        {loading ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : isSubscribed ? (
          <>
            <BellOff className="mr-1.5 h-3.5 w-3.5" /> Disable Push
          </>
        ) : (
          <>
            <Bell className="mr-1.5 h-3.5 w-3.5" /> Enable Push
          </>
        )}
      </Button>
    </div>
  );
}

export default function SettingsPage() {
  const [passwords, setPasswords] = useState({
    old_password: '',
    new_password: '',
    confirm_password: '',
  });
  const [show, setShow] = useState(false);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');
  const [notifications, setNotifications] = useState({
    reminders: true,
    confirmations: true,
    messages: true,
  });

  const handleChange = (e) => {
    setPasswords((p) => ({ ...p, [e.target.name]: e.target.value }));
    setError('');
    setSuccess('');
  };

  const handlePasswordChange = async () => {
    setError('');
    if (passwords.new_password.length < 8) {
      setError('Password must be at least 8 characters.');
      return;
    }
    if (passwords.new_password !== passwords.confirm_password) {
      setError('Passwords do not match.');
      return;
    }
    setSaving(true);
    try {
      await api.post('/api/auth/change-password/', {
        old_password: passwords.old_password,
        new_password: passwords.new_password,
      });
      setSuccess('Password changed successfully.');
      setPasswords({ old_password: '', new_password: '', confirm_password: '' });
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to change password.');
    } finally {
      setSaving(false);
    }
  };

  const passwordFields = [
    { name: 'old_password', label: 'Current Password' },
    { name: 'new_password', label: 'New Password' },
    { name: 'confirm_password', label: 'Confirm New Password' },
  ];

  const notifRows = [
    { key: 'reminders', label: 'Appointment reminders', desc: 'Get notified 1 hour before sessions' },
    { key: 'confirmations', label: 'Booking confirmations', desc: 'Email when appointments are confirmed' },
    { key: 'messages', label: 'New messages', desc: 'Notify on new consultant messages' },
  ];

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="show"
      className="max-w-2xl space-y-6"
    >
      <PageHeader
        badge="Account Settings"
        badgeIcon={Settings}
        title="Settings"
        subtitle="Manage your account, password, and notification preferences."
      />

      {/* Change password */}
      <motion.div variants={itemVariants}>
        <Card className="group dash-card dash-card-hover relative overflow-hidden">
          <div className="dash-accent" />
          <CardContent className="p-6">
            <div className="mb-5 flex items-center gap-2">
              <Lock className="h-4 w-4 text-teal-600" />
              <h2 className="font-bold text-slate-800">Change Password</h2>
            </div>

            <div className="space-y-4">
              {passwordFields.map(({ name, label }) => (
                <div key={name} className="space-y-1.5">
                  <Label className="text-sm font-medium text-slate-700">{label}</Label>
                  <div className="relative">
                    <Input
                      name={name}
                      type={show ? 'text' : 'password'}
                      value={passwords[name]}
                      onChange={handleChange}
                      className="h-11 rounded-xl border-slate-200 pr-10 shadow-sm focus-visible:border-teal-500 focus-visible:ring-teal-500/20"
                      placeholder="••••••••"
                    />
                    <button
                      type="button"
                      onClick={() => setShow((v) => !v)}
                      className="absolute top-1/2 right-3 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                    >
                      {show ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <AnimatePresence mode="wait">
              {error && (
                <motion.p
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="mt-4 flex items-center gap-2 rounded-lg bg-rose-50 px-3 py-2 text-sm text-rose-600"
                >
                  <AlertCircle className="h-4 w-4 shrink-0" />
                  {error}
                </motion.p>
              )}
              {success && (
                <motion.p
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="mt-4 flex items-center gap-2 rounded-lg bg-emerald-50 px-3 py-2 text-sm text-emerald-700"
                >
                  <CheckCircle className="h-4 w-4 shrink-0" />
                  {success}
                </motion.p>
              )}
            </AnimatePresence>

            <Button onClick={handlePasswordChange} disabled={saving} className="dash-cta mt-5">
              {saving ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Saving...
                </>
              ) : (
                <>
                  <Shield className="mr-2 h-4 w-4" /> Update Password
                </>
              )}
            </Button>
          </CardContent>
        </Card>
      </motion.div>

      {/* Notification preferences */}
      <motion.div variants={itemVariants}>
        <Card className="group dash-card dash-card-hover relative overflow-hidden">
          <div className="dash-accent" />
          <CardContent className="p-6">
            <div className="mb-5 flex items-center gap-2">
              <Bell className="h-4 w-4 text-teal-600" />
              <h2 className="font-bold text-slate-800">Notifications</h2>
            </div>

            <div className="space-y-3">
              {/* Web Push Notification Toggle */}
              <PushNotificationToggle />

              {/* General Notification Preferences */}
              {notifRows.map(({ key, label, desc }) => (
                <div key={key} className="flex items-center justify-between py-2">
                  <div>
                    <p className="text-sm font-medium text-slate-700">{label}</p>
                    <p className="text-xs text-slate-400">{desc}</p>
                  </div>
                  <Toggle
                    checked={notifications[key]}
                    onChange={(v) => setNotifications((n) => ({ ...n, [key]: v }))}
                  />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </motion.div>
  );
}