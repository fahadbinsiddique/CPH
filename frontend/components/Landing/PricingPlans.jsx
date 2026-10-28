'use client'

import { useState } from 'react'
import { motion, AnimatePresence, useReducedMotion } from 'motion/react'
import { Check, CreditCard, ShieldCheck, MessageCircle, Video, Calendar, Sparkles, Brain, Heart, Crown, Lock, ArrowRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import Reveal from '@/components/ui/Reveal'

const plans = [
  {
    id: 'self-guided',
    name: 'Self-Guided',
    tagline: 'For independent wellness',
    price: { monthly: 0, yearly: 0 },
    popular: false,
    color: 'border-stone-200 hover:border-violet-300',
    bgColor: 'bg-white',
    textColor: 'text-stone-900',
    mutedColor: 'text-stone-600',
    accentColor: 'text-violet-700',
    features: [
      { name: 'Daily mood check-ins', included: true },
      { name: 'Guided mindfulness library', included: true },
      { name: 'CBT-based self-help modules', included: true },
      { name: 'Progress tracking & insights', included: true },
      { name: 'Community forums access', included: true },
      { name: 'Crisis resources & safety planning', included: true },
      { name: '1-on-1 therapy sessions', included: false },
      { name: 'Personalized therapist matching', included: false },
      { name: 'Session notes & homework', included: false },
      { name: 'Insurance billing support', included: false },
    ],
    cta: 'Start Free',
    ctaVariant: 'outline',
  },
  {
    id: 'therapy-monthly',
    name: 'Therapy Monthly',
    tagline: 'Most popular — weekly sessions',
    price: { monthly: 260, yearly: 2340 },
    popular: true,
    color: 'border-violet-300 bg-violet-50/30 shadow-lg shadow-violet-500/10',
    bgColor: 'bg-white',
    textColor: 'text-stone-900',
    mutedColor: 'text-stone-600',
    accentColor: 'text-violet-700',
    features: [
      { name: '4 live therapy sessions/month', included: true },
      { name: 'Video, chat, or phone sessions', included: true },
      { name: 'Personalized therapist matching', included: true },
      { name: 'Session notes & action plans', included: true },
      { name: 'Between-session messaging', included: true },
      { name: 'All self-guided tools included', included: true },
      { name: 'Progress reports & insights', included: true },
      { name: 'Insurance billing assistance', included: true },
      { name: 'Flexible scheduling (eve/weekend)', included: true },
      { name: 'Cancel anytime', included: true },
    ],
    cta: 'Start Therapy',
    ctaVariant: 'primary',
    badge: 'Save 20% with annual',
  },
  {
    id: 'therapy-intensive',
    name: 'Therapy Intensive',
    tagline: 'For deeper work — 2x/week',
    price: { monthly: 480, yearly: 4320 },
    popular: false,
    color: 'border-rose-300 bg-rose-50/30',
    bgColor: 'bg-white',
    textColor: 'text-stone-900',
    mutedColor: 'text-stone-600',
    accentColor: 'text-rose-700',
    features: [
      { name: '8 live therapy sessions/month', included: true },
      { name: 'Priority therapist matching', included: true },
      { name: 'Extended 60-min sessions', included: true },
      { name: 'Between-session messaging', included: true },
      { name: 'Custom treatment planning', included: true },
      { name: 'Family/couples session option', included: true },
      { name: 'All self-guided tools included', included: true },
      { name: 'Detailed progress reports', included: true },
      { name: 'Insurance billing assistance', included: true },
      { name: 'Dedicated care coordinator', included: true },
    ],
    cta: 'Get Started',
    ctaVariant: 'outline',
    badge: 'Best value per session',
  },
]

const faqs = [
  {
    question: 'Do you accept insurance?',
    answer: 'Yes! We work with major insurance providers including Aetna, Cigna, UnitedHealthcare, Blue Cross Blue Shield, and more. Our team verifies your benefits and handles billing directly. Self-pay options are also available with transparent pricing.',
  },
  {
    question: 'Can I change my plan later?',
    answer: 'Absolutely. You can upgrade, downgrade, or cancel at any time. Changes take effect at the start of your next billing cycle. No penalties, no hidden fees — just let us know what you need.',
  },
  {
    question: 'What if I don\'t click with my therapist?',
    answer: 'We want you to have the best therapeutic fit. If you feel your therapist isn\'t right for you, you can request a rematch at any time — no questions asked, no additional cost.',
  },
  {
    question: 'Are sessions really secure and private?',
    answer: 'Yes. All sessions use end-to-end encryption on a HIPAA-compliant platform. Your data is never sold, shared with advertisers, or used for anything other than your care. You own your data and can request deletion anytime.',
  },
  {
    question: 'What\'s the difference between monthly and annual billing?',
    answer: 'Annual billing gives you 20% off the monthly rate, billed once per year. You can still cancel anytime — we\'ll refund the unused portion prorated. Monthly billing offers maximum flexibility with no long-term commitment.',
  },
  {
    question: 'Do you offer financial aid or sliding scale?',
    answer: 'We\'re committed to accessibility. We offer a limited number of sliding-scale spots based on financial need. Contact our support team to learn more about eligibility and application process.',
  },
]

const PricingPlans = () => {
  const [billingCycle, setBillingCycle] = useState('monthly')
  const [openFaq, setOpenFaq] = useState(0)
  const reduceMotion = useReducedMotion()

  const toggleFaq = (index) => {
    setOpenFaq(openFaq === index ? -1 : index)
  }

  return (
    <section className="section-pad section-pad-lg relative overflow-hidden bg-stone-50/30" aria-labelledby="pricing-heading">
      <div className="pointer-events-none absolute inset-0" aria-hidden="true">
        <div className="absolute -top-24 -right-24 h-80 w-80 rounded-full bg-violet-50/50 blur-3xl" />
        <div className="absolute -bottom-24 -left-24 h-80 w-80 rounded-full bg-emerald-50/50 blur-3xl" />
      </div>

      <div className="section-shell relative z-10">
        <Reveal className="section-head" y={24}>
          <h2 id="pricing-heading" className="section-title">
            Simple, transparent <span className="gradient-text-primary">pricing</span>
          </h2>
          <p className="section-sub">
            Choose the level of support that fits your life. No hidden fees, no surprises — just quality care at a fair price.
          </p>
        </Reveal>

        {/* Billing Toggle */}
        <Reveal y={20} delay={0.1} className="mt-8 flex justify-center">
          <div className="inline-flex items-center gap-1 rounded-xl bg-stone-100 p-1">
            {['monthly', 'yearly'].map((cycle) => (
              <button
                key={cycle}
                onClick={() => setBillingCycle(cycle)}
                className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-200 ${
                  billingCycle === cycle
                    ? 'bg-white text-violet-700 shadow-sm'
                    : 'text-stone-600 hover:text-stone-900'
                }`}
              >
                {cycle === 'monthly' ? 'Monthly' : 'Annual'}
                {cycle === 'yearly' && (
                  <span className="ml-2 inline-flex items-center gap-1 rounded-full bg-emerald-100 px-2 py-0.5 text-xs font-medium text-emerald-700">
                    <Sparkles className="h-3 w-3" />
                    Save 20%
                  </span>
                )}
              </button>
            ))}
          </div>
        </Reveal>

        {/* Plans Grid */}
        <Reveal stagger={0.08} y={20} delay={0.15} className="mt-10 grid gap-6 md:grid-cols-3">
          {plans.map((plan, index) => {
            const price = plan.price[billingCycle]
            const monthlyEquivalent = billingCycle === 'yearly' ? Math.round(price / 12) : price

            return (
              <motion.div
                key={plan.id}
                initial={!reduceMotion ? { opacity: 0, y: 30, scale: 0.98 } : {}}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ duration: 0.5, delay: index * 0.08, ease: [0.16, 1, 0.3, 1] }}
                className={`relative rounded-2xl border-2 p-6 md:p-8 transition-all duration-300 ${plan.color} ${plan.bgColor}`}
              >
                {/* Popular Badge */}
                <AnimatePresence>
                  {plan.popular && (
                    <motion.div
                      initial={{ opacity: 0, y: -10, scale: 0.9 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: -10, scale: 0.9 }}
                      className="absolute -top-3 left-1/2 -translate-x-1/2"
                    >
                      <span className="inline-flex items-center gap-1.5 rounded-full bg-violet-600 px-3 py-1 text-xs font-bold text-white">
                        <Crown className="h-3 w-3" />
                        Most Popular
                      </span>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Secondary Badge */}
                <AnimatePresence>
                  {plan.badge && !plan.popular && (
                    <motion.div
                      initial={{ opacity: 0, y: -10, scale: 0.9 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: -10, scale: 0.9 }}
                      className="absolute -top-3 left-1/2 -translate-x-1/2"
                    >
                      <span className="inline-flex items-center gap-1.5 rounded-full bg-rose-100 px-3 py-1 text-xs font-medium text-rose-700">
                        <Sparkles className="h-3 w-3" />
                        {plan.badge}
                      </span>
                    </motion.div>
                  )}
                </AnimatePresence>

                <div className="mb-6">
                  <h3 className={`text-xl font-bold ${plan.textColor}`}>{plan.name}</h3>
                  <p className={`mt-1 text-sm ${plan.mutedColor}`}>{plan.tagline}</p>
                </div>

                {/* Price */}
                <div className="mb-6">
                  <div className="flex items-baseline gap-1">
                    <span className={`${plan.textColor} text-4xl font-bold`}>
                      {price === 0 ? 'Free' : `$${price}`}
                    </span>
                    {price > 0 && (
                      <span className={`${plan.mutedColor} text-lg`}>
                        /{billingCycle === 'monthly' ? 'month' : 'year'}
                      </span>
                    )}
                  </div>
                  {billingCycle === 'yearly' && price > 0 && (
                    <p className={`mt-1 text-sm ${plan.accentColor}`}>
                      ${monthlyEquivalent}/month <span className="font-normal">(billed ${price === 0 ? 'free' : `$${price}`} yearly)</span>
                    </p>
                  )}
                  {price === 0 && (
                    <p className={`mt-1 text-sm ${plan.accentColor}`}>Forever free · No card required</p>
                  )}
                </div>

                {/* Features */}
                <ul className="space-y-3 mb-8" role="list">
                  {plan.features.map((feature, fIndex) => (
                    <li key={fIndex} className="flex items-start gap-3">
                      {feature.included ? (
                        <Check className="flex-shrink-0 mt-0.5 h-5 w-5 text-violet-600" aria-hidden="true" />
                      ) : (
                        <Lock className="flex-shrink-0 mt-0.5 h-5 w-5 text-stone-300" aria-hidden="true" />
                      )}
                      <span className={`text-sm ${feature.included ? plan.textColor : plan.mutedColor}`}>
                        {feature.name}
                      </span>
                    </li>
                  ))}
                </ul>

                {/* CTA */}
                <Button
                  asChild
                  variant={plan.ctaVariant === 'primary' ? 'default' : 'outline'}
                  className={`w-full rounded-xl py-3.5 text-base font-semibold ${
                    plan.ctaVariant === 'primary'
                      ? 'bg-violet-700 hover:bg-violet-800 text-white'
                      : 'border-violet-300 text-violet-700 hover:bg-violet-50'
                  }`}
                >
                  <a href={`/booking?plan=${plan.id}`}>
                    {plan.cta}
                    <ArrowRight className="h-4 w-4 ml-2" />
                  </a>
                </Button>
              </motion.div>
            )
          })}
        </Reveal>

        {/* Guarantee Bar */}
        <Reveal y={20} delay={0.25} className="mt-16">
          <div className="mx-auto max-w-4xl rounded-2xl border border-violet-200 bg-violet-50 p-6 md:p-8 text-center">
            <div className="flex items-center justify-center gap-3 mb-4">
              <ShieldCheck className="h-8 w-8 text-violet-600" />
              <h3 className="text-xl font-bold text-violet-900">Our Promise to You</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
              <div className="flex items-center justify-center gap-2 text-violet-700">
                <Check className="h-4 w-4" />
                <span>Cancel anytime, no questions</span>
              </div>
              <div className="flex items-center justify-center gap-2 text-violet-700">
                <Check className="h-4 w-4" />
                <span>Therapist rematch guarantee</span>
              </div>
              <div className="flex items-center justify-center gap-2 text-violet-700">
                <Check className="h-4 w-4" />
                <span>HIPAA-compliant & secure</span>
              </div>
            </div>
          </div>
        </Reveal>

        {/* FAQ Section */}
        <Reveal y={20} delay={0.3} className="mt-16">
          <h3 className="text-2xl font-bold text-center text-stone-900 mb-8">Still have questions?</h3>
          <div className="mx-auto max-w-3xl space-y-4">
            {faqs.map((faq, index) => (
              <details
                key={index}
                className={`group rounded-xl border bg-white shadow-soft transition-all duration-300 ${
                  openFaq === index ? 'border-violet-200' : 'border-stone-200/70 hover:border-violet-200/60'
                }`}
                open={openFaq === index}
                onToggle={() => toggleFaq(index)}
              >
                <summary className="flex items-center justify-between gap-4 p-5 cursor-pointer list-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-500 focus-visible:ring-offset-2">
                  <span className="font-medium text-stone-900">{faq.question}</span>
                  <span className={`flex-shrink-0 flex h-8 w-8 items-center justify-center rounded-full transition-all duration-300 ${
                    openFaq === index ? 'bg-violet-600 text-white' : 'bg-stone-100 text-stone-500'
                  }`}>
                    {openFaq === index ? (
                      <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <line x1="18" y1="6" x2="6" y2="18" />
                        <line x1="6" y1="6" x2="18" y2="18" />
                      </svg>
                    ) : (
                      <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <line x1="12" y1="5" x2="12" y2="19" />
                        <line x1="5" y1="12" x2="19" y2="12" />
                      </svg>
                    )}
                  </span>
                </summary>
                <AnimatePresence>
                  {openFaq === index && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.25, ease: 'easeOut' }}
                      className="overflow-hidden"
                    >
                      <div className="px-5 pb-5 text-sm leading-relaxed text-stone-600">
                        {faq.answer}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </details>
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  )
}

export default PricingPlans