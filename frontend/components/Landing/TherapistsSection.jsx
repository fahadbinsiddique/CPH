'use client'

import { useMemo } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { motion, useReducedMotion } from 'framer-motion'
import { MessageCircle, BadgeCheck, ArrowRight, Sparkles } from 'lucide-react'
import Autoplay from 'embla-carousel-autoplay'
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel'
import { Button } from '../ui/button'
import Reveal from '@/components/ui/Reveal'

const therapists = [
  {
    name: 'Dr. Sarah Ahmed',
    title: 'Clinical Psychologist',
    specialty: 'Anxiety & Stress',
    available: true,
    image:
      'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?q=80&w=800&auto=format&fit=crop',
  },
  {
    name: 'Dr. John Miller',
    title: 'Licensed Therapist',
    specialty: 'Depression & Trauma',
    available: true,
    image:
      'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?q=80&w=800&auto=format&fit=crop',
  },
  {
    name: 'JUM Nazmul Hossain',
    title: 'Consultant Psychologist',
    specialty: 'Mindfulness & Healing',
    available: false,
    image: 'https://centreforpsychologicalhealth.com/assets/uploads/doctor-11.png',
  },
  {
    name: 'Dr. Michael Rahman',
    title: 'Psychiatric Consultant',
    specialty: 'CBT Specialist',
    available: true,
    image:
      'https://images.unsplash.com/photo-1622253692010-333f2da6031d?q=80&w=800&auto=format&fit=crop',
  },
  {
    name: 'Anjuman Ara',
    title: 'Senior Psychologist',
    specialty: 'Child & Adolescent',
    available: true,
    image:
      'https://centreforpsychologicalhealth.com/assets/uploads/doctor-21.png?q=80&w=800&auto=format&fit=crop',
  },
]

const TherapistsSection = () => {
  const prefersReducedMotion = useReducedMotion()

  const autoplayPlugin = useMemo(
    () =>
      prefersReducedMotion
        ? undefined
        : Autoplay({ delay: 4000, stopOnInteraction: true }),
    [prefersReducedMotion]
  )

  return (
    <section className="section-pad relative overflow-hidden bg-white">
      <div className="pointer-events-none absolute inset-0" aria-hidden="true">
        <div className="absolute -top-24 -left-20 h-80 w-80 rounded-full bg-teal-50 blur-3xl" />
        <div className="absolute -right-24 -bottom-24 h-80 w-80 rounded-full bg-emerald-50 blur-3xl" />
      </div>

      <div className="section-shell relative z-10">
        <Reveal className="section-head" y={24}>
          <span className="eyebrow">
            <Sparkles className="h-3.5 w-3.5" />
            Expert Care
          </span>
          <h2 className="section-title">Meet Our Specialists</h2>
          <p className="section-sub">
            Connect with licensed professionals who are here to support your mental wellness
            journey.
          </p>
        </Reveal>

        <Reveal y={30} duration={0.8}>
          <div className="relative px-2 sm:px-12">
            <Carousel
              plugins={autoplayPlugin ? [autoplayPlugin] : undefined}
              className="w-full"
              onMouseEnter={() => autoplayPlugin?.stop()}
              onMouseLeave={() => autoplayPlugin?.reset()}
              opts={{ align: 'start', loop: true }}
            >
              <CarouselContent className="-ml-4 md:-ml-6">
                {therapists.map((doc, index) => (
                  <CarouselItem
                    key={index}
                    className="pl-4 md:pl-6 md:basis-1/2 lg:basis-1/3 xl:basis-1/4"
                  >
                    <div className="group flex h-full flex-col overflow-hidden rounded-2xl border border-slate-200/70 bg-white shadow-soft transition-all duration-300 hover:-translate-y-1 hover:border-teal-200 hover:shadow-card">
                      <div className="relative h-56 w-full overflow-hidden bg-slate-100">
                        <Image
                          src={doc.image}
                          alt={doc.name}
                          fill
                          className="object-cover object-top transition-transform duration-700 group-hover:scale-105"
                          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                        />

                       

                        <div className="absolute inset-0 bg-gradient-to-t from-black/45 via-black/0 to-transparent" />

                        
                      </div>

                      <div className="flex flex-1 flex-col p-5">
                        <h3 className="text-lg font-bold leading-tight text-slate-800 transition-colors group-hover:text-teal-700">
                          {doc.name}
                        </h3>
                        <p className="mt-0.5 text-sm font-medium text-slate-500">{doc.title}</p>

                        <div className="mt-3">
                          <span className="inline-block rounded-full border border-teal-100 bg-teal-50 px-2.5 py-1 text-xs font-medium text-teal-700">
                            {doc.specialty}
                          </span>
                        </div>

                        <Link
                          href="/consultant"
                          className="mt-auto flex w-full items-center justify-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm font-semibold text-slate-700 transition-all duration-300 hover:border-teal-600 hover:bg-teal-700 hover:text-white"
                        >
                          <MessageCircle className="h-4 w-4" />
                          Book Session
                        </Link>
                      </div>
                    </div>
                  </CarouselItem>
                ))}
              </CarouselContent>

              <div className="hidden md:block">
                <CarouselPrevious className="-left-12 h-11 w-11 border-slate-200 bg-white text-slate-600 transition-colors hover:border-teal-200 hover:bg-teal-50 hover:text-teal-700 lg:-left-14" />
                <CarouselNext className="-right-12 h-11 w-11 border-slate-200 bg-white text-slate-600 transition-colors hover:border-teal-200 hover:bg-teal-50 hover:text-teal-700 lg:-right-14" />
              </div>
            </Carousel>
          </div>
        </Reveal>

        <Reveal y={20} delay={0.15}>
          <div className="mt-12 text-center">
            <Button asChild variant="ghost" className="group h-auto rounded-2xl px-8 py-4 text-base font-semibold text-teal-700 hover:bg-teal-50">
              <Link href="/consultant">
                <span>View all 50+ specialists</span>
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Link>
            </Button>
          </div>
        </Reveal>
      </div>
    </section>
  )
}

export default TherapistsSection
