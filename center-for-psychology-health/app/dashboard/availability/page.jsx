'use client';

import { useEffect, useState } from 'react';
import { Plus, Trash2, Loader2, Save } from 'lucide-react';
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
  '08:00', '08:30', '09:00', '09:30', '10:00', '10:30',
  '11:00', '11:30', '12:00', '13:00', '14:00', '14:30',
  '15:00', '15:30', '16:00', '16:30', '17:00', '17:30',
  '18:00', '18:30', '19:00', '19:30', '20:00',
];

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
    api.get('/api/consultants/availability/')
      .then(res => setAvailability(res.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchAvailability(); }, []);

  const handleAdd = async () => {
    setError('');
    setSuccess('');

    const alreadyExists = availability.find(a => a.day === form.day);
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
      setAvailability(prev => prev.filter(a => a.id !== id));
      setSuccess('Schedule removed.');
    } catch {
      setError('Failed to delete.');
    } finally {
      setDeletingId(null);
    }
  };

  const scheduledDays = availability.map(a => a.day);

  return (
    <AuthGuard allowedRoles={['consultant']}>
      <div className="max-w-2xl">
        <h1 className="text-2xl font-bold text-slate-800 mb-1">Availability</h1>
        <p className="text-slate-400 text-sm mb-6">Set your weekly schedule</p>

        {/* Current schedule */}
        <Card className="border-0 shadow-sm rounded-2xl mb-5">
          <CardContent className="p-6">
            <h2 className="text-sm font-semibold text-slate-700 mb-4">Current Schedule</h2>

            {loading ? (
              <div className="flex justify-center py-8">
                <Loader2 className="w-6 h-6 animate-spin text-blue-600" />
              </div>
            ) : availability.length > 0 ? (
              <div className="space-y-2">
                {DAYS.filter(d => scheduledDays.includes(d.value)).map(day => {
                  const slot = availability.find(a => a.day === day.value);
                  return (
                    <div
                      key={day.value}
                      className="flex items-center justify-between bg-slate-50 rounded-xl px-4 py-3"
                    >
                      <div className="flex items-center gap-3">
                        <Badge variant="secondary" className="text-xs capitalize w-24 justify-center">
                          {day.label}
                        </Badge>
                        <span className="text-sm text-slate-600">
                          {slot.start_time} — {slot.end_time}
                        </span>
                      </div>
                      <button
                        onClick={() => handleDelete(slot.id)}
                        disabled={deletingId === slot.id}
                        className="text-slate-300 hover:text-red-500 transition-colors"
                      >
                        {deletingId === slot.id
                          ? <Loader2 className="w-4 h-4 animate-spin" />
                          : <Trash2 className="w-4 h-4" />
                        }
                      </button>
                    </div>
                  );
                })}
              </div>
            ) : (
              <p className="text-slate-400 text-sm text-center py-6">
                No schedule set yet
              </p>
            )}
          </CardContent>
        </Card>

        {/* Add new */}
        <Card className="border-0 shadow-sm rounded-2xl">
          <CardContent className="p-6">
            <h2 className="text-sm font-semibold text-slate-700 mb-4">Add Schedule</h2>

            <div className="grid grid-cols-3 gap-3 mb-4">
              {/* Day */}
              <div>
                <label className="text-xs text-slate-500 mb-1 block">Day</label>
                <select
                  value={form.day}
                  onChange={e => setForm(p => ({ ...p, day: e.target.value }))}
                  className="w-full h-10 px-3 rounded-lg border border-slate-200 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  {DAYS.map(d => (
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

              {/* Start time */}
              <div>
                <label className="text-xs text-slate-500 mb-1 block">Start Time</label>
                <select
                  value={form.start_time}
                  onChange={e => setForm(p => ({ ...p, start_time: e.target.value }))}
                  className="w-full h-10 px-3 rounded-lg border border-slate-200 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  {TIME_OPTIONS.map(t => (
                    <option key={t} value={t}>{t}</option>
                  ))}
                </select>
              </div>

              {/* End time */}
              <div>
                <label className="text-xs text-slate-500 mb-1 block">End Time</label>
                <select
                  value={form.end_time}
                  onChange={e => setForm(p => ({ ...p, end_time: e.target.value }))}
                  className="w-full h-10 px-3 rounded-lg border border-slate-200 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  {TIME_OPTIONS.map(t => (
                    <option key={t} value={t}>{t}</option>
                  ))}
                </select>
              </div>
            </div>

            {error && (
              <p className="text-sm text-red-500 bg-red-50 px-3 py-2 rounded-lg mb-3">{error}</p>
            )}
            {success && (
              <p className="text-sm text-green-600 bg-green-50 px-3 py-2 rounded-lg mb-3">✅ {success}</p>
            )}

            <Button
              onClick={handleAdd}
              disabled={saving}
              className="bg-blue-600 hover:bg-blue-700 text-white"
            >
              {saving
                ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Adding...</>
                : <><Plus className="w-4 h-4 mr-2" /> Add Schedule</>
              }
            </Button>
          </CardContent>
        </Card>
      </div>
    </AuthGuard>
  );
}