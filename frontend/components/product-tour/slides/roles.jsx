'use client';

import { User, UserCog, Building2, ArrowDown, Lock } from 'lucide-react';
import { SlideBody, SlideHeader, Item } from './ui';

const tiers = [
  {
    icon: User,
    gradient: 'from-teal-500 to-emerald-500',
    label: 'CLIENT',
    box: 'Client Workspace',
    points: ['Assessments & bookings', 'Personal appointments', 'Own profile & history'],
  },
  {
    icon: UserCog,
    gradient: 'from-indigo-500 to-blue-500',
    label: 'CONSULTANT',
    box: 'Consultant Workspace',
    points: ['Availability & schedule', 'Patients & sessions', 'Practice profile'],
  },
  {
    icon: Building2,
    gradient: 'from-fuchsia-500 to-purple-500',
    label: 'ADMIN',
    box: 'Administrative Workspace',
    points: ['Users & consultants', 'Appointments & content', 'Analytics & settings'],
  },
];

export default function Roles({ slide }) {
  return (
    <SlideBody>
      <SlideHeader slide={slide} />
      <div className="grid items-stretch gap-5 md:grid-cols-3">
        {tiers.map((t, i) => {
          const Icon = t.icon;
          return (
            <Item key={t.label}>
              <div className="flex h-full flex-col rounded-3xl border border-slate-200/70 bg-white/85 p-6 shadow-sm transition-shadow hover:shadow-card">
                <span className={`mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br text-white shadow-md ${t.gradient}`}>
                  <Icon className="h-6 w-6" />
                </span>
                <p className="mb-1 text-lg font-extrabold tracking-wide text-slate-900">{t.label}</p>
                <p className="mb-5 text-sm font-semibold text-teal-700">{t.box}</p>
                <ul className="mt-auto space-y-2">
                  {t.points.map((pt) => (
                    <li key={pt} className="flex items-start gap-2 text-sm leading-relaxed text-stone-500">
                      <ArrowDown className="mt-1 h-3 w-3 shrink-0 rotate-[-90deg] text-teal-400" />
                      {pt}
                    </li>
                  ))}
                </ul>
              </div>
            </Item>
          );
        })}
      </div>

      <Item className="mt-8">
        <div className="mx-auto flex max-w-2xl items-start gap-3 rounded-2xl border border-violet-200/60 bg-violet-50/60 px-5 py-4">
          <Lock className="mt-0.5 h-5 w-5 shrink-0 text-violet-600" />
          <p className="text-sm leading-relaxed text-violet-900">
            Role-based access protects sensitive data and keeps each workspace focused — clients can
            never see another client, and administrative functions stay behind admin access only.
          </p>
        </div>
      </Item>
    </SlideBody>
  );
}