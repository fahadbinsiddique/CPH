'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { AnimatePresence, motion } from 'framer-motion';
import { Calendar, Clock, CheckCircle2, XCircle, ArrowRight, Sparkles, UserCheck, Shield } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import PageHeader from '@/components/dashboard/ui/PageHeader';
import StatCard from '@/components/dashboard/ui/StatCard';
import AppointmentCard from '@/components/dashboard/ui/AppointmentCard';
import EmptyState from '@/components/dashboard/ui/EmptyState';
import LoadingState from '@/components/dashboard/ui/LoadingState';
import WellnessTip from '@/components/dashboard/ui/WellnessTip';
import useAuthStore from '@/store/authStore';
import { appointmentService } from '@/services/appointmentService';
import ConsultantDashboard from '@/components/dashboard/ConsultantDashboard';
import AdminDashboard from '@/components/dashboard/AdminDashboard';
import { containerVariants, itemVariants } from '@/lib/motion';

function UserDashboard({ appointments }) {
  const upcoming = appointments.filter((a) => ['pending', 'confirmed'].includes(a.status));
  const completed = appointments.filter((a) => a.status === 'completed');
  const cancelled = appointments.filter((a) => a.status === 'cancelled');

  const total = appointments.length || 1;
  const stats = [
    {
      icon: Calendar,
      label: 'Total Sessions',
      value: appointments.length,
      iconClassName: 'bg-teal-50 text-teal-700',
      description: 'All time',
      progress: 1,
    },
    {
      icon: Clock,
      label: 'Upcoming',
      value: upcoming.length,
      iconClassName: 'bg-amber-50 text-amber-700',
      description: 'Pending & confirmed',
      progress: total > 0 ? upcoming.length / total : 0,
    },
    {
      icon: CheckCircle2,
      label: 'Completed',
      value: completed.length,
      iconClassName: 'bg-emerald-50 text-emerald-700',
      description: 'Done',
      progress: total > 0 ? completed.length / total : 0,
    },
    {
      icon: XCircle,
      label: 'Cancelled',
      value: cancelled.length,
      iconClassName: 'bg-stone-50 text-stone-600',
      description: 'No show',
      progress: total > 0 ? cancelled.length / total : 0,
    },
  ];

  return (
    <motion.div variants={containerVariants} initial="hidden" animate="show" className="space-y-8">
      {/* Stats Grid */}
      <div className="grid grid-cols-2 gap-4 md:gap-5 lg:grid-cols-4">
        {stats.map((stat, idx) => (
          <StatCard key={idx} {...stat} />
        ))}
      </div>

      {/* Upcoming Consultations */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <h2 className="text-lg font-bold tracking-tight text-slate-900">Upcoming Consultations</h2>
            {upcoming.length > 0 && (
              <span className="flex items-center gap-1">
                <span className="relative flex h-2.5 w-2.5">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
                  <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-emerald-500" />
                </span>
                <span className="text-xs font-medium text-emerald-600">{upcoming.length} upcoming</span>
              </span>
            )}
          </div>
          <Link href="/dashboard/bookings">
            <Button
              variant="ghost"
              size="sm"
              className="group rounded-xl text-xs font-semibold text-teal-600 hover:bg-teal-50/80 hover:text-teal-700"
            >
              View All
              <ArrowRight className="ml-1 h-4 w-4 transition-transform group-hover:translate-x-0.5" />
            </Button>
          </Link>
        </div>

        {upcoming.length > 0 ? (
          <div className="space-y-3">
            <AnimatePresence mode="popLayout">
              {upcoming.slice(0, 4).map((a) => (
                <AppointmentCard
                  key={a.id}
                  appointment={a}
                  personKey="consultant"
                  actions={
                    a.status === 'confirmed' ? (
                      <Button
                        variant="outline"
                        size="sm"
                        className="rounded-xl border-teal-200 text-xs font-medium text-teal-700 hover:border-teal-300 hover:bg-teal-50"
                      >
                        <Sparkles className="mr-1.5 h-3 w-3" />
                        Join Session
                      </Button>
                    ) : null
                  }
                />
              ))}
            </AnimatePresence>
            {upcoming.length > 4 && (
              <motion.div variants={itemVariants} className="text-center">
                <Link href="/dashboard/bookings">
                  <Button
                    variant="outline"
                    className="rounded-xl border-slate-200 text-slate-600 hover:border-teal-300 hover:text-teal-700"
                  >
                    View {upcoming.length - 4} more appointments
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
              </motion.div>
            )}
          </div>
        ) : (
          <EmptyState
            icon={Calendar}
            title="No upcoming appointments"
            description="You do not have any therapeutic sessions scheduled right now. Take the first step toward wellness today."
            action={
              <Link href="/consultant">
                <Button className="dash-cta group">
                  <Sparkles className="h-4 w-4" />
                  Find a Consultant
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Button>
              </Link>
            }
          />
        )}
      </div>

      {/* Quick wellness tip */}
      <motion.div variants={itemVariants}>
        <WellnessTip
          title="Mental wellness tip"
          message="Take 5 minutes today to practice mindful breathing. Your mind will thank you."
        />
      </motion.div>
    </motion.div>
  );
}

export default function DashboardPage() {
  const { user } = useAuthStore();
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const role = user?.role || 'client';

  useEffect(() => {
    if (role === 'admin') {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setLoading(false);
      return;
    }

    appointmentService
      .getAll()
      .then((res) => setAppointments(res.data.results || res.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [role]);

  if (loading) return <LoadingState label="Loading your dashboard..." />;

  const firstName = user?.full_name?.split(' ')[0] || 'User';

  return (
    <div className="space-y-6">
      {/* Welcome Hero */}
      <PageHeader
        badge={`${role} Workspace`}
        badgeIcon={UserCheck}
        title={`Welcome back, ${firstName}!`}
        subtitle="Here is a summary of your account activity and upcoming sessions."
        actions={
          <Badge variant="outline" className="border-stone-200 text-stone-500">
            <Shield className="mr-1 h-3 w-3" />
            Secure
          </Badge>
        }
      />

      {/* Role-based dashboard */}
      {role === 'admin' ? (
        <AdminDashboard />
      ) : role === 'consultant' ? (
        <ConsultantDashboard appointments={appointments} />
      ) : (
        <UserDashboard appointments={appointments} />
      )}
    </div>
  );
}