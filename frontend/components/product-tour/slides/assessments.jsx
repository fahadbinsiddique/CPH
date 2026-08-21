'use client';

import { ClipboardList, ShieldAlert } from 'lucide-react';
import { SlideBody, SlideHeader, Item, DemoBar, DemoLink } from './ui';

const categories = [
  { label: 'Stress', chip: 'bg-teal-50 text-teal-700 ring-teal-200/70', grad: 'from-teal-500 to-emerald-500' },
  { label: 'Anxiety', chip: 'bg-amber-50 text-amber-700 ring-amber-200/70', grad: 'from-amber-500 to-orange-400' },
  { label: 'Depression', chip: 'bg-sky-50 text-sky-700 ring-sky-200/70', grad: 'from-sky-500 to-indigo-500' },
  { label: 'Burnout', chip: 'bg-rose-50 text-rose-700 ring-rose-200/70', grad: 'from-rose-500 to-pink-500' },
  { label: 'Sleep', chip: 'bg-indigo-50 text-indigo-700 ring-indigo-200/70', grad: 'from-indigo-500 to-violet-500' },
  { label: 'Wellbeing', chip: 'bg-emerald-50 text-emerald-700 ring-emerald-200/70', grad: 'from-emerald-500 to-green-500' },
];

export default function Assessments({ slide }) {
  return (
    <SlideBody>
      <SlideHeader slide={slide} />
      <div className="grid items-start gap-6 lg:grid-cols-2">
        <div>
          <Item>
            <p className="mb-4 text-xs font-semibold uppercase tracking-[0.16em] text-slate-400">
              Self-assessment categories
            </p>
          </Item>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
            {categories.map((c) => (
              <Item key={c.label}>
                <div className={`rounded-2xl border border-slate-200/70 p-4 text-center shadow-sm ring-1 ${c.chip}`}>
                  <span className={`mx-auto mb-2 block h-1.5 w-10 rounded-full bg-gradient-to-r ${c.grad}`} />
                  <p className="text-sm font-bold">{c.label}</p>
                </div>
              </Item>
            ))}
          </div>
          <Item className="mt-6">
            <div className="rounded-2xl border border-amber-200/70 bg-amber-50/70 p-4 text-sm leading-relaxed text-amber-800">
              <p className="font-semibold">Reassurance first</p>
              <p className="mt-1">
                These are structured self-assessments for reflection and awareness — they do not
                provide a medical diagnosis. Professional consultation always comes next.
              </p>
            </div>
          </Item>
        </div>

        {/* Question mock */}
        <Item>
          <div className="rounded-3xl border border-slate-200/70 bg-white/90 p-6 shadow-card">
            <div className="mb-5 flex items-center justify-between">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-teal-50 px-3 py-1 text-[11px] font-semibold text-teal-700 ring-1 ring-teal-200/70">
                <ClipboardList className="h-3 w-3" /> Stress Check
              </span>
              <span className="text-xs font-bold tabular-nums text-slate-400">4 / 10</span>
            </div>
            <div className="h-2 w-full overflow-hidden rounded-full bg-slate-100">
              <div className="h-full w-2/5 rounded-full bg-gradient-to-r from-teal-500 to-emerald-500" />
            </div>
            <p className="mt-6 text-base font-bold leading-snug text-slate-900">
              Over the last two weeks, how often have you felt unable to control the important
              things in your life?
            </p>
            <div className="mt-5 space-y-2">
              {['Not at all', 'Several days', 'More than half the days', 'Nearly every day'].map((opt, i) => (
                <div
                  key={opt}
                  className={`flex items-center justify-between rounded-xl border px-4 py-3 text-sm font-medium ${
                    i === 0
                      ? 'border-teal-300 bg-teal-50/70 text-teal-800'
                      : 'border-slate-200 bg-white text-slate-600'
                  }`}
                >
                  {opt}
                  {i === 0 && <span className="h-4 w-4 rounded-full border-[5px] border-teal-600" />}
                </div>
              ))}
            </div>
          </div>
        </Item>
      </div>

      <Item className="mt-6">
        <p className="max-w-3xl text-sm leading-relaxed text-stone-500">
          Designed with calm and care: clear progress, honest disclaimers and a comfortable pace for
          every client.
        </p>
      </Item>

      <DemoBar>
        <DemoLink href="/assessment" label="Try an Assessment" icon={ClipboardList} />
        <DemoLink href="/dashboard/assessments" label="Assessment History" variant="outline" icon={ShieldAlert} />
      </DemoBar>
    </SlideBody>
  );
}