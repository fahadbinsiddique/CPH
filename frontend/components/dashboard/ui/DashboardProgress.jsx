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
        <div className="h-1.5 overflow-hidden rounded-full bg-muted">
          <motion.div
            className="h-full rounded-full bg-gradient-to-r from-primary to-accent"
            initial={{ width: '0%' }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.4, ease: 'easeOut' }}
          />
        </div>

        {/* Percentage */}
        <span className="absolute -top-6 right-0 font-heading text-xs font-semibold tabular-nums text-foreground">
          {Math.round(progress)}%
        </span>
      </div>

      {/* Active Step */}
      <div className="flex items-center gap-2.5">
        <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-primary text-on-primary shadow-md shadow-primary/20">
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
              className="truncate font-heading text-sm font-semibold text-foreground"
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
              className="truncate text-xs text-muted-foreground"
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
                className={`flex h-5 w-5 items-center justify-center rounded-full transition-all duration-200 ${
                  isCompleted
                    ? 'bg-accent/10 text-accent-soft-foreground'
                    : isActive
                      ? 'bg-primary/10 text-foreground ring-2 ring-primary/30'
                      : 'bg-muted text-muted-foreground/70'
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
                    ? 'text-accent-soft-foreground'
                    : isActive
                      ? 'text-foreground'
                      : 'text-muted-foreground'
                }`}
              >
                {s.label}
              </span>
              {i < STEPS.length - 1 && (
                <div
                  className={`ml-1 h-px w-3 transition-colors duration-200 sm:w-6 ${
                    isCompleted ? 'bg-accent/40' : 'bg-border'
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
