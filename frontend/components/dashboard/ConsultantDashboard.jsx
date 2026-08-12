'use client';

import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import Link from 'next/link';
import {
  Calendar,
  Clock,
  CheckCircle2,
  Users,
  ArrowRight,
  Video,
  Sparkles,
  Heart,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import StatCard from '@/components/dashboard/ui/StatCard';
import AppointmentCard from '@/components/dashboard/ui/AppointmentCard';
import EmptyState from '@/components/dashboard/ui/EmptyState';
import WellnessTip from '@/components/dashboard/ui/WellnessTip';
import { appointmentService } from '@/services/appointmentService';
import { containerVariants, itemVariants } from '@/lib/motion';

export default function ConsultantDashboard({ appointments = [] }) {
  const [localAppointments, setLocalAppointments] = useState(appointments);
  const [processingId, setProcessingId] = useState(null);

  const todayStr = new Date().toLocaleDateString('sv-SE');

  const todayAppts = localAppointments.filter((a) => a.appointment_date === todayStr);
  const pending = localAppointments.filter((a) => a.status === 'pending');
  const completed = localAppointments.filter((a) => a.status === 'completed');

  const uniquePatients = new Set(localAppointments.map((a) => a.client?.id).filter(Boolean)).size;
  const totalSessions = localAppointments.length;

  const stats = [
    {
      icon: Calendar,
      label: "Today's Sessions",
      value: todayAppts.length,
      iconClassName: 'bg-gradient-to-br from-blue-100 to-indigo-100 text-blue-600',
      gradient: 'from-blue-50/20 to-indigo-50/20',
      description: 'Scheduled',
    },
    {
      icon: Clock,
      label: 'Pending Requests',
      value: pending.length,
      iconClassName: 'bg-gradient-to-br from-amber-100 to-orange-100 text-amber-600',
      gradient: 'from-amber-50/20 to-orange-50/20',
      description: 'Action needed',
    },
    {
      icon: CheckCircle2,
      label: 'Completed',
      value: completed.length,
      iconClassName: 'bg-gradient-to-br from-emerald-100 to-teal-100 text-emerald-600',
      gradient: 'from-emerald-50/20 to-teal-50/20',
      description: 'Done',
    },
    {
      icon: Users,
      label: 'Total Patients',
      value: uniquePatients,
      iconClassName: 'bg-gradient-to-br from-purple-100 to-fuchsia-100 text-purple-600',
      gradient: 'from-purple-50/20 to-fuchsia-50/20',
      description: 'Active',
    },
  ];

  const updateStatus = async (id, status) => {
    setProcessingId(id);
    try {
      await appointmentService.updateStatus(id, { status });
      setLocalAppointments((prev) => prev.map((a) => (a.id === id ? { ...a, status } : a)));
      toast.success(status === 'confirmed' ? 'Appointment confirmed' : 'Appointment declined');
    } catch (error) {
      console.error(error);
      toast.error('Something went wrong. Please try again.');
    } finally {
      setProcessingId(null);
    }
  };

  const renderActions = (appointment) => {
    if (appointment.status === 'pending') {
      return (
        <>
          <Button
            size="sm"
            className="dash-cta h-8 px-4 text-xs"
            disabled={processingId === appointment.id}
            onClick={() => updateStatus(appointment.id, 'confirmed')}
          >
            {processingId === appointment.id ? '...' : 'Confirm'}
          </Button>
          <Button
            size="sm"
            variant="outline"
            className="h-8 border-rose-200 px-4 text-xs font-medium text-rose-600 hover:bg-rose-50"
            disabled={processingId === appointment.id}
            onClick={() => updateStatus(appointment.id, 'cancelled')}
          >
            Decline
          </Button>
        </>
      );
    }
    if (appointment.status === 'confirmed') {
      return (
        <Button
          size="sm"
          variant="outline"
          className="h-8 rounded-xl border-teal-200 text-xs font-medium text-teal-700 hover:bg-teal-50"
        >
          <Video className="mr-1.5 h-3 w-3" />
          Join Session
        </Button>
      );
    }
    return null;
  };

  return (
    <motion.div variants={containerVariants} initial="hidden" animate="show" className="space-y-8">
      {/* Stats Grid */}
      <div className="grid grid-cols-2 gap-4 md:gap-5 lg:grid-cols-4">
        {stats.map((stat, idx) => (
          <StatCard key={idx} {...stat} />
        ))}
      </div>

      <div className="grid grid-cols-1 items-start gap-8 xl:grid-cols-3">
        {/* Today's Appointments */}
        <motion.div variants={itemVariants} className="space-y-4 xl:col-span-2">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-bold tracking-tight text-slate-900">{`Today's Schedule`}</h2>
              <p className="mt-0.5 text-sm text-slate-500">
                {todayAppts.length > 0
                  ? `You have ${todayAppts.length} session${todayAppts.length > 1 ? 's' : ''} today`
                  : 'No sessions scheduled for today'}
              </p>
            </div>
            <Link href="/dashboard/appointments">
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

          {todayAppts.length > 0 ? (
            <div className="space-y-3">
              <AnimatePresence mode="popLayout">
                {todayAppts.map((a) => (
                  <AppointmentCard key={a.id} appointment={a} personKey="client" actions={renderActions(a)} />
                ))}
              </AnimatePresence>
            </div>
          ) : (
            <EmptyState
              icon={Calendar}
              title="No sessions today"
              description="Enjoy your free time or review pending requests for upcoming days."
            />
          )}
        </motion.div>

        {/* Pending Action Center */}
        <motion.div variants={itemVariants} className="space-y-4">
          <div>
            <h2 className="flex items-center gap-2 text-lg font-bold tracking-tight text-slate-900">
              Pending Actions
              {pending.length > 0 && (
                <Badge className="bg-amber-100 text-amber-700 border-amber-200">{pending.length}</Badge>
              )}
            </h2>
            <p className="mt-0.5 text-sm text-slate-500">
              {pending.length > 0
                ? `${pending.length} request${pending.length > 1 ? 's' : ''} waiting for response`
                : 'All caught up!'}
            </p>
          </div>

          {pending.length > 0 ? (
            <div className="cph-scroll max-h-[600px] space-y-3 overflow-y-auto pr-1">
              <AnimatePresence mode="popLayout">
                {pending.slice(0, 6).map((a) => (
                  <AppointmentCard key={a.id} appointment={a} personKey="client" actions={renderActions(a)} />
                ))}
              </AnimatePresence>
              {pending.length > 6 && (
                <Link href="/dashboard/appointments?filter=pending">
                  <Button
                    variant="outline"
                    className="w-full rounded-xl border-slate-200 text-slate-600 hover:border-teal-300 hover:text-teal-700"
                  >
                    View {pending.length - 6} more pending requests
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
              )}
            </div>
          ) : (
            <motion.div variants={itemVariants}>
              <EmptyState
                icon={CheckCircle2}
                title="No pending requests"
                description="All appointments are confirmed"
              />
            </motion.div>
          )}
        </motion.div>
      </div>

      {/* Wellness Tip */}
      <motion.div variants={itemVariants}>
        <WellnessTip
          icon={Heart}
          title="Consultant wellness tip"
          message="Take 5 minutes between sessions to breathe deeply and reset. Your energy affects your patients."
          badgeLabel="Self-care"
        />
      </motion.div>
    </motion.div>
  );
}