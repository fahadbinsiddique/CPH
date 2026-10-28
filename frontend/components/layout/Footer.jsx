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
import { useReducedMotion } from '@/hooks/useReducedMotion'

const Input = ({ type = 'text', placeholder, className, invalid, ...props }) => (
  <input
    type={type}
    placeholder={placeholder}
    aria-invalid={invalid || undefined}
    className={`flex h-11 w-full rounded-xl border bg-white/5 px-4 py-2 text-sm text-white placeholder:text-stone-400 transition-all focus:outline-none focus:ring-2 focus:border-transparent ${
      invalid
        ? 'border-red-500/60 focus:ring-red-500/70'
        : 'border-white/10 focus:ring-violet-500'
    } ${className}`}
    {...props}
  />
)

const Button = ({ children, variant = 'default', className, ...props }) => {
  const variants = {
    default:
      'bg-violet-600 text-white hover:bg-violet-700 shadow-lg shadow-violet-600/20',
    outline: 'border border-white/20 text-white hover:bg-white/10',
  }
  return (
    <button
      className={`inline-flex cursor-pointer items-center justify-center rounded-xl px-4 py-2.5 text-sm font-medium transition-all ${variants[variant]} ${className}`}
      {...props}
    >
      {children}
    </button>
  )
}

const NOISE_SVG =
  "data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E"

// Shared focus ring for every interactive element in the footer
const FOCUS_RING =
  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-400 focus-visible:ring-offset-2 focus-visible:ring-offset-stone-950'

const Footer = () => {
  const [email, setEmail] = useState('')
  const [error, setError] = useState('')
  const [subscribed, setSubscribed] = useState(false)
  const reduceMotion = useReducedMotion()

  // Entrance animation that is skipped entirely under prefers-reduced-motion
  const rise = (delay = 0) =>
    reduceMotion
      ? {}
      : {
          initial: { opacity: 0, y: 20 },
          whileInView: { opacity: 1, y: 0 },
          viewport: { once: true, amount: 0.1 },
          transition: { duration: 0.5, delay, ease: [0.16, 1, 0.3, 1] },
        }

  const handleSubscribe = (e) => {
    e.preventDefault()
    const trimmed = email.trim()
    if (!trimmed) {
      setError('Please enter your email address.')
      return
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmed)) {
      setError('Please enter a valid email address, e.g. name@example.com.')
      return
    }
    setError('')
    setSubscribed(true)
    setEmail('')
    setTimeout(() => setSubscribed(false), 3000)
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
    { icon: ShieldCheck, label: '100% Confidential', accent: 'text-emerald-400' },
    { icon: Sparkles, label: 'Licensed Experts', accent: 'text-violet-400' },
  ]

  const linkListClass =
    'group flex min-h-11 items-center gap-1.5 rounded-lg text-sm text-stone-400 transition-colors duration-200 hover:text-violet-300 ' +
    FOCUS_RING

  return (
    <footer className="relative overflow-hidden bg-stone-950 text-stone-300">
      {/* Subtle noise overlay */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.03]"
        aria-hidden="true"
        style={{ backgroundImage: `url("${NOISE_SVG}")` }}
      />

      {/* Top Decorative Line */}
      <div
        className="relative h-1 bg-gradient-to-r from-transparent via-violet-500/40 to-transparent"
        aria-hidden="true"
      />

      <div className="relative z-10 mx-auto max-w-7xl px-6 py-16 lg:px-8">
        {/* Main Content Grid — real12-col spans so wide columns actually apply */}
        <div className="mb-14 grid gap-10 md:grid-cols-2 xl:grid-cols-12 xl:gap-12">
          {/* Brand Column */}
          <motion.div className="md:col-span-2 xl:col-span-4" {...rise(0)}>
            <Link
              href="/"
              className={`inline-block rounded-lg ${FOCUS_RING}`}
              aria-label="Centre For Psychological Health — home"
            >
              <Image
                src={'/logo1.png'}
                width={250}
                height={150}
                alt="Centre For Psychological Health"
                className="object-contain brightness-100"
              />
            </Link>
            <p className="mt-3 max-w-sm text-sm leading-relaxed text-stone-400">
              A safe and supportive mental wellness platform connecting you with
              licensed therapists and tools for emotional well-being.
            </p>

            {/* Trust Badges */}
            <div className="mt-5 flex flex-wrap gap-3">
              {trustBadges.map((badge, idx) => {
                const Icon = badge.icon
                return (
                  <div
                    key={idx}
                    className="flex items-center gap-1.5 rounded-full border border-white/5 bg-white/5 px-3 py-1.5"
                  >
                    <Icon
                      className={`h-3.5 w-3.5 ${badge.accent}`}
                      aria-hidden="true"
                    />
                    <span className="text-xs font-medium text-stone-300">
                      {badge.label}
                    </span>
                  </div>
                )
              })}
            </div>

            {/* Newsletter */}
            <div className="mt-6 max-w-md">
              <h3
                id="footer-newsletter-heading"
                className="mb-2 flex items-center gap-2 text-sm font-semibold text-white"
              >
                <Sparkles
                  className="h-4 w-4 text-violet-400"
                  aria-hidden="true"
                />
                Subscribe to our newsletter
              </h3>
              <form onSubmit={handleSubscribe} noValidate>
                <label
                  htmlFor="footer-newsletter-email"
                  className="mb-1.5 block text-xs font-medium text-stone-400"
                >
                  Email address
                </label>
                <div className="flex gap-2">
                  <Input
                    id="footer-newsletter-email"
                    type="email"
                    name="email"
                    autoComplete="email"
                    placeholder="you@example.com"
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value)
                      if (error) setError('')
                    }}
                    invalid={!!error}
                    aria-describedby={error ? 'footer-newsletter-error' : undefined}
                    className="flex-1"
                    required
                  />
                  <Button
                    type="submit"
                    className="h-11 w-11 shrink-0 px-0"
                    aria-label="Subscribe to newsletter"
                  >
                    <Send className="h-4 w-4" aria-hidden="true" />
                  </Button>
                </div>
              </form>

              {/* Errors announced to screen readers, focusable by keyboard */}
              {error && (
                <p
                  id="footer-newsletter-error"
                  role="alert"
                  className="mt-2 flex items-start gap-1.5 text-xs leading-relaxed text-red-400"
                >
                  {error}
                </p>
              )}

              <AnimatePresence>
                {subscribed && (
                  <motion.p
                    role="status"
                    initial={reduceMotion ? false : { opacity: 0, y: -8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={reduceMotion ? { opacity: 0 } : { opacity: 0, y: -8 }}
                    className="mt-2 flex items-center gap-1.5 text-xs text-emerald-400"
                  >
                    <CheckCircle2
                      className="h-3.5 w-3.5"
                      aria-hidden="true"
                    />
                    Thanks! You are subscribed.
                  </motion.p>
                )}
              </AnimatePresence>
            </div>
          </motion.div>

          {/* Links Column */}
          <motion.div className="xl:col-span-3" {...rise(0.1)}>
            <div>
              <h3 className="mb-3 text-base font-semibold text-white">
                Quick Links
              </h3>
              <ul className="-ml-2 space-y-1">
                {footerLinks.quick.map((item) => (
                  <li key={item.name}>
                    <Link href={item.href} className={linkListClass}>
                      <ChevronRight
                        className="h-3 w-3 -translate-x-1 opacity-0 transition-all group-hover:translate-x-0 group-hover:opacity-100"
                        aria-hidden="true"
                      />
                      {item.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div className="mt-8">
              <h3 className="mb-3 text-base font-semibold text-white">Legal</h3>
              <ul className="-ml-2 space-y-1">
                {footerLinks.legal.map((item) => (
                  <li key={item.name}>
                    <Link href={item.href} className={linkListClass}>
                      <ChevronRight
                        className="h-3 w-3 -translate-x-1 opacity-0 transition-all group-hover:translate-x-0 group-hover:opacity-100"
                        aria-hidden="true"
                      />
                      {item.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </motion.div>

          {/* Contact & Map Column */}
          <motion.div className="md:col-span-2 xl:col-span-5" {...rise(0.2)}>
            <h3 className="mb-3 text-base font-semibold text-white">
              Contact &amp; Location
            </h3>
            <div className="space-y-3 text-sm">
              <div className="group flex items-center gap-3 rounded-xl border border-white/5 bg-white/5 px-3 py-2.5 transition-colors hover:border-violet-500/30">
                <Mail
                  className="h-4 w-4 shrink-0 text-violet-400 transition-transform group-hover:scale-110"
                  aria-hidden="true"
                />
                <a
                  href="mailto:info@cph.com"
                  className={`rounded text-stone-300 transition-colors hover:text-white ${FOCUS_RING}`}
                >
                  info@cph.com
                </a>
              </div>
              <div className="group flex items-center gap-3 rounded-xl border border-white/5 bg-white/5 px-3 py-2.5 transition-colors hover:border-violet-500/30">
                <Phone
                  className="h-4 w-4 shrink-0 text-violet-400 transition-transform group-hover:scale-110"
                  aria-hidden="true"
                />
                <a
                  href="tel:+8801762389523"
                  className={`rounded text-stone-300 transition-colors hover:text-white ${FOCUS_RING}`}
                >
                  +880 1762-389523
                </a>
              </div>
              <div className="group flex items-start gap-3 rounded-xl border border-white/5 bg-white/5 px-3 py-2.5 transition-colors hover:border-violet-500/30">
                <MapPin
                  className="mt-0.5 h-4 w-4 shrink-0 text-violet-400 transition-transform group-hover:scale-110"
                  aria-hidden="true"
                />
                <span className="text-xs leading-relaxed text-stone-400">
                  28/1 Green Corner (5th floor),
                  <br />
                  Green Road, Dhanmondi 1205
                  <br />
                  Dhaka, Bangladesh
                </span>
              </div>
            </div>

            {/* Social Icons */}
            <div className="mt-6">
              <p
                className="mb-3 text-xs font-medium uppercase tracking-wider text-stone-400"
                id="footer-follow-label"
              >
                Follow Us
              </p>
              <div
                className="flex items-center gap-3"
                role="list"
                aria-labelledby="footer-follow-label"
              >
                {SOCIAL_LINKS.map((social) => {
                  const Icon = social.icon
                  return (
                    <a
                      key={social.label}
                      href={social.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      role="listitem"
                      aria-label={social.label}
                      className={`flex h-11 w-11 items-center justify-center rounded-xl border border-white/10 bg-white/5 text-stone-400 transition-all hover:-translate-y-0.5 hover:border-violet-500/40 hover:bg-violet-500/10 hover:text-violet-300 ${FOCUS_RING}`}
                    >
                      <Icon className="h-4 w-4" aria-hidden="true" />
                    </a>
                  )
                })}
              </div>
            </div>

            {/* Google Maps Embed */}
            <div className="mt-8 overflow-hidden rounded-2xl border border-stone-800 bg-stone-900">
              <div className="aspect-[16/9] w-full sm:aspect-[4/3] xl:aspect-[16/9]">
                <iframe
                  title="CPH Centre for Psychological Health Location"
                  src="https://www.google.com/maps?q=Green+Corner,+Green+Road,+Dhanmondi,+Dhaka+1205,+Bangladesh&z=16&output=embed"
                  style={{ border: 0 }}
                  allowFullScreen=""
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  className="h-full w-full"
                ></iframe>
              </div>
              <div className="border-t border-stone-800 bg-stone-900/50 px-4 py-3">
                <p className="text-center text-xs text-stone-400">
                  <Globe
                    className="mr-1 inline h-3 w-3"
                    aria-hidden="true"
                  />
                  28/1 Green Corner, Green Road, Dhanmondi 1205, Dhaka,
                  Bangladesh
                </p>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Divider */}
        <div className="border-t border-stone-800" aria-hidden="true" />

        {/* Bottom Section */}
        <div className="flex flex-col items-center justify-between gap-5 pt-6 text-sm md:flex-row">
          <p className="text-center text-stone-400 md:text-left">
            © {new Date().getFullYear()} Centre For Psychological Health. All
            rights reserved.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-x-5 gap-y-2 text-xs">
            <Link
              href="/privacy"
              className={`rounded px-1 py-1 text-stone-400 transition-colors hover:text-violet-300 ${FOCUS_RING}`}
            >
              Privacy Policy
            </Link>
            <span className="text-stone-600" aria-hidden="true">
              |
            </span>
            <Link
              href="/terms"
              className={`rounded px-1 py-1 text-stone-400 transition-colors hover:text-violet-300 ${FOCUS_RING}`}
            >
              Terms of Service
            </Link>
            <span className="text-stone-600" aria-hidden="true">
              |
            </span>
            <Link
              href="/cookies"
              className={`rounded px-1 py-1 text-stone-400 transition-colors hover:text-violet-300 ${FOCUS_RING}`}
            >
              Cookie Policy
            </Link>
            <span className="hidden items-center gap-1 text-stone-400 sm:flex">
              <ShieldCheck
                className="h-3 w-3 text-emerald-400"
                aria-hidden="true"
              />
              Secure
            </span>
          </div>

          {/* Back to Top — inline so it can never overlap content */}
          <motion.button
            onClick={() =>
              window.scrollTo({ top: 0, behavior: 'smooth' })
            }
            whileHover={reduceMotion ? undefined : { scale: 1.05 }}
            whileTap={reduceMotion ? undefined : { scale: 0.95 }}
            aria-label="Back to top"
            className={`inline-flex h-11 cursor-pointer items-center gap-2 rounded-full border border-violet-500/30 bg-violet-600/15 px-4 text-xs font-medium text-violet-300 backdrop-blur-sm transition-colors hover:border-violet-500/50 hover:bg-violet-600/25 ${FOCUS_RING}`}
          >
            <ArrowUp className="h-4 w-4" aria-hidden="true" />
            <span className="hidden sm:inline">Back to top</span>
          </motion.button>
        </div>
      </div>
    </footer>
  )
}

export default Footer
