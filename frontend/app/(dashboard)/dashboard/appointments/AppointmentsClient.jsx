'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Calendar,
  Clock,
  Video,
  MapPin,
  Loader2,
  CheckCircle2,
  XCircle,
  MessageSquare,
  Shield,
  Search,
} from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';
import PageHeader from '@/components/dashboard/ui/PageHeader';
import StatusBadge from '@/components/dashboard/ui/StatusBadge';
import LoadingState from '@/components/dashboard/ui/LoadingState';
import EmptyState from '@/components/dashboard/ui/EmptyState';
import { APPOINTMENT_STATUS } from '@/lib/status';
import { containerVariants, itemVariants } from '@/lib/motion';
import AuthGuard from '@/components/shared/AuthGuard';
import useAuthStore from '@/store/authStore';
import { updateAppointmentStatus, addAppointmentNote } from '../actions/appointmentActions';

const cardVariants = {
  hidden: { opacity: 0, x: -20, scale: 0.95 },
  show: {
    opacity: 1,
    x: 0,
    scale: 1,
    transition: { type: 'spring', stiffness: 350, damping: 25 },
  },
  exit: {
    opacity: 0,
    x: 20,
    scale: 0.95,
    transition: { duration: 0.2 },
  },
};

function AppointmentRow({ appointment, onStatusUpdate, onNoteSave, isConsultant }) {
  const {
    id,
    client,
    consultant,
    appointment_date,
    appointment_time,
    session_type,
    status,
    client_message,
  } = appointment;

  const config = APPOINTMENT_STATUS[status] || APPOINTMENT_STATUS.pending;
  const person = isConsultant ? client : consultant?.user;
  const [noteOpen, setNoteOpen] = useState(false);
  const [note, setNote] = useState('');
  const [saving, setSaving] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  const date = new Date(appointment_date);

  const handleStatusAction = async (newStatus) => {
    setIsProcessing(true);
    await onStatusUpdate(id, newStatus);
    setIsProcessing(false);
  };

  const handleNote = async () => {
    setSaving(true);
    try {
      const result = await onNoteSave(id, note);
      if (result.success) {
        setNoteOpen(false);
        setNote('');
        toast.success('Session note saved');
      } else {
        toast.error(result.error || 'Failed to save note');
      }
    } catch {
      toast.error('Failed to save note');
    } finally {
      setSaving(false);
    }
  };

  return (
    <>
      <motion.div variants={cardVariants} initial="hidden" animate="show" exit="exit" layout>
        <Card className="group dash-card dash-card-hover relative overflow-hidden">
          <div className="dash-accent" />
          <CardContent className="p-5">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-4">
                  <div className="relative">
                    <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-teal-100 to-emerald-100 text-lg font-bold text-teal-700 shadow-inner transition-transform duration-300 group-hover:scale-105">
                      {person?.full_name?.charAt(0) || 'U'}
                    </div>
                    <div
                      className={`absolute -right-0.5 -bottom-0.5 h-3.5 w-3.5 rounded-full border-2 border-white shadow-sm ${config.dot}`}
                    />
                  </div>

                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <h4 className="truncate text-sm font-bold text-slate-800 transition-colors group-hover:text-teal-600">
                        {person?.full_name || 'Unknown'}
                      </h4>
                      <StatusBadge status={status} />
                    </div>

                    <div className="mt-0.5 flex flex-wrap items-center gap-x-3 gap-y-0.5 text-xs font-medium text-slate-400">
                      <span className="flex items-center gap-1 rounded-lg bg-slate-50/80 px-2 py-0.5">
                        <Calendar className="h-3 w-3 text-teal-500" />
                        {date.toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric',
                        })}
                      </span>
                      <span className="hidden text-slate-200 sm:inline">•</span>
                      <span className="flex items-center gap-1 rounded-lg bg-slate-50/80 px-2 py-0.5">
                        <Clock className="h-3 w-3 text-teal-500" />
                        {appointment_time}
                      </span>
                      <span className="hidden text-slate-200 sm:inline">•</span>
                      <span
                        className={`flex items-center gap-1 rounded-lg px-2 py-0.5 ${
                          session_type === 'online'
                            ? 'bg-blue-50/60 text-blue-600'
                            : 'bg-purple-50/60 text-purple-600'
                        }`}
                      >
                        {session_type === 'online' ? (
                          <Video className="h-3 w-3" />
                        ) : (
                          <MapPin className="h-3 w-3" />
                        )}
                        {session_type === 'online' ? 'Video' : 'In-Person'}
                      </span>
                    </div>

                    {client_message && (
                      <div className="mt-2 rounded-xl border border-slate-100/60 bg-slate-50/80 px-3 py-2">
                        <p className="text-xs text-slate-500 italic">{client_message}</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {isConsultant && (
                <div className="flex flex-wrap gap-2 self-start sm:self-center">
                  {status === 'pending' && (
                    <>
                      <Button
                        size="sm"
                        className="h-9 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 px-4 text-xs font-medium text-white shadow-sm hover:from-emerald-700 hover:to-teal-700"
                        onClick={() => handleStatusAction('confirmed')}
                        disabled={isProcessing}
                      >
                        <CheckCircle2 className="mr-1.5 h-3.5 w-3.5" />
                        Confirm
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        className="h-9 rounded-xl border-rose-200 px-4 text-xs font-medium text-rose-600 hover:bg-rose-50"
                        onClick={() => handleStatusAction('cancelled')}
                        disabled={isProcessing}
                      >
                        <XCircle className="mr-1.5 h-3.5 w-3.5" />
                        Decline
                      </Button>
                    </>
                  )}

                  {status === 'confirmed' && (
                    <>
                      <Button
                        size="sm"
                        className="h-9 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 px-4 text-xs font-medium text-white shadow-sm hover:from-blue-700 hover:to-indigo-700"
                        onClick={() => handleStatusAction('completed')}
                        disabled={isProcessing}
                      >
                        <CheckCircle2 className="mr-1.5 h-3.5 w-3.5" />
                        Complete
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        className="h-9 rounded-xl border-slate-200 px-4 text-xs font-medium text-slate-500 hover:bg-slate-50"
                        onClick={() => setNoteOpen(true)}
                      >
                        <MessageSquare className="mr-1.5 h-3.5 w-3.5" />
                        Add Note
                      </Button>
                    </>
                  )}

                  {status === 'completed' && (
                    <Button
                      size="sm"
                      variant="outline"
                      className="h-9 rounded-xl border-slate-200 px-4 text-xs font-medium text-slate-500 hover:bg-slate-50"
                      onClick={() => setNoteOpen(true)}
                    >
                      <MessageSquare className="mr-1.5 h-3.5 w-3.5" />
                      View Note
                    </Button>
                  )}
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </motion.div>

      <Dialog open={noteOpen} onOpenChange={setNoteOpen}>
        <DialogContent className="rounded-2xl border-slate-200/60 bg-white/95 backdrop-blur-sm sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-xl font-bold text-slate-900">
              <MessageSquare className="h-5 w-5 text-teal-500" />
              Session Note
            </DialogTitle>
            <DialogDescription>
              Add or edit a private note for this session. Notes are visible only to you.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <Label className="mb-2 block text-sm font-medium text-slate-700">
              Note for {person?.full_name}
            </Label>
            <Textarea
              rows={4}
              placeholder="Write your session notes here..."
              value={note}
              onChange={(e) => setNote(e.target.value)}
              className="rounded-xl border-slate-200 resize-none focus:border-teal-400 focus:ring-teal-400/20"
            />
          </div>
          <DialogFooter className="flex gap-2">
            <Button variant="outline" onClick={() => setNoteOpen(false)} className="rounded-xl border-slate-200">
              Cancel
            </Button>
            <Button
              className="rounded-xl bg-gradient-to-r from-teal-600 to-emerald-600 text-white shadow-lg shadow-teal-600/20 hover:from-teal-700 hover:to-emerald-700"
              onClick={handleNote}
              disabled={saving || !note.trim()}
            >
              {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Save Note'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}

export default function AppointmentsClient({ initialAppointments = [] }) {
  const { user } = useAuthStore();
  const isConsultant = user?.role === 'consultant';
  const [appointments, setAppointments] = useState(initialAppointments);
  const [searchTerm, setSearchTerm] = useState('');

  const handleStatusUpdate = async (id, status) => {
    try {
      const result = await updateAppointmentStatus(id, status);
      if (result.success) {
        toast.success(`Appointment ${status}`);
        setAppointments(prev => prev.map(a => a.id === id ? { ...a, status } : a));
      } else {
        toast.error(result.error || 'Failed to update appointment');
      }
    } catch (err) {
      console.error(err);
      toast.error('Failed to update appointment');
    }
  };

  const handleNoteSave = async (id, notes) => {
    return await addAppointmentNote(id, notes);
  };

  const filter = (s) => appointments.filter((a) => a.status === s);

  const searchFilter = (list) => {
    if (!searchTerm) return list;
    return list.filter((a) => {
      const person = isConsultant ? a.client : a.consultant?.user;
      const name = person?.full_name?.toLowerCase() || '';
      return name.includes(searchTerm.toLowerCase());
    });
  };

  const tabs = [
    { value: 'all', label: 'All', count: appointments.length },
    { value: 'pending', label: 'Pending', count: filter('pending').length },
    { value: 'confirmed', label: 'Confirmed', count: filter('confirmed').length },
    { value: 'completed', label: 'Completed', count: filter('completed').length },
    { value: 'cancelled', label: 'Cancelled', count: filter('cancelled').length },
  ];

  const totalCount = appointments.length;

  return (
    <AuthGuard allowedRoles={['consultant', 'admin']}>
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="show"
        className="space-y-6"
      >
        <PageHeader
          badge="Appointment Management"
          badgeIcon={Calendar}
          title="All Appointments"
          subtitle={
            totalCount > 0
              ? `Managing ${totalCount} appointment${totalCount > 1 ? 's' : ''}`
              : 'No appointments to manage'
          }
          actions={
            <Badge variant="outline" className="border-slate-200 text-slate-500">
              <Shield className="mr-1 h-3 w-3" />
              {isConsultant ? 'Consultant View' : 'Admin View'}
            </Badge>
          }
        />

        <motion.div variants={itemVariants} className="flex flex-wrap gap-3">
          {tabs.map((tab) => (
            <div
              key={tab.value}
              className={`rounded-xl border border-slate-200/60 bg-white/80 px-4 py-2 shadow-sm backdrop-blur-sm transition-all ${
                tab.count > 0 ? 'hover:border-teal-200' : 'opacity-50'
              }`}
            >
              <span className="text-xs font-medium text-slate-400 capitalize">{tab.label}</span>
              <p className="text-lg font-bold text-slate-900">{tab.count}</p>
            </div>
          ))}
        </motion.div>

        <motion.div variants={itemVariants}>
          <div className="relative">
            <Search className="absolute top-1/2 left-3.5 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <Input
              type="text"
              placeholder="Search by patient or consultant name..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="h-11 rounded-xl border-slate-200 bg-white/50 pl-10 shadow-sm transition-all focus-visible:border-teal-500 focus-visible:ring-teal-500/20"
            />
          </div>
        </motion.div>

        <Tabs defaultValue="all" className="w-full">
          <TabsList className="sm:md-6 mb-14  flex w-fit flex-wrap sm:gap-2 gap-4 rounded-xl border border-slate-200/60 bg-white/80 p-1.5 shadow-sm backdrop-blur-sm">
            {tabs.map((tab) => (
              <TabsTrigger
                key={tab.value}
                value={tab.value}
                className="flex items-center gap-1.5 rounded-xl px-4 py-3 text-center text-sm font-medium transition-all data-[state=active]:bg-gradient-to-r data-[state=active]:from-teal-600 data-[state=active]:to-emerald-600 data-[state=active]:text-white data-[state=active]:shadow-lg data-[state=active]:shadow-teal-600/20"
              >
                {tab.label}
                <Badge
                  className={`ml-1 px-2 py-0 text-[10px] ${
                    tab.value === 'all'
                      ? 'bg-slate-100 text-slate-600'
                      : tab.value === 'pending'
                        ? 'bg-amber-100 text-amber-700'
                        : tab.value === 'confirmed'
                          ? 'bg-emerald-100 text-emerald-700'
                          : tab.value === 'completed'
                            ? 'bg-blue-100 text-blue-700'
                            : 'bg-slate-100 text-slate-600'
                  }`}
                >
                  {tab.count}
                </Badge>
              </TabsTrigger>
            ))}
          </TabsList>

          {tabs.map((tab) => {
            const list = tab.value === 'all' ? appointments : filter(tab.value);
            const filteredList = searchFilter(list);

            return (
              <TabsContent key={tab.value} value={tab.value} className="outline-none focus-visible:ring-0">
                <motion.div
                  variants={containerVariants}
                  initial="hidden"
                  animate="show"
                  className="space-y-3"
                >
                  <AnimatePresence mode="popLayout">
                    {filteredList.length > 0 ? (
                      filteredList.map((a) => (
                        <AppointmentRow
                          key={a.id}
                          appointment={a}
                          onStatusUpdate={handleStatusUpdate}
                          onNoteSave={handleNoteSave}
                          isConsultant={isConsultant}
                        />
                      ))
                    ) : (
                      <EmptyState
                        icon={Calendar}
                        title="No appointments found"
                        description={
                          searchTerm
                            ? `No results match "${searchTerm}" in this category.`
                            : `You don't have any ${tab.value === 'all' ? '' : tab.value} appointments yet.`
                        }
                        action={
                          searchTerm && (
                            <Button
                              variant="outline"
                              onClick={() => setSearchTerm('')}
                              className="rounded-xl border-slate-200"
                            >
                              Clear Search
                            </Button>
                          )
                        }
                      />
                    )}
                  </AnimatePresence>
                </motion.div>
              </TabsContent>
            );
          })}
        </Tabs>
      </motion.div>
    </AuthGuard>
  );
}