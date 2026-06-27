'use client';

import { useEffect, useState } from 'react';
import {
  Calendar, Clock, Video, MapPin,
  Loader2, CheckCircle2, XCircle, MessageSquare
} from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Dialog, DialogContent, DialogHeader,
  DialogTitle, DialogFooter
} from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { appointmentService } from '@/services/appointmentService';
import AuthGuard from '@/components/shared/AuthGuard';
import useAuthStore from '@/store/authStore';

const STATUS_CONFIG = {
  pending:   { label: 'Pending',   color: 'bg-yellow-100 text-yellow-700' },
  confirmed: { label: 'Confirmed', color: 'bg-blue-100 text-blue-700' },
  completed: { label: 'Completed', color: 'bg-green-100 text-green-700' },
  cancelled: { label: 'Cancelled', color: 'bg-red-100 text-red-700' },
};

function AppointmentRow({ appointment, onStatusUpdate, isConsultant }) {
  const {
    id, client, consultant, appointment_date,
    appointment_time, session_type, status, client_message,
  } = appointment;

  const config = STATUS_CONFIG[status];
  const person = isConsultant ? client : consultant?.user;
  const [noteOpen, setNoteOpen] = useState(false);
  const [note, setNote] = useState('');
  const [saving, setSaving] = useState(false);

  const handleNote = async () => {
    setSaving(true);
    try {
      await appointmentService.updateStatus(id, { notes: note });
      setNoteOpen(false);
      setNote('');
    } finally {
      setSaving(false);
    }
  };

  return (
    <>
      <Card className="border border-slate-100 shadow-sm rounded-2xl">
        <CardContent className="p-4">
          <div className="flex items-start gap-4">
            {/* Avatar */}
            <div className="w-11 h-11 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold flex-shrink-0">
              {person?.full_name?.charAt(0)}
            </div>

            {/* Info */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between gap-2 flex-wrap">
                <p className="font-medium text-slate-800">{person?.full_name}</p>
                <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${config.color}`}>
                  {config.label}
                </span>
              </div>

              <div className="flex flex-wrap gap-3 mt-1.5 text-xs text-slate-400">
                <span className="flex items-center gap-1">
                  <Calendar className="w-3 h-3" /> {appointment_date}
                </span>
                <span className="flex items-center gap-1">
                  <Clock className="w-3 h-3" /> {appointment_time}
                </span>
                <span className="flex items-center gap-1">
                  {session_type === 'online'
                    ? <Video className="w-3 h-3" />
                    : <MapPin className="w-3 h-3" />
                  }
                  {session_type === 'online' ? 'Online' : 'In Person'}
                </span>
              </div>

              {client_message && (
                <p className="text-xs text-slate-500 mt-2 bg-slate-50 rounded-lg px-3 py-2 italic">
                  {client_message}
                </p>
              )}
            </div>
          </div>

          {/* Actions — consultant only */}
          {isConsultant && (
            <div className="flex gap-2 mt-3 flex-wrap">
              {status === 'pending' && (
                <>
                  <Button
                    size="sm"
                    className="bg-green-600 hover:bg-green-700 text-white text-xs h-8"
                    onClick={() => onStatusUpdate(id, 'confirmed')}
                  >
                    <CheckCircle2 className="w-3.5 h-3.5 mr-1" /> Confirm
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    className="text-red-500 border-red-200 hover:bg-red-50 text-xs h-8"
                    onClick={() => onStatusUpdate(id, 'cancelled')}
                  >
                    <XCircle className="w-3.5 h-3.5 mr-1" /> Cancel
                  </Button>
                </>
              )}
              {status === 'confirmed' && (
                <>
                  <Button
                    size="sm"
                    className="bg-blue-600 hover:bg-blue-700 text-white text-xs h-8"
                    onClick={() => onStatusUpdate(id, 'completed')}
                  >
                    <CheckCircle2 className="w-3.5 h-3.5 mr-1" /> Mark Completed
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    className="text-slate-500 text-xs h-8"
                    onClick={() => setNoteOpen(true)}
                  >
                    <MessageSquare className="w-3.5 h-3.5 mr-1" /> Add Note
                  </Button>
                </>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Note dialog */}
      <Dialog open={noteOpen} onOpenChange={setNoteOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Session Note</DialogTitle>
          </DialogHeader>
          <div className="py-2">
            <Label className="mb-2 block text-slate-700">Note for {person?.full_name}</Label>
            <Textarea
              rows={4}
              placeholder="Write session notes..."
              value={note}
              onChange={e => setNote(e.target.value)}
              className="resize-none"
            />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setNoteOpen(false)}>Cancel</Button>
            <Button
              className="bg-blue-600 hover:bg-blue-700 text-white"
              onClick={handleNote}
              disabled={saving || !note.trim()}
            >
              {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Save Note'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}

export default function AppointmentsPage() {
  const { user } = useAuthStore();
  const isConsultant = user?.role === 'consultant';
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetch = () => {
    appointmentService.getAll()
      .then(res => setAppointments(res.data.results || res.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetch(); }, []);

  const handleStatusUpdate = async (id, status) => {
    try {
      await appointmentService.updateStatus(id, { status });
      fetch();
    } catch (err) {
      console.error(err);
    }
  };

  const filter = (s) => appointments.filter(a => a.status === s);

  return (
    <AuthGuard allowedRoles={['consultant', 'admin']}>
      <div className="max-w-3xl">
        <h1 className="text-2xl font-bold text-slate-800 mb-1">Appointments</h1>
        <p className="text-slate-400 text-sm mb-6">Manage all appointments</p>

        {loading ? (
          <div className="flex justify-center py-20">
            <Loader2 className="w-7 h-7 animate-spin text-blue-600" />
          </div>
        ) : (
          <Tabs defaultValue="all">
            <TabsList className="mb-5">
              <TabsTrigger value="all">All ({appointments.length})</TabsTrigger>
              <TabsTrigger value="pending">Pending ({filter('pending').length})</TabsTrigger>
              <TabsTrigger value="confirmed">Confirmed ({filter('confirmed').length})</TabsTrigger>
              <TabsTrigger value="completed">Completed ({filter('completed').length})</TabsTrigger>
              <TabsTrigger value="cancelled">Cancelled ({filter('cancelled').length})</TabsTrigger>
            </TabsList>

            {['all', 'pending', 'confirmed', 'completed', 'cancelled'].map(tab => (
              <TabsContent key={tab} value={tab}>
                <div className="space-y-3">
                  {(tab === 'all' ? appointments : filter(tab)).length > 0
                    ? (tab === 'all' ? appointments : filter(tab)).map(a => (
                        <AppointmentRow
                          key={a.id}
                          appointment={a}
                          onStatusUpdate={handleStatusUpdate}
                          isConsultant={isConsultant}
                        />
                      ))
                    : (
                      <div className="text-center py-12 text-slate-400 text-sm">
                        No appointments found
                      </div>
                    )
                  }
                </div>
              </TabsContent>
            ))}
          </Tabs>
        )}
      </div>
    </AuthGuard>
  );
}