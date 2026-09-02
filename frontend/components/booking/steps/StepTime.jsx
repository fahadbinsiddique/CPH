'use client';

import { Clock } from 'lucide-react';
import { cn } from '@/lib/utils';
import { convertTo12Hour, formatDate } from '../helpers';

export default function StepTime({ selectedDate, availableSlots, selectedSlot, onSelect }) {
  return (
    <div>
      <div className="mb-5 flex items-center justify-between gap-3">
        <div>
          <h3 className="flex items-center gap-2 text-base font-bold text-slate-900">
            <Clock className="h-4.5 w-4.5 text-teal-600" />
            Choose a Time
          </h3>
          <p className="mt-0.5 text-xs text-slate-500">
            {selectedDate ? formatDate(selectedDate) : 'Select your preferred slot'}
          </p>
        </div>
        {selectedDate && (
          <span className="shrink-0 rounded-lg border border-teal-200/70 bg-teal-50 px-2.5 py-1 text-xs font-semibold text-teal-700">
            {selectedDate.toLocaleDateString('en-US', { weekday: 'short' })}
          </span>
        )}
      </div>

      {availableSlots.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-slate-200 bg-slate-50/50 py-12 text-center">
          <Clock className="mb-3 h-8 w-8 text-slate-300" />
          <p className="text-sm font-medium text-slate-500">No available slots for this date</p>
          <p className="mt-1 text-xs text-slate-400">Try selecting a different date</p>
        </div>
      ) : (
        <div className="grid grid-cols-3 gap-2.5 sm:grid-cols-4">
          {availableSlots.map((slot) => {
            const isSelected = selectedSlot === slot.start_time;
            return (
              <button
                key={slot.start_time}
                type="button"
                onClick={() => onSelect(slot.start_time)}
                className={cn(
                  'rounded-xl border-2 px-2 py-2.5 text-center text-[13px] font-semibold transition-all duration-200',
                  isSelected
                    ? 'scale-105 border-teal-600 bg-gradient-to-r from-teal-600 to-emerald-600 text-white shadow-lg shadow-teal-600/25'
                    : 'cursor-pointer border-slate-200/70 bg-white text-slate-700 shadow-sm hover:border-teal-300 hover:bg-teal-50 hover:shadow-md'
                )}
              >
                {convertTo12Hour(slot.start_time)}
              </button>
            );
          })}
        </div>
      )}

      <div className="mt-5 flex flex-wrap items-center gap-4 border-t border-slate-100 pt-4">
        <span className="text-[11px] font-medium text-slate-400">Legend:</span>
        <span className="flex items-center gap-1.5 text-xs text-slate-600">
          <span className="h-3.5 w-3.5 rounded-md bg-gradient-to-r from-teal-600 to-emerald-600" />
          Selected
        </span>
        <span className="flex items-center gap-1.5 text-xs text-slate-600">
          <span className="h-3.5 w-3.5 rounded-md border-2 border-slate-200 bg-white" />
          Available
        </span>
      </div>
    </div>
  );
}
