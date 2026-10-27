'use client'

import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence, useReducedMotion } from 'motion/react'
import { gsap, prefersReducedMotion } from '@/lib/motion'
import { ArrowRight, CheckCircle2, Brain, Heart, Smile, Frown, Minus, Plus, Loader2, Sparkles } from 'lucide-react'
import { Button } from '@/components/ui/button'
import Reveal from '@/components/ui/Reveal'

const questions = [
  {
    id: 'mood',
    text: 'How have you been feeling overall lately?',
    emoji: '😊',
    options: [
      { value: 1, label: 'Very Low', icon: Frown, color: 'text-rose-600 bg-rose-100' },
      { value: 2, label: 'Low', icon: Frown, color: 'text-orange-600 bg-orange-100' },
      { value: 3, label: 'Neutral', icon: Minus, color: 'text-amber-600 bg-amber-100' },
      { value: 4, label: 'Good', icon: Smile, color: 'text-emerald-600 bg-emerald-100' },
      { value: 5, label: 'Great', icon: Smile, color: 'text-teal-600 bg-teal-100' },
    ],
  },
  {
    id: 'stress',
    text: 'How much stress are you experiencing?',
    emoji: '🧠',
    options: [
      { value: 1, label: 'Overwhelming', icon: Brain, color: 'text-rose-600 bg-rose-100' },
      { value: 2, label: 'High', icon: Brain, color: 'text-orange-600 bg-orange-100' },
      { value: 3, label: 'Moderate', icon: Minus, color: 'text-amber-600 bg-amber-100' },
      { value: 4, label: 'Low', icon: Heart, color: 'text-emerald-600 bg-emerald-100' },
      { value: 5, label: 'None', icon: Heart, color: 'text-teal-600 bg-teal-100' },
    ],
  },
  {
    id: 'sleep',
    text: 'How well have you been sleeping?',
    emoji: '🌙',
    options: [
      { value: 1, label: 'Very Poorly', icon: Frown, color: 'text-rose-600 bg-rose-100' },
      { value: 2, label: 'Poorly', icon: Frown, color: 'text-orange-600 bg-orange-100' },
      { value: 3, label: 'Okay', icon: Minus, color: 'text-amber-600 bg-amber-100' },
      { value: 4, label: 'Well', icon: Smile, color: 'text-emerald-600 bg-emerald-100' },
      { value: 5, label: 'Excellent', icon: Smile, color: 'text-teal-600 bg-teal-100' },
    ],
  },
]

const results = {
  high: {
    title: "You're doing well! 🌟",
    description: 'Your mental wellness looks strong. Keep up the great habits!',
    cta: 'Maintain Your Wellness',
    color: 'text-emerald-700',
    bg: 'bg-emerald-50',
    border: 'border-emerald-200',
  },
  medium: {
    title: 'Room for growth 🌱',
    description: "You're managing, but some support could help you thrive.",
    cta: 'Explore Support Options',
    color: 'text-amber-700',
    bg: 'bg-amber-50',
    border: 'border-amber-200',
  },
  low: {
    title: 'You deserve support 💚',
    description: "It looks like you're going through a tough time. Professional help can make a real difference.",
    cta: 'Connect with a Therapist',
    color: 'text-rose-700',
    bg: 'bg-rose-50',
    border: 'border-rose-200',
  },
}

const AssessmentPreview = () => {
  const [currentStep, setCurrentStep] = useState(0)
  const [answers, setAnswers] = useState({})
  const [completed, setCompleted] = useState(false)
  const [result, setResult] = useState(null)
  const [submitting, setSubmitting] = useState(false)
  const sectionRef = useRef(null)
  const reduceMotion = useReducedMotion()

  useEffect(() => {
    if (prefersReducedMotion()) return

    const ctx = gsap.context(() => {
      gsap.fromTo(
        '[data-assessment-card]',
        { opacity: 0, y: 30 },
        {
          opacity: 1,
          y: 0,
          duration: 0.7,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 80%',
            once: true,
          },
        }
      )
    }, sectionRef)

    return () => ctx.revert()
  }, [])

  const handleAnswer = (questionId, value) => {
    setAnswers(prev => ({ ...prev, [questionId]: value }))
    if (currentStep < questions.length - 1) {
      setTimeout(() => setCurrentStep(currentStep + 1), 300)
    } else {
      setTimeout(() => calculateResult(), 300)
    }
  }

  const calculateResult = () => {
    const total = Object.values(answers).reduce((sum, val) => sum + val, 0)
    const average = total / questions.length

    if (average >= 4) setResult('high')
    else if (average >= 2.5) setResult('medium')
    else setResult('low')

    setCompleted(true)
  }

  const handleRestart = () => {
    setCurrentStep(0)
    setAnswers({})
    setCompleted(false)
    setResult(null)
  }

  const handleFullAssessment = async () => {
    setSubmitting(true)
    await new Promise(resolve => setTimeout(resolve, 800))
    window.location.href = '/assessment'
  }

  const progress = ((currentStep + 1) / questions.length) * 100

  if (completed && result) {
    const res = results[result]
    return (
      <section
        ref={sectionRef}
        className="section-pad section-pad-lg relative overflow-hidden bg-gradient-to-b from-stone-50 to-white"
        aria-labelledby="assessment-heading"
      >
        <div className="pointer-events-none absolute inset-0" aria-hidden="true">
          <div className="absolute -top-24 -right-24 h-80 w-80 rounded-full bg-violet-50/50 blur-3xl" />
          <div className="absolute -bottom-24 -left-24 h-80 w-80 rounded-full bg-emerald-50/50 blur-3xl" />
        </div>

        <div className="section-shell relative z-10">
          <Reveal className="section-head" y={24}>
            <h2 id="assessment-heading" className="section-title">
              Try our <span className="gradient-text-primary">mini assessment</span>
            </h2>
            <p className="section-sub">
              Answer 3 quick questions to get a snapshot of your mental wellness — completely anonymous.
            </p>
          </Reveal>

          <Reveal y={20} delay={0.1} className="max-w-xl mx-auto">
            <motion.div
              initial={!reduceMotion ? { opacity: 0, scale: 0.95, y: 20 } : {}}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
              className={`relative rounded-2xl border-2 p-8 md:p-10 text-center ${res.bg} ${res.border} shadow-card`}
            >
              <div className="mb-6">
                <div className="inline-flex h-20 w-20 items-center justify-center rounded-2xl bg-white/80 backdrop-blur-sm mb-4" style={{ boxShadow: 'var(--shadow-neu)' }}>
                  <CheckCircle2 className="h-10 w-10" style={{ color: res.color }} />
                </div>
                <h3 className="text-2xl md:text-3xl font-bold mb-3" style={{ color: res.color }}>
                  {res.title}
                </h3>
                <p className="text-stone-600 leading-relaxed">{res.description}</p>
              </div>

              <div className="space-y-3">
                <Button
                  onClick={handleFullAssessment}
                  disabled={submitting}
                  className="w-full rounded-xl px-8 py-4 text-lg font-semibold"
                  style={{ backgroundColor: res.color.replace('700', '600'), borderColor: res.color.replace('700', '600') }}
                >
                  {submitting ? (
                    <>
                      <Loader2 className="h-5 w-5 animate-spin mr-2" />
                      Redirecting...
                    </>
                  ) : (
                    <>
                      {res.cta}
                      <ArrowRight className="h-5 w-5 ml-2" />
                    </>
                  )}
                </Button>

                <Button
                  variant="outline"
                  onClick={handleRestart}
                  className="w-full rounded-xl px-8 py-3 text-base font-medium"
                >
                  Try Again
                </Button>
              </div>

              <p className="mt-6 text-xs text-stone-500">
                This is a preview. Full assessment takes 5 minutes and provides detailed insights with therapist matching.
              </p>
            </motion.div>
          </Reveal>
        </div>
      </section>
    )
  }

  const currentQuestion = questions[currentStep]

  return (
    <section
      ref={sectionRef}
      className="section-pad section-pad-lg relative overflow-hidden bg-gradient-to-b from-stone-50 to-white"
      aria-labelledby="assessment-heading"
    >
      <div className="pointer-events-none absolute inset-0" aria-hidden="true">
        <div className="absolute -top-24 -right-24 h-80 w-80 rounded-full bg-violet-50/50 blur-3xl" />
        <div className="absolute -bottom-24 -left-24 h-80 w-80 rounded-full bg-emerald-50/50 blur-3xl" />
      </div>

      <div className="section-shell relative z-10">
        <Reveal className="section-head" y={24}>
          <h2 id="assessment-heading" className="section-title">
            Try our <span className="gradient-text-primary">mini assessment</span>
          </h2>
          <p className="section-sub">
            Answer 3 quick questions to get a snapshot of your mental wellness — completely anonymous.
          </p>
        </Reveal>

        <Reveal y={20} delay={0.1} className="max-w-xl mx-auto">
          <div data-assessment-card className="rounded-2xl border border-stone-200/70 bg-white shadow-soft overflow-hidden">
            {/* Progress Bar */}
            <div className="h-1.5 bg-stone-100 overflow-hidden">
              <motion.div
                className="h-full bg-gradient-to-r from-violet-500 to-purple-500"
                initial={!reduceMotion ? { width: 0 } : {}}
                animate={{ width: `${progress}%` }}
                transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
              />
            </div>

            <div className="p-6 md:p-8">
              {/* Step Indicator */}
              <div className="flex items-center justify-between mb-8">
                <span className="text-sm font-medium text-stone-600">
                  Question {currentStep + 1} of {questions.length}
                </span>
                <span className="text-sm font-semibold text-violet-700">
                  {Math.round(progress)}%
                </span>
              </div>

              {/* Question */}
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentQuestion.id}
                  initial={!reduceMotion ? { opacity: 0, x: 20 } : {}}
                  animate={{ opacity: 1, x: 0 }}
                  exit={!reduceMotion ? { opacity: 0, x: -20 } : {}}
                  transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                >
                  <div className="flex items-center gap-3 mb-6">
                    <span className="text-4xl">{currentQuestion.emoji}</span>
                    <h3 className="text-xl md:text-2xl font-bold text-stone-900 leading-snug">
                      {currentQuestion.text}
                    </h3>
                  </div>

                  {/* Options */}
                  <div className="grid grid-cols-5 gap-3" role="radiogroup" aria-label={currentQuestion.text}>
                    {currentQuestion.options.map((option) => {
                      const Icon = option.icon
                      const isSelected = answers[currentQuestion.id] === option.value

                      return (
                        <motion.button
                          key={option.value}
                          onClick={() => handleAnswer(currentQuestion.id, option.value)}
                          role="radio"
                          aria-checked={isSelected}
                          className={`relative group flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition-all duration-300 ${
                            isSelected
                              ? `border-violet-500 bg-violet-50 shadow-lg shadow-violet-500/10`
                              : 'border-stone-200 hover:border-violet-300 hover:bg-violet-50/50'
                          }`}
                          style={!reduceMotion ? { willChange: 'transform, box-shadow, border-color' } : {}}
                          whileHover={!reduceMotion && !isSelected ? { y: -2, scale: 1.02 } : {}}
                          whileTap={!reduceMotion ? { scale: 0.98 } : {}}
                        >
                          <div className={`flex h-10 w-10 items-center justify-center rounded-xl transition-all duration-300 ${option.color}`}>
                            <Icon className="h-5 w-5" aria-hidden="true" />
                          </div>
                          <span className="text-xs font-medium text-stone-700 text-center leading-tight">
                            {option.label}
                          </span>
                          <AnimatePresence>
                            {isSelected && (
                              <motion.div
                                initial={{ scale: 0, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                exit={{ scale: 0, opacity: 0 }}
                                className="absolute -top-2 -right-2 flex h-5 w-5 items-center justify-center rounded-full bg-violet-500 text-white"
                              >
                                <CheckCircle2 className="h-3 w-3" />
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </motion.button>
                      )
                    })}
                  </div>
                </motion.div>
              </AnimatePresence>

              {/* Navigation */}
              <div className="mt-8 flex justify-between">
                <Button
                  variant="ghost"
                  onClick={() => setCurrentStep(Math.max(0, currentStep - 1))}
                  disabled={currentStep === 0}
                  className="text-stone-500 hover:text-stone-700"
                >
                  Back
                </Button>
                {currentStep === questions.length - 1 && (
                  <Button
                    onClick={() => calculateResult()}
                    disabled={!answers[currentQuestion.id]}
                    className="btn-primary"
                  >
                    See My Result
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                )}
              </div>
            </div>
          </div>

          <p className="mt-6 text-center text-sm text-stone-500">
            This is a 3-question preview. The full assessment takes 5 minutes and includes therapist matching.
          </p>
        </Reveal>
      </div>
    </section>
  )
}

export default AssessmentPreview