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
import { containerVariants, itemVariants } from '@/lib/motion';
import { updateAppointmentStatus } from '@/app/(dashboard)/dashboard/actions/appointmentActions';
import { useReducedMotion } from '@/hooks/useReducedMotion';

export default function ConsultantDashboard({ 
  todayAppointments = [], 
  pendingAppointments = [], 
  completedAppointments = [],
  allAppointments = [] 
}) {
  const [localAppointments, setLocalAppointments] = useState(allAppointments);
  const [processingId, setProcessingId] = useState(null);
  const reduceMotion = useReducedMotion();

  const uniquePatients = new Set(allAppointments.map((a) => a.client?.id).filter(Boolean)).size;
  const totalSessions = allAppointments.length;

  const stats = [
    {
      icon: Calendar,
      label: "Today's Sessions",
      value: todayAppointments.length,
      iconClassName: 'bg-primary/10 text-primary',
      description: 'Scheduled',
    },
    {
      icon: Clock,
      label: 'Pending Requests',
      value: pendingAppointments.length,
      iconClassName: 'bg-secondary/50 text-foreground',
      description: 'Action needed',
    },
    {
      icon: CheckCircle2,
      label: 'Completed',
      value: completedAppointments.length,
      iconClassName: 'bg-accent/10 text-accent',
      description: 'Done',
    },
    {
      icon: Users,
      label: 'Total Patients',
      value: uniquePatients,
      iconClassName: 'bg-muted text-muted-foreground',
      description: 'Active',
    },
  ];

  const updateStatus = async (id, status) => {
    setProcessingId(id);
    try {
      const result = await updateAppointmentStatus(id, status);
      if (result.success) {
        setLocalAppointments((prev) => prev.map((a) => (a.id === id ? { ...a, status } : a)));
        toast.success(status === 'confirmed' ? 'Appointment confirmed' : 'Appointment declined');
      } else {
        toast.error(result.error || 'Something went wrong. Please try again.');
      }
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
            className="dash-cta min-h-11 cursor-pointer px-4 text-xs sm:min-h-9"
            disabled={processingId === appointment.id}
            onClick={() => updateStatus(appointment.id, 'confirmed')}
            aria-label={`Confirm appointment with ${appointment.client?.user?.full_name || 'patient'}`}
          >
            {processingId === appointment.id ? '...' : 'Confirm'}
          </Button>
          <Button
            size="sm"
            variant="outline"
            className="min-h-11 cursor-pointer border-destructive/30 px-4 text-xs font-medium text-destructive hover:bg-destructive/10 sm:min-h-9"
            disabled={processingId === appointment.id}
            onClick={() => updateStatus(appointment.id, 'cancelled')}
            aria-label={`Decline appointment with ${appointment.client?.user?.full_name || 'patient'}`}
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
          className="h-9 cursor-pointer rounded-lg border-primary/30 text-xs font-medium text-foreground hover:border-primary/50 hover:bg-primary/10"
          aria-label={`Join session with ${appointment.client?.user?.full_name || 'patient'}`}
        >
          <Video className="mr-1.5 h-3 w-3" aria-hidden="true" />
          Join Session
        </Button>
      );
    }
    return null;
  };

  const motionProps = reduceMotion ? {} : { variants: containerVariants, initial: "hidden", animate: "show" };
  const itemMotionProps = reduceMotion ? {} : { variants: itemVariants };

  return (
    <motion.div {...motionProps} className="space-y-6 sm:space-y-8" role="region" aria-label="Consultant dashboard">
      {/* Stats Grid */}
      <section aria-labelledby="consultant-stats-heading" className="space-y-4">
        <h2 id="consultant-stats-heading" className="sr-only">Consultant Statistics</h2>
        <div className="grid grid-cols-2 gap-3 sm:gap-4 md:gap-5 lg:grid-cols-4" role="list">
          {stats.map((stat, idx) => (
            <StatCard key={stat.label} {...stat} />
          ))}
        </div>
      </section>

      <div className="grid grid-cols-1 items-start gap-6 xl:grid-cols-3">
        {/* Today's Appointments */}
        <section aria-labelledby="today-heading" {...itemMotionProps} className="space-y-4 xl:col-span-2">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div className="min-w-0">
              <h2 id="today-heading" className="font-heading text-lg font-semibold tracking-tight text-foreground">Today&apos;s Schedule</h2>
              <p className="mt-0.5 text-sm text-muted-foreground">
                {todayAppointments.length > 0
                  ? `You have ${todayAppointments.length} session${todayAppointments.length > 1 ? 's' : ''} today`
                  : 'No sessions scheduled for today'}
              </p>
            </div>
            <Link href="/dashboard/appointments">
              <Button
                variant="ghost"
                size="sm"
                className="group min-h-10 cursor-pointer rounded-lg px-3 text-xs font-semibold text-foreground hover:bg-primary/10 hover:text-foreground sm:min-h-8"
                aria-label="View all appointments"
              >
                View All
                <ArrowRight className="ml-1 h-4 w-4 transition-transform group-hover:translate-x-0.5" aria-hidden="true" />
              </Button>
            </Link>
          </div>

          {todayAppointments.length > 0 ? (
            <div className="space-y-3" role="list" aria-label="Today's appointments">
              <AnimatePresence mode="popLayout">
                {todayAppointments.map((appointment) => (
                  <AppointmentCard 
                    key={appointment.id} 
                    appointment={appointment} 
                    personKey="client" 
                    actions={renderActions(appointment)} 
                  />
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
        </section>

        {/* Pending Action Center */}
        <section aria-labelledby="pending-heading" {...itemMotionProps} className="space-y-4">
          <div>
            <h2 id="pending-heading" className="font-heading flex items-center gap-2 text-lg font-semibold tracking-tight text-foreground">
              Pending Actions
              {pendingAppointments.length > 0 && (
                <Badge className="border-primary/20 bg-primary/10 text-foreground" aria-label={`${pendingAppointments.length} pending requests`}>
                  {pendingAppointments.length}
                </Badge>
              )}
            </h2>
            <p className="mt-0.5 text-sm text-muted-foreground">
              {pendingAppointments.length > 0
                ? `${pendingAppointments.length} request${pendingAppointments.length > 1 ? 's' : ''} waiting for response`
                : 'All caught up!'}
            </p>
          </div>

          {pendingAppointments.length > 0 ? (
            <div className="space-y-3 xl:cph-scroll xl:max-h-[600px] xl:overflow-y-auto xl:pr-1" role="list" aria-label="Pending appointments">
              <AnimatePresence mode="popLayout">
                {pendingAppointments.slice(0, 6).map((appointment) => (
                  <AppointmentCard key={appointment.id} appointment={appointment} personKey="client" actions={renderActions(appointment)} />
                ))}
              </AnimatePresence>
              {pendingAppointments.length > 6 && (
                <Link href="/dashboard/appointments?filter=pending">
                  <Button
                    variant="outline"
                    className="w-full cursor-pointer rounded-lg border-border text-muted-foreground hover:border-primary/40 hover:text-foreground"
                  >
                    View {pendingAppointments.length - 6} more pending requests
                    <ArrowRight className="ml-2 h-4 w-4" aria-hidden="true" />
                  </Button>
                </Link>
              )}
            </div>
          ) : (
            <motion.div {...itemMotionProps}>
              <EmptyState
                icon={CheckCircle2}
                title="No pending requests"
                description="All appointments are confirmed"
              />
            </motion.div>
          )}
        </section>
      </div>

      {/* Wellness Tip */}
      <motion.div {...itemMotionProps} className="mt-2">
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