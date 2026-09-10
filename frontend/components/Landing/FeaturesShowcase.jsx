'use client'

import { Heart, Brain, ShieldCheck, Sparkles, MessageCircle, CalendarCheck } from 'lucide-react'
import Image from 'next/image'
import Reveal from '@/components/ui/Reveal'

const features = [
  {
    icon: Heart,
    title: 'Emotional Support',
    desc: 'Get guided tools to understand and manage your emotions better every day.',
    image: 'https://images.unsplash.com/photo-1758273241078-8eec353836be?q=80&w=1331&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
  },
  {
    icon: Brain,
    title: 'Mindfulness Training',
    desc: 'Improve focus and reduce stress with science-backed mindfulness practices.',
    image:  'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&q=80',
  },
  {
    icon: MessageCircle,
    title: '1-on-1 Therapy',
    desc: 'Connect with licensed therapists anytime through secure sessions.',
    image: 'https://images.unsplash.com/photo-1573497620053-ea5300f94f21?w=800&q=80',
  },
  {
    icon: CalendarCheck,
    title: 'Daily Check-ins',
    desc: 'Track your mood and mental health progress with simple daily reflections.',
    image:  'https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?w=800&q=80',
  },
  {
    icon: ShieldCheck,
    title: 'Privacy First',
    desc: 'Your data is fully encrypted and always protected with top security standards.',
    image:  'https://images.unsplash.com/photo-1563986768609-322da13575f3?w=800&q=80',
  },
  {
    icon: Sparkles,
    title: 'Personalized Growth',
    desc: 'AI-assisted insights help you grow emotionally at your own pace.',
    image:  'https://images.unsplash.com/photo-1517486808906-6ca8b3f04846?w=800&q=80',
  },
]

const FeaturesShowcase = () => {
  return (
    <section className="section-pad section-pad-lg relative overflow-hidden bg-stone-50/50">
      <div className="pointer-events-none absolute inset-0" aria-hidden="true">
        <div className="absolute -left-24 top-1/3 h-80 w-80 rounded-full bg-teal-50 blur-3xl" />
        <div className="absolute -right-20 -bottom-24 h-80 w-80 rounded-full bg-emerald-50 blur-3xl" />
        <div className="absolute right-[22%] top-[12%] hidden h-64 w-64 rounded-full bg-teal-100/50 blur-3xl md:block" />
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

        <Reveal stagger={0.08} y={26} className="space-y-8 md:space-y-12 lg:space-y-16">
          {features.map((item, index) => {
            const Icon = item.icon
            const isEven = index % 2 === 0
            return (
              <div
                key={item.title}
                className={`flex flex-col gap-6 md:flex-row md:gap-12 items-start ${isEven ? 'md:flex-row' : 'md:flex-row-reverse'}`}
              >
                <div className="flex-1 w-full md:w-1/2 text-center md:text-left">
                  <div className="inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-teal-50 transition-colors duration-300">
                    <Icon className="h-6 w-6 text-teal-600" />
                  </div>
                  <h3 className="mt-5 text-2xl font-bold tracking-tight text-stone-900">{item.title}</h3>
                  <p className="mt-3 text-base leading-relaxed text-stone-600 prose-normal">{item.desc}</p>
                </div>
                <div className="flex-1 w-full md:w-1/2 relative">
                  <div className="card-raised p-0 aspect-[4/3] md:aspect-auto min-h-[280px] overflow-hidden">
                    <Image
                      src={item.image}
                      alt={item.title}
                      fill
                      sizes="(max-width: 768px) 100vw, 50vw"
                      className="object-cover object-center transition-transform duration-500 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-black/10 to-transparent" />
                    <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                      <h4 className="text-lg font-semibold">{item.title}</h4>
                      <p className="mt-1 text-sm opacity-90">{item.desc}</p>
                    </div>
                  </div>
                </div>
              </div>
            )
          })}
        </Reveal>
      </div>
    </section>
  )
}

export default FeaturesShowcase
