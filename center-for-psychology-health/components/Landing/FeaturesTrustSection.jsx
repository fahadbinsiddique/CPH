'use client'

import Image from 'next/image'
import { motion } from 'framer-motion'
import { Heart, Brain, ShieldCheck, BadgeCheck, Sparkles, ArrowRight, Clock } from 'lucide-react'

// shadcn/ui style badge (optional)
const Badge = ({ children, variant = 'default', className }) => (
  <span
    className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-medium ${variant === 'outline' ? 'border border-emerald-200 text-emerald-700 bg-white/60' : 'bg-emerald-100 text-emerald-800'} ${className}`}
  >
    {children}
  </span>
)

const FeaturesTrustSection = () => {
  const coreFeatures = [
    {
      icon: Heart,
      title: 'Emotional Support',
      desc: 'Daily tools & reflections to understand your feelings.',
    },
    {
      icon: Brain,
      title: 'Mindfulness Training',
      desc: 'Science‑backed practices to reduce stress.',
    },
    {
      icon: Sparkles,
      title: 'AI‑Powered Insights',
      desc: 'Personalized growth paths based on your progress.',
    },
  ]

  const trustHighlights = [
    { icon: ShieldCheck, label: '100% Private & Encrypted' },
    { icon: BadgeCheck, label: 'Licensed Therapists' },
    { icon: Clock, label: '24/7 Availability' },
  ]

  return (
    <section className="relative py-24 overflow-hidden bg-gradient-to-br from-slate-50 to-white">
      {/* Abstract shape */}
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-emerald-100/30 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3" />
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-blue-100/30 rounded-full blur-3xl translate-y-1/2 -translate-x-1/4" />

      <div className="relative max-w-7xl mx-auto px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center max-w-2xl mx-auto mb-12"
        >
          <Badge variant="outline" className="mb-4">
            ✨ Built for your mind
          </Badge>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight text-slate-900">
            A smarter way to{' '}
            <span className="bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
              mental wellness
            </span>
          </h2>
          <p className="mt-4 text-lg text-slate-600">
            Everything you need, from daily check‑ins to professional therapy, in one serene space.
          </p>
        </motion.div>

        {/* Main split layout: Image + Feature list */}
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left: Image */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="relative"
          >
            <div className="relative rounded-3xl overflow-hidden shadow-2xl">
              <Image
                src="https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=800&h=600&fit=crop"
                alt="Person meditating in nature"
                width={700}
                height={600}
                className="w-full h-auto object-cover"
                priority
              />
              <div className="absolute inset-0 bg-gradient-to-tr from-black/20 via-transparent to-transparent" />
            </div>
            {/* Floating stat card */}
            <div className="absolute -bottom-5 -left-5 bg-white/90 backdrop-blur-md rounded-2xl px-4 py-2 shadow-lg border border-white/40 flex items-center gap-3">
              <div className="bg-emerald-100 rounded-full p-2">
                <Heart className="w-4 h-4 text-emerald-600" />
              </div>
              <div>
                <p className="text-xs font-semibold text-slate-700">98% of users</p>
                <p className="text-xs text-slate-500">feel better within 4 weeks</p>
              </div>
            </div>
          </motion.div>

          {/* Right: Feature list (condensed) */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="space-y-8"
          >
            <div>
              <h3 className="text-2xl font-semibold text-slate-800 mb-2">Core features</h3>
              <p className="text-slate-500">Designed to fit your daily life, not complicate it.</p>
            </div>

            <div className="space-y-5">
              {coreFeatures.map((feat, idx) => {
                const Icon = feat.icon
                return (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, y: 10 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: idx * 0.1 }}
                    className="flex gap-4 items-start group    "
                  >
                    <div className="p-2 rounded-xl bg-emerald-50  text-emerald-700 group-hover:scale-110 transition-transform">
                      <Icon className="w-5 h-5" />
                    </div>
                    <div className="hover:bg-emerald-50 ">
                      <h4 className="font-semibold text-slate-800">{feat.title}</h4>
                      <p className="text-sm text-slate-500">{feat.desc}</p>
                    </div>
                  </motion.div>
                )
              })}
            </div>

            {/* Trust row (mini badges) */}
            <div className="pt-4 border-t border-slate-100">
              <p className="text-sm font-medium text-slate-600 mb-3">
                Trusted by over 10,000+ people
              </p>
              <div className="flex flex-wrap gap-4">
                {trustHighlights.map((item, idx) => {
                  const Icon = item.icon
                  return (
                    <div key={idx} className="flex items-center gap-1.5 text-xs text-slate-500">
                      <Icon className="w-3.5 h-3.5 text-emerald-500" />
                      <span>{item.label}</span>
                    </div>
                  )
                })}
              </div>
            </div>

            {/* CTA button */}
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="mt-4 inline-flex items-center gap-2 px-6 py-3 rounded-full bg-gradient-to-r from-emerald-600 to-teal-600 text-white font-medium shadow-md hover:shadow-lg transition-all"
            >
              Start your free assessment
              <ArrowRight className="w-4 h-4" />
            </motion.button>
          </motion.div>
        </div>
      </div>
    </section>
  )
}

export default FeaturesTrustSection
