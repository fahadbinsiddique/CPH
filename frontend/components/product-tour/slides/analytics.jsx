'use client';

import { TrendingUp, PieChart as PieIcon, Award, Video, LineChart } from 'lucide-react';
import { SlideBody, SlideHeader, Item, FeatureCard, DemoBar, DemoLink } from './ui';

const charts = [
  {
    icon: TrendingUp,
    accent: 'teal',
    title: 'Engagement Trends',
    desc: 'Bookings, registrations and assessments across 7 / 30 / 90-day windows.',
  },
  {
    icon: PieIcon,
    accent: 'indigo',
    title: 'Status & Session Mix',
    desc: 'Where sessions stand and how online vs in-person compare.',
  },
  {
    icon: Award,
    accent: 'amber',
    title: 'Top Consultants',
    desc: 'See which professionals are driving the most sessions.',
  },
  {
    icon: LineChart,
    accent: 'emerald',
    title: 'Outcomes at a Glance',
    desc: 'Completion rates and revenue estimates based on confirmed sessions.',
  },
];

export default function Analytics({ slide }) {
  return (
    <SlideBody>
      <SlideHeader slide={slide} />
      <div className="grid gap-5 md:grid-cols-2">
        {charts.map((c) => (
          <FeatureCard key={c.title} icon={c.icon} accent={c.accent} title={c.title} desc={c.desc} className="h-full" />
        ))}
      </div>
      <Item className="mt-6">
        <div className="mx-auto flex max-w-3xl items-start gap-3 rounded-2xl border border-teal-200/60 bg-teal-50/50 p-4">
          <Video className="mt-0.5 h-5 w-5 shrink-0 text-teal-700" />
          <p className="text-sm leading-relaxed text-teal-900">
            Management insight without guesswork — the numbers available are drawn from real
            platform activity.
          </p>
        </div>
      </Item>
      <DemoBar>
        <DemoLink href="/dashboard/analytics" label="Open the Analytics View" icon={TrendingUp} />
      </DemoBar>
    </SlideBody>
  );
}