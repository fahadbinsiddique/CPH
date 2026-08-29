'use client';

import { User } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { SESSION_TYPES } from '../helpers';

export default function StepDetails({ sessionType, onSessionTypeChange, message, onMessageChange }) {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="mb-1 flex items-center gap-2 text-base font-bold text-slate-900">
          <User className="h-4.5 w-4.5 text-teal-600" />
          Session Details
        </h3>
        <p className="text-xs text-slate-500">
          Tell us how you&apos;d like to connect and what you need.
        </p>
      </div>

      <div>
        <Label className="mb-3 block text-sm font-semibold text-slate-700">Session Type</Label>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          {SESSION_TYPES.map(({ value, label, icon: Icon, desc, color }) => {
            const active = sessionType === value;
            return (
              <button
                key={value}
                type="button"
                onClick={() => onSessionTypeChange(value)}
                className={cn(
                  'relative cursor-pointer overflow-hidden rounded-2xl border-2 p-4 text-left transition-all duration-300',
                  active
                    ? 'border-teal-500 bg-gradient-to-br from-teal-50/80 to-emerald-50/40 shadow-lg shadow-teal-500/10'
                    : 'border-slate-200 bg-white hover:border-teal-200 hover:bg-slate-50/50'
                )}
              >
                <div
                  className={cn(
                    'inline-flex rounded-xl p-2.5 transition-colors',
                    active ? `bg-gradient-to-br ${color} text-white` : 'bg-slate-100 text-slate-400'
                  )}
                >
                  <Icon className="h-5 w-5" />
                </div>
                <div
                  className={cn(
                    'mt-2 text-sm font-bold',
                    active ? 'text-slate-900' : 'text-slate-700'
                  )}
                >
                  {label}
                </div>
                <div className="mt-0.5 text-xs text-slate-400">{desc}</div>
                {active && <span className="absolute right-3 top-3 h-2 w-2 rounded-full bg-teal-500" />}
              </button>
            );
          })}
        </div>
      </div>

      <div>
        <Label className="mb-2 block text-sm font-semibold text-slate-700">
          Notes for your consultant
          <span className="ml-2 text-xs font-normal text-slate-400">(optional)</span>
        </Label>
        <Textarea
          placeholder="Share anything you'd like the consultant to know before your session..."
          value={message}
          onChange={(e) => onMessageChange(e.target.value)}
          rows={4}
          className="resize-none rounded-2xl border-slate-200 bg-white/60 p-4 shadow-sm focus:border-teal-400 focus:ring-teal-400/20"
        />
      </div>
    </div>
  );
}
