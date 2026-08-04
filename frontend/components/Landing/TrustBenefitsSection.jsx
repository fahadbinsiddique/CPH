'use client'

import { motion } from 'framer-motion'
import { ShieldCheck, BadgeCheck, BookOpen, HeartHandshake } from 'lucide-react'

const benefits = [
  {
    icon: ShieldCheck,
    title: '100% Confidential',
    desc: 'Your conversations and personal data are fully encrypted and private.',
  },
  {
    icon: BadgeCheck,
    title: 'Licensed Therapists',
    desc: 'All professionals are verified, certified, and experienced in mental health care.',
  },
  {
    icon: BookOpen,
    title: 'Evidence-Based Care',
    desc: 'We use clinically proven methods like CBT, mindfulness, and therapy frameworks.',
  },
  {
    icon: HeartHandshake,
    title: 'Support That Cares',
    desc: 'Compassionate, human-centered care designed to support your emotional journey.',
  },
]

const TrustBenefitsSection = () => {
  return (
    <section className="relative py-24 bg-slate-50 overflow-hidden">
      {/* Soft background glow */}
      <div className="absolute top-[-120px] left-[-100px] w-[300px] h-[300px] bg-emerald-100 blur-3xl rounded-full" />
      <div className="absolute bottom-[-120px] right-[-100px] w-[300px] h-[300px] bg-blue-100 blur-3xl rounded-full" />

      <div className="max-w-6xl mx-auto px-6 relative z-10">
        {/* Heading */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center max-w-2xl mx-auto mb-14"
        >
          <h2 className="text-3xl md:text-4xl font-semibold text-slate-900">
            Care you can trust, support you can rely on
          </h2>
          <p className="mt-4 text-slate-600">
            We prioritize safety, professionalism, and emotional well-being in every step of your
            journey.
          </p>
        </motion.div>

        {/* Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {benefits.map((item, index) => {
            const Icon = item.icon

            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 25 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: index * 0.05 }}
                className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm hover:shadow-md transition group"
              >
                {/* Icon */}
                <div className="w-12 h-12 rounded-xl bg-emerald-50 flex items-center justify-center group-hover:bg-emerald-100 transition">
                  <Icon className="w-5 h-5 text-emerald-600" />
                </div>

                {/* Content */}
                <h3 className="mt-4 text-lg font-semibold text-slate-900">{item.title}</h3>
                <p className="mt-2 text-sm text-slate-600 leading-relaxed">{item.desc}</p>
              </motion.div>
            )
          })}
        </div>
      </div>
    </section>
  )
}

export default TrustBenefitsSection
