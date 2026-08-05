'use client';

import { useEffect, useState } from 'react';
import {
  Search, Loader2, CheckCircle2, XCircle, Shield,
  Plus, Pencil, Trash2, X
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
import AuthGuard from '@/components/shared/AuthGuard';
import { consultantService } from '@/services/consultantService';

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
      fetch();
    } finally {
      setUpdatingId(null);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete this consultant? This will also remove their account.')) return;
    setDeletingId(id);
    try {
      await consultantService.adminDelete(id);
      setConsultants(prev => prev.filter(c => c.id !== id));
    } catch {
      console.error('Delete failed');
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
      } else {
        await consultantService.adminCreate(fd);
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

  return (
    <AuthGuard allowedRoles={['admin']}>
      <div className="max-w-4xl">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-slate-800">Consultants</h1>
            <p className="text-slate-400 text-sm">
              {verified.length} verified · {unverified.length} pending
            </p>
          </div>
          <Button onClick={openCreate} className="bg-blue-600 hover:bg-blue-700 text-white">
            <Plus className="w-4 h-4 mr-2" /> Add Consultant
          </Button>
        </div>

        <div className="relative mb-5">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <Input
            placeholder="Search consultants..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="pl-9 h-10"
          />
        </div>

        {loading ? (
          <div className="flex justify-center py-20">
            <Loader2 className="w-7 h-7 animate-spin text-blue-600" />
          </div>
        ) : (
          <Tabs defaultValue="all">
            <TabsList className="mb-5">
              <TabsTrigger value="all">All ({filtered.length})</TabsTrigger>
              <TabsTrigger value="pending">Pending ({unverified.length})</TabsTrigger>
              <TabsTrigger value="verified">Verified ({verified.length})</TabsTrigger>
            </TabsList>

            {[
              { key: 'all', data: filtered },
              { key: 'pending', data: unverified },
              { key: 'verified', data: verified },
            ].map(({ key, data }) => (
              <TabsContent key={key} value={key}>
                <div className="space-y-3">
                  {data.length > 0 ? data.map(c => (
                    <Card key={c.id} className="border border-slate-100 shadow-sm rounded-2xl">
                      <CardContent className="p-4 flex items-center gap-4">
                        <div className="w-11 h-11 rounded-full bg-purple-100 flex items-center justify-center text-purple-600 font-bold flex-shrink-0 overflow-hidden">
                          {c.profile_image
                            ? <img src={c.profile_image} alt="" className="w-full h-full object-cover" />
                            : c.user?.full_name?.charAt(0)
                          }
                        </div>

                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <p className="font-medium text-slate-800">{c.user?.full_name}</p>
                            {c.is_verified && <CheckCircle2 className="w-4 h-4 text-blue-500" />}
                          </div>
                          <p className="text-xs text-slate-400">{c.user?.email}</p>
                          <div className="flex gap-2 mt-1.5 flex-wrap">
                            {c.specializations?.slice(0, 3).map(s => (
                              <Badge key={s.id} variant="secondary" className="text-xs">{s.name}</Badge>
                            ))}
                            <span className="text-xs text-slate-400">
                              {c.experience_years}y exp · ৳{c.consultation_fee}
                            </span>
                          </div>
                        </div>

                        <div className="flex items-center gap-1.5 flex-shrink-0">
                          {updatingId === c.id ? (
                            <Loader2 className="w-5 h-5 animate-spin text-blue-600" />
                          ) : c.is_verified ? (
                            <Button
                              size="sm" variant="outline"
                              className="text-red-500 border-red-200 hover:bg-red-50 text-xs h-8"
                              onClick={() => handleVerify(c.id, false)}
                            >
                              <XCircle className="w-3.5 h-3.5 mr-1" /> Revoke
                            </Button>
                          ) : (
                            <Button
                              size="sm"
                              className="bg-green-600 hover:bg-green-700 text-white text-xs h-8"
                              onClick={() => handleVerify(c.id, true)}
                            >
                              <Shield className="w-3.5 h-3.5 mr-1" /> Verify
                            </Button>
                          )}

                          <Button
                            size="sm" variant="ghost"
                            className="h-8 w-8 p-0 text-slate-400 hover:text-blue-600"
                            onClick={() => openEdit(c)}
                          >
                            <Pencil className="w-4 h-4" />
                          </Button>

                          <Button
                            size="sm" variant="ghost"
                            className="h-8 w-8 p-0 text-slate-400 hover:text-red-500"
                            onClick={() => handleDelete(c.id)}
                            disabled={deletingId === c.id}
                          >
                            {deletingId === c.id
                              ? <Loader2 className="w-4 h-4 animate-spin" />
                              : <Trash2 className="w-4 h-4" />
                            }
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  )) : (
                    <div className="text-center py-12 text-slate-400 text-sm">
                      No consultants found
                    </div>
                  )}
                </div>
              </TabsContent>
            ))}
          </Tabs>
        )}
      </div>

      {/* Create / Edit Modal */}
      <Dialog open={modalOpen} onOpenChange={setModalOpen}>
        <DialogContent className="max-w-xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editing ? 'Edit Consultant' : 'Add New Consultant'}</DialogTitle>
          </DialogHeader>

          <div className="space-y-4 py-2">
            {/* Account fields — only for create or show disabled for edit */}
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label className="text-slate-700">Full Name {!editing && '*'}</Label>
                <Input
                  value={form.full_name}
                  onChange={e => setForm(p => ({ ...p, full_name: e.target.value }))}
                  className="h-10"
                  disabled={!!editing}
                />
              </div>
              <div className="space-y-1.5">
                <Label className="text-slate-700">Email {!editing && '*'}</Label>
                <Input
                  type="email"
                  value={form.email}
                  onChange={e => setForm(p => ({ ...p, email: e.target.value }))}
                  className="h-10"
                  disabled={!!editing}
                />
              </div>
            </div>

            {!editing && (
              <div className="space-y-1.5">
                <Label className="text-slate-700">Password *</Label>
                <Input
                  type="password"
                  value={form.password}
                  onChange={e => setForm(p => ({ ...p, password: e.target.value }))}
                  className="h-10"
                  placeholder="Minimum 8 characters"
                />
              </div>
            )}

            {/* Bio */}
            <div className="space-y-1.5">
              <Label className="text-slate-700">Bio</Label>
              <Textarea
                rows={3}
                value={form.bio}
                onChange={e => setForm(p => ({ ...p, bio: e.target.value }))}
                className="resize-none"
              />
            </div>

            {/* Experience + Fee */}
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label className="text-slate-700">Experience (years)</Label>
                <Input
                  type="number"
                  value={form.experience_years}
                  onChange={e => setForm(p => ({ ...p, experience_years: e.target.value }))}
                  className="h-10"
                />
              </div>
              <div className="space-y-1.5">
                <Label className="text-slate-700">Consultation Fee (৳)</Label>
                <Input
                  type="number"
                  value={form.consultation_fee}
                  onChange={e => setForm(p => ({ ...p, consultation_fee: e.target.value }))}
                  className="h-10"
                />
              </div>
            </div>

            {/* Location + Languages */}
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label className="text-slate-700">Location</Label>
                <Input
                  value={form.location}
                  onChange={e => setForm(p => ({ ...p, location: e.target.value }))}
                  className="h-10"
                  placeholder="e.g. Dhaka"
                />
              </div>
              <div className="space-y-1.5">
                <Label className="text-slate-700">Languages</Label>
                <Input
                  value={form.languages}
                  onChange={e => setForm(p => ({ ...p, languages: e.target.value }))}
                  className="h-10"
                  placeholder="e.g. Bengali, English"
                />
              </div>
            </div>

            {/* Specializations */}
            <div className="space-y-1.5">
              <Label className="text-slate-700">Specializations</Label>
              <div className="flex flex-wrap gap-2 p-3 bg-slate-50 rounded-xl min-h-[44px]">
                {specializations.map(spec => (
                  <Badge
                    key={spec.id}
                    variant={form.specializations.includes(spec.id) ? 'default' : 'outline'}
                    className="cursor-pointer"
                    onClick={() => toggleSpec(spec.id)}
                  >
                    {spec.name}
                    {form.specializations.includes(spec.id) && (
                      <X className="w-3 h-3 ml-1" />
                    )}
                  </Badge>
                ))}
              </div>
            </div>

            {/* Profile image */}
            <div className="space-y-1.5">
              <Label className="text-slate-700">Profile Image</Label>
              <input
                type="file"
                accept="image/*"
                onChange={e => setForm(p => ({ ...p, profile_image: e.target.files[0] }))}
                className="w-full text-sm text-slate-500 file:mr-3 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-blue-50 file:text-blue-600 hover:file:bg-blue-100"
              />
            </div>

            {/* Availability toggle */}
            <div className="flex items-center gap-3">
              <input
                type="checkbox"
                id="is_available"
                checked={form.is_available}
                onChange={e => setForm(p => ({ ...p, is_available: e.target.checked }))}
                className="w-4 h-4 accent-blue-600"
              />
              <Label htmlFor="is_available" className="text-slate-700 cursor-pointer">
                Available for booking
              </Label>
            </div>

            {error && (
              <p className="text-sm text-red-500 bg-red-50 px-3 py-2 rounded-lg">{error}</p>
            )}
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setModalOpen(false)}>Cancel</Button>
            <Button
              onClick={handleSave}
              disabled={saving}
              className="bg-blue-600 hover:bg-blue-700 text-white"
            >
              {saving
                ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Saving...</>
                : editing ? 'Update Consultant' : 'Create Consultant'
              }
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </AuthGuard>
  );
}