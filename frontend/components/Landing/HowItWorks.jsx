'use client'

import { useRef, useState } from 'react'
import { motion, AnimatePresence, useReducedMotion } from 'motion/react'
import {
  ArrowRight,
  CheckCircle2,
  ChevronDown,
  Compass,
  Brain,
  Sparkles,
  MessageCircle,
} from 'lucide-react'
import Link from 'next/link'
import Reveal from '@/components/ui/Reveal'

/* Step accents are static class maps: Tailwind scans source files at build
   time, so colour classes assembled at runtime (e.g. `bg-${tone}-50`) are
   never generated. Keep every accent string literal. */
const steps = [
  {
    number: '01',
    icon: Brain,
    visual: 'assessment',
    title: 'Quick Self-Assessment',
    meta: 'About 3 minutes',
    description:
      'Take our 3-minute clinically-validated assessment to understand your mental wellness baseline.',
    details: [
      'Evidence-based PHQ-9 & GAD-7 scales',
      'Instant personalized insights',
      'Completely confidential',
    ],
    accent: {
      gradient: 'from-violet-500 to-purple-500',
      border: 'border-violet-300',
      tint: 'bg-violet-50/50',
      text: 'text-violet-700',
      ring: 'ring-violet-100',
      chip: 'border-violet-100 bg-violet-50/60',
      check: 'text-violet-500',
      blob: 'bg-violet-100',
      ghost: 'text-violet-500/15',
      line: 'bg-violet-400',
      hoverBorder: 'hover:border-violet-200',
      glow: 'shadow-violet-500/15',
      mockAvatar: 'bg-violet-100 text-violet-700',
      mockSolid: 'bg-violet-600 text-white',
      mockSel: 'border-violet-400 bg-violet-50 text-violet-700',
    },
  },
  {
    number: '02',
    icon: Sparkles,
    visual: 'matching',
    title: 'Personalized Matching',
    meta: 'Instant results',
    description:
      'Our intelligent algorithm matches you with therapists who specialize in your specific needs.',
    details: [
      'Specialty & approach matching',
      'Availability & preference filters',
      'Verified credentials & reviews',
    ],
    accent: {
      gradient: 'from-emerald-500 to-teal-500',
      border: 'border-emerald-300',
      tint: 'bg-emerald-50/50',
      text: 'text-emerald-700',
      ring: 'ring-emerald-100',
      chip: 'border-emerald-100 bg-emerald-50/60',
      check: 'text-emerald-600',
      blob: 'bg-emerald-100',
      ghost: 'text-emerald-500/15',
      line: 'bg-emerald-400',
      hoverBorder: 'hover:border-emerald-200',
      glow: 'shadow-emerald-500/15',
      mockAvatar: 'bg-emerald-100 text-emerald-700',
      mockSolid: 'bg-emerald-600 text-white',
      mockSel: 'border-emerald-400 bg-emerald-50 text-emerald-700',
    },
  },
  {
    number: '03',
    icon: MessageCircle,
    visual: 'booking',
    title: 'Start Your Journey',
    meta: 'On your schedule',
    description:
      'Book your first session and begin therapy from the comfort of your own space.',
    details: [
      'Secure video & chat sessions',
      'Flexible scheduling (evenings/weekends)',
      'Progress tracking & resources',
    ],
    accent: {
      gradient: 'from-rose-500 to-pink-500',
      border: 'border-rose-300',
      tint: 'bg-rose-50/50',
      text: 'text-rose-700',
      ring: 'ring-rose-100',
      chip: 'border-rose-100 bg-rose-50/60',
      check: 'text-rose-600',
      blob: 'bg-rose-100',
      ghost: 'text-rose-500/15',
      line: 'bg-rose-400',
      hoverBorder: 'hover:border-rose-200',
      glow: 'shadow-rose-500/15',
      mockAvatar: 'bg-rose-100 text-rose-700',
      mockSolid: 'bg-rose-600 text-white',
      mockSel: 'border-rose-400 bg-rose-50 text-rose-700',
    },
  },
]

/* Decorative product mocks for the showcase panel. Marked aria-hidden in the
   panel — they illustrate the step, the accessible copy lives in the rows. */
const AssessmentVisual = ({ a }) => (
  <div className="rounded-2xl border border-stone-200/70 bg-white p-4 shadow-soft">
    <div className="flex items-center justify-between">
      <span className="text-[11px] font-semibold uppercase tracking-wider text-stone-400">
        PHQ-9 · Question 4 of 9
      </span>
      <span className="text-[11px] font-medium text-stone-400">About 3 min</span>
    </div>
    <p className="mt-2.5 text-sm font-semibold text-stone-700">
      Little interest or pleasure in doing things?
    </p>
    <div className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-4">
      {['Not at all', 'Several days', 'More than half', 'Nearly every day'].map((label, i) => (
        <span
          key={label}
          className={`rounded-xl border px-2 py-2.5 text-center text-[11px] leading-tight ${
            i === 1 ? `${a.mockSel} font-semibold shadow-sm` : 'border-stone-200 bg-stone-50 text-stone-500'
          }`}
        >
          {label}
        </span>
      ))}
    </div>
    <div className="mt-4 h-1.5 overflow-hidden rounded-full bg-stone-100">
      <div className={`h-full w-[44%] rounded-full bg-gradient-to-r ${a.gradient}`} />
    </div>
  </div>
)

const MatchingVisual = ({ a }) => (
  <div className="rounded-2xl border border-stone-200/70 bg-white p-4 shadow-soft">
    <div className="flex items-center justify-between">
      <span className="text-[11px] font-semibold uppercase tracking-wider text-stone-400">
        Best-fit matches
      </span>
      <span className="rounded-full bg-stone-100 px-2 py-0.5 text-[11px] font-medium text-stone-500">
        3 of 42 therapists
      </span>
    </div>
    <div className="mt-3 space-y-2">
      {[
        { initials: 'SR', name: 'Dr. Sarah Reyes, LCSW', focus: 'Anxiety · CBT · Evening slots', match: '98%' },
        { initials: 'MO', name: 'Dr. Marcus Obi, PhD', focus: 'Stress · Mindfulness', match: '95%' },
        { initials: 'JL', name: 'Jordan Lee, LMFT', focus: 'Relationships · Family', match: '92%' },
      ].map((m) => (
        <div
          key={m.name}
          className="flex items-center gap-3 rounded-xl border border-stone-100 bg-stone-50/60 px-3 py-2.5"
        >
          <span
            className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-[11px] font-bold ${a.mockAvatar}`}
          >
            {m.initials}
          </span>
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-semibold text-stone-800">{m.name}</p>
            <p className="truncate text-xs text-stone-500">{m.focus}</p>
          </div>
          <span
            className={`shrink-0 rounded-full px-2 py-1 text-[11px] font-bold ${a.mockSolid}`}
          >
            {m.match}
          </span>
        </div>
      ))}
    </div>
  </div>
)

const BookingVisual = ({ a }) => (
  <div className="rounded-2xl border border-stone-200/70 bg-white p-4 shadow-soft">
    <div className="flex items-center justify-between">
      <span className="text-[11px] font-semibold uppercase tracking-wider text-stone-400">
        Pick a time
      </span>
      <span className="text-[11px] font-medium text-stone-400">This week</span>
    </div>
    <div className="mt-3 grid grid-cols-5 gap-1.5">
      {[['Mon', '28'], ['Tue', '29'], ['Wed', '30'], ['Thu', '1'], ['Fri', '2']].map(
        ([day, date], i) => (
          <span
            key={day}
            className={`rounded-lg border py-1.5 text-center ${
              i === 3 ? `${a.mockSel} font-semibold` : 'border-stone-200 bg-stone-50 text-stone-500'
            }`}
          >
            <span className="block text-[10px]">{day}</span>
            <span className="block text-sm font-bold">{date}</span>
          </span>
        )
      )}
    </div>
    <div className="mt-3 grid grid-cols-3 gap-2">
      {['5:30 PM', '7:00 PM', '8:15 PM'].map((time, i) => (
        <span
          key={time}
          className={`rounded-lg border py-2 text-center text-xs ${
            i === 1 ? `${a.mockSel} font-semibold` : 'border-stone-200 bg-stone-50 text-stone-500'
          }`}
        >
          {time}
        </span>
      ))}
    </div>
    <div
      className={`mt-4 rounded-xl bg-gradient-to-r py-2.5 text-center text-xs font-bold text-white ${a.gradient}`}
    >
      Confirm session
    </div>
  </div>
)

const visuals = {
  assessment: AssessmentVisual,
  matching: MatchingVisual,
  booking: BookingVisual,
}

const HowItWorks = () => {
  const [activeStep, setActiveStep] = useState(0)
  const stepRefs = useRef([])
  const reduceMotion = useReducedMotion()

  const handleKeyDown = (e, index) => {
    let next = null
    if (e.key === 'ArrowDown') {
      next = Math.min(index + 1, steps.length - 1)
    } else if (e.key === 'ArrowUp') {
      next = Math.max(index - 1, 0)
    } else if (e.key === 'Home') {
      next = 0
    } else if (e.key === 'End') {
      next = steps.length - 1
    }
    if (next === null || next === index) return
    e.preventDefault()
    setActiveStep(next)
    stepRefs.current[next]?.focus()
  }

  return (
    <section
      className="section-pad section-pad-lg relative overflow-hidden bg-white"
      aria-labelledby="how-it-works-heading"
    >
      {/* Ambient background: faint dot grid + tinted glows */}
      <div className="pointer-events-none absolute inset-0" aria-hidden="true">
        <div className="absolute inset-0 pattern-dots" />
        <div className="absolute -top-24 -right-24 h-80 w-80 rounded-full bg-violet-100/60 blur-3xl" />
        <div className="absolute -bottom-24 -left-24 h-80 w-80 rounded-full bg-emerald-100/60 blur-3xl" />
      </div>

      <div className="section-shell relative z-10">
        <Reveal className="section-head" y={24}>
          <span className="eyebrow">
            <Compass className="h-3.5 w-3.5" aria-hidden="true" />
            How it works
          </span>
          <h2 id="how-it-works-heading" className="section-title">
            Your path to wellness in <span className="gradient-text-primary">three steps</span>
          </h2>
          <p className="section-sub">
            From understanding your needs to connecting with the right therapist — we make it
            simple, secure, and supportive.
          </p>
        </Reveal>

        <Reveal y={28} delay={0.15} className="lg:grid lg:grid-cols-2 lg:gap-10">
          {/* Left: expandable step rows */}
          <ol className="space-y-4">
            {steps.map((step, index) => {
              const Icon = step.icon
              const accent = step.accent
              const isActive = activeStep === index

              return (
                <li
                  key={step.number}
                  className={`overflow-hidden rounded-2xl border bg-white transition-all duration-300 ${
                    isActive
                      ? `${accent.border} ${accent.tint} shadow-lg ${accent.glow}`
                      : `border-stone-200/80 ${accent.hoverBorder} hover:shadow-card`
                  }`}
                >
                  <h3>
                    <button
                      type="button"
                      ref={(el) => {
                        stepRefs.current[index] = el
                      }}
                      onClick={() => setActiveStep(index)}
                      onKeyDown={(e) => handleKeyDown(e, index)}
                      aria-expanded={isActive}
                      aria-controls={`how-step-panel-${index}`}
                      className="group flex w-full cursor-pointer items-center gap-4 p-5 text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-500 focus-visible:ring-inset"
                    >
                      <span
                        className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl font-heading text-sm font-bold tabular-nums transition-all duration-300 ${
                          isActive
                            ? `bg-gradient-to-br ${accent.gradient} text-white shadow-md ring-4 ${accent.ring}`
                            : 'bg-stone-100 text-stone-500 group-hover:bg-stone-200'
                        }`}
                      >
                        {step.number}
                      </span>
                      <span className="min-w-0 flex-1">
                        <span
                          className={`block font-heading text-base font-bold sm:text-lg ${
                            isActive ? 'text-stone-900' : 'text-stone-700'
                          }`}
                        >
                          {step.title}
                        </span>
                        <span className="mt-0.5 block text-xs font-medium text-stone-500 sm:text-sm">
                          {step.meta}
                        </span>
                      </span>
                      <ChevronDown
                        aria-hidden="true"
                        className={`h-5 w-5 shrink-0 transition-transform duration-300 ${
                          isActive ? `rotate-180 ${accent.text}` : 'text-stone-400 group-hover:text-stone-500'
                        }`}
                      />
                    </button>
                  </h3>

                  <AnimatePresence initial={false}>
                    {isActive ? (
                      <motion.div
                        id={`how-step-panel-${index}`}
                        initial={reduceMotion ? { opacity: 0 } : { height: 0, opacity: 0 }}
                        animate={reduceMotion ? { opacity: 1 } : { height: 'auto', opacity: 1 }}
                        exit={reduceMotion ? { opacity: 0 } : { height: 0, opacity: 0 }}
                        transition={{ duration: reduceMotion ? 0 : 0.35, ease: [0.16, 1, 0.3, 1] }}
                        className="overflow-hidden"
                      >
                        <div className="px-5 pb-5">
                          <div className="sm:pl-[3.75rem]">
                            <p className="text-sm leading-relaxed text-stone-600 sm:text-base">
                              {step.description}
                            </p>
                            <ul className="mt-4 space-y-2" role="list">
                              {step.details.map((detail) => (
                                <li
                                  key={detail}
                                  className={`flex items-start gap-2.5 rounded-xl border px-3.5 py-2.5 text-sm leading-snug text-stone-600 ${accent.chip}`}
                                >
                                  <CheckCircle2
                                    className={`mt-0.5 h-4 w-4 shrink-0 ${accent.check}`}
                                    aria-hidden="true"
                                  />
                                  <span>{detail}</span>
                                </li>
                              ))}
                            </ul>
                            {index < steps.length - 1 && (
                              <p
                                className={`mt-4 flex items-center gap-1.5 text-sm font-semibold ${accent.text}`}
                              >
                                Next up
                                <ArrowRight className="h-4 w-4" aria-hidden="true" />
                                {steps[index + 1].title}
                              </p>
                            )}
                          </div>
                        </div>
                      </motion.div>
                    ) : null}
                  </AnimatePresence>
                </li>
              )
            })}
          </ol>

          {/* Right: showcase panel that swaps with the active step */}
          <div
            className={`relative mt-8 overflow-hidden rounded-3xl border bg-gradient-to-br from-white via-white to-stone-50 shadow-card lg:mt-0 ${
              steps[activeStep].accent.border
            }`}
          >
            <span
              aria-hidden="true"
              className={`absolute inset-x-0 top-0 h-1 bg-gradient-to-r ${steps[activeStep].accent.gradient}`}
            />
            <span
              aria-hidden="true"
              className={`pointer-events-none absolute -right-20 -top-20 h-64 w-64 rounded-full opacity-70 blur-3xl ${steps[activeStep].accent.blob}`}
            />

            <AnimatePresence mode="wait" initial={false}>
              <motion.div
                key={activeStep}
                initial={reduceMotion ? { opacity: 0 } : { opacity: 0, y: 14 }}
                animate={reduceMotion ? { opacity: 1 } : { opacity: 1, y: 0 }}
                exit={reduceMotion ? { opacity: 0 } : { opacity: 0, y: -14 }}
                transition={{ duration: reduceMotion ? 0 : 0.3, ease: [0.16, 1, 0.3, 1] }}
                className="relative flex min-h-[24rem] flex-col p-6 sm:p-8"
              >
                {/* Header */}
                <div className="flex items-start gap-4">
                  <span
                    className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br text-white shadow-md ${steps[activeStep].accent.gradient}`}
                  >
                    {(() => {
                      const ActiveIcon = steps[activeStep].icon
                      return <ActiveIcon className="h-6 w-6" aria-hidden="true" />
                    })()}
                  </span>
                  <div className="min-w-0">
                    <p className="text-xs font-semibold text-stone-400">
                      Step {steps[activeStep].number} of 03
                    </p>
                    <p className="mt-0.5 font-heading text-xl font-bold text-stone-900 sm:text-2xl">
                      {steps[activeStep].title}
                    </p>
                  </div>
                  <span
                    aria-hidden="true"
                    className={`pointer-events-none ml-auto font-heading text-5xl font-extrabold leading-none tabular-nums sm:text-6xl ${steps[activeStep].accent.ghost}`}
                  >
                    {steps[activeStep].number}
                  </span>
                </div>

                {/* Step-specific product mock */}
                <div className="mt-6 flex-1" aria-hidden="true">
                  {(() => {
                    const Visual = visuals[steps[activeStep].visual]
                    return <Visual a={steps[activeStep].accent} />
                  })()}
                </div>

                {/* Progress footer */}
                <div className="mt-6 flex items-center justify-between border-t border-stone-100 pt-4">
                  <div className="flex gap-1.5" aria-hidden="true">
                    {steps.map((s, i) => (
                      <span
                        key={s.number}
                        className={`h-1.5 w-8 rounded-full transition-colors duration-500 ${
                          i <= activeStep ? s.accent.line : 'bg-stone-200'
                        }`}
                      />
                    ))}
                  </div>
                  <span className="text-xs font-semibold text-stone-400">
                    {activeStep + 1} of {steps.length}
                  </span>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </Reveal>

        {/* CTA */}
        <Reveal y={20} delay={0.4} className="mt-16 text-center">
          <Link href="/assessment" className="btn-primary-lg group">
            Start Free Assessment
            <ArrowRight className="h-5 w-5 transition-transform duration-300 group-hover:translate-x-1" />
          </Link>
          <p className="mt-4 text-sm text-stone-500">
            Takes 3 minutes · No credit card · Completely confidential
          </p>
        </Reveal>
      </div>
    </section>
  )
}

export default HowItWorks
