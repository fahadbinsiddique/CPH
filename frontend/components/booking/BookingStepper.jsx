'use client';

import { Fragment } from 'react';
import { CheckCircle2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { BOOKING_STEPS } from './helpers';

export default function BookingStepper({ step }) {
  return (
    <div className="flex items-center">
      {BOOKING_STEPS.map((s, i) => {
        const isActive = step === s.id;
        const isCompleted = step > s.id;
        const Icon = s.icon;
        return (
          <Fragment key={s.id}>
            <div className="flex shrink-0 items-center gap-2">
              <div
                className={cn(
                  'flex h-9 w-9 items-center justify-center rounded-full border-2 transition-all duration-300',
                  isActive &&
                    'scale-110 border-transparent bg-gradient-to-r from-teal-600 to-emerald-600 text-white shadow-lg shadow-teal-600/25',
                  isCompleted && 'border-emerald-200 bg-emerald-100 text-emerald-600',
                  !isActive && !isCompleted && 'border-slate-200 bg-white text-slate-400'
                )}
              >
                {isCompleted ? (
                  <CheckCircle2 className="h-4 w-4" />
                ) : (
                  <Icon className="h-4 w-4" />
                )}
              </div>
              <span
                className={cn(
                  'hidden text-xs font-semibold md:block',
                  isActive ? 'text-teal-700' : isCompleted ? 'text-emerald-600' : 'text-slate-400'
                )}
              >
                {s.label}
              </span>
            </div>
            {i < BOOKING_STEPS.length - 1 && (
              <div className="mx-2 h-1 flex-1 overflow-hidden rounded-full bg-slate-100 sm:mx-3">
                <div
                  className={cn(
                    'h-full rounded-full bg-gradient-to-r from-teal-500 to-emerald-500 transition-all duration-500',
                    isCompleted ? 'w-full' : 'w-0'
                  )}
                />
              </div>
            )}
          </Fragment>
        );
      })}
    </div>
  );
}
