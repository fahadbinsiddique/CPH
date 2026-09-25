'use client';

import { AnimatePresence, motion } from 'framer-motion';
import Link from 'next/link';
import { Calendar, Clock, CheckCircle2, XCircle, ArrowRight, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import StatCard from '@/components/dashboard/ui/StatCard';
import AppointmentCard from '@/components/dashboard/ui/AppointmentCard';
import EmptyState from '@/components/dashboard/ui/EmptyState';
import WellnessTip from '@/components/dashboard/ui/WellnessTip';
import { containerVariants, itemVariants, statVariants } from '@/lib/motion';
import { useReducedMotion } from '@/hooks/useReducedMotion';

export default function UserDashboard({ 
  upcomingAppointments = [], 
  completedAppointments = [], 
  cancelledAppointments = [],
  allAppointments = [] 
}) {
  const reduceMotion = useReducedMotion();
  
  const total = allAppointments.length || 1;
  const stats = [
    {
      icon: Calendar,
      label: 'Total Sessions',
      value: allAppointments.length,
      iconClassName: 'bg-teal-50 text-teal-700',
      description: 'All time',
      progress: 1,
    },
    {
      icon: Clock,
      label: 'Upcoming',
      value: upcomingAppointments.length,
      iconClassName: 'bg-amber-50 text-amber-700',
      description: 'Pending & confirmed',
      progress: total > 0 ? upcomingAppointments.length / total : 0,
    },
    {
      icon: CheckCircle2,
      label: 'Completed',
      value: completedAppointments.length,
      iconClassName: 'bg-emerald-50 text-emerald-700',
      description: 'Done',
      progress: total > 0 ? completedAppointments.length / total : 0,
    },
    {
      icon: XCircle,
      label: 'Cancelled',
      value: cancelledAppointments.length,
      iconClassName: 'bg-stone-50 text-stone-600',
      description: 'No show',
      progress: total > 0 ? cancelledAppointments.length / total : 0,
    },
  ];

  const motionProps = reduceMotion ? {} : { variants: containerVariants, initial: "hidden", animate: "show" };
  const itemMotionProps = reduceMotion ? {} : { variants: itemVariants };

  return (
    <motion.div {...motionProps} className="space-y-8" role="region" aria-label="User dashboard">
      {/* Stats Grid */}
      <section aria-labelledby="stats-heading" className="space-y-4">
        <h2 id="stats-heading" className="sr-only">Session Statistics</h2>
        <div className="grid grid-cols-2 gap-4 md:gap-5 lg:grid-cols-4" role="list">
          {stats.map((stat, idx) => (
            <StatCard key={stat.label} {...stat} />
          ))}
        </div>
      </section>

      {/* Upcoming Consultations */}
      <section aria-labelledby="upcoming-heading" className="space-y-4" {...itemMotionProps}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <h2 id="upcoming-heading" className="text-lg font-bold tracking-tight text-slate-900">Upcoming Consultations</h2>
            {upcomingAppointments.length > 0 && (
              <span className="flex items-center gap-1" aria-live="polite" aria-atomic="true">
                <span className="relative flex h-2.5 w-2.5" aria-hidden="true">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
                  <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-emerald-500" />
                </span>
                <span className="text-xs font-medium text-emerald-600">{upcomingAppointments.length} upcoming</span>
              </span>
            )}
          </div>
          <Link href="/dashboard/bookings">
            <Button
              variant="ghost"
              size="sm"
              className="group rounded-xl text-xs font-semibold text-teal-600 hover:bg-teal-50/80 hover:text-teal-700"
              aria-label="View all appointments"
            >
              View All
              <ArrowRight className="ml-1 h-4 w-4 transition-transform group-hover:translate-x-0.5" aria-hidden="true" />
            </Button>
          </Link>
        </div>

        {upcomingAppointments.length > 0 ? (
          <div className="space-y-3" role="list" aria-label="Upcoming appointments">
            <AnimatePresence mode="popLayout">
              {upcomingAppointments.slice(0, 4).map((appointment) => (
                <AppointmentCard
                  key={appointment.id}
                  appointment={appointment}
                  personKey="consultant"
                  actions={
                    appointment.status === 'confirmed' ? (
                      <Button
                        variant="outline"
                        size="sm"
                        className="rounded-xl border-teal-200 text-xs font-medium text-teal-700 hover:border-teal-300 hover:bg-teal-50"
                        aria-label={`Join session with ${appointment.consultant?.user?.full_name || 'consultant'}`}
                      >
                        <Sparkles className="mr-1.5 h-3 w-3" aria-hidden="true" />
                        Join Session
                      </Button>
                    ) : null
                  }
                />
              ))}
            </AnimatePresence>
            {upcomingAppointments.length > 4 && (
              <motion.div {...itemMotionProps} className="text-center">
                <Link href="/dashboard/bookings">
                  <Button
                    variant="outline"
                    className="rounded-xl border-slate-200 text-slate-600 hover:border-teal-300 hover:text-teal-700"
                  >
                    View {upcomingAppointments.length - 4} more appointments
                    <ArrowRight className="ml-2 h-4 w-4" aria-hidden="true" />
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
                <Button className="dash-cta group" aria-label="Find a consultant">
                  <Sparkles className="h-4 w-4" aria-hidden="true" />
                  Find a Consultant
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" aria-hidden="true" />
                </Button>
              </Link>
            }
          />
        )}
      </section>

      {/* Quick wellness tip */}
      <motion.div {...itemMotionProps} className="mt-2">
        <WellnessTip
          title="Mental wellness tip"
          message="Take 5 minutes today to practice mindful breathing. Your mind will thank you."
        />
      </motion.div>
    </motion.div>
  );
}