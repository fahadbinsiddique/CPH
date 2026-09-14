'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Plus,
  Trash2,
  Loader2,
  Calendar,
  Clock,
  Shield,
  CheckCircle,
  AlertCircle,
} from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import PageHeader from '@/components/dashboard/ui/PageHeader';
import LoadingState from '@/components/dashboard/ui/LoadingState';
import EmptyState from '@/components/dashboard/ui/EmptyState';
import AuthGuard from '@/components/shared/AuthGuard';
import { containerVariants, itemVariants } from '@/lib/motion';
import { createAvailability, deleteAvailability } from '../actions/availabilityActions';

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
  '08:00', '08:30', '09:00', '09:30', '10:00', '10:30',
  '11:00', '11:30', '12:00', '13:00', '14:00', '14:30',
  '15:00', '15:30', '16:00', '16:30', '17:00', '17:30',
  '18:00', '18:30', '19:00', '19:30', '20:00',
];

const cardVariants = {
  hidden: { opacity: 0, x: -20, scale: 0.95 },
  show: {
    opacity: 1,
    x: 0,
    scale: 1,
    transition: { type: 'spring', stiffness: 350, damping: 25 },
  },
  exit: { opacity: 0, x: 20, scale: 0.95, transition: { duration: 0.2 } },
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

export default function AvailabilityClient({ initialAvailability }) {
  const [availability, setAvailability] = useState(initialAvailability);
  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState(null);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');
  const [form, setForm] = useState({
    day: 'saturday',
    start_time: '09:00',
    end_time: '17:00',
  });

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
      const result = await createAvailability(form);
      if (result.success) {
        setSuccess('Schedule added successfully.');
        setAvailability((prev) => [...prev, result.data]);
      } else {
        setError(result.error);
      }
    } catch (err) {
      setError('Failed to add schedule.');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    setDeletingId(id);
    try {
      const result = await deleteAvailability(id);
      if (result.success) {
        setAvailability((prev) => prev.filter((a) => a.id !== id));
        setSuccess('Schedule removed.');
      } else {
        setError(result.error);
      }
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
      <motion.div variants={containerVariants} initial="hidden" animate="show" className="max-w-4xl space-y-6">
        <PageHeader
          badge="Schedule Management"
          badgeIcon={Calendar}
          title="Weekly Availability"
          subtitle="Set your consultation hours so patients can book appointments with you."
          actions={
            <Badge variant="outline" className="border-slate-200 text-slate-500">
              <Shield className="mr-1 h-3 w-3" />
              Consultant View
            </Badge>
          }
        />

        <motion.div variants={itemVariants} className="flex flex-wrap items-center gap-4">
          <div className="bg-white/80 rounded-xl border border-slate-200/60 px-4 py-2 shadow-sm backdrop-blur-sm">
            <span className="text-xs font-medium text-slate-400">Scheduled Days</span>
            <p className="text-lg font-bold text-slate-900">{scheduledCount} / 7</p>
          </div>
          <div className="bg-white/80 rounded-xl border border-slate-200/60 px-4 py-2 shadow-sm backdrop-blur-sm">
            <span className="text-xs font-medium text-slate-400">Status</span>
            <p className="flex items-center gap-1 text-sm font-semibold text-emerald-600">
              <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-500" />
              {scheduledCount > 0 ? 'Active' : 'No schedule'}
            </p>
          </div>
          <Badge className="ml-auto border-teal-200 bg-teal-50 text-teal-700">
            {scheduledCount > 0 ? `${scheduledCount}/7 days` : 'Set up'}
          </Badge>
        </motion.div>

        <motion.div variants={itemVariants}>
          <Card className="group dash-card dash-card-hover relative overflow-hidden">
            <div className="dash-accent" />
            <CardContent className="p-6 sm:p-8">
              <div className="mb-5 flex items-center justify-between">
                <div>
                  <h2 className="flex items-center gap-2 text-lg font-bold tracking-tight text-slate-900">
                    <Clock className="h-5 w-5 text-teal-500" />
                    Current Schedule
                  </h2>
                  <p className="mt-0.5 text-xs text-slate-400">
                    {scheduledCount > 0
                      ? `You have ${scheduledCount} day${scheduledCount > 1 ? 's' : ''} scheduled`
                      : 'No days scheduled yet'}
                  </p>
                </div>
              </div>

              {availability.length > 0 ? (
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                  <AnimatePresence mode="popLayout">
                    {DAYS.filter((d) => scheduledDays.includes(d.value)).map((day) => {
                      const slot = availability.find((a) => a.day === day.value);
                      const dayColor = dayColors[day.value] || 'from-slate-100 to-slate-200';

                      return (
                        <motion.div
                          key={day.value}
                          variants={cardVariants}
                          initial="hidden"
                          animate="show"
                          exit="exit"
                          layout
                          className={`flex items-center justify-between rounded-xl border bg-gradient-to-br p-4 transition-all hover:shadow-md ${dayColor}`}
                        >
                          <div className="flex items-center gap-3">
                            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-white/60 text-teal-600 shadow-sm">
                              <Calendar className="h-5 w-5" />
                            </div>
                            <div>
                              <Badge
                                variant="secondary"
                                className="border-white/40 bg-white/60 text-xs font-semibold text-slate-700"
                              >
                                {day.label}
                              </Badge>
                              <p className="mt-0.5 text-sm font-medium text-slate-700">
                                {slot.start_time} <span className="text-slate-400">—</span> {slot.end_time}
                              </p>
                            </div>
                          </div>
                          <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={() => handleDelete(slot.id)}
                            disabled={deletingId === slot.id}
                            className="rounded-lg p-2 text-slate-400 transition-all hover:bg-white/60 hover:text-rose-600"
                          >
                            {deletingId === slot.id ? (
                              <Loader2 className="h-4 w-4 animate-spin" />
                            ) : (
                              <Trash2 className="h-4 w-4" />
                            )}
                          </motion.button>
                        </motion.div>
                      );
                    })}
                  </AnimatePresence>
                </div>
              ) : (
                <EmptyState
                  icon={Calendar}
                  title="No schedule set yet"
                  description="Add your available days below"
                />
              )}
            </CardContent>
          </Card>
        </motion.div>

        <motion.div variants={itemVariants}>
          <Card className="group dash-card dash-card-hover relative overflow-hidden">
            <div className="dash-accent" />
            <CardContent className="p-6 sm:p-8">
              <div className="mb-5 flex items-center gap-2">
                <div className="rounded-xl bg-teal-50 p-2">
                  <Plus className="h-5 w-5 text-teal-600" />
                </div>
                <div>
                  <h2 className="text-lg font-bold tracking-tight text-slate-900">Add New Schedule</h2>
                  <p className="mt-0.5 text-xs text-slate-400">Select a day and set your available hours</p>
                </div>
              </div>

              <div className="mb-5 grid grid-cols-1 gap-4 sm:grid-cols-3">
                <div>
                  <label className="mb-1.5 block text-xs font-semibold tracking-wider text-slate-500 uppercase">
                    Day
                  </label>
                  <Select
                    value={form.day}
                    onValueChange={(day) => setForm((p) => ({ ...p, day }))}
                  >
                    <SelectTrigger className="h-11 rounded-xl bg-white/50 border-slate-200 shadow-sm">
                      <SelectValue placeholder="Select a day" />
                    </SelectTrigger>
                    <SelectContent>
                      {DAYS.map((d) => (
                        <SelectItem key={d.value} value={d.value} disabled={scheduledDays.includes(d.value)}>
                          {d.label} {scheduledDays.includes(d.value) ? '(scheduled)' : ''}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="mb-1.5 block text-xs font-semibold tracking-wider text-slate-500 uppercase">
                    Start Time
                  </label>
                  <Select
                    value={form.start_time}
                    onValueChange={(start_time) => setForm((p) => ({ ...p, start_time }))}
                  >
                    <SelectTrigger className="h-11 rounded-xl bg-white/50 border-slate-200 shadow-sm">
                      <SelectValue placeholder="Start time" />
                    </SelectTrigger>
                    <SelectContent>
                      {TIME_OPTIONS.map((t) => (
                        <SelectItem key={t} value={t}>
                          {t}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="mb-1.5 block text-xs font-semibold tracking-wider text-slate-500 uppercase">
                    End Time
                  </label>
                  <Select
                    value={form.end_time}
                    onValueChange={(end_time) => setForm((p) => ({ ...p, end_time }))}
                  >
                    <SelectTrigger className="h-11 rounded-xl bg-white/50 border-slate-200 shadow-sm">
                      <SelectValue placeholder="End time" />
                    </SelectTrigger>
                    <SelectContent>
                      {TIME_OPTIONS.map((t) => (
                        <SelectItem key={t} value={t}>
                          {t}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <AnimatePresence mode="wait">
                {error && (
                  <motion.div
                    initial={{ opacity: 0, height: 0, y: -10 }}
                    animate={{ opacity: 1, height: 'auto', y: 0 }}
                    exit={{ opacity: 0, height: 0, y: -10 }}
                    className="mb-4 flex items-center gap-3 rounded-xl border border-rose-200/60 bg-rose-50/80 px-4 py-3 text-sm font-medium text-rose-700"
                  >
                    <div className="rounded-full bg-rose-100 p-1">
                      <AlertCircle className="h-4 w-4 text-rose-600" />
                    </div>
                    <span>{error}</span>
                  </motion.div>
                )}

                {success && (
                  <motion.div
                    initial={{ opacity: 0, height: 0, y: -10 }}
                    animate={{ opacity: 1, height: 'auto', y: 0 }}
                    exit={{ opacity: 0, height: 0, y: -10 }}
                    className="mb-4 flex items-center gap-3 rounded-xl border border-emerald-200/60 bg-emerald-50/80 px-4 py-3 text-sm font-medium text-emerald-700"
                  >
                    <div className="rounded-full bg-emerald-100 p-1">
                      <CheckCircle className="h-4 w-4 text-emerald-600" />
                    </div>
                    <span>{success}</span>
                  </motion.div>
                )}
              </AnimatePresence>

              <Button onClick={handleAdd} disabled={saving} className="dash-cta h-12 w-full px-8 sm:w-auto">
                {saving ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Adding...
                  </>
                ) : (
                  <>
                    <Plus className="mr-2 h-4 w-4" />
                    Add Schedule
                  </>
                )}
              </Button>
            </CardContent>
          </Card>
        </motion.div>
      </motion.div>
    </AuthGuard>
  );
}
