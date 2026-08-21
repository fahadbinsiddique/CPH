'use client';

import {
  Search,
  UserPlus,
  Compass,
  ClipboardList,
  UserRound,
  Clock,
  CalendarPlus,
  Bell,
  LayoutDashboard,
} from 'lucide-react';
import { SlideBody, SlideHeader, Item } from './ui';

const steps = [
  { icon: Search, label: 'Discover', desc: 'Find the platform' },
  { icon: UserPlus, label: 'Sign Up', desc: 'Create an account' },
  { icon: Compass, label: 'Explore', desc: 'Browse consultants' },
  { icon: ClipboardList, label: 'Assess', desc: 'Self-assessment' },
  { icon: UserRound, label: 'Choose', desc: 'Pick a professional' },
  { icon: Clock, label: 'Availability', desc: 'See open times' },
  { icon: CalendarPlus, label: 'Book', desc: 'Confirm a session' },
  { icon: Bell, label: 'Confirmation', desc: 'Get alerted' },
  { icon: LayoutDashboard, label: 'Manage', desc: 'Track appointments' },
];

export default function Journey({ slide }) {
  return (
    <SlideBody className="flex flex-col justify-center">
      <SlideHeader slide={slide} />
      <div className="mt-2 grid grid-cols-3 gap-3 sm:grid-cols-3 lg:grid-cols-9">
        {steps.map((s, i) => {
          const Icon = s.icon;
          return (
            <Item key={s.label}>
              <div className="flex h-full flex-col items-center rounded-2xl border border-slate-200/70 bg-white/85 px-2 py-4 text-center shadow-sm">
                <span className="mb-2 flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-teal-100 to-emerald-100 text-teal-700">
                  <Icon className="h-[18px] w-[18px]" />
                </span>
                <p className="text-[11px] font-bold text-slate-900">{s.label}</p>
                <p className="mt-0.5 text-center text-[9px] leading-tight text-slate-400">{s.desc}</p>
              </div>
            </Item>
          );
        })}
      </div>
      <Item className="mt-8">
        <p className="mx-auto max-w-2xl text-center text-sm leading-relaxed text-stone-500">
          Every step is supported — from first discovery all the way to an appointment that is
          confirmed, stored and easy to manage.
        </p>
      </Item>
    </SlideBody>
  );
}