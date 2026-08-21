'use client';

import { Clock, CalendarOff, CalendarCheck2, Save } from 'lucide-react';
import { SlideBody, SlideHeader, Item, DemoBar, DemoLink } from './ui';

const days = ['Sat', 'Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri'];

export default function Availability({ slide }) {
  return (
    <SlideBody>
      <SlideHeader slide={slide} />
      <div className="grid items-start gap-6 lg:grid-cols-2">
        {/* Weekly availability grid mock */}
        <Item>
          <div className="rounded-3xl border border-slate-200/70 bg-white/85 p-5 shadow-sm">
            <div className="mb-4 flex items-center justify-between">
              <p className="flex items-center gap-2 text-sm font-bold text-slate-900">
                <Clock className="h-4 w-4 text-teal-600" />
                Weekly Schedule
              </p>
              <span className="rounded-lg bg-emerald-50 px-2.5 py-1 text-[11px] font-semibold text-emerald-700">
                Saved
              </span>
            </div>
            <div className="grid grid-cols-7 gap-2">
              {days.map((d, i) => (
                <div key={d} className="flex flex-col items-center gap-1.5">
                  <span className="text-[10px] font-bold uppercase text-slate-400">{d}</span>
                  <div
                    className={
                      i < 6
                        ? 'flex h-16 w-full flex-col items-center justify-center rounded-xl border border-teal-200/70 bg-teal-50/70 text-center'
                        : 'flex h-16 w-full flex-col items-center justify-center rounded-xl border border-slate-200 bg-slate-50 text-center'
                    }
                  >
                    {i < 6 ? (
                      <>
                        <span className="text-[10px] font-bold text-teal-700">08:00 – 20:00</span>
                        <span className="text-[9px] font-medium text-teal-500">Open</span>
                      </>
                    ) : (
                      <span className="text-[9px] font-medium text-slate-400">Closed</span>
                    )}
                  </div>
                </div>
              ))}
            </div>
            <p className="mt-3 text-[11px] font-medium text-slate-400">
              Consultants define their own recurring windows — the system then respects them during booking.
            </p>
          </div>
        </Item>

        <Item>
          <div className="space-y-3">
            <div className="rounded-2xl border border-slate-200/70 bg-white/85 p-5 shadow-sm">
              <div className="flex items-center gap-3">
                <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-50 text-amber-600">
                  <CalendarCheck2 className="h-5 w-5" />
                </span>
                <div>
                  <p className="text-sm font-bold text-slate-900">Only open slots are bookable</p>
                  <p className="text-xs text-slate-500">
                    During booking, today&apos;s already-taken times are excluded automatically.
                  </p>
                </div>
              </div>
            </div>
            <div className="rounded-2xl border border-slate-200/70 bg-white/85 p-5 shadow-sm">
              <div className="flex items-center gap-3">
                <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600">
                  <Save className="h-5 w-5" />
                </span>
                <div>
                  <p className="text-sm font-bold text-slate-900">Consultant-controlled</p>
                  <p className="text-xs text-slate-500">
                    Consultants keep their own calendar current, without a middleman.
                  </p>
                </div>
              </div>
            </div>
            <div className="rounded-2xl border border-slate-200/70 bg-white/85 p-5 shadow-sm">
              <div className="flex items-center gap-3">
                <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
                  <CalendarOff className="h-5 w-5" />
                </span>
                <div>
                  <p className="text-sm font-bold text-slate-900">Less manual coordination</p>
                  <p className="text-xs text-slate-500">
                    Clients self-serve open times, which dramatically reduces back-and-forth scheduling.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </Item>
      </div>

      <Item className="mt-6">
        <p className="max-w-3xl text-sm leading-relaxed text-stone-500">
          The benefit: a scheduling system that keeps itself honest — clients pick real open times,
          and consultants retain full control of their own availability.
        </p>
      </Item>

      <DemoBar>
        <DemoLink href="/consultant" label="See Availability in Action" icon={CalendarCheck2} />
        <DemoLink href="/dashboard/availability" label="Open Availability Manager" variant="outline" icon={Clock} />
      </DemoBar>
    </SlideBody>
  );
}