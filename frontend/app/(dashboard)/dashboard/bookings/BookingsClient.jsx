'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Calendar,
  Clock,
  Video,
  MapPin,
  CalendarX,
  ArrowRight,
  Shield,
  Search,
  CalendarPlus,
} from 'lucide-react';
import Link from 'next/link';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { fetchAppointments, cancelAppointment } from '../actions/appointmentActions';
import AuthGuard from '@/components/shared/AuthGuard';
import PageHeader from '@/components/dashboard/ui/PageHeader';
import LoadingState from '@/components/dashboard/ui/LoadingState';
import ConfirmDialog from '@/components/dashboard/ui/ConfirmDialog';
import { getStatusConfig } from '@/lib/status';
import { containerVariants, itemVariants } from '@/lib/motion';

function AppointmentCard({ appointment, onCancel }) {
  const { id, consultant, appointment_date, appointment_time, session_type, status, notes } =
    appointment;
  const config = getStatusConfig(status);
  const StatusIcon = config.icon;
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [isCancelling, setIsCancelling] = useState(false);

  const handleCancelClick = async () => {
    setIsCancelling(true);
    await onCancel(id);
    setConfirmOpen(false);
    setIsCancelling(false);
  };

  const formatDate = (dateStr) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  return (
    <motion.div variants={itemVariants}>
      <Card className="group dash-card dash-card-hover relative overflow-hidden">
        <div className="dash-accent" />
        <CardContent className="p-5 sm:p-6">
          <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
            <div className="flex items-center gap-4">
              <div className="relative">
                <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-teal-100 to-emerald-100 text-xl font-bold text-teal-700 shadow-inner transition-transform duration-300 group-hover:scale-105">
                  {consultant?.user?.full_name?.charAt(0)}
                </div>
                <div
                  className={`absolute -right-0.5 -bottom-0.5 h-4 w-4 rounded-full border-2 border-white shadow-sm ${config.dot}`}
                />
              </div>

              <div>
                <h3 className="text-base font-bold text-slate-900 transition-colors group-hover:text-teal-600 sm:text-lg">
                  {consultant?.user?.full_name}
                </h3>
                <div className="mt-0.5 flex flex-wrap items-center gap-1.5">
                  <p className="text-xs font-medium text-slate-500">
                    {consultant?.specializations
                      ?.slice(0, 2)
                      .map((s) => s.name)
                      .join(', ') || 'Mental Health Expert'}
                  </p>
                  {consultant?.specializations?.length > 2 && (
                    <span className="text-[10px] font-medium text-slate-400">
                      +{consultant.specializations.length - 2}
                    </span>
                  )}
                </div>
              </div>
            </div>

            <div
              className={`inline-flex items-center gap-1.5 self-start rounded-xl border px-3 py-1.5 text-xs font-semibold shadow-sm md:self-center ${config.chip}`}
            >
              <StatusIcon className="h-3.5 w-3.5" />
              {config.label}
            </div>
          </div>

          <hr className="my-4 border-slate-100/80" />

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
            <div className="flex items-center gap-2.5 rounded-xl border border-slate-100/60 bg-slate-50/80 px-3.5 py-2.5">
              <Calendar className="h-4 w-4 shrink-0 text-teal-500" />
              <span className="text-sm font-medium text-slate-700">{formatDate(appointment_date)}</span>
            </div>

            <div className="flex items-center gap-2.5 rounded-xl border border-slate-100/60 bg-slate-50/80 px-3.5 py-2.5">
              <Clock className="h-4 w-4 shrink-0 text-teal-500" />
              <span className="text-sm font-medium text-slate-700">{appointment_time}</span>
            </div>

            <div
              className={`flex items-center gap-2.5 rounded-xl border px-3.5 py-2.5 ${
                session_type === 'online'
                  ? 'border-blue-100/60 bg-blue-50/60'
                  : 'border-purple-100/60 bg-purple-50/60'
              }`}
            >
              {session_type === 'online' ? (
                <Video className="h-4 w-4 shrink-0 text-blue-500" />
              ) : (
                <MapPin className="h-4 w-4 shrink-0 text-purple-500" />
              )}
              <span className="text-sm font-medium text-slate-700">
                {session_type === 'online' ? 'Video Session' : 'In-Person'}
              </span>
            </div>

            <div className="flex items-center gap-2.5 rounded-xl border border-slate-100/60 bg-slate-50/80 px-3.5 py-2.5">
              <Shield className="h-4 w-4 shrink-0 text-teal-500" />
              <span className="text-sm font-medium text-slate-700">Secure</span>
            </div>
          </div>

          {notes && (
            <div className="mt-2 rounded-xl border border-slate-100/60 bg-slate-50/80 px-3 py-2">
              <p className="text-xs text-slate-500 italic">{notes}</p>
            </div>
          )}

          {status === 'pending' && (
            <div className="mt-4 flex justify-end border-t border-slate-100/80 pt-4">
              <Button
                variant="ghost"
                size="sm"
                disabled={isCancelling}
                className="rounded-xl border border-transparent px-4 text-xs font-medium text-rose-600 transition-all hover:border-rose-200 hover:bg-rose-50/80 hover:text-rose-700"
                onClick={() => setConfirmOpen(true)}
              >
                <CalendarX className="mr-1.5 h-4 w-4" />
                Cancel Appointment
              </Button>
            </div>
          )}

          {status === 'confirmed' && (
            <div className="mt-4 flex justify-end border-t border-slate-100/80 pt-4">
              <Button
                variant="outline"
                size="sm"
                className="rounded-xl border-teal-200 text-teal-700 hover:border-teal-300 hover:bg-teal-50"
              >
                <Video className="mr-1.5 h-4 w-4" />
                Join Session
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      <ConfirmDialog
        open={confirmOpen}
        onOpenChange={setConfirmOpen}
        title="Cancel this appointment?"
        description="This will cancel your session with this consultant. You can book a new time afterwards."
        confirmLabel="Cancel Appointment"
        onConfirm={handleCancelClick}
        loading={isCancelling}
      />
    </motion.div>
  );
}

export default function BookingsClient({ initialAppointments }) {
  const [appointments, setAppointments] = useState(initialAppointments);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  const refetchAppointments = async () => {
    setLoading(true);
    try {
      const data = await fetchAppointments();
      setAppointments(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = async (id) => {
    const result = await cancelAppointment(id);
    if (result.success) {
      toast.success('Appointment cancelled');
      refetchAppointments();
    } else {
      toast.error(result.error || 'Failed to cancel appointment');
    }
  };

  const filter = (status) => appointments.filter((a) => a.status === status);

  const filteredAppointments = (status) => {
    const list = status === 'all' ? appointments : filter(status);
    if (!searchTerm) return list;
    return list.filter(
      (a) =>
        a.consultant?.user?.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        a.consultant?.specializations?.some((s) =>
          s.name.toLowerCase().includes(searchTerm.toLowerCase()),
        ),
    );
  };

  const tabs = [
    { value: 'all', label: 'All Sessions', count: appointments.length },
    { value: 'pending', label: 'Pending', count: filter('pending').length },
    { value: 'confirmed', label: 'Confirmed', count: filter('confirmed').length },
    { value: 'completed', label: 'Completed', count: filter('completed').length },
    { value: 'cancelled', label: 'Cancelled', count: filter('cancelled').length },
  ];

  const totalAppointments = appointments.length;

  return (
    <AuthGuard>
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="show"
      className="space-y-6"
    >
      <PageHeader
        badge="My Schedule"
        badgeIcon={Calendar}
        title="Your Appointments"
        subtitle={
          totalAppointments > 0
            ? `You have ${totalAppointments} scheduled consultation${totalAppointments > 1 ? 's' : ''}`
            : 'No appointments scheduled yet'
        }
        actions={
          <Link href="/consultant">
            <Button className="dash-cta">
              <CalendarPlus className="h-4 w-4" />
              Book New Session
              <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
        }
      />

      <motion.div variants={itemVariants}>
        <div className="relative">
          <Search className="absolute top-1/2 left-3.5 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search by consultant name or specialization..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="h-12 w-full rounded-xl border border-slate-200/60 bg-white/80 pl-10 pr-4 text-sm shadow-sm backdrop-blur-sm transition-all outline-none focus:border-teal-400 focus:ring-2 focus:ring-teal-400/20"
          />
        </div>
      </motion.div>

      {loading ? (
        <LoadingState label="Loading your appointments..." />
      ) : (
        <Tabs defaultValue="all" className="w-full">
          <TabsList className="mb-6 flex w-fit flex-wrap gap-1 rounded-2xl border border-slate-200/60 bg-white/80 p-1.5 shadow-sm backdrop-blur-sm">
            {tabs.map((tab) => (
              <TabsTrigger
                key={tab.value}
                value={tab.value}
                className="flex items-center gap-1.5 rounded-xl px-4 py-2.5 text-sm font-medium transition-all data-[state=active]:bg-gradient-to-r data-[state=active]:from-teal-600 data-[state=active]:to-emerald-600 data-[state=active]:text-white data-[state=active]:shadow-lg data-[state=active]:shadow-teal-600/20"
              >
                {tab.label}
                <span
                  className={`ml-1 rounded-full px-2 py-0 text-[10px] font-semibold ${
                    tab.value === 'pending'
                      ? 'bg-amber-100 text-amber-700'
                      : tab.value === 'confirmed'
                        ? 'bg-emerald-100 text-emerald-700'
                        : tab.value === 'completed'
                          ? 'bg-blue-100 text-blue-700'
                          : 'bg-slate-100 text-slate-600'
                  }`}
                >
                  {tab.count}
                </span>
              </TabsTrigger>
            ))}
          </TabsList>

          {tabs.map((tab) => {
            const currentList = filteredAppointments(tab.value);
            return (
              <TabsContent key={tab.value} value={tab.value} className="outline-none">
                <div className="space-y-4">
                  {currentList.length > 0 ? (
                    currentList.map((a) => (
                      <AppointmentCard key={a.id} appointment={a} onCancel={handleCancel} />
                    ))
                  ) : (
                    <div className="mx-auto flex max-w-md flex-col items-center rounded-2xl border border-dashed border-slate-200 bg-white/70 py-20 px-6 text-center shadow-sm backdrop-blur-sm">
                      <div className="mb-5 flex h-20 w-20 items-center justify-center rounded-full border border-slate-100 bg-slate-50 text-slate-300">
                        <CalendarX className="h-10 w-10" />
                      </div>
                      <h3 className="mb-1 text-xl font-bold text-slate-800">No appointments found</h3>
                      <p className="mb-6 max-w-[280px] text-sm text-slate-400">
                        {searchTerm
                          ? `No results match "${searchTerm}" in this category.`
                          : `You don't have any ${tab.value === 'all' ? '' : tab.value} appointments yet.`}
                      </p>
                      {searchTerm ? (
                        <Button variant="outline" onClick={() => setSearchTerm('')} className="rounded-xl">
                          Clear Search
                        </Button>
                      ) : (
                        <Link href="/consultant">
                          <Button className="dash-cta">
                            Find a Consultant
                            <ArrowRight className="h-4 w-4" />
                          </Button>
                        </Link>
                      )}
                    </div>
                  )}
                </div>
              </TabsContent>
            );
          })}
        </Tabs>
      )}
    </motion.div>
    </AuthGuard>
  );
}
