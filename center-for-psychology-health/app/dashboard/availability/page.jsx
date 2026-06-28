'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Plus,
  Trash2,
  Loader2,
  Save,
  Calendar,
  Clock,
  Sparkles,
  Shield,
  CheckCircle,
  AlertCircle,
  ChevronRight,
  X,
} from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import AuthGuard from '@/components/shared/AuthGuard';
import api from '@/lib/api';

const DAYS = [
  { value: 'saturday', label: 'Saturday' },
  { value: 'sunday', label: 'Sunday' },
  { value: 'monday', label: 'Monday' },
  { value: 'tuesday', label: 'Tuesday' },
  { value: 'wednesday', label: 'Wednesday' },
  { value: 'thursday', label: 'Thursday' },
  { value: 'friday', label: 'Friday' },
];

const TIME_OPTIONS = [
  '08:00',
  '08:30',
  '09:00',
  '09:30',
  '10:00',
  '10:30',
  '11:00',
  '11:30',
  '12:00',
  '13:00',
  '14:00',
  '14:30',
  '15:00',
  '15:30',
  '16:00',
  '16:30',
  '17:00',
  '17:30',
  '18:00',
  '18:30',
  '19:00',
  '19:30',
  '20:00',
];

const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.06, delayChildren: 0.1 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20, scale: 0.97 },
  show: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { type: 'spring', stiffness: 300, damping: 24 },
  },
};

const cardVariants = {
  hidden: { opacity: 0, x: -20, scale: 0.95 },
  show: {
    opacity: 1,
    x: 0,
    scale: 1,
    transition: { type: 'spring', stiffness: 350, damping: 25 },
  },
  exit: {
    opacity: 0,
    x: 20,
    scale: 0.95,
    transition: { duration: 0.2 },
  },
};

const dayColors = {
  saturday: 'from-purple-100 to-violet-100 border-purple-200',
  sunday: 'from-rose-100 to-pink-100 border-rose-200',
  monday: 'from-blue-100 to-indigo-100 border-blue-200',
  tuesday: 'from-emerald-100 to-teal-100 border-emerald-200',
  wednesday: 'from-amber-100 to-orange-100 border-amber-200',
  thursday: 'from-cyan-100 to-sky-100 border-cyan-200',
  friday: 'from-fuchsia-100 to-pink-100 border-fuchsia-200',
};

const dayEmojis = {
  saturday: '🌅',
  sunday: '🌞',
  monday: '📅',
  tuesday: '📋',
  wednesday: '🌿',
  thursday: '🌱',
  friday: '🌟',
};

export default function AvailabilityPage() {
  const [availability, setAvailability] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState(null);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');
  const [form, setForm] = useState({
    day: 'saturday',
    start_time: '09:00',
    end_time: '17:00',
  });

  const fetchAvailability = () => {
    api
      .get('/api/consultants/availability/')
      .then((res) => setAvailability(res.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchAvailability();
  }, []);

  const handleAdd = async () => {
    setError('');
    setSuccess('');

    const alreadyExists = availability.find((a) => a.day === form.day);
    if (alreadyExists) {
      setError(`${form.day} already has a schedule. Delete it first.`);
      return;
    }

    if (form.start_time >= form.end_time) {
      setError('End time must be after start time.');
      return;
    }

    setSaving(true);
    try {
      await api.post('/api/consultants/availability/', form);
      setSuccess('Schedule added successfully.');
      fetchAvailability();
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to add schedule.');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    setDeletingId(id);
    try {
      await api.delete(`/api/consultants/availability/${id}/`);
      setAvailability((prev) => prev.filter((a) => a.id !== id));
      setSuccess('Schedule removed.');
    } catch {
      setError('Failed to delete.');
    } finally {
      setDeletingId(null);
    }
  };

  const scheduledDays = availability.map((a) => a.day);
  const scheduledCount = availability.length;

  return (
    <AuthGuard allowedRoles={['consultant']}>
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="show"
        className="max-w-4xl"
      >
        {/* Header */}
        <motion.div variants={itemVariants} className="mb-6">
          <div className="flex items-center gap-2 mb-1">
            <Badge className="bg-teal-50 text-teal-700 border-teal-200">
              <Calendar className="w-3 h-3 mr-1" />
              Schedule Management
            </Badge>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900">
            Weekly Availability
          </h1>
          <p className="text-sm text-slate-500 font-medium mt-0.5">
            Set your consultation hours so patients can book appointments with you.
          </p>
        </motion.div>

        {/* Stats Row */}
        <motion.div variants={itemVariants} className="flex flex-wrap items-center gap-4 mb-6">
          <div className="bg-white/80 backdrop-blur-sm rounded-xl px-4 py-2 border border-slate-200/60 shadow-sm">
            <span className="text-xs text-slate-400 font-medium">Scheduled Days</span>
            <p className="text-lg font-bold text-slate-900">{scheduledCount} / 7</p>
          </div>
          <div className="bg-white/80 backdrop-blur-sm rounded-xl px-4 py-2 border border-slate-200/60 shadow-sm">
            <span className="text-xs text-slate-400 font-medium">Status</span>
            <p className="text-sm font-semibold text-emerald-600 flex items-center gap-1">
              <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />
              {scheduledCount > 0 ? 'Active' : 'No schedule'}
            </p>
          </div>
          <Badge variant="outline" className="border-slate-200 text-slate-500 ml-auto">
            <Shield className="w-3 h-3 mr-1" />
             schedule 
          </Badge>
        </motion.div>

        {/* Current Schedule */}
        <motion.div variants={itemVariants}>
          <Card className="border border-slate-200/60 bg-white/80 backdrop-blur-sm shadow-sm hover:shadow-xl hover:border-teal-500/20 rounded-2xl overflow-hidden transition-all duration-500">
            <div className="h-1 bg-gradient-to-r from-teal-400 via-emerald-400 to-teal-400 scale-x-0 hover:scale-x-100 transition-transform duration-700 origin-left" />

            <CardContent className="p-6 sm:p-8">
              <div className="flex items-center justify-between mb-5">
                <div>
                  <h2 className="text-lg font-bold text-slate-900 tracking-tight flex items-center gap-2">
                    <Clock className="w-5 h-5 text-teal-500" />
                    Current Schedule
                  </h2>
                  <p className="text-xs text-slate-400 mt-0.5">
                    {scheduledCount > 0
                      ? `You have ${scheduledCount} day${scheduledCount > 1 ? 's' : ''} scheduled`
                      : 'No days scheduled yet'}
                  </p>
                </div>
                <Badge className="bg-teal-50 text-teal-700 border-teal-200">
                  {scheduledCount > 0 ? `${scheduledCount}/7 days` : 'Set up'}
                </Badge>
              </div>

              {loading ? (
                <div className="flex justify-center py-12">
                  <div className="relative">
                    <Loader2 className="w-8 h-8 animate-spin text-teal-600" />
                    <div className="absolute inset-0 w-8 h-8 border-2 border-teal-100 rounded-full animate-ping opacity-20" />
                  </div>
                </div>
              ) : availability.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <AnimatePresence mode="popLayout">
                    {DAYS.filter((d) => scheduledDays.includes(d.value)).map((day) => {
                      const slot = availability.find((a) => a.day === day.value);
                      const dayColor = dayColors[day.value] || 'from-slate-100 to-slate-200';
                      const emoji = dayEmojis[day.value] || '📅';

                      return (
                        <motion.div
                          key={day.value}
                          variants={cardVariants}
                          initial="hidden"
                          animate="show"
                          exit="exit"
                          layout
                          className={`bg-gradient-to-br ${dayColor} border rounded-xl p-4 flex items-center justify-between transition-all hover:shadow-md`}
                        >
                          <div className="flex items-center gap-3">
                            <span className="text-2xl">{emoji}</span>
                            <div>
                              <Badge
                                variant="secondary"
                                className="text-xs font-semibold bg-white/60 text-slate-700 border-white/40"
                              >
                                {day.label}
                              </Badge>
                              <p className="text-sm font-medium text-slate-700 mt-0.5">
                                {slot.start_time} <span className="text-slate-400">—</span>{' '}
                                {slot.end_time}
                              </p>
                            </div>
                          </div>
                          <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={() => handleDelete(slot.id)}
                            disabled={deletingId === slot.id}
                            className="p-2 rounded-lg hover:bg-white/60 transition-all text-slate-400 hover:text-rose-600"
                          >
                            {deletingId === slot.id ? (
                              <Loader2 className="w-4 h-4 animate-spin" />
                            ) : (
                              <Trash2 className="w-4 h-4" />
                            )}
                          </motion.button>
                        </motion.div>
                      );
                    })}
                  </AnimatePresence>
                </div>
              ) : (
                <div className="text-center py-12 border border-dashed border-slate-200 rounded-xl bg-slate-50/40">
                  <div className="w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center mx-auto mb-3 border border-slate-200">
                    <Calendar className="w-8 h-8 text-slate-300" />
                  </div>
                  <p className="font-semibold text-slate-700">No schedule set yet</p>
                  <p className="text-sm text-slate-400 mt-1">
                    Add your available days below
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>

        {/* Add New Schedule */}
        <motion.div variants={itemVariants} className="mt-6">
          <Card className="border border-slate-200/60 bg-white/80 backdrop-blur-sm shadow-sm hover:shadow-xl hover:border-teal-500/20 rounded-2xl overflow-hidden transition-all duration-500">
            <div className="h-1 bg-gradient-to-r from-teal-400 via-emerald-400 to-teal-400 scale-x-0 hover:scale-x-100 transition-transform duration-700 origin-left" />

            <CardContent className="p-6 sm:p-8">
              <div className="flex items-center gap-2 mb-5">
                <div className="p-2 bg-teal-50 rounded-xl">
                  <Plus className="w-5 h-5 text-teal-600" />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-slate-900 tracking-tight">
                    Add New Schedule
                  </h2>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Select a day and set your available hours
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-5">
                {/* Day */}
                <div>
                  <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5 block">
                    Day
                  </label>
                  <select
                    value={form.day}
                    onChange={(e) => setForm((p) => ({ ...p, day: e.target.value }))}
                    className="w-full h-11 px-3 rounded-xl border border-slate-200 text-sm bg-white/50 focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 transition-all shadow-sm"
                  >
                    {DAYS.map((d) => (
                      <option
                        key={d.value}
                        value={d.value}
                        disabled={scheduledDays.includes(d.value)}
                      >
                        {d.label} {scheduledDays.includes(d.value) ? '✓' : ''}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Start Time */}
                <div>
                  <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5 block">
                    Start Time
                  </label>
                  <select
                    value={form.start_time}
                    onChange={(e) =>
                      setForm((p) => ({ ...p, start_time: e.target.value }))
                    }
                    className="w-full h-11 px-3 rounded-xl border border-slate-200 text-sm bg-white/50 focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 transition-all shadow-sm"
                  >
                    {TIME_OPTIONS.map((t) => (
                      <option key={t} value={t}>
                        {t}
                      </option>
                    ))}
                  </select>
                </div>

                {/* End Time */}
                <div>
                  <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5 block">
                    End Time
                  </label>
                  <select
                    value={form.end_time}
                    onChange={(e) =>
                      setForm((p) => ({ ...p, end_time: e.target.value }))
                    }
                    className="w-full h-11 px-3 rounded-xl border border-slate-200 text-sm bg-white/50 focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 transition-all shadow-sm"
                  >
                    {TIME_OPTIONS.map((t) => (
                      <option key={t} value={t}>
                        {t}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Messages */}
              <AnimatePresence mode="wait">
                {error && (
                  <motion.div
                    initial={{ opacity: 0, height: 0, y: -10 }}
                    animate={{ opacity: 1, height: 'auto', y: 0 }}
                    exit={{ opacity: 0, height: 0, y: -10 }}
                    className="flex items-center gap-3 text-sm font-medium text-rose-700 bg-rose-50/80 border border-rose-200/60 px-4 py-3 rounded-xl mb-4"
                  >
                    <div className="p-1 bg-rose-100 rounded-full">
                      <AlertCircle className="w-4 h-4 text-rose-600" />
                    </div>
                    <span>{error}</span>
                  </motion.div>
                )}

                {success && (
                  <motion.div
                    initial={{ opacity: 0, height: 0, y: -10 }}
                    animate={{ opacity: 1, height: 'auto', y: 0 }}
                    exit={{ opacity: 0, height: 0, y: -10 }}
                    className="flex items-center gap-3 text-sm font-medium text-emerald-700 bg-emerald-50/80 border border-emerald-200/60 px-4 py-3 rounded-xl mb-4"
                  >
                    <div className="p-1 bg-emerald-100 rounded-full">
                      <CheckCircle className="w-4 h-4 text-emerald-600" />
                    </div>
                    <span>{success}</span>
                  </motion.div>
                )}
              </AnimatePresence>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleAdd}
                disabled={saving}
                className="w-full sm:w-auto bg-gradient-to-r from-teal-600 to-emerald-600 hover:from-teal-700 hover:to-emerald-700 text-white rounded-xl px-8 h-12 font-semibold shadow-lg shadow-teal-600/20 transition-all group flex items-center justify-center"
              >
                {saving ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Adding...
                  </>
                ) : (
                  <>
                    <Plus className="w-4 h-4 mr-2 group-hover:scale-110 transition-transform" />
                    Add Schedule
                  </>
                )}
              </motion.button>
            </CardContent>
          </Card>
        </motion.div>
      </motion.div>
    </AuthGuard>
  );
}