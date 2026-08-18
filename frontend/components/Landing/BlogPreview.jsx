'use client'

import Link from 'next/link'
import { ArrowRight, BookOpen } from 'lucide-react'
import Reveal from '@/components/ui/Reveal'

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
    <section className="section-pad relative overflow-hidden bg-stone-50/70">
      <div className="pointer-events-none absolute inset-0" aria-hidden="true">
        <div className="absolute -left-24 -top-20 h-80 w-80 rounded-full bg-teal-50 blur-3xl" />
        <div className="absolute -bottom-24 -right-24 h-80 w-80 rounded-full bg-emerald-50 blur-3xl" />
        <div className="absolute right-[30%] top-[18%] hidden h-64 w-64 rounded-full bg-accent-lavender/60 blur-3xl md:block" />
      </div>

      <div className="section-shell relative z-10">
        <Reveal className="section-head" y={24}>
          <span className="eyebrow">From the blog</span>
          <h2 className="section-title">Insights for a healthier mind</h2>
          <p className="section-sub">
            Explore expert articles, guides, and mental wellness tips to support your emotional
            well-being.
          </p>
        </Reveal>

        <Reveal stagger={0.08} y={26} className="grid gap-5 md:grid-cols-3">
          {blogs.map((post) => (
              <article
                key={post.title}
                className="group flex flex-col rounded-2xl border border-stone-200/70 bg-white p-6 shadow-soft transition-all duration-300 hover:-translate-y-1 hover:border-teal-200 hover:shadow-card"
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-teal-50 transition-colors duration-300 group-hover:bg-teal-100">
                  <BookOpen className="h-5 w-5 text-teal-600" />
                </div>

                <div className="mt-4 flex items-center justify-between text-xs text-stone-500">
                  <span className="rounded-full border border-stone-200 bg-stone-50 px-2.5 py-1 font-medium text-stone-600">
                    {post.tag}
                  </span>
                  <time className="text-stone-400">{post.date}</time>
                </div>

                <h3 className="mt-4 text-lg font-semibold leading-snug text-stone-900 transition-colors group-hover:text-teal-700">
                  {post.title}
                </h3>
                <p className="mt-2 flex-1 text-sm leading-relaxed text-stone-600">{post.desc}</p>

                <Link
                  href="/blog"
                  className="mt-5 inline-flex items-center gap-2 text-sm font-medium text-teal-700 transition-colors hover:text-teal-800"
                >
                  Read More
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Link>
              </article>
            ))}
        </Reveal>

        <Reveal y={20} delay={0.15}>
          <div className="mt-12 text-center">
            <Link href="/blog" className="btn-outline">
              View All Articles
            </Link>
          </div>
        </Reveal>
      </div>
    </section>
  )
}

export default BlogPreview