'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Plus, Minus, ArrowRight, ShieldCheck, MessageCircle, Sparkles } from 'lucide-react'
import Image from 'next/image'

// FAQ content for the final call-to-action section.
const faqs = [
  {
    question: 'Is my data and conversation private?',
    answer:
      'Yes. End-to-end encrypted sessions and confidential records. Your privacy is our priority.',
  },
  {
    question: 'Are the therapists licensed?',
    answer: 'All therapists are verified, certified, and experienced in evidence-based care.',
  },
  {
    question: 'How do online sessions work?',
    answer: 'Book a session, receive a secure link, and connect via video or chat from anywhere.',
  },
  {
    question: 'Can I choose my therapist?',
    answer: 'Yes, browse profiles or let our matching system suggest the best fit for you.',
  },
]

const FinalCTA = () => {
  const [openIndex, setOpenIndex] = useState(0)

  const toggle = (index) => {
    setOpenIndex(openIndex === index ? -1 : index)
  }

  return (
    <section className="relative py-24 overflow-hidden bg-gradient-to-br from-white to-slate-50">
      {/* Soft background blobs */}
      <div className="absolute top-[-100px] left-[-100px] w-[400px] h-[400px] bg-emerald-100/30 rounded-full blur-3xl" />
      <div className="absolute bottom-[-100px] right-[-100px] w-[400px] h-[400px] bg-blue-100/30 rounded-full blur-3xl" />

      <div className="relative max-w-6xl mx-auto px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 items-start">
          {/* LEFT COLUMN: FAQ */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <div className="mb-6">
              <span className="inline-flex items-center gap-1.5 text-sm font-medium text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full">
                <Sparkles className="w-3.5 h-3.5" />
                Got questions?
              </span>
              <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mt-3">
                Frequently asked questions
              </h2>
              <p className="text-slate-600 mt-2">
                Everything you need to know before starting your journey.
              </p>
            </div>

            <div className="space-y-3">
              {faqs.map((item, index) => {
                const isOpen = openIndex === index
                return (
                  <div
                    key={index}
                    className="bg-white/70 hover:bg-emerald-50 backdrop-blur-sm border border-white/40 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all"
                  >
                    <button
                      onClick={() => toggle(index)}
                      className="w-full flex justify-between items-center p-4 text-left hover:bg-white/50 transition"
                    >
                      <span className="font-medium text-slate-800">{item.question}</span>
                      {isOpen ? (
                        <Minus className="w-4 h-4 text-emerald-600" />
                      ) : (
                        <Plus className="w-4 h-4 text-slate-400" />
                      )}
                    </button>
                    <AnimatePresence>
                      {isOpen && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.2 }}
                          className="px-4 pb-4 text-sm text-slate-600"
                        >
                          {item.answer}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                )
              })}
            </div>
          </motion.div>

          {/* RIGHT COLUMN: CTA CARD + MINI ILLUSTRATION */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="relative"
          >
            <div className="bg-gradient-to-br from-emerald-50/80 to-teal-50/80 backdrop-blur-sm rounded-2xl border border-white/40 shadow-xl p-6 md:p-8">
              {/* Decorative illustration (simple icon + image) */}
              <div className="relative h-32 mb-4 rounded-xl overflow-hidden">
                <Image
                  src="/Peaceful therapy session illustration.png"
                  alt="Peaceful therapy session illustration"
                  width={400}
                  height={150}
                  className="w-full h-full object-cover rounded-xl"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/10 via-transparent to-transparent" />
              </div>

              <div className="text-center">
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/60 backdrop-blur-sm text-emerald-700 text-sm mb-4">
                  <ShieldCheck className="w-4 h-4" />
                  Safe, secure, professional
                </div>
                <h3 className="text-2xl font-bold text-slate-800">Ready to feel better?</h3>
                <p className="mt-2 text-slate-600 text-sm">
                  Take the first step today – thousands have found peace with SereneMind.
                </p>
              </div>

              {/* Main CTA button */}
              <div className="mt-6 space-y-3">
                <button className="w-full inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 text-white font-medium shadow-md hover:shadow-lg transition-all">
                  Start consultation now
                  <ArrowRight className="w-4 h-4" />
                </button>
                <button className="w-full inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl border border-emerald-200 text-slate-700 bg-white/50 hover:bg-white transition-all">
                  <MessageCircle className="w-4 h-4" />
                  Ask a question
                </button>
              </div>

              <p className="text-center text-xs text-slate-400 mt-4">
                Free 15-min consultation • Cancel anytime
              </p>
            </div>

            {/* Floating badge (minimal) */}
            <div className="absolute -bottom-3 -right-3 bg-white rounded-full px-3 py-1.5 shadow-md border border-emerald-100 hidden md:flex items-center gap-1 text-xs font-medium text-emerald-700">
              <span>⭐ 4.9/5</span>
              <span className="text-slate-400">|</span>
              <span>10k+ users</span>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}

export default FinalCTA
