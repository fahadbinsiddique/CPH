'use client'

import { useEffect, useRef, useState, useCallback } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import {
  ArrowLeft,
  ListChecks,
  Lock,
  Lightbulb,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import QuestionOption from '@/components/assessment/QuestionOption'
import AssessmentProgress from '@/components/assessment/AssessmentProgress'
import AssessmentNav from '@/components/assessment/AssessmentNav'
import AssessmentDisclaimer from '@/components/assessment/AssessmentDisclaimer'
import { AssessmentScreenLoader } from '@/components/assessment/AssessmentSkeleton'
import { useHeaderHeight } from '@/hooks/useHeaderHeight'
import { assessmentService } from '@/services/assessmentService'

const KEY_NAV = {
  ArrowDown: 1,
  ArrowRight: 1,
  ArrowUp: -1,
  ArrowLeft: -1,
}

export default function QuizPage() {
  const { slug } = useParams()
  const router = useRouter()
  const headerOffset = useHeaderHeight()

  const [quiz, setQuiz] = useState(null)
  const [started, setStarted] = useState(false)
  const [currentQ, setCurrentQ] = useState(0)
  const [answers, setAnswers] = useState({})
  const [submitting, setSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState(false)

  const optionRefs = useRef([])
  const activeIndex = useRef(0)

  useEffect(() => {
    let cancelled = false
    assessmentService
      .getBySlug(slug)
      .then((res) => {
        if (!cancelled) setQuiz(res.data)
      })
      .catch(() => {
        if (!cancelled) router.push('/assessment')
      })
    return () => {
      cancelled = true
    }
  }, [slug, router])

  const handleAnswer = useCallback((questionId, optionId) => {
    setAnswers((prev) => ({ ...prev, [questionId]: optionId }))
  }, [])

  const handleSubmit = async () => {
    setSubmitting(true)
    setSubmitError(false)
    try {
      const res = await assessmentService.submit({
        quiz_id: quiz.id,
        answers,
      })
      router.push(`/assessment/result/${res.data.id}`)
    } catch {
      setSubmitError(true)
    } finally {
      setSubmitting(false)
    }
  }

  const isLoading = !quiz || quiz.slug !== slug

  if (isLoading) {
    return (
      <main
        className="flex min-h-screen items-center justify-center bg-gradient-to-b from-white via-white to-teal-50/40 px-4"
        style={{ paddingTop: headerOffset }}
      >
        <AssessmentScreenLoader />
      </main>
    )
  }

  const questions = quiz.questions || []
  const totalQ = questions.length
  const currentQuestion = questions[currentQ]
  const answeredCount = Object.keys(answers).length
  const isLastQ = currentQ === totalQ - 1
  const canProceed = answers[currentQuestion?.id] !== undefined

  // Roving tabindex + arrow-key navigation for the answer group.
  const focusOption = (index) => {
    const el = optionRefs.current[index]
    if (el) {
      el.focus()
      activeIndex.current = index
    }
  }

  const handleOptionKeyDown = (e) => {
    const step = KEY_NAV[e.key]
    if (step === undefined || !currentQuestion) return
    e.preventDefault()
    const next = Math.min(
      Math.max(activeIndex.current + step, 0),
      currentQuestion.options.length - 1
    )
    focusOption(next)
    handleAnswer(currentQuestion.id, currentQuestion.options[next].id)
  }

  // Intro screen
  if (!started) {
    return (
      <main className="min-h-screen bg-gradient-to-b from-white via-white to-teal-50/40">
        <div
          className="mx-auto flex min-h-screen w-full max-w-2xl flex-col px-4 py-10 sm:px-6"
          style={{ paddingTop: headerOffset }}
        >
          <Link
            href="/assessment"
            className="mb-6 inline-flex w-fit items-center gap-1.5 text-sm font-semibold text-slate-500 transition-colors hover:text-teal-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-500 focus-visible:ring-offset-2 rounded-lg"
          >
            <ArrowLeft className="h-4 w-4" aria-hidden="true" />
            All assessments
          </Link>

          <motion.div
            initial={{ opacity: 0, scale: 0.98, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            className="overflow-hidden rounded-3xl border border-slate-200/70 bg-white shadow-card"
          >
            <div className="bg-gradient-to-br from-teal-700 to-emerald-700 px-6 py-10 text-center text-white">
              <span className="mb-4 block text-6xl" aria-hidden="true">
                {quiz.icon}
              </span>
              <h1 className="font-heading text-2xl font-bold tracking-tight sm:text-3xl">
                {quiz.title}
              </h1>
              <p className="mx-auto mt-2 max-w-md text-sm leading-relaxed text-teal-50">
                {quiz.description}
              </p>
            </div>

            <div className="p-6 sm:p-8">
              <div className="mb-6 grid grid-cols-3 divide-x divide-slate-100 rounded-2xl bg-slate-50 py-4 text-center">
                <div>
                  <p className="font-heading text-2xl font-bold text-slate-800">
                    {totalQ}
                  </p>
                  <p className="mt-0.5 text-xs text-slate-400">Questions</p>
                </div>
                <div>
                  <p className="font-heading text-2xl font-bold text-slate-800">
                    ~{quiz.duration_minutes}
                  </p>
                  <p className="mt-0.5 text-xs text-slate-400">Minutes</p>
                </div>
                <div>
                  <p className="font-heading text-2xl font-bold text-slate-800">
                    Free
                  </p>
                  <p className="mt-0.5 text-xs text-slate-400">No cost</p>
                </div>
              </div>

              {quiz.instructions && (
                <div className="mb-6 rounded-2xl border border-teal-100 bg-teal-50/70 p-4">
                  <p className="mb-1 flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-teal-700">
                    <Lightbulb className="h-3.5 w-3.5" aria-hidden="true" />
                    Before you start
                  </p>
                  <p className="text-sm leading-relaxed text-teal-900">
                    {quiz.instructions}
                  </p>
                </div>
              )}

              <div className="mb-6 space-y-2 text-xs text-slate-500">
                <p className="flex items-center gap-2">
                  <ListChecks className="h-3.5 w-3.5 text-teal-600" aria-hidden="true" />
                  Answer honestly — there are no right or wrong answers.
                </p>
                <p className="flex items-center gap-2">
                  <Lock className="h-3.5 w-3.5 text-teal-600" aria-hidden="true" />
                  Your responses are confidential and private.
                </p>
              </div>

              <Button
                onClick={() => setStarted(true)}
                className="h-14 w-full rounded-2xl bg-teal-700 text-base font-semibold shadow-md shadow-teal-900/10 hover:bg-teal-800"
              >
                Start Assessment
              </Button>
            </div>
          </motion.div>

          <div className="mt-6">
            <AssessmentDisclaimer compact />
          </div>
        </div>
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-gradient-to-b from-white via-white to-teal-50/40">
      <AssessmentProgress
        current={currentQ}
        total={totalQ}
        title={quiz.title}
        topOffset={headerOffset}
      />

      <div className="mx-auto w-full max-w-2xl px-4 py-8 sm:px-6">
        <AnimatePresence mode="wait" initial={false}>
          <motion.section
            key={currentQ}
            initial={{ opacity: 0, x: 24 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -24 }}
            transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
            className="overflow-hidden rounded-3xl border border-slate-200/70 bg-white p-6 shadow-soft sm:p-8"
            aria-labelledby="question-heading"
          >
            <div className="mb-4 flex items-center gap-2.5">
              <span className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-teal-700 font-heading text-sm font-bold text-white">
                {currentQ + 1}
              </span>
              <span className="text-xs font-medium text-slate-400">
                of {totalQ} — take your time
              </span>
            </div>

            <h2
              id="question-heading"
              className="font-heading text-xl font-bold leading-snug tracking-tight text-slate-900 sm:text-[1.35rem]"
            >
              {currentQuestion?.text}
            </h2>

            <div
              role="radiogroup"
              aria-labelledby="question-heading"
              aria-describedby="answer-hint"
              onKeyDown={handleOptionKeyDown}
              className="mt-6 space-y-3"
            >
              {currentQuestion?.options.map((option, i) => {
                const isSelected = answers[currentQuestion.id] === option.id
                const isRovingAnchor = isSelected || (answers[currentQuestion.id] === undefined && i === 0)
                return (
                  <QuestionOption
                    key={option.id}
                    ref={(node) => {
                      optionRefs.current[i] = node
                    }}
                    option={option}
                    selected={isSelected}
                    tabIndex={isRovingAnchor ? 0 : -1}
                    onSelect={() => {
                      activeIndex.current = i
                      handleAnswer(currentQuestion.id, option.id)
                    }}
                  />
                )
              })}
            </div>
            <p id="answer-hint" className="sr-only">
              Use arrow keys to move between answers and Enter to select.
            </p>
          </motion.section>
        </AnimatePresence>

        {submitError && (
          <div
            role="alert"
            className="mt-4 rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700"
          >
            Something went wrong while submitting. Please try again.
          </div>
        )}

        <AssessmentNav
          onPrevious={() => setCurrentQ((q) => Math.max(0, q - 1))}
          canPrevious={currentQ > 0}
          isLast={isLastQ}
          onNext={() => setCurrentQ((q) => Math.min(totalQ - 1, q + 1))}
          canProceed={canProceed}
          onSubmit={handleSubmit}
          submitting={submitting}
          answeredCount={answeredCount}
          total={totalQ}
        />
      </div>
    </main>
  )
}
