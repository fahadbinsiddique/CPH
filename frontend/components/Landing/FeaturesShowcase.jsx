'use client'

import { motion } from 'framer-motion'
import { Heart, Brain, ShieldCheck, Sparkles, MessageCircle, CalendarCheck } from 'lucide-react'

const features = [
  {
    icon: Heart,
    title: 'Emotional Support',
    desc: 'Get guided tools to understand and manage your emotions better every day.',
  },
  {
    icon: Brain,
    title: 'Mindfulness Training',
    desc: 'Improve focus and reduce stress with science-backed mindfulness practices.',
  },
  {
    icon: MessageCircle,
    title: '1-on-1 Therapy',
    desc: 'Connect with licensed therapists anytime through secure sessions.',
  },
  {
    icon: CalendarCheck,
    title: 'Daily Check-ins',
    desc: 'Track your mood and mental health progress with simple daily reflections.',
  },
  {
    icon: ShieldCheck,
    title: 'Privacy First',
    desc: 'Your data is fully encrypted and always protected with top security standards.',
  },
  {
    icon: Sparkles,
    title: 'Personalized Growth',
    desc: 'AI-assisted insights help you grow emotionally at your own pace.',
  },
]

const FeaturesShowcase = () => {
  return (
    <section className="relative py-24 bg-white overflow-hidden">
      {/* Soft background glow */}
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
            Everything you need for a healthier mind
          </h2>
          <p className="mt-4 text-slate-600">
            A complete mental wellness toolkit designed to support your emotional balance, growth,
            and peace of mind.
          </p>
        </motion.div>

        {/* Feature grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((item, index) => {
            const Icon = item.icon

            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: index * 0.05 }}
                className="p-6 rounded-2xl bg-white border border-slate-200 shadow-sm hover:shadow-md transition group"
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

export default FeaturesShowcase
