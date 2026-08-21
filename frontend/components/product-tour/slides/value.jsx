'use client';

import { Sparkles, HeartHandshake, ShieldCheck } from 'lucide-react';
import { SlideBody, SlideHeader, Item } from './ui';

const columns = [
  {
    icon: HeartHandshake,
    accent: 'emerald',
    title: 'CLIENT',
    benefits: [
      { label: 'Convenience', desc: 'Book anytime, from any device — no phone tag.' },
      { label: 'Access', desc: 'Discover and compare professionals with confidence.' },
      { label: 'Organization', desc: 'Assessments, bookings and history in one place.' },
    ],
  },
  {
    icon: Sparkles,
    accent: 'indigo',
    title: 'CONSULTANT',
    benefits: [
      { label: 'Profile Management', desc: 'A professional presence that works for them.' },
      { label: 'Availability', desc: 'Control of their own schedule, self-service.' },
      { label: 'Appointment Management', desc: 'A clean calendar of sessions and patients.' },
    ],
  },
  {
    icon: ShieldCheck,
    accent: 'purple',
    title: 'ADMIN',
    benefits: [
      { label: 'Centralized Management', desc: 'Users, consultants and content in one place.' },
      { label: 'Visibility', desc: 'Real insight into activity and outcomes.' },
      { label: 'Content & User Control', desc: 'Publish content and manage access with confidence.' },
    ],
  },
];

export default function Value({ slide }) {
  return (
    <SlideBody>
      <SlideHeader slide={slide} />
      <div className="grid gap-5 md:grid-cols-3">
        {columns.map((c) => {
          const Icon = c.icon;
          return (
            <Item key={c.title}>
              <div className="flex h-full flex-col rounded-3xl border border-slate-200/70 bg-white/85 p-6 shadow-sm">
                <div className="mb-5 flex items-center gap-3">
                  <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-teal-100 to-emerald-100 text-teal-700">
                    <Icon className="h-5 w-5" />
                  </span>
                  <p className="text-sm font-extrabold tracking-wide text-slate-900">{c.title}</p>
                </div>
                <div className="space-y-4">
                  {c.benefits.map((b) => (
                    <div key={b.label}>
                      <p className="text-sm font-bold text-teal-700">{b.label}</p>
                      <p className="mt-0.5 text-sm leading-relaxed text-stone-500">{b.desc}</p>
                    </div>
                  ))}
                </div>
              </div>
            </Item>
          );
        })}
      </div>
    </SlideBody>
  );
}