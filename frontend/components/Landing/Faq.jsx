'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Plus, Minus } from 'lucide-react'
import Reveal from '@/components/ui/Reveal'

const faqs = [
  {
    question: 'Is my data and conversation private?',
    answer:
      'Yes. All your data is fully encrypted and confidential. We follow strict privacy standards to ensure your information is always secure.',
  },
  {
    question: 'Are the therapists licensed and verified?',
    answer:
      'Absolutely. Every therapist on our platform is licensed, certified, and carefully verified before joining.',
  },
  {
    question: 'How do online therapy sessions work?',
    answer:
      'You can book a session, connect via secure video or chat, and talk with your therapist from anywhere at your convenience.',
  },
  {
    question: 'Can I choose my therapist?',
    answer:
      'Yes. You can browse profiles, specialties, ratings, and select a therapist that matches your needs or use our matching system.',
  },
  {
    question: 'What issues can therapy help with?',
    answer:
      'Our therapists support anxiety, depression, stress, trauma, relationship issues, self-growth, and more.',
  },
]

const Faq = () => {
  const [openIndex, setOpenIndex] = useState(0)

  const toggle = (index) => {
    setOpenIndex(openIndex === index ? -1 : index)
  }

  return (
    <section className="section-pad relative overflow-hidden bg-white">
      <div className="pointer-events-none absolute inset-0" aria-hidden="true">
        <div className="absolute -top-24 -right-24 h-80 w-80 rounded-full bg-teal-50 blur-3xl" />
        <div className="absolute -bottom-24 -left-24 h-80 w-80 rounded-full bg-emerald-50 blur-3xl" />
      </div>

      <div className="section-shell relative z-10">
        <Reveal className="section-head" y={24}>
          <span className="eyebrow">Got questions?</span>
          <h2 className="section-title">Frequently asked questions</h2>
          <p className="section-sub">
            Everything you need to know about our platform, therapy sessions, and privacy.
          </p>
        </Reveal>

        <Reveal stagger={0.06} y={20} className="mx-auto max-w-3xl space-y-4">
          {faqs.map((item, index) => {
              const isOpen = openIndex === index
              const panelId = `faq-panel-${index}`
              const buttonId = `faq-trigger-${index}`
              return (
                <div
                  key={index}
                  className={`rounded-2xl border bg-white shadow-soft transition-colors duration-300 ${
                    isOpen ? 'border-teal-200' : 'border-stone-200/70 hover:border-teal-200/60'
                  }`}
                >
                  <h3>
                    <button
                      id={buttonId}
                      type="button"
                      aria-expanded={isOpen}
                      aria-controls={panelId}
                      onClick={() => toggle(index)}
                      className="flex w-full items-center justify-between gap-4 p-5 text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-500 focus-visible:ring-offset-2"
                    >
                      <span className="font-medium text-stone-900">{item.question}</span>
                      <span
                        className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full transition-colors duration-300 ${
                          isOpen ? 'bg-teal-600 text-white' : 'bg-stone-100 text-stone-500'
                        }`}
                      >
                        {isOpen ? (
                          <Minus className="h-4 w-4" />
                        ) : (
                          <Plus className="h-4 w-4" />
                        )}
                      </span>
                    </button>
                  </h3>

                  <AnimatePresence initial={false}>
                    {isOpen && (
                      <motion.div
                        id={panelId}
                        role="region"
                        aria-labelledby={buttonId}
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.25, ease: 'easeOut' }}
                        className="overflow-hidden"
                      >
                        <div className="px-5 pb-5 text-sm leading-relaxed text-stone-600">
                          {item.answer}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
              </div>
            )
          })}
        </Reveal>
      </div>
    </section>
  )
}

export default Faq