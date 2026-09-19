'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Shield, BarChart3, CalendarDays, Sparkles, CheckCircle2 } from 'lucide-react';
import useAuthStore from '@/store/authStore';

const STEPS = [
  { label: 'Authenticating session', subtext: 'Verifying credentials', icon: Shield, milestone: 25 },
  { label: 'Fetching dashboard metrics', subtext: 'Loading stats & analytics', icon: BarChart3, milestone: 50 },
  { label: 'Loading appointments', subtext: 'Retrieving your schedule', icon: CalendarDays, milestone: 75 },
  { label: 'Preparing workspace', subtext: 'Almost ready', icon: Sparkles, milestone: 90 },
];

function getStepIndex(progress) {
  const idx = STEPS.findIndex((s) => progress < s.milestone);
  return idx === -1 ? STEPS.length - 1 : idx;
}

export default function DashboardProgress() {
  const [progress, setProgress] = useState(0);
  const resolvedRef = useRef(new Set());

  useEffect(() => {
    const checkMilestones = (state) => {
      const updates = [];

      // Milestone 1: Zustand hydrated
      if (state.isHydrated && !resolvedRef.current.has('hydrated')) {
        resolvedRef.current.add('hydrated');
        updates.push(25);
      }

      // Milestone 2: User in store (server-verified or localStorage-restored)
      if (state.isAuthenticated && state.user && !resolvedRef.current.has('user')) {
        resolvedRef.current.add('user');
        updates.push(90);
      }

      if (updates.length > 0) {
        setProgress((prev) => Math.max(prev, ...updates));
      }
    };

    // Check immediately on mount
    checkMilestones(useAuthStore.getState());

    const unsubscribe = useAuthStore.subscribe(checkMilestones);
    return unsubscribe;
  }, []);

  const stepIndex = getStepIndex(progress);
  const step = STEPS[stepIndex];
  const StepIcon = step.icon;

  return (
    <div
      role="progressbar"
      aria-valuenow={Math.round(progress)}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-label="Loading dashboard"
      className="mb-6 space-y-4"
    >
      {/* Track + Fill */}
      <div className="relative">
        <div className="h-1.5 overflow-hidden rounded-full bg-stone-100">
          <motion.div
            className="h-full rounded-full bg-gradient-to-r from-teal-500 via-emerald-500 to-teal-500"
            initial={{ width: '0%' }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.4, ease: 'easeOut' }}
          />
        </div>

        {/* Percentage */}
        <span className="absolute -top-6 right-0 font-heading text-xs font-bold tabular-nums text-teal-700">
          {Math.round(progress)}%
        </span>
      </div>

      {/* Active Step */}
      <div className="flex items-center gap-2.5">
        <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-teal-500 to-emerald-500 text-white shadow-md shadow-teal-500/20">
          <StepIcon className="h-3.5 w-3.5" />
        </div>
        <div className="min-w-0">
          <AnimatePresence mode="wait">
            <motion.p
              key={stepIndex}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.25 }}
              className="truncate font-heading text-sm font-semibold text-stone-700"
            >
              {step.label}
            </motion.p>
          </AnimatePresence>
          <AnimatePresence mode="wait">
            <motion.p
              key={`sub-${stepIndex}`}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2, delay: 0.05 }}
              className="truncate text-xs text-stone-400"
            >
              {step.subtext}
            </motion.p>
          </AnimatePresence>
        </div>
      </div>

      {/* Step Indicators */}
      <div className="flex items-center gap-2">
        {STEPS.map((s, i) => {
          const isCompleted = progress >= s.milestone;
          const isActive = i === stepIndex && !isCompleted;
          const Icon = s.icon;
          return (
            <div key={s.label} className="flex items-center gap-1.5">
              <div
                className={`flex h-5 w-5 items-center justify-center rounded-full transition-all duration-300 ${
                  isCompleted
                    ? 'bg-emerald-100 text-emerald-600'
                    : isActive
                      ? 'bg-teal-100 text-teal-600 ring-2 ring-teal-400/30'
                      : 'bg-stone-100 text-stone-300'
                }`}
              >
                {isCompleted ? (
                  <CheckCircle2 className="h-3 w-3" />
                ) : (
                  <Icon className="h-3 w-3" />
                )}
              </div>
              <span
                className={`hidden text-[11px] font-medium sm:inline ${
                  isCompleted
                    ? 'text-emerald-600'
                    : isActive
                      ? 'text-teal-700'
                      : 'text-stone-300'
                }`}
              >
                {s.label}
              </span>
              {i < STEPS.length - 1 && (
                <div
                  className={`ml-1 h-px w-3 transition-colors duration-300 sm:w-6 ${
                    isCompleted ? 'bg-emerald-300' : 'bg-stone-200'
                  }`}
                />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
