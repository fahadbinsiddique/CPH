import { ShieldCheck } from 'lucide-react'
import { cn } from '@/lib/utils'

/**
 * Consistent informational-care disclaimer reused across the assessment
 * experience.
 */
export default function AssessmentDisclaimer({ className, compact = false }) {
  return (
    <div
      role="note"
      className={cn(
        'flex items-start gap-3 rounded-2xl border border-teal-100 bg-teal-50/70 px-4 py-3.5 text-sm leading-relaxed text-teal-800',
        className
      )}
    >
      <ShieldCheck
        className={cn('mt-0.5 shrink-0 text-teal-600', compact ? 'h-4 w-4' : 'h-5 w-5')}
        aria-hidden="true"
      />
      <p>
        These assessments are for informational purposes only and do not
        constitute a medical diagnosis. Please consult a qualified professional
        for a proper evaluation.
      </p>
    </div>
  )
}