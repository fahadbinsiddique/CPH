'use client'

import { CheckCircle2, XCircle, ShieldCheck, Clock, Users, Heart, Sparkles, Globe, CreditCard, Smartphone, Headphones, ArrowRight } from 'lucide-react'
import Reveal from '@/components/ui/Reveal'

const comparisons = [
  {
    feature: 'Licensed Therapists',
    cph: true,
    traditional: true,
    apps: 'Varies',
    detail: 'All CPH therapists are verified, licensed professionals with clinical experience.',
  },
  {
    feature: 'Insurance Accepted',
    cph: true,
    traditional: true,
    apps: false,
    detail: 'We work with major insurance providers to reduce your out-of-pocket costs.',
  },
  {
    feature: 'Same-Week Availability',
    cph: true,
    traditional: false,
    apps: true,
    detail: 'Get matched and booked within days, not weeks or months.',
  },
  {
    feature: 'Flexible Formats (Video/Chat/Phone)',
    cph: true,
    traditional: 'Limited',
    apps: true,
    detail: 'Choose the format that fits your comfort level and schedule.',
  },
  {
    feature: 'Evidence-Based Approaches (CBT, DBT, EMDR)',
    cph: true,
    traditional: true,
    apps: 'Limited',
    detail: 'Therapists trained in clinically-proven modalities for your specific needs.',
  },
  {
    feature: 'Integrated Self-Care Tools',
    cph: true,
    traditional: false,
    apps: true,
    detail: 'Mood tracking, mindfulness, assessments, and progress insights between sessions.',
  },
  {
    feature: '24/7 Crisis Resources',
    cph: true,
    traditional: false,
    apps: 'Varies',
    detail: 'Immediate access to crisis lines and safety planning tools when you need them most.',
  },
  {
    feature: 'Transparent Pricing',
    cph: true,
    traditional: 'Often unclear',
    apps: true,
    detail: 'Know your costs upfront — no surprise bills or hidden fees.',
  },
  {
    feature: 'Progress Tracking & Insights',
    cph: true,
    traditional: false,
    apps: 'Basic',
    detail: 'Visual progress reports, session notes, and personalized growth recommendations.',
  },
  {
    feature: 'Therapist Matching Algorithm',
    cph: true,
    traditional: false,
    apps: 'Basic',
    detail: 'Smart matching based on specialty, approach, personality fit, and availability.',
  },
]

const WhyCPH = () => {
  return (
    <section className="section-pad section-pad-lg relative overflow-hidden bg-white" aria-labelledby="why-cph-heading">
      <div className="pointer-events-none absolute inset-0" aria-hidden="true">
        <div className="absolute -left-24 top-1/3 h-80 w-80 rounded-full bg-violet-50/50 blur-3xl" />
        <div className="absolute -right-20 -bottom-24 h-80 w-80 rounded-full bg-emerald-50/50 blur-3xl" />
      </div>

      <div className="section-shell relative z-10">
        <Reveal className="section-head" y={24}>
          <h2 id="why-cph-heading" className="section-title">
            Better than traditional therapy. <span className="gradient-text-primary">Different from apps.</span>
          </h2>
          <p className="section-sub">
            We combine the clinical excellence of in-person care with the accessibility of digital platforms — giving you the best of both worlds.
          </p>
        </Reveal>

        {/* Comparison Table */}
        <Reveal y={20} delay={0.1} className="overflow-x-auto">
          <table className="w-full text-left" role="table">
            <thead>
              <tr className="border-b border-stone-200">
                <th className="pb-4 text-sm font-semibold text-stone-500 uppercase tracking-wider">
                  Feature
                </th>
                <th className="pb-4 text-center text-sm font-semibold text-stone-500 uppercase tracking-wider w-32">
                  <div className="flex items-center justify-center gap-2">
                    <ShieldCheck className="h-4 w-4 text-violet-600" />
                    <span>CPH</span>
                  </div>
                </th>
                <th className="pb-4 text-center text-sm font-semibold text-stone-500 uppercase tracking-wider w-32">
                  <div className="flex items-center justify-center gap-2">
                    <Users className="h-4 w-4 text-stone-500" />
                    <span>Traditional</span>
                  </div>
                </th>
                <th className="pb-4 text-center text-sm font-semibold text-stone-500 uppercase tracking-wider w-32">
                  <div className="flex items-center justify-center gap-2">
                    <Smartphone className="h-4 w-4 text-violet-500" />
                    <span>Apps</span>
                  </div>
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100">
              {comparisons.map((item, index) => (
                <tr key={item.feature} className={index % 2 === 0 ? 'bg-stone-50/50' : ''}>
                  <td className="py-4 pr-4">
                    <div className="flex items-start gap-3">
                      <div className="flex-shrink-0 mt-0.5 h-5 w-5 rounded-lg bg-violet-50 flex items-center justify-center">
                        <CheckCircle2 className="h-3 w-3 text-violet-600" />
                      </div>
                      <div>
                        <p className="font-medium text-stone-900">{item.feature}</p>
                        <p className="text-sm text-stone-500 mt-0.5">{item.detail}</p>
                      </div>
                    </div>
                  </td>
                  <td className="py-4 text-center">
                    {item.cph === true ? (
                      <CheckCircle2 className="mx-auto h-5 w-5 text-violet-600" />
                    ) : (
                      <span className="text-sm text-stone-600">{item.cph}</span>
                    )}
                  </td>
                  <td className="py-4 text-center">
                    {item.traditional === true ? (
                      <CheckCircle2 className="mx-auto h-5 w-5 text-stone-400" />
                    ) : item.traditional === false ? (
                      <XCircle className="mx-auto h-5 w-5 text-stone-300" />
                    ) : (
                      <span className="text-sm text-stone-600">{item.traditional}</span>
                    )}
                  </td>
                  <td className="py-4 text-center">
                    {item.apps === true ? (
                      <CheckCircle2 className="mx-auto h-5 w-5 text-violet-500" />
                    ) : item.apps === false ? (
                      <XCircle className="mx-auto h-5 w-5 text-stone-300" />
                    ) : (
                      <span className="text-sm text-stone-600">{item.apps}</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </Reveal>

        {/* Key Differentiators */}
        <Reveal stagger={0.08} y={20} delay={0.2} className="mt-16 grid gap-6 md:grid-cols-3">
          {[
            {
              icon: Heart,
              title: 'Human-First Care',
              description: 'Technology enhances, never replaces, the therapeutic relationship. Your therapist knows you.',
              color: 'bg-rose-50 border-rose-200 text-rose-700',
              iconColor: 'text-rose-600 bg-rose-100',
            },
            {
              icon: Sparkles,
              title: 'Continuous Innovation',
              description: 'We\'re constantly improving based on clinical research and user feedback — not a static platform.',
              color: 'bg-violet-50 border-violet-200 text-violet-700',
              iconColor: 'text-violet-600 bg-violet-100',
            },
            {
              icon: Globe,
              title: 'Accessible Everywhere',
              description: 'Licensed across multiple states with expanding coverage. Quality care, no matter where you are.',
              color: 'bg-emerald-50 border-emerald-200 text-emerald-700',
              iconColor: 'text-emerald-600 bg-emerald-100',
            },
          ].map((item, index) => {
            const Icon = item.icon
            return (
              <div
                key={item.title}
                className={`relative p-6 md:p-8 rounded-2xl border transition-all duration-300 hover:shadow-float ${item.color}`}
              >
                <div className={`flex h-12 w-12 items-center justify-center rounded-xl mb-5 ${item.iconColor}`}>
                  <Icon className="h-6 w-6" aria-hidden="true" />
                </div>
                <h3 className="text-lg font-bold mb-3">{item.title}</h3>
                <p className="text-sm leading-relaxed">{item.description}</p>
              </div>
            )
          })}
        </Reveal>

        {/* CTA */}
        <Reveal y={20} delay={0.3} className="mt-16 text-center">
          <a href="/consultant" className="btn-primary-lg">
            Find Your Therapist
            <ArrowRight className="h-5 w-5" />
          </a>
        </Reveal>
      </div>
    </section>
  )
}

export default WhyCPH