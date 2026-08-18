'use client'

import Image from 'next/image'
import Link from 'next/link'
import { Heart, Sparkles, MessageCircle, ShieldCheck, BadgeCheck, Clock, ArrowRight } from 'lucide-react'
import Reveal from '@/components/ui/Reveal'

const coreFeatures = [
  {
    icon: Heart,
    title: 'Start with a gentle check-in',
    desc: 'Let us know how you feel in seconds — it shapes everything that follows.',
  },
  {
    icon: Sparkles,
    title: 'Grow with personal insights',
    desc: 'Spot patterns in your mood through calm, science-based analysis.',
  },
  {
    icon: MessageCircle,
    title: 'Meet a therapist who fits',
    desc: 'Step into a secure session with a professional matched to your needs.',
  },
]

const trustHighlights = [
  { icon: ShieldCheck, label: '100% Private & Encrypted' },
  { icon: BadgeCheck, label: 'Licensed Therapists' },
  { icon: Clock, label: '24/7 Availability' },
]

const FeaturesTrustSection = () => {
  return (
    <section className="section-pad relative overflow-hidden bg-white">
      <div className="pointer-events-none absolute inset-0" aria-hidden="true">
        <div className="absolute -top-20 right-0 h-80 w-80 rounded-full bg-teal-50 blur-3xl" />
        <div className="absolute -bottom-24 -left-16 h-72 w-72 rounded-full bg-emerald-50 blur-3xl" />
      </div>

      <div className="section-shell relative z-10">
        <Reveal className="section-head" y={24}>
          <span className="eyebrow">Built for your mind</span>
          <h2 className="section-title">
            A smarter way to <span className="text-teal-700">mental wellness</span>
          </h2>
          <p className="section-sub">
            Everything you need, from daily check‑ins to professional therapy, in one serene space.
          </p>
        </Reveal>

        <div className="grid items-center gap-14 lg:grid-cols-2 lg:gap-16">
          {/* Left: Image */}
          <Reveal x={-24} y={0} duration={0.7}>
            <div className="relative mx-auto max-w-lg lg:max-w-none">
              <div className="relative aspect-[4/3] w-full overflow-hidden rounded-[2rem] border border-stone-200/60 shadow-card">
                <Image
                  src="https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=800&h=600&fit=crop"
                  alt="Person meditating in nature"
                  fill
                  sizes="(max-width: 1024px) 90vw, 45vw"
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-tr from-black/15 via-transparent to-transparent" />
              </div>

              <div className="absolute -bottom-5 -left-5 flex items-center gap-3 rounded-2xl border border-white/60 bg-white/90 px-4 py-2.5 shadow-float backdrop-blur">
                <div className="rounded-full bg-teal-100 p-2">
                  <Heart className="h-4 w-4 text-teal-600" />
                </div>
                <div>
                  <p className="text-xs font-semibold text-stone-700">98% of users</p>
                  <p className="text-xs text-stone-500">feel better within 4 weeks</p>
                </div>
              </div>
            </div>
          </Reveal>

          {/* Right: Feature list */}
          <Reveal x={24} y={0} duration={0.7}>
            <div className="space-y-8">
              <div>
                <h3 className="text-2xl font-semibold text-stone-900">How your care journey works</h3>
                <p className="mt-1 text-stone-500">From first check-in to your therapist — three simple steps.</p>
              </div>

              <div className="space-y-4">
                {coreFeatures.map((feat) => {
                  const Icon = feat.icon
                  return (
                    <div
                      key={feat.title}
                      className="group flex items-start gap-4 rounded-2xl p-3 transition-colors duration-300 hover:bg-teal-50/60"
                    >
                      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-teal-50 text-teal-700 transition-transform duration-300 group-hover:scale-105">
                        <Icon className="h-5 w-5" />
                      </div>
                      <div>
                        <h4 className="font-semibold text-stone-800">{feat.title}</h4>
                        <p className="text-sm text-stone-500">{feat.desc}</p>
                      </div>
                    </div>
                  )
                })}
              </div>

              <div className="border-t border-stone-100 pt-6">
                <p className="mb-3 text-sm font-medium text-stone-600">
                  Trusted by over 10,000+ people
                </p>
                <div className="flex flex-wrap gap-x-5 gap-y-2">
                  {trustHighlights.map((item) => {
                    const Icon = item.icon
                    return (
                      <span
                        key={item.label}
                        className="inline-flex items-center gap-1.5 text-xs text-stone-500"
                      >
                        <Icon className="h-3.5 w-3.5 text-teal-600" />
                        {item.label}
                      </span>
                    )
                  })}
                </div>
              </div>

              <Link href="/assessment" className="btn-primary mt-2">
                Start your free assessment
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  )
}

export default FeaturesTrustSection
