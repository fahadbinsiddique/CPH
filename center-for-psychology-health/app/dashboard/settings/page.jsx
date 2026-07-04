'use client';

import { useState } from 'react';
import { Loader2, Lock, Bell, Shield, Eye, EyeOff } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import api from '@/lib/api';
import { ConsultantCreateModal } from '@/components/consultant/ConsultantCreateModal';

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

  const handleChange = e => {
    setPasswords(p => ({ ...p, [e.target.name]: e.target.value }));
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

  return (
    <div className="max-w-2xl space-y-5">
      <h1 className="text-2xl font-bold text-slate-800">Settings</h1>

      {/* Change password */}
      <Card className="border-0 shadow-sm rounded-2xl">
        <CardContent className="p-6">
          <div className="flex items-center gap-2 mb-5">
            <Lock className="w-4 h-4 text-slate-500" />
            <h2 className="font-semibold text-slate-800">Change Password</h2>
          </div>

          <div className="space-y-4">
            {[
              { name: 'old_password', label: 'Current Password' },
              { name: 'new_password', label: 'New Password' },
              { name: 'confirm_password', label: 'Confirm New Password' },
            ].map(({ name, label }) => (
              <div key={name} className="space-y-1.5">
                <Label className="text-slate-700">{label}</Label>
                <div className="relative">
                  <Input
                    name={name}
                    type={show ? 'text' : 'password'}
                    value={passwords[name]}
                    onChange={handleChange}
                    className="h-11 pr-10"
                    placeholder="••••••••"
                  />
                  <button
                    type="button"
                    onClick={() => setShow((v) => !v)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                  >
                    {show ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>
            ))}
          </div>

          {error && (
            <p className="text-sm text-red-500 bg-red-50 px-3 py-2 rounded-lg mt-4">{error}</p>
          )}
          {success && (
            <p className="text-sm text-green-600 bg-green-50 px-3 py-2 rounded-lg mt-4">
              ✅ {success}
            </p>
          )}

          <Button
            className="mt-5 bg-blue-600 hover:bg-blue-700 text-white"
            onClick={handlePasswordChange}
            disabled={saving}
          >
            {saving ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" /> Saving...
              </>
            ) : (
              <>
                <Shield className="w-4 h-4 mr-2" /> Update Password
              </>
            )}
          </Button>
        </CardContent>
      </Card>

      {/* Notification preferences — UI only */}
      <Card className="border-0 shadow-sm rounded-2xl">
        <CardContent className="p-6">
          <div className="flex items-center gap-2 mb-5">
            <Bell className="w-4 h-4 text-slate-500" />
            <h2 className="font-semibold text-slate-800">Notifications</h2>
          </div>

          <div className="space-y-3">
            {[
              { label: 'Appointment reminders', desc: 'Get notified 1 hour before sessions' },
              { label: 'Booking confirmations', desc: 'Email when appointments are confirmed' },
              { label: 'New messages', desc: 'Notify on new consultant messages' },
            ].map(({ label, desc }) => (
              <div key={label} className="flex items-center justify-between py-2">
                <div>
                  <p className="text-sm font-medium text-slate-700">{label}</p>
                  <p className="text-xs text-slate-400">{desc}</p>
                </div>
                <label className="relative inline-flex cursor-pointer">
                  <input type="checkbox" defaultChecked className="sr-only peer" />
                  <div className="w-9 h-5 bg-slate-200 peer-focus:ring-2 peer-focus:ring-blue-300 rounded-full peer peer-checked:bg-blue-600 after:content-[''] after:absolute after:top-0.5 after:left-0.5 after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:after:translate-x-4" />
                </label>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Notification preferences — UI only */}
      <Card className="border-0 shadow-sm rounded-2xl">
        <CardContent className="p-6">
          <div className="flex items-center gap-2 mb-5">
            <Bell className="w-4 h-4 text-slate-500" />
            <h2 className="font-semibold text-slate-800">Notifications</h2>
          </div>

          <div className="space-y-3 ">
            <ConsultantCreateModal
              onSuccess={(data) => {
                console.log('Upgraded data:', data)
              }}
            />
          </div>
        </CardContent>
      </Card>
    </div>
  )
}