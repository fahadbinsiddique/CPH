import { cn } from '@/lib/utils'

/**
 * Loading-state placeholders styled in the same calm card language as the
 * real screens — no spinner flash-jars.
 */
export function AssessmentListSkeleton({ count = 4, className }) {
  return (
    <div className={cn('grid gap-5 sm:grid-cols-2', className)} aria-hidden="true">
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          className="animate-pulse rounded-3xl border border-slate-200/70 bg-white p-6 shadow-soft"
        >
          <div className="mb-5 flex items-start justify-between">
            <div className="h-14 w-14 rounded-2xl bg-slate-100" />
            <div className="h-6 w-20 rounded-full bg-slate-100" />
          </div>
          <div className="h-5 w-3/4 rounded-lg bg-slate-100" />
          <div className="mt-3 h-4 w-full rounded bg-slate-100" />
          <div className="mt-2 h-4 w-2/3 rounded bg-slate-100" />
          <div className="mt-6 flex items-center justify-between border-t border-slate-100 pt-4">
            <div className="h-3 w-28 rounded bg-slate-100" />
            <div className="h-4 w-12 rounded bg-slate-100" />
          </div>
        </div>
      ))}
    </div>
  )
}

export function AssessmentScreenLoader({ label = 'Preparing your assessment…' }) {
  return (
    <div
      role="status"
      aria-live="polite"
      className="flex min-h-[60vh] flex-col items-center justify-center gap-4"
    >
      <div className="relative h-12 w-12">
        <div className="absolute inset-0 animate-ping rounded-full bg-teal-200/60" />
        <div className="absolute inset-2 animate-pulse rounded-full bg-teal-600" />
      </div>
      <p className="text-sm text-slate-400">{label}</p>
    </div>
  )
}

export function ResultSkeleton() {
  return (
    <div className="animate-pulse space-y-5" aria-hidden="true">
      <div className="rounded-3xl border border-slate-200/70 bg-white p-8 shadow-soft">
        <div className="mx-auto mb-6 h-14 w-14 rounded-2xl bg-slate-100" />
        <div className="mx-auto h-6 w-48 rounded-lg bg-slate-100" />
        <div className="mx-auto mt-3 h-4 w-32 rounded bg-slate-100" />
        <div className="mx-auto mt-8 h-14 w-32 rounded-xl bg-slate-100" />
        <div className="mt-8 h-3 w-full rounded-full bg-slate-100" />
        <div className="mt-8 flex gap-3">
          <div className="h-12 flex-1 rounded-2xl bg-slate-100" />
          <div className="h-12 flex-1 rounded-2xl bg-slate-100" />
        </div>
      </div>
    </div>
  )
}