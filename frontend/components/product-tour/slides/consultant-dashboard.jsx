'use client';

import { CalendarCheck2, Clock, Users, LayoutDashboard, NotebookPen } from 'lucide-react';
import { SlideBody, SlideHeader, Item, FeatureCard, DemoBar, DemoLink } from './ui';

const modules = [
  {
    icon: LayoutDashboard,
    accent: 'teal',
    title: 'Overview',
    desc: 'A snapshot of upcoming and past sessions at a glance.',
  },
  {
    icon: CalendarCheck2,
    accent: 'indigo',
    title: 'Appointments',
    desc: 'Confirm, decline and track every session request.',
  },
  {
    icon: Clock,
    accent: 'amber',
    title: 'Availability',
    desc: 'Define weekly windows when clients can book.',
  },
  {
    icon: Users,
    accent: 'rose',
    title: 'My Patients',
    desc: 'See the clients they work with, grouped together.',
  },
];

export default function ConsultantDashboard({ slide }) {
  return (
    <SlideBody>
      <SlideHeader slide={slide} />
      <div className="grid gap-5 sm:grid-cols-2">
        {modules.map((m, i) => (
          <FeatureCard key={m.title} icon={m.icon} accent={m.accent} title={m.title} desc={m.desc} index={i + 1} className="h-full" />
        ))}
      </div>
      <Item className="mt-6">
        <div className="mx-auto flex max-w-2xl items-start gap-3 rounded-2xl border border-slate-200/70 bg-white/85 p-5 shadow-sm">
          <NotebookPen className="mt-0.5 h-5 w-5 shrink-0 text-teal-600" />
          <p className="text-sm leading-relaxed text-stone-600">
            The consultant workspace removes the administrative weight of running a practice —
            scheduling, availability and patient context in one calm dashboard.
          </p>
        </div>
      </Item>
      <DemoBar>
        <DemoLink href="/dashboard" label="Open the Workspace" icon={LayoutDashboard} />
      </DemoBar>
    </SlideBody>
  );
}