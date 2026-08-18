'use client'

import { Heart, Brain, ShieldCheck, Sparkles, MessageCircle, CalendarCheck } from 'lucide-react'
import Reveal from '@/components/ui/Reveal'

const features = [
  {
    icon: Heart,
    title: 'Emotional Support',
    desc: 'Get guided tools to understand and manage your emotions better every day.',
  },
  {
    icon: Brain,
    title: 'Mindfulness Training',
    desc: 'Improve focus and reduce stress with science-backed mindfulness practices.',
  },
  {
    icon: MessageCircle,
    title: '1-on-1 Therapy',
    desc: 'Connect with licensed therapists anytime through secure sessions.',
  },
  {
    icon: CalendarCheck,
    title: 'Daily Check-ins',
    desc: 'Track your mood and mental health progress with simple daily reflections.',
  },
  {
    icon: ShieldCheck,
    title: 'Privacy First',
    desc: 'Your data is fully encrypted and always protected with top security standards.',
  },
  {
    icon: Sparkles,
    title: 'Personalized Growth',
    desc: 'AI-assisted insights help you grow emotionally at your own pace.',
  },
]

const FeaturesShowcase = () => {
  return (
    <section className="section-pad relative overflow-hidden bg-stone-50/70">
      <div className="pointer-events-none absolute inset-0" aria-hidden="true">
        <div className="absolute -left-24 top-1/3 h-80 w-80 rounded-full bg-teal-50 blur-3xl" />
        <div className="absolute -right-20 -bottom-24 h-80 w-80 rounded-full bg-emerald-50 blur-3xl" />
        <div className="absolute right-[22%] top-[12%] hidden h-64 w-64 rounded-full bg-accent-sky/50 blur-3xl md:block" />
      </div>

      <div className="section-shell relative z-10">
        <Reveal className="section-head" y={24}>
          <span className="eyebrow">A complete toolkit</span>
          <h2 className="section-title">Everything you need for a healthier mind</h2>
          <p className="section-sub">
            A complete mental wellness toolkit designed to support your emotional balance, growth,
            and peace of mind.
          </p>
        </Reveal>

        <Reveal stagger={0.07} y={26} className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((item) => {
              const Icon = item.icon
              return (
                <div
                  key={item.title}
                  className="group rounded-2xl border border-stone-200/70 bg-white p-6 shadow-soft transition-all duration-300 hover:-translate-y-1 hover:border-teal-200 hover:shadow-card"
                >
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-teal-50 transition-colors duration-300 group-hover:bg-teal-100">
                    <Icon className="h-5 w-5 text-teal-600" />
                  </div>
                  <h3 className="mt-5 text-lg font-semibold text-stone-900">{item.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-stone-600">{item.desc}</p>
                </div>
              )
            })}
        </Reveal>
      </div>
    </section>
  )
}

export default FeaturesShowcase
