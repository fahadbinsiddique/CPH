'use client'

import { useState } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import {
  FiTwitter,
  FiInstagram,
  FiLinkedin,
  FiMail,
  FiShield,
  FiHeart,
  FiSend,
  FiMapPin,
  FiPhone,
  FiFacebook,
} from 'react-icons/fi'
import Image from 'next/image'

// Input component (same as before)
const Input = ({ type = 'text', placeholder, className, ...props }) => (
  <input
    type={type}
    placeholder={placeholder}
    className={`flex h-10 w-full rounded-md border border-slate-200 bg-white/10 px-3 py-2 text-sm placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 disabled:cursor-not-allowed disabled:opacity-50 ${className}`}
    {...props}
  />
)

const Button = ({ children, variant = 'default', className, ...props }) => {
  const variants = {
    default: 'bg-emerald-600 text-white hover:bg-emerald-700',
    outline: 'border border-white/20 text-white hover:bg-white/10',
  }
  return (
    <button
      className={`inline-flex items-center justify-center rounded-md px-4 py-2 text-sm font-medium transition-all ${variants[variant]} ${className}`}
      {...props}
    >
      {children}
    </button>
  )
}

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
      { name: 'Home', href: '/' },
      { name: 'Services', href: '/services' },
      { name: 'Find a Therapist', href: '/therapists' },
      { name: 'Blog', href: '/blog' },
      { name: 'FAQs', href: '/faq' },
    ],
    resources: [
      { name: 'Mental Health Guides', href: '/guides' },
      { name: 'Self Help Tools', href: '/tools' },
      { name: 'Therapy Articles', href: '/articles' },
      { name: 'Privacy Policy', href: '/privacy' },
      { name: 'Terms of Service', href: '/terms' },
    ],
  }

  const socialLinks = [
    { icon: FiTwitter, href: 'https://twitter.com', label: 'Twitter' },
    { icon: FiInstagram, href: 'https://instagram.com', label: 'Instagram' },
    { icon: FiLinkedin, href: 'https://linkedin.com', label: 'LinkedIn' },
    { icon: FiFacebook, href: 'https://facebook.com', label: 'Facebook' },
  ]

  return (
    <footer className="relative bg-gradient-to-br from-indigo-950 via-slate-900 to-teal-950 text-slate-300 overflow-hidden">
      {/* Animated background shapes with softer professional glow */}
      <div className="absolute inset-0 pointer-events-none">
        <motion.div
          animate={{ scale: [1, 1.2, 1], x: [0, 30, -20, 0], y: [0, -20, 20, 0] }}
          transition={{ duration: 20, repeat: Infinity, repeatType: 'mirror' }}
          className="absolute top-[-150px] left-[-150px] w-[400px] h-[400px] bg-emerald-500/5 rounded-full blur-3xl"
        />
        <motion.div
          animate={{ scale: [1, 1.1, 1], x: [0, -30, 20, 0], y: [0, 20, -20, 0] }}
          transition={{ duration: 25, repeat: Infinity, repeatType: 'mirror' }}
          className="absolute bottom-[-150px] right-[-150px] w-[400px] h-[400px] bg-blue-500/5 rounded-full blur-3xl"
        />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-8 py-16">
        <div className="grid lg:grid-cols-5 md:grid-cols-2 gap-10">
          {/* Brand Column */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="lg:col-span-2"
          >
            <div className="flex items-center gap-2 mb-4">
              <Image
                src={'/logo.png'}
                width={180}
                height={120}
                alt="Center For Psychological Health logo"
                className="object-contain"
              />
            </div>
            <p className="text-sm text-slate-400 leading-relaxed max-w-md">
              A safe and supportive mental wellness platform connecting you with licensed therapists
              and tools for emotional well-being.
            </p>
            <div className="mt-5 flex items-center gap-2 text-teal-400 text-sm">
              <FiShield className="w-4 h-4" />
              100% Confidential & Secure
            </div>

            {/* Newsletter */}
            <div className="mt-6">
              <p className="text-sm font-medium text-white mb-2">Subscribe to our newsletter</p>
              <form onSubmit={handleSubscribe} className="flex gap-2">
                <Input
                  type="email"
                  placeholder="Your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="bg-white/5 border-slate-700 text-white focus:ring-teal-500"
                  required
                />
                <Button type="submit" className="px-3 bg-teal-600 hover:bg-teal-700">
                  <FiSend className="w-4 h-4" />
                </Button>
              </form>
              {subscribed && (
                <p className="text-xs text-teal-400 mt-2 animate-pulse">
                  Thanks! Youre subscribed.
                </p>
              )}
            </div>
          </motion.div>

          {/* Quick Links */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
          >
            <h3 className="text-white font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2 text-sm">
              {footerLinks.quick.map((item) => (
                <li key={item.name}>
                  <Link
                    href={item.href}
                    className="text-slate-400 hover:text-teal-300 transition-colors duration-200"
                  >
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Resources */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
          >
            <h3 className="text-white font-semibold mb-4">Resources</h3>
            <ul className="space-y-2 text-sm">
              {footerLinks.resources.map((item) => (
                <li key={item.name}>
                  <Link
                    href={item.href}
                    className="text-slate-400 hover:text-teal-300 transition-colors duration-200"
                  >
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Contact & Social */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
          >
            <h3 className="text-white font-semibold mb-4">Get in Touch</h3>
            <div className="space-y-3 text-sm">
              <div className="flex items-center gap-2">
                <FiMail className="w-4 h-4 text-teal-400" />
                <a href="mailto:support@serenemind.com" className="hover:text-teal-300 transition">
                  support@serenemind.com
                </a>
              </div>
              <div className="flex items-center gap-2">
                <FiPhone className="w-4 h-4 text-teal-400" />
                <a href="tel:+18001234567" className="hover:text-teal-300 transition">
                  +1 (800) 123-4567
                </a>
              </div>
              <div className="flex items-center gap-2">
                <FiMapPin className="w-4 h-4 text-teal-400" />
                <span>Available 24/7 – Online nationwide</span>
              </div>
            </div>

            {/* Social Icons */}
            <div className="flex items-center gap-4 mt-6">
              {socialLinks.map((social) => {
                const Icon = social.icon
                return (
                  <a
                    key={social.label}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-slate-400 hover:text-teal-300 transition-colors"
                    aria-label={social.label}
                  >
                    <Icon className="w-5 h-5" />
                  </a>
                )
              })}
            </div>
          </motion.div>
        </div>

        {/* Divider */}
        <div className="border-t border-slate-800 my-10" />

        {/* Bottom Section */}
        <div className="flex flex-col md:flex-row items-center justify-between text-sm text-slate-400 gap-4">
          <p>© {new Date().getFullYear()} SereneMind. All rights reserved.</p>
          <div className="flex gap-6">
            <Link href="/privacy" className="hover:text-teal-300 transition">
              Privacy Policy
            </Link>
            <Link href="/terms" className="hover:text-teal-300 transition">
              Terms
            </Link>
            <Link href="/cookies" className="hover:text-teal-300 transition">
              Cookies
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer
