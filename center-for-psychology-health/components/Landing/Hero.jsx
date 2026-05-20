'use client'

import { useRef } from 'react'
import Image from 'next/image'
import { motion } from 'framer-motion'
import {
  ArrowRight,
  Sparkles,
  Clock,
  Heart,
  Quote,
  User,
  HeartHandshake,
  Sparkles as YouthSparkles,
} from 'lucide-react'

const Hero = () => {
  const sectionRef = useRef(null)

  // Personal care options data
  const careOptions = [
    {
      title: 'Personal Care',
      desc: 'Tailored support for my own journey',
      tag: 'Individual',
      icon: User,
      color: 'emerald',
    },
    {
      title: 'Relational Wellness',
      desc: 'Strengthening the bond with my partner',
      tag: 'Couples',
      icon: HeartHandshake,
      color: 'rose',
    },
    {
      title: 'Youth Support',
      desc: 'Guidance for my child or teen',
      tag: 'Teen / Child',
      icon: YouthSparkles,
      color: 'amber',
    },
  ]

  return (
    <section
      ref={sectionRef}
      className="relative min-h-screen overflow-hidden bg-gradient-to-br from-slate-50 via-white to-indigo-50/60 pt-36 pb-20 font-sans"
    >
      {/* Animated background blobs */}
      <div className="absolute inset-0 pointer-events-none">
        <motion.div
          animate={{ scale: [1, 1.2, 1], x: [0, 40, -30, 0], y: [0, -40, 30, 0] }}
          transition={{ duration: 20, repeat: Infinity, repeatType: 'mirror' }}
          className="absolute top-[-150px] left-[-150px] w-[500px] h-[500px] bg-emerald-200/40 rounded-full blur-3xl"
        />
        <motion.div
          animate={{ scale: [1, 1.3, 1], x: [0, -50, 40, 0], y: [0, 50, -40, 0] }}
          transition={{ duration: 25, repeat: Infinity, repeatType: 'mirror' }}
          className="absolute bottom-[-200px] right-[-200px] w-[600px] h-[600px] bg-blue-200/30 rounded-full blur-3xl"
        />
        <motion.div
          animate={{ scale: [1, 1.1, 1], x: [0, 20, -20, 0], y: [0, -20, 20, 0] }}
          transition={{ duration: 18, repeat: Infinity, repeatType: 'mirror' }}
          className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[350px] h-[350px] bg-amber-100/30 rounded-full blur-3xl"
        />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-8">
        {/* Main layout: on mobile image first (flex-col-reverse), on desktop grid with text left, image right */}
        <div className="flex flex-col-reverse lg:grid lg:grid-cols-2 gap-12 items-center">
          {/* LEFT COLUMN: TEXT & CTA (appears second on mobile) */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            className="text-center lg:text-left"
          >
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/70 backdrop-blur-md shadow-sm border border-slate-200 text-sm text-slate-600 mb-6"
            >
              <Sparkles className="w-4 h-4  text-emerald-500 animate-pulse" />
              <span className="font-sans">Your safe space for mental wellness</span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold tracking-tight"
            >
              <span className="bg-gradient-to-r  from-slate-900 to-slate-700 bg-clip-text text-transparent">
                Find calm, clarity,
              </span>
              <br />
              <span className="bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
                and emotional balance
              </span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="mt-6 text-lg text-slate-600 max-w-xl mx-auto lg:mx-0 leading-relaxed"
            >
              A modern mental wellness platform designed to support your mind with guided therapy,
              mindfulness tools, and professional care—anytime you need it.
            </motion.p>

            {/* CTA Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="mt-8 flex flex-col sm:flex-row gap-4 justify-center lg:justify-start"
            >
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="group relative px-8 py-3.5 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 text-white font-medium shadow-lg hover:shadow-xl transition-all flex items-center justify-center gap-2 overflow-hidden"
              >
                <span className="relative z-10">Book Appointment</span>
                <ArrowRight className="w-4 h-4 relative z-10 transition-transform group-hover:translate-x-1" />
                <div className="absolute inset-0 bg-gradient-to-r from-emerald-700 to-teal-700 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.02, backgroundColor: '#f8fafc' }}
                whileTap={{ scale: 0.98 }}
                className="px-8 py-3.5 rounded-2xl bg-white/80 backdrop-blur-sm border border-slate-200 text-slate-700 hover:border-emerald-200 transition-all flex items-center justify-center gap-2 shadow-sm"
              >
                Explore Consultants
              </motion.button>
            </motion.div>

            {/* Personal Care Options Grid - Enhanced Edition */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7, duration: 0.6 }}
              className="mt-6 pt-4"
            >
              <div className="flex items-center justify-center lg:justify-start gap-2 mb-6">
                <span className="text-lg animate-pulse">✨</span>
                <p className="text-sm font-semibold tracking-wide text-slate-500 uppercase">
                  Choose your care path
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 md:gap-5">
                {careOptions.map((option, idx) => {
                  const Icon = option.icon
                  const colorMap = {
                    emerald: {
                      bg: 'from-emerald-50 to-emerald-100/50',
                      border: 'group-hover:border-emerald-300 group-hover:shadow-emerald-100/30',
                      ring: 'focus-visible:ring-emerald-500',
                      iconBg: 'bg-emerald-100 text-emerald-700',
                      tagBg: 'bg-emerald-50 text-emerald-700',
                      lineBg: 'group-hover:bg-teal-500', // <- থিম অনুযায়ী লাইন কালার
                    },
                    rose: {
                      bg: 'from-rose-50 to-rose-100/50',
                      border: 'group-hover:border-rose-300 group-hover:shadow-rose-100/30',
                      ring: 'focus-visible:ring-rose-500',
                      iconBg: 'bg-rose-100 text-rose-700',
                      tagBg: 'bg-rose-50 text-rose-700',
                      lineBg: 'group-hover:bg-rose-500', // <- থিম অনুযায়ী লাইন কালার
                    },
                    amber: {
                      bg: 'from-amber-50 to-amber-100/50',
                      border: 'group-hover:border-amber-300 group-hover:shadow-amber-100/30',
                      ring: 'focus-visible:ring-amber-500',
                      iconBg: 'bg-amber-100 text-amber-700',
                      tagBg: 'bg-amber-50 text-amber-700',
                      lineBg: 'group-hover:bg-amber-500', // <- থিম অনুযায়ী লাইন কালার
                    },
                  }
                  const styles = colorMap[option.color] || colorMap.emerald

                  return (
                    <motion.div
                      key={idx}
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 0.1 * idx, duration: 0.4 }}
                      whileHover={{ y: -5, transition: { type: 'spring', stiffness: 400 } }}
                      whileTap={{ scale: 0.98 }}
                      role="button"
                      tabIndex={0}
                      onKeyDown={(e) =>
                        e.key === 'Enter' && console.log(`Selected: ${option.title}`)
                      }
                      className={`group relative bg-gradient-to-br ${styles.bg} rounded-2xl p-4 border border-slate-200/60 shadow-xs transition-all duration-300 cursor-pointer outline-none focus-visible:ring-2 focus-visible:ring-offset-2 ${styles.ring} ${styles.border}`}
                    >
                      {/* Main Flex Container */}
                      <div className="flex flex-col md:h-full justify-between gap-4">
                        {/* Top Row: Icon + Tag */}
                        <div className="flex items-center justify-between gap-4">
                          <motion.div
                            whileHover={{ rotate: 5, scale: 1.05 }}
                            className={`p-2.5 rounded-xl transition-all duration-300 ${styles.iconBg} shadow-xs`}
                          >
                            <Icon className="w-5 h-5" />
                          </motion.div>

                          {/* Dynamic Tag */}
                          <span
                            className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full border shadow-2xs backdrop-blur-xs whitespace-nowrap ${styles.tagBg}`}
                          >
                            {option.tag}
                          </span>
                        </div>

                        {/* Bottom Row: Text Content */}
                        <div className="space-y-1">
                          <h3 className="font-bold text-slate-800 text-base leading-tight group-hover:text-slate-900 transition-colors whitespace-nowrap">
                            {option.title}
                          </h3>
                          <p className="text-xs text-slate-500 leading-normal group-hover:text-slate-600 transition-colors line-clamp-2">
                            {option.desc}
                          </p>

                          {/* ✨ Smooth Bottom Line Indicator (Updated Here) ✨ */}
                          <div className="pt-1">
                            <div
                              className={`w-5 h-0.5 bg-slate-300 rounded-full group-hover:w-10 transition-all duration-300 ${styles.lineBg}`}
                            />
                          </div>
                        </div>
                      </div>

                      {/* Hover Glow Effect */}
                      <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
                    </motion.div>
                  )
                })}
              </div>
            </motion.div>
          </motion.div>

          {/* RIGHT COLUMN: IMAGE + GLASS CARD (appears first on mobile) */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, type: 'spring', damping: 20 }}
            className="relative w-full"
          >
            {/* Main image card */}
            <div className="relative rounded-3xl overflow-hidden shadow-2xl">
              <Image
                src="https://images.unsplash.com/photo-1504701954957-2010ec3bcec1?w=800&h=800&fit=crop"
                alt="Woman meditating in a serene nature setting"
                width={600}
                height={700}
                className="w-full h-auto object-cover"
                priority
              />
              {/* Overlay gradient */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent" />
            </div>

            {/* Floating glass card on top of image */}
            <div className="absolute bottom-6 left-6 right-6 bg-white/80 backdrop-blur-xl rounded-2xl p-4 shadow-lg border border-white/40">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-emerald-100 rounded-full">
                  <Heart className="w-5 h-5 text-emerald-600" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-slate-800">Daily check-in</p>
                  <p className="text-xs text-slate-500">How are you feeling today?</p>
                </div>
                <div className="ml-auto">
                  <div className="h-2 w-20 bg-slate-200 rounded-full overflow-hidden">
                    <div className="h-full w-2/3 bg-emerald-500 rounded-full" />
                  </div>
                  <p className="text-xs text-slate-400 mt-1">+23% stability</p>
                </div>
              </div>
            </div>

            {/* Floating testimonial badge */}
            <motion.div
              animate={{ y: [0, -6, 0] }}
              transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
              className="absolute -top-4 -right-4 bg-white rounded-2xl shadow-lg p-3 border border-amber-100"
            >
              <div className="flex items-center gap-2">
                <Quote className="w-4 h-4 text-amber-500" />
                <span className="text-xs font-medium text-slate-700">“Life‑changing” – ★★★★★</span>
              </div>
            </motion.div>

            {/* Floating meditation pill */}
            <motion.div
              animate={{ rotate: [0, 3, -3, 0] }}
              transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
              className="absolute -bottom-3 -left-4 bg-white/90 backdrop-blur-sm rounded-full shadow-md px-3 py-1.5 border border-slate-100 hidden md:flex items-center gap-1"
            >
              <Clock className="w-3 h-3 text-teal-500" />
              <span className="text-xs text-slate-600">12‑min guided counselling</span>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}

export default Hero
