'use client';

import { useEffect, useState } from 'react';
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
  Sparkles,
  Shield,
  ChevronRight,
  Filter,
  Search,
  Users,
  TrendingUp,
} from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { appointmentService } from '@/services/appointmentService';
import AuthGuard from '@/components/shared/AuthGuard';
import useAuthStore from '@/store/authStore';

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
    icon: XCircle,
    gradient: 'from-slate-50/50 to-slate-100/30',
  },
};

const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.05, delayChildren: 0.1 },
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

function AppointmentRow({ appointment, onStatusUpdate, isConsultant }) {
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

  const config = STATUS_CONFIG[status] || STATUS_CONFIG.pending;
  const StatusIcon = config.icon;
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
      await appointmentService.updateStatus(id, { notes: note });
      setNoteOpen(false);
      setNote('');
    } finally {
      setSaving(false);
    }
  };

  return (
    <>
      <motion.div
        variants={cardVariants}
        initial="hidden"
        animate="show"
        exit="exit"
        layout
      >
        <Card className="group border border-slate-200/60 bg-white/80 backdrop-blur-sm shadow-sm hover:shadow-xl hover:border-teal-500/20 rounded-2xl transition-all duration-500 overflow-hidden">
          <div className={`h-0.5 bg-gradient-to-r ${config.gradient} scale-x-0 group-hover:scale-x-100 transition-transform duration-700 origin-left`} />

          <CardContent className="p-5">
            <div className="flex flex-col sm:flex-row sm:items-center gap-4">
              {/* Avatar & Info */}
              <div className="flex items-center gap-4 flex-1 min-w-0">
                <div className="relative">
                  <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-teal-100 to-emerald-100 text-teal-700 flex items-center justify-center font-bold text-lg shadow-inner group-hover:scale-105 transition-transform duration-300">
                    {person?.full_name?.charAt(0) || 'U'}
                  </div>
                  <div
                    className={`absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 rounded-full border-2 border-white shadow-sm ${
                      status === 'confirmed'
                        ? 'bg-emerald-500'
                        : status === 'pending'
                        ? 'bg-amber-500'
                        : status === 'completed'
                        ? 'bg-blue-500'
                        : 'bg-slate-300'
                    }`}
                  />
                </div>

                <div className="min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h4 className="font-bold text-slate-800 text-sm group-hover:text-teal-600 transition-colors truncate">
                      {person?.full_name || 'Unknown'}
                    </h4>
                    <Badge
                      className={`text-[10px] font-semibold px-2.5 py-0.5 rounded-full border ${config.color} flex items-center gap-1`}
                    >
                      <StatusIcon className="w-3 h-3" />
                      {config.label}
                    </Badge>
                  </div>

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
                      {appointment_time}
                    </span>
                    <span className="text-slate-200 hidden sm:inline">•</span>
                    <span
                      className={`flex items-center gap-1 px-2 py-0.5 rounded-lg ${
                        session_type === 'online'
                          ? 'bg-blue-50/60 text-blue-600'
                          : 'bg-purple-50/60 text-purple-600'
                      }`}
                    >
                      {session_type === 'online' ? (
                        <Video className="w-3 h-3" />
                      ) : (
                        <MapPin className="w-3 h-3" />
                      )}
                      {session_type === 'online' ? 'Video' : 'In-Person'}
                    </span>
                  </div>

                  {client_message && (
                    <div className="mt-2 bg-slate-50/80 rounded-xl px-3 py-2 border border-slate-100/60">
                      <p className="text-xs text-slate-500 italic">{client_message}</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Actions */}
              {isConsultant && (
                <div className="flex flex-wrap gap-2 self-start sm:self-center">
                  {status === 'pending' && (
                    <>
                      <Button
                        size="sm"
                        className="bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white rounded-xl h-9 px-4 text-xs font-medium shadow-sm"
                        onClick={() => handleStatusAction('confirmed')}
                        disabled={isProcessing}
                      >
                        <CheckCircle2 className="w-3.5 h-3.5 mr-1.5" />
                        Confirm
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        className="text-rose-600 border-rose-200 hover:bg-rose-50 rounded-xl h-9 px-4 text-xs font-medium"
                        onClick={() => handleStatusAction('cancelled')}
                        disabled={isProcessing}
                      >
                        <XCircle className="w-3.5 h-3.5 mr-1.5" />
                        Decline
                      </Button>
                    </>
                  )}

                  {status === 'confirmed' && (
                    <>
                      <Button
                        size="sm"
                        className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-xl h-9 px-4 text-xs font-medium shadow-sm"
                        onClick={() => handleStatusAction('completed')}
                        disabled={isProcessing}
                      >
                        <CheckCircle2 className="w-3.5 h-3.5 mr-1.5" />
                        Complete
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        className="text-slate-500 border-slate-200 hover:bg-slate-50 rounded-xl h-9 px-4 text-xs font-medium"
                        onClick={() => setNoteOpen(true)}
                      >
                        <MessageSquare className="w-3.5 h-3.5 mr-1.5" />
                        Add Note
                      </Button>
                    </>
                  )}

                  {status === 'completed' && (
                    <Button
                      size="sm"
                      variant="outline"
                      className="text-slate-500 border-slate-200 hover:bg-slate-50 rounded-xl h-9 px-4 text-xs font-medium"
                      onClick={() => setNoteOpen(true)}
                    >
                      <MessageSquare className="w-3.5 h-3.5 mr-1.5" />
                      View Note
                    </Button>
                  )}
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Note Dialog */}
      <Dialog open={noteOpen} onOpenChange={setNoteOpen}>
        <DialogContent className="sm:max-w-md rounded-2xl border-slate-200/60 bg-white/95 backdrop-blur-sm">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold text-slate-900 flex items-center gap-2">
              <MessageSquare className="w-5 h-5 text-teal-500" />
              Session Note
            </DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <Label className="text-sm font-medium text-slate-700 mb-2 block">
              Note for {person?.full_name}
            </Label>
            <Textarea
              rows={4}
              placeholder="Write your session notes here..."
              value={note}
              onChange={(e) => setNote(e.target.value)}
              className="resize-none rounded-xl border-slate-200 focus:border-teal-400 focus:ring-teal-400/20"
            />
          </div>
          <DialogFooter className="flex gap-2">
            <Button
              variant="outline"
              onClick={() => setNoteOpen(false)}
              className="rounded-xl border-slate-200"
            >
              Cancel
            </Button>
            <Button
              className="bg-gradient-to-r from-teal-600 to-emerald-600 hover:from-teal-700 hover:to-emerald-700 text-white rounded-xl shadow-lg shadow-teal-600/20"
              onClick={handleNote}
              disabled={saving || !note.trim()}
            >
              {saving ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                'Save Note'
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}

export default function AppointmentsPage() {
  const { user } = useAuthStore();
  const isConsultant = user?.role === 'consultant';
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  const fetch = () => {
    appointmentService
      .getAll()
      .then((res) => setAppointments(res.data.results || res.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetch();
  }, []);

  const handleStatusUpdate = async (id, status) => {
    try {
      await appointmentService.updateStatus(id, { status });
      fetch();
    } catch (err) {
      console.error(err);
    }
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
        className="max-w-4xl"
      >
        {/* Header */}
        <motion.div variants={itemVariants} className="mb-6">
          <div className="flex items-center gap-2 mb-1">
            <Badge className="bg-teal-50 text-teal-700 border-teal-200">
              <Calendar className="w-3 h-3 mr-1" />
              Appointment Management
            </Badge>
          </div>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900">
                All Appointments
              </h1>
              <p className="text-sm text-slate-500 font-medium mt-0.5">
                {totalCount > 0
                  ? `Managing ${totalCount} appointment${totalCount > 1 ? 's' : ''}`
                  : 'No appointments to manage'}
              </p>
            </div>
            <Badge variant="outline" className="border-slate-200 text-slate-500 self-start sm:self-center">
              <Shield className="w-3 h-3 mr-1" />
              {isConsultant ? 'Consultant View' : 'Admin View'}
            </Badge>
          </div>
        </motion.div>

        {/* Stats Row */}
        <motion.div variants={itemVariants} className="flex flex-wrap gap-3 mb-6">
          {tabs.map((tab) => (
            <div
              key={tab.value}
              className={`bg-white/80 backdrop-blur-sm rounded-xl px-4 py-2 border border-slate-200/60 shadow-sm ${
                tab.count > 0 ? 'hover:border-teal-200' : 'opacity-50'
              } transition-all`}
            >
              <span className="text-xs text-slate-400 font-medium capitalize">{tab.label}</span>
              <p className="text-lg font-bold text-slate-900">{tab.count}</p>
            </div>
          ))}
        </motion.div>

        {/* Search */}
        <motion.div variants={itemVariants} className="mb-5">
          <div className="relative">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <Input
              type="text"
              placeholder="Search by patient or consultant name..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 h-11 rounded-xl border-slate-200 focus-visible:ring-teal-500/20 focus-visible:border-teal-500 transition-all bg-white/50 shadow-sm"
            />
          </div>
        </motion.div>

        {loading ? (
          <motion.div variants={itemVariants} className="flex flex-col items-center justify-center py-32 space-y-4">
            <div className="relative">
              <Loader2 className="w-12 h-12 animate-spin text-teal-600" />
              <div className="absolute inset-0 w-12 h-12 border-2 border-teal-100 rounded-full animate-ping opacity-20" />
            </div>
            <p className="text-sm font-medium text-slate-400 tracking-wide">Loading appointments...</p>
          </motion.div>
        ) : (
          <Tabs defaultValue="all" className="w-full">
            <TabsList className="bg-white/80 backdrop-blur-sm p-1.5 rounded-2xl mb-6 flex flex-wrap gap-1 border border-slate-200/60 shadow-sm">
              {tabs.map((tab) => (
                <TabsTrigger
                  key={tab.value}
                  value={tab.value}
                  className="flex items-center gap-1.5 rounded-xl px-4 py-2 font-medium text-sm data-[state=active]:bg-gradient-to-r data-[state=active]:from-teal-600 data-[state=active]:to-emerald-600 data-[state=active]:text-white data-[state=active]:shadow-lg data-[state=active]:shadow-teal-600/20 transition-all"
                >
                  {tab.label}
                  <Badge
                    className={`ml-1 text-[10px] px-2 py-0 ${
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
                            isConsultant={isConsultant}
                          />
                        ))
                      ) : (
                        <motion.div
                          initial={{ opacity: 0, scale: 0.97 }}
                          animate={{ opacity: 1, scale: 1 }}
                          exit={{ opacity: 0, scale: 0.95 }}
                          className="text-center py-20 bg-white/70 backdrop-blur-sm border border-dashed border-slate-200 rounded-2xl shadow-sm flex flex-col items-center max-w-md mx-auto"
                        >
                          <div className="w-20 h-20 rounded-full bg-slate-50 flex items-center justify-center text-slate-300 mb-5 border border-slate-100">
                            <Calendar className="w-10 h-10" />
                          </div>
                          <h3 className="font-bold text-slate-800 text-xl mb-1">No appointments found</h3>
                          <p className="text-sm text-slate-400 max-w-[280px]">
                            {searchTerm
                              ? `No results match "${searchTerm}" in this category.`
                              : `You don't have any ${tab.value === 'all' ? '' : tab.value} appointments yet.`}
                          </p>
                          {searchTerm && (
                            <Button
                              variant="outline"
                              onClick={() => setSearchTerm('')}
                              className="mt-6 rounded-xl border-slate-200"
                            >
                              Clear Search
                            </Button>
                          )}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.div>
                </TabsContent>
              );
            })}
          </Tabs>
        )}
      </motion.div>
    </AuthGuard>
  );
}