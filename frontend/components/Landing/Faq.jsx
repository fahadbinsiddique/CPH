'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import { Plus, Minus, ShieldCheck, UserCheck, Video, MessageCircle, CreditCard, Calendar, Heart, Sparkles, HelpCircle } from 'lucide-react'
import Reveal from '@/components/ui/Reveal'

const faqCategories = [
  {
    id: 'getting-started',
    label: 'Getting Started',
    icon: Sparkles,
    questions: [
      {
        question: 'How do I get started with CPH?',
        answer: 'Simply take our free 3-minute assessment, and we\'ll match you with licensed therapists who fit your needs. You can then browse profiles, check availability, and book your first session — all in one place.',
      },
      {
        question: 'Do I need a referral to use CPH?',
        answer: 'No referral needed. You can sign up directly and start your mental wellness journey whenever you\'re ready. Our platform is designed for direct access to care.',
      },
      {
        question: 'What happens after I complete the assessment?',
        answer: 'You\'ll receive personalized therapist matches based on your responses, preferences, and needs. You can review profiles, watch intro videos, and book a session with the therapist who feels right for you.',
      },
    ],
  },
  {
    id: 'therapy-process',
    label: 'Therapy Process',
    icon: Heart,
    questions: [
      {
        question: 'How do online therapy sessions work?',
        answer: 'Sessions happen via secure video, phone, or chat — whichever you prefer. You\'ll meet with your therapist at your scheduled time from wherever you\'re comfortable. Sessions are typically 45-50 minutes.',
      },
      {
        question: 'Can I choose my therapist?',
        answer: 'Yes! You can browse therapist profiles, specialties, approaches, ratings, and intro videos. You can also use our matching algorithm which considers your assessment results, preferences, and therapist availability.',
      },
      {
        question: 'What if I don\'t click with my therapist?',
        answer: 'Therapeutic fit is essential. If you feel your therapist isn\'t the right match, you can request a rematch at any time — no questions asked, no additional cost. We want you to have the best possible experience.',
      },
      {
        question: 'What types of therapy do you offer?',
        answer: 'Our therapists are trained in evidence-based approaches including CBT, DBT, EMDR, ACT, psychodynamic therapy, couples therapy, and more. You can filter by approach when browsing therapists.',
      },
    ],
  },
  {
    id: 'privacy-security',
    label: 'Privacy & Security',
    icon: ShieldCheck,
    questions: [
      {
        question: 'Is my data and conversation private?',
        answer: 'Yes. All your data is fully encrypted and confidential. We follow strict HIPAA standards and use end-to-end encryption for all sessions. Your information is never sold or shared with advertisers.',
      },
      {
        question: 'Are the therapists licensed and verified?',
        answer: 'Absolutely. Every therapist on our platform is licensed, certified, and carefully verified before joining. We verify credentials, licenses, malpractice insurance, and conduct background checks.',
      },
      {
        question: 'Who can see my therapy notes?',
        answer: 'Only you and your therapist. Your session notes are encrypted and accessible only to you and your assigned therapist. We cannot access them, and they\'re never shared with third parties.',
      },
    ],
  },
  {
    id: 'pricing-insurance',
    label: 'Pricing & Insurance',
    icon: CreditCard,
    questions: [
      {
        question: 'Do you accept insurance?',
        answer: 'Yes! We work with major insurance providers including Aetna, Cigna, UnitedHealthcare, Blue Cross Blue Shield, and more. Our team verifies your benefits and handles billing directly. Self-pay options are also available.',
      },
      {
        question: 'How much does therapy cost?',
        answer: 'With insurance, you typically pay only your copay/coinsurance. Self-pay plans start at $65/week for weekly sessions, with discounts for annual commitments. We also offer sliding-scale spots based on financial need.',
      },
      {
        question: 'Can I use HSA/FSA funds?',
        answer: 'Yes, therapy sessions are typically eligible for HSA/FSA reimbursement. We provide detailed receipts with all necessary information for your claims.',
      },
    ],
  },
  {
    id: 'technical',
    label: 'Technical & Account',
    icon: HelpCircle,
    questions: [
      {
        question: 'What devices can I use for sessions?',
        answer: 'Any device with a camera and internet: smartphone, tablet, laptop, or desktop. We recommend Chrome, Safari, or Firefox for the best experience. No app download required — sessions run in your browser.',
      },
      {
        question: 'What if I have technical issues during a session?',
        answer: 'Our platform includes built-in connection testing before each session. If issues arise, you can switch to phone or chat mode instantly. Our support team is also available during business hours for assistance.',
      },
      {
        question: 'Can I cancel or reschedule a session?',
        answer: 'Yes, you can reschedule or cancel up to 24 hours before your session without charge. Late cancellations may incur a fee. All changes can be made directly in your dashboard.',
      },
    ],
  },
]

const Faq = () => {
  const [openCategory, setOpenCategory] = useState('getting-started')
  const [openQuestions, setOpenQuestions] = useState({})

  const toggleCategory = (categoryId) => {
    setOpenCategory(openCategory === categoryId ? null : categoryId)
  }

  const toggleQuestion = (categoryId, questionIndex) => {
    setOpenQuestions(prev => ({
      ...prev,
      [categoryId]: {
        ...prev[categoryId],
        [questionIndex]: !prev[categoryId]?.[questionIndex],
      },
    }))
  }

  const isQuestionOpen = (categoryId, questionIndex) => {
    return openQuestions[categoryId]?.[questionIndex] ?? false
  }

  return (
    <section className="section-pad section-pad-lg relative overflow-hidden bg-white" aria-labelledby="faq-heading">
      <div className="pointer-events-none absolute inset-0" aria-hidden="true">
        <div className="absolute -top-24 -right-24 h-80 w-80 rounded-full bg-violet-50/50 blur-3xl" />
        <div className="absolute -bottom-24 -left-24 h-80 w-80 rounded-full bg-emerald-50/50 blur-3xl" />
      </div>

      <div className="section-shell relative z-10">
        <Reveal className="section-head" y={24}>
          <h2 id="faq-heading" className="section-title">
            Frequently asked <span className="gradient-text-primary">questions</span>
          </h2>
          <p className="section-sub">
            Everything you need to know about our platform, therapy sessions, and getting started.
          </p>
        </Reveal>

        <Reveal stagger={0.06} y={20} className="mt-10">
          {/* Category Tabs */}
          <div className="flex flex-wrap justify-center gap-2 mb-10" role="tablist" aria-label="FAQ categories">
            {faqCategories.map((category) => {
              const Icon = category.icon
              const isActive = openCategory === category.id
              return (
                <button
                  key={category.id}
                  onClick={() => toggleCategory(category.id)}
                  role="tab"
                  aria-selected={isActive}
                  aria-controls={`faq-panel-${category.id}`}
                  className={`flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-medium transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-500 ${
                    isActive
                      ? 'bg-violet-600 text-white shadow-lg shadow-violet-500/20'
                      : 'bg-stone-50 text-stone-600 hover:bg-violet-50 hover:text-violet-700'
                  }`}
                >
                  <Icon className="h-4 w-4" aria-hidden="true" />
                  {category.label}
                </button>
              )
            })}
          </div>

          {/* Category Content */}
          <AnimatePresence mode="wait">
            {openCategory && faqCategories.find(c => c.id === openCategory)?.questions.map((item, index) => {
              const isOpen = isQuestionOpen(openCategory, index)
              const panelId = `faq-${openCategory}-${index}`
              const buttonId = `faq-trigger-${openCategory}-${index}`

              return (
                <motion.div
                  key={`${openCategory}-${index}`}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                >
                  <div
                    className={`rounded-2xl border bg-white shadow-soft transition-all duration-300 ${
                      isOpen ? 'border-violet-200' : 'border-stone-200/70 hover:border-violet-200/60'
                    }`}
                  >
                    <h3>
                      <button
                        id={buttonId}
                        type="button"
                        aria-expanded={isOpen}
                        aria-controls={panelId}
                        onClick={() => toggleQuestion(openCategory, index)}
                        className="flex w-full items-center justify-between gap-4 p-5 text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-500 focus-visible:ring-offset-2"
                      >
                        <span className="font-medium text-stone-900">{item.question}</span>
                        <span
                          className={`flex-shrink-0 flex h-10 w-10 items-center justify-center rounded-full transition-all duration-300 ${
                            isOpen ? 'bg-violet-600 text-white' : 'bg-stone-100 text-stone-500'
                          }`}
                        >
                          {isOpen ? <Minus className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
                        </span>
                      </button>
                    </h3>

                    <AnimatePresence>
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
                </motion.div>
              )
            })}
          </AnimatePresence>

          {/* Still have questions CTA */}
          <div className="mt-12 text-center">
            <p className="text-stone-600 mb-4">Still have questions?</p>
            <div className="flex flex-col sm:flex-row justify-center gap-3">
              <a href="mailto:cfphuk@gmail.com" className="btn-outline">
                <MessageCircle className="h-4 w-4" />
                Email Us
              </a>
              <a href="/consultant" className="btn-primary">
                <Sparkles className="h-4 w-4" />
                Find a Therapist
              </a>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  )
}

export default Faq