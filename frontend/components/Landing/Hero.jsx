'use client'

import { useRef } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { useGSAP } from '@gsap/react'
import { gsap, prefersReducedMotion } from '@/lib/motion'
import {
  ArrowRight,
  ShieldCheck,
  BadgeCheck,
  HeartHandshake,
  Heart,
  User,
  Sparkles,
} from 'lucide-react'

const careOptions = [
  {
    title: 'Personal Care',
    desc: 'Tailored support for my own journey',
    tag: 'Individual',
    icon: User,
    chip: 'bg-emerald-100 text-emerald-700',
    hover: 'group-hover:border-emerald-200',
  },
  {
    title: 'Relational Wellness',
    desc: 'Strengthening the bond with my partner',
    tag: 'Couples',
    icon: HeartHandshake,
    chip: 'bg-rose-100 text-rose-700',
    hover: 'group-hover:border-rose-200',
  },
  {
    title: 'Youth Support',
    desc: 'Guidance for my child or teen',
    tag: 'Teen / Child',
    icon: Sparkles,
    chip: 'bg-amber-100 text-amber-700',
    hover: 'group-hover:border-amber-200',
  },
]

const trustSignals = [
  { icon: BadgeCheck, label: 'Licensed therapists' },
  { icon: ShieldCheck, label: 'Confidential & private' },
  { icon: HeartHandshake, label: 'Evidence-based care' },
]

const Hero = () => {
  const sectionRef = useRef(null)

  useGSAP(
    () => {
      if (prefersReducedMotion()) return

      const tl = gsap.timeline({ defaults: { ease: 'power3.out' } })

      tl.from('[data-hero-badge]', { y: 24, opacity: 0, duration: 0.7 })
        .from(
          '[data-hero-title] > span',
          { y: 34, opacity: 0, duration: 0.8, stagger: 0.12 },
          '-=0.35'
        )
        .from('[data-hero-sub]', { y: 24, opacity: 0, duration: 0.7 }, '-=0.5')
        .from('[data-hero-cta]', { y: 20, opacity: 0, duration: 0.6, stagger: 0.1 }, '-=0.45')
        .from('[data-hero-trust]', { y: 16, opacity: 0, duration: 0.5 }, '-=0.35')
        .from('[data-hero-cards]', { y: 28, opacity: 0, duration: 0.7 }, '-=0.3')
        .from(
          '[data-hero-image]',
          { scale: 0.96, opacity: 0, duration: 0.9, ease: 'power2.out' },
          '-=0.7'
        )
        .from('[data-hero-glass]', { y: 24, opacity: 0, duration: 0.6 }, '-=0.45')
    },
    { scope: sectionRef }
  )

  return (
    <section
      ref={sectionRef}
      className="relative overflow-hidden bg-gradient-to-b from-stone-50 via-white to-white pt-40 pb-20 md:pt-44 md:pb-28"
    >
      {/* Static tonal background — calm, no looping motion */}
      <div className="pointer-events-none absolute inset-0" aria-hidden="true">
        <div className="absolute -top-32 -left-28 h-96 w-96 rounded-full bg-teal-100/50 blur-3xl" />
        <div className="absolute -bottom-48 -right-24 h-[28rem] w-[28rem] rounded-full bg-emerald-100/60 blur-3xl" />
        <div className="absolute top-[8%] right-[36%] hidden h-72 w-72 rounded-full bg-accent-lavender/70 blur-3xl md:block" />
        <div className="absolute -left-24 bottom-[10%] h-72 w-72 rounded-full bg-accent-sky/60 blur-3xl" />
        <div className="absolute right-[10%] top-[14%] hidden h-72 w-72 rounded-full border border-teal-100/70 lg:block" />
        <div className="absolute bottom-[12%] left-[42%] hidden h-40 w-40 rounded-full border border-emerald-100/70 lg:block" />
      </div>

      <div className="section-shell relative z-10">
        <div className="grid items-center gap-14 lg:grid-cols-[1.05fr_0.95fr] lg:gap-16">
          {/* LEFT — TEXT & CTA */}
          <div className="text-center lg:text-left">
            <span
              data-hero-badge
              className="eyebrow justify-center lg:justify-start"
            >
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-teal-400 opacity-60" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-teal-500" />
              </span>
              Your safe space for mental wellness
            </span>

            <h1 data-hero-title className="text-hero font-bold text-stone-900">
              <span className="block">
                Find <span className="text-accent-warm">calm</span>, clarity,
              </span>
              <span className="block text-teal-700">and emotional balance</span>
            </h1>

            <p
              data-hero-sub
              className="text-hero-lead mx-auto mt-6 max-w-xl font-normal text-stone-600 lg:mx-0"
            >
              A modern mental wellness platform designed to support your mind with guided therapy,
              mindfulness tools, and professional care—anytime you need it.
            </p>

            <div className="mt-8 flex flex-col items-center gap-4 sm:flex-row sm:justify-center lg:justify-start">
              <Link href="/consultant" data-hero-cta className="btn-primary w-full sm:w-auto">
                Book Appointment
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link href="/consultant" data-hero-cta className="btn-outline w-full sm:w-auto">
                Explore Consultants
              </Link>
            </div>

            <div
              data-hero-trust
              className="mt-8 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 lg:justify-start"
            >
              {trustSignals.map((item) => {
                const Icon = item.icon
                return (
                  <span
                    key={item.label}
                    className="inline-flex items-center gap-1.5 text-sm text-stone-500"
                  >
                    <Icon className="h-4 w-4 text-teal-600" />
                    {item.label}
                  </span>
                )
              })}
            </div>

            {/* Care path cards */}
            <div className="mt-10 pt-2">
              <p className="mb-5 text-xs font-semibold uppercase tracking-[0.14em] text-stone-500">
                Choose your care path
              </p>
              <div data-hero-cards className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                {careOptions.map((option) => {
                  const Icon = option.icon
                  return (
                    <Link
                      key={option.title}
                      href="/services"
                      className={`group relative flex flex-col gap-4 rounded-2xl border border-stone-200/70 bg-white/80 p-5 text-left shadow-soft transition-all duration-300 hover:-translate-y-1 hover:shadow-card focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-500 focus-visible:ring-offset-2 ${option.hover}`}
                    >
                      <div className="flex items-center justify-between gap-3">
                        <span
                          className={`flex h-10 w-10 items-center justify-center rounded-xl transition-transform duration-300 group-hover:scale-105 ${option.chip}`}
                        >
                          <Icon className="h-5 w-5" />
                        </span>
                        <span className="rounded-full border border-stone-200 bg-white px-2.5 py-0.5 text-[11px] font-semibold text-stone-600">
                          {option.tag}
                        </span>
                      </div>
                      <div>
                        <h3 className="text-base font-bold leading-tight text-stone-800 transition-colors group-hover:text-teal-700">
                          {option.title}
                        </h3>
                        <p className="mt-1 text-xs leading-relaxed text-stone-500">
                          {option.desc}
                        </p>
                      </div>
                    </Link>
                  )
                })}
              </div>
            </div>
          </div>

          {/* RIGHT — IMAGE + GLASS CARD */}
          <div data-hero-image className="relative mx-auto w-full max-w-md lg:max-w-none">
            <div className="relative aspect-[4/5] w-full overflow-hidden rounded-[2rem] border border-stone-200/60 shadow-card">
              <Image
                src="/banner.jpg"
                alt="Woman meditating in a serene nature setting"
                fill
                priority
                sizes="(max-width: 1024px) 80vw, 44vw"
                className="object-cover "
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/25 via-transparent to-transparent" />

              {/* Static verified chip */}
              <div className="absolute right-4 top-4 inline-flex items-center gap-1.5 rounded-full bg-white/85 px-3 py-1.5 text-xs font-semibold text-stone-700 shadow-sm backdrop-blur">
                <ShieldCheck className="h-3.5 w-3.5 text-teal-600" />
                Licensed & confidential
              </div>
            </div>

            {/* Static glass card */}
            <div
              data-hero-glass
              className="absolute -bottom-6 left-1/2 w-[86%] -translate-x-1/2 rounded-2xl border border-white/60 bg-white/85 p-4 shadow-float backdrop-blur-xl"
            >
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-teal-100">
                  <Heart className="h-5 w-5 text-teal-600" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-stone-800">Daily check-in</p>
                  <p className="text-xs text-stone-500">How are you feeling today?</p>
                </div>
                <div className="ml-auto">
                  <div className="h-2 w-20 overflow-hidden rounded-full bg-stone-200">
                    <div className="h-full w-2/3 rounded-full bg-teal-500" />
                  </div>
                  <p className="mt-1 text-right text-xs text-stone-400">+23% stability</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default Hero
