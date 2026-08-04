'use client'

import { motion } from 'framer-motion'
import { ArrowRight, Users, Search } from 'lucide-react'

const ViewAllTherapistsCTA = () => {
  return (
    <section className="relative py-16 bg-white overflow-hidden">
      {/* Soft background glow */}
      <div className="absolute top-[-80px] left-[-80px] w-[250px] h-[250px] bg-emerald-100 blur-3xl rounded-full" />
      <div className="absolute bottom-[-80px] right-[-80px] w-[250px] h-[250px] bg-blue-100 blur-3xl rounded-full" />

      <div className="max-w-5xl mx-auto px-6 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="rounded-3xl border border-slate-200 bg-white/70 backdrop-blur-xl shadow-sm p-10 text-center"
        >
          {/* Icon */}
          <div className="w-14 h-14 mx-auto rounded-2xl bg-emerald-50 flex items-center justify-center mb-5">
            <Users className="w-6 h-6 text-emerald-600" />
          </div>

          {/* Heading */}
          <h2 className="text-2xl md:text-3xl font-semibold text-slate-900">
            Find the right therapist for your journey
          </h2>

          {/* Subtext */}
          <p className="mt-4 text-slate-600 max-w-xl mx-auto">
            Explore our full network of licensed mental health professionals and choose someone who
            truly understands your needs and goals.
          </p>

          {/* Buttons */}
          <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
            <button className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-emerald-600 text-white font-medium hover:bg-emerald-700 transition">
              <Search className="w-4 h-4" />
              View All Therapists
              <ArrowRight className="w-4 h-4" />
            </button>

            <button className="px-6 py-3 rounded-xl border border-slate-200 text-slate-700 hover:bg-slate-50 transition">
              Take Matching Quiz
            </button>
          </div>

          {/* Trust note */}
          <p className="mt-6 text-xs text-slate-500">
            ✓ Verified professionals • ✓ Confidential sessions • ✓ Personalized matching
          </p>
        </motion.div>
      </div>
    </section>
  )
}

export default ViewAllTherapistsCTA
