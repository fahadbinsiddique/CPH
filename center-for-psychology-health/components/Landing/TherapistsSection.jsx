'use client'

import { useState, useRef, useMemo } from 'react'
import Image from 'next/image'
import { motion } from 'framer-motion'
import { Star, MessageCircle, BadgeCheck, ArrowRight, Clock, Users, Sparkles } from 'lucide-react'
import Autoplay from 'embla-carousel-autoplay'
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel' // Make sure this path matches your shadcn installation
import { Button } from '../ui/button'
import { buttonVariants } from '../ui/button'

const therapists = [
  {
    name: 'Dr. Sarah Ahmed',
    title: 'Clinical Psychologist',
    experience: '8+ Years',
    sessions: '1200+',
    rating: 4.9,
    specialty: 'Anxiety & Stress',
    available: true,
    image:
      'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?q=80&w=800&auto=format&fit=crop', // Replace with real images
  },
  {
    name: 'Dr. John Miller',
    title: 'Licensed Therapist',
    experience: '6+ Years',
    sessions: '950+',
    rating: 4.8,
    specialty: 'Depression & Trauma',
    available: true,
    image:
      'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?q=80&w=800&auto=format&fit=crop',
  },
  {
    name: 'JUM Nazmul Hossain',
    title: 'Consultant Psychologist',
    experience: '5+ Years',
    sessions: '1100+',
    rating: 4.9,
    specialty: 'Mindfulness & Healing',
    available: false,
    image: 'https://centreforpsychologicalhealth.com/assets/uploads/doctor-11.png',
  },
  {
    name: 'Dr. Michael Rahman',
    title: 'Psychiatric Consultant',
    experience: '10+ Years',
    sessions: '1500+',
    rating: 5.0,
    specialty: 'CBT Specialist',
    available: true,
    image:
      'https://images.unsplash.com/photo-1622253692010-333f2da6031d?q=80&w=800&auto=format&fit=crop',
  },
  {
    name: 'Anjuman Ara',
    title: 'Senior Psychologist',
    experience: '7+ Years',
    sessions: '800+',
    rating: 4.7,
    specialty: 'Child & Adolescent',
    available: true,
    image:
      'https://centreforpsychologicalhealth.com/assets/uploads/doctor-21.png?q=80&w=800&auto=format&fit=crop',
  },
]

const TherapistsSection = () => {
  // Setup Autoplay plugin for Embla Carousel
  const autoplayPlugin = useMemo(() => Autoplay({ delay: 3000, stopOnInteraction: true }), [])

  return (
    <section className="relative py-24 bg-gradient-to-br from-slate-50 via-white to-indigo-50/40 overflow-hidden">
      {/* Background elements remain same */}
      <div className="absolute inset-0 pointer-events-none">
        <motion.div
          animate={{ scale: [1, 1.2, 1], x: [0, 30, -20, 0], y: [0, -20, 20, 0] }}
          transition={{ duration: 20, repeat: Infinity, repeatType: 'mirror' }}
          className="absolute top-[-150px] left-[-150px] w-[400px] h-[400px] bg-emerald-200/30 rounded-full blur-3xl"
        />
        <motion.div
          animate={{ scale: [1, 1.1, 1], x: [0, -30, 20, 0], y: [0, 20, -20, 0] }}
          transition={{ duration: 25, repeat: Infinity, repeatType: 'mirror' }}
          className="absolute bottom-[-150px] right-[-150px] w-[400px] h-[400px] bg-blue-200/30 rounded-full blur-3xl"
        />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-8">
        {/* Heading Area */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center max-w-2xl mx-auto mb-14"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-100 text-emerald-700 text-sm font-medium mb-4">
            <Sparkles className="w-4 h-4" />
            Expert Care
          </div>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent">
            Meet Our Specialists
          </h2>
          <p className="mt-4 text-slate-600 text-lg max-w-xl mx-auto">
            Connect with licensed professionals who are here to support your mental wellness
            journey.
          </p>
        </motion.div>

        {/* Shadcn Auto-Carousel */}
        <div className="relative px-4 sm:px-10">
          <Carousel
            plugins={[autoplayPlugin]}
            className="w-full"
            onMouseEnter={() => autoplayPlugin.stop()}
            onMouseLeave={() => autoplayPlugin.reset()}
            opts={{
              align: 'start',
              loop: true,
            }}
          >
            <CarouselContent className="-ml-4 md:-ml-6">
              {therapists.map((doc, index) => (
                <CarouselItem
                  key={index}
                  className="pl-4 md:pl-6 md:basis-1/2 lg:basis-1/3 xl:basis-1/4"
                >
                  {/* Product-Style Therapist Card */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    className="group h-full flex flex-col bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden transition-all duration-300 hover:shadow-xl hover:border-emerald-200"
                  >
                    {/* Top Image Section (Card's top half) */}
                    <div className="relative h-56 w-full overflow-hidden bg-slate-100">
                      <Image
                        src={doc.image}
                        alt={doc.name}
                        fill
                        className="object-cover object-top transition-transform duration-700 group-hover:scale-105"
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                      />

                      {/* Availability Badge over Image */}
                      {doc.available && (
                        <div className="absolute top-4 right-4 flex items-center gap-1.5 bg-white/90 backdrop-blur-sm rounded-full px-3 py-1 text-xs font-semibold shadow-sm">
                          <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
                          <span className="text-emerald-700">Available</span>
                        </div>
                      )}

                      {/* Overlay Gradient for readability */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/0 to-transparent opacity-60" />

                      {/* Floating Verification Badge */}
                      <div className="absolute bottom-3 left-4 flex items-center gap-1.5 bg-white/20 backdrop-blur-md rounded-full px-2.5 py-1 text-xs border border-white/30 text-white">
                        <BadgeCheck className="w-3.5 h-3.5 text-blue-400" />
                        <span>Verified</span>
                      </div>
                    </div>

                    {/* Bottom Info Section (Card's bottom half) */}
                    <div className="p-5 flex flex-col flex-grow hover:bg-emerald-50">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <h3 className="text-lg font-bold text-slate-800 line-clamp-1 group-hover:text-emerald-600 transition-colors">
                            {doc.name}
                          </h3>
                          <p className="text-sm text-slate-500 font-medium mt-0.5">{doc.title}</p>
                        </div>
                      </div>

                      {/* Specialty Tag */}
                      <div className="mb-4">
                        <span className="inline-block text-xs font-medium bg-emerald-50 text-emerald-700 border border-emerald-100 rounded-full px-2.5 py-1">
                          {doc.specialty}
                        </span>
                      </div>

                      {/* Stats Grid */}
                      {/* <div className="grid grid-cols-2 gap-y-3 gap-x-2 text-sm text-slate-600 mb-5 mt-auto">
                        <div className="flex items-center gap-1.5">
                          <Clock className="w-4 h-4 text-slate-400" />
                          <span className="text-xs">{doc.experience}</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <Users className="w-4 h-4 text-slate-400" />
                          <span className="text-xs">{doc.sessions}</span>
                        </div>
                        <div className="col-span-2 flex items-center gap-1 text-amber-500">
                          <div className="flex items-center gap-0.5">
                            {[...Array(5)].map((_, i) => (
                              <Star
                                key={i}
                                className={`w-3.5 h-3.5 ${
                                  i < Math.floor(doc.rating)
                                    ? 'fill-amber-400 text-amber-400'
                                    : 'fill-slate-200 text-slate-200'
                                }`}
                              />
                            ))}
                          </div>
                          <span className="text-xs font-semibold text-slate-700 ml-1">
                            {doc.rating}
                          </span>
                        </div>
                      </div> */}

                      {/* Action Button */}
                      <button className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-slate-50 text-slate-700 text-sm font-semibold border border-slate-200 hover:bg-emerald-600 hover:text-white hover:border-emerald-600 transition-all group/btn mt-auto">
                        <MessageCircle className="w-4 h-4" />
                        Book Session
                      </button>
                    </div>
                  </motion.div>
                </CarouselItem>
              ))}
            </CarouselContent>

            {/* Custom styled Carousel Controls */}
            <div className="hidden md:block">
              <CarouselPrevious className="-left-12 lg:-left-16 bg-white border-slate-200 hover:bg-emerald-50 hover:text-emerald-600 hover:border-emerald-200 w-12 h-12" />
              <CarouselNext className="-right-12 lg:-right-16 bg-white border-slate-200 hover:bg-emerald-50 hover:text-emerald-600 hover:border-emerald-200 w-12 h-12" />
            </div>
          </Carousel>
        </div>

        {/* Bottom CTA */}
        <comp />
        <motion.div
          initial={{ opacity: 0, y: 25 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="mt-12 text-center"
        >
          <Button
            variant="secondary"
            className="inline-flex items-center gap-2 text-sm font-semibold border-2 border-teal-600 text-teal-700 text-emerald-600 hover:text-emerald-700 transition-colors group"
          >
            <span>View all 50+ specialists</span>
            <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
          </Button>
        </motion.div>
      </div>
    </section>
  )
}

export default TherapistsSection
