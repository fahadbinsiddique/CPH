'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Calendar,
  Clock,
  Video,
  MapPin,
  ChevronLeft,
  ChevronRight,
  Loader2,
  CheckCircle2,
  User,
  ArrowRight,
  ArrowLeft,
  Sparkles,
  Shield,
  Heart,
  Star,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { consultantService } from '@/services/consultantService';
import { appointmentService } from '@/services/appointmentService';
import useAuthStore from '@/store/authStore';

// Extended time slots
const ALL_SLOTS = [
  '09:00', '09:30', '10:00', '10:30', '11:00', '11:30',
  '12:00', '12:30', '14:00', '14:30', '15:00', '15:30',
  '16:00', '16:30', '17:00', '17:30', '18:00', '18:30',
  '19:00', '19:30', '20:00', '20:30', '21:00', '21:30', '22:00'
];

const SESSION_TYPES = [
  { 
    value: 'online', 
    label: 'Online Session', 
    icon: Video, 
    desc: 'Secure video consultation from anywhere',
    color: 'from-blue-500 to-indigo-600'
  },
  { 
    value: 'in_person', 
    label: 'In-Person Visit', 
    icon: MapPin, 
    desc: 'Face-to-face at our clinic',
    color: 'from-emerald-500 to-teal-600'
  },
];

const MONTHS = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];

const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

function convertTo12Hour(timeStr) {
  const [hour, minute] = timeStr.split(':');
  const h = parseInt(hour, 10);
  const ampm = h >= 12 ? 'PM' : 'AM';
  const displayHour = h % 12 || 12;
  return `${displayHour}:${minute} ${ampm}`;
}



function formatDate(date) {
  if (!date) return '';

  return [
    date.getFullYear(),
    String(date.getMonth() + 1).padStart(2, '0'),
    String(date.getDate()).padStart(2, '0'),
  ].join('-');
}

export default function BookingPage() {
  const { slug } = useParams();
  const router = useRouter();
  const { isAuthenticated } = useAuthStore();

  const [consultant, setConsultant] = useState(null);
  const [loading, setLoading] = useState(true);
  const [step, setStep] = useState(1);

  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedSlot, setSelectedSlot] = useState('');
  const [sessionType, setSessionType] = useState('online');
  const [message, setMessage] = useState('');
  const [bookedSlots, setBookedSlots] = useState([]);
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/');
      return;
    }
    consultantService.getBySlug(slug)
      .then(res => setConsultant(res.data))
      .catch(() => router.push('/consultant'))
      .finally(() => setLoading(false));
  }, [slug, isAuthenticated, router]);

  useEffect(() => {
    if (selectedDate && consultant) {
      appointmentService
        .getBookedSlots(consultant.id, formatDate(selectedDate))
        .then(res => setBookedSlots(res.data.booked_slots || []))
        .catch(() => setBookedSlots([]));
    }
  }, [selectedDate, consultant]);

  const getDaysInMonth = (date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    return { firstDay, daysInMonth };
  };

  const isDateDisabled = (day) => {
    const date = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return date < today;
  };

  const handleDateSelect = (day) => {
    if (isDateDisabled(day)) return;
    setSelectedDate(new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day));
    setSelectedSlot('');
    setStep(2);
  };

  const handleSubmit = async () => {
    setSubmitting(true);
    setError('');
    try {
      await appointmentService.create({
        consultant: consultant.id,
        appointment_date: formatDate(selectedDate),
        appointment_time: selectedSlot,
        session_type: sessionType,
        client_message: message,
      });
      setSuccess(true);
    } catch (err) {
      setError(
        err.response?.data?.non_field_errors?.[0] ||
        err.response?.data?.error ||
        'Something went wrong. Please try again.'
      );
    } finally {
      setSubmitting(false);
    }
  };

  const { firstDay, daysInMonth } = getDaysInMonth(currentMonth);

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-white to-indigo-50/30">
      <div className="text-center space-y-4">
        <Loader2 className="w-12 h-12 animate-spin text-teal-600 mx-auto" />
        <p className="text-sm font-medium text-slate-500">Loading your booking experience...</p>
      </div>
    </div>
  );

  if (success) return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-indigo-50/30 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
        className="bg-white/80 backdrop-blur-sm p-8 rounded-3xl shadow-2xl text-center max-w-md border border-white/40"
      >
        <div className="w-24 h-24 bg-gradient-to-br from-emerald-400 to-teal-500 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg shadow-emerald-500/20">
          <CheckCircle2 className="w-14 h-14 text-white" />
        </div>
        <h2 className="text-3xl font-bold text-slate-900 mb-2">Booking Confirmed! 🎉</h2>
        <p className="text-slate-600">
          Your appointment with <span className="font-semibold text-teal-600">{consultant?.user?.full_name}</span> is successfully scheduled.
        </p>
        <div className="my-6 p-5 bg-slate-50/80 rounded-2xl border border-slate-200/60 text-left space-y-2">
          <p className="text-xs text-slate-400 uppercase tracking-wider font-semibold">📋 Appointment Details</p>
          <div className="flex justify-between text-sm">
            <span className="text-slate-500">Date</span>
            <span className="font-semibold text-slate-800">{formatDate(selectedDate)}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-slate-500">Time</span>
            <span className="font-semibold text-slate-800">{convertTo12Hour(selectedSlot)}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-slate-500">Type</span>
            <Badge className="bg-teal-50 text-teal-700 border-teal-200">
              {sessionType === 'online' ? '💻 Online' : '📍 In-Person'}
            </Badge>
          </div>
        </div>
        <div className="flex flex-col gap-3 mt-6">
          <Button 
            className="w-full bg-gradient-to-r from-teal-600 to-emerald-600 hover:from-teal-700 hover:to-emerald-700 text-white rounded-xl shadow-lg shadow-teal-600/20"
            onClick={() => router.push('/dashboard/bookings')}
          >
            View My Bookings
          </Button>
          <Button 
            variant="outline" 
            className="w-full rounded-xl border-slate-200"
            onClick={() => router.push('/consultant')}
          >
            Browse More Consultants
          </Button>
        </div>
      </motion.div>
    </div>
  );

  const steps = [
    { id: 1, label: 'Date', icon: Calendar },
    { id: 2, label: 'Time', icon: Clock },
    { id: 3, label: 'Details', icon: User },
    { id: 4, label: 'Confirm', icon: CheckCircle2 },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-indigo-50/30 py-12">
      <div className="max-w-4xl mx-auto px-4">
        
        {/* Header with Consultant Info */}
        <motion.div 
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8 flex items-center justify-between"
        >
          <div className="flex items-center gap-4">
            <button
              onClick={() => step > 1 ? setStep(s => s - 1) : router.back()}
              className="p-2.5 bg-white/80 backdrop-blur-sm hover:bg-white text-slate-600 rounded-xl transition-all shadow-sm border border-slate-200/60"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <div>
              <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Book Appointment</h1>
              <div className="flex items-center gap-2 text-sm text-slate-500">
                <span className="font-medium text-teal-600">{consultant?.user?.full_name}</span>
                <span className="text-slate-300">•</span>
                <span>৳{consultant?.consultation_fee}/session</span>
              </div>
            </div>
          </div>
          <Badge className="bg-emerald-50 text-emerald-700 border-emerald-200">
            <Heart className="w-3 h-3 mr-1 fill-emerald-500 text-emerald-500" />
            Secure Booking
          </Badge>
        </motion.div>

        {/* Premium Stepper */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-slate-200/60 shadow-sm p-4 mb-8">
          <div className="flex items-center justify-between relative">
            {steps.map((s, i) => {
              const isActive = step === s.id;
              const isCompleted = step > s.id;
              const Icon = s.icon;
              return (
                <div key={s.id} className="flex items-center flex-1 last:flex-none">
                  <div className="flex items-center gap-3">
                    <div className={`
                      w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300
                      ${isActive ? 'bg-gradient-to-r from-teal-600 to-emerald-600 text-white shadow-lg shadow-teal-600/20 scale-110' : 
                        isCompleted ? 'bg-emerald-100 text-emerald-600' : 
                        'bg-slate-100 text-slate-400'}
                    `}>
                      {isCompleted ? <CheckCircle2 className="w-5 h-5" /> : <Icon className="w-5 h-5" />}
                    </div>
                    <div className="hidden sm:block">
                      <p className={`text-xs font-medium ${isActive ? 'text-teal-600' : isCompleted ? 'text-emerald-600' : 'text-slate-400'}`}>
                        Step {s.id}
                      </p>
                      <p className={`text-sm font-semibold ${isActive ? 'text-slate-900' : isCompleted ? 'text-slate-700' : 'text-slate-400'}`}>
                        {s.label}
                      </p>
                    </div>
                  </div>
                  {i < steps.length - 1 && (
                    <div className={`flex-1 h-0.5 mx-4 ${i < step - 1 ? 'bg-emerald-400' : 'bg-slate-200'}`} />
                  )}
                </div>
              );
            })}
          </div>
        </div>

        <AnimatePresence mode="wait">
          {/* Step 1: Calendar */}
          {step === 1 && (
            <motion.div
              key="step1"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              <Card className="border border-slate-200/60 shadow-xl shadow-slate-200/30 rounded-3xl overflow-hidden bg-white/80 backdrop-blur-sm">
                <CardContent className="p-6 sm:p-8">
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="font-bold text-slate-900 text-lg flex items-center gap-2">
                      <Calendar className="w-5 h-5 text-teal-600" />
                      Select a Date
                    </h2>
                    <div className="flex items-center gap-2 bg-slate-50/80 rounded-xl p-1 border border-slate-200/60">
                      <button
                        onClick={() => setCurrentMonth(m => new Date(m.getFullYear(), m.getMonth() - 1))}
                        className="p-2 hover:bg-white rounded-lg transition-all"
                      >
                        <ChevronLeft className="w-4 h-4 text-slate-600" />
                      </button>
                      <span className="font-semibold text-sm text-slate-800 min-w-[120px] text-center">
                        {MONTHS[currentMonth.getMonth()]} {currentMonth.getFullYear()}
                      </span>
                      <button
                        onClick={() => setCurrentMonth(m => new Date(m.getFullYear(), m.getMonth() + 1))}
                        className="p-2 hover:bg-white rounded-lg transition-all"
                      >
                        <ChevronRight className="w-4 h-4 text-slate-600" />
                      </button>
                    </div>
                  </div>

                  <div className="grid grid-cols-7 gap-2 mb-3">
                    {DAYS.map(d => (
                      <div key={d} className="text-center text-xs font-bold text-slate-400 uppercase tracking-wider py-1">
                        {d}
                      </div>
                    ))}
                  </div>

                  <div className="grid grid-cols-7 gap-2">
                    {Array.from({ length: firstDay }).map((_, i) => (
                      <div key={`empty-${i}`} />
                    ))}
                    {Array.from({ length: daysInMonth }).map((_, i) => {
                      const day = i + 1;
                      const disabled = isDateDisabled(day);
                      const isSelected = selectedDate?.getDate() === day && 
                                        selectedDate?.getMonth() === currentMonth.getMonth();
                      const isToday = new Date().getDate() === day && 
                                     new Date().getMonth() === currentMonth.getMonth() &&
                                     new Date().getFullYear() === currentMonth.getFullYear();

                      return (
                        <button
                          key={day}
                          onClick={() => handleDateSelect(day)}
                          disabled={disabled}
                          className={`
                            relative aspect-square rounded-2xl text-sm font-semibold transition-all duration-200
                            flex items-center justify-center border-2
                            ${isSelected 
                              ? 'bg-gradient-to-r from-teal-600 to-emerald-600 text-white border-teal-600 shadow-lg shadow-teal-600/20 scale-105' 
                              : disabled 
                              ? 'text-slate-200 border-transparent cursor-not-allowed bg-slate-50/50' 
                              : 'hover:bg-teal-50 hover:border-teal-300 text-slate-700 border-slate-200/60 bg-white shadow-sm hover:shadow-md'
                            }
                          `}
                        >
                          {day}
                          {isToday && !isSelected && (
                            <span className="absolute bottom-1 w-1 h-1 rounded-full bg-teal-400" />
                          )}
                        </button>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}

          {/* Step 2: Time Slots */}
          {step === 2 && (
            <motion.div
              key="step2"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              <Card className="border border-slate-200/60 shadow-xl shadow-slate-200/30 rounded-3xl overflow-hidden bg-white/80 backdrop-blur-sm">
                <CardContent className="p-6 sm:p-8">
                  <div className="flex items-center justify-between mb-6">
                    <div>
                      <h2 className="font-bold text-slate-900 text-lg flex items-center gap-2">
                        <Clock className="w-5 h-5 text-teal-600" />
                        Choose Time Slot
                      </h2>
                      <p className="text-sm text-slate-500 mt-0.5">
                        {formatDate(selectedDate)}
                      </p>
                    </div>
                    <Badge className="bg-teal-50 text-teal-700 border-teal-200 font-medium">
                      {selectedDate?.toLocaleDateString('en-US', { weekday: 'short' })}
                    </Badge>
                  </div>

                  <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
                    {ALL_SLOTS.map((slot) => {
                      const isBooked = bookedSlots.includes(slot + ':00') || bookedSlots.includes(slot);
                      const isSelected = selectedSlot === slot;
                      return (
                        <button
                          key={slot}
                          disabled={isBooked}
                          onClick={() => setSelectedSlot(slot)}
                          className={`
                            py-3 px-2 rounded-xl text-sm font-semibold border-2 transition-all duration-200 text-center
                            ${isSelected 
                              ? 'bg-gradient-to-r from-teal-600 to-emerald-600 text-white border-teal-600 shadow-lg shadow-teal-600/20 scale-105' 
                              : isBooked 
                              ? 'bg-slate-50 text-slate-300 border-slate-100 line-through cursor-not-allowed' 
                              : 'hover:bg-teal-50 hover:border-teal-300 text-slate-700 border-slate-200/60 bg-white shadow-sm hover:shadow-md'
                            }
                          `}
                        >
                          {convertTo12Hour(slot)}
                        </button>
                      );
                    })}
                  </div>

                  <div className="flex flex-wrap items-center gap-4 mt-6 pt-4 border-t border-slate-100">
                    <span className="text-xs font-medium text-slate-400">Legend:</span>
                    <span className="flex items-center gap-1.5 text-xs text-slate-600">
                      <span className="w-4 h-4 rounded-md bg-gradient-to-r from-teal-600 to-emerald-600" /> Selected
                    </span>
                    <span className="flex items-center gap-1.5 text-xs text-slate-600">
                      <span className="w-4 h-4 rounded-md bg-white border-2 border-slate-200" /> Available
                    </span>
                    <span className="flex items-center gap-1.5 text-xs text-slate-400">
                      <span className="w-4 h-4 rounded-md bg-slate-100 border-2 border-slate-100" /> Booked
                    </span>
                  </div>

                  <div className="flex justify-between items-center gap-4 mt-8">
                    <Button 
                      variant="ghost" 
                      onClick={() => setStep(1)} 
                      className="rounded-xl text-slate-600 hover:text-slate-900 hover:bg-slate-100"
                    >
                      <ArrowLeft className="w-4 h-4 mr-2" /> Back
                    </Button>
                    <Button
                      className="bg-gradient-to-r from-teal-600 to-emerald-600 hover:from-teal-700 hover:to-emerald-700 text-white rounded-xl px-8 font-semibold shadow-lg shadow-teal-600/20"
                      disabled={!selectedSlot}
                      onClick={() => setStep(3)}
                    >
                      Continue <ArrowRight className="w-4 h-4 ml-2" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}

          {/* Step 3: Session Details */}
          {step === 3 && (
            <motion.div
              key="step3"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              <Card className="border border-slate-200/60 shadow-xl shadow-slate-200/30 rounded-3xl overflow-hidden bg-white/80 backdrop-blur-sm">
                <CardContent className="p-6 sm:p-8 space-y-6">
                  <h2 className="font-bold text-slate-900 text-lg flex items-center gap-2">
                    <User className="w-5 h-5 text-teal-600" />
                    Session Details
                  </h2>

                  <div>
                    <Label className="text-slate-700 font-semibold mb-3 block">Session Type</Label>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {SESSION_TYPES.map(({ value, label, icon: Icon, desc, color }) => (
                        <button
                          key={value}
                          onClick={() => setSessionType(value)}
                          className={`
                            p-5 rounded-2xl border-2 text-left transition-all duration-300 relative overflow-hidden
                            ${sessionType === value 
                              ? `border-teal-500 bg-gradient-to-br ${color}/10 shadow-lg shadow-teal-500/10` 
                              : 'border-slate-200 bg-white hover:border-teal-200 hover:bg-slate-50/50'
                            }
                          `}
                        >
                          <div className={`p-2.5 rounded-xl inline-block ${sessionType === value ? `bg-gradient-to-br ${color} text-white` : 'bg-slate-100 text-slate-400'}`}>
                            <Icon className="w-5 h-5" />
                          </div>
                          <div className={`font-bold text-sm mt-2 ${sessionType === value ? 'text-slate-900' : 'text-slate-700'}`}>
                            {label}
                          </div>
                          <div className="text-xs text-slate-400 mt-0.5">{desc}</div>
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <Label className="text-slate-700 font-semibold mb-2 block">
                      Notes for your consultant
                      <span className="text-slate-400 font-normal text-xs ml-2">(optional)</span>
                    </Label>
                    <Textarea
                      placeholder="Share anything you'd like the consultant to know before your session..."
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      rows={4}
                      className="resize-none rounded-2xl border-slate-200 focus:border-teal-400 focus:ring-teal-400/20 p-4 shadow-sm bg-white/50"
                    />
                  </div>

                  <div className="flex justify-between items-center gap-4 pt-2">
                    <Button 
                      variant="ghost" 
                      onClick={() => setStep(2)} 
                      className="rounded-xl text-slate-600 hover:text-slate-900 hover:bg-slate-100"
                    >
                      <ArrowLeft className="w-4 h-4 mr-2" /> Back
                    </Button>
                    <Button
                      className="bg-gradient-to-r from-teal-600 to-emerald-600 hover:from-teal-700 hover:to-emerald-700 text-white rounded-xl px-8 font-semibold shadow-lg shadow-teal-600/20"
                      onClick={() => setStep(4)}
                    >
                      Review Summary <ArrowRight className="w-4 h-4 ml-2" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}

          {/* Step 4: Confirmation */}
          {step === 4 && (
            <motion.div
              key="step4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              <Card className="border border-slate-200/60 shadow-xl shadow-slate-200/30 rounded-3xl overflow-hidden bg-white/80 backdrop-blur-sm">
                <CardContent className="p-6 sm:p-8">
                  <h2 className="font-bold text-slate-900 text-lg flex items-center gap-2 mb-6">
                    <CheckCircle2 className="w-5 h-5 text-teal-600" />
                    Confirm Appointment
                  </h2>

                  <div className="bg-gradient-to-br from-slate-50 to-white border border-slate-200/60 rounded-2xl p-6 space-y-4 shadow-sm">
                    <div className="flex items-center gap-3 pb-3 border-b border-slate-200/60">
                      <div className="w-12 h-12 rounded-full bg-gradient-to-br from-teal-100 to-emerald-100 flex items-center justify-center text-teal-600 font-bold text-lg">
                        {consultant?.user?.full_name?.charAt(0)}
                      </div>
                      <div>
                        <p className="font-bold text-slate-900">{consultant?.user?.full_name}</p>
                        <p className="text-xs text-slate-500">{consultant?.specializations?.[0]?.name}</p>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3 text-sm">
                      <div>
                        <p className="text-slate-400 text-xs font-medium uppercase tracking-wider">Date</p>
                        <p className="font-semibold text-slate-800">{formatDate(selectedDate)}</p>
                      </div>
                      <div>
                        <p className="text-slate-400 text-xs font-medium uppercase tracking-wider">Time</p>
                        <p className="font-semibold text-slate-800">{convertTo12Hour(selectedSlot)}</p>
                      </div>
                      <div>
                        <p className="text-slate-400 text-xs font-medium uppercase tracking-wider">Session</p>
                        <Badge className="bg-teal-50 text-teal-700 border-teal-200 text-xs">
                          {sessionType === 'online' ? '💻 Online' : '📍 In-Person'}
                        </Badge>
                      </div>
                      <div>
                        <p className="text-slate-400 text-xs font-medium uppercase tracking-wider">Fee</p>
                        <p className="font-bold text-slate-900">৳{consultant?.consultation_fee}</p>
                      </div>
                    </div>

                    {message && (
                      <div className="pt-3 border-t border-slate-200/60">
                        <p className="text-slate-400 text-xs font-medium uppercase tracking-wider">Your Note</p>
                        <p className="text-sm text-slate-600 italic bg-white/60 p-3 rounded-xl border border-slate-100 mt-1">
                          {message}
                        </p>
                      </div>
                    )}
                  </div>

                  {error && (
                    <motion.p
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="text-sm font-semibold text-red-500 bg-red-50 border border-red-200 px-4 py-3 rounded-xl mt-4"
                    >
                      {error}
                    </motion.p>
                  )}

                  <div className="flex items-center gap-3 mt-4 p-3 bg-emerald-50/50 rounded-xl border border-emerald-200/60">
                    <Shield className="w-4 h-4 text-emerald-600 shrink-0" />
                    <p className="text-xs text-slate-600">
                      <span className="font-semibold text-slate-800">100% secure booking.</span> Your information is encrypted and private.
                    </p>
                  </div>

                  <div className="flex justify-between items-center gap-4 mt-6">
                    <Button 
                      variant="ghost" 
                      onClick={() => setStep(3)} 
                      className="rounded-xl text-slate-600 hover:text-slate-900 hover:bg-slate-100"
                    >
                      <ArrowLeft className="w-4 h-4 mr-2" /> Back
                    </Button>
                    <Button
                      className="bg-gradient-to-r from-teal-600 to-emerald-600 hover:from-teal-700 hover:to-emerald-700 text-white rounded-xl px-8 py-3 font-bold shadow-lg shadow-teal-600/20 transition-all"
                      onClick={handleSubmit}
                      disabled={submitting}
                    >
                      {submitting ? (
                        <span className="flex items-center gap-2">
                          <Loader2 className="w-4 h-4 animate-spin" />
                          Confirming...
                        </span>
                      ) : (
                        <>
                          <Sparkles className="w-4 h-4 mr-2" />
                          Confirm Booking
                        </>
                      )}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}