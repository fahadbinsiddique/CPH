'use client'

import Link from 'next/link'
import Image from 'next/image'
import { ArrowRight, ShieldCheck, MessageCircle, Star, Users, Clock, CheckCircle2, Sparkles, Heart, UserCheck, CreditCard } from 'lucide-react'
import Reveal from '@/components/ui/Reveal'

const FinalCTA = () => {
  return (
    <section className="section-pad section-pad-lg relative overflow-hidden bg-gradient-to-b from-white via-stone-50/50 to-violet-50/60" aria-labelledby="final-cta-heading">
      <div className="pointer-events-none absolute inset-0" aria-hidden="true">
        <div className="absolute -bottom-28 -left-24 h-96 w-96 rounded-full bg-violet-100/50 blur-3xl" />
        <div className="absolute -right-24 -top-24 h-96 w-96 rounded-full bg-emerald-100/50 blur-3xl" />
      </div>

      <div className="section-shell relative z-10">
        <Reveal y={26} duration={0.7}>
          <div className="relative mx-auto max-w-5xl overflow-hidden rounded-[2rem] border border-stone-200/70 bg-white shadow-card">
            {/* Decorative banner */}
            <div className="relative h-40 md:h-48 lg:h-56 overflow-hidden">
              <Image
                src="/Peaceful therapy session illustration.png"
                alt="Peaceful therapy session illustration"
                fill
                priority
                sizes="(max-width: 1024px) 100vw, 56rem"
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-black/5 to-transparent" />
              {/* Floating trust badge */}
              <div className="absolute bottom-4 left-4 right-4 md:bottom-6 md:left-6 md:right-auto md:w-64">
                <div className="flex items-center gap-3 rounded-2xl bg-white/95 backdrop-blur-sm px-4 py-3 shadow-xl">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-violet-100">
                    <Star className="h-5 w-5 text-violet-600" />
                  </div>
                  <div className="text-left">
                    <p className="text-sm font-bold text-stone-900">4.9/5 • 2,800+ reviews</p>
                    <p className="text-xs text-stone-500">Trusted by 12,000+ people</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="px-6 pb-8 pt-7 md:px-12 md:pb-10 lg:px-16 lg:py-12">
              <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
                {/* Main CTA */}
                <div className="md:col-span-2 lg:col-span-2 text-center md:text-left">
                  <span className="inline-flex items-center gap-2 rounded-full border border-violet-200 bg-violet-50 px-4 py-1.5 text-sm font-medium text-violet-700">
                    <ShieldCheck className="h-4 w-4" />
                    Safe, secure, professional • HIPAA compliant
                  </span>

                  <h2 id="final-cta-heading" className="mt-5 text-3xl md:text-4xl font-bold tracking-tight text-stone-900">
                    Ready to <span className="gradient-text-primary">feel better</span>?
                  </h2>
                  <p className="mx-auto mt-4 max-w-xl text-lg text-stone-600">
                    Take the first step today — thousands have found peace, clarity, and support with CPH.
                    Your journey starts with a free 3-minute assessment.
                  </p>

                  {/* Quick Stats */}
                  <div className="mt-8 flex flex-wrap items-center justify-center gap-x-8 gap-y-4 md:justify-start">
                    <div className="flex items-center gap-2 text-sm text-stone-600">
                      <CheckCircle2 className="h-4 w-4 text-violet-600" />
                      <span>Free assessment</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-stone-600">
                      <Clock className="h-4 w-4 text-violet-600" />
                      <span>Match in 48 hrs</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-stone-600">
                      <Users className="h-4 w-4 text-violet-600" />
                      <span>Insurance accepted</span>
                    </div>
                  </div>

                  {/* Primary CTAs */}
                  <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row sm:gap-4 md:justify-start">
                    <Link href="/assessment" className="btn-primary-lg w-full sm:w-auto">
                      Start Free Assessment
                      <ArrowRight className="h-5 w-5" />
                    </Link>
                    <Link href="/consultant" className="btn-outline-lg w-full sm:w-auto">
                      Browse Therapists
                    </Link>
                  </div>

                  <p className="mt-6 text-sm text-stone-500">
                    No credit card required · Cancel anytime · 100% confidential
                  </p>
                </div>

                {/* Alternative Pathways */}
                <div className="relative rounded-2xl border border-stone-200/70 bg-stone-50/50 p-6">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-violet-100">
                      <Sparkles className="h-6 w-6 text-violet-600" />
                    </div>
                    <h3 className="text-lg font-bold text-stone-900">Not ready for therapy?</h3>
                  </div>

                  <p className="text-sm text-stone-600 mb-6">
                    Start with our free self-guided tools — no commitment needed.
                  </p>

                  <div className="space-y-3">
                    <Link
                      href="/assessment"
                      className="flex w-full items-center justify-center gap-3 rounded-xl border border-stone-200 bg-white px-4 py-3 text-sm font-medium text-stone-700 transition-all duration-300 hover:border-violet-300 hover:bg-violet-50 hover:text-violet-700"
                    >
                      <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-violet-50">
                        <Sparkles className="h-4 w-4 text-violet-600" />
                      </div>
                      <span>Take the free assessment</span>
                    </Link>
                    <Link
                      href="/services"
                      className="flex w-full items-center justify-center gap-3 rounded-xl border border-stone-200 bg-white px-4 py-3 text-sm font-medium text-stone-700 transition-all duration-300 hover:border-violet-300 hover:bg-violet-50 hover:text-violet-700"
                    >
                      <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-50">
                        <Heart className="h-4 w-4 text-emerald-600" />
                      </div>
                      <span>Explore self-care tools</span>
                    </Link>
                    <a
                      href="mailto:cfphuk@gmail.com"
                      className="flex w-full items-center justify-center gap-3 rounded-xl border border-stone-200 bg-white px-4 py-3 text-sm font-medium text-stone-700 transition-all duration-300 hover:border-violet-300 hover:bg-violet-50 hover:text-violet-700"
                    >
                      <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-rose-50">
                        <MessageCircle className="h-4 w-4 text-rose-600" />
                      </div>
                      <span>Ask us a question</span>
                    </a>
                  </div>
                </div>
              </div>

              {/* Trust Footer */}
              <div className="mt-10 pt-8 border-t border-stone-100">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
                  <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 text-sm text-stone-500">
                    <span className="flex items-center gap-1.5">
                      <ShieldCheck className="h-4 w-4 text-violet-500" />
                      HIPAA Compliant
                    </span>
                    <span className="flex items-center gap-1.5">
                      <ShieldCheck className="h-4 w-4 text-violet-500" />
                      End-to-End Encryption
                    </span>
                    <span className="flex items-center gap-1.5">
                      <UserCheck className="h-4 w-4 text-violet-500" />
                      Licensed Therapists
                    </span>
                    <span className="flex items-center gap-1.5">
                      <CreditCard className="h-4 w-4 text-violet-500" />
                      Insurance Accepted
                    </span>
                  </div>
                  <div className="flex items-center justify-center md:justify-end gap-4 text-sm text-stone-500">
                    <span>Questions? </span>
                    <a href="mailto:cfphuk@gmail.com" className="font-medium text-violet-700 hover:text-violet-800 underline">
                      Contact us
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  )
}

export default FinalCTA