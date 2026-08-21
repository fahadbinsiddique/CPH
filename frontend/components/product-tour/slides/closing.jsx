'use client';

import Image from 'next/image';
import { motion } from 'framer-motion';
import { Heart, Compass, KeyRound } from 'lucide-react';
import Link from 'next/link';

export default function Closing({ slide }) {
  return (
    <div className="flex w-full flex-col items-center py-6 text-center">
      <motion.div
        initial={{ opacity: 0, scale: 0.85 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ type: 'spring', stiffness: 220, damping: 18, delay: 0.1 }}
        className="mb-8 inline-flex h-20 w-20 items-center justify-center rounded-[1.6rem] bg-gradient-to-br from-teal-500 to-emerald-600 shadow-xl shadow-teal-600/30"
      >
        <Heart className="h-9 w-9 text-white" fill="currentColor" />
      </motion.div>

      <motion.h2
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.25, ease: [0.16, 1, 0.3, 1] }}
        className="mx-auto max-w-3xl text-3xl font-bold tracking-tight text-slate-900 md:text-4xl xl:text-[3rem] xl:leading-[1.1]"
      >
        CPH brings the psychology practice into one connected digital experience.
      </motion.h2>

      <motion.p
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.55, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
        className="mt-6 text-2xl font-semibold tracking-tight text-teal-700"
      >
        Thank You
      </motion.p>

      <motion.p
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.5 }}
        className="mt-3 max-w-xl text-base leading-relaxed text-stone-600"
      >
        We hope this tour made the platform easy to understand. We invite you to explore the
        experience itself.
      </motion.p>

      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.62 }}
        className="mt-9 flex flex-wrap items-center justify-center gap-3"
      >
        <Link
          href="/"
          className="inline-flex items-center gap-2 rounded-2xl bg-gradient-to-r from-teal-600 to-emerald-600 px-7 py-3.5 text-base font-semibold text-white shadow-lg shadow-teal-600/25 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-500 focus-visible:ring-offset-2"
        >
          <Compass className="h-4 w-4" />
          Explore the Platform
        </Link>
        <Link
          href="/dashboard"
          className="inline-flex items-center gap-2 rounded-2xl border border-slate-200 bg-white px-7 py-3.5 text-base font-semibold text-slate-700 shadow-sm transition-all duration-300 hover:border-teal-300 hover:bg-teal-50/60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-500 focus-visible:ring-offset-2"
        >
          <KeyRound className="h-4 w-4" />
          Return to Dashboard
        </Link>
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.7, delay: 0.75 }}
        className="mt-12 flex items-center gap-2"
      >
        <Image src="/logo.png" alt="Center for Psychology Health" width={150} height={28} className="h-7 w-auto opacity-70" />
      </motion.div>
    </div>
  );
}