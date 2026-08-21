'use client';

import { CreditCard, Video, Lightbulb, BellRing, Smartphone, Building2 } from 'lucide-react';
import { SlideBody, SlideHeader, Item } from './ui';

const ideas = [
  {
    icon: CreditCard,
    accent: 'teal',
    title: 'Step-by-Step Online Payments',
    desc: 'Secure payments inside the booking flow — a natural next step.',
  },
  {
    icon: Video,
    accent: 'indigo',
    title: 'Built-In Video Sessions',
    desc: 'Consultations directly inside the platform with join controls.',
  },
  {
    icon: Lightbulb,
    accent: 'amber',
    title: 'Deeper & Predictive Insights',
    desc: 'More analytics: engagement, retention and service trends.',
  },
  {
    icon: BellRing,
    accent: 'rose',
    title: 'Automated Reminders',
    desc: 'Smart reminders to reduce no-shows and keep schedules full.',
  },
  {
    icon: Smartphone,
    accent: 'emerald',
    title: 'Native Mobile Applications',
    desc: 'iOS and Android apps building on the existing PWA foundation.',
  },
  {
    icon: Building2,
    accent: 'purple',
    title: 'Multi-Location Support',
    desc: 'Scale a single practice into multiple branches on one platform.',
  },
];

export default function Future({ slide }) {
  return (
    <SlideBody>
      <SlideHeader slide={slide} />
      <Item className="mb-6">
        <span className="inline-flex items-center gap-2 rounded-full border border-violet-200 bg-violet-50 px-4 py-1.5 text-xs font-semibold text-violet-700">
          Potential Future Expansion — ideas for the roadmap, not yet built
        </span>
      </Item>
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {ideas.map((i) => {
          const Icon = i.icon;
          return (
            <Item key={i.title}>
              <div className="flex h-full flex-col rounded-3xl border border-dashed border-slate-300 bg-white/60 p-6">
                <span className="mb-4 inline-flex h-11 w-11 items-center justify-center rounded-2xl bg-slate-100 text-slate-600">
                  <Icon className="h-5 w-5" />
                </span>
                <p className="text-base font-bold text-slate-900">{i.title}</p>
                <p className="mt-2 text-sm leading-relaxed text-stone-500">{i.desc}</p>
              </div>
            </Item>
          );
        })}
      </div>
    </SlideBody>
  );
}