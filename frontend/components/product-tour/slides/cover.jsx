'use client';

import Image from 'next/image';
import { motion } from 'framer-motion';
import { ShieldCheck, BadgeCheck, HeartHandshake, Play } from 'lucide-react';

const trust = [
  { icon: BadgeCheck, label: 'Licensed professionals' },
  { icon: ShieldCheck, label: 'Private & secure' },
  { icon: HeartHandshake, label: 'Built around people' },
];

export default function Cover({ onNext }) {
  return (
    <div className="w-full">
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        className="mb-8 inline-flex items-center gap-2 rounded-full border border-teal-200/70 bg-white/80 px-4 py-1.5 text-xs font-semibold tracking-wide text-teal-700 shadow-sm backdrop-blur"
      >
        <span className="relative flex h-2 w-2">
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-teal-400 opacity-60" />
          <span className="relative inline-flex h-2 w-2 rounded-full bg-teal-500" />
        </span>
        Product Tour · Interactive Presentation
      </motion.div>

      <div className="grid items-center gap-10 lg:grid-cols-[1.05fr_0.95fr] lg:gap-14">
        <div>
          <motion.h1
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1], delay: 0.05 }}
            className="text-4xl font-bold tracking-tight text-slate-900 md:text-5xl xl:text-[3.4rem] xl:leading-[1.05]"
          >
            Center for <span className="text-teal-700">Psychology</span> Health
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1], delay: 0.15 }}
            className="mt-3 max-w-lg text-xl font-semibold tracking-tight text-slate-700"
          >
            Digital Mental Health &amp; Psychology Practice Platform
          </motion.p>

          <motion.p
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1], delay: 0.25 }}
            className="mt-4 max-w-xl text-base leading-relaxed text-stone-600 md:text-lg"
          >
            A unified digital experience for clients, consultants and administrators —
            bringing discovery, care and management into one connected platform.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1], delay: 0.35 }}
            className="mt-8 flex flex-wrap gap-3"
          >
            <button
              type="button"
              onClick={onNext}
              className="inline-flex items-center gap-2 rounded-2xl bg-gradient-to-r from-teal-600 to-emerald-600 px-7 py-3.5 text-base font-semibold text-white shadow-lg shadow-teal-600/25 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-500 focus-visible:ring-offset-2"
            >
              <Play className="h-4 w-4" fill="currentColor" />
              Start the Tour
            </button>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-2"
          >
            {trust.map((item) => {
              const Icon = item.icon;
              return (
                <span key={item.label} className="inline-flex items-center gap-1.5 text-sm text-slate-500">
                  <Icon className="h-4 w-4 text-teal-600" />
                  {item.label}
                </span>
              );
            })}
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1], delay: 0.2 }}
          className="relative mx-auto w-full max-w-lg"
        >
          <div className="relative aspect-[8/5] w-full overflow-hidden rounded-[2rem] border border-stone-200/60 shadow-card">
            <Image
              src="/Peaceful therapy session illustration.png"
              alt="Illustration of a peaceful therapy session"
              fill
              priority
              sizes="(max-width: 1024px) 90vw, 44vw"
              className="object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/15 via-transparent to-transparent" />
          </div>
          <div className="absolute -bottom-5 left-1/2 w-[86%] -translate-x-1/2 rounded-2xl border border-white/60 bg-white/85 p-4 shadow-float backdrop-blur-xl">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-teal-100 to-emerald-100">
                <HeartHandshake className="h-5 w-5 text-teal-600" />
              </div>
              <div>
                <p className="text-sm font-semibold text-slate-800">Care, coordinated</p>
                <p className="text-xs text-slate-500">Clients · Consultants · Administrators</p>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}