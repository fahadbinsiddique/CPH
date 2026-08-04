'use client'

import { motion } from 'framer-motion'
import { ArrowRight, BookOpen } from 'lucide-react'

const blogs = [
  {
    title: 'How to Manage Anxiety in Daily Life',
    desc: 'Simple, science-backed techniques to reduce anxiety and stay grounded.',
    tag: 'Mental Health',
    date: 'Jan 2026',
  },
  {
    title: 'The Power of Mindfulness for Stress Relief',
    desc: 'Learn how mindfulness can improve focus, calmness, and emotional balance.',
    tag: 'Mindfulness',
    date: 'Dec 2025',
  },
  {
    title: 'When Should You Talk to a Therapist?',
    desc: 'Signs that indicate it’s time to seek professional mental health support.',
    tag: 'Therapy Guide',
    date: 'Nov 2025',
  },
]

const BlogPreview = () => {
  return (
    <section className="relative py-24 bg-white overflow-hidden">
      {/* Soft background glow */}
      <div className="absolute top-[-120px] left-[-120px] w-[300px] h-[300px] bg-emerald-100 blur-3xl rounded-full" />
      <div className="absolute bottom-[-120px] right-[-120px] w-[300px] h-[300px] bg-blue-100 blur-3xl rounded-full" />

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
            Insights for a healthier mind
          </h2>
          <p className="mt-4 text-slate-600">
            Explore expert articles, guides, and mental wellness tips to support your emotional
            well-being.
          </p>
        </motion.div>

        {/* Blog grid */}
        <div className="grid md:grid-cols-3 gap-6">
          {blogs.map((post, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 25 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: index * 0.05 }}
              className="group bg-slate-50 border border-slate-200 rounded-2xl p-6 shadow-sm hover:shadow-md transition"
            >
              {/* Icon */}
              <div className="w-10 h-10 rounded-xl bg-emerald-50 flex items-center justify-center mb-4">
                <BookOpen className="w-5 h-5 text-emerald-600" />
              </div>

              {/* Tag + Date */}
              <div className="flex items-center justify-between text-xs text-slate-500">
                <span className="px-2 py-1 bg-white border border-slate-200 rounded-full">
                  {post.tag}
                </span>
                <span>{post.date}</span>
              </div>

              {/* Title */}
              <h3 className="mt-4 text-lg font-semibold text-slate-900 group-hover:text-emerald-700 transition">
                {post.title}
              </h3>

              {/* Description */}
              <p className="mt-2 text-sm text-slate-600 leading-relaxed">{post.desc}</p>

              {/* CTA */}
              <button className="mt-5 inline-flex items-center gap-2 text-sm font-medium text-emerald-600 hover:text-emerald-700 transition">
                Read More
                <ArrowRight className="w-4 h-4" />
              </button>
            </motion.div>
          ))}
        </div>

        {/* View all button */}
        <div className="text-center mt-12">
          <button className="px-6 py-3 rounded-xl border border-slate-200 text-slate-700 hover:bg-slate-50 transition">
            View All Articles
          </button>
        </div>
      </div>
    </section>
  )
}

export default BlogPreview
