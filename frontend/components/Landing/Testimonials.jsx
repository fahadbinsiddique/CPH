'use client'

import { motion } from 'framer-motion'
import { Star } from 'lucide-react'

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
    <section className="relative py-24 bg-white overflow-hidden">
      {/* Soft glow background */}
      <div className="absolute top-[-120px] left-[-100px] w-[300px] h-[300px] bg-emerald-100 blur-3xl rounded-full" />
      <div className="absolute bottom-[-120px] right-[-100px] w-[300px] h-[300px] bg-blue-100 blur-3xl rounded-full" />

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        {/* Heading */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center max-w-2xl mx-auto mb-14"
        >
          <h2 className="text-3xl md:text-4xl font-semibold text-slate-900">
            What our users are saying
          </h2>
          <p className="mt-4 text-slate-600">
            Real stories from people who found support, healing, and balance through our platform.
          </p>
        </motion.div>

        {/* Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {testimonials.map((item, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 25 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: index * 0.05 }}
              className="bg-slate-50 border border-slate-200 rounded-2xl p-6 shadow-sm hover:shadow-md transition"
            >
              {/* Rating */}
              <div className="flex items-center gap-1 text-amber-500">
                {Array.from({ length: item.rating }).map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-amber-400" />
                ))}
              </div>

              {/* Feedback */}
              <p className="mt-4 text-sm text-slate-700 leading-relaxed">“{item.feedback}”</p>

              {/* User info */}
              <div className="mt-5">
                <p className="font-semibold text-slate-900">{item.name}</p>
                <p className="text-xs text-slate-500">{item.role}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default Testimonials
