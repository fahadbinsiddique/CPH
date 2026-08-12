'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import {
  Search, Loader2, CheckCircle2, XCircle, Shield,
  Plus, Pencil, Trash2, X, Users
} from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
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

const EMPTY_FORM = {
  full_name: '', email: '', password: '',
  bio: '', experience_years: 0, consultation_fee: 0,
  languages: '', location: '', specializations: [],
  is_available: true, profile_image: null,
};

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
  const [saving, setSaving] = useState(false);
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

  const handleSave = async () => {
    if (!editing && (!form.full_name || !form.email || !form.password)) {
      setError('Name, email and password are required for new consultants.');
      return;
    }

    setSaving(true);
    setError('');

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

      if (editing) {
        await consultantService.adminUpdate(editing.id, fd);
        toast.success('Consultant updated');
      } else {
        await consultantService.adminCreate(fd);
        toast.success('Consultant created');
      }

      setModalOpen(false);
      fetch();
    } catch (err) {
      setError(
        err.response?.data?.email?.[0] ||
        err.response?.data?.detail ||
        'Failed to save consultant.'
      );
    } finally {
      setSaving(false);
    }
  };

  const filtered = consultants.filter(c =>
    c.user?.full_name?.toLowerCase().includes(search.toLowerCase()) ||
    c.user?.email?.toLowerCase().includes(search.toLowerCase())
  );

  const verified = filtered.filter(c => c.is_verified);
  const unverified = filtered.filter(c => !c.is_verified);

  const inputCls = "h-10 rounded-xl border-slate-200 shadow-sm focus-visible:border-teal-500 focus-visible:ring-teal-500/20";

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
                            ? <img src={c.profile_image} alt="" className="h-full w-full object-cover" />
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
        <DialogContent className="max-h-[90vh] max-w-xl overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editing ? 'Edit Consultant' : 'Add New Consultant'}</DialogTitle>
          </DialogHeader>

          <div className="space-y-4 py-2">
            <div className="grid grid-cols-2 gap-3">
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

            <div className="grid grid-cols-2 gap-3">
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

            <div className="grid grid-cols-2 gap-3">
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
              <Label className="text-sm font-medium text-slate-700">Specializations</Label>
              <div className="flex min-h-[44px] flex-wrap gap-2 rounded-xl bg-slate-50 p-3">
                {specializations.map(spec => (
                  <Badge
                    key={spec.id}
                    variant={form.specializations.includes(spec.id) ? 'default' : 'outline'}
                    className="cursor-pointer"
                    onClick={() => toggleSpec(spec.id)}
                  >
                    {spec.name}
                    {form.specializations.includes(spec.id) && (
                      <X className="ml-1 h-3 w-3" />
                    )}
                  </Badge>
                ))}
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
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setModalOpen(false)}>Cancel</Button>
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