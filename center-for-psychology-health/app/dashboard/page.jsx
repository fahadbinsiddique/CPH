'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Calendar,
  Clock,
  CheckCircle2,
  XCircle,
  ArrowRight,
  Loader2,
  Sparkles,
  UserCheck,
  Heart,
  TrendingUp,
  Users,
  Shield,
  ChevronRight,
} from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import useAuthStore from '@/store/authStore';
import { appointmentService } from '@/services/appointmentService';
import ConsultantDashboard from '@/components/dashboard/ConsultantDashboard';
import AdminDashboard from '@/components/dashboard/AdminDashboard';

const STATUS_CONFIG = {
  pending: {
    label: 'Pending Approval',
    color: 'bg-amber-50 text-amber-700 border-amber-200/60',
    icon: Clock,
  },
  confirmed: {
    label: 'Confirmed',
    color: 'bg-emerald-50 text-emerald-700 border-emerald-200/60',
    icon: CheckCircle2,
  },
  completed: {
    label: 'Completed',
    color: 'bg-blue-50 text-blue-700 border-blue-200/60',
    icon: CheckCircle2,
  },
  cancelled: {
    label: 'Cancelled',
    color: 'bg-slate-100 text-slate-600 border-slate-200',
    icon: XCircle,
  },
};

const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.06, delayChildren: 0.1 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20, scale: 0.97 },
  show: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { type: 'spring', stiffness: 300, damping: 24 },
  },
};

const statVariants = {
  hidden: { opacity: 0, y: 15, scale: 0.95 },
  show: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { type: 'spring', stiffness: 350, damping: 25 },
  },
};

function StatCard({ icon: Icon, label, value, colorClass, gradient, description }) {
  return (
    <motion.div variants={statVariants} whileHover={{ y: -6 }} className="h-full">
      <Card className="group border border-slate-200/60 bg-white/80 backdrop-blur-sm shadow-sm hover:shadow-xl hover:border-teal-500/20 rounded-2xl h-full transition-all duration-500 relative overflow-hidden">
        {/* Gradient overlay on hover */}
        <div
          className={`absolute inset-0 bg-gradient-to-br ${gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-700`}
        />
        <CardContent className="p-6 relative z-10">
          <div className="flex items-start justify-between">
            <div
              className={`w-14 h-14 rounded-2xl flex items-center justify-center ${colorClass} shadow-sm group-hover:scale-110 transition-transform duration-300`}
            >
              <Icon className="w-6 h-6" />
            </div>
            {description && (
              <Badge variant="outline" className="text-[10px] bg-white/50">
                {description}
              </Badge>
            )}
          </div>
          <div className="mt-4">
            <p className="text-3xl font-bold text-slate-900 tracking-tight">{value}</p>
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mt-0.5">
              {label}
            </p>
          </div>
          {/* Progress bar decoration */}
          <div className="mt-3 h-0.5 w-full bg-slate-100 rounded-full overflow-hidden">
            <div
              className={`h-full bg-gradient-to-r ${colorClass.split(' ')[1]} rounded-full transition-all duration-1000 group-hover:w-full w-1/3`}
            />
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}

function UpcomingAppointmentCard({ appointment }) {
  const config = STATUS_CONFIG[appointment.status] || STATUS_CONFIG.pending;
  const StatusIcon = config.icon;
  const date = new Date(appointment.appointment_date);

  return (
    <motion.div variants={itemVariants} layout>
      <Card className="group border border-slate-200/60 bg-white/80 backdrop-blur-sm shadow-sm hover:shadow-xl hover:border-teal-500/20 rounded-2xl transition-all duration-500 overflow-hidden">
        {/* Top accent line */}
        <div
          className={`h-0.5 bg-gradient-to-r ${config.color.split(' ')[1]} scale-x-0 group-hover:scale-x-100 transition-transform duration-700 origin-left`}
        />
        <CardContent className="p-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              {/* Avatar */}
              <div className="relative">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-teal-100 to-emerald-100 text-teal-700 flex items-center justify-center font-bold text-lg shadow-inner group-hover:scale-105 transition-transform duration-300">
                  {appointment.consultant?.user?.full_name?.charAt(0)}
                </div>
                <div
                  className={`absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 rounded-full border-2 border-white shadow-sm ${
                    appointment.status === 'confirmed'
                      ? 'bg-emerald-500'
                      : appointment.status === 'pending'
                      ? 'bg-amber-500'
                      : appointment.status === 'completed'
                      ? 'bg-blue-500'
                      : 'bg-slate-300'
                  }`}
                />
              </div>

              <div className="min-w-0">
                <h4 className="font-bold text-slate-800 text-sm group-hover:text-teal-600 transition-colors truncate">
                  {appointment.consultant?.user?.full_name}
                </h4>
                <div className="flex flex-wrap items-center gap-x-3 gap-y-0.5 text-xs text-slate-400 font-medium mt-0.5">
                  <span className="flex items-center gap-1 bg-slate-50/80 px-2 py-0.5 rounded-lg">
                    <Calendar className="w-3 h-3 text-teal-500" />
                    {date.toLocaleDateString('en-US', {
                      month: 'short',
                      day: 'numeric',
                      year: 'numeric',
                    })}
                  </span>
                  <span className="text-slate-200 hidden sm:inline">•</span>
                  <span className="flex items-center gap-1 bg-slate-50/80 px-2 py-0.5 rounded-lg">
                    <Clock className="w-3 h-3 text-teal-500" />
                    {appointment.appointment_time}
                  </span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2 self-start sm:self-center">
              <Badge
                className={`text-[10px] font-semibold px-2.5 py-1 rounded-xl border ${config.color} flex items-center gap-1.5`}
              >
                <StatusIcon className="w-3 h-3" />
                {config.label}
              </Badge>
            </div>
          </div>

          {/* Quick action for confirmed appointments */}
          {appointment.status === 'confirmed' && (
            <div className="mt-3 pt-3 border-t border-slate-100/80 flex justify-end">
              <Button
                variant="outline"
                size="sm"
                className="rounded-xl border-teal-200 text-teal-700 hover:bg-teal-50 hover:border-teal-300 font-medium text-xs"
              >
                <Sparkles className="w-3 h-3 mr-1.5" />
                Join Session
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
}

function UserDashboard({ appointments }) {
  const upcoming = appointments.filter((a) => ['pending', 'confirmed'].includes(a.status));
  const completed = appointments.filter((a) => a.status === 'completed');
  const cancelled = appointments.filter((a) => a.status === 'cancelled');

  const stats = [
    {
      icon: Calendar,
      label: 'Total Sessions',
      value: appointments.length,
      colorClass: 'bg-gradient-to-br from-indigo-100 to-blue-100 text-indigo-600',
      gradient: 'from-indigo-50/20 to-blue-50/20',
      description: 'All time',
    },
    {
      icon: Clock,
      label: 'Upcoming',
      value: upcoming.length,
      colorClass: 'bg-gradient-to-br from-amber-100 to-orange-100 text-amber-600',
      gradient: 'from-amber-50/20 to-orange-50/20',
      description: 'Pending & confirmed',
    },
    {
      icon: CheckCircle2,
      label: 'Completed',
      value: completed.length,
      colorClass: 'bg-gradient-to-br from-emerald-100 to-teal-100 text-emerald-600',
      gradient: 'from-emerald-50/20 to-teal-50/20',
      description: 'Done',
    },
    {
      icon: XCircle,
      label: 'Cancelled',
      value: cancelled.length,
      colorClass: 'bg-gradient-to-br from-rose-100 to-pink-100 text-rose-600',
      gradient: 'from-rose-50/20 to-pink-50/20',
      description: 'No show',
    },
  ];

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="show"
      className="space-y-8"
    >
      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-5">
        {stats.map((stat, idx) => (
          <StatCard key={idx} {...stat} />
        ))}
      </div>

      {/* Upcoming Consultations */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <h2 className="text-lg font-bold text-slate-900 tracking-tight">
              Upcoming Consultations
            </h2>
            {upcoming.length > 0 && (
              <div className="flex items-center gap-1">
                <span className="flex h-2.5 w-2.5 relative">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
                </span>
                <span className="text-xs font-medium text-emerald-600">
                  {upcoming.length} upcoming
                </span>
              </div>
            )}
          </div>
          <Link href="/dashboard/bookings" passHref>
            <Button
              variant="ghost"
              size="sm"
              className="text-teal-600 hover:text-teal-700 font-semibold text-xs rounded-xl hover:bg-teal-50/80 group"
            >
              View All
              <ChevronRight className="w-4 h-4 ml-1 group-hover:translate-x-0.5 transition-transform" />
            </Button>
          </Link>
        </div>

        {upcoming.length > 0 ? (
          <div className="space-y-3">
            <AnimatePresence mode="popLayout">
              {upcoming.slice(0, 4).map((a) => (
                <UpcomingAppointmentCard key={a.id} appointment={a} />
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
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </Link>
              </motion.div>
            )}
          </div>
        ) : (
          <motion.div variants={itemVariants}>
            <Card className="border border-dashed border-slate-200 bg-white/50 backdrop-blur-sm rounded-2xl shadow-inner">
              <CardContent className="p-12 text-center flex flex-col items-center max-w-sm mx-auto">
                <div className="w-20 h-20 rounded-full bg-gradient-to-br from-slate-100 to-slate-50 flex items-center justify-center text-slate-300 mb-5 border border-slate-200/60">
                  <Calendar className="w-10 h-10" />
                </div>
                <h3 className="font-bold text-slate-800 text-xl tracking-tight mb-1">
                  No upcoming appointments
                </h3>
                <p className="text-sm text-slate-400 max-w-xs mb-6">
                  You do not have any therapeutic sessions scheduled right now. Take the first step
                  toward wellness today.
                </p>
                <Link href="/consultant" passHref>
                  <Button className="bg-gradient-to-r from-teal-600 to-emerald-600 hover:from-teal-700 hover:to-emerald-700 text-white rounded-xl shadow-lg shadow-teal-600/20 transition-all group">
                    <Sparkles className="w-4 h-4 mr-2" />
                    Find a Consultant
                    <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </div>

      {/* Quick wellness tip */}
      <motion.div variants={itemVariants}>
        <div className="bg-gradient-to-r from-teal-50/80 to-emerald-50/80 backdrop-blur-sm rounded-2xl p-4 border border-teal-200/60 flex items-center gap-3">
          <div className="p-2 bg-white rounded-xl shadow-sm">
            <Heart className="w-5 h-5 text-teal-500" />
          </div>
          <div className="flex-1">
            <p className="text-sm font-semibold text-slate-700">Mental wellness tip</p>
            <p className="text-xs text-slate-500">
              Take 5 minutes today to practice mindful breathing. Your mind will thank you. 🌿
            </p>
          </div>
          <Badge className="bg-white/60 text-teal-600 border-teal-200 text-xs">Daily</Badge>
        </div>
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

  if (loading)
    return (
      <div className="flex flex-col items-center justify-center py-40 space-y-4">
        <div className="relative">
          <Loader2 className="w-12 h-12 animate-spin text-teal-600" />
          <div className="absolute inset-0 w-12 h-12 border-2 border-teal-100 rounded-full animate-ping opacity-20" />
        </div>
        <p className="text-sm font-medium text-slate-400 tracking-wide">
          Loading your dashboard...
        </p>
      </div>
    );

  const firstName = user?.full_name?.split(' ')[0] || 'User';

  return (
    <div className="space-y-6">
      {/* Welcome Hero */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative bg-gradient-to-br from-white/80 to-slate-50/80 backdrop-blur-sm border border-slate-200/60 rounded-2xl p-6 shadow-sm overflow-hidden"
      >
        {/* Decorative glow */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-teal-500/5 to-emerald-500/5 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-gradient-to-tr from-blue-500/5 to-indigo-500/5 rounded-full blur-3xl" />

        <div className="relative flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-0.5">
            <div className="flex items-center gap-2">
              <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900">
                Welcome back, {firstName}! 👋
              </h1>
            </div>
            <p className="text-sm text-slate-500 font-medium">
              Here is a summary of your account activity and upcoming sessions.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Badge className="bg-gradient-to-r from-teal-100 to-emerald-100 text-teal-700 border-teal-200/60 capitalize font-semibold px-3 py-1.5">
              <UserCheck className="w-3.5 h-3.5 mr-1.5" />
              {role} Workspace
            </Badge>
            <Badge variant="outline" className="border-slate-200 text-slate-500">
              <Shield className="w-3 h-3 mr-1" />
              Secure
            </Badge>
          </div>
        </div>
      </motion.div>

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