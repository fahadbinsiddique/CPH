'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Menu, X, LogIn, UserPlus } from 'lucide-react'
import Image from 'next/image'
import TopHeader from './TopHeader' // adjust import path as needed

const Navbar = () => {
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
    { name: 'Consultants', href: '#therapists', id: 'therapists' },
    { name: 'Testimonials', href: '#testimonials', id: 'testimonials' },
    { name: 'Blog', href: '#faq', id: 'faq' },
    { name: 'About', href: '#blog', id: 'blog' },
  ]

  const handleLinkClick = (href, id) => {
    setMobileMenuOpen(false)
    const element = document.querySelector(href)
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' })
      setActiveSection(id)
    }
  }

  const handleAuth = (action) => {
    console.log(`${action} clicked`)
    // Replace with your auth logic (e.g., router.push(`/auth/${action}`))
  }

  return (
    <header className="fixed top-0 left-0 w-full z-50 font-sans ">
      {/* Top Header Component */}
      <TopHeader />

      {/* Main Navigation Bar */}
      <nav
        className={`transition-all duration-300 ${
          scrolled ? 'bg-white/80 backdrop-blur-md shadow-lg' : 'bg-white/60 backdrop-blur-sm'
        } border-b border-white/20`}
      >
        <div className="container mx-auto px-4 py-3 flex items-center justify-between">
          {/* Logo */}
          <motion.div
            whileHover={{ scale: 1.02 }}
            className="flex items-center gap-2 cursor-pointer"
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          >
            <Image
              src={'/logo.jpg'}
              width={180}
              height={120}
              alt="Center For Psychological Health logo"
              className="object-contain"
            />
          </motion.div>

          {/* Desktop Navigation Links */}
          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                onClick={(e) => {
                  e.preventDefault()
                  handleLinkClick(link.href, link.id)
                }}
                className={`relative text-gray-700 font-medium text-xl transition-all duration-300 hover:text-teal-600 ${
                  activeSection === link.id
                    ? 'text-teal-600 after:absolute after:bottom-[-4px] after:left-0 after:w-full after:h-0.5 after:bg-teal-500 after:rounded-full after:scale-x-100'
                    : 'after:absolute after:bottom-[-4px] after:left-0 after:w-full after:h-0.5 after:bg-teal-500 after:rounded-full after:scale-x-0 after:transition-transform after:duration-300 hover:after:scale-x-100'
                }`}
              >
                {link.name}
              </a>
            ))}
          </div>

          {/* Desktop Auth Buttons */}
          <div className="hidden md:flex items-center gap-3">
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => handleAuth('signin')}
              className="flex items-center gap-2 px-5 py-2.5 rounded-full border border-teal-300 text-teal-600 hover:bg-teal-50 hover:border-teal-400 transition-all font-medium shadow-sm"
            >
              <LogIn size={16} />
              Sign In
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => handleAuth('signup')}
              className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-gradient-to-r from-teal-600 to-emerald-600 text-white font-medium shadow-md hover:shadow-lg transition-all"
            >
              <UserPlus size={16} />
              Sign Up
            </motion.button>
          </div>

          {/* Mobile Menu Toggle */}
          <button
            className="md:hidden text-gray-700 focus:outline-none"
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
              className="md:hidden bg-white/95 backdrop-blur-lg border-t border-gray-100 shadow-xl overflow-hidden"
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
                    className={`text-gray-800 font-medium py-2 transition-all duration-200 ${
                      activeSection === link.id
                        ? 'text-teal-600 border-l-4 border-teal-500 pl-3'
                        : 'hover:text-teal-600 hover:pl-3'
                    }`}
                  >
                    {link.name}
                  </a>
                ))}

                {/* Mobile Auth Buttons */}
                <div className="flex flex-col sm:flex-row gap-3 mt-4 pt-4 border-t border-gray-100">
                  <button
                    onClick={() => handleAuth('signin')}
                    className="flex items-center justify-center gap-2 w-full border border-teal-300 text-teal-600 py-2.5 rounded-full hover:bg-teal-50 transition-all font-medium"
                  >
                    <LogIn size={16} />
                    Sign In
                  </button>
                  <button
                    onClick={() => handleAuth('signup')}
                    className="flex items-center justify-center gap-2 w-full bg-gradient-to-r from-teal-600 to-emerald-600 text-white py-2.5 rounded-full hover:shadow-lg transition-all font-medium"
                  >
                    <UserPlus size={16} />
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
