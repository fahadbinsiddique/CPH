'use client';

import { Download, MonitorSmartphone, Bell, Zap, LayoutGrid } from 'lucide-react';
import { SlideBody, SlideHeader, Item, FeatureCard, DemoBar, DemoLink } from './ui';

const features = [
  {
    icon: Download,
    accent: 'emerald',
    title: 'Installable Like an App',
    desc: 'CPH can be added to a phone or desktop home screen with its own icon and app window.',
  },
  {
    icon: Bell,
    accent: 'rose',
    title: 'Push Notifications',
    desc: 'Focused notifications can reach users even when they are not on the platform.',
  },
  {
    icon: Zap,
    accent: 'amber',
    title: 'Fast & Lightweight',
    desc: 'A service worker caches the app shell and public content for quick, dependable loading.',
  },
  {
    icon: LayoutGrid,
    accent: 'indigo',
    title: 'Home-Screen Shortcuts',
    desc: 'Quick links to key areas make the installed app feel native on any device.',
  },
];

export default function Pwa({ slide }) {
  return (
    <SlideBody>
      <SlideHeader slide={slide} />
      <div className="grid gap-5 md:grid-cols-2">
        {features.map((f) => (
          <FeatureCard key={f.title} icon={f.icon} accent={f.accent} title={f.title} desc={f.desc} className="h-full" />
        ))}
      </div>

      <Item className="mt-6">
        <div className="flex flex-wrap items-center gap-4 rounded-3xl border border-slate-200/70 bg-white/85 p-5 shadow-sm">
          <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-teal-600 to-emerald-600 shadow-lg shadow-teal-600/25">
            <MonitorSmartphone className="h-7 w-7 text-white" />
          </span>
          <div className="min-w-0 flex-1">
            <p className="text-base font-bold text-slate-900">Install and launch in one tap</p>
            <p className="mt-0.5 text-sm text-slate-500">
              When a user installs CPH, it opens in its own window — no browser chrome, just the
              platform.
            </p>
          </div>
          <span className="inline-flex items-center gap-1.5 rounded-xl bg-emerald-50 px-3 py-1.5 text-xs font-semibold text-emerald-700 ring-1 ring-emerald-200/60">
            <Download className="h-3.5 w-3.5" /> Available on desktop & mobile
          </span>
        </div>
      </Item>

      <Item className="mt-6">
        <p className="max-w-3xl text-sm leading-relaxed text-stone-500">
          Presented as an enhanced web experience: the reliability of an installed app without the
          complexity of a separate native application.
        </p>
      </Item>

      <DemoBar>
        <DemoLink href="/" label="Open the Live Platform" icon={MonitorSmartphone} />
      </DemoBar>
    </SlideBody>
  );
}