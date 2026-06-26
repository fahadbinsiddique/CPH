'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Calendar, 
  Clock, 
  Video, 
  MapPin, 
  Loader2, 
  CalendarX, 
  ArrowRight,
  Sparkles,
  Shield,
  Heart,
  CheckCircle2,
  XCircle,
  Clock as ClockIcon,
  Users,
  Search
} from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { appointmentService } from '@/services/appointmentService';
import AuthGuard from '@/components/shared/AuthGuard';

const STATUS_CONFIG = {
  pending: { 
    label: 'Pending Approval', 
    color: 'bg-amber-50 text-amber-700 border-amber-200/60',
    icon: ClockIcon,
    bg: 'from-amber-50/50 to-amber-100/30'
  },
  confirmed: { 
    label: 'Confirmed', 
    color: 'bg-emerald-50 text-emerald-700 border-emerald-200/60',
    icon: CheckCircle2,
    bg: 'from-emerald-50/50 to-emerald-100/30'
  },
  completed: { 
    label: 'Completed', 
    color: 'bg-blue-50 text-blue-700 border-blue-200/60',
    icon: CheckCircle2,
    bg: 'from-blue-50/50 to-blue-100/30'
  },
  cancelled: { 
    label: 'Cancelled', 
    color: 'bg-slate-100 text-slate-600 border-slate-200',
    icon: XCircle,
    bg: 'from-slate-50/50 to-slate-100/30'
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 20, scale: 0.97 },
  visible: { 
    opacity: 1, 
    y: 0, 
    scale: 1,
    transition: { type: 'spring', stiffness: 300, damping: 24 }
  },
  exit: { opacity: 0, scale: 0.95, y: -10, transition: { duration: 0.2 } }
};

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.06, delayChildren: 0.1 }
  }
};

function AppointmentCard({ appointment, onCancel }) {
  const { id, consultant, appointment_date, appointment_time, session_type, status } = appointment;
  const config = STATUS_CONFIG[status] || STATUS_CONFIG.pending;
  const [isCancelling, setIsCancelling] = useState(false);
  const StatusIcon = config.icon;

  const handleCancelClick = async () => {
    if (!confirm('Are you sure you want to cancel this appointment?')) return;
    setIsCancelling(true);
    await onCancel(id);
    setIsCancelling(false);
  };

  // Format date nicely
  const formatDate = (dateStr) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', { 
      weekday: 'short', 
      month: 'short', 
      day: 'numeric',
      year: 'numeric'
    });
  };

  return (
    <motion.div
      variants={cardVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
      layout
    >
      <Card className={`border border-slate-200/60 bg-white/80 backdrop-blur-sm shadow-sm hover:shadow-xl hover:border-teal-500/20 rounded-2xl overflow-hidden transition-all duration-500 group`}>
        {/* Top gradient accent line */}
        <div className={`h-1 bg-gradient-to-r ${config.bg} from-teal-400 via-emerald-400 to-teal-400 scale-x-0 group-hover:scale-x-100 transition-transform duration-700 origin-left`} />
        
        <CardContent className="p-5 sm:p-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            {/* Consultant Info */}
            <div className="flex items-center gap-4">
              <div className="relative">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-teal-100 to-emerald-100 text-teal-700 flex items-center justify-center font-bold text-xl shadow-inner group-hover:scale-105 transition-transform duration-300">
                  {consultant?.user?.full_name?.charAt(0)}
                </div>
                {/* Status dot */}
                <div className={`absolute -bottom-0.5 -right-0.5 w-4 h-4 rounded-full border-2 border-white shadow-sm ${
                  status === 'confirmed' ? 'bg-emerald-500' :
                  status === 'pending' ? 'bg-amber-500' :
                  status === 'completed' ? 'bg-blue-500' :
                  'bg-slate-300'
                }`} />
              </div>
              
              <div>
                <h3 className="font-bold text-slate-900 text-base sm:text-lg group-hover:text-teal-600 transition-colors">
                  {consultant?.user?.full_name}
                </h3>
                <div className="flex flex-wrap items-center gap-1.5 mt-0.5">
                  <p className="text-xs font-medium text-slate-500">
                    {consultant?.specializations?.slice(0, 2).map(s => s.name).join(', ') || 'Mental Health Expert'}
                  </p>
                  {consultant?.specializations?.length > 2 && (
                    <span className="text-[10px] text-slate-400 font-medium">
                      +{consultant.specializations.length - 2}
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Status Badge */}
            <div className="flex items-center gap-2 self-start md:self-center">
              <div className={`flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-xl border ${config.color} shadow-sm`}>
                <StatusIcon className="w-3.5 h-3.5" />
                {config.label}
              </div>
            </div>
          </div>

          <hr className="my-4 border-slate-100/80" />

          {/* Appointment Details Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            <div className="flex items-center gap-2.5 bg-slate-50/80 rounded-xl px-3.5 py-2.5 border border-slate-100/60">
              <Calendar className="w-4 h-4 text-teal-500 shrink-0" />
              <span className="text-sm font-medium text-slate-700">{formatDate(appointment_date)}</span>
            </div>
            
            <div className="flex items-center gap-2.5 bg-slate-50/80 rounded-xl px-3.5 py-2.5 border border-slate-100/60">
              <Clock className="w-4 h-4 text-teal-500 shrink-0" />
              <span className="text-sm font-medium text-slate-700">{appointment_time}</span>
            </div>
            
            <div className={`flex items-center gap-2.5 rounded-xl px-3.5 py-2.5 border ${
              session_type === 'online' 
                ? 'bg-blue-50/60 border-blue-100/60' 
                : 'bg-purple-50/60 border-purple-100/60'
            }`}>
              {session_type === 'online' ? (
                <Video className="w-4 h-4 text-blue-500 shrink-0" />
              ) : (
                <MapPin className="w-4 h-4 text-purple-500 shrink-0" />
              )}
              <span className="text-sm font-medium text-slate-700">
                {session_type === 'online' ? 'Video Session' : 'In-Person'}
              </span>
            </div>

            <div className="flex items-center gap-2.5 bg-slate-50/80 rounded-xl px-3.5 py-2.5 border border-slate-100/60">
              <Shield className="w-4 h-4 text-teal-500 shrink-0" />
              <span className="text-sm font-medium text-slate-700">Secure</span>
            </div>
          </div>

          {/* Actions */}
          {status === 'pending' && (
            <div className="mt-4 pt-4 border-t border-slate-100/80 flex justify-end">
              <Button
                variant="ghost"
                size="sm"
                disabled={isCancelling}
                className="text-rose-600 hover:text-rose-700 hover:bg-rose-50/80 rounded-xl px-4 transition-all border border-transparent hover:border-rose-200 font-medium text-xs"
                onClick={handleCancelClick}
              >
                {isCancelling ? (
                  <Loader2 className="w-4 h-4 mr-1.5 animate-spin" />
                ) : (
                  <XCircle className="w-4 h-4 mr-1.5" />
                )}
                Cancel Appointment
              </Button>
            </div>
          )}

          {/* Confirmed session actions */}
          {status === 'confirmed' && (
            <div className="mt-4 pt-4 border-t border-slate-100/80 flex justify-end">
              <Button
                variant="outline"
                size="sm"
                className="rounded-xl border-teal-200 text-teal-700 hover:bg-teal-50 hover:border-teal-300 font-medium text-xs"
              >
                <Video className="w-4 h-4 mr-1.5" />
                Join Session
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
}

export default function BookingsPage() {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  const fetchAppointments = () => {
    appointmentService.getAll()
      .then(res => setAppointments(res.data.results || res.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchAppointments();
  }, []);

  const handleCancel = async (id) => {
    try {
      await appointmentService.updateStatus(id, { status: 'cancelled' });
      fetchAppointments();
    } catch (err) {
      console.error(err);
    }
  };

  const filter = (status) => appointments.filter(a => a.status === status);

  const filteredAppointments = (status) => {
    const list = status === 'all' ? appointments : filter(status);
    if (!searchTerm) return list;
    return list.filter(a => 
      a.consultant?.user?.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      a.consultant?.specializations?.some(s => s.name.toLowerCase().includes(searchTerm.toLowerCase()))
    );
  };

  const tabs = [
    { value: 'all', label: 'All Sessions', count: appointments.length, icon: Users },
    { value: 'pending', label: 'Pending', count: filter('pending').length, icon: ClockIcon },
    { value: 'confirmed', label: 'Confirmed', count: filter('confirmed').length, icon: CheckCircle2 },
    { value: 'completed', label: 'Completed', count: filter('completed').length, icon: CheckCircle2 },
    { value: 'cancelled', label: 'Cancelled', count: filter('cancelled').length, icon: XCircle },
  ];

  const totalAppointments = appointments.length;

  return (
    <section className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-indigo-50/30 pt-32 pb-16">
      <AuthGuard>
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          
          {/* Premium Header */}
          <motion.div 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <Badge className="bg-teal-50 text-teal-700 border-teal-200">
                    <Sparkles className="w-3 h-3 mr-1" />
                    My Schedule
                  </Badge>
                </div>
                <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-slate-900">
                  Your Appointments
                </h1>
                <p className="text-sm text-slate-500 mt-1 font-medium">
                  {totalAppointments > 0 
                    ? `You have ${totalAppointments} scheduled consultation${totalAppointments > 1 ? 's' : ''}`
                    : 'No appointments scheduled yet'}
                </p>
              </div>
              
              <Link href="/consultant" passHref>
                <Button className="bg-gradient-to-r from-teal-600 to-emerald-600 hover:from-teal-700 hover:to-emerald-700 text-white rounded-xl shadow-lg shadow-teal-600/20 transition-all group">
                  <Calendar className="w-4 h-4 mr-2 group-hover:scale-110 transition-transform" />
                  Book New Session
                  <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
            </div>
          </motion.div>

          {/* Search Bar */}
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="mb-6"
          >
            <div className="relative">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                placeholder="Search by consultant name or specialization..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200/60 bg-white/80 backdrop-blur-sm focus:border-teal-400 focus:ring-2 focus:ring-teal-400/20 outline-none transition-all text-sm shadow-sm"
              />
            </div>
          </motion.div>

          {loading ? (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex flex-col items-center justify-center py-32 space-y-4"
            >
              <div className="relative">
                <Loader2 className="w-12 h-12 animate-spin text-teal-600" />
                <div className="absolute inset-0 w-12 h-12 border-2 border-teal-100 rounded-full animate-ping opacity-20" />
              </div>
              <p className="text-sm font-medium text-slate-400 tracking-wide">Loading your appointments...</p>
            </motion.div>
          ) : (
            <Tabs defaultValue="all" className="w-full">
              <TabsList className="bg-white/80 backdrop-blur-sm p-1.5 rounded-2xl mb-6 flex flex-wrap gap-1 border border-slate-200/60 shadow-sm">
                {tabs.map((tab) => {
                  const Icon = tab.icon;
                  const isActive = tab.value === 'all' ? true : false;
                  return (
                    <TabsTrigger 
                      key={tab.value} 
                      value={tab.value}
                      className="flex items-center gap-1.5 rounded-xl px-4 py-2.5 font-medium text-sm data-[state=active]:bg-gradient-to-r data-[state=active]:from-teal-600 data-[state=active]:to-emerald-600 data-[state=active]:text-white data-[state=active]:shadow-lg data-[state=active]:shadow-teal-600/20 transition-all"
                    >
                      <Icon className="w-4 h-4" />
                      {tab.label}
                      <Badge className={`ml-1 text-[10px] px-2 py-0 ${
                        tab.value === 'all' ? 'bg-slate-100 text-slate-600' : 
                        tab.value === 'pending' ? 'bg-amber-100 text-amber-700' :
                        tab.value === 'confirmed' ? 'bg-emerald-100 text-emerald-700' :
                        tab.value === 'completed' ? 'bg-blue-100 text-blue-700' :
                        'bg-slate-100 text-slate-600'
                      }`}>
                        {tab.count}
                      </Badge>
                    </TabsTrigger>
                  );
                })}
              </TabsList>

              {tabs.map((tab) => {
                const currentList = filteredAppointments(tab.value);
                
                return (
                  <TabsContent key={tab.value} value={tab.value} className="outline-none focus-visible:ring-0">
                    <motion.div 
                      variants={containerVariants}
                      initial="hidden"
                      animate="visible"
                      className="space-y-4"
                    >
                      <AnimatePresence mode="popLayout">
                        {currentList.length > 0 ? (
                          currentList.map(a => (
                            <AppointmentCard
                              key={a.id}
                              appointment={a}
                              onCancel={handleCancel}
                            />
                          ))
                        ) : (
                          <motion.div 
                            initial={{ opacity: 0, scale: 0.97 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            className="text-center py-20 px-6 bg-white/70 backdrop-blur-sm border border-dashed border-slate-200 rounded-2xl shadow-sm flex flex-col items-center max-w-md mx-auto"
                          >
                            <div className="w-20 h-20 rounded-full bg-slate-50 flex items-center justify-center text-slate-300 mb-5 border border-slate-100">
                              <CalendarX className="w-10 h-10" />
                            </div>
                            <h3 className="font-bold text-slate-800 text-xl mb-1">No appointments found</h3>
                            <p className="text-sm text-slate-400 max-w-[280px] mb-6">
                              {searchTerm 
                                ? `No results match "${searchTerm}" in this category.`
                                : `You don't have any ${tab.value === 'all' ? '' : tab.value} appointments yet.`
                              }
                            </p>
                            {searchTerm ? (
                              <Button 
                                variant="outline" 
                                onClick={() => setSearchTerm('')}
                                className="rounded-xl border-slate-200"
                              >
                                Clear Search
                              </Button>
                            ) : (
                              <Link href="/consultant" passHref>
                                <Button className="bg-gradient-to-r from-teal-600 to-emerald-600 hover:from-teal-700 hover:to-emerald-700 text-white rounded-xl shadow-md shadow-teal-600/20 transition-all group">
                                  <Sparkles className="w-4 h-4 mr-2" />
                                  Find a Consultant
                                  <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                                </Button>
                              </Link>
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
        </div>
      </AuthGuard>
    </section>
  );
}