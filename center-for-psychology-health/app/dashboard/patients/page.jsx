'use client';

import { useEffect, useState, useMemo } from 'react';
import { Search, Loader2, Calendar, Clock } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import AuthGuard from '@/components/shared/AuthGuard';
import { appointmentService } from '@/services/appointmentService';

export default function PatientsPage() {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    appointmentService.getAll()
      .then(res => setAppointments(res.data.results || res.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  // Group by patient
  const patients = useMemo(() => {
    const map = {};
    appointments.forEach(a => {
      const id = a.client?.id;
      if (!id) return;
      if (!map[id]) {
        map[id] = {
          ...a.client,
          appointments: [],
          lastVisit: a.appointment_date,
        };
      }
      map[id].appointments.push(a);
      if (a.appointment_date > map[id].lastVisit) {
        map[id].lastVisit = a.appointment_date;
      }
    });
    return Object.values(map);
  }, [appointments]);

  const filtered = patients.filter(p =>
    p.full_name?.toLowerCase().includes(search.toLowerCase()) ||
    p.email?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <AuthGuard allowedRoles={['consultant']}>
      <div className="max-w-3xl">
        <h1 className="text-2xl font-bold text-slate-800 mb-1">Patients</h1>
        <p className="text-slate-400 text-sm mb-6">
          {patients.length} total patients
        </p>

        {/* Search */}
        <div className="relative mb-5">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <Input
            placeholder="Search by name or email..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="pl-9 h-10"
          />
        </div>

        {loading ? (
          <div className="flex justify-center py-20">
            <Loader2 className="w-7 h-7 animate-spin text-blue-600" />
          </div>
        ) : filtered.length > 0 ? (
          <div className="space-y-3">
            {filtered.map(patient => {
              const completed = patient.appointments.filter(a => a.status === 'completed').length;
              const upcoming = patient.appointments.filter(a =>
                ['pending', 'confirmed'].includes(a.status)
              ).length;

              return (
                <Card key={patient.id} className="border border-slate-100 shadow-sm rounded-2xl">
                  <CardContent className="p-4 flex items-center gap-4">
                    {/* Avatar */}
                    <div className="w-11 h-11 rounded-full bg-purple-100 flex items-center justify-center text-purple-600 font-bold flex-shrink-0">
                      {patient.full_name?.charAt(0)}
                    </div>

                    {/* Info */}
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-slate-800">{patient.full_name}</p>
                      <p className="text-xs text-slate-400">{patient.email}</p>

                      <div className="flex gap-3 mt-2">
                        <span className="flex items-center gap-1 text-xs text-slate-500">
                          <Calendar className="w-3 h-3" />
                          {patient.appointments.length} sessions
                        </span>
                        <span className="flex items-center gap-1 text-xs text-slate-500">
                          <Clock className="w-3 h-3" />
                          Last: {patient.lastVisit}
                        </span>
                      </div>
                    </div>

                    {/* Stats */}
                    <div className="flex gap-2 flex-shrink-0">
                      {completed > 0 && (
                        <Badge className="bg-green-100 text-green-700 text-xs">
                          {completed} done
                        </Badge>
                      )}
                      {upcoming > 0 && (
                        <Badge className="bg-blue-100 text-blue-700 text-xs">
                          {upcoming} upcoming
                        </Badge>
                      )}
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-16 text-slate-400 text-sm">
            No patients found
          </div>
        )}
      </div>
    </AuthGuard>
  );
}