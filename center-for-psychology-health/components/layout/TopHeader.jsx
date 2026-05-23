'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Heart } from 'lucide-react'

const TopHeader = () => {
  const [quoteIndex, setQuoteIndex] = useState(0)

  const quotes = [
    '"Your present circumstances don\'t determine where you can go; they merely determine where you start." — Nido Qubein',
    '"Healing is a matter of time, but it is sometimes also a matter of opportunity." — Hippocrates',
    '"You are not your thoughts. You are the observer of your thoughts." — Unknown',
    '"Self-care is not selfish. You cannot serve from an empty vessel." — Eleanor Brown',
  ]

  // Rotate quotes every 6 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setQuoteIndex((prev) => (prev + 1) % quotes.length)
    }, 6000)
    return () => clearInterval(interval)
  }, [quotes.length])

  return (
    /* 
      FIXES: 
      - bg-teal-800 থেকে পরিবর্তন করে bg-slate-50 (বা হালকা টিল bg-teal-50/50) করা হয়েছে।
      - টেক্সট কালার text-slate-500 করে মনোযোগ কমানো হয়েছে।
      - py-2.5 কমিয়ে py-1 (মাত্র ৪px) করা হয়েছে যাতে স্ট্রিপটি চিকন হয়।
      - border-b যোগ করে মেইন নববার থেকে আলাদা করা হয়েছে।
    */
    <div className="bg-slate-50 text-slate-500 py-1 text-center text-xs font-normal border-b border-slate-100">
      <div className="container mx-auto px-4 flex items-center justify-center gap-2">
        {/* আইকনের সাইজ ছোট করা হয়েছে এবং পালস অ্যানিমেশন বাদ দেওয়া হয়েছে */}
        <Heart size={12} className="text-slate-400" />
        <AnimatePresence mode="wait">
          <motion.span
            key={quoteIndex}
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -5 }}
            transition={{ duration: 0.4 }}
            className="inline-block tracking-wide italic"
          >
            {quotes[quoteIndex]}
          </motion.span>
        </AnimatePresence>
      </div>
    </div>
  )
}

export default TopHeader