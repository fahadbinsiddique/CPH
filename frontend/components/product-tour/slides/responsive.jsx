'use client';

import Image from 'next/image';
import { Monitor, Tablet, Smartphone } from 'lucide-react';
import { SlideBody, SlideHeader, Item } from './ui';

export default function Responsive({ slide }) {
  return (
    <SlideBody>
      <SlideHeader slide={slide} />
      <div className="mb-6 grid gap-3 sm:grid-cols-3">
        {[
          { icon: Monitor, label: 'Desktop', desc: 'Full dashboard & public site' },
          { icon: Tablet, label: 'Tablet', desc: 'Comfortable touch layouts' },
          { icon: Smartphone, label: 'Mobile', desc: 'Compact, fast navigation' },
        ].map((d) => {
          const Icon = d.icon;
          return (
            <Item key={d.label}>
              <div className="flex items-center gap-3 rounded-2xl border border-slate-200/70 bg-white/85 px-4 py-3 shadow-sm">
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-teal-100 to-emerald-100 text-teal-700">
                  <Icon className="h-5 w-5" />
                </span>
                <div>
                  <p className="text-sm font-bold text-slate-900">{d.label}</p>
                  <p className="text-xs text-slate-500">{d.desc}</p>
                </div>
              </div>
            </Item>
          );
        })}
      </div>

      <div className="grid items-stretch gap-6 lg:grid-cols-[1.5fr_0.5fr]">
        <Item>
          <div className="overflow-hidden rounded-3xl border border-slate-200/70 bg-white/90 shadow-card">
            <div className="flex items-center gap-1.5 border-b border-slate-100 bg-slate-50/80 px-4 py-2.5">
              <span className="h-2.5 w-2.5 rounded-full bg-rose-300" />
              <span className="h-2.5 w-2.5 rounded-full bg-amber-300" />
              <span className="h-2.5 w-2.5 rounded-full bg-emerald-300" />
              <span className="ml-2 rounded-lg bg-white px-2.5 py-0.5 text-[10px] font-semibold text-slate-400">
                cph · desktop
              </span>
            </div>
            <div className="relative aspect-video w-full overflow-hidden bg-slate-100">
              <Image
                src="/screenshots/desktop.png"
                alt="CPH platform on a desktop screen"
                fill
                sizes="(max-width: 900px) 95vw, 70vw"
                className="object-cover"
              />
            </div>
          </div>
        </Item>

        <Item>
          <div className="mx-auto flex h-full w-56 flex-col overflow-hidden rounded-[2rem] border-4 border-slate-200 bg-white shadow-card">
            <div className="relative aspect-[9/19] w-full overflow-hidden bg-slate-100">
              <Image
                src="/screenshots/mobile.png"
                alt="CPH platform on a mobile screen"
                fill
                sizes="(max-width: 900px) 60vw, 25vw"
                className="object-cover"
              />
            </div>
          </div>
        </Item>
      </div>

      <Item className="mt-6">
        <p className="max-w-3xl text-sm leading-relaxed text-stone-500">
          The same data and flows adapt to every screen — a single platform that travels with the
          client from office to commute to home.
        </p>
      </Item>
    </SlideBody>
  );
}