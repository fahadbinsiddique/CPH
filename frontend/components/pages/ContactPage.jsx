'use client'
// Client implementation of the Contact page. Rendered by the server wrapper
// at app/(public)/contact/page.jsx.

import { motion } from 'framer-motion'
import Link from 'next/link'
import {
  Phone,
  Mail,
  Clock,
  MapPin,
  Calendar,
  ClipboardCheck,
} from 'lucide-react'
import { SOCIAL_LINKS } from '@/lib/social'

const MAP_QUERY = '28/1 Green Corner, Green Road, Dhanmondi 1205, Dhaka'
const MAP_SRC = `https://www.google.com/maps?q=${encodeURIComponent(MAP_QUERY)}&output=embed`
const MAP_LINK = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(MAP_QUERY)}`

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.08, delayChildren: 0.1 },
  },
}

const itemVariants = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { type: 'spring', stiffness: 300, damping: 26 },
  },
}

const channels = [
  {
    icon: Phone,
    title: 'Call us',
    value: '+880 1762-389523',
    note: 'Sun–Thu, 9:00 AM – 8:00 PM',
    href: 'tel:+8801762389523',
    cta: 'Tap to call',
  },
  {
    icon: Mail,
    title: 'Email us',
    value: 'cfphuk@gmail.com',
    note: 'We reply within one business day',
    href: 'mailto:cfphuk@gmail.com',
    cta: 'Compose an email',
  },
  {
    icon: Clock,
    title: 'Clinic hours',
    value: 'Sun – Thu',
    note: '9:00 AM – 8:00 PM · Closed Fri & Sat',
  },
  {
    icon: MapPin,
    title: 'Visit us',
    value: 'Green Road, Dhanmondi',
    note: '28/1 Green Corner (5th floor), Dhanmondi 1205',
    href: MAP_LINK,
    cta: 'Open in Google Maps',
    external: true,
  },
]

const channelShell =
  'group relative flex flex-col rounded-2xl border border-border/60 bg-card p-6 shadow-card transition-all duration-300 hover:-translate-y-1 hover:shadow-float'

const channelFocus =
  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-500 focus-visible:ring-offset-2 focus-visible:ring-offset-background'

const ChannelCard = ({ channel }) => {
  const { icon: Icon, title, value, note, href, cta, external } = channel
  const body = (
    <>
      <span className="inline-flex rounded-xl bg-violet-50 p-3 text-violet-600 transition-colors duration-300 group-hover:bg-violet-600 group-hover:text-white">
        <Icon size={20} aria-hidden="true" />
      </span>
      <span className="mt-4 text-xs font-semibold uppercase tracking-widest text-muted-foreground">
        {title}
      </span>
      <span className="mt-1 block text-lg font-bold text-foreground transition-colors group-hover:text-violet-700">
        {value}
      </span>
      <span className="mt-1 block text-sm text-muted-foreground">{note}</span>
      {cta && (
        <span className="mt-3 inline-flex items-center gap-1 text-sm font-semibold text-violet-600">
          {cta}
          <span aria-hidden="true">→</span>
        </span>
      )}
    </>
  )

  if (href) {
    return (
      <motion.a
        variants={itemVariants}
        href={href}
        {...(external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
        className={`${channelShell} ${channelFocus}`}
      >
        {body}
      </motion.a>
    )
  }
  return (
    <motion.div variants={itemVariants} className={channelShell}>
      {body}
    </motion.div>
  )
}

export default function ContactPage() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-violet-50/40 via-white to-white pb-16 pt-32 font-sans">
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="mx-auto w-full max-w-6xl px-6 lg:px-8"
      >
        {/* Hero */}
        <motion.header variants={itemVariants} className="mx-auto max-w-2xl text-center">
          <span className="inline-flex items-center gap-1.5 rounded-full border border-violet-200/70 bg-violet-50 px-3 py-1 text-xs font-semibold uppercase tracking-widest text-violet-700">
            Contact
          </span>
          <h1 className="mt-4 font-heading text-3xl font-bold text-foreground sm:text-4xl lg:text-5xl">
            Get in touch
          </h1>
          <p className="mt-4 text-base text-muted-foreground sm:text-lg">
            Questions about therapy, bookings or our self-assessments? Call, email
            or visit our Dhanmondi clinic — we&apos;re open Sunday through Thursday
            and reply within one business day.
          </p>
        </motion.header>

        {/* Channel cards */}
        <motion.section
          variants={containerVariants}
          aria-label="Contact options"
          className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4 lg:gap-5"
        >
          {channels.map((channel) => (
            <ChannelCard key={channel.title} channel={channel} />
          ))}
        </motion.section>

        {/* Map + CTA */}
        <section className="mt-6 grid grid-cols-1 gap-6 lg:mt-8 lg:grid-cols-2">
          <motion.div
            variants={itemVariants}
            className="overflow-hidden rounded-2xl border border-border/60 shadow-card"
          >
            <iframe
              src={MAP_SRC}
              title="Centre for Psychological Health location — 28/1 Green Corner, Green Road, Dhanmondi 1205"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              className="h-80 w-full border-0 lg:h-[26rem]"
            />
          </motion.div>

          <motion.div
            variants={itemVariants}
            className="flex flex-col justify-center rounded-2xl border border-violet-100 bg-gradient-to-br from-violet-50 via-white to-white p-8 shadow-card"
          >
            <span className="inline-flex w-fit rounded-xl bg-violet-600 p-3 text-white shadow-md shadow-violet-900/10">
              <Calendar size={20} aria-hidden="true" />
            </span>
            <h2 className="mt-4 font-heading text-2xl font-bold text-foreground">
              Ready to start?
            </h2>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground sm:text-base">
              Take the free self-assessment to check in with yourself, or book a
              session directly with a licensed therapist — whichever feels right.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Link href="/consultant" className="btn-primary">
                <Calendar size={18} aria-hidden="true" />
                Book a Session
              </Link>
              <Link href="/assessment" className="btn-outline">
                <ClipboardCheck size={18} aria-hidden="true" />
                Start Free Assessment
              </Link>
            </div>

            <div className="mt-8 border-t border-border/60 pt-6">
              <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                Follow us
              </p>
              <div className="mt-3 flex items-center gap-2">
                {SOCIAL_LINKS.map((social) => {
                  const Icon = social.icon
                  return (
                    <a
                      key={social.label}
                      href={social.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={social.label}
                      className={`${channelShell} ${channelFocus} h-10 w-10 !translate-y-0 !p-0 items-center justify-center !rounded-full`}
                    >
                      <Icon size={16} aria-hidden="true" />
                    </a>
                  )
                })}
              </div>
            </div>
          </motion.div>
        </section>

        {/* No message form on purpose: the backend has no contact endpoint
            yet, and a form that posts nowhere is worse than none. Add a
            Django contact endpoint + services/contactService.js to enable it. */}
      </motion.div>
    </main>
  )
}
