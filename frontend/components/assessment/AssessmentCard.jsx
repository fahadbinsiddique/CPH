'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { Clock, ListChecks, ArrowRight } from 'lucide-react'
import { getCategoryMeta } from './assessmentConfig'

/**
 * Premium, calm assessment card. The entire card is a link and reveals a
 * subtle "Start" affordance on hover — no decoration that competes with
 * comprehension.
 */
export default function AssessmentCard({ quiz, index = 0 }) {
  const meta = getCategoryMeta(quiz.category)

  return (
    <motion.div
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: Math.min(index * 0.07, 0.35), ease: [0.16, 1, 0.3, 1] }}
      className="h-full"
    >
      <Link
        href={`/assessment/${quiz.slug}`}
        className={`group relative flex h-full flex-col rounded-3xl border border-stone-200/70 bg-white p-6 shadow-soft transition-all duration-300 hover:-translate-y-1 hover:shadow-card focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-500 focus-visible:ring-offset-2 ${meta.ring}`}
      >
        <div className="mb-5 flex items-start justify-between gap-3">
          <div
            className={`flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br text-3xl ring-1 ring-inset ${meta.tile}`}
            aria-hidden="true"
          >
            {quiz.icon}
          </div>
          <span
            className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold capitalize ring-1 ring-inset ${meta.badge}`}
          >
            {quiz.category}
          </span>
        </div>

        <h3 className="font-heading text-lg font-bold text-stone-800 transition-colors group-hover:text-teal-700">
          {quiz.title}
        </h3>
        <p className="mt-1.5 line-clamp-2 text-sm leading-relaxed text-stone-500">
          {quiz.description}
        </p>

        <div className="mt-5 flex items-center justify-between border-t border-stone-100 pt-4">
          <div className="flex items-center gap-4 text-xs font-medium text-stone-400">
            <span className="inline-flex items-center gap-1.5">
              <ListChecks className="h-3.5 w-3.5" aria-hidden="true" />
              {quiz.question_count} questions
            </span>
            <span className="inline-flex items-center gap-1.5">
              <Clock className="h-3.5 w-3.5" aria-hidden="true" />
              ~{quiz.duration_minutes} min
            </span>
          </div>
          <span className="inline-flex items-center gap-1 text-sm font-semibold text-teal-700">
            Start
            <ArrowRight
              className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1"
              aria-hidden="true"
            />
          </span>
        </div>
      </Link>
    </motion.div>
  )
}
