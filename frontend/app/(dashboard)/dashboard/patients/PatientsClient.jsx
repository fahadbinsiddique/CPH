'use client';

import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Search, Calendar, Clock, Users } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import PageHeader from '@/components/dashboard/ui/PageHeader';
import LoadingState from '@/components/dashboard/ui/LoadingState';
import EmptyState from '@/components/dashboard/ui/EmptyState';
import AuthGuard from '@/components/shared/AuthGuard';
import { containerVariants, itemVariants } from '@/lib/motion';

function formatDate(value) {
  if (!value) return 'N/A';
  return new Date(value + 'T00:00:00').toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}

export default function PatientsClient({ initialAppointments }) {
  const [appointments] = useState(initialAppointments);
  const [search, setSearch] = useState('');

  const patients = useMemo(() => {
    const map = {};
    appointments.forEach((a) => {
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

  const filtered = patients.filter(
    (p) =>
      p.full_name?.toLowerCase().includes(search.toLowerCase()) ||
      p.email?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <AuthGuard allowedRoles={['consultant']}>
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="show"
        className="max-w-3xl space-y-6"
      >
        <PageHeader
          badge="My Patients"
          badgeIcon={Users}
          title="Patients"
          subtitle={`${patients.length} total patients`}
        />

        <motion.div variants={itemVariants} className="relative">
          <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <Input
            placeholder="Search by name or email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="h-11 rounded-xl border-slate-200 bg-white/50 pl-10 shadow-sm focus-visible:border-teal-500 focus-visible:ring-teal-500/20"
          />
        </motion.div>

        {filtered.length > 0 ? (
          <motion.div variants={itemVariants} className="space-y-3">
            {filtered.map((patient) => {
              const completed = patient.appointments.filter((a) => a.status === 'completed').length;
              const upcoming = patient.appointments.filter((a) =>
                ['pending', 'confirmed'].includes(a.status)
              ).length;

              return (
                <Card
                  key={patient.id}
                  className="group dash-card dash-card-hover relative overflow-hidden"
                >
                  <div className="dash-accent" />
                  <CardContent className="flex items-center gap-4 p-4">
                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-indigo-100 to-blue-100 text-base font-bold text-indigo-600 shadow-sm">
                      {patient.full_name?.charAt(0)}
                    </div>

                    <div className="min-w-0 flex-1">
                      <p className="truncate font-medium text-slate-800">{patient.full_name}</p>
                      <p className="text-xs text-slate-400">{patient.email}</p>

                      <div className="mt-2 flex flex-wrap gap-3">
                        <span className="flex items-center gap-1 text-xs text-slate-500">
                          <Calendar className="h-3 w-3 text-teal-500" />
                          {patient.appointments.length} sessions
                        </span>
                        <span className="flex items-center gap-1 text-xs text-slate-500">
                          <Clock className="h-3 w-3 text-teal-500" />
                          Last: {formatDate(patient.lastVisit)}
                        </span>
                      </div>
                    </div>

                    <div className="flex shrink-0 flex-wrap gap-2">
                      {completed > 0 && (
                        <Badge className="bg-emerald-50 text-xs text-emerald-700 border-emerald-200">
                          {completed} done
                        </Badge>
                      )}
                      {upcoming > 0 && (
                        <Badge className="bg-blue-50 text-xs text-blue-700 border-blue-200">
                          {upcoming} upcoming
                        </Badge>
                      )}
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </motion.div>
        ) : (
          <EmptyState
            icon={Users}
            title="No patients found"
            description={search ? `No results match "${search}"` : 'Your patients will appear here.'}
          />
        )}
      </motion.div>
    </AuthGuard>
  );
}
