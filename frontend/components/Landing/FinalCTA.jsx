'use client'

import Link from 'next/link'
import Image from 'next/image'
import { ArrowRight, ShieldCheck, MessageCircle, Star } from 'lucide-react'
import Reveal from '@/components/ui/Reveal'

const FinalCTA = () => {
  return (
    <section className="section-pad relative overflow-hidden bg-gradient-to-b from-white to-teal-50/60">
      <div className="pointer-events-none absolute inset-0" aria-hidden="true">
        <div className="absolute -bottom-28 -left-24 h-96 w-96 rounded-full bg-teal-100/50 blur-3xl" />
        <div className="absolute -right-24 -top-24 h-96 w-96 rounded-full bg-emerald-100/50 blur-3xl" />
      </div>

      <div className="section-shell relative z-10">
        <Reveal y={26} duration={0.7}>
          <div className="relative mx-auto max-w-4xl overflow-hidden rounded-[2rem] border border-slate-200/70 bg-white shadow-card">
            {/* Decorative banner */}
            <div className="relative h-40 overflow-hidden md:h-44">
              <Image
                src="/Peaceful therapy session illustration.png"
                alt="Peaceful therapy session illustration"
                fill
                priority
                sizes="(max-width: 1024px) 100vw, 56rem"
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/15 via-transparent to-transparent" />
            </div>

            <div className="px-6 pb-8 pt-7 text-center md:px-12 md:pb-10">
              <span className="inline-flex items-center gap-2 rounded-full border border-teal-100 bg-teal-50 px-4 py-1.5 text-sm font-medium text-teal-700">
                <ShieldCheck className="h-4 w-4" />
                Safe, secure, professional
              </span>

              <h2 className="mt-5 text-2xl font-bold tracking-tight text-slate-900 md:text-3xl">
                Ready to feel better?
              </h2>
              <p className="mx-auto mt-3 max-w-xl text-slate-600">
                Take the first step today – thousands have found peace with SereneMind.
              </p>

              <div className="mt-7 flex flex-col justify-center gap-3 sm:flex-row sm:gap-4">
                <Link href="/consultant" className="btn-primary w-full sm:w-auto sm:px-8">
                  Start consultation now
                  <ArrowRight className="h-4 w-4" />
                </Link>
                <a href="mailto:cfphuk@gmail.com" className="btn-outline w-full sm:w-auto sm:px-8">
                  <MessageCircle className="h-4 w-4" />
                  Ask a question
                </a>
              </div>

             
            </div>

            
          </div>
        </Reveal>
      </div>
    </section>
  )
}

export default FinalCTA