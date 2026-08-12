'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Plus, Pencil, Trash2, Tag } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  Dialog, DialogContent, DialogHeader,
  DialogTitle, DialogFooter
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import AuthGuard from '@/components/shared/AuthGuard';
import PageHeader from '@/components/dashboard/ui/PageHeader';
import LoadingState from '@/components/dashboard/ui/LoadingState';
import EmptyState from '@/components/dashboard/ui/EmptyState';
import ConfirmDialog from '@/components/dashboard/ui/ConfirmDialog';
import { consultantService } from '@/services/consultantService';
import { containerVariants, itemVariants } from '@/lib/motion';

export default function SpecializationsPage() {
  const [specializations, setSpecializations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [name, setName] = useState('');
  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState(null);
  const [confirmDelete, setConfirmDelete] = useState(null);
  const [error, setError] = useState('');

  const fetchData = () => {
    consultantService.adminGetSpecializations()
      .then(res => setSpecializations(res.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchData(); }, []);

  const openCreate = () => {
    setEditing(null);
    setName('');
    setError('');
    setModalOpen(true);
  };

  const openEdit = (spec) => {
    setEditing(spec);
    setName(spec.name);
    setError('');
    setModalOpen(true);
  };

  const handleSave = async () => {
    if (!name.trim()) {
      setError('Name is required.');
      return;
    }

    setSaving(true);
    setError('');
    try {
      if (editing) {
        await consultantService.adminUpdateSpecialization(editing.id, { name });
        toast.success('Specialization updated');
      } else {
        await consultantService.adminCreateSpecialization({ name });
        toast.success('Specialization created');
      }
      setModalOpen(false);
      fetchData();
    } catch (err) {
      setError(err.response?.data?.name?.[0] || 'Failed to save.');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    setDeletingId(id);
    try {
      await consultantService.adminDeleteSpecialization(id);
      setSpecializations(prev => prev.filter(s => s.id !== id));
      toast.success('Specialization deleted');
    } catch {
      toast.error('Failed to delete specialization');
    } finally {
      setDeletingId(null);
      setConfirmDelete(null);
    }
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="show"
      className="max-w-2xl space-y-6"
    >
      <PageHeader
        badge="Reference Data"
        badgeIcon={Tag}
        title="Specializations"
        subtitle="Manage the therapy focus areas consultants can list on their profiles."
        actions={
          <Button onClick={openCreate} className="dash-cta">
            <Plus className="h-4 w-4" /> Add New
          </Button>
        }
      />

      {loading ? (
        <LoadingState label="Loading specializations..." />
      ) : specializations.length > 0 ? (
        <div className="space-y-3">
          {specializations.map((spec) => (
            <motion.div key={spec.id} variants={itemVariants}>
              <Card className="group dash-card dash-card-hover relative overflow-hidden">
                <div className="dash-accent" />
                <CardContent className="flex items-center gap-3 p-4">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-teal-100 to-emerald-100 text-teal-600">
                    <Tag className="h-4 w-4" />
                  </div>
                  <div className="flex-1">
                    <p className="font-bold text-slate-800">{spec.name}</p>
                  </div>
                  <Badge variant="secondary" className="rounded-full bg-slate-100 px-2.5 text-xs text-slate-600">
                    {spec.blog_count ?? 0} used
                  </Badge>
                  <div className="flex gap-1.5">
                    <Button
                      size="sm" variant="ghost"
                      className="h-8 w-8 p-0 text-slate-400 hover:bg-teal-50 hover:text-teal-600"
                      onClick={() => openEdit(spec)}
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button
                      size="sm" variant="ghost"
                      className="h-8 w-8 p-0 text-slate-400 hover:bg-rose-50 hover:text-rose-500"
                      onClick={() => setConfirmDelete(spec)}
                    >
                      {deletingId === spec.id
                        ? <Trash2 className="h-4 w-4 animate-pulse text-rose-500" />
                        : <Trash2 className="h-4 w-4" />
                      }
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      ) : (
        <EmptyState
          icon={Tag}
          title="No specializations yet"
          description="Create your first specialization to give consultants a set of focus areas to choose from."
          action={
            <Button onClick={openCreate} className="dash-cta">
              <Plus className="h-4 w-4" /> Create Specialization
            </Button>
          }
        />
      )}

      <Dialog open={modalOpen} onOpenChange={setModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editing ? 'Edit Specialization' : 'New Specialization'}</DialogTitle>
          </DialogHeader>
          <div className="py-2">
            <Label className="mb-2 block text-sm font-medium text-slate-700">Name</Label>
            <Input
              placeholder="e.g. Anxiety Disorders"
              value={name}
              onChange={e => setName(e.target.value)}
              className="h-11 rounded-xl border-slate-200 shadow-sm focus-visible:border-teal-500 focus-visible:ring-teal-500/20"
            />
            {error && (
              <p className="mt-3 rounded-lg bg-rose-50 px-3 py-2 text-sm text-rose-600">{error}</p>
            )}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setModalOpen(false)}>Cancel</Button>
            <Button className="dash-cta" onClick={handleSave} disabled={saving}>
              {saving ? 'Saving...' : 'Save'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <ConfirmDialog
        open={!!confirmDelete}
        onOpenChange={(open) => !open && setConfirmDelete(null)}
        title="Delete this specialization?"
        description={`"${confirmDelete?.name || ''}" will be removed. Consultants currently using it will keep their data.`}
        confirmLabel="Delete"
        onConfirm={() => handleDelete(confirmDelete.id)}
        loading={deletingId === confirmDelete?.id}
      />
    </motion.div>
  );
}