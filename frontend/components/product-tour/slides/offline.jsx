'use client';

import { Wifi, WifiOff, Database, RefreshCcw, CheckCircle2, Info } from 'lucide-react';
import { SlideBody, SlideHeader, Item } from './ui';

function Node({ icon: NodeIcon, title, desc, className }) {
  return (
    <div className={`rounded-2xl border border-slate-200/70 bg-white/85 px-5 py-4 text-center shadow-sm ${className || ''}`}>
      <NodeIcon className="mx-auto mb-2 h-6 w-6 text-teal-600" />
      <p className="text-sm font-bold text-slate-900">{title}</p>
      <p className="mt-1 text-xs text-slate-500">{desc}</p>
    </div>
  );
}

export default function Offline({ slide }) {

  return (
    <SlideBody>
      <SlideHeader slide={slide} />
      <div className="grid items-start gap-6 lg:grid-cols-2">
        <Item>
          <p className="mb-4 text-xs font-semibold uppercase tracking-[0.16em] text-slate-400">When online</p>
          <div className="rounded-3xl border border-emerald-200/60 bg-gradient-to-b from-emerald-50/60 to-white p-5 shadow-sm">
            <Node
              icon={Wifi}
              title="Connected"
              desc="Requests go straight to the platform API"
              className="border-emerald-200/70"
            />
            <div className="my-2 text-center text-xs font-semibold text-emerald-600">▼</div>
            <Node
              icon={CheckCircle2}
              title="Confirmation"
              desc="Actions are processed instantly"
              className="border-emerald-200/70"
            />
          </div>

          <p className="mt-8 mb-4 text-xs font-semibold uppercase tracking-[0.16em] text-slate-400">When offline</p>
          <div className="rounded-3xl border border-slate-200/70 bg-white/85 p-5 shadow-sm">
            <Node
              icon={WifiOff}
              title="Connection Lost"
              desc="The platform keeps working"
            />
            <div className="my-2 text-center text-xs font-semibold text-slate-400">▼</div>
            <Node
              icon={Database}
              title="Local Queue"
              desc="Important actions are stored on the device"
            />
            <div className="my-2 text-center text-xs font-semibold text-slate-400">▼</div>
            <Node
              icon={RefreshCcw}
              title="Auto-Sync"
              desc="Reconnected → queued actions are submitted"
            />
          </div>
        </Item>

        <Item>
          <div className="space-y-4">
            <div className="rounded-2xl border border-slate-200/70 bg-white/85 p-5 shadow-sm">
              <p className="text-sm font-bold text-slate-900">How it works under the hood</p>
              <p className="mt-1.5 text-sm leading-relaxed text-stone-500">
                Lightweight storage on the device (IndexedDB) holds a local queue of pending actions.
                When the connection returns, the queue is flushed automatically.
              </p>
            </div>
            <div className="rounded-2xl border border-amber-200/70 bg-amber-50/70 p-5">
              <div className="flex items-start gap-3">
                <Info className="mt-0.5 h-5 w-5 shrink-0 text-amber-600" />
                <p className="text-sm leading-relaxed text-amber-900">
                  Not every action is designed to run offline — core experiences like viewing public
                  content and queuing key actions are what is supported today. The connection status
                  is always shown clearly.
                </p>
              </div>
            </div>
            <div className="rounded-2xl border border-slate-200/70 bg-white/85 p-5 shadow-sm">
              <p className="text-sm font-bold text-slate-900">The result</p>
              <p className="mt-1.5 text-sm leading-relaxed text-stone-500">
                A platform that is honest about connectivity and resilient where it matters — no lost
                bookings on a shaky connection.
              </p>
            </div>
          </div>
        </Item>
      </div>
    </SlideBody>
  );
}