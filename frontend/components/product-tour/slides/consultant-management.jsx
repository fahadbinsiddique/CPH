'use client';

import { ShieldCheck, UserCheck, Star, Tag, Users } from 'lucide-react';
import { SlideBody, SlideHeader, Item, DemoBar, DemoLink } from './ui';

export default function ConsultantManagement({ slide }) {
  return (
    <SlideBody>
      <SlideHeader slide={slide} />
      <div className="grid items-start gap-6 lg:grid-cols-2">
        <Item>
          <div className="rounded-3xl border border-slate-200/70 bg-white/90 p-5 shadow-card">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <p className="flex items-center gap-2 text-sm font-bold text-slate-900">
                <Users className="h-4 w-4 text-purple-600" /> Consultant Applications
              </p>
              <span className="rounded-lg bg-amber-50 px-2.5 py-1 text-[11px] font-bold text-amber-700 ring-1 ring-amber-200/70">
                3 pending
              </span>
            </div>
            {[
              { name: 'Dr. A. Rahman', special: 'Clinical Psychology', status: 'Pending review' },
              { name: 'S. Karim', special: 'Counselling', status: 'Pending review' },
            ].map((row) => (
              <div key={row.name} className="flex items-center gap-3 border-b border-slate-100 py-3 last:border-0">
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-purple-100 to-indigo-100 text-sm font-bold text-purple-700">
                  {row.name.replace('Dr. ', '').charAt(0)}
                </span>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-bold text-slate-800">{row.name}</p>
                  <p className="truncate text-xs text-slate-400">{row.special}</p>
                </div>
                <span className="rounded-lg bg-amber-50 px-2.5 py-1 text-[10px] font-semibold text-amber-700">
                  {row.status}
                </span>
              </div>
            ))}
            <div className="mt-4 flex gap-2">
              <button type="button" className="inline-flex flex-1 items-center justify-center gap-1.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 px-3 py-2 text-xs font-semibold text-white shadow-sm transition-colors hover:from-emerald-700 hover:to-teal-700">
                <ShieldCheck className="h-3.5 w-3.5" /> Verify
              </button>
              <button type="button" className="inline-flex flex-1 items-center justify-center gap-1.5 rounded-xl border border-slate-200 px-3 py-2 text-xs font-semibold text-slate-600 transition-colors hover:bg-slate-50">
                <UserCheck className="h-3.5 w-3.5" /> Review
              </button>
            </div>
          </div>
        </Item>

        <Item>
          <div className="space-y-4">
            <div className="flex items-start gap-3 rounded-2xl border border-slate-200/70 bg-white/85 p-5 shadow-sm">
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-purple-50 text-purple-600">
                <ShieldCheck className="h-5 w-5" />
              </span>
              <div>
                <p className="text-sm font-bold text-slate-900">Verification workflow</p>
                <p className="mt-1 text-sm leading-relaxed text-stone-500">
                  Applications are reviewed and verified before consultants go live on the platform.
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3 rounded-2xl border border-slate-200/70 bg-white/85 p-5 shadow-sm">
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-amber-50 text-amber-600">
                <Star className="h-5 w-5" />
              </span>
              <div>
                <p className="text-sm font-bold text-slate-900">Featured consultants</p>
                <p className="mt-1 text-sm leading-relaxed text-stone-500">
                  Admins can feature select professionals to highlight them on the homepage.
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3 rounded-2xl border border-slate-200/70 bg-white/85 p-5 shadow-sm">
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-teal-50 text-teal-600">
                <Tag className="h-5 w-5" />
              </span>
              <div>
                <p className="text-sm font-bold text-slate-900">Specialisations</p>
                <p className="mt-1 text-sm leading-relaxed text-stone-500">
                  The platform&apos;s categories and filters are managed here, keeping discovery clean.
                </p>
              </div>
            </div>
          </div>
        </Item>
      </div>

      <DemoBar>
        <DemoLink href="/dashboard/consultants" label="Open Consultant Management" icon={ShieldCheck} />
        <DemoLink href="/dashboard/specializations" label="Manage Specializations" variant="outline" icon={Tag} />
      </DemoBar>
    </SlideBody>
  );
}