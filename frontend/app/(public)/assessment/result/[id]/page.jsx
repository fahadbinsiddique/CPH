'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { ArrowRight, ScrollText, AlertCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import ResultCard from '@/components/assessment/ResultCard'
import AssessmentDisclaimer from '@/components/assessment/AssessmentDisclaimer'
import { ResultSkeleton } from '@/components/assessment/AssessmentSkeleton'
import { useHeaderHeight } from '@/hooks/useHeaderHeight'
import { assessmentService } from '@/services/assessmentService'

export default function ResultPage() {
  const { id } = useParams()
  const router = useRouter()
  const headerOffset = useHeaderHeight()
  const [result, setResult] = useState(null)
  const [error, setError] = useState(false)

  useEffect(() => {
    let cancelled = false
    assessmentService
      .getResultById(id)
      .then((res) => {
        if (!cancelled) setResult(res.data)
      })
      .catch(() => {
        if (!cancelled) setError(true)
      })
    return () => {
      cancelled = true
    }
  }, [id])

  const isLoading = !result || String(result.id) !== String(id)

  if (isLoading) {
    return (
      <main
        className="min-h-screen bg-gradient-to-b from-white via-white to-teal-50/40 pb-16"
        style={{ paddingTop: headerOffset }}
      >
        <div className="mx-auto w-full max-w-2xl px-4 pt-10 sm:px-6">
          <ResultSkeleton />
        </div>
      </main>
    )
  }

  if (error || !result) {
    return (
      <main
        className="flex min-h-screen items-center justify-center bg-gradient-to-b from-white via-white to-teal-50/40 px-4"
        style={{ paddingTop: headerOffset }}
      >
        <div className="w-full max-w-md rounded-3xl border border-stone-200/70 bg-white p-10 text-center shadow-soft">
          <AlertCircle className="mx-auto mb-3 h-10 w-10 text-stone-300" aria-hidden="true" />
          <h1 className="font-heading text-lg font-semibold text-stone-800">
            We couldn&apos;t find this result
          </h1>
          <p className="mt-1 text-sm text-stone-500">
            It may have been removed, or the link is invalid.
          </p>
          <Link href="/assessment" className="mt-6 inline-block">
            <Button className="rounded-2xl bg-teal-700 hover:bg-teal-800">
              Back to assessments
            </Button>
          </Link>
        </div>
      </main>
    )
  }

  const answers = result.answers && Object.keys(result.answers).length > 0
    ? Object.entries(result.answers)
    : []

  return (
    <main className="min-h-screen bg-gradient-to-b from-white via-white to-teal-50/40 pb-16">
      <div className="mx-auto w-full max-w-2xl px-4 sm:px-6" style={{ paddingTop: headerOffset }}>
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          className="space-y-5 pt-8"
        >
          <ResultCard
            result={result}
            onRetake={() => router.push(`/assessment/${result.quiz.slug}`)}
          />

          {answers.length > 0 && (
            <section className="overflow-hidden rounded-3xl border border-stone-200/70 bg-white p-6 shadow-soft sm:p-7">
              <h2 className="mb-5 flex items-center gap-2 font-heading text-base font-bold text-stone-800">
                <ScrollText className="h-4 w-4 text-teal-700" aria-hidden="true" />
                Your responses
              </h2>
              <ul className="space-y-3">
                {answers.map(([qId, ans], i) => (
                  <li key={qId} className="flex gap-3 text-sm">
                    <span className="mt-0.5 inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-stone-100 text-xs font-semibold text-stone-500">
                      {i + 1}
                    </span>
                    <div className="min-w-0">
                      <p className="leading-relaxed text-stone-600">{ans.question}</p>
                      <p className="mt-0.5 text-xs text-stone-400">
                        {ans.answer}
                        <span className="ml-2 text-stone-300">({ans.score} pts)</span>
                      </p>
                    </div>
                  </li>
                ))}
              </ul>
            </section>
          )}

          <AssessmentDisclaimer />

          <div className="pt-1 text-center">
            <Link href="/assessment">
              <Button
                variant="ghost"
                className="rounded-2xl text-base font-semibold text-teal-700 hover:bg-teal-50"
              >
                Take another assessment
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </Button>
            </Link>
          </div>
        </motion.div>
      </div>
    </main>
  )
}