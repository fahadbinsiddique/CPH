'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Menu, X, LogIn, UserPlus } from 'lucide-react'
import Image from 'next/image'
import TopHeader from './TopHeader' // adjust import path as needed
import { useRouter } from 'next/navigation'
import Link from 'next/link'

const Navbar = () => {
  const router = useRouter()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [activeSection, setActiveSection] = useState('')

  // Add shadow on scroll & track active section
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10)

      // Track active section for nav highlighting
      const sections = ['features', 'therapists', 'testimonials', 'faq', 'blog']
      const scrollPosition = window.scrollY + 200
      for (const section of sections) {
        const element = document.getElementById(section)
        if (element) {
          const { offsetTop, offsetHeight } = element
          if (scrollPosition >= offsetTop && scrollPosition < offsetTop + offsetHeight) {
            setActiveSection(section)
            break
          }
        }
      }
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const navLinks = [
    { name: 'Features', href: '#features', id: 'features' },
    { name: 'Consultants', href: '/consultant', id: 'consultant' },
    { name: 'Testimonials', href: '#testimonials', id: 'testimonials' },
    { name: 'Blog', href: '#faq', id: 'faq' },
    { name: 'About', href: '#blog', id: 'blog' },
  ]

  

  const handleAuth = (action) => {
    console.log(`${action} clicked`)
  }

  return (
    <header className="fixed top-0 left-0 w-full z-50 font-sans">
      {/* Top Header Component (Our lean, passive version) */}
      <TopHeader />

      {/* Main Navigation Bar */}
      <nav
        className={`transition-all duration-300 ${
          scrolled
            ? 'bg-white backdrop-blur-md shadow-md py-2'
            : 'bg-white/90 backdrop-blur-sm py-4'
        } border-b border-slate-200/80`}
      >
        <div className="container mx-auto px-4 flex items-center justify-between">
          {/* Logo */}
          <motion.div
            whileHover={{ scale: 1.01 }}
            className="flex items-center gap-2 cursor-pointer"
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          >
            <Link href={'/'}>
            <Image
              src={'/logo.jpg'}
              loading='eager'
              width={300}
              height={200}
              alt="Center For Psychological Health logo"
              className="object-contain"
              />
              </Link>
          </motion.div>

          {/* Desktop Navigation Links */}
          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
          
                className={`relative text-xl transition-all duration-300 hover:text-teal-600 tracking-tight ${
                  activeSection === link.id
                    ? 'text-teal-700 font-bold after:absolute after:bottom-[-6px] after:left-0 after:w-full after:h-[3px] after:bg-teal-600 after:rounded-full after:scale-x-100'
                    : 'text-slate-800 font-semibold after:absolute after:bottom-[-6px] after:left-0 after:w-full after:h-[3px] after:bg-teal-600 after:rounded-full after:scale-x-0 after:transition-transform after:duration-300 hover:after:scale-x-100'
                }`}
              >
                {link.name}
              </Link>
            ))}
          </div>

          {/* Desktop Auth Buttons (More Dominant) */}
          <div className="hidden md:flex items-center gap-4">
            {/* Sign In button */}
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => handleAuth('signin')}
              className="flex items-center gap-2 px-5 py-2.5 rounded-full border-2 border-teal-600 text-teal-700 hover:bg-teal-50 transition-all font-semibold text-base shadow-sm"
            >
              <LogIn size={16} className="stroke-[2.5]" />
              Sign In
            </motion.button>

            {/* Sign Up button (Primary CTA) */}
            <motion.button
              whileHover={{ scale: 1.02, y: -1 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => handleAuth('signup')}
              /* 
                FIX: 
                - border এবং শ্যাডো বুস্ট করা হয়েছে (shadow-teal-100)।
                - font-bold এবং টেক্সট ট্র্যাকিং ইমপ্রুভ করা হয়েছে।
              */
              className="flex items-center gap-2 px-5 py-[12px] rounded-full bg-gradient-to-r from-teal-600 to-emerald-600 text-white font-bold text-base shadow-md shadow-teal-600/10 hover:shadow-lg hover:shadow-teal-600/20 transition-all"
            >
              <UserPlus size={16} className="stroke-[2.5]" />
              Sign Up
            </motion.button>
          </div>

          {/* Mobile Menu Toggle */}
          <button
            className="md:hidden text-slate-800 focus:outline-none"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
          </button>
        </div>

        {/* Mobile Menu Dropdown */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
              className="md:hidden bg-white border-t border-slate-100 shadow-xl overflow-hidden"
            >
              <div className="container mx-auto px-4 py-6 flex flex-col gap-4">
                {navLinks.map((link) => (
                  <a
                    key={link.name}
                    href={link.href}
                    onClick={(e) => {
                      e.preventDefault()
                      handleLinkClick(link.href, link.id)
                    }}
                    className={`text-lg font-semibold py-2 transition-all duration-200 ${
                      activeSection === link.id
                        ? 'text-teal-600 border-l-4 border-teal-500 pl-3'
                        : 'text-slate-800 hover:text-teal-600 hover:pl-3'
                    }`}
                  >
                    {link.name}
                  </a>
                ))}

                {/* Mobile Auth Buttons */}
                <div className="flex flex-col sm:flex-row gap-3 mt-4 pt-4 border-t border-slate-100">
                  <button
                    onClick={() => handleAuth('signin')}
                    className="flex items-center justify-center gap-2 w-full border-2 border-teal-600 text-teal-700 py-2.5 rounded-full hover:bg-teal-50 transition-all font-semibold"
                  >
                    <LogIn size={16} className="stroke-[2.5]" />
                    Sign In
                  </button>
                  <button
                    onClick={() => handleAuth('signup')}
                    className="flex items-center justify-center gap-2 w-full bg-gradient-to-r from-teal-600 to-emerald-600 text-white py-2.5 rounded-full hover:shadow-lg transition-all font-bold"
                  >
                    <UserPlus size={16} className="stroke-[2.5]" />
                    Sign Up
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>
    </header>
  )
}

export default Navbar