'use client';

import { User, UserCog, Building2, Sparkles } from 'lucide-react';
import { SlideBody, SlideHeader, FeatureCard, Item } from './ui';

const roles = [
  {
    icon: User,
    accent: 'emerald',
    title: 'Client',
    tagline: 'Finds support for their wellbeing',
    chips: ['Accounts', 'Consultant Discovery', 'Self-Assessments', 'Booking', 'Appointments', 'Notifications'],
  },
  {
    icon: UserCog,
    accent: 'indigo',
    title: 'Consultant',
    tagline: 'Runs their practice on the platform',
    chips: ['Profile', 'Availability', 'Appointments', 'Patients', 'Dashboard'],
  },
  {
    icon: Building2,
    accent: 'purple',
    title: 'Administrator',
    tagline: 'Operates and grows the platform',
    chips: ['Users', 'Consultants', 'Appointments', 'Blog & Content', 'Analytics', 'Settings'],
  },
];

export default function Overview({ slide }) {
  return (
    <SlideBody>
      <SlideHeader slide={slide} />
      <div className="grid gap-5 md:grid-cols-3">
        {roles.map((r) => (
          <FeatureCard
            key={r.title}
            icon={r.icon}
            accent={r.accent}
            title={r.title}
            className="h-full"
          >
            <p className="mt-1.5 text-sm leading-relaxed text-stone-500">{r.tagline}</p>
            <div className="mt-4 flex flex-wrap gap-1.5">
              {r.chips.map((c) => (
                <span
                  key={c}
                  className="rounded-full border border-slate-200 bg-slate-50 px-2.5 py-1 text-[11px] font-semibold text-slate-600"
                >
                  {c}
                </span>
              ))}
            </div>
          </FeatureCard>
        ))}
      </div>
      <Item className="mt-8">
        <div className="mx-auto flex max-w-2xl items-center justify-center gap-3 rounded-2xl border border-slate-200/70 bg-white/80 px-5 py-4 text-center">
          <Sparkles className="h-5 w-5 shrink-0 text-teal-600" />
          <p className="text-sm leading-relaxed text-slate-600">
            One codebase, one team, one brand — three tailored experiences working from shared data.
          </p>
        </div>
      </Item>
    </SlideBody>
  );
}