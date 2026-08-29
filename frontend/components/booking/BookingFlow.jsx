'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { AnimatePresence, motion } from 'framer-motion';
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  ChevronLeft,
  Loader2,
  Sparkles,
  WifiOff,
  X,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { appointmentService } from '@/services/appointmentService';
import BookingStepper from './BookingStepper';
import StepDate from './steps/StepDate';
import StepTime from './steps/StepTime';
import StepDetails from './steps/StepDetails';
import StepConfirm from './steps/StepConfirm';
import { convertTo12Hour, formatDate } from './helpers';

const stepVariants = {
  enter: (dir) => ({ opacity: 0, x: dir * 40 }),
  center: { opacity: 1, x: 0 },
  exit: (dir) => ({ opacity: 0, x: dir * -40 }),
};

/**
 * Core booking flow. Renders the consultant header, animated stepper, the four
 * step bodies and a sticky navigation footer. Used both inside BookingModal
 * and on the standalone /booking/[slug] page so the two surfaces never drift.
 *
 * Props:
 * - consultant: full consultant object (id, user, specializations, ...)
 * - onClose: when provided, the flow renders an X close button and calls it on
 *   dismissal / post-booking navigation (used by the modal).
 * - onSubmittingChange: optional callback so a parent can block dismissal while
 *   the request is in flight.
 */
export default function BookingFlow({ consultant, onClose, onSubmittingChange }) {
  const router = useRouter();

  const [step, setStep] = useState(1);
  const [direction, setDirection] = useState(1);
  const [currentMonth, setCurrentMonth] = useState(() => new Date());
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedSlot, setSelectedSlot] = useState('');
  const [sessionType, setSessionType] = useState('online');
  const [message, setMessage] = useState('');
  const [bookedSlots, setBookedSlots] = useState([]);
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [queued, setQueued] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    onSubmittingChange?.(submitting);
  }, [submitting, onSubmittingChange]);

  useEffect(() => {
    if (!selectedDate || !consultant?.id) return;
    let active = true;
    appointmentService
      .getBookedSlots(consultant.id, formatDate(selectedDate))
      .then((res) => {
        if (active) setBookedSlots(res.data.booked_slots || []);
      })
      .catch(() => {
        if (active) setBookedSlots([]);
      });
    return () => {
      active = false;
    };
  }, [selectedDate, consultant]);

  const goTo = (next) => {
    setDirection(next > step ? 1 : -1);
    setStep(next);
    setError('');
  };

  const handleDateSelect = (day) => {
    setSelectedDate(new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day));
    setSelectedSlot('');
    goTo(2);
  };

  const handleSubmit = async () => {
    setSubmitting(true);
    setError('');
    try {
      const res = await appointmentService.create({
        consultant: consultant.id,
        appointment_date: formatDate(selectedDate),
        appointment_time: selectedSlot,
        session_type: sessionType,
        client_message: message,
      });
      if (res.queued) {
        setQueued(true);
        return;
      }
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

  const go = (path) => {
    if (onClose) onClose();
    router.push(path);
  };

  const canContinue = step === 2 ? !!selectedSlot : true;

  if (success) {
    return (
      <SuccessState
        consultant={consultant}
        selectedDate={selectedDate}
        selectedSlot={selectedSlot}
        sessionType={sessionType}
        onViewBookings={() => go('/dashboard/bookings')}
        onBrowseMore={() => go('/consultant')}
      />
    );
  }

  if (queued) {
    return (
      <QueuedState
        consultant={consultant}
        onViewBookings={() => go('/dashboard/bookings')}
        onBrowseMore={() => go('/consultant')}
      />
    );
  }

  return (
    <div className="flex min-h-0 flex-1 flex-col">
      {/* Consultant header */}
      <div className="relative shrink-0 border-b border-slate-100 px-5 pb-4 pt-5 sm:px-6 sm:pt-6">
        <div className="flex items-center gap-3">
          {!onClose && (
            <button
              type="button"
              aria-label="Go back"
              onClick={() => router.back()}
              className="shrink-0 cursor-pointer rounded-xl border border-slate-200/80 bg-white p-2 text-slate-500 shadow-sm transition-colors hover:bg-slate-50 hover:text-slate-800"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
          )}
          <div className="flex min-w-0 flex-1 items-center gap-3">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-teal-100 to-emerald-100 text-base font-bold text-teal-700">
              {consultant?.user?.full_name?.charAt(0)}
            </div>
            <div className="min-w-0">
              <p className="truncate text-base font-bold text-slate-900">
                {consultant?.user?.full_name}
              </p>
              <p className="truncate text-xs font-medium text-slate-500">
                {consultant?.specializations?.[0]?.name || 'Mental Health Professional'}
                <span className="text-slate-300"> · </span>
                <span className="text-teal-600">৳{consultant?.consultation_fee}/session</span>
              </p>
            </div>
          </div>
          {onClose && (
            <button
              type="button"
              aria-label="Close booking"
              onClick={onClose}
              className="flex h-8 w-8 shrink-0 cursor-pointer items-center justify-center rounded-full text-slate-400 transition-all hover:bg-slate-100 hover:text-slate-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-500/40"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>
      </div>

      {/* Stepper */}
      <div className="shrink-0 border-b border-slate-100 px-5 py-4 sm:px-6">
        <BookingStepper step={step} />
      </div>

      {/* Step body */}
      <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain px-5 py-5 sm:px-6">
        <AnimatePresence mode="wait" custom={direction} initial={false}>
          <motion.div
            key={step}
            custom={direction}
            variants={stepVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: 0.26, ease: 'easeOut' }}
          >
            {step === 1 && (
              <StepDate
                currentMonth={currentMonth}
                onMonthChange={(delta) =>
                  setCurrentMonth((m) => new Date(m.getFullYear(), m.getMonth() + delta))
                }
                selectedDate={selectedDate}
                onSelect={handleDateSelect}
              />
            )}
            {step === 2 && (
              <StepTime
                selectedDate={selectedDate}
                bookedSlots={bookedSlots}
                selectedSlot={selectedSlot}
                onSelect={setSelectedSlot}
              />
            )}
            {step === 3 && (
              <StepDetails
                sessionType={sessionType}
                onSessionTypeChange={setSessionType}
                message={message}
                onMessageChange={setMessage}
              />
            )}
            {step === 4 && (
              <StepConfirm
                consultant={consultant}
                selectedDate={selectedDate}
                selectedSlot={selectedSlot}
                sessionType={sessionType}
                message={message}
              />
            )}
          </motion.div>
        </AnimatePresence>

        {error && step === 4 && (
          <motion.p
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-semibold text-red-500"
          >
            {error}
          </motion.p>
        )}
      </div>

      {/* Navigation footer */}
      <div className="flex shrink-0 items-center justify-between gap-3 border-t border-slate-100 bg-slate-50/60 px-5 py-4 sm:px-6">
        {step > 1 ? (
          <Button
            variant="ghost"
            onClick={() => goTo(step - 1)}
            className="rounded-xl px-4 text-sm font-semibold text-slate-600 hover:bg-slate-100 hover:text-slate-900"
          >
            <ArrowLeft className="h-4 w-4" />
            Back
          </Button>
        ) : (
          <span />
        )}

        {step < 4 ? (
          <Button
            disabled={!canContinue}
            onClick={() => goTo(step + 1)}
            className="rounded-xl bg-gradient-to-r from-teal-600 to-emerald-600 px-6 text-sm font-semibold text-white shadow-lg shadow-teal-600/20 transition-all hover:from-teal-700 hover:to-emerald-700 disabled:opacity-40 disabled:shadow-none"
          >
            Continue
            <ArrowRight className="h-4 w-4" />
          </Button>
        ) : (
          <Button
            onClick={handleSubmit}
            disabled={submitting}
            className="rounded-xl bg-gradient-to-r from-teal-600 to-emerald-600 px-6 text-sm font-bold text-white shadow-lg shadow-teal-600/20 transition-all hover:from-teal-700 hover:to-emerald-700"
          >
            {submitting ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Confirming...
              </>
            ) : (
              <>
                <Sparkles className="h-4 w-4" />
                Confirm Booking
              </>
            )}
          </Button>
        )}
      </div>
    </div>
  );
}

function SuccessState({
  consultant,
  selectedDate,
  selectedSlot,
  sessionType,
  onViewBookings,
  onBrowseMore,
}) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.96, y: 12 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ duration: 0.4, ease: 'easeOut' }}
      className="flex flex-col items-center px-2 py-8 text-center sm:py-10"
    >
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: 'spring', stiffness: 220, damping: 16, delay: 0.1 }}
        className="flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-emerald-400 to-teal-500 shadow-lg shadow-emerald-500/25"
      >
        <CheckCircle2 className="h-10 w-10 text-white" />
      </motion.div>
      <h3 className="mt-5 text-2xl font-bold text-slate-900">Booking Confirmed!</h3>
      <p className="mt-1.5 max-w-sm text-sm text-slate-500">
        Your appointment with{' '}
        <span className="font-semibold text-teal-600">{consultant?.user?.full_name}</span> is
        successfully scheduled.
      </p>

      <div className="mt-6 w-full max-w-sm space-y-2 rounded-2xl border border-slate-200/70 bg-slate-50/70 p-5 text-left">
        <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">
          Appointment Details
        </p>
        <div className="flex justify-between text-sm">
          <span className="text-slate-500">Date</span>
          <span className="font-semibold text-slate-800">{formatDate(selectedDate)}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-slate-500">Time</span>
          <span className="font-semibold text-slate-800">{convertTo12Hour(selectedSlot)}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-slate-500">Session</span>
          <span className="font-semibold text-slate-800">
            {sessionType === 'online' ? 'Online' : 'In-Person'}
          </span>
        </div>
      </div>

      <div className="mt-6 flex w-full max-w-sm flex-col gap-2.5">
        <Button
          onClick={onViewBookings}
          className="w-full rounded-xl bg-gradient-to-r from-teal-600 to-emerald-600 text-white shadow-lg shadow-teal-600/20 transition-all hover:from-teal-700 hover:to-emerald-700"
        >
          View My Bookings
        </Button>
        <Button
          variant="outline"
          onClick={onBrowseMore}
          className="w-full rounded-xl border-slate-200 text-slate-600 hover:bg-slate-50 hover:text-slate-900"
        >
          Browse More Consultants
        </Button>
      </div>
    </motion.div>
  );
}

function QueuedState({ consultant, onViewBookings, onBrowseMore }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.96, y: 12 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ duration: 0.4, ease: 'easeOut' }}
      className="flex flex-col items-center px-2 py-8 text-center sm:py-10"
    >
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: 'spring', stiffness: 220, damping: 16, delay: 0.1 }}
        className="flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-amber-400 to-orange-500 shadow-lg shadow-amber-500/25"
      >
        <WifiOff className="h-10 w-10 text-white" />
      </motion.div>
      <h3 className="mt-5 text-2xl font-bold text-slate-900">Saved Offline</h3>
      <p className="mt-1.5 max-w-sm text-sm text-slate-500">
        You&apos;re currently offline. Your booking request with{' '}
        <span className="font-semibold text-teal-600">{consultant?.user?.full_name}</span> has been
        saved and will be submitted automatically when you&apos;re back online.
      </p>

      <div className="mt-6 flex w-full max-w-sm flex-col gap-2.5">
        <Button
          onClick={onViewBookings}
          className="w-full rounded-xl bg-gradient-to-r from-teal-600 to-emerald-600 text-white shadow-lg shadow-teal-600/20 transition-all hover:from-teal-700 hover:to-emerald-700"
        >
          View My Bookings
        </Button>
        <Button
          variant="outline"
          onClick={onBrowseMore}
          className="w-full rounded-xl border-slate-200 text-slate-600 hover:bg-slate-50 hover:text-slate-900"
        >
          Browse More Consultants
        </Button>
      </div>
    </motion.div>
  );
}
