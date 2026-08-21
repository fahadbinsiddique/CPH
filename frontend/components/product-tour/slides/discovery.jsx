'use client';

import { Search, Star, Filter, BadgeCheck, Clock } from 'lucide-react';
import { SlideBody, SlideHeader, Item, FeatureCard, DemoBar, DemoLink } from './ui';

const features = [
  {
    icon: Search,
    accent: 'teal',
    title: 'Browse & Search',
    desc: 'A dedicated public consultant directory with search across the consultant list.',
  },
  {
    icon: Filter,
    accent: 'indigo',
    title: 'Filter by Specialisation',
    desc: 'Clients can narrow results by the specialisations that matter to them.',
  },
  {
    icon: Star,
    accent: 'amber',
    title: 'Featured Consultants',
    desc: 'Curated, featured professionals are showcased prominently on the homepage.',
  },
  {
    icon: Clock,
    accent: 'emerald',
    title: 'Availability at a Glance',
    desc: 'Each consultant card shows whether they are currently accepting bookings.',
  },
];

export default function Discovery({ slide }) {
  return (
    <SlideBody>
      <SlideHeader slide={slide} />
      <div className="grid gap-5 md:grid-cols-2">
        {features.map((f) => (
          <FeatureCard key={f.title} icon={f.icon} accent={f.accent} title={f.title} desc={f.desc} className="h-full" />
        ))}
      </div>

      {/* Mini consultant card mock */}
      <Item className="mt-6">
        <div className="flex flex-wrap items-center gap-4 rounded-3xl border border-slate-200/70 bg-white/85 p-5 shadow-sm">
          <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-teal-100 to-emerald-100 text-xl font-bold text-teal-700">
            S
          </div>
          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-2">
              <p className="text-base font-bold text-slate-900">Clinical Psychologist</p>
              <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2 py-0.5 text-[10px] font-semibold text-emerald-700 ring-1 ring-emerald-200/70">
                <BadgeCheck className="h-3 w-3" /> Verified
              </span>
            </div>
            <div className="mt-1 flex flex-wrap gap-1.5">
              {['Stress', 'Anxiety', 'Burnout'].map((s) => (
                <span key={s} className="rounded-md bg-slate-100 px-2 py-0.5 text-[10px] font-medium text-slate-600">
                  {s}
                </span>
              ))}
            </div>
            <p className="mt-1.5 text-xs font-medium text-emerald-600">Accepting bookings · ৳1,500 / session</p>
          </div>
        </div>
      </Item>

      <DemoBar>
        <DemoLink href="/consultant" label="Open Consultant Directory" icon={Search} />
        <DemoLink href="/" label="See Featured on Homepage" variant="outline" icon={Star} />
      </DemoBar>
    </SlideBody>
  );
}