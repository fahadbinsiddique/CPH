'use client';

import { Phone, MessageSquare, CalendarX2, CalendarCheck2, ArrowRight, Sparkles, AlertTriangle } from 'lucide-react';
import { SlideBody, SlideHeader, Item, SectionCaption, StepFlow } from './ui';

const traditional = [
  { icon: Phone, label: 'Discovery' },
  { icon: MessageSquare, label: 'Phone / Message' },
  { icon: CalendarX2, label: 'Availability Check' },
  { icon: AlertTriangle, label: 'Manual Coordination' },
  { icon: CalendarCheck2, label: 'Confirmation' },
];

const cph = [
  { icon: Sparkles, label: 'Discover' },
  { icon: Sparkles, label: 'Assess' },
  { icon: Sparkles, label: 'Choose Consultant' },
  { icon: CalendarCheck2, label: 'Book' },
  { icon: Sparkles, label: 'Manage' },
  { icon: Sparkles, label: 'Stay Connected' },
];

export default function Problem({ slide }) {
  return (
    <SlideBody>
      <SlideHeader slide={slide} />

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-3xl border border-slate-200/70 bg-white/70 p-6 shadow-sm">
          <SectionCaption className="mb-4 text-amber-600">The Traditional Way</SectionCaption>
          <p className="mb-5 max-w-md text-sm leading-relaxed text-stone-500">
            Finding and booking a session often means phone calls, waiting for callbacks and
            coordinating schedules by hand.
          </p>
          <StepFlow steps={traditional} accent="amber" />
          <Item className="mt-5">
            <p className="rounded-2xl border border-amber-200/70 bg-amber-50/70 px-4 py-3 text-sm text-amber-800">
              Friction at every step — slow, scattered and hard to manage.
            </p>
          </Item>
        </div>

        <div className="rounded-3xl border border-teal-200/60 bg-gradient-to-b from-teal-50/60 to-white p-6 shadow-sm">
          <SectionCaption className="mb-4 text-teal-700">The CPH Way</SectionCaption>
          <p className="mb-5 max-w-md text-sm leading-relaxed text-stone-500">
            A single guided journey that replaces back-and-forth with a clear, digital flow.
          </p>
          <StepFlow steps={cph} accent="teal" />
          <Item className="mt-5">
            <p className="rounded-2xl border border-teal-200/70 bg-teal-50/80 px-4 py-3 text-sm text-teal-800">
              Discover, assess, choose, book and manage — all in one connected platform.
            </p>
          </Item>
        </div>
      </div>

      <Item className="mt-8">
        <div className="flex flex-wrap items-center justify-center gap-2 text-sm text-slate-500">
          <span className="font-semibold text-slate-700">The outcome:</span>
          <span>less coordination, fewer missed connections and clearer communication.</span>
          <ArrowRight className="h-4 w-4 text-teal-500" />
        </div>
      </Item>
    </SlideBody>
  );
}