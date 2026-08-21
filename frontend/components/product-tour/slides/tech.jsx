'use client';

import { Monitor, Server, ShieldCheck, Boxes, Sparkles } from 'lucide-react';
import { SlideBody, SlideHeader, Item } from './ui';

const groups = [
  {
    icon: Monitor,
    label: 'Frontend',
    items: ['Next.js', 'React', 'Tailwind CSS', 'shadcn/ui', 'Zustand', 'Framer Motion', 'GSAP', 'Recharts'],
  },
  {
    icon: Server,
    label: 'Backend',
    items: ['Django', 'Django REST Framework', 'Django Filter', 'PostgreSQL', 'Cloudinary'],
  },
  {
    icon: ShieldCheck,
    label: 'Security & Auth',
    items: ['JWT', 'HttpOnly Cookies', 'Google One Tap / FedCM', 'django-cors-headers'],
  },
  {
    icon: Boxes,
    label: 'Platform & Engagement',
    items: ['PWA', 'Service Worker', 'Web Push (VAPID)', 'IndexedDB (idb)', 'Resend Email', 'TipTap Editor'],
  },
];

export default function Tech({ slide }) {
  return (
    <SlideBody>
      <SlideHeader slide={slide} />
      <div className="grid gap-5 md:grid-cols-2">
        {groups.map((g) => {
          const Icon = g.icon;
          return (
            <Item key={g.label}>
              <div className="flex h-full flex-col rounded-3xl border border-slate-200/70 bg-white/85 p-6 shadow-sm">
                <div className="mb-4 flex items-center gap-3">
                  <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-teal-100 to-emerald-100 text-teal-700">
                    <Icon className="h-5 w-5" />
                  </span>
                  <p className="text-base font-bold text-slate-900">{g.label}</p>
                </div>
                <div className="flex flex-wrap gap-2">
                  {g.items.map((t) => (
                    <span
                      key={t}
                      className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs font-semibold text-slate-700"
                    >
                      {t}
                    </span>
                  ))}
                </div>
              </div>
            </Item>
          );
        })}
      </div>
      <Item className="mt-6">
        <div className="mx-auto flex max-w-2xl items-start gap-3 rounded-2xl border border-slate-200/70 bg-white/85 p-4">
          <Sparkles className="mt-0.5 h-5 w-5 shrink-0 text-teal-600" />
          <p className="text-sm leading-relaxed text-stone-600">
            Every technology is a deliberate, well-supported choice — chosen so the platform stays
            fast, secure and maintainable for the long term.
          </p>
        </div>
      </Item>
    </SlideBody>
  );
}