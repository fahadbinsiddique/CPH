'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Plus, Minus } from 'lucide-react'

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
    <section className="relative py-24 bg-slate-50 overflow-hidden">
      {/* Background glow */}
      <div className="absolute top-[-120px] left-[-100px] w-[300px] h-[300px] bg-emerald-100 blur-3xl rounded-full" />
      <div className="absolute bottom-[-120px] right-[-100px] w-[300px] h-[300px] bg-blue-100 blur-3xl rounded-full" />

      <div className="max-w-4xl mx-auto px-6 relative z-10">
        {/* Heading */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-14"
        >
          <h2 className="text-3xl md:text-4xl font-semibold text-slate-900">
            Frequently Asked Questions
          </h2>
          <p className="mt-4 text-slate-600">
            Everything you need to know about our platform, therapy sessions, and privacy.
          </p>
        </motion.div>

        {/* Accordion */}
        <div className="space-y-4">
          {faqs.map((item, index) => {
            const isOpen = openIndex === index

            return (
              <div
                key={index}
                className="border border-slate-200 rounded-2xl bg-white shadow-sm overflow-hidden"
              >
                {/* Question */}
                <button
                  onClick={() => toggle(index)}
                  className="w-full flex items-center justify-between p-5 text-left hover:bg-slate-50 transition"
                >
                  <span className="font-medium text-slate-900">{item.question}</span>

                  {isOpen ? (
                    <Minus className="w-5 h-5 text-emerald-600" />
                  ) : (
                    <Plus className="w-5 h-5 text-slate-500" />
                  )}
                </button>

                {/* Answer */}
                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3 }}
                    >
                      <div className="px-5 pb-5 text-sm text-slate-600 leading-relaxed">
                        {item.answer}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}

export default Faq
