'use client';

import { User, UserCog, Building2, ArrowDown } from 'lucide-react';
import { SlideBody, SlideHeader, FeatureCard, Item } from './ui';

const pillars = [
  {
    icon: User,
    accent: 'emerald',
    title: 'Client Experience',
    points: [
      'Discover professional support',
      'Take structured self-assessments',
      'Book and manage appointments online',
    ],
  },
  {
    icon: UserCog,
    accent: 'indigo',
    title: 'Consultant Experience',
    points: [
      'Manage a professional profile',
      'Control availability and schedule',
      'Track sessions and patients',
    ],
  },
  {
    icon: Building2,
    accent: 'purple',
    title: 'Administrative Management',
    points: [
      'Verify and manage the consultant team',
      'Oversee appointments and users',
      'Publish content and review insights',
    ],
  },
];

export default function Vision({ slide }) {
  return (
    <SlideBody>
      <SlideHeader slide={slide} />
      <div className="grid gap-5 md:grid-cols-3">
        {pillars.map((p, i) => {
          const Icon = p.icon;
          return (
            <FeatureCard key={p.title} icon={Icon} accent={p.accent} index={i + 1} className="h-full">
              <h3 className="text-base font-bold text-slate-900">{p.title}</h3>
              <ul className="mt-3 space-y-2">
                {p.points.map((pt) => (
                  <li key={pt} className="flex items-start gap-2 text-sm leading-relaxed text-stone-500">
                    <ArrowDown className="mt-1 h-3 w-3 shrink-0 rotate-[-90deg] text-teal-400" />
                    {pt}
                  </li>
                ))}
              </ul>
            </FeatureCard>
          );
        })}
      </div>
      <Item className="mt-10">
        <p className="mx-auto max-w-2xl text-center text-sm leading-relaxed text-stone-500">
          CPH exists so that mental health care is easier to find, easier to schedule and easier to
          manage — for the people who seek it and for the team that provides it.
        </p>
      </Item>
    </SlideBody>
  );
}