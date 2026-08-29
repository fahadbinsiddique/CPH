'use client'

import { forwardRef } from 'react'
import { Check } from 'lucide-react'
import { cn } from '@/lib/utils'

/**
 * A single answer option rendered as a radio button. Selection is conveyed
 * with border, fill, icon and aria state — never color alone.
 */
const QuestionOption = forwardRef(function QuestionOption(
  { option, selected = false, onSelect, tabIndex = 0 },
  ref
) {
  return (
    <button
      ref={ref}
      type="button"
      role="radio"
      aria-checked={selected}
      tabIndex={tabIndex}
      onClick={() => onSelect()}
      className={cn(
        'group flex w-full cursor-pointer items-start gap-3.5 rounded-2xl border-2 p-4 text-left transition-all duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-500 focus-visible:ring-offset-2 sm:p-5',
        selected
          ? 'border-teal-600 bg-teal-50/70 ring-1 ring-teal-600/20'
          : 'border-stone-200 bg-white hover:border-teal-300 hover:bg-stone-50/60'
      )}
    >
      <span
        aria-hidden="true"
        className={cn(
          'mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full border-2 transition-colors',
          selected
            ? 'border-teal-600 bg-teal-600 text-white'
            : 'border-stone-300 bg-white group-hover:border-teal-400'
        )}
      >
        {selected && <Check className="h-3 w-3" strokeWidth={3} />}
      </span>
      <span
        className={cn(
          'text-[15px] leading-snug font-medium',
          selected ? 'text-teal-900' : 'text-stone-700'
        )}
      >
        {option.text}
      </span>
    </button>
  )
})

export default QuestionOption