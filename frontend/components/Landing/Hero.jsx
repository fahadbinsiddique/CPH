'use client'

import { useRef } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { useGSAP } from '@gsap/react'
import { gsap, prefersReducedMotion } from '@/lib/motion'
import { ArrowRight, ArrowUpRight, Star } from 'lucide-react'

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
        .from('[data-hero-trust]', { y: 20, opacity: 0, duration: 0.6, stagger: 0.08 }, '-=0.3')
        .from(
          '[data-hero-image]',
          { scale: 0.96, opacity: 0, duration: 0.9, ease: 'power2.out' },
          '-=0.7'
        )
    },
    { scope: sectionRef }
  )

  // Palette stays inside the brand pair from globals.css: lavender primary +
  // emerald accent — one card per hue, no third/fourth colour family.
  const quickLinks = [
    {
      title: '24/7 Service Available',
      href: '/services',
      avatar: '/doctor-21.png',
      avatarAlt: 'CPH counsellor ready for around-the-clock sessions',
      cardClass: 'bg-gradient-to-br from-emerald-100 via-emerald-50 to-teal-50',
      actionClass: 'bg-emerald-600 group-hover:bg-emerald-700 group-active:bg-emerald-800',
    },
    {
      title: 'Find The Best Specialists',
      href: '/consultant',
      avatar: '/doctor-25.png',
      avatarAlt: 'CPH specialist profile photograph',
      cardClass: 'bg-gradient-to-br from-violet-100 via-violet-50 to-violet-200/70',
      actionClass: 'bg-violet-600 group-hover:bg-violet-700 group-active:bg-violet-800',
    },
  ]

  const heroStats = [
    { value: '200+', label: 'Expert Doctors' },
    { value: '400+', label: 'Recovered Patients' },
    { value: '98%', label: 'Satisfied Rate' },
  ]

  return (
    <section
      ref={sectionRef}
      className="relative overflow-hidden bg-gradient-to-b from-stone-50 via-white to-white pt-20 pb-16 md:pt-28 md:pb-20 lg:pt-32 lg:pb-24 min-h-[90dvh] flex items-center"
    >
      {/* Static tonal background — calm, no looping motion */}
      <div className="pointer-events-none absolute inset-0" aria-hidden="true">
        <div className="absolute -top-32 -left-28 h-96 w-96 rounded-full bg-violet-100/50 blur-3xl" />
        <div className="absolute -bottom-48 -right-24 h-[28rem] w-[28rem] rounded-full bg-emerald-100/60 blur-3xl" />
        <div className="absolute top-[8%] right-[36%] hidden h-72 w-72 rounded-full bg-violet-100/40 blur-3xl md:block" />
        <div className="absolute -left-24 bottom-[10%] h-72 w-72 rounded-full bg-emerald-100/40 blur-3xl" />
        <div className="absolute right-[10%] top-[14%] hidden h-72 w-72 rounded-full border border-violet-100/70 lg:block" />
        <div className="absolute bottom-[12%] left-[42%] hidden h-40 w-40 rounded-full border border-emerald-100/70 lg:block" />
      </div>

      <div className="section-shell relative z-10 w-full">
        <div className="grid items-stretch gap-5 lg:grid-cols-2 lg:gap-6">
          {/* LEFT — CARD: rating pill, headline, CTAs, quick-link sub-cards */}
          <div className="flex flex-col rounded-[2rem] border border-violet-100/70 bg-gradient-to-b from-violet-50 to-white p-6 shadow-card sm:p-8 lg:p-9">
            <span
              data-hero-badge
              className="inline-flex w-fit items-center gap-2 rounded-full bg-white px-4 py-2 text-sm font-semibold text-stone-800 shadow-soft ring-1 ring-stone-200/70"
            >
              <Star className="h-4 w-4 fill-amber-400 text-amber-400" aria-hidden="true" />
              <span className="sr-only">Rated</span>
              <span className="tabular-nums">5.0</span>
              <span className="font-medium text-stone-500">(4,824 Reviews)</span>
            </span>

            <h1
              data-hero-title
              className="mt-5 font-extrabold leading-[1.06] tracking-[-0.035em] text-stone-900 text-balance text-[clamp(2.25rem,1.4vw+1.5rem,3.25rem)]"
            >
              <span className="block">
                Find <span className="gradient-text-primary">calm</span>, clarity,
              </span>
              <span className="block">and emotional balance</span>
            </h1>

            <p data-hero-sub className="text-hero-lead mt-4 font-normal text-stone-600">
              A modern mental wellness platform designed to support your mind with guided therapy,
              mindfulness tools, and professional care—anytime you need it.
            </p>

            {/* Stacked full-width on narrow cards so the pair never wraps ragged */}
            <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center">
              <Link href="/assessment" data-hero-cta className="btn-primary w-full sm:w-auto">
                Start Free Assessment
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </Link>
              <Link href="/consultant" data-hero-cta className="btn-outline w-full sm:w-auto">
                Browse Therapists
              </Link>
            </div>

            {/* Bottom sub-cards — compact quick links with profile avatars */}
            <div className="mt-auto grid grid-cols-1 gap-3 pt-7 sm:grid-cols-2">
              {quickLinks.map((link) => (
                <Link
                  key={link.title}
                  href={link.href}
                  data-hero-trust
                  className={`group relative flex min-h-[6.5rem] flex-col justify-between overflow-hidden rounded-2xl p-4 transition-[transform,box-shadow] duration-300 hover:-translate-y-0.5 hover:shadow-float active:translate-y-0 active:scale-[0.99] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-500 focus-visible:ring-offset-2 focus-visible:ring-offset-white ${link.cardClass}`}
                >
                  <p className="relative z-10 max-w-[62%] text-sm font-bold leading-snug text-stone-800 sm:text-base">
                    {link.title}
                  </p>

                  <span
                    className={`relative z-10 mt-4 flex h-8 w-8 items-center justify-center rounded-full text-white transition-colors duration-300 ${link.actionClass}`}
                    aria-hidden="true"
                  >
                    <ArrowUpRight className="h-4 w-4 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                  </span>

                  <span className="absolute bottom-4 right-4 h-16 w-16 overflow-hidden rounded-full ring-2 ring-white/80 shadow-md transition-transform duration-300 group-hover:scale-105">
                    <Image
                      src={link.avatar}
                      alt={link.avatarAlt}
                      fill
                      sizes="64px"
                      className="object-cover object-top"
                    />
                  </span>
                </Link>
              ))}
            </div>
          </div>

          {/* RIGHT — CARD: hero visual + floating glass stats pill */}
          <div
            data-hero-image
            className="relative min-h-[22rem] overflow-hidden rounded-[2rem] border border-violet-100/50 shadow-card sm:min-h-[26rem] lg:min-h-0"
          >
            <Image
              src="/banner1.png"
              alt="CPH mental wellness platform — assessment, chat, booking, and therapist profiles"
              fill
              priority
              sizes="(max-width: 1024px) 92vw, 46vw"
              className="object-cover object-center"
            />

            {/* Scrim keeps the glass pill legible over any part of the artwork */}
            <div
              className="pointer-events-none absolute inset-x-0 bottom-0 h-2/5 bg-gradient-to-t from-stone-900/70 via-stone-900/25 to-transparent"
              aria-hidden="true"
            />

            <div className="absolute inset-x-4 bottom-4 sm:inset-x-6 sm:bottom-6">
              {/* True glass: blurred plate + inner refraction ring + inset highlight */}
              <div className="grid grid-cols-3 overflow-hidden rounded-2xl border border-white/30 bg-white/15 shadow-[inset_0_1px_0_rgba(255,255,255,0.45),0_8px_32px_-8px_rgba(30,27,46,0.45)] ring-1 ring-white/20 backdrop-blur-md">
                {heroStats.map((stat, index) => (
                  <div
                    key={stat.label}
                    className={`flex flex-col items-center justify-center px-1.5 py-3 text-center sm:px-3 sm:py-4 ${
                      index > 0 ? 'border-l border-white/25' : ''
                    }`}
                  >
                    <p className="text-lg font-bold tabular-nums text-white sm:text-xl">
                      {stat.value}
                    </p>
                    <p className="mt-0.5 text-[10px] leading-tight text-white/85 sm:text-xs">
                      {stat.label}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default Hero
