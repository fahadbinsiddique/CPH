'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { motion, AnimatePresence } from 'framer-motion'
import {
  ChevronRight,
  Sparkles,
  Clock,
  Award,
  Mail,
  MapPin,
  Phone,
  Send,
  ShieldCheck,
  Heart,
  ArrowUp,
  CheckCircle2,
} from 'lucide-react'
import {
  FiFacebook,
  FiTwitter,
  FiInstagram,
  FiLinkedin,
  FiYoutube,
} from 'react-icons/fi'

const Input = ({ type = 'text', placeholder, className, ...props }) => (
  <input
    type={type}
    placeholder={placeholder}
    className={`flex h-11 w-full rounded-xl border border-slate-700/50 bg-white/5 px-4 py-2 text-sm text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all disabled:cursor-not-allowed disabled:opacity-50 ${className}`}
    {...props}
  />
)

const Button = ({ children, variant = 'default', className, ...props }) => {
  const variants = {
    default: 'bg-gradient-to-r from-teal-600 to-emerald-600 text-white hover:from-teal-700 hover:to-emerald-700 shadow-lg shadow-teal-600/20',
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

const Footer = () => {
  const [email, setEmail] = useState('')
  const [subscribed, setSubscribed] = useState(false)
  const [isHovered, setIsHovered] = useState(false)

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
      { name: 'Home', href: '/' },
      { name: 'Services', href: '/services' },
      { name: 'Consultants', href: '/consultant' },
      { name: 'Blog', href: '/blog' },
      { name: 'About Us', href: '/about-us' },
    ],
    resources: [
      { name: 'Mental Health Guides', href: '/guides' },
      { name: 'Self Help Tools', href: '/tools' },
      { name: 'Therapy Articles', href: '/articles' },
      { name: 'Privacy Policy', href: '/privacy' },
      { name: 'Terms of Service', href: '/terms' },
    ],
    support: [
      { name: 'FAQs', href: '/faq' },
      { name: 'Contact Us', href: '/contact' },
      { name: 'Emergency Support', href: '/emergency' },
      { name: 'Feedback', href: '/feedback' },
    ],
  }

  const socialLinks = [
    { icon: FiFacebook, href: 'https://facebook.com', label: 'Facebook' },
    { icon: FiTwitter, href: 'https://twitter.com', label: 'Twitter' },
    { icon: FiInstagram, href: 'https://instagram.com', label: 'Instagram' },
    { icon: FiLinkedin, href: 'https://linkedin.com', label: 'LinkedIn' },
    { icon: FiYoutube, href: 'https://youtube.com', label: 'YouTube' },
  ]

  const trustBadges = [
    { icon: ShieldCheck, label: '100% Confidential' },
    { icon: Award, label: 'Licensed Experts' },
    { icon: Clock, label: '24/7 Support' },
  ]

  return (
    <footer className="relative bg-gradient-to-br from-slate-950 via-slate-900 to-teal-950 text-slate-300 overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 pointer-events-none">
        <motion.div
          animate={{ scale: [1, 1.2, 1], x: [0, 30, -20, 0], y: [0, -20, 20, 0] }}
          transition={{ duration: 20, repeat: Infinity, repeatType: 'mirror' }}
          className="absolute top-[-150px] left-[-150px] w-[500px] h-[500px] bg-teal-500/5 rounded-full blur-3xl"
        />
        <motion.div
          animate={{ scale: [1, 1.1, 1], x: [0, -30, 20, 0], y: [0, 20, -20, 0] }}
          transition={{ duration: 25, repeat: Infinity, repeatType: 'mirror' }}
          className="absolute bottom-[-150px] right-[-150px] w-[500px] h-[500px] bg-emerald-500/5 rounded-full blur-3xl"
        />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-indigo-500/5 rounded-full blur-3xl" />
      </div>

      {/* Top Decorative Line */}
      <div className="relative h-1 bg-gradient-to-r from-transparent via-teal-500/50 to-transparent" />

      <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-8 py-16">
        <div className="grid lg:grid-cols-12 gap-10">
          {/* Brand Column - 4 columns */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="lg:col-span-4"
          >
            <Link href="/" className="inline-block">
              <Image
                src={'/logo.png'}
                width={250}
                height={150}
                alt="Center For Psychological Health"
                className="object-contain brightness-100 "
              />
            </Link>
            <p className="text-sm text-slate-400 leading-relaxed max-w-sm mt-3">
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
                    <Icon className="w-3.5 h-3.5 text-teal-400" />
                    <span className="text-xs text-slate-300 font-medium">{badge.label}</span>
                  </div>
                )
              })}
            </div>

            {/* Newsletter */}
            <div className="mt-6">
              <p className="text-sm font-medium text-white mb-2 flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-teal-400" />
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
                    className="flex items-center gap-1.5 text-xs text-teal-400 mt-2"
                  >
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    Thanks! You are subscribed.
                  </motion.p>
                )}
              </AnimatePresence>
            </div>
          </motion.div>

          {/* Quick Links - 2 columns */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="lg:col-span-2"
          >
            <h3 className="text-white font-semibold mb-4 text-lg">Quick Links</h3>
            <ul className="space-y-2.5">
              {footerLinks.quick.map((item) => (
                <li key={item.name}>
                  <Link
                    href={item.href}
                    className="text-slate-400 hover:text-teal-300 transition-colors duration-200 flex items-center gap-1 group"
                  >
                    <ChevronRight className="w-3 h-3 opacity-0 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all" />
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Resources - 2 columns */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="lg:col-span-2"
          >
            <h3 className="text-white font-semibold mb-4 text-lg">Resources</h3>
            <ul className="space-y-2.5">
              {footerLinks.resources.map((item) => (
                <li key={item.name}>
                  <Link
                    href={item.href}
                    className="text-slate-400 hover:text-teal-300 transition-colors duration-200 flex items-center gap-1 group"
                  >
                    <ChevronRight className="w-3 h-3 opacity-0 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all" />
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Contact & Social - 2 columns */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
            className="lg:col-span-2"
          >
            <h3 className="text-white font-semibold mb-4 text-lg">Get in Touch</h3>
            <div className="space-y-3 text-sm">
              <div className="flex items-center gap-3 bg-white/5 rounded-xl px-3 py-2.5 border border-white/5 hover:border-teal-500/20 transition-colors group">
                <Mail className="w-4 h-4 text-teal-400 group-hover:scale-110 transition-transform" />
                <a href="mailto:info@cph.com" className="text-slate-300 hover:text-white transition">
                  info@cph.com
                </a>
              </div>
              <div className="flex items-center gap-3 bg-white/5 rounded-xl px-3 py-2.5 border border-white/5 hover:border-teal-500/20 transition-colors group">
                <Phone className="w-4 h-4 text-teal-400 group-hover:scale-110 transition-transform" />
                <a href="tel:+8801762389523" className="text-slate-300 hover:text-white transition">
                  +880 1762-389523
                </a>
              </div>
              <div className="flex items-start gap-3 bg-white/5 rounded-xl px-3 py-2.5 border border-white/5 hover:border-teal-500/20 transition-colors group">
                <MapPin className="w-4 h-4 text-teal-400 mt-0.5 group-hover:scale-110 transition-transform" />
                <span className="text-slate-300 text-xs leading-relaxed">
                  28/1 Green Corner (5th floor),<br />
                  Green Road, Dhanmondi 1205<br />
                  Dhaka, Bangladesh
                </span>
              </div>
            </div>

            {/* Social Icons */}
            <div className="mt-6">
              <p className="text-xs text-slate-500 font-medium uppercase tracking-wider mb-3">
                Follow Us
              </p>
              <div className="flex items-center gap-3">
                {socialLinks.map((social) => {
                  const Icon = social.icon
                  return (
                    <a
                      key={social.label}
                      href={social.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-slate-400 hover:text-teal-300 hover:bg-teal-500/10 hover:border-teal-500/30 transition-all hover:-translate-y-0.5"
                      aria-label={social.label}
                    >
                      <Icon className="w-4 h-4" />
                    </a>
                  )
                })}
              </div>
            </div>
          </motion.div>
        </div>

        {/* Divider with gradient */}
        <div className="relative my-10">
          <div className="border-t border-slate-800" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-slate-900 px-4">
            <Heart className="w-3 h-3 text-teal-500" />
          </div>
        </div>

        {/* Bottom Section */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-sm">
          <p className="text-slate-500">
            © {new Date().getFullYear()} Center For Psychological Health. All rights reserved.
          </p>
          <div className="flex items-center gap-6 text-xs">
            <Link href="/privacy" className="text-slate-500 hover:text-teal-300 transition-colors">
              Privacy Policy
            </Link>
            <span className="text-slate-700">|</span>
            <Link href="/terms" className="text-slate-500 hover:text-teal-300 transition-colors">
              Terms of Service
            </Link>
            <span className="text-slate-700">|</span>
            <Link href="/cookies" className="text-slate-500 hover:text-teal-300 transition-colors">
              Cookie Policy
            </Link>
            <span className="text-slate-700">|</span>
            <span className="flex items-center gap-1 text-slate-600">
              <ShieldCheck className="w-3 h-3 text-teal-500" />
              Secure
            </span>
          </div>
        </div>

        {/* Back to Top Button */}
        <motion.button
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="absolute bottom-8 right-8 p-3 rounded-full bg-teal-600/20 backdrop-blur-sm border border-teal-500/20 text-teal-400 hover:bg-teal-600/30 transition-all hover:border-teal-500/40 hidden lg:block focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-400 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-900"
          aria-label="Back to top"
        >
          <ArrowUp className="w-4 h-4" />
        </motion.button>
      </div>
    </footer>
  )
}

export default Footer