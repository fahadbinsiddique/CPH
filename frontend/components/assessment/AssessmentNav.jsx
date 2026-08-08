'use client'

import { ChevronLeft, ChevronRight, Loader2, CheckCircle2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

/**
 * Previous / Next / Complete controls for the quiz flow. Comfortable
 * tap targets on mobile; clear hierarchy for the primary action.
 */
export default function AssessmentNav({
  onPrevious,
  canPrevious = false,
  isLast = false,
  onNext,
  canProceed = false,
  onSubmit,
  submitting = false,
  answeredCount = 0,
  total = 0,
}) {
  const showSubmit = isLast

  return (
    <div className="mt-6">
      <div className="flex flex-col-reverse gap-3 sm:flex-row sm:items-center sm:justify-between">
        <Button
          variant="outline"
          onClick={onPrevious}
          disabled={!canPrevious || submitting}
          className={cn('h-12 rounded-2xl sm:px-6', !canPrevious && 'invisible sm:invisible')}
        >
          <ChevronLeft className="h-4 w-4" aria-hidden="true" />
          Previous
        </Button>

        {showSubmit ? (
          <Button
            onClick={onSubmit}
            disabled={!canProceed || submitting}
            className="h-12 rounded-2xl bg-teal-700 px-6 text-base font-semibold shadow-md shadow-teal-900/10 hover:bg-teal-800 sm:px-8"
          >
            {submitting ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
                Submitting…
              </>
            ) : (
              <>
                <CheckCircle2 className="h-4 w-4" aria-hidden="true" />
                Complete Assessment
              </>
            )}
          </Button>
        ) : (
          <Button
            onClick={onNext}
            disabled={!canProceed}
            className="h-12 rounded-2xl bg-teal-700 px-8 text-base font-semibold shadow-md shadow-teal-900/10 hover:bg-teal-800"
          >
            Next
            <ChevronRight className="h-4 w-4" aria-hidden="true" />
          </Button>
        )}
      </div>

      <p className="mt-3 text-center text-xs text-slate-400" aria-live="polite">
        {answeredCount} of {total} answered
      </p>
    </div>
  )
}