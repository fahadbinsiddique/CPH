'use client';

import { BookOpen, Search, Tag, FileText, PenLine, HeartPulse } from 'lucide-react';
import { SlideBody, SlideHeader, Item, FeatureCard, DemoBar, DemoLink } from './ui';

const features = [
  {
    icon: PenLine,
    accent: 'rose',
    title: 'Create & Edit Posts',
    desc: 'Draft, edit and publish wellbeing articles with full control over status.',
  },
  {
    icon: Tag,
    accent: 'amber',
    title: 'Categories & Tags',
    desc: 'Organise content so clients can filter and discover what is relevant to them.',
  },
  {
    icon: FileText,
    accent: 'teal',
    title: 'Cover Images & Excerpts',
    desc: 'Visual, scannable article cards with summaries that invite reading.',
  },
  {
    icon: Search,
    accent: 'indigo',
    title: 'Search & Filters',
    desc: 'A public blog with search and filter-by-category/tag for easy navigation.',
  },
];

export default function Blog({ slide }) {
  return (
    <SlideBody>
      <SlideHeader slide={slide} />
      <div className="grid gap-5 md:grid-cols-2">
        {features.map((f) => (
          <FeatureCard key={f.title} icon={f.icon} accent={f.accent} title={f.title} desc={f.desc} className="h-full" />
        ))}
      </div>

      {/* Blog card mock */}
      <Item className="mt-6">
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="overflow-hidden rounded-3xl border border-slate-200/70 bg-white/90 shadow-sm">
            <div className="h-28 w-full bg-gradient-to-br from-rose-100 to-pink-100" />
            <div className="p-5">
              <div className="mb-2 flex gap-1.5">
                <span className="rounded-full bg-rose-50 px-2 py-0.5 text-[10px] font-semibold text-rose-700 ring-1 ring-rose-200/70">Featured</span>
                <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[10px] font-medium text-slate-500">Published</span>
              </div>
              <p className="text-sm font-bold leading-snug text-slate-900">
                Understanding Stress: A Gentle Guide for Everyday Life
              </p>
              <p className="mt-1.5 text-xs leading-relaxed text-slate-500">
                Practical, plain-language advice to help readers recognise and respond to stress.
              </p>
            </div>
          </div>
          <div className="flex flex-col justify-center gap-3">
            <Item>
              <p className="flex items-center gap-2 text-sm font-bold text-slate-900">
                <BookOpen className="h-4 w-4 text-teal-600" /> Why content matters
              </p>
              <p className="mt-1.5 text-sm leading-relaxed text-stone-500">
                The blog is the voice of the practice — educating, reassuring and connecting with
                clients before they ever book a session.
              </p>
            </Item>
            <Item>
              <p className="flex items-center gap-2 text-sm font-bold text-slate-900">
                <HeartPulse className="h-4 w-4 text-rose-500" /> Built for trust
              </p>
              <p className="mt-1.5 text-sm leading-relaxed text-stone-500">
                Clean design and honest language make the content easy to read and easy to trust.
              </p>
            </Item>
          </div>
        </div>
      </Item>

      <DemoBar>
        <DemoLink href="/blog" label="Read the Public Blog" icon={BookOpen} />
        <DemoLink href="/dashboard/blogs" label="Open Content Manager" variant="outline" icon={PenLine} />
      </DemoBar>
    </SlideBody>
  );
}