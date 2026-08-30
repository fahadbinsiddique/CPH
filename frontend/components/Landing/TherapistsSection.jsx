'use client'

import { useMemo, useEffect, useState, useCallback } from 'react'
import Link from 'next/link'
import { motion, useReducedMotion } from 'framer-motion'
import { MessageCircle, ArrowRight, Sparkles, Loader2, UserX } from 'lucide-react'
import Autoplay from 'embla-carousel-autoplay'
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  CarouselDots,
} from '@/components/ui/carousel'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import Reveal from '@/components/ui/Reveal'
import { consultantService } from '@/services/consultantService'
import { normalizeProfileImage } from '@/lib/utils'

function extractConsultantList(payload) {
  if (Array.isArray(payload)) return payload
  if (!payload || typeof payload !== 'object') return []
  if (Array.isArray(payload.results)) return payload.results
  if (Array.isArray(payload.data?.results)) return payload.data.results
  if (Array.isArray(payload.data)) return payload.data
  return []
}

const TherapistsSection = () => {
  const [therapists, setTherapists] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)
  const [failedImages, setFailedImages] = useState(() => new Set())
  const prefersReducedMotion = useReducedMotion()

  const fetchTherapists = useCallback(async () => {
    setLoading(true)
    setError(false)
    try {
      const res = await consultantService.getAll({ is_featured: true })
      setTherapists(extractConsultantList(res?.data ?? res))
    } catch (err) {
      console.error('Failed to fetch specialists for home section:', err)
      setError(true)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchTherapists()
  }, [fetchTherapists])

  const handleImageError = useCallback((id) => {
    setFailedImages((prev) => {
      if (prev.has(id)) return prev
      const next = new Set(prev)
      next.add(id)
      return next
    })
  }, [])

  const autoplayPlugin = useMemo(
    () =>
      prefersReducedMotion
        ? undefined
        : Autoplay({ delay: 4000, stopOnInteraction: false }),
    [prefersReducedMotion]
  )

  const renderSkeletons = () => (
    <div className="flex gap-6 overflow-hidden">
      {Array.from({ length: 4 }).map((_, i) => (
        <div key={i} className="w-full flex-none md:basis-1/2 lg:basis-1/3 xl:basis-1/4">
          <div className="flex h-full flex-col overflow-hidden rounded-2xl border border-stone-200/70 bg-white shadow-soft">
            <Skeleton className="h-64 sm:h-72 w-full rounded-none" />
            <div className="flex flex-1 flex-col gap-3 p-5">
              <Skeleton className="h-4 w-3/4" />
              <Skeleton className="h-3 w-1/2" />
              <Skeleton className="mt-auto h-9 w-full rounded-xl" />
            </div>
          </div>
        </div>
      ))}
    </div>
  )

  return (
    <section className="section-pad relative overflow-hidden bg-white">
      <div className="pointer-events-none absolute inset-0" aria-hidden="true">
        <div className="absolute -left-20 -top-24 h-80 w-80 rounded-full bg-teal-50 blur-3xl" />
        <div className="absolute -bottom-24 -right-24 h-80 w-80 rounded-full bg-emerald-50 blur-3xl" />
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
            {loading ? (
              renderSkeletons()
            ) : error ? (
              <div className="flex flex-col items-center justify-center gap-4 py-14 text-center">
                <div className="flex h-14 w-14 items-center justify-center rounded-full bg-red-50">
                  <UserX className="h-6 w-6 text-red-500" />
                </div>
                <div>
                  <p className="text-base font-semibold text-stone-800">
                    Could not load specialists
                  </p>
                  <p className="mt-1 text-sm text-stone-500">
                    Something went wrong while fetching our specialists. Please try again.
                  </p>
                </div>
                <Button
                  variant="outline"
                  onClick={fetchTherapists}
                  className="rounded-xl text-stone-700 hover:text-teal-700"
                >
                  <Loader2 className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
                  Try again
                </Button>
              </div>
            ) : therapists.length === 0 ? (
              <div className="flex flex-col items-center justify-center gap-4 py-14 text-center">
                <div className="flex h-14 w-14 items-center justify-center rounded-full bg-teal-50">
                  <Sparkles className="h-6 w-6 text-teal-600" />
                </div>
                <div>
                  <p className="text-base font-semibold text-stone-800">No specialists yet</p>
                  <p className="mt-1 text-sm text-stone-500">
                    Our specialists will be listed here soon. Stay tuned!
                  </p>
                </div>
                <Button asChild variant="outline" className="rounded-xl text-stone-700 hover:text-teal-700">
                  <Link href="/consultant">Browse the directory</Link>
                </Button>
              </div>
            ) : (
              <Carousel
                plugins={autoplayPlugin ? [autoplayPlugin] : undefined}
                className="w-full"
                onMouseEnter={() => autoplayPlugin?.stop()}
                onMouseLeave={() => autoplayPlugin?.reset()}
                opts={{ align: 'start', loop: true }}
              >
                <CarouselContent className="-ml-4 md:-ml-6">
                  {therapists.map((doc) => {
                    const fullName = doc.user?.full_name || 'Mental Health Expert'
                    const title = doc.specializations?.[0]?.name || 'Consultant Psychologist'
                    const profileImg = normalizeProfileImage(doc.profile_image)
                    const showFallback = failedImages.has(doc.id)

                    return (
                      <CarouselItem
                        key={doc.id || doc.slug}
                        className="pl-4 md:basis-1/2 md:pl-6 lg:basis-1/3 xl:basis-1/4"
                      >
                        <motion.div
                          initial={{ opacity: 0, y: 16 }}
                          whileInView={{ opacity: 1, y: 0 }}
                          viewport={{ once: true, margin: '-40px' }}
                          transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
                          className="h-full"
                        >
                          <div className="group flex h-full flex-col overflow-hidden rounded-2xl border border-stone-200/70 bg-white shadow-soft transition-all duration-300 hover:-translate-y-1 hover:border-teal-200 hover:shadow-card">
                            {/* ================= Portrait Container (Fixed Height & Scaled Image) ================= */}
                            <div className="relative h-64 sm:h-72 w-full shrink-0 overflow-hidden bg-gradient-to-br from-teal-50/60 to-emerald-50/60 p-2">
                              {profileImg && !showFallback ? (
                                <>
                                  {/* eslint-disable-next-line @next/next/no-img-element */}
                                  <img
                                    src={profileImg}
                                    alt={`Portrait of ${fullName}`}
                                    loading="lazy"
                                    decoding="async"
                                    onError={() => handleImageError(doc.id)}
                                    className="h-full w-full object-contain object-bottom transition-transform duration-500 group-hover:scale-105"
                                  />
                                  <div className="pointer-events-none absolute inset-x-0 bottom-0 h-12 bg-gradient-to-t from-white/80 to-transparent" />
                                </>
                              ) : (
                                <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-teal-50 to-emerald-100">
                                  <div className="flex h-20 w-20 items-center justify-center rounded-full border border-teal-200 bg-white/90 shadow-sm">
                                    <span className="text-3xl font-bold text-teal-700">
                                      {fullName.charAt(0).toUpperCase()}
                                    </span>
                                  </div>
                                </div>
                              )}
                            </div>

                            {/* ================= Card Content ================= */}
                            <div className="flex flex-1 flex-col p-5">
                              <h3 className="line-clamp-1 text-lg font-bold leading-tight text-stone-800 transition-colors group-hover:text-teal-700">
                                {fullName}
                              </h3>
                              <p className="mt-0.5 truncate text-sm font-medium text-stone-500">
                                {title}
                              </p>

                              {/* Specialization Badge (fixed-height row keeps alignment) */}
                              <div className="mt-3 flex min-h-[32px] items-start">
                                {doc.specializations?.length > 0 && (
                                  <span className="inline-flex max-w-full items-center rounded-full border border-teal-100 bg-teal-50 px-2.5 py-1 text-xs font-medium text-teal-700">
                                    <span className="truncate">{doc.specializations[0].name}</span>
                                  </span>
                                )}
                              </div>

                              {/* Action Button */}
                              <Link
                                href={doc.slug ? `/consultant/${doc.slug}` : '/consultant'}
                                className="mt-auto flex w-full items-center justify-center gap-2 rounded-xl border border-stone-200 bg-stone-50 px-4 py-2.5 text-sm font-semibold text-stone-700 transition-all duration-300 hover:border-teal-600 hover:bg-teal-700 hover:text-white"
                              >
                                <MessageCircle className="h-4 w-4" />
                                Book Session
                              </Link>
                            </div>
                          </div>
                        </motion.div>
                      </CarouselItem>
                    )
                  })}
                </CarouselContent>

                <div className="hidden md:block">
                  <CarouselPrevious className="-left-12 h-11 w-11 border-stone-200 bg-white text-stone-600 transition-colors hover:border-teal-200 hover:bg-teal-50 hover:text-teal-700 lg:-left-14" />
                  <CarouselNext className="-right-12 h-11 w-11 border-stone-200 bg-white text-stone-600 transition-colors hover:border-teal-200 hover:bg-teal-50 hover:text-teal-700 lg:-right-14" />
                </div>

                <CarouselDots count={therapists.length} className="mt-8" />
              </Carousel>
            )}
          </div>
        </Reveal>

        <Reveal y={20} delay={0.15}>
          <div className="mt-12 text-center">
            <Button asChild variant="ghost" className="group h-auto rounded-2xl px-8 py-4 text-base font-semibold text-teal-700 hover:bg-teal-50">
              <Link href="/consultant">
                <span>View all specialists</span>
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