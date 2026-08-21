'use client';

import { Bell, Mail, Smartphone, BadgeCheck, Info } from 'lucide-react';
import { SlideBody, SlideHeader, Item, DemoBar } from './ui';

const channels = [
  {
    icon: Bell,
    accent: 'rose',
    title: 'In-App Status',
    desc: 'Appointment status and key updates are visible inside the dashboard, keeping people informed at a glance.',
  },
  {
    icon: Mail,
    accent: 'indigo',
    title: 'Email Notifications',
    desc: 'Transactional email keeps clients and consultants aware of important platform events.',
  },
  {
    icon: Smartphone,
    accent: 'emerald',
    title: 'Browser Push',
    desc: 'Optional push notifications can reach users on desktop and mobile with gentle, actionable messages.',
  },
];

export default function Notifications({ slide }) {
  return (
    <SlideBody>
      <SlideHeader slide={slide} />
      <div className="grid gap-5 md:grid-cols-3">
        {channels.map((c) => {
          const Icon = c.icon;
          return (
            <Item key={c.title}>
              <div className="flex h-full flex-col rounded-3xl border border-slate-200/70 bg-white/85 p-6 shadow-sm transition-shadow hover:shadow-card">
                <span className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-50 text-slate-700 ring-1 ring-slate-200/70">
                  <Icon className="h-6 w-6" />
                </span>
                <p className="text-base font-bold text-slate-900">{c.title}</p>
                <p className="mt-2 text-sm leading-relaxed text-stone-500">{c.desc}</p>
              </div>
            </Item>
          );
        })}
      </div>

      <Item className="mt-6">
        <div className="rounded-2xl border border-slate-200/70 bg-white/85 p-4">
          <div className="flex items-start gap-3">
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-teal-100">
              <BadgeCheck className="h-5 w-5 text-teal-700" />
            </span>
            <div>
              <p className="text-sm font-bold text-slate-900">Example: a new booking request</p>
              <p className="mt-0.5 text-xs leading-relaxed text-slate-500">
                A client books a session → the consultant is alerted to review it → the client sees
                the confirmation appear in their dashboard. Everyone stays in the loop.
              </p>
            </div>
          </div>
        </div>
      </Item>

      <DemoBar>
        <span className="inline-flex items-center gap-1.5 text-xs font-medium text-slate-400">
          <Info className="h-3.5 w-3.5" /> Notifications are optional and respect user preferences.
        </span>
      </DemoBar>
    </SlideBody>
  );
}