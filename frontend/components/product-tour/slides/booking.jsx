'use client';

import { Calendar, Clock, User, CheckCircle2, Video, MapPin } from 'lucide-react';
import { SlideBody, SlideHeader, Item, DemoBar, DemoLink } from './ui';
import { cn } from '@/lib/utils';

const flow = [
  { icon: Calendar, label: 'Select Date', desc: 'Pick from the monthly calendar' },
  { icon: Clock, label: 'Select Time', desc: 'Only open slots are shown' },
  { icon: User, label: 'Your Details', desc: 'Session type & message' },
  { icon: CheckCircle2, label: 'Confirm', desc: 'Instant confirmation' },
];

const sessions = [
  {
    icon: Video,
    label: 'Online Session',
    desc: 'Secure video consultation from anywhere',
    color: 'from-blue-500 to-indigo-600',
  },
  {
    icon: MapPin,
    label: 'In-Person Visit',
    desc: 'Face-to-face at the clinic',
    color: 'from-emerald-500 to-teal-600',
  },
];

export default function Booking({ slide }) {
  return (
    <SlideBody>
      <SlideHeader slide={slide} />

      {/* Stepper */}
      <Item className="mb-8">
        <div className="flex flex-wrap items-center gap-3 rounded-3xl border border-slate-200/70 bg-white/85 p-5 shadow-sm sm:flex-nowrap">
          {flow.map((step, i) => {
            const Icon = step.icon;
            return (
              <div key={step.label} className="flex w-full items-center gap-3 sm:w-auto sm:flex-1">
                <div
                  className={cn(
                    'flex h-10 w-10 shrink-0 items-center justify-center rounded-full border-2',
                    i === 0
                      ? 'scale-110 border-transparent bg-gradient-to-r from-teal-600 to-emerald-600 text-white shadow-lg shadow-teal-600/25'
                      : 'border-slate-200 bg-white text-slate-400'
                  )}
                >
                  <Icon className="h-4 w-4" />
                </div>
                <div className="min-w-0">
                  <p className={cn('text-sm font-bold', i === 0 ? 'text-teal-700' : 'text-slate-600')}>
                    {step.label}
                  </p>
                  <p className="hidden text-[11px] text-slate-400 md:block">{step.desc}</p>
                </div>
                {i < flow.length - 1 && <span className="ml-2 h-px flex-1 bg-slate-200 min-w-3" />}
              </div>
            );
          })}
        </div>
      </Item>

      <div className="grid gap-6 md:grid-cols-3">
        <Item className="md:col-span-2">
          <div className="grid h-full gap-4 sm:grid-cols-3">
            {sessions.map((s) => (
              <div
                key={s.label}
                className={cn(
                  'flex h-full flex-col justify-center rounded-2xl border border-slate-200/70 bg-white/85 p-5 shadow-sm transition-colors',
                  s.label === 'Online Session' && 'border-blue-200 ring-1 ring-blue-100'
                )}
              >
                <span className={cn('mb-3 inline-flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br text-white', s.color)}>
                  <s.icon className="h-5 w-5" />
                </span>
                <p className="text-sm font-bold text-slate-900">{s.label}</p>
                <p className="mt-1 text-xs leading-relaxed text-slate-500">{s.desc}</p>
              </div>
            ))}
            <div className="flex h-full flex-col justify-center rounded-2xl border border-dashed border-teal-300 bg-teal-50/40 p-5">
              <CheckCircle2 className="mb-3 h-9 w-9 text-teal-600" />
              <p className="text-sm font-bold text-slate-900">Booking Confirmed</p>
              <p className="mt-1 text-xs leading-relaxed text-slate-500">
                Date, time and session type are locked in and visible to both client and consultant.
              </p>
            </div>
          </div>
        </Item>

        <Item className="md:col-span-1">
          <div className="flex h-full flex-col justify-center rounded-3xl border border-teal-200/60 bg-gradient-to-b from-teal-50/70 to-white p-6">
            <h3 className="text-base font-bold text-slate-900">Why booking feels instant</h3>
            <ul className="mt-3 space-y-2.5 text-sm leading-relaxed text-stone-600">
              <li>Real-time slot availability — no more guessing or calling around.</li>
              <li>A single guided flow with no back-and-forth.</li>
              <li>Online and in-person options in one place.</li>
              <li>Confirmation is stored and available in the dashboard.</li>
            </ul>
          </div>
        </Item>
      </div>

      <DemoBar>
        <DemoLink href="/consultant" label="Try Booking Live" icon={Calendar} />
        <DemoLink href="/booking" label="View My Bookings" variant="ghost" icon={CheckCircle2} />
      </DemoBar>
    </SlideBody>
  );
}