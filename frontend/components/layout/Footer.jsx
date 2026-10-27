'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { motion, AnimatePresence } from 'motion/react'
import {
  ChevronRight,
  Sparkles,
  Mail,
  MapPin,
  Phone,
  Send,
  ShieldCheck,
  ArrowUp,
  CheckCircle2,
  Globe,
} from 'lucide-react'
import { SOCIAL_LINKS } from '@/lib/social'

const Input = ({ type = 'text', placeholder, className, ...props }) => (
  <input
    type={type}
    placeholder={placeholder}
    className={`flex h-11 w-full rounded-xl border border-stone-700/50 bg-white/5 px-4 py-2 text-sm text-white placeholder:text-stone-500 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent transition-all disabled:cursor-not-allowed disabled:opacity-50 ${className}`}
    {...props}
  />
)

const Button = ({ children, variant = 'default', className, ...props }) => {
  const variants = {
    default: 'bg-violet-600 text-white hover:bg-violet-700 shadow-lg shadow-violet-600/20',
    outline: 'border border-white/20 text-white hover:bg-white/10',
  }
  return (
    <button
      className={`inline-flex items-center justify-center rounded-xl px-4 py-2.5 text-sm font-medium transition-all ${variants[variant]} ${className}`}
      {...props}
    >
      {children}
    </button>
  )
}

const NOISE_SVG = "data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E";

const Footer = () => {
  const [email, setEmail] = useState('')
  const [subscribed, setSubscribed] = useState(false)

  const handleSubscribe = (e) => {
    e.preventDefault()
    if (email) {
      setSubscribed(true)
      setEmail('')
      setTimeout(() => setSubscribed(false), 3000)
    }
  }

  const footerLinks = {
    quick: [
      { name: 'Self-Assessment', href: '/assessment' },
      { name: 'Find a Therapist', href: '/consultant' },
      { name: 'Services', href: '/services' },
      { name: 'Resources', href: '/blog' },
      { name: 'About Us', href: '/about-us' },
      { name: 'Contact', href: '/contact' },
    ],
    legal: [
      { name: 'Privacy Policy', href: '/privacy' },
      { name: 'Terms of Service', href: '/terms' },
      { name: 'Cookie Policy', href: '/cookies' },
    ],
  }

  const trustBadges = [
    { icon: ShieldCheck, label: '100% Confidential' },
    { icon: Sparkles, label: 'Licensed Experts' },
  ]

  return (
    <footer className="relative bg-stone-950 text-stone-300 overflow-hidden">
      {/* Subtle noise overlay */}
      <div className="pointer-events-none absolute inset-0 opacity-[0.03]" aria-hidden="true" style={{ backgroundImage: `url("${NOISE_SVG}")` }} />

      {/* Top Decorative Line */}
      <div className="relative h-1 bg-gradient-to-r from-transparent via-violet-500/30 to-transparent" />

      <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-8 py-16">
        {/* Main Content Grid - 3 columns on large screens */}
        <div className="grid lg:grid-cols-4 gap-10 lg:gap-12 mb-16">
          {/* Brand Column - Full width on mobile, 1.5fr on lg */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="lg:col-span-1.5"
          >
            <Link href="/" className="inline-block">
              <Image
                src={'/logo1.png'}
                width={250}
                height={150}
                alt="Centre For Psychological Health"
                className="object-contain brightness-100"
              />
            </Link>
            <p className="text-sm text-stone-400 leading-relaxed max-w-sm mt-3">
              A safe and supportive mental wellness platform connecting you with licensed therapists
              and tools for emotional well-being.
            </p>

            {/* Trust Badges */}
            <div className="flex flex-wrap gap-3 mt-5">
              {trustBadges.map((badge, idx) => {
                const Icon = badge.icon
                return (
                  <div
                    key={idx}
                    className="flex items-center gap-1.5 bg-white/5 rounded-full px-3 py-1.5 border border-white/5"
                  >
                    <Icon className="w-3.5 h-3.5 text-violet-400" />
                    <span className="text-xs text-stone-300 font-medium">{badge.label}</span>
                  </div>
                )
              })}
            </div>

            {/* Newsletter */}
            <div className="mt-6">
              <p className="text-sm font-medium text-white mb-2 flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-violet-400" />
                Subscribe to our newsletter
              </p>
              <form onSubmit={handleSubscribe} className="flex gap-2">
                <Input
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="flex-1"
                  required
                />
                <Button type="submit" className="px-4" aria-label="Subscribe to newsletter">
                  <Send className="w-4 h-4" />
                </Button>
              </form>
              <AnimatePresence>
                {subscribed && (
                  <motion.p
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="flex items-center gap-1.5 text-xs text-violet-400 mt-2"
                  >
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    Thanks! You are subscribed.
                  </motion.p>
                )}
              </AnimatePresence>
            </div>
          </motion.div>

          {/* Links Column */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="lg:col-span-1"
          >
            {/* Quick Links */}
            <div>
              <h3 className="text-white font-semibold mb-4 text-lg">Quick Links</h3>
              <ul className="space-y-2.5">
                {footerLinks.quick.map((item) => (
                  <li key={item.name}>
                    <Link
                      href={item.href}
                      className="text-stone-400 hover:text-violet-300 transition-colors duration-200 flex items-center gap-1 group"
                    >
                      <ChevronRight className="w-3 h-3 opacity-0 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all" />
                      {item.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Legal */}
            <div className="mt-8">
              <h3 className="text-white font-semibold mb-4 text-lg">Legal</h3>
              <ul className="space-y-2.5">
                {footerLinks.legal.map((item) => (
                  <li key={item.name}>
                    <Link
                      href={item.href}
                      className="text-stone-400 hover:text-violet-300 transition-colors duration-200 flex items-center gap-1 group"
                    >
                      <ChevronRight className="w-3 h-3 opacity-0 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all" />
                      {item.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </motion.div>

          {/* Contact & Map Column - Full width on mobile, 1.5fr on lg */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="lg:col-span-1.5"
          >
            <h3 className="text-white font-semibold mb-4 text-lg">Contact & Location</h3>
            <div className="space-y-3 text-sm">
              <div className="flex items-center gap-3 bg-white/5 rounded-xl px-3 py-2.5 border border-white/5 hover:border-violet-500/20 transition-colors group">
                <Mail className="w-4 h-4 text-violet-400 group-hover:scale-110 transition-transform" />
                <a href="mailto:info@cph.com" className="text-stone-300 hover:text-white transition">
                  info@cph.com
                </a>
              </div>
              <div className="flex items-center gap-3 bg-white/5 rounded-xl px-3 py-2.5 border border-white/5 hover:border-violet-500/20 transition-colors group">
                <Phone className="w-4 h-4 text-violet-400 group-hover:scale-110 transition-transform" />
                <a href="tel:+8801762389523" className="text-stone-300 hover:text-white transition">
                  +880 1762-389523
                </a>
              </div>
              <div className="flex items-start gap-3 bg-white/5 rounded-xl px-3 py-2.5 border border-white/5 hover:border-violet-500/20 transition-colors group">
                <MapPin className="w-4 h-4 text-violet-400 mt-0.5 group-hover:scale-110 transition-transform" />
                <span className="text-stone-300 text-xs leading-relaxed">
                  28/1 Green Corner (5th floor),<br />
                  Green Road, Dhanmondi 1205<br />
                  Dhaka, Bangladesh
                </span>
              </div>
            </div>

            {/* Social Icons */}
            <div className="mt-6">
              <p className="text-xs text-stone-500 font-medium uppercase tracking-wider mb-3">
                Follow Us
              </p>
              <div className="flex items-center gap-3">
                {SOCIAL_LINKS.map((social) => {
                  const Icon = social.icon
                  return (
                    <a
                      key={social.label}
                      href={social.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-stone-400 hover:text-violet-300 hover:bg-violet-500/10 hover:border-violet-500/30 transition-all hover:-translate-y-0.5"
                      aria-label={social.label}
                    >
                      <Icon className="w-4 h-4" />
                    </a>
                  )
                })}
              </div>
            </div>

            {/* Google Maps Embed */}
            <div className="mt-8 rounded-2xl overflow-hidden border border-stone-800 bg-stone-900">
              <div className="aspect-[4/3] w-full">
                <iframe
                  title="CPH Centre for Psychological Health Location"
                  src="https://www.google.com/maps?q=Green+Corner,+Green+Road,+Dhanmondi,+Dhaka+1205,+Bangladesh&z=16&output=embed"
                  style={{ border: 0 }}
                  allowFullScreen=""
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  className="w-full h-full"
                ></iframe>
              </div>
              <div className="px-4 py-3 bg-stone-900/50 border-t border-stone-800">
                <p className="text-xs text-stone-500 text-center">
                  <Globe className="w-3 h-3 inline mr-1" />
                  28/1 Green Corner, Green Road, Dhanmondi 1205, Dhaka, Bangladesh
                </p>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Divider */}
        <div className="relative my-10">
          <div className="border-t border-stone-800" />
        </div>

        {/* Bottom Section */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-sm">
          <p className="text-stone-500">
            © {new Date().getFullYear()} Centre For Psychological Health. All rights reserved.
          </p>
          <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-xs">
            <Link href="/privacy" className="text-stone-500 hover:text-violet-300 transition-colors">
              Privacy Policy
            </Link>
            <span className="text-stone-700">|</span>
            <Link href="/terms" className="text-stone-500 hover:text-violet-300 transition-colors">
              Terms of Service
            </Link>
            <span className="text-stone-700">|</span>
            <Link href="/cookies" className="text-stone-500 hover:text-violet-300 transition-colors">
              Cookie Policy
            </Link>
            <span className="text-stone-700">|</span>
            <span className="sm:flex hidden sm:block items-center gap-1 text-stone-600">
              <ShieldCheck className="w-3 h-3 text-violet-500" />
              Secure
            </span>
          </div>
        </div>

        {/* Back to Top Button */}
        <motion.button
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="absolute bottom-8 left-8 cursor-pointer p-3 rounded-full bg-violet-600/20 backdrop-blur-sm border border-violet-500/20 text-violet-400 hover:bg-violet-600/30 transition-all hover:border-violet-500/40 sm:block focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-400 focus-visible:ring-offset-2 focus-visible:ring-offset-stone-900"
          aria-label="Back to top"
        >
          <ArrowUp className="w-4 h-4" />
        </motion.button>
      </div>
    </footer>
  )
}

export default Footer