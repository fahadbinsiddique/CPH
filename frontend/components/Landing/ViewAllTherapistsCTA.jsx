'use client'

import Link from 'next/link'
import { ArrowRight, Users, Search } from 'lucide-react'
import Reveal from '@/components/ui/Reveal'

const ViewAllTherapistsCTA = () => {
  return (
    <section className="section-pad relative overflow-hidden bg-stone-50/70">
      <div className="section-shell relative z-10">
        <Reveal y={26} duration={0.7}>
          <div className="mx-auto max-w-5xl rounded-[2rem] border border-stone-200/70 bg-white px-6 py-14 text-center shadow-soft md:px-12">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-teal-50">
              <Users className="h-6 w-6 text-teal-600" />
            </div>

            <h2 className="mx-auto mt-6 max-w-2xl text-2xl font-bold tracking-tight text-stone-900 md:text-3xl">
              Find the right therapist for your journey
            </h2>

            <p className="mx-auto mt-4 max-w-xl text-stone-600">
              Explore our full network of licensed mental health professionals and choose someone
              who truly understands your needs and goals.
            </p>

            <div className="mt-8 flex flex-col justify-center gap-4 sm:flex-row">
              <Link href="/consultant" className="btn-primary w-full sm:w-auto">
                <Search className="h-4 w-4" />
                View All Therapists
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link href="/assessment" className="btn-outline w-full sm:w-auto">
                Take Matching Quiz
              </Link>
            </div>

            <p className="mt-6 text-xs text-stone-500">
              Verified professionals &middot; Confidential sessions &middot; Personalized matching
            </p>
          </div>
        </Reveal>
      </div>
    </section>
  )
}

export default ViewAllTherapistsCTA
