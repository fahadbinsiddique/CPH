'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import {
  Search, Loader2, CheckCircle2, XCircle, Shield,
  Plus, Pencil, Trash2, Users, Check, Clock, UploadCloud
} from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Dialog, DialogContent, DialogHeader,
  DialogTitle, DialogFooter
} from '@/components/ui/dialog';
import { toast } from 'sonner';
import AuthGuard from '@/components/shared/AuthGuard';
import PageHeader from '@/components/dashboard/ui/PageHeader';
import LoadingState from '@/components/dashboard/ui/LoadingState';
import EmptyState from '@/components/dashboard/ui/EmptyState';
import ConfirmDialog from '@/components/dashboard/ui/ConfirmDialog';
import { consultantService } from '@/services/consultantService';
import { containerVariants, itemVariants } from '@/lib/motion';
import Image from 'next/image';

const EMPTY_FORM = {
  full_name: '', email: '', password: '',
  bio: '', experience_years: 0, consultation_fee: 0,
  languages: '', location: '', specializations: [],
  is_available: true, profile_image: null,
};

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

const SESSION_TYPES = [
  { value: 'online', label: 'Online' },
  { value: 'offline', label: 'In-person' },
  { value: 'both', label: 'Both' },
];

let slotKeySeq = 0;
const nextSlotKey = () => `slot-${++slotKeySeq}`;

export default function AdminConsultantsPage() {
  const [consultants, setConsultants] = useState([]);
  const [specializations, setSpecializations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [updatingId, setUpdatingId] = useState(null);
  const [deletingId, setDeletingId] = useState(null);
  const [confirmDelete, setConfirmDelete] = useState(null);

  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [availabilitySlots, setAvailabilitySlots] = useState([]);
  const [saving, setSaving] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(null);
  const [error, setError] = useState('');

  const fetch = () => {
    consultantService.adminGetAll()
      .then(res => setConsultants(res.data.results || res.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetch(); }, []);

  useEffect(() => {
    consultantService.getSpecializations()
      .then(res => setSpecializations(res.data))
      .catch(console.error);
  }, []);

  const handleVerify = async (id, value) => {
    setUpdatingId(id);
    try {
      await consultantService.adminVerify(id, value);
      toast.success(value ? 'Consultant verified' : 'Verification revoked');
      fetch();
    } catch {
      toast.error('Failed to update verification status');
    } finally {
      setUpdatingId(null);
    }
  };

  const handleDelete = async (id) => {
    setDeletingId(id);
    try {
      await consultantService.adminDelete(id);
      setConsultants(prev => prev.filter(c => c.id !== id));
      toast.success('Consultant deleted');
      setConfirmDelete(null);
    } catch {
      console.error('Delete failed');
      toast.error('Failed to delete consultant');
      setConfirmDelete(null);
    } finally {
      setDeletingId(null);
    }
  };

  const openCreate = () => {
    setEditing(null);
    setForm(EMPTY_FORM);
    setAvailabilitySlots([]);
    setUploadProgress(null);
    setError('');
    setModalOpen(true);
  };

  const openEdit = (c) => {
    setEditing(c);
    setForm({
      full_name: c.user?.full_name || '',
      email: c.user?.email || '',
      password: '',
      bio: c.bio || '',
      experience_years: c.experience_years || 0,
      consultation_fee: c.consultation_fee || 0,
      languages: c.languages || '',
      location: c.location || '',
      specializations: c.specializations?.map(s => s.id) || [],
      is_available: c.is_available,
      profile_image: null,
    });
    setAvailabilitySlots(
      c.availability?.map(slot => ({
        key: nextSlotKey(),
        day: slot.day,
        start_time: slot.start_time,
        end_time: slot.end_time,
        session_type: slot.session_type || 'both',
      })) || []
    );
    setUploadProgress(null);
    setError('');
    setModalOpen(true);
  };

  const toggleSpec = (id) => {
    setForm(prev => ({
      ...prev,
      specializations: prev.specializations.includes(id)
        ? prev.specializations.filter(s => s !== id)
        : [...prev.specializations, id]
    }));
  };

  const updateSlot = (key, patch) => {
    setAvailabilitySlots(prev =>
      prev.map(s => (s.key === key ? { ...s, ...patch } : s))
    );
  };

  const removeSlot = (key) => {
    setAvailabilitySlots(prev => prev.filter(s => s.key !== key));
  };

  const addSlot = () => {
    const usedDays = availabilitySlots.map(s => s.day);
    const freeDay = DAYS.find(d => !usedDays.includes(d.value));
    setAvailabilitySlots(prev => [
      ...prev,
      {
        key: nextSlotKey(),
        day: freeDay ? freeDay.value : 'saturday',
        start_time: '09:00',
        end_time: '17:00',
        session_type: 'both',
      },
    ]);
  };

  const handleSave = async () => {
    if (!editing && (!form.full_name || !form.email || !form.password)) {
      setError('Name, email and password are required for new consultants.');
      return;
    }

    const invalidSlot = availabilitySlots.find(s => s.start_time >= s.end_time);
    const days = availabilitySlots.map(s => s.day);
    const hasDuplicateDay = new Set(days).size !== days.length;
    if (invalidSlot || hasDuplicateDay) {
      setError('Fix availability: end time must be after start time, and each day can only be used once.');
      return;
    }

    setSaving(true);
    setError('');
    setUploadProgress(0);

    try {
      const fd = new FormData();
      Object.entries(form).forEach(([key, val]) => {
        if (key === 'specializations') {
          val.forEach(id => fd.append('specializations', id));
        } else if (key === 'profile_image') {
          if (val) fd.append(key, val);
        } else if (key === 'password' && editing && !val) {
          // skip empty password on edit
        } else {
          fd.append(key, val);
        }
      });

      fd.append('availability', JSON.stringify(
        availabilitySlots.map(({ day, start_time, end_time, session_type }) => ({
          day, start_time, end_time, session_type,
        }))
      ));

      const config = {
        onUploadProgress: (e) => {
          setUploadProgress(e.total ? Math.round((e.loaded / e.total) * 100) : -1);
        },
        timeout: 60000,
      };

      if (editing) {
        await consultantService.adminUpdate(editing.id, fd, config);
        toast.success('Consultant updated');
      } else {
        await consultantService.adminCreate(fd, config);
        toast.success('Consultant created');
      }

      setModalOpen(false);
      fetch();
    } catch (err) {
      const data = err.response?.data;
      const availabilityMsg = Array.isArray(data?.availability)
        ? data.availability.join(' ')
        : (typeof data?.availability === 'string' ? data.availability : '');
      setError(
        data?.email?.[0] ||
        availabilityMsg ||
        data?.detail ||
        'Failed to save consultant.'
      );
    } finally {
      setSaving(false);
      setUploadProgress(null);
    }
  };

  const filtered = consultants.filter(c =>
    c.user?.full_name?.toLowerCase().includes(search.toLowerCase()) ||
    c.user?.email?.toLowerCase().includes(search.toLowerCase())
  );

  const verified = filtered.filter(c => c.is_verified);
  const unverified = filtered.filter(c => !c.is_verified);

  const inputCls = "h-10 rounded-xl border-slate-200 shadow-sm focus-visible:border-teal-500 focus-visible:ring-teal-500/20";

  const usedAvailabilityDays = availabilitySlots.map(s => s.day);

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="show"
      className="space-y-6"
    >
      <PageHeader
        badge="Practitioner Management"
        badgeIcon={Users}
        title="Consultants"
        subtitle={`${verified.length} verified · ${unverified.length} pending verification`}
        actions={
          <Button onClick={openCreate} className="dash-cta">
            <Plus className="h-4 w-4" /> Add Consultant
          </Button>
        }
      />

      <motion.div variants={itemVariants}>
        <div className="relative">
          <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <Input
            placeholder="Search consultants..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="h-12 rounded-xl border-slate-200/60 bg-white/80 pl-10 shadow-sm focus-visible:border-teal-500 focus-visible:ring-teal-500/20"
          />
        </div>
      </motion.div>

      {loading ? (
        <LoadingState label="Loading consultants..." />
      ) : filtered.length > 0 ? (
        <motion.div variants={itemVariants}>
          <Tabs defaultValue="all">
            <TabsList className="mb-5 flex w-fit gap-1 rounded-2xl border border-slate-200/60 bg-white/80 p-1.5 shadow-sm backdrop-blur-sm">
              <TabsTrigger value="all" className="rounded-xl data-[state=active]:bg-teal-600 data-[state=active]:text-white">
                All ({filtered.length})
              </TabsTrigger>
              <TabsTrigger value="pending" className="rounded-xl data-[state=active]:bg-amber-500 data-[state=active]:text-white">
                Pending ({unverified.length})
              </TabsTrigger>
              <TabsTrigger value="verified" className="rounded-xl data-[state=active]:bg-emerald-600 data-[state=active]:text-white">
                Verified ({verified.length})
              </TabsTrigger>
            </TabsList>

            {[
              { key: 'all', data: filtered },
              { key: 'pending', data: unverified },
              { key: 'verified', data: verified },
            ].map(({ key, data }) => (
              <TabsContent key={key} value={key}>
                <div className="space-y-3">
                  {data.length > 0 ? data.map((c) => (
                    <Card key={c.id} className="group dash-card dash-card-hover relative overflow-hidden">
                      <div className="dash-accent" />
                      <CardContent className="flex items-center gap-4 p-4">
                        <div className="flex h-11 w-11 shrink-0 items-center justify-center overflow-hidden rounded-full bg-gradient-to-br from-teal-100 to-emerald-100 font-bold text-teal-700">
                          {c.profile_image
                            ? <Image src={c.profile_image} alt="" height={50}
                               width={50} className="h-full w-full object-cover" />
                            : c.user?.full_name?.charAt(0)
                          }
                        </div>

                        <div className="min-w-0 flex-1">
                          <div className="flex items-center gap-2">
                            <p className="font-bold text-slate-800">{c.user?.full_name}</p>
                            {c.is_verified && <CheckCircle2 className="h-4 w-4 text-emerald-500" />}
                          </div>
                          <p className="text-xs text-slate-400">{c.user?.email}</p>
                          <div className="mt-1.5 flex flex-wrap items-center gap-2">
                            {c.specializations?.slice(0, 3).map(s => (
                              <Badge key={s.id} variant="secondary" className="rounded-full bg-slate-100 px-2 text-xs text-slate-600">
                                {s.name}
                              </Badge>
                            ))}
                            <span className="text-xs text-slate-400">
                              {c.experience_years}y exp · ৳{c.consultation_fee}
                            </span>
                          </div>
                        </div>

                        <div className="flex shrink-0 items-center gap-1.5">
                          {updatingId === c.id ? (
                            <Loader2 className="h-5 w-5 animate-spin text-teal-600" />
                          ) : c.is_verified ? (
                            <Button
                              size="sm" variant="outline"
                              className="h-8 border-rose-200 text-xs text-rose-500 hover:bg-rose-50"
                              onClick={() => handleVerify(c.id, false)}
                            >
                              <XCircle className="mr-1 h-3.5 w-3.5" /> Revoke
                            </Button>
                          ) : (
                            <Button
                              size="sm"
                              className="h-8 bg-emerald-600 text-xs text-white hover:bg-emerald-700"
                              onClick={() => handleVerify(c.id, true)}
                            >
                              <Shield className="mr-1 h-3.5 w-3.5" /> Verify
                            </Button>
                          )}

                          <Button
                            size="sm" variant="ghost"
                            className="h-8 w-8 p-0 text-slate-400 hover:bg-teal-50 hover:text-teal-600"
                            onClick={() => openEdit(c)}
                          >
                            <Pencil className="h-4 w-4" />
                          </Button>

                          <Button
                            size="sm" variant="ghost"
                            className="h-8 w-8 p-0 text-slate-400 hover:bg-rose-50 hover:text-rose-500"
                            onClick={() => setConfirmDelete(c)}
                            disabled={deletingId === c.id}
                          >
                            {deletingId === c.id
                              ? <Loader2 className="h-4 w-4 animate-spin" />
                              : <Trash2 className="h-4 w-4" />
                            }
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  )) : (
                    <EmptyState
                      icon={Users}
                      title="No consultants found"
                      description={search ? `No results match "${search}".` : 'There are no consultants in this category yet.'}
                      action={search && (
                        <Button variant="outline" onClick={() => setSearch('')} className="rounded-xl">
                          Clear Search
                        </Button>
                      )}
                    />
                  )}
                </div>
              </TabsContent>
            ))}
          </Tabs>
        </motion.div>
      ) : (
        <EmptyState
          icon={Users}
          title="No consultants found"
          description="Add your first consultant to start building your practitioner network."
          action={
            <Button onClick={openCreate} className="dash-cta">
              <Plus className="h-4 w-4" /> Add Consultant
            </Button>
          }
        />
      )}

      <Dialog open={modalOpen} onOpenChange={setModalOpen}>
        <DialogContent className="cph-scroll max-h-[85dvh] sm:max-h-[90vh] sm:max-w-3xl overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editing ? 'Edit Consultant' : 'Add New Consultant'}</DialogTitle>
          </DialogHeader>

          <div className="space-y-4 py-2">
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <div className="space-y-1.5">
                <Label className="text-sm font-medium text-slate-700">Full Name {!editing && '*'}</Label>
                <Input
                  value={form.full_name}
                  onChange={e => setForm(p => ({ ...p, full_name: e.target.value }))}
                  className={inputCls}
                  disabled={!!editing}
                />
              </div>
              <div className="space-y-1.5">
                <Label className="text-sm font-medium text-slate-700">Email {!editing && '*'}</Label>
                <Input
                  type="email"
                  value={form.email}
                  onChange={e => setForm(p => ({ ...p, email: e.target.value }))}
                  className={inputCls}
                  disabled={!!editing}
                />
              </div>
            </div>

            {!editing && (
              <div className="space-y-1.5">
                <Label className="text-sm font-medium text-slate-700">Password *</Label>
                <Input
                  type="password"
                  value={form.password}
                  onChange={e => setForm(p => ({ ...p, password: e.target.value }))}
                  className={inputCls}
                  placeholder="Minimum 8 characters"
                />
              </div>
            )}

            <div className="space-y-1.5">
              <Label className="text-sm font-medium text-slate-700">Bio</Label>
              <Textarea
                rows={3}
                value={form.bio}
                onChange={e => setForm(p => ({ ...p, bio: e.target.value }))}
                className="rounded-xl border-slate-200 shadow-sm resize-none focus-visible:border-teal-500 focus-visible:ring-teal-500/20"
              />
            </div>

            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <div className="space-y-1.5">
                <Label className="text-sm font-medium text-slate-700">Experience (years)</Label>
                <Input
                  type="number"
                  value={form.experience_years}
                  onChange={e => setForm(p => ({ ...p, experience_years: e.target.value }))}
                  className={inputCls}
                />
              </div>
              <div className="space-y-1.5">
                <Label className="text-sm font-medium text-slate-700">Consultation Fee (৳)</Label>
                <Input
                  type="number"
                  value={form.consultation_fee}
                  onChange={e => setForm(p => ({ ...p, consultation_fee: e.target.value }))}
                  className={inputCls}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <div className="space-y-1.5">
                <Label className="text-sm font-medium text-slate-700">Location</Label>
                <Input
                  value={form.location}
                  onChange={e => setForm(p => ({ ...p, location: e.target.value }))}
                  className={inputCls}
                  placeholder="e.g. Dhaka"
                />
              </div>
              <div className="space-y-1.5">
                <Label className="text-sm font-medium text-slate-700">Languages</Label>
                <Input
                  value={form.languages}
                  onChange={e => setForm(p => ({ ...p, languages: e.target.value }))}
                  className={inputCls}
                  placeholder="e.g. Bengali, English"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <Label className="text-sm font-medium text-slate-700">Specializations</Label>
                <span className="text-xs font-semibold text-teal-600">
                  {form.specializations.length} selected
                </span>
              </div>
              <div className="cph-scroll max-h-48 overflow-y-auto rounded-xl border border-slate-200 bg-slate-50 p-1.5">
                {specializations.length > 0 ? specializations.map(spec => {
                  const selected = form.specializations.includes(spec.id);
                  return (
                    <label
                      key={spec.id}
                      className={`flex cursor-pointer items-center gap-3 rounded-lg px-3 py-2 text-sm transition-all ${
                        selected
                          ? 'bg-teal-50 font-medium text-teal-700'
                          : 'text-slate-700 hover:bg-white'
                      }`}
                    >
                      <input
                        type="checkbox"
                        checked={selected}
                        onChange={() => toggleSpec(spec.id)}
                        className="h-4 w-4 shrink-0 rounded border-slate-300 accent-teal-600"
                      />
                      <span className="flex-1">{spec.name}</span>
                      {selected && <Check className="h-4 w-4 text-teal-600" />}
                    </label>
                  );
                }) : (
                  <p className="px-3 py-2 text-sm text-slate-400">Loading specializations...</p>
                )}
              </div>
            </div>

            <div className="space-y-1.5">
              <Label className="text-sm font-medium text-slate-700">Profile Image</Label>
              <input
                type="file"
                accept="image/*"
                onChange={e => setForm(p => ({ ...p, profile_image: e.target.files[0] }))}
                className="w-full text-sm text-slate-500 file:mr-3 file:rounded-lg file:border-0 file:bg-teal-50 file:px-4 file:py-2 file:text-sm file:font-medium file:text-teal-600 hover:file:bg-teal-100"
              />
            </div>

            <div className="space-y-3 rounded-xl border border-slate-200 bg-slate-50/50 p-3.5">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <Label className="flex items-center gap-2 text-sm font-medium text-slate-700">
                    <Clock className="h-4 w-4 text-teal-600" />
                    Weekly Availability
                  </Label>
                  <p className="mt-0.5 text-xs text-slate-400">
                    Set consultation hours for each day of the week.
                  </p>
                </div>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={addSlot}
                  disabled={availabilitySlots.length >= DAYS.length}
                  className="shrink-0 rounded-xl border-slate-200 text-teal-600 hover:bg-teal-50 hover:text-teal-700"
                >
                  <Plus className="mr-1 h-3.5 w-3.5" /> Add Slot
                </Button>
              </div>

              {availabilitySlots.length === 0 ? (
                <div className="rounded-xl border border-dashed border-slate-200 bg-white/60 px-4 py-5 text-center text-sm text-slate-400">
                  No availability slots set. Add a slot to define consultation hours.
                </div>
              ) : (
                <div className="cph-scroll max-h-64 space-y-2.5 overflow-y-auto pr-1">
                  {availabilitySlots.map((slot, i) => (
                    <div
                      key={slot.key}
                      className="rounded-xl border border-slate-200 bg-white p-2.5"
                    >
                      {/* Mobile: stacked layout */}
                      <div className="space-y-2 sm:hidden">
                        <div className="flex items-center gap-2">
                          <div className="min-w-0 flex-1">
                            <Select
                              value={slot.day}
                              onValueChange={v => updateSlot(slot.key, { day: v })}
                            >
                              <SelectTrigger className="h-9 rounded-lg border-slate-200 bg-white text-sm">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                {DAYS.map(d => (
                                  <SelectItem
                                    key={d.value}
                                    value={d.value}
                                    disabled={usedAvailabilityDays.includes(d.value) && usedAvailabilityDays[i] !== d.value}
                                  >
                                    {d.label}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon-sm"
                            onClick={() => removeSlot(slot.key)}
                            className="h-9 w-9 shrink-0 text-slate-400 hover:bg-rose-50 hover:text-rose-500"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                        <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-1.5">
                          <Select
                            value={slot.start_time}
                            onValueChange={v => updateSlot(slot.key, { start_time: v })}
                          >
                            <SelectTrigger className="h-9 rounded-lg border-slate-200 bg-white text-sm">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              {TIME_OPTIONS.map(t => (
                                <SelectItem key={t} value={t}>{t}</SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <span className="text-xs text-slate-400">to</span>
                          <Select
                            value={slot.end_time}
                            onValueChange={v => updateSlot(slot.key, { end_time: v })}
                          >
                            <SelectTrigger className="h-9 rounded-lg border-slate-200 bg-white text-sm">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              {TIME_OPTIONS.map(t => (
                                <SelectItem key={t} value={t}>{t}</SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                        <Select
                          value={slot.session_type}
                          onValueChange={v => updateSlot(slot.key, { session_type: v })}
                        >
                          <SelectTrigger className="h-9 rounded-lg border-slate-200 bg-white text-sm">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {SESSION_TYPES.map(t => (
                              <SelectItem key={t.value} value={t.value}>{t.label}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>

                      {/* Desktop: horizontal layout */}
                      <div className="hidden grid-cols-12 items-center gap-2 sm:grid">
                        <div className="col-span-3">
                          <Select
                            value={slot.day}
                            onValueChange={v => updateSlot(slot.key, { day: v })}
                          >
                            <SelectTrigger className="h-9 rounded-lg border-slate-200 bg-white text-sm">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              {DAYS.map(d => (
                                <SelectItem
                                  key={d.value}
                                  value={d.value}
                                  disabled={usedAvailabilityDays.includes(d.value) && usedAvailabilityDays[i] !== d.value}
                                >
                                  {d.label}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>

                        <div className="col-span-2">
                          <Select
                            value={slot.start_time}
                            onValueChange={v => updateSlot(slot.key, { start_time: v })}
                          >
                            <SelectTrigger className="h-9 rounded-lg border-slate-200 bg-white text-sm">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              {TIME_OPTIONS.map(t => (
                                <SelectItem key={t} value={t}>{t}</SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>

                        <span className="col-span-1 text-center text-xs text-slate-400">to</span>

                        <div className="col-span-2">
                          <Select
                            value={slot.end_time}
                            onValueChange={v => updateSlot(slot.key, { end_time: v })}
                          >
                            <SelectTrigger className="h-9 rounded-lg border-slate-200 bg-white text-sm">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              {TIME_OPTIONS.map(t => (
                                <SelectItem key={t} value={t}>{t}</SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>

                        <div className="col-span-3">
                          <Select
                            value={slot.session_type}
                            onValueChange={v => updateSlot(slot.key, { session_type: v })}
                          >
                            <SelectTrigger className="h-9 rounded-lg border-slate-200 bg-white text-sm">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              {SESSION_TYPES.map(t => (
                                <SelectItem key={t.value} value={t.value}>{t.label}</SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>

                        <div className="col-span-1 flex justify-end">
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon-sm"
                            onClick={() => removeSlot(slot.key)}
                            className="h-8 w-8 text-slate-400 hover:bg-rose-50 hover:text-rose-500"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="flex items-center gap-3">
              <input
                type="checkbox"
                id="is_available"
                checked={form.is_available}
                onChange={e => setForm(p => ({ ...p, is_available: e.target.checked }))}
                className="h-4 w-4 accent-teal-600"
              />
              <Label htmlFor="is_available" className="cursor-pointer text-sm font-medium text-slate-700">
                Available for booking
              </Label>
            </div>

            {error && (
              <p className="rounded-lg bg-rose-50 px-3 py-2 text-sm text-rose-600">{error}</p>
            )}

            {saving && (
              <div className="space-y-1.5">
                <div className="flex items-center justify-between text-xs font-medium">
                  <span className="flex items-center gap-1.5 text-slate-500">
                    <UploadCloud className="h-3.5 w-3.5 text-teal-600" />
                    Saving consultant...
                  </span>
                  {uploadProgress !== null && uploadProgress >= 0 && (
                    <span className="text-teal-600">{uploadProgress}%</span>
                  )}
                </div>
                <div className="h-2 w-full overflow-hidden rounded-full bg-slate-100">
                  <div
                    className={
                      uploadProgress === -1
                        ? 'h-full w-1/3 animate-pulse rounded-full bg-teal-400'
                        : 'h-full rounded-full bg-gradient-to-r from-teal-500 to-emerald-500 transition-[width] duration-200 ease-out'
                    }
                    style={uploadProgress >= 0 ? { width: `${uploadProgress}%` } : undefined}
                  />
                </div>
              </div>
            )}
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setModalOpen(false)} disabled={saving}>Cancel</Button>
            <Button
              onClick={handleSave}
              disabled={saving}
              className="dash-cta"
            >
              {saving
                ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Saving...</>
                : editing ? 'Update Consultant' : 'Create Consultant'
              }
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <ConfirmDialog
        open={!!confirmDelete}
        onOpenChange={(open) => !open && setConfirmDelete(null)}
        title="Delete this consultant?"
        description={`"${confirmDelete?.user?.full_name || ''}" and their associated account will be permanently removed.`}
        confirmLabel="Delete"
        onConfirm={() => handleDelete(confirmDelete.id)}
        loading={deletingId === confirmDelete?.id}
      />
    </motion.div>
  );
}