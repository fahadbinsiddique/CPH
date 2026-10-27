'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
import { motion, AnimatePresence, useReducedMotion } from 'motion/react'
import { gsap, prefersReducedMotion } from '@/lib/motion'
import { Star, Quote, ChevronLeft, ChevronRight, User, MessageCircle, Video, Clock, ArrowRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import Reveal from '@/components/ui/Reveal'

const testimonials = [
  {
    id: 1,
    name: 'Ayesha Rahman',
    role: 'University Student',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop&auto=format',
    feedback: 'This platform helped me manage my anxiety during exams. The therapists are incredibly understanding and supportive. I finally feel like I have tools that actually work.',
    rating: 5,
    sessionType: 'Video Therapy',
    duration: '3 months',
    outcome: 'Reduced anxiety by 60%',
  },
  {
    id: 2,
    name: 'Michael Brown',
    role: 'Software Engineer',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&auto=format',
    feedback: 'I finally found a safe space to talk about my stress and burnout. The sessions are life-changing and very professional. My therapist really gets the tech industry pressure.',
    rating: 5,
    sessionType: 'Chat Therapy',
    duration: '6 months',
    outcome: 'Burnout recovery',
  },
  {
    id: 3,
    name: 'Sophia Lee',
    role: 'Marketing Manager',
    avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&auto=format',
    feedback: 'The mindfulness tools and daily check-ins have completely improved my emotional balance and productivity. I use the breathing exercises before every big presentation.',
    rating: 5,
    sessionType: 'Self-Guided + Therapy',
    duration: '4 months',
    outcome: 'Better focus & sleep',
  },
  {
    id: 4,
    name: 'David Khan',
    role: 'Entrepreneur',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&auto=format',
    feedback: 'Highly professional therapists and a very secure platform. It feels personal, safe, and genuinely helpful. The matching algorithm found me the perfect therapist on the first try.',
    rating: 5,
    sessionType: 'Video Therapy',
    duration: '8 months',
    outcome: 'Improved leadership',
  },
  {
    id: 5,
    name: 'Priya Patel',
    role: 'Healthcare Worker',
    avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=100&h=100&fit=crop&auto=format',
    feedback: 'After long shifts, having access to therapy on my schedule was a game-changer. The platform\'s flexibility and the quality of care exceeded my expectations.',
    rating: 5,
    sessionType: 'Video Therapy',
    duration: '5 months',
    outcome: 'Work-life balance',
  },
  {
    id: 6,
    name: 'James Wilson',
    role: 'Retired Veteran',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop&auto=format',
    feedback: 'I was skeptical about online therapy, but this changed my mind. The therapist was patient, knowledgeable, and helped me process things I\'d carried for decades.',
    rating: 5,
    sessionType: 'Video Therapy',
    duration: '10 months',
    outcome: 'PTSD symptom reduction',
  },
]

const TestimonialsCarousel = () => {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isHovered, setIsHovered] = useState(false)
  const [touchStart, setTouchStart] = useState(null)
  const reduceMotion = useReducedMotion()
  const autoplayRef = useRef(null)
  const containerRef = useRef(null)

  const goToNext = useCallback(() => {
    setCurrentIndex(prev => (prev + 1) % testimonials.length)
  }, [])

  const goToPrev = useCallback(() => {
    setCurrentIndex(prev => (prev - 1 + testimonials.length) % testimonials.length)
  }, [])

  const goToSlide = useCallback((index) => {
    setCurrentIndex(index)
  }, [])

  // Autoplay logic
  useEffect(() => {
    if (reduceMotion || prefersReducedMotion()) return

    autoplayRef.current = setInterval(() => {
      if (!isHovered) goToNext()
    }, 6000)

    return () => {
      if (autoplayRef.current) clearInterval(autoplayRef.current)
    }
  }, [isHovered, goToNext, reduceMotion])

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'ArrowLeft') goToPrev()
      else if (e.key === 'ArrowRight') goToNext()
    }

    if (containerRef.current) {
      containerRef.current.addEventListener('keydown', handleKeyDown)
    }
    return () => {
      if (containerRef.current) {
        containerRef.current.removeEventListener('keydown', handleKeyDown)
      }
    }
  }, [goToPrev, goToNext])

  // Touch swipe
  const handleTouchStart = (e) => {
    setTouchStart(e.touches[0].clientX)
  }

  const handleTouchEnd = (e) => {
    if (touchStart === null) return
    const touchEnd = e.changedTouches[0].clientX
    const diff = touchStart - touchEnd

    if (Math.abs(diff) > 50) {
      if (diff > 0) goToNext()
      else goToPrev()
    }
    setTouchStart(null)
  }

  const current = testimonials[currentIndex]

  return (
    <section
      ref={containerRef}
      className="section-pad section-pad-lg relative overflow-hidden bg-stone-50/30"
      aria-labelledby="testimonials-heading"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      <div className="pointer-events-none absolute inset-0" aria-hidden="true">
        <div className="absolute -top-24 -right-24 h-80 w-80 rounded-full bg-violet-50/50 blur-3xl" />
        <div className="absolute -bottom-24 -left-24 h-80 w-80 rounded-full bg-emerald-50/50 blur-3xl" />
      </div>

      <div className="section-shell relative z-10">
        <Reveal className="section-head" y={24}>
          <h2 id="testimonials-heading" className="section-title">
            Real stories from <span className="gradient-text-primary">real people</span>
          </h2>
          <p className="section-sub">
            Thousands have found support, healing, and balance through our platform. Here are a few of their journeys.
          </p>
        </Reveal>

        <div className="relative max-w-4xl mx-auto">
          {/* Carousel Viewport */}
          <div className="overflow-hidden" role="region" aria-label="Testimonials carousel">
            <AnimatePresence mode="wait">
              <motion.div
                key={current.id}
                initial={!reduceMotion ? { opacity: 0, x: 30, scale: 0.98 } : {}}
                animate={{ opacity: 1, x: 0, scale: 1 }}
                exit={!reduceMotion ? { opacity: 0, x: -30, scale: 0.98 } : {}}
                transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                className="relative"
              >
                <article className="card-interactive p-8 md:p-10 text-center">
                  {/* Quote Mark */}
                  <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-violet-50">
                    <Quote className="h-8 w-8 text-violet-300" aria-hidden="true" />
                  </div>

                  {/* Feedback */}
                  <blockquote className="text-lg md:text-xl leading-relaxed text-stone-700 mb-8 max-w-3xl mx-auto">
                    &ldquo;{current.feedback}&rdquo;
                  </blockquote>

                  {/* Rating */}
                  <div className="flex items-center justify-center gap-1 mb-6" role="img" aria-label={`${current.rating} out of 5 stars`}>
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star
                        key={i}
                        className={`h-5 w-5 ${i < current.rating ? 'fill-violet-400 text-violet-400' : 'text-stone-300'}`}
                        aria-hidden="true"
                      />
                    ))}
                  </div>

                  {/* Avatar & Info */}
                  <div className="flex flex-col items-center gap-4">
                    <div className="flex items-center gap-4">
                      <div className="relative h-14 w-14 rounded-full overflow-hidden ring-2 ring-violet-100">
                        <img
                          src={current.avatar}
                          alt=""
                          className="h-full w-full object-cover"
                          loading="lazy"
                        />
                      </div>
                      <div className="text-left">
                        <p className="font-bold text-stone-900">{current.name}</p>
                        <p className="text-sm text-stone-500">{current.role}</p>
                      </div>
                    </div>

                    {/* Session Details */}
                    <div className="flex flex-wrap items-center justify-center gap-4 md:gap-6 pt-4 border-t border-stone-100 w-full max-w-xs">
                      <div className="flex items-center gap-1.5 text-xs text-stone-600">
                        <Video className="h-3.5 w-3.5 text-violet-500" aria-hidden="true" />
                        <span>{current.sessionType}</span>
                      </div>
                      <div className="flex items-center gap-1.5 text-xs text-stone-600">
                        <Clock className="h-3.5 w-3.5 text-violet-500" aria-hidden="true" />
                        <span>{current.duration}</span>
                      </div>
                      <div className="flex items-center gap-1.5 text-xs text-emerald-700 font-medium">
                        <MessageCircle className="h-3.5 w-3.5" aria-hidden="true" />
                        <span>{current.outcome}</span>
                      </div>
                    </div>
                  </div>
                </article>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Navigation Arrows */}
          <div className="absolute top-1/2 left-0 right-0 -translate-y-1/2 flex justify-between px-2 md:px-12 pointer-events-none">
            <Button
              variant="outline"
              size="icon"
              onClick={goToPrev}
              className="pointer-events-auto opacity-0 group-hover:opacity-100 transition-opacity hover:bg-white hover:border-violet-200 hover:text-violet-700 shadow-lg"
              aria-label="Previous testimonial"
            >
              <ChevronLeft className="h-5 w-5" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              onClick={goToNext}
              className="pointer-events-auto opacity-0 group-hover:opacity-100 transition-opacity hover:bg-white hover:border-violet-200 hover:text-violet-700 shadow-lg"
              aria-label="Next testimonial"
            >
              <ChevronRight className="h-5 w-5" />
            </Button>
          </div>

          {/* Dots Indicator */}
          <div className="mt-8 flex items-center justify-center gap-2" role="tablist" aria-label="Testimonial navigation">
            {testimonials.map((_, index) => (
              <button
                key={index}
                onClick={() => goToSlide(index)}
                role="tab"
                aria-selected={index === currentIndex}
                aria-label={`Go to testimonial ${index + 1}`}
                className={`h-2 rounded-full transition-all duration-300 ${
                  index === currentIndex
                    ? 'w-8 bg-violet-600'
                    : 'w-2 bg-stone-300 hover:bg-violet-300'
                }`}
              />
            ))}
          </div>
        </div>

        {/* View All Link */}
        <Reveal y={20} delay={0.2} className="mt-12 text-center">
          <a href="/consultant" className="btn-outline-lg">
            Read More Stories
            <ArrowRight className="h-5 w-5" />
          </a>
        </Reveal>
      </div>
    </section>
  )
}

export default TestimonialsCarousel