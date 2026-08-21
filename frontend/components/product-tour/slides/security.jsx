'use client';

import { Lock, Cookie, ShieldCheck, EyeOff, BugOff } from 'lucide-react';
import { SlideBody, SlideHeader, Item, DemoBar } from './ui';

const items = [
  {
    icon: Lock,
    accent: 'indigo',
    title: 'JWT Authentication',
    desc: 'Sessions are issued and verified with modern, industry-standard tokens.',
  },
  {
    icon: Cookie,
    accent: 'teal',
    title: 'HttpOnly Cookie Sessions',
    desc: 'Credentials travel in secure, HTTP-only cookies — kept out of reach of scripts.',
  },
  {
    icon: ShieldCheck,
    accent: 'purple',
    title: 'Role-Based Permissions',
    desc: 'Admin-only functions are guarded at the API level, not just hidden in the UI.',
  },
  {
    icon: EyeOff,
    accent: 'emerald',
    title: 'Protected Endpoints',
    desc: 'Private data is only served to the authenticated person it belongs to.',
  },
  {
    icon: BugOff,
    accent: 'amber',
    title: 'Handled Errors, Clean Logs',
    desc: 'Centralised exception handling keeps failures safe, visible and easy to fix.',
  },
];

export default function Security({ slide }) {
  return (
    <SlideBody>
      <SlideHeader slide={slide} />
      <div className="space-y-3">
        {items.map((i) => {
          const Icon = i.icon;
          return (
            <Item key={i.title}>
              <div className="flex items-start gap-4 rounded-2xl border border-slate-200/70 bg-white/85 p-5 shadow-sm">
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-slate-100 to-white text-slate-700 ring-1 ring-slate-200/70">
                  <Icon className="h-5 w-5" />
                </span>
                <div>
                  <p className="text-base font-bold text-slate-900">{i.title}</p>
                  <p className="mt-1 text-sm leading-relaxed text-stone-500">{i.desc}</p>
                </div>
              </div>
            </Item>
          );
        })}
      </div>
      <Item className="mt-6">
        <div className="mx-auto flex max-w-3xl items-start gap-3 rounded-2xl border border-teal-200/60 bg-teal-50/50 p-4">
          <Lock className="mt-0.5 h-5 w-5 shrink-0 text-teal-700" />
          <p className="text-sm leading-relaxed text-teal-900">
            Security is built for a mental-health context: the more personal the information, the
            higher the standard it is protected to.
          </p>
        </div>
      </Item>
      <DemoBar>
        <span className="inline-flex items-center gap-1.5 text-xs font-medium text-slate-500">
          <ShieldCheck className="h-3.5 w-3.5 text-teal-600" />
          Admin-only screens are protected end-to-end — from navigation to the API layer.
        </span>
      </DemoBar>
    </SlideBody>
  );
}