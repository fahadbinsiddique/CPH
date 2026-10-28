'use client'

import Image from 'next/image'
import { gsap, prefersReducedMotion } from '@/lib/motion'
import { useRef, useEffect } from 'react'
import { Heart, Brain, MessageCircle, CalendarCheck, ShieldCheck, Sparkles, Moon, Leaf } from 'lucide-react'
import Reveal from '@/components/ui/Reveal'

const features = [
  {
    id: 'emotional-support',
    icon: Heart,
    title: 'Emotional Support Tools',
    description: 'Guided exercises, mood tracking, and coping strategies personalized to your emotional state.',
    image: 'https://images.unsplash.com/photo-1499247349278-5c2b0d2b2c2b?w=600&h=400&fit=crop&auto=format',
    category: 'Daily Wellness',
    color: 'from-rose-500 to-pink-500',
    stats: { label: 'Daily active users', value: '8,200+' },
  },
  {
    id: 'mindfulness',
    icon: Brain,
    title: 'Mindfulness Training',
    description: 'Science-backed meditation and breathing exercises to reduce stress and improve focus.',
    image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=400&fit=crop&auto=format',
    category: 'Practice',
    color: 'from-violet-500 to-purple-500',
    stats: { label: 'Sessions completed', value: '120K+' },
  },
  {
    id: 'therapy',
    icon: MessageCircle,
    title: '1-on-1 Therapy Sessions',
    description: 'Secure video and chat sessions with licensed therapists matched to your needs.',
    image: 'https://images.unsplash.com/photo-1573497620053-ea5300f94f21?w=400&h=400&fit=crop&auto=format',
    category: 'Professional Care',
    color: 'from-emerald-500 to-teal-500',
    stats: { label: 'Therapists available', value: '450+' },
  },
  {
    id: 'check-ins',
    icon: CalendarCheck,
    title: 'Daily Check-ins',
    description: 'Simple, 30-second reflections to track mood patterns and celebrate progress.',
    image: 'https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?w=400&h=400&fit=crop&auto=format',
    category: 'Self-Awareness',
    color: 'from-amber-500 to-orange-500',
    stats: { label: 'Check-ins this month', value: '45K+' },
  },
  {
    id: 'privacy',
    icon: ShieldCheck,
    title: 'Privacy & Security First',
    description: 'End-to-end encryption, HIPAA compliance, and full data ownership — always.',
    image: 'https://images.unsplash.com/photo-1563986768609-322da13575f3?w=400&h=400&fit=crop&auto=format',
    category: 'Trust',
    color: 'from-blue-500 to-cyan-500',
    stats: { label: 'Security certifications', value: 'SOC 2 Type II' },
  },
  {
    id: 'growth',
    icon: Sparkles,
    title: 'Personalized Growth Plans',
    description: 'AI-assisted insights create custom wellness roadmaps that evolve with you.',
    image: 'https://images.unsplash.com/photo-1517486808906-6ca8b3f04846?w=400&h=400&fit=crop&auto=format',
    category: 'Growth',
    color: 'from-indigo-500 to-purple-500',
    stats: { label: 'Improvement rate', value: '94% in 8 weeks' },
  },
  {
    id: 'sleep',
    icon: Moon,
    title: 'Sleep & Recovery',
    description: 'Sleep tracking, wind-down routines, and soundscapes for better rest and recovery.',
    image: 'https://images.unsplash.com/photo-1541781774459-bb2af2f05b55?w=400&h=400&fit=crop&auto=format',
    category: 'Rest',
    color: 'from-slate-500 to-blue-500',
    stats: { label: 'Better sleep reported', value: '87% of users' },
  },
  {
    id: 'community',
    icon: Leaf,
    title: 'Supportive Community',
    description: 'Anonymous peer support groups and moderated forums for shared healing journeys.',
    image: 'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=400&h=400&fit=crop&auto=format',
    category: 'Connection',
    color: 'from-emerald-500 to-teal-500',
    stats: { label: 'Active members', value: '15,000+' },
  },
]

const FeaturesBento = () => {
  const sectionRef = useRef(null)

  useEffect(() => {
    if (prefersReducedMotion()) return

    const ctx = gsap.context(() => {
      gsap.fromTo(
        '[data-feature-card]',
        { opacity: 0, y: 30, scale: 0.97 },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 0.6,
          stagger: 0.06,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 80%',
            once: true,
          },
        }
      )
    }, sectionRef)

    return () => ctx.revert()
  }, [])

  return (
    <section
      ref={sectionRef}
      className="section-pad section-pad-lg relative overflow-hidden bg-stone-50/30"
      aria-labelledby="features-heading"
    >
      <div className="pointer-events-none absolute inset-0" aria-hidden="true">
        <div className="absolute -left-24 top-1/3 h-80 w-80 rounded-full bg-violet-50/50 blur-3xl" />
        <div className="absolute -right-20 -bottom-24 h-80 w-80 rounded-full bg-emerald-50/50 blur-3xl" />
      </div>

      <div className="section-shell relative z-10">
        <Reveal className="section-head" y={24}>
          <h2 id="features-heading" className="section-title">
            Everything you need for a <span className="gradient-text-primary">healthier mind</span>
          </h2>
          <p className="section-sub">
            A complete mental wellness toolkit — from daily practices to professional care, all in one place.
          </p>
        </Reveal>

        {/* Alternating layout - breaks the card grid pattern */}
        <Reveal stagger={0.08} y={20} className="space-y-12 md:space-y-16 lg:space-y-20">
          {features.map((feature, index) => {
            const Icon = feature.icon
            const isEven = index % 2 === 0

            return (
              <article
                key={feature.id}
                data-feature-card
                className={`relative group flex flex-col md:flex-row gap-8 md:gap-12 items-center ${isEven ? 'md:flex-row' : 'md:flex-row-reverse'}`}
              >
                {/* Content Side */}
                <div className="flex-1 w-full md:w-1/2 text-center md:text-left">
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-white/10 backdrop-blur-sm px-3 py-1 text-xs font-medium text-white mb-4">
                    <Icon className="h-3.5 w-3.5" />
                    {feature.category}
                  </span>
                  <h3 className="text-2xl md:text-3xl lg:text-4xl font-bold tracking-tight text-stone-900 mb-4">
                    {feature.title}
                  </h3>
                  <p className="text-base md:text-lg leading-relaxed text-stone-600 mb-6 max-w-lg">
                    {feature.description}
                  </p>

                  {/* Stat */}
                  <div className="flex items-center gap-4 pt-4 border-t border-stone-200/50">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/10 backdrop-blur-sm">
                      <Icon className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="text-xs opacity-70">{feature.stats.label}</p>
                      <p className="font-semibold">{feature.stats.value}</p>
                    </div>
                  </div>
                </div>

                {/* Image Side */}
                <div className="flex-1 w-full md:w-1/2 relative">
                  <div className="card-feature aspect-[4/3] md:aspect-auto md:h-full min-h-[280px] overflow-hidden">
                    <Image
                      src={feature.image}
                      alt=""
                      fill
                      sizes="(max-width: 768px) 100vw, 50vw"
                      className="object-cover transition-transform duration-700 group-hover:scale-105"
                      loading={index < 2 ? 'eager' : 'lazy'}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
                    <div className="absolute inset-0 bg-gradient-to-br from-transparent via-transparent to-[var(--tw-gradient-to)] opacity-0 group-hover:opacity-100 transition-opacity duration-500" style={{ '--tw-gradient-to': feature.color }} />
                  </div>
                </div>
              </article>
            )
          })}
        </Reveal>

        {/* Explore More Link */}
        <Reveal y={20} delay={0.2} className="mt-12 text-center">
          <a href="/services" className="btn-outline-lg">
            Explore All Features
            <Sparkles className="h-5 w-5" />
          </a>
        </Reveal>
      </div>
    </section>
  )
}

export default FeaturesBento