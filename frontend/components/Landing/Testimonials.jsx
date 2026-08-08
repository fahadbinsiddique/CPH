'use client'

import { Star, Quote } from 'lucide-react'
import Reveal from '@/components/ui/Reveal'

const testimonials = [
  {
    name: 'Ayesha Rahman',
    role: 'Student',
    feedback:
      'This platform helped me manage my anxiety during exams. The therapists are incredibly understanding and supportive.',
    rating: 5,
  },
  {
    name: 'Michael Brown',
    role: 'Software Engineer',
    feedback:
      'I finally found a safe space to talk about my stress. The sessions are life-changing and very professional.',
    rating: 5,
  },
  {
    name: 'Sophia Lee',
    role: 'Marketing Manager',
    feedback:
      'The mindfulness tools and daily check-ins have completely improved my emotional balance and productivity.',
    rating: 4,
  },
  {
    name: 'David Khan',
    role: 'Entrepreneur',
    feedback:
      'Highly professional therapists and a very secure platform. It feels personal, safe, and genuinely helpful.',
    rating: 5,
  },
]

const Testimonials = () => {
  return (
    <section className="section-pad relative overflow-hidden bg-white">
      <div className="pointer-events-none absolute inset-0" aria-hidden="true">
        <div className="absolute -top-24 -right-24 h-80 w-80 rounded-full bg-teal-50 blur-3xl" />
        <div className="absolute -bottom-24 -left-24 h-80 w-80 rounded-full bg-emerald-50 blur-3xl" />
      </div>

      <div className="section-shell relative z-10">
        <Reveal className="section-head" y={24}>
          <span className="eyebrow">Testimonials</span>
          <h2 className="section-title">What our users are saying</h2>
          <p className="section-sub">
            Real stories from people who found support, healing, and balance through our platform.
          </p>
        </Reveal>

        <Reveal stagger={0.08} y={26} className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {testimonials.map((item) => (
              <figure
                key={item.name}
                className="flex flex-col rounded-2xl border border-slate-200/70 bg-slate-50/80 p-6 shadow-soft transition-all duration-300 hover:-translate-y-1 hover:border-teal-200 hover:shadow-card"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star
                        key={i}
                        className={`h-4 w-4 ${
                          i < item.rating ? 'fill-amber-400 text-amber-400' : 'text-slate-300'
                        }`}
                      />
                    ))}
                  </div>
                  <Quote className="h-5 w-5 text-teal-200" />
                </div>

                <blockquote className="mt-4 flex-1 text-sm leading-relaxed text-slate-700">
                  “{item.feedback}”
                </blockquote>

                <figcaption className="mt-5 border-t border-slate-100 pt-4">
                  <p className="font-semibold text-slate-900">{item.name}</p>
                  <p className="text-xs text-slate-500">{item.role}</p>
                </figcaption>
              </figure>
            ))}
        </Reveal>
      </div>
    </section>
  )
}

export default Testimonials
