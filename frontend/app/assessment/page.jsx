'use client'

import { useEffect, useState, useCallback } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { Lock, Gift, Brain, AlertCircle, ClipboardList, ShieldCheck } from 'lucide-react'
import { Button } from '@/components/ui/button'
import AssessmentCard from '@/components/assessment/AssessmentCard'
import AssessmentDisclaimer from '@/components/assessment/AssessmentDisclaimer'
import { AssessmentListSkeleton } from '@/components/assessment/AssessmentSkeleton'
import { useHeaderHeight } from '@/hooks/useHeaderHeight'
import { assessmentService } from '@/services/assessmentService'

const TRUST_POINTS = [
  {
    icon: Lock,
    title: 'Private & confidential',
    text: 'Your responses and results stay between you and our team.',
  },
  {
    icon: Gift,
    title: 'Free to complete',
    text: 'No cost, no credit card — just a few quiet minutes.',
  },
  {
    icon: Brain,
    title: 'Informational only',
    text: 'Results simply help you understand yourself. They are not a diagnosis.',
  },
]

export default function AssessmentListPage() {
  const headerOffset = useHeaderHeight()
  const [quizzes, setQuizzes] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)

  const fetchQuizzes = useCallback(() => {
    return assessmentService
      .getAll()
      .then((res) => setQuizzes(res.data))
      .catch(() => setError(true))
      .finally(() => setLoading(false))
  }, [])

  useEffect(() => {
    fetchQuizzes()
  }, [fetchQuizzes])

  const handleRetry = () => {
    setLoading(true)
    setError(false)
    fetchQuizzes()
  }

  return (
    <main className="min-h-screen bg-gradient-to-b from-white via-white to-teal-50/40">
      <div className="mx-auto w-full max-w-5xl px-4 sm:px-6" style={{ paddingTop: headerOffset }}>
        {/* Intro */}
        <div className="pt-12 pb-14 text-center sm:pt-16">
          <motion.div
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          >
            <span className="mb-5 inline-flex items-center gap-2 rounded-full border border-teal-200/70 bg-teal-50/80 px-3.5 py-1.5 text-xs font-semibold tracking-wide text-teal-700">
              <ShieldCheck className="h-3.5 w-3.5" aria-hidden="true" />
              Confidential screening
            </span>
            <h1 className="mx-auto max-w-2xl font-heading text-3xl font-bold tracking-tight text-stone-900 md:text-4xl">
              Understand how you&apos;re doing, gently
            </h1>
            <p className="mx-auto mt-4 max-w-xl text-base leading-relaxed text-stone-500 md:text-lg">
              Take a short, private self-assessment to reflect on your mental
              health. Your answers help you spot patterns — and give you a clear
              next step.
            </p>
          </motion.div>
        </div>

        {loading ? (
          <AssessmentListSkeleton />
        ) : error ? (
          <div className="rounded-3xl border border-stone-200/70 bg-white p-10 text-center shadow-soft">
            <AlertCircle className="mx-auto mb-3 h-10 w-10 text-stone-300" aria-hidden="true" />
            <h2 className="font-heading text-lg font-semibold text-stone-800">
              We couldn&apos;t load the assessments
            </h2>
            <p className="mt-1 text-sm text-stone-500">
              Please try again in a moment.
            </p>
            <Button onClick={handleRetry} className="mt-5 rounded-2xl bg-teal-700 hover:bg-teal-800">
              Try again
            </Button>
          </div>
        ) : quizzes.length === 0 ? (
          <div className="rounded-3xl border border-stone-200/70 bg-white p-10 text-center shadow-soft">
            <ClipboardList className="mx-auto mb-3 h-10 w-10 text-stone-300" aria-hidden="true" />
            <h2 className="font-heading text-lg font-semibold text-stone-800">
              No assessments available right now
            </h2>
            <p className="mt-1 text-sm text-stone-500">
              Please check back soon.
            </p>
          </div>
        ) : (
          <div className="grid gap-5 sm:grid-cols-2 sm:gap-6">
            {quizzes.map((quiz, i) => (
              <AssessmentCard key={quiz.id} quiz={quiz} index={i} />
            ))}
          </div>
        )}

        {/* Trust row */}
        <motion.section
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
          className="mt-14 grid gap-4 sm:grid-cols-3"
          aria-label="What to expect"
        >
          {TRUST_POINTS.map((point) => (
            <div
              key={point.title}
              className="rounded-2xl border border-stone-200/70 bg-white/80 p-5 shadow-soft"
            >
              <div className="mb-3 inline-flex h-10 w-10 items-center justify-center rounded-xl bg-teal-50 ring-1 ring-inset ring-teal-100">
                <point.icon className="h-5 w-5 text-teal-700" aria-hidden="true" />
              </div>
              <p className="font-heading text-sm font-semibold text-stone-800">
                {point.title}
              </p>
              <p className="mt-1 text-xs leading-relaxed text-stone-500">{point.text}</p>
            </div>
          ))}
        </motion.section>

        <div className="py-12">
          <AssessmentDisclaimer />
        </div>

        <div className="pb-14 text-center">
          <Link
            href="/consultant"
            className="text-sm font-semibold text-teal-700 underline-offset-4 hover:underline"
          >
            Prefer to talk to a professional directly? Meet our consultants
          </Link>
        </div>
      </div>
    </main>
  )
}