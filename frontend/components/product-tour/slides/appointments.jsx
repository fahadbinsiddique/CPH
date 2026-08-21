'use client';

import { Clock, CheckCircle2, Check, X } from 'lucide-react';
import { SlideBody, SlideHeader, Item, FeatureCard, DemoBar, DemoLink } from './ui';

const statuses = [
  { icon: Clock, label: 'Pending', desc: 'Awaiting approval', color: 'text-amber-700', bg: 'bg-amber-50' },
  { icon: Check, label: 'Confirmed', desc: 'Session is locked in', color: 'text-emerald-700', bg: 'bg-emerald-50' },
  { icon: CheckCircle2, label: 'Completed', desc: 'Session finished', color: 'text-blue-700', bg: 'bg-blue-50' },
  { icon: X, label: 'Cancelled', desc: 'Not going ahead', color: 'text-slate-600', bg: 'bg-slate-100' },
];

const roles = [
  {
    title: 'Client view',
    points: ['See upcoming and past sessions', 'Cancel a pending booking', 'Review appointment details'],
  },
  {
    title: 'Consultant view',
    points: ['Manage incoming requests', 'Confirm or decline sessions', 'Add working notes'],
  },
  {
    title: 'Admin view',
    points: ['Oversee the full appointment board', 'Filter by status', 'Stay on top of the schedule'],
  },
];

export default function Appointments({ slide }) {
  return (
    <SlideBody>
      <SlideHeader slide={slide} />
      <Item className="mb-8">
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          {statuses.map((s) => {
            const Icon = s.icon;
            return (
              <div key={s.label} className={`flex flex-col items-center gap-1.5 rounded-2xl border border-slate-200/70 ${s.bg} px-3 py-4 text-center shadow-sm`}>
                <Icon className={`h-5 w-5 ${s.color}`} />
                <p className={`text-sm font-bold ${s.color}`}>{s.label}</p>
                <p className="text-[11px] text-slate-500">{s.desc}</p>
              </div>
            );
          })}
        </div>
      </Item>

      <div className="grid gap-5 md:grid-cols-3">
        {roles.map((r, i) => (
          <FeatureCard key={r.title} icon={Clock} accent="indigo" index={i + 1} className="h-full">
            <h3 className="text-base font-bold text-slate-900">{r.title}</h3>
            <ul className="mt-3 space-y-2">
              {r.points.map((pt) => (
                <li key={pt} className="flex items-start gap-2 text-sm leading-relaxed text-stone-500">
                  <Check className="mt-1 h-3.5 w-3.5 shrink-0 text-teal-500" />
                  {pt}
                </li>
              ))}
            </ul>
          </FeatureCard>
        ))}
      </div>

      <DemoBar>
        <DemoLink href="/dashboard/bookings" label="Open My Appointments" icon={CheckCircle2} />
        <DemoLink href="/dashboard/appointments" label="Consultant / Admin View" variant="outline" icon={Clock} />
      </DemoBar>
    </SlideBody>
  );
}