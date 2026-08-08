'use client'

import { ShieldCheck, BadgeCheck, BookOpen, HeartHandshake } from 'lucide-react'
import Reveal from '@/components/ui/Reveal'

const benefits = [
  {
    icon: ShieldCheck,
    title: '100% Confidential',
    desc: 'Your conversations and personal data are fully encrypted and private.',
  },
  {
    icon: BadgeCheck,
    title: 'Licensed Therapists',
    desc: 'All professionals are verified, certified, and experienced in mental health care.',
  },
  {
    icon: BookOpen,
    title: 'Evidence-Based Care',
    desc: 'We use clinically proven methods like CBT, mindfulness, and therapy frameworks.',
  },
  {
    icon: HeartHandshake,
    title: 'Support That Cares',
    desc: 'Compassionate, human-centered care designed to support your emotional journey.',
  },
]

const TrustBenefitsSection = () => {
  return (
    <section className="section-pad relative overflow-hidden bg-slate-50">
      <div className="pointer-events-none absolute inset-0" aria-hidden="true">
        <div className="absolute -right-24 -top-24 h-80 w-80 rounded-full bg-teal-100/40 blur-3xl" />
        <div className="absolute -bottom-28 -left-24 h-80 w-80 rounded-full bg-emerald-100/50 blur-3xl" />
      </div>

      <div className="section-shell relative z-10">
        <Reveal className="section-head" y={24}>
          <span className="eyebrow">Why people trust us</span>
          <h2 className="section-title">
            Care you can trust, support you can rely on
          </h2>
          <p className="section-sub">
            We prioritize safety, professionalism, and emotional well-being in every step of your
            journey.
          </p>
        </Reveal>

        <Reveal stagger={0.08} y={26} className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {benefits.map((item) => {
              const Icon = item.icon
              return (
                <div
                  key={item.title}
                  className="group rounded-2xl border border-slate-200/70 bg-white p-6 shadow-soft transition-all duration-300 hover:-translate-y-1 hover:border-teal-200 hover:shadow-card"
                >
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-teal-50 transition-colors duration-300 group-hover:bg-teal-100">
                    <Icon className="h-5 w-5 text-teal-600" />
                  </div>
                  <h3 className="mt-5 text-lg font-semibold text-slate-900">{item.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-slate-600">{item.desc}</p>
                </div>
              )
            })}
        </Reveal>
      </div>
    </section>
  )
}

export default TrustBenefitsSection
