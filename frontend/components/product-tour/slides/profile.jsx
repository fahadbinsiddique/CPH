'use client';

import { BadgeCheck, Clock, GraduationCap, BriefcaseBusiness, Wallet, ArrowDown } from 'lucide-react';
import { SlideBody, SlideHeader, Item, Card, DemoBar, DemoLink } from './ui';

const details = [
  { icon: GraduationCap, label: 'Education & Credentials' },
  { icon: BriefcaseBusiness, label: 'Experience (Years)' },
  { icon: Wallet, label: 'Consultation Fee' },
  { icon: Clock, label: 'Availability Status' },
];

export default function Profile({ slide }) {
  return (
    <SlideBody>
      <SlideHeader slide={slide} />
      <div className="grid items-start gap-6 lg:grid-cols-2">
        <Card className="overflow-hidden p-0">
          <div className="relative h-44 w-full bg-gradient-to-br from-teal-100 to-emerald-100">
            <div className="absolute left-1/2 top-1/2 flex h-28 w-28 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border-4 border-white bg-white text-4xl font-bold text-teal-700 shadow-md">
              A
            </div>
            <span className="absolute right-4 top-4 inline-flex items-center gap-1 rounded-full bg-white/90 px-2.5 py-1 text-[10px] font-semibold text-emerald-700 shadow-sm backdrop-blur">
              <BadgeCheck className="h-3 w-3" /> Verified Professional
            </span>
          </div>
          <div className="p-5">
            <p className="text-lg font-bold text-slate-900">Professional Profile</p>
            <p className="text-sm text-slate-500">Specialisations · Experience · Fee · Availability</p>
          </div>
        </Card>

        <div className="space-y-3">
          {details.map((d, i) => {
            const Icon = d.icon;
            return (
              <Item key={d.label}>
                <div className="flex items-center gap-3 rounded-2xl border border-slate-200/70 bg-white/80 px-4 py-3.5 shadow-sm">
                  <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-teal-50 text-teal-600">
                    <Icon className="h-5 w-5" />
                  </span>
                  <p className="text-sm font-semibold text-slate-800">{d.label}</p>
                  <ArrowDown className="ml-auto h-4 w-4 rotate-[-90deg] text-slate-300" />
                </div>
              </Item>
            );
          })}
        </div>
      </div>

      <Item className="mt-6">
        <p className="max-w-3xl text-sm leading-relaxed text-stone-500">
          Each consultant’s profile gives clients the confidence to choose — clear credentials, an
          honest availability status and a transparent fee, all in one place.
        </p>
      </Item>

      <DemoBar>
        <DemoLink href="/consultant" label="Explore Live Profiles" icon={BadgeCheck} />
      </DemoBar>
    </SlideBody>
  );
}