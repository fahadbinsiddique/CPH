'use client';

import { CalendarDays, ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import { DAYS, MONTHS, getDaysInMonth, isDateDisabled } from '../helpers';

export default function StepDate({ currentMonth, onMonthChange, selectedDate, onSelect }) {
  const { firstDay, daysInMonth } = getDaysInMonth(currentMonth);
  const now = new Date();
  now.setHours(0, 0, 0, 0);

  const canGoPrev =
    currentMonth.getFullYear() > now.getFullYear() ||
    (currentMonth.getFullYear() === now.getFullYear() &&
      currentMonth.getMonth() > now.getMonth());

  return (
    <div>
      <div className="mb-5 flex items-center justify-between gap-3">
        <div>
          <h3 className="flex items-center gap-2 text-base font-bold text-slate-900">
            <CalendarDays className="h-4.5 w-4.5 text-teal-600" />
            Select a Date
          </h3>
          <p className="mt-0.5 text-xs text-slate-500">Pick the day for your session</p>
        </div>
        <div className="flex shrink-0 items-center gap-1 rounded-xl border border-slate-200/80 bg-slate-50/80 p-1">
          <button
            type="button"
            aria-label="Previous month"
            disabled={!canGoPrev}
            onClick={() => onMonthChange(-1)}
            className="flex h-7 w-7 cursor-pointer items-center justify-center rounded-lg text-slate-600 transition-all hover:bg-white disabled:cursor-not-allowed disabled:opacity-40"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
          <span className="min-w-[108px] text-center text-sm font-semibold text-slate-800">
            {MONTHS[currentMonth.getMonth()]} {currentMonth.getFullYear()}
          </span>
          <button
            type="button"
            aria-label="Next month"
            onClick={() => onMonthChange(1)}
            className="flex h-7 w-7 cursor-pointer items-center justify-center rounded-lg text-slate-600 transition-all hover:bg-white"
          >
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      </div>

      <div className="mb-2 grid grid-cols-7 gap-1.5">
        {DAYS.map((d) => (
          <div
            key={d}
            className="py-1 text-center text-[11px] font-bold uppercase tracking-wider text-slate-400"
          >
            {d}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-1.5">
        {Array.from({ length: firstDay }).map((_, i) => (
          <div key={`empty-${i}`} />
        ))}
        {Array.from({ length: daysInMonth }).map((_, i) => {
          const day = i + 1;
          const date = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day);
          const disabled = isDateDisabled(date);
          const isSelected = selectedDate && date.getTime() === selectedDate.getTime();
          const isToday = date.getTime() === now.getTime();
          return (
            <button
              key={day}
              type="button"
              onClick={() => onSelect(day)}
              disabled={disabled}
              className={cn(
                'relative flex aspect-square items-center justify-center rounded-xl border-2 text-sm font-semibold transition-all duration-200',
                isSelected
                  ? 'scale-105 border-teal-600 bg-gradient-to-r from-teal-600 to-emerald-600 text-white shadow-lg shadow-teal-600/25'
                  : disabled
                    ? 'cursor-not-allowed border-transparent bg-slate-50/60 text-slate-300'
                    : 'cursor-pointer border-slate-200/70 bg-white text-slate-700 shadow-sm hover:border-teal-300 hover:bg-teal-50 hover:shadow-md'
              )}
            >
              {day}
              {isToday && !isSelected && (
                <span className="absolute bottom-1 h-1 w-1 rounded-full bg-teal-400" />
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
