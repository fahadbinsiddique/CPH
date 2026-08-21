'use client';

import { Users, Shield, UserCheck, Calendar, BookOpen, CheckCircle2, LayoutDashboard } from 'lucide-react';
import { SlideBody, SlideHeader, Item, FeatureCard, DemoBar, DemoLink } from './ui';

const modules = [
  { icon: Users, accent: 'sky', title: 'Manage Users', desc: 'View the full user base and role-based access.' },
  { icon: Shield, accent: 'purple', title: 'Consultants', desc: 'Verify, manage and feature consultants.' },
  { icon: Calendar, accent: 'amber', title: 'Appointments', desc: 'Oversee the entire booking board by status.' },
  { icon: BookOpen, accent: 'rose', title: 'Blog & Articles', desc: 'Create and publish wellbeing content.' },
  { icon: UserCheck, accent: 'emerald', title: 'Specializations', desc: 'Maintain the categories the platform uses.' },
  { icon: LayoutDashboard, accent: 'indigo', title: 'Analytics', desc: 'Track engagement, sessions and outcomes.' },
];

export default function AdminDashboard({ slide }) {
  return (
    <SlideBody>
      <SlideHeader slide={slide} />
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {modules.map((m) => (
          <FeatureCard key={m.title} icon={m.icon} accent={m.accent} title={m.title} desc={m.desc} className="h-full" />
        ))}
      </div>

      <Item className="mt-6">
        <div className="grid gap-4 sm:grid-cols-3">
          {[
            { icon: Users, label: 'Total Users', value: 'Live count' },
            { icon: Shield, label: 'Consultants', value: 'Live count' },
            { icon: CheckCircle2, label: 'Verified Experts', value: 'Live count' },
          ].map((s) => {
            const Icon = s.icon;
            return (
              <div key={s.label} className="flex items-center gap-3 rounded-2xl border border-slate-200/70 bg-white/85 px-4 py-3.5 shadow-sm">
                <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-teal-100 to-emerald-100 text-teal-700">
                  <Icon className="h-5 w-5" />
                </span>
                <div>
                  <p className="text-sm font-bold text-slate-900">{s.label}</p>
                  <p className="text-xs text-slate-400">{s.value} · reported live</p>
                </div>
              </div>
            );
          })}
        </div>
      </Item>

      <DemoBar>
        <DemoLink href="/dashboard" label="Open the Admin Dashboard" icon={LayoutDashboard} />
        <DemoLink href="/dashboard/analytics" label="View Analytics" variant="outline" icon={Calendar} />
      </DemoBar>
    </SlideBody>
  );
}