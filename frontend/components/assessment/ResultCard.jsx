'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { Calendar, RotateCcw, Lightbulb, CalendarCheck2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  getSeverityMeta,
  formatAssessmentDate,
} from './assessmentConfig'

/**
 * Score + interpretation card for a completed assessment. Presents the
 * result calmly: score, supporting description, recommendation and next
 * steps — never as a diagnosis.
 */
export default function ResultCard({ result, onRetake }) {
  const { quiz, score, max_score, percentage, score_range, completed_at } = result
  const severity = score_range?.severity || 'minimal'
  const meta = getSeverityMeta(severity)
  const date = formatAssessmentDate(completed_at)

  return (
    <div
      className={`overflow-hidden rounded-3xl border-2 bg-white shadow-card ${meta.border}`}
    >
      <div className={`${meta.bg} px-6 py-8 text-center`}>
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        >
          <span className="mb-3 block text-5xl" aria-hidden="true">
            {quiz.icon}
          </span>
          <h1 className="font-heading text-xl font-bold text-slate-800">
            {quiz.title}
          </h1>
          <p className="mt-1 text-sm text-slate-500">{date}</p>
        </motion.div>
      </div>

      <div className="p-6 sm:p-8">
        <div className="mb-5 text-center">
          <p className={`font-heading text-5xl font-bold tracking-tight ${meta.text}`}>
            {percentage}%
          </p>
          <p className="mt-1.5 text-sm text-slate-400">
            Score {score} / {max_score}
          </p>
        </div>

        <div className="mb-6 h-2.5 overflow-hidden rounded-full bg-slate-100">
          <motion.div
            className={`h-full rounded-full ${meta.bar}`}
            initial={{ width: 0 }}
            animate={{ width: `${percentage}%` }}
            transition={{ duration: 0.9, delay: 0.2, ease: 'easeOut' }}
            role="presentation"
          />
        </div>

        {score_range?.label && (
          <div className="mb-4 flex justify-center">
            <span
              className={`inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-sm font-semibold ring-1 ring-inset ${meta.chip}`}
            >
              <span aria-hidden="true" className={`h-2 w-2 rounded-full ${meta.dot}`} />
              {score_range.label}
            </span>
          </div>
        )}

        {score_range?.description && (
          <p className="mx-auto mb-5 max-w-md text-center text-sm leading-relaxed text-slate-600">
            {score_range.description}
          </p>
        )}

        {score_range?.recommendation && (
          <div className={`mb-6 rounded-2xl border p-5 ${meta.bg} ${meta.border}`}>
            <p className="mb-1.5 flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-slate-500">
              <Lightbulb className="h-3.5 w-3.5" aria-hidden="true" />
              Good next step
            </p>
            <p className={`text-sm leading-relaxed ${meta.text}`}>
              {score_range.recommendation}
            </p>
          </div>
        )}

        <div className="flex flex-col gap-3 sm:flex-row">
          <Link href="/consultant" className="min-w-0 flex-1">
            <Button className="h-12 w-full rounded-2xl bg-teal-700 text-base font-semibold shadow-md shadow-teal-900/10 hover:bg-teal-800">
              <Calendar className="h-4 w-4" aria-hidden="true" />
              Book a Consultation
            </Button>
          </Link>
          <Button
            variant="outline"
            onClick={onRetake}
            className="h-12 min-w-0 flex-1 rounded-2xl border-slate-200 text-base font-semibold text-slate-700 hover:border-teal-300 hover:bg-teal-50/60 hover:text-teal-800"
          >
            <RotateCcw className="h-4 w-4" aria-hidden="true" />
            Retake
          </Button>
        </div>

        <p className="mt-4 flex items-center justify-center gap-1.5 text-center text-xs text-slate-400">
          <CalendarCheck2 className="h-3.5 w-3.5" aria-hidden="true" />
          Results help guide a conversation — they are not a diagnosis.
        </p>
      </div>
    </div>
  )
}