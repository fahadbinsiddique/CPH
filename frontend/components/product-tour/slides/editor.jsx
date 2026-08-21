'use client';

import { Bold, Italic, Underline, List, Quote, ImagePlus, Link2, Pilcrow, PenLine, BookOpen } from 'lucide-react';
import { SlideBody, SlideHeader, Item, FeatureCard, DemoBar, DemoLink } from './ui';

const tools = [
  { icon: Bold, label: 'Bold & emphasis' },
  { icon: List, label: 'Lists & structure' },
  { icon: Quote, label: 'Quotes & callouts' },
  { icon: ImagePlus, label: 'Inline images' },
  { icon: Link2, label: 'Links' },
  { icon: Pilcrow, label: 'Headings & paragraphs' },
];

export default function Editor({ slide }) {
  return (
    <SlideBody>
      <SlideHeader slide={slide} />
      <div className="grid items-start gap-6 lg:grid-cols-2">
        {/* Editor mock */}
        <Item>
          <div className="overflow-hidden rounded-3xl border border-slate-200/70 bg-white shadow-card">
            <div className="flex flex-wrap items-center gap-1 border-b border-slate-100 bg-slate-50/80 px-3 py-2">
              {[Bold, Italic, Underline, List, Quote, ImagePlus, Link2].map((Tool, i) => (
                <span
                  key={i}
                  className={`inline-flex h-8 w-8 cursor-pointer items-center justify-center rounded-lg transition-colors ${
                    i === 0 ? 'bg-teal-100 text-teal-700' : 'text-slate-500 hover:bg-white'
                  }`}
                >
                  <Tool className="h-4 w-4" />
                </span>
              ))}
              <span className="ml-auto rounded-lg bg-slate-100 px-2.5 py-1 text-[10px] font-semibold text-slate-500">
                Draft
              </span>
            </div>
            <div className="space-y-3 p-5">
              <p className="text-lg font-bold leading-snug text-slate-900">
                Five Small Habits for a Calmer Morning
              </p>
              <p className="text-sm leading-relaxed text-slate-600">
                A calm morning sets the tone for the whole day. Here are simple, realistic routines
                anyone can build — starting with just five unhurried minutes…
              </p>
              <div className="flex gap-1.5">
                {['Wellbeing', 'Routine'].map((t) => (
                  <span key={t} className="rounded-full bg-slate-100 px-2.5 py-1 text-[10px] font-semibold text-slate-600">
                    # {t}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </Item>

        <div className="space-y-4">
          <FeatureCard icon={PenLine} accent="amber" title="A professional writing studio">
            <p className="mt-1.5 text-sm leading-relaxed text-stone-500">
              A rich text editor with headings, formatting, lists, quotes, images and links — no
              code required.
            </p>
          </FeatureCard>
          <FeatureCard icon={ImagePlus} accent="rose" title="Images, the easy way">
            <p className="mt-1.5 text-sm leading-relaxed text-stone-500">
              Upload cover and inline images directly into an article with clean handling.
            </p>
          </FeatureCard>
          <FeatureCard icon={Pilcrow} accent="indigo" title="Structured, consistent content">
            <p className="mt-1.5 text-sm leading-relaxed text-stone-500">
              Consistent structure keeps every article readable on any device and easy to navigate.
            </p>
          </FeatureCard>
        </div>
      </div>

      <Item className="mt-6">
        <p className="max-w-3xl text-sm leading-relaxed text-stone-500">
          Structured content management means the team can publish professional articles quickly,
          confidently and consistently.
        </p>
      </Item>

      <DemoBar>
        <DemoLink href="/dashboard/blogs" label="Open the Editor" icon={PenLine} />
        <DemoLink href="/blog" label="See Published Articles" variant="outline" icon={BookOpen} />
      </DemoBar>
    </SlideBody>
  );
}