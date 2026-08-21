'use client';

import { UserPlus, Search, ClipboardList, CalendarPlus, LayoutDashboard, Bell } from 'lucide-react';
import { SlideBody, SlideHeader, FeatureCard, Item } from './ui';

const features = [
  {
    icon: UserPlus,
    accent: 'emerald',
    title: 'Account',
    desc: 'Quick, secure registration and sign-in — including one-tap sign-in with Google — so clients can begin right away.',
  },
  {
    icon: Search,
    accent: 'teal',
    title: 'Consultant Discovery',
    desc: 'Browse qualified professionals, filter by specialisation and see who is currently accepting bookings.',
  },
  {
    icon: ClipboardList,
    accent: 'sky',
    title: 'Self-Assessments',
    desc: 'A structured self-assessment experience across wellbeing topics, completed at the client’s own pace.',
  },
  {
    icon: CalendarPlus,
    accent: 'indigo',
    title: 'Booking',
    desc: 'A guided flow to choose a consultant, pick a real open time and confirm a session — online or in person.',
  },
  {
    icon: LayoutDashboard,
    accent: 'amber',
    title: 'Personal Dashboard',
    desc: 'Upcoming sessions, past appointments and history organised in a calm, personal workspace.',
  },
  {
    icon: Bell,
    accent: 'rose',
    title: 'Staying Informed',
    desc: 'Email and browser notifications keep clients informed about their bookings and the platform.',
  },
];

export default function ClientExperience({ slide }) {
  return (
    <SlideBody>
      <SlideHeader slide={slide} />
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {features.map((f, i) => (
          <FeatureCard
            key={f.title}
            icon={f.icon}
            accent={f.accent}
            title={f.title}
            desc={f.desc}
            index={i + 1}
            className="h-full"
          />
        ))}
      </div>
      <Item className="mt-8">
        <p className="mx-auto max-w-2xl text-center text-sm leading-relaxed text-stone-500">
          Every client tool is designed to reduce friction — fewer phone calls, less confusion and a
          clearer path to professional support.
        </p>
      </Item>
    </SlideBody>
  );
}