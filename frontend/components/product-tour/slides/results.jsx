'use client';

import { FileCheck2, History, RotateCcw } from 'lucide-react';
import { SlideBody, SlideHeader, Item, FeatureCard, DemoBar, DemoLink } from './ui';

export default function Results({ slide }) {
  return (
    <SlideBody>
      <SlideHeader slide={slide} />
      <div className="grid items-start gap-6 lg:grid-cols-2">
        {/* Result card mock */}
        <Item>
          <div className="rounded-3xl border border-slate-200/70 bg-white/90 p-6 shadow-card">
            <div className="flex items-center justify-between">
              <p className="text-sm font-bold text-slate-900">Stress Check · Result</p>
              <span className="rounded-full bg-amber-50 px-3 py-1 text-[11px] font-bold text-amber-700 ring-1 ring-amber-200/70">
                Moderate
              </span>
            </div>
            <div className="mt-6">
              <div className="mb-2 flex items-end justify-between">
                <p className="text-3xl font-extrabold tabular-nums text-slate-900">68%</p>
                <p className="text-xs font-medium text-slate-400">impact score</p>
              </div>
              <div className="h-3 w-full overflow-hidden rounded-full bg-slate-100">
                <div className="h-full w-[68%] rounded-full bg-gradient-to-r from-amber-500 to-orange-400" />
              </div>
            </div>
            <p className="mt-5 text-sm leading-relaxed text-stone-500">
              A clear, calming summary of your answers with gentle guidance and a suggestion to
              connect with a professional if it feels relevant.
            </p>
          </div>
        </Item>

        <div className="space-y-4">
          <FeatureCard icon={FileCheck2} accent="emerald" title="Instant structured result">
            <p className="mt-1.5 text-sm leading-relaxed text-stone-500">
              Answers are turned into an easy-to-read outcome — encouraging reflection, not alarm.
            </p>
          </FeatureCard>
          <FeatureCard icon={History} accent="sky" title="Saved to personal history">
            <p className="mt-1.5 text-sm leading-relaxed text-stone-500">
              Results are stored on the client dashboard so progress and patterns can be reviewed
              across time.
            </p>
          </FeatureCard>
          <FeatureCard icon={RotateCcw} accent="indigo" title="Retake anytime">
            <p className="mt-1.5 text-sm leading-relaxed text-stone-500">
              Clients can repeat an assessment to see how they are doing along the way.
            </p>
          </FeatureCard>
        </div>
      </div>

      <DemoBar>
        <DemoLink href="/dashboard/assessments" label="Open Assessment History" icon={History} />
        <DemoLink href="/assessment" label="Start a Check" variant="outline" icon={FileCheck2} />
      </DemoBar>
    </SlideBody>
  );
}