'use client'

import { useEffect, useState, useCallback } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import {
  ClipboardList,
  TrendingUp,
  RotateCcw,
  ArrowRight,
  CalendarDays,
  AlertCircle,
  Brain,
} from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import PageHeader from '@/components/dashboard/ui/PageHeader'
import EmptyState from '@/components/dashboard/ui/EmptyState'
import AuthGuard from '@/components/shared/AuthGuard'
import {
  getSeverityMeta,
  getCategoryMeta,
  formatCompactDate,
} from '@/components/assessment/assessmentConfig'
import { assessmentService } from '@/services/assessmentService'

export default function AssessmentHistoryPage() {
  const [results, setResults] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)

  const fetchResults = useCallback(() => {
    return assessmentService
      .getResults()
      .then((res) => setResults(res.data.results || res.data))
      .catch(() => setError(true))
      .finally(() => setLoading(false))
  }, [])

  useEffect(() => {
    fetchResults()
  }, [fetchResults])

  const handleRetry = () => {
    setLoading(true)
    setError(false)
    fetchResults()
  }

  return (
    <AuthGuard>
      <div className="max-w-3xl space-y-6">
        <PageHeader
          badge="Assessment History"
          badgeIcon={Brain}
          title="Your Assessments"
          subtitle={`${results.length} ${results.length === 1 ? 'assessment' : 'assessments'} taken`}
          actions={
            <Link href="/assessment">
              <Button className="dash-cta">
                <ClipboardList className="h-4 w-4" aria-hidden="true" />
                Take New
              </Button>
            </Link>
          }
        />

        {loading ? (
          <div className="space-y-3" aria-hidden="true">
            {Array.from({ length: 3 }).map((_, i) => (
              <div
                key={i}
                className="animate-pulse rounded-2xl border border-slate-200/70 bg-white p-5 shadow-soft"
              >
                <div className="flex items-center gap-4">
                  <div className="h-12 w-12 shrink-0 rounded-xl bg-slate-100" />
                  <div className="flex-1 space-y-2">
                    <div className="h-4 w-2/3 rounded bg-slate-100" />
                    <div className="h-3 w-1/3 rounded bg-slate-100" />
                  </div>
                  <div className="hidden h-9 w-24 rounded-lg bg-slate-100 sm:block" />
                </div>
              </div>
            ))}
          </div>
        ) : error ? (
          <Card className="rounded-2xl border-0 shadow-soft">
            <CardContent className="p-12 text-center">
              <AlertCircle className="mx-auto mb-3 h-12 w-12 text-slate-200" aria-hidden="true" />
              <p className="mb-4 text-slate-500">We couldn&apos;t load your history.</p>
              <Button onClick={handleRetry} className="rounded-2xl bg-teal-700 hover:bg-teal-800">
                Try again
              </Button>
            </CardContent>
          </Card>
        ) : results.length > 0 ? (
          <div className="space-y-3">
            {results.map((result, i) => {
              const severity = result.score_range?.severity || 'minimal'
              const meta = getSeverityMeta(severity)
              const category = getCategoryMeta(result.quiz?.category)
              const date = formatCompactDate(result.completed_at)

              return (
                <motion.div
                  key={result.id}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: Math.min(i * 0.05, 0.3) }}
                >
                  <div className="flex items-center gap-4 rounded-2xl border border-slate-200/60 bg-white/80 p-4 shadow-sm backdrop-blur-sm transition-all duration-500 hover:border-teal-500/20 hover:shadow-xl hover:shadow-teal-600/5 sm:p-5">
                    <div
                      className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br text-2xl ring-1 ring-inset ${category.tile}`}
                      aria-hidden="true"
                    >
                      {result.quiz?.icon}
                    </div>

                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-bold tracking-tight text-slate-800">
                        {result.quiz?.title}
                      </p>
                      <div className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-0.5">
                        <span className={`text-xs font-semibold ${meta.text}`}>
                          {result.score_range?.label || 'Completed'}
                        </span>
                        <span className="flex items-center gap-1 text-xs text-slate-400">
                          <CalendarDays className="h-3 w-3" aria-hidden="true" />
                          {date}
                        </span>
                      </div>
                    </div>

                    <div className="hidden shrink-0 text-right sm:block">
                      <p className={`text-xl font-bold tracking-tight ${meta.text}`}>{result.percentage}%</p>
                      <p className="text-xs text-slate-400">
                        {result.score}/{result.max_score}
                      </p>
                    </div>

                    <div className="flex shrink-0 gap-1.5">
                      <Link
                        href={`/assessment/result/${result.id}`}
                        aria-label={`View ${result.quiz?.title} result`}
                        className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 text-slate-400 transition-colors hover:border-teal-300 hover:bg-teal-50 hover:text-teal-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-500 focus-visible:ring-offset-2"
                      >
                        <TrendingUp className="h-4 w-4" aria-hidden="true" />
                      </Link>
                      <Link
                        href={`/assessment/${result.quiz?.slug}`}
                        aria-label={`Retake ${result.quiz?.title}`}
                        className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 text-slate-400 transition-colors hover:border-teal-300 hover:bg-teal-50 hover:text-teal-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-500 focus-visible:ring-offset-2"
                      >
                        <RotateCcw className="h-4 w-4" aria-hidden="true" />
                      </Link>
                    </div>
                  </div>
                </motion.div>
              )
            })}
          </div>
        ) : (
          <EmptyState
            icon={ClipboardList}
            title="No assessments taken yet"
            description="Completing your first assessment takes about five minutes."
            action={
              <Link href="/assessment">
                <Button className="dash-cta">
                  Take Your First Assessment
                  <ArrowRight className="h-4 w-4" aria-hidden="true" />
                </Button>
              </Link>
            }
          />
        )}
      </div>
    </AuthGuard>
  )
}