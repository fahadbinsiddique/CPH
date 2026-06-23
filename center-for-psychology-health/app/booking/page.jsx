'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Calendar, Clock, Video, MapPin, Loader2, XCircle } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { appointmentService } from '@/services/appointmentService';
import AuthGuard from '@/components/shared/AuthGuard';

const STATUS_CONFIG = {
  pending:   { label: 'Pending',   color: 'bg-yellow-100 text-yellow-700' },
  confirmed: { label: 'Confirmed', color: 'bg-blue-100 text-blue-700' },
  completed: { label: 'Completed', color: 'bg-green-100 text-green-700' },
  cancelled: { label: 'Cancelled', color: 'bg-red-100 text-red-700' },
};

function AppointmentCard({ appointment, onCancel }) {
  const { id, consultant, appointment_date, appointment_time, session_type, status } = appointment;
  const config = STATUS_CONFIG[status];

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <Card className="border border-slate-100 shadow-sm rounded-2xl hover:shadow-md transition-shadow">
        <CardContent className="p-5">
          <div className="flex items-start justify-between gap-3">
            {/* Consultant info */}
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold text-lg flex-shrink-0">
                {consultant?.user?.full_name?.charAt(0)}
              </div>
              <div>
                <p className="font-semibold text-slate-800">{consultant?.user?.full_name}</p>
                <p className="text-xs text-slate-400">
                  {consultant?.specializations?.map(s => s.name).join(', ')}
                </p>
              </div>
            </div>

            {/* Status badge */}
            <span className={`text-xs font-medium px-2.5 py-1 rounded-full flex-shrink-0 ${config.color}`}>
              {config.label}
            </span>
          </div>

          {/* Details */}
          <div className="flex flex-wrap gap-4 mt-4 text-sm text-slate-500">
            <span className="flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5" />
              {appointment_date}
            </span>
            <span className="flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5" />
              {appointment_time}
            </span>
            <span className="flex items-center gap-1.5">
              {session_type === 'online'
                ? <Video className="w-3.5 h-3.5" />
                : <MapPin className="w-3.5 h-3.5" />
              }
              {session_type === 'online' ? 'Online' : 'In Person'}
            </span>
          </div>

          {/* Cancel button */}
          {status === 'pending' && (
            <Button
              variant="ghost"
              size="sm"
              className="mt-3 text-red-500 hover:text-red-600 hover:bg-red-50 px-2"
              onClick={() => onCancel(id)}
            >
              <XCircle className="w-4 h-4 mr-1" />
              Cancel করুন
            </Button>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
}

export default function BookingsPage() {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchAppointments = () => {
    appointmentService.getAll()
      .then(res => setAppointments(res.data.results || res.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchAppointments();
  }, []);

  const handleCancel = async (id) => {
    if (!confirm('এই appointment cancel করতে চান?')) return;
    try {
      await appointmentService.updateStatus(id, { status: 'cancelled' });
      fetchAppointments();
    } catch (err) {
      console.error(err);
    }
  };

  const filter = (status) =>
    appointments.filter(a => a.status === status);

  return (
    <section className='pt-32'>
    <AuthGuard>
      <div className="max-w-3xl mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold text-slate-800 mb-6">আমার Appointments</h1>

        {loading ? (
          <div className="flex justify-center py-16">
            <Loader2 className="w-7 h-7 animate-spin text-blue-600" />
          </div>
        ) : (
          <Tabs defaultValue="all">
            <TabsList className="mb-5">
              <TabsTrigger value="all">সব ({appointments.length})</TabsTrigger>
              <TabsTrigger value="pending">Pending ({filter('pending').length})</TabsTrigger>
              <TabsTrigger value="confirmed">Confirmed ({filter('confirmed').length})</TabsTrigger>
              <TabsTrigger value="completed">Completed ({filter('completed').length})</TabsTrigger>
            </TabsList>

            {['all', 'pending', 'confirmed', 'completed'].map(tab => (
              <TabsContent key={tab} value={tab}>
                <div className="space-y-3">
                  {(tab === 'all' ? appointments : filter(tab)).length > 0
                    ? (tab === 'all' ? appointments : filter(tab)).map(a => (
                        <AppointmentCard
                          key={a.id}
                          appointment={a}
                          onCancel={handleCancel}
                        />
                      ))
                    : (
                      <div className="text-center py-12 text-slate-400">
                        কোনো appointment নেই
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
    </section>
  );
}