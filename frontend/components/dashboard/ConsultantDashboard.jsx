'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Calendar,
  Users,
  Clock,
  CheckCircle2,
  ArrowRight,
  ArrowUpRight,
  Video,
  MapPin,
  Sparkles,
  Heart,
  Shield,
  ChevronRight,
  AlertCircle,
  Star,
} from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import Link from 'next/link';

const STATUS_CONFIG = {
  pending: {
    label: 'Pending',
    color: 'bg-amber-50 text-amber-700 border-amber-200/60',
    icon: Clock,
    gradient: 'from-amber-50/50 to-amber-100/30',
  },
  confirmed: {
    label: 'Confirmed',
    color: 'bg-emerald-50 text-emerald-700 border-emerald-200/60',
    icon: CheckCircle2,
    gradient: 'from-emerald-50/50 to-emerald-100/30',
  },
  completed: {
    label: 'Completed',
    color: 'bg-blue-50 text-blue-700 border-blue-200/60',
    icon: CheckCircle2,
    gradient: 'from-blue-50/50 to-blue-100/30',
  },
  cancelled: {
    label: 'Cancelled',
    color: 'bg-slate-100 text-slate-600 border-slate-200',
    icon: AlertCircle,
    gradient: 'from-slate-50/50 to-slate-100/30',
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

function StatCard({ icon: Icon, label, value, gradient, iconColor, description }) {
  return (
    <motion.div variants={statVariants} whileHover={{ y: -6 }} className="h-full">
      <Card className="group border border-slate-200/60 bg-white/80 backdrop-blur-sm shadow-sm hover:shadow-xl hover:border-teal-500/20 rounded-2xl h-full transition-all duration-500 relative overflow-hidden">
        <div className={`absolute inset-0 bg-gradient-to-br ${gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-700`} />
        <CardContent className="p-6 relative z-10">
          <div className="flex items-start justify-between">
            <div
              className={`w-14 h-14 rounded-2xl flex items-center justify-center bg-gradient-to-br ${gradient} ${iconColor} shadow-sm group-hover:scale-110 transition-transform duration-300`}
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
          <div className="mt-3 h-0.5 w-full bg-slate-100 rounded-full overflow-hidden">
            <div
              className={`h-full bg-gradient-to-r ${iconColor} rounded-full transition-all duration-1000 group-hover:w-full w-1/3`}
            />
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}

function AppointmentCard({ appointment, onConfirm, onDecline }) {
  const [isProcessing, setIsProcessing] = useState(false);
  const config = STATUS_CONFIG[appointment.status] || STATUS_CONFIG.pending;
  const StatusIcon = config.icon;
  const date = new Date(appointment.appointment_date);

  const handleConfirm = async () => {
    setIsProcessing(true);
    await onConfirm(appointment.id);
    setIsProcessing(false);
  };

  const handleDecline = async () => {
    setIsProcessing(true);
    await onDecline(appointment.id);
    setIsProcessing(false);
  };

  return (
    <motion.div variants={itemVariants} layout>
      <Card className="group border border-slate-200/60 bg-white/80 backdrop-blur-sm shadow-sm hover:shadow-xl hover:border-teal-500/20 rounded-2xl transition-all duration-500 overflow-hidden">
        <div
          className={`h-0.5 bg-gradient-to-r ${config.gradient} scale-x-0 group-hover:scale-x-100 transition-transform duration-700 origin-left`}
        />
        <CardContent className="p-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="relative">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-teal-100 to-emerald-100 text-teal-700 flex items-center justify-center font-bold text-lg shadow-inner group-hover:scale-105 transition-transform duration-300">
                  {appointment.client?.full_name?.charAt(0) || 'P'}
                </div>
                <div className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 rounded-full border-2 border-white shadow-sm bg-emerald-500" />
              </div>

              <div className="min-w-0">
                <h4 className="font-bold text-slate-800 text-sm group-hover:text-teal-600 transition-colors truncate">
                  {appointment.client?.full_name || 'Unknown Patient'}
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

          <div className="mt-3 pt-3 border-t border-slate-100/80 flex items-center justify-between">
            <div className="flex items-center gap-3 text-xs text-slate-500">
              <span className="flex items-center gap-1">
                {appointment.session_type === 'online' ? (
                  <Video className="w-3.5 h-3.5 text-blue-500" />
                ) : (
                  <MapPin className="w-3.5 h-3.5 text-purple-500" />
                )}
                {appointment.session_type === 'online' ? 'Video Session' : 'In-Person'}
              </span>
              <span className="text-slate-200">|</span>
              <span className="flex items-center gap-1">
                <Shield className="w-3 h-3 text-teal-400" />
                Secure
              </span>
            </div>

            {appointment.status === 'pending' && (
              <div className="flex gap-2">
                <Button
                  size="sm"
                  className="bg-gradient-to-r from-teal-600 to-emerald-600 hover:from-teal-700 hover:to-emerald-700 text-white rounded-xl h-8 px-4 text-xs font-medium shadow-sm"
                  onClick={handleConfirm}
                  disabled={isProcessing}
                >
                  {isProcessing ? '...' : 'Confirm'}
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  className="text-rose-600 border-rose-200 hover:bg-rose-50 rounded-xl h-8 px-4 text-xs font-medium"
                  onClick={handleDecline}
                  disabled={isProcessing}
                >
                  Decline
                </Button>
              </div>
            )}

            {appointment.status === 'confirmed' && (
              <Button
                size="sm"
                variant="outline"
                className="rounded-xl border-teal-200 text-teal-700 hover:bg-teal-50 text-xs font-medium h-8"
              >
                <Video className="w-3 h-3 mr-1.5" />
                Join Session
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}

export default function ConsultantDashboard({ appointments = [] }) {
  const [localAppointments, setLocalAppointments] = useState(appointments);

  const todayStr = new Date().toLocaleDateString('sv-SE');

  const todayAppts = localAppointments.filter((a) => a.appointment_date === todayStr);
  const pending = localAppointments.filter((a) => a.status === 'pending');
  const completed = localAppointments.filter((a) => a.status === 'completed');
  const confirmed = localAppointments.filter((a) => a.status === 'confirmed');

  const uniquePatients = new Set(localAppointments.map((a) => a.client?.id).filter(Boolean)).size;
  const totalSessions = localAppointments.length;

  const stats = [
    {
      icon: Calendar,
      label: "Today's Sessions",
      value: todayAppts.length,
      gradient: 'from-blue-50/20 to-indigo-50/20',
      iconColor: 'text-blue-600',
      description: 'Scheduled',
    },
    {
      icon: Clock,
      label: 'Pending Requests',
      value: pending.length,
      gradient: 'from-amber-50/20 to-orange-50/20',
      iconColor: 'text-amber-600',
      description: 'Action needed',
    },
    {
      icon: CheckCircle2,
      label: 'Completed',
      value: completed.length,
      gradient: 'from-emerald-50/20 to-teal-50/20',
      iconColor: 'text-emerald-600',
      description: 'Done',
    },
    {
      icon: Users,
      label: 'Total Patients',
      value: uniquePatients,
      gradient: 'from-purple-50/20 to-fuchsia-50/20',
      iconColor: 'text-purple-600',
      description: 'Active',
    },
  ];

  const handleConfirm = async (id) => {
    // Simulate API call
    setLocalAppointments((prev) =>
      prev.map((a) => (a.id === id ? { ...a, status: 'confirmed' } : a))
    );
  };

  const handleDecline = async (id) => {
    // Simulate API call
    setLocalAppointments((prev) =>
      prev.map((a) => (a.id === id ? { ...a, status: 'cancelled' } : a))
    );
  };

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

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8 items-start">
        {/* Today's Appointments */}
        <motion.div variants={itemVariants} className="xl:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-bold text-slate-900 tracking-tight">
                Todays Schedule
              </h2>
              <p className="text-sm text-slate-500 mt-0.5">
                {todayAppts.length > 0
                  ? `You have ${todayAppts.length} session${todayAppts.length > 1 ? 's' : ''} today`
                  : 'No sessions scheduled for today'}
              </p>
            </div>
            <Link href="/dashboard/appointments">
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

          {todayAppts.length > 0 ? (
            <div className="space-y-3">
              <AnimatePresence mode="popLayout">
                {todayAppts.map((a) => (
                  <AppointmentCard
                    key={a.id}
                    appointment={a}
                    onConfirm={handleConfirm}
                    onDecline={handleDecline}
                  />
                ))}
              </AnimatePresence>
            </div>
          ) : (
            <motion.div variants={itemVariants}>
              <Card className="border border-dashed border-slate-200 bg-white/50 backdrop-blur-sm rounded-2xl shadow-inner">
                <CardContent className="p-12 text-center flex flex-col items-center max-w-sm mx-auto">
                  <div className="w-20 h-20 rounded-full bg-gradient-to-br from-slate-100 to-slate-50 flex items-center justify-center text-slate-300 mb-5 border border-slate-200/60">
                    <Calendar className="w-10 h-10" />
                  </div>
                  <h3 className="font-bold text-slate-800 text-xl tracking-tight mb-1">
                    No sessions today
                  </h3>
                  <p className="text-sm text-slate-400 max-w-xs">
                    Enjoy your free time or review pending requests for upcoming days.
                  </p>
                </CardContent>
              </Card>
            </motion.div>
          )}
        </motion.div>

        {/* Pending Action Center */}
        <motion.div variants={itemVariants} className="space-y-4">
          <div>
            <h2 className="text-lg font-bold text-slate-900 tracking-tight flex items-center gap-2">
              Pending Actions
              {pending.length > 0 && (
                <Badge className="bg-amber-100 text-amber-700 border-amber-200">
                  {pending.length}
                </Badge>
              )}
            </h2>
            <p className="text-sm text-slate-500 mt-0.5">
              {pending.length > 0
                ? `${pending.length} request${pending.length > 1 ? 's' : ''} waiting for response`
                : 'All caught up! 🎉'}
            </p>
          </div>

          {pending.length > 0 ? (
            <div className="space-y-3 max-h-[600px] overflow-y-auto pr-1 custom-scrollbar">
              <AnimatePresence mode="popLayout">
                {pending.slice(0, 6).map((a) => (
                  <AppointmentCard
                    key={a.id}
                    appointment={a}
                    onConfirm={handleConfirm}
                    onDecline={handleDecline}
                  />
                ))}
              </AnimatePresence>
              {pending.length > 6 && (
                <Link href="/dashboard/appointments?filter=pending">
                  <Button
                    variant="outline"
                    className="w-full rounded-xl border-slate-200 text-slate-600 hover:border-teal-300 hover:text-teal-700"
                  >
                    View {pending.length - 6} more pending requests
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </Link>
              )}
            </div>
          ) : (
            <Card className="border border-dashed border-slate-200 bg-white/50 backdrop-blur-sm rounded-2xl">
              <CardContent className="p-8 text-center">
                <div className="w-14 h-14 rounded-full bg-emerald-50 flex items-center justify-center mx-auto mb-3 border border-emerald-100">
                  <CheckCircle2 className="w-6 h-6 text-emerald-500" />
                </div>
                <p className="font-semibold text-slate-800 text-sm">No pending requests</p>
                <p className="text-xs text-slate-400 mt-1">All appointments are confirmed</p>
              </CardContent>
            </Card>
          )}
        </motion.div>
      </div>

      {/* Wellness Tip Section */}
      <motion.div variants={itemVariants}>
        <div className="bg-gradient-to-r from-teal-50/80 to-emerald-50/80 backdrop-blur-sm rounded-2xl p-4 border border-teal-200/60 flex items-center gap-3">
          <div className="p-2 bg-white rounded-xl shadow-sm">
            <Heart className="w-5 h-5 text-teal-500" />
          </div>
          <div className="flex-1">
            <p className="text-sm font-semibold text-slate-700">Consultant wellness tip</p>
            <p className="text-xs text-slate-500">
              Take 5 minutes between sessions to breathe deeply and reset. Your energy affects your
              patients. 🌿
            </p>
          </div>
          <Badge className="bg-white/60 text-teal-600 border-teal-200 text-xs">Self-care</Badge>
        </div>
      </motion.div>
    </motion.div>
  );
}