'use client';

import { useEffect, useState } from 'react';
import { Plus, Pencil, Trash2, Loader2, Tag } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  Dialog, DialogContent, DialogHeader,
  DialogTitle, DialogFooter
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import AuthGuard from '@/components/shared/AuthGuard';
import { consultantService } from '@/services/consultantService';

export default function SpecializationsPage() {
  const [specializations, setSpecializations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [name, setName] = useState('');
  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState(null);
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
      } else {
        await consultantService.adminCreateSpecialization({ name });
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
    if (!confirm('Delete this specialization?')) return;
    setDeletingId(id);
    try {
      await consultantService.adminDeleteSpecialization(id);
      setSpecializations(prev => prev.filter(s => s.id !== id));
    } catch {
      console.error('Delete failed');
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <AuthGuard allowedRoles={['admin']}>
      <div className="max-w-2xl">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-slate-800">Specializations</h1>
            <p className="text-slate-400 text-sm">{specializations.length} total</p>
          </div>
          <Button onClick={openCreate} className="bg-blue-600 hover:bg-blue-700 text-white">
            <Plus className="w-4 h-4 mr-2" /> Add New
          </Button>
        </div>

        {loading ? (
          <div className="flex justify-center py-20">
            <Loader2 className="w-7 h-7 animate-spin text-blue-600" />
          </div>
        ) : specializations.length > 0 ? (
          <div className="space-y-2">
            {specializations.map(spec => (
              <Card key={spec.id} className="border border-slate-100 shadow-sm rounded-xl">
                <CardContent className="p-4 flex items-center gap-3">
                  <div className="w-9 h-9 rounded-lg bg-blue-50 flex items-center justify-center flex-shrink-0">
                    <Tag className="w-4 h-4 text-blue-600" />
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-slate-800">{spec.name}</p>
                  </div>
                  <Badge variant="secondary" className="text-xs">
                    {spec.blog_count ?? 0} used
                  </Badge>
                  <div className="flex gap-1.5">
                    <Button
                      size="sm" variant="ghost"
                      className="h-8 w-8 p-0 text-slate-400 hover:text-blue-600"
                      onClick={() => openEdit(spec)}
                    >
                      <Pencil className="w-4 h-4" />
                    </Button>
                    <Button
                      size="sm" variant="ghost"
                      className="h-8 w-8 p-0 text-slate-400 hover:text-red-500"
                      onClick={() => handleDelete(spec.id)}
                      disabled={deletingId === spec.id}
                    >
                      {deletingId === spec.id
                        ? <Loader2 className="w-4 h-4 animate-spin" />
                        : <Trash2 className="w-4 h-4" />
                      }
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="text-center py-16 text-slate-400 text-sm">
            No specializations yet
          </div>
        )}
      </div>

      <Dialog open={modalOpen} onOpenChange={setModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editing ? 'Edit Specialization' : 'New Specialization'}</DialogTitle>
          </DialogHeader>
          <div className="py-2">
            <Label className="mb-2 block text-slate-700">Name</Label>
            <Input
              placeholder="e.g. Anxiety Disorders"
              value={name}
              onChange={e => setName(e.target.value)}
              className="h-11"
            />
            {error && (
              <p className="text-sm text-red-500 bg-red-50 px-3 py-2 rounded-lg mt-3">{error}</p>
            )}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setModalOpen(false)}>Cancel</Button>
            <Button
              className="bg-blue-600 hover:bg-blue-700 text-white"
              onClick={handleSave}
              disabled={saving}
            >
              {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Save'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </AuthGuard>
  );
}