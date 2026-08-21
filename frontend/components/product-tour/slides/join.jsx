'use client';

import { UserPlus, FileText, ShieldCheck, Rocket, CheckCircle2 } from 'lucide-react';
import { SlideBody, SlideHeader, Item, StepFlow, DemoBar, DemoLink } from './ui';

const flow = [
  { icon: UserPlus, label: 'Apply' },
  { icon: FileText, label: 'Submit Details' },
  { icon: ShieldCheck, label: 'Platform Review' },
  { icon: Rocket, label: 'Go Live' },
];

export default function Join({ slide }) {
  return (
    <SlideBody>
      <SlideHeader slide={slide} />
      <StepFlow steps={flow} accent="emerald" />
      <div className="mt-6 grid items-start gap-6 lg:grid-cols-2">
        <Item className="md:col-span-1">
          <div className="rounded-3xl border border-slate-200/70 bg-white/90 p-6 shadow-card">
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-400">
              Application form
            </p>
            <div className="mt-4 space-y-3">
              {['Full name', 'Email address', 'Professional qualifications', 'Specialisations'].map((f) => (
                <div key={f} className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-400">
                  {f}
                </div>
              ))}
              <div className="rounded-xl border border-emerald-300 bg-emerald-50/70 px-4 py-3 text-sm font-semibold text-emerald-800">
                + Upload profile photo & documents
              </div>
              <button type="button" className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-teal-600 to-emerald-600 px-4 py-3 text-sm font-bold text-white shadow-lg shadow-teal-600/20 transition-colors hover:from-teal-700 hover:to-emerald-700">
                <UserPlus className="h-4 w-4" /> Submit Application
              </button>
            </div>
          </div>
        </Item>

        <Item className="md:col-span-1">
          <div className="flex h-full flex-col justify-center rounded-3xl border border-emerald-200/60 bg-gradient-to-b from-emerald-50/70 to-white p-6">
            <h3 className="text-base font-bold text-slate-900">A respectful, structured path</h3>
            <ul className="mt-3 space-y-2.5 text-sm leading-relaxed text-stone-600">
              <li>Professionals apply once with their credentials.</li>
              <li>The platform team reviews and verifies each application.</li>
              <li>Once approved, the consultant appears in the directory and can manage their practice.</li>
              <li>Quality is protected — every listed professional is a verified member of the team.</li>
            </ul>
          </div>
        </Item>
      </div>

      <Item className="mt-6">
        <div className="mx-auto flex max-w-2xl items-start gap-3 rounded-2xl border border-slate-200/70 bg-white/85 p-4">
          <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-emerald-600" />
          <p className="text-sm leading-relaxed text-stone-600">
            This is how the platform grows its consultant team — with quality and trust at the centre.
          </p>
        </div>
      </Item>

      <DemoBar>
        <DemoLink href="/join-as-therapist" label="Open the Application" icon={UserPlus} />
      </DemoBar>
    </SlideBody>
  );
}