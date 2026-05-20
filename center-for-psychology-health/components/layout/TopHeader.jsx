'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Heart } from 'lucide-react'

const TopHeader = () => {
  const [quoteIndex, setQuoteIndex] = useState(0)

  const quotes = [
    '✨ "Your present circumstances don\'t determine where you can go; they merely determine where you start." — Nido Qubein',
    '🌸 "Healing is a matter of time, but it is sometimes also a matter of opportunity." — Hippocrates',
    '🌿 "You are not your thoughts. You are the observer of your thoughts." — Unknown',
    '💙 "Self-care is not selfish. You cannot serve from an empty vessel." — Eleanor Brown',
  ]

  // Rotate quotes every 6 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setQuoteIndex((prev) => (prev + 1) % quotes.length)
    }, 6000)
    return () => clearInterval(interval)
  }, [quotes.length])

  return (
    <div className="bg-teal-800/90 backdrop-blur-sm text-white py-2.5 text-center text-sm font-medium">
      <div className="container mx-auto px-4 flex items-center justify-center gap-2">
        <Heart size={14} className="text-teal-200 animate-pulse" />
        <AnimatePresence mode="wait">
          <motion.span
            key={quoteIndex}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.5 }}
            className="inline-block"
          >
            {quotes[quoteIndex]}
          </motion.span>
        </AnimatePresence>
      </div>
    </div>
  )
}

export default TopHeader
