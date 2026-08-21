'use client';

import { FlaskConical, CheckCircle2, Wrench, RefreshCcw } from 'lucide-react';
import { SlideBody, SlideHeader, Item } from './ui';

const items = [
  {
    icon: FlaskConical,
    accent: 'indigo',
    title: 'Automated Backend Tests',
    desc: 'A dedicated test suite protects the authentication and consultant onboarding flows.',
  },
  {
    icon: CheckCircle2,
    accent: 'emerald',
    title: 'Auth Invariance Checks',
    desc: 'Tests verify sign-in invariants, including Google sign-in configuration parity, so the flow can never silently break.',
  },
  {
    icon: Wrench,
    accent: 'amber',
    title: 'Static Checks',
    desc: 'The frontend runs linting as part of its standard workflow.',
  },
  {
    icon: RefreshCcw,
    accent: 'sky',
    title: 'Resilience by Design',
    desc: 'Offline queuing and connection awareness make the platform dependable in the real world.',
  },
];

export default function Testing({ slide }) {
  return (
    <SlideBody>
      <SlideHeader slide={slide} />
      <div className="grid gap-5 md:grid-cols-2">
        {items.map((i) => {
          const Icon = i.icon;
          return (
            <Item key={i.title}>
              <div className="flex h-full flex-col rounded-3xl border border-slate-200/70 bg-white/85 p-6 shadow-sm">
                <span className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-slate-100 to-white text-slate-700 ring-1 ring-slate-200/70">
                  <Icon className="h-6 w-6" />
                </span>
                <p className="text-base font-bold text-slate-900">{i.title}</p>
                <p className="mt-2 text-sm leading-relaxed text-stone-500">{i.desc}</p>
              </div>
            </Item>
          );
        })}
      </div>
      <Item className="mt-6">
        <div className="mx-auto max-w-3xl rounded-2xl border border-slate-200/70 bg-white/85 p-4">
          <p className="text-sm leading-relaxed text-stone-600">
            Quality is an ongoing practice, not a one-time exercise — the most business-critical
            journeys are continuously protected.
          </p>
        </div>
      </Item>
    </SlideBody>
  );
}