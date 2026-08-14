'use client';

import { CheckCircle2, Shield } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { convertTo12Hour, formatDate } from '../helpers';

export default function StepConfirm({ consultant, selectedDate, selectedSlot, sessionType, message }) {
  return (
    <div>
      <h3 className="mb-5 flex items-center gap-2 text-base font-bold text-slate-900">
        <CheckCircle2 className="h-4.5 w-4.5 text-teal-600" />
        Confirm Appointment
      </h3>

      <div className="space-y-4 rounded-2xl border border-slate-200/70 bg-gradient-to-br from-slate-50 to-white p-5 shadow-sm">
        <div className="flex items-center gap-3 border-b border-slate-200/70 pb-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-full bg-gradient-to-br from-teal-100 to-emerald-100 text-base font-bold text-teal-700">
            {consultant?.user?.full_name?.charAt(0)}
          </div>
          <div className="min-w-0">
            <p className="truncate text-sm font-bold text-slate-900">{consultant?.user?.full_name}</p>
            <p className="truncate text-xs text-slate-500">{consultant?.specializations?.[0]?.name}</p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3 text-sm">
          <div>
            <p className="text-[11px] font-medium uppercase tracking-wider text-slate-400">Date</p>
            <p className="mt-0.5 font-semibold text-slate-800">{formatDate(selectedDate)}</p>
          </div>
          <div>
            <p className="text-[11px] font-medium uppercase tracking-wider text-slate-400">Time</p>
            <p className="mt-0.5 font-semibold text-slate-800">{convertTo12Hour(selectedSlot)}</p>
          </div>
          <div>
            <p className="text-[11px] font-medium uppercase tracking-wider text-slate-400">Session</p>
            <Badge className="mt-1 border border-teal-200 bg-teal-50 text-xs text-teal-700">
              {sessionType === 'online' ? 'Online' : 'In-Person'}
            </Badge>
          </div>
          <div>
            <p className="text-[11px] font-medium uppercase tracking-wider text-slate-400">Fee</p>
            <p className="mt-0.5 font-bold text-slate-900">৳{consultant?.consultation_fee}</p>
          </div>
        </div>

        {message && (
          <div className="border-t border-slate-200/70 pt-3">
            <p className="text-[11px] font-medium uppercase tracking-wider text-slate-400">
              Your Note
            </p>
            <p className="mt-1 rounded-xl border border-slate-100 bg-white/70 p-3 text-sm italic text-slate-600">
              {message}
            </p>
          </div>
        )}
      </div>

      <div className="mt-4 flex items-center gap-3 rounded-xl border border-emerald-200/60 bg-emerald-50/50 p-3">
        <Shield className="h-4 w-4 shrink-0 text-emerald-600" />
        <p className="text-xs text-slate-600">
          <span className="font-semibold text-slate-800">100% secure booking.</span> Your
          information is encrypted and private.
        </p>
      </div>
    </div>
  );
}
