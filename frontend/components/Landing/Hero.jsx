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
} from 'lucide-react'


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
        .from(
          '[data-hero-image]',
          { scale: 0.96, opacity: 0, duration: 0.9, ease: 'power2.out' },
          '-=0.7'
        )
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

          
          </div>

          {/* RIGHT — IMAGE */}
          <div data-hero-image className="relative mx-auto w-full lg:max-w-none">
            <div className="relative aspect-[16/10] w-full overflow-hidden rounded-[2rem] ring-1 ring-teal-100/50 shadow-card">
              <Image
                src="/banner1.png"
                alt="CPH mental wellness platform — assessment, chat, booking, and therapist profiles"
                fill
                priority
                sizes="(max-width: 1024px) 90vw, 48vw"
                className="object-cover object-center"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default Hero
