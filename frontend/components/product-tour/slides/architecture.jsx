'use client';

import { Monitor, ArrowDown, Database, Boxes, Braces } from 'lucide-react';
import { SlideBody, SlideHeader, Item } from './ui';

const modules = ['Authentication', 'Consultants', 'Appointments', 'Assessments', 'Blogs', 'Core'];

function Layer({ icon: Icon, title, subs, accent }) {
  return (
    <Item className="w-full">
      <div className={`flex flex-col items-center gap-3 rounded-3xl border ${accent} bg-white/90 px-6 py-5 shadow-sm sm:flex-row sm:gap-4`}>
        <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-teal-600 to-emerald-600 text-white shadow-md shadow-teal-600/20">
          <Icon className="h-5 w-5" />
        </span>
        <div className="text-center sm:text-left">
          <p className="text-base font-bold text-slate-900">{title}</p>
          {subs && <p className="mt-0.5 text-xs font-medium text-slate-500">{subs}</p>}
        </div>
      </div>
    </Item>
  );
}

const Arrow = () => (
  <Item className="flex justify-center py-0.5">
    <ArrowDown className="h-5 w-5 text-teal-400" />
  </Item>
);

export default function Architecture({ slide }) {
  return (
    <SlideBody>
      <SlideHeader slide={slide} />
      <div className="grid items-start gap-6 lg:grid-cols-[1fr_0.75fr]">
        <div className="space-y-1.5">
          <Layer icon={Monitor} title="Next.js Frontend" subs="React · Tailwind · shadcn/ui · PWA" accent="border-teal-200/70" />
          <Arrow />
          <Layer icon={Braces} title="REST API" subs="JSON over HTTPS · JWT cookie session" accent="border-slate-200/70" />
          <Arrow />
          <Layer icon={Boxes} title="Django REST Framework" subs="Domain apps & views" accent="border-indigo-200/70" />
          <Arrow />
          <div className="rounded-3xl border border-purple-200/70 bg-purple-50/40 px-6 py-4">
            <p className="mb-3 text-center text-xs font-semibold uppercase tracking-[0.16em] text-purple-700">
              Domain Modules
            </p>
            <div className="flex flex-wrap justify-center gap-2">
              {modules.map((m) => (
                <span key={m} className="rounded-xl bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 shadow-sm ring-1 ring-purple-200/60">
                  {m}
                </span>
              ))}
            </div>
          </div>
          <Arrow />
          <Layer icon={Database} title="Database" subs="PostgreSQL as the primary store" accent="border-slate-200/70" />
        </div>

        <Item>
          <div className="flex h-full flex-col gap-4">
            <div className="rounded-3xl border border-slate-200/70 bg-white/85 p-5 shadow-sm">
              <p className="text-sm font-bold text-slate-900">Clean separation of concerns</p>
              <p className="mt-2 text-sm leading-relaxed text-stone-500">
                The interface, the business logic and the data live in separate layers — so each can
                evolve independently.
              </p>
            </div>
            <div className="rounded-3xl border border-emerald-200/60 bg-gradient-to-b from-emerald-50/60 to-white p-5">
              <p className="text-sm font-bold text-emerald-900">Built-in resilience</p>
              <p className="mt-2 text-sm leading-relaxed text-emerald-800">
                On the client side, a service worker and a local data queue make the app faster to
                load and more forgiving of patchy connections.
              </p>
            </div>
            <div className="rounded-3xl border border-slate-200/70 bg-white/85 p-5 shadow-sm">
              <p className="text-sm font-bold text-slate-900">Ready to scale</p>
              <p className="mt-2 text-sm leading-relaxed text-stone-500">
                A stateless API on top of a proper database means the platform can grow from a single
                practice to a larger operation without re-architecting.
              </p>
            </div>
          </div>
        </Item>
      </div>
    </SlideBody>
  );
}