'use client'

import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Menu, X, LogIn, UserPlus, 
  LogOut, Settings, Heart, 
  Calendar, LayoutDashboard, ChevronDown,
  User, Sparkles, Shield
} from 'lucide-react'
import Image from 'next/image'
import TopHeader from './TopHeader'
import { useRouter, usePathname } from 'next/navigation'
import Link from 'next/link'
import LoginModal from '../auth/LoginModal'
import UserAvatar from '@/components/ui/user-avatar'
import RegisterModal from '../auth/RegisterModal'
import useAuthStore from '@/store/authStore'
import useUiStore from '@/store/uiStore'

const Navbar = () => {
  const router = useRouter()
  const pathname = usePathname()
  const { user, logout, isAuthenticated, isHydrated } = useAuthStore()
  const { isLoginOpen, openLoginModal, closeLoginModal } = useUiStore()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [isRegisterOpen, setIsRegisterOpen] = useState(false)
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const dropdownRef = useRef(null)

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  // Scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // Lock body scroll while the mobile menu is open
  useEffect(() => {
    document.body.style.overflow = mobileMenuOpen ? 'hidden' : ''
    return () => {
      document.body.style.overflow = ''
    }
  }, [mobileMenuOpen])

  const navLinks = [
    { name: 'Home', href: '/', id: 'home' },
    { name: 'Consultants', href: '/consultant', id: 'consultant' },
    { name: 'Services', href: '/services', id: 'services' },
    { name: 'Blog', href: '/blog', id: 'blog' },
    { name: 'About', href: '/about-us', id: 'about-us' },
  ]

  // Check if link is active
  const isActiveLink = (href, id) => {
    if (href === '/') {
      return pathname === '/'
    }
    return pathname?.startsWith(href) || pathname === href
  }

  const handleAuth = (action) => {
    if (action === 'signin') {
      openLoginModal()
      setMobileMenuOpen(false)
    } else if (action === 'signup') {
      setIsRegisterOpen(true)
      setMobileMenuOpen(false)
    }
  }

  const handleLogout = async () => {
    await logout()
    router.push('/')
    setMobileMenuOpen(false)
    setDropdownOpen(false)
  }

  const handleDashboard = () => {
    router.push('/dashboard')
    setMobileMenuOpen(false)
    setDropdownOpen(false)
  }

  const handleNavigation = (href) => {
    router.push(href)
    setMobileMenuOpen(false)
  }

  return (
    <header className="fixed top-0 left-0 w-full z-50 font-sans">
      <TopHeader />

      <nav
        className={`transition-all duration-300 ${
          scrolled
            ? 'bg-white/95 backdrop-blur-md shadow-lg py-2'
            : 'bg-white/98 backdrop-blur-sm py-3'
        } border-b border-stone-200/80`}
      >
        <div className="container mx-auto px-4 flex items-center justify-between">
          {/* Logo */}
          <Link
            href="/"
            aria-label="Centre For Psychological Health — Home"
            className="flex items-center rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-500 focus-visible:ring-offset-2"
          >
            <Image
              src={'/logo1.png'}
              loading="eager"
              width={240}
              height={160}
              alt="Centre For Psychological Health"
              className="object-contain h-auto w-auto max-h-20 max-w-[180px] sm:max-w-[220px] md:max-h-24 md:max-w-[260px]"
              priority
            />
          </Link>

          {/* Desktop Navigation Links */}
          <div className="hidden lg:flex items-center gap-1 xl:gap-8">
            {navLinks.map((link) => {
              const isActive = isActiveLink(link.href, link.id)
              return (
                <Link
                  key={link.name}
                  href={link.href}
                  className={`relative px-3 py-2 text-base xl:text-lg transition-all duration-300 hover:text-teal-600 tracking-tight rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-500 focus-visible:ring-offset-2 ${
                    isActive
                      ? 'text-teal-700 font-bold bg-teal-50/50'
                      : 'text-stone-700 font-medium hover:bg-stone-50'
                  }`}
                >
                  {link.name}
                  {isActive && (
                    <motion.span
                      layoutId="activeNavIndicator"
                      className="absolute bottom-0 left-1/2 -translate-x-1/2 w-6 h-0.5 bg-gradient-to-r from-teal-600 to-emerald-600 rounded-full"
                      transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                    />
                  )}
                </Link>
              )
            })}
          </div>

          {/* Desktop Auth / User Menu */}
          <div className="hidden lg:flex items-center gap-3">
            {!isHydrated ? (
              <div className="h-10 w-24 bg-stone-100 rounded-full animate-pulse" />
            ) : isAuthenticated ? (
              <>
                {/* Dashboard Button */}
                <motion.button
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={handleDashboard}
                  className="flex cursor-pointer items-center gap-2 px-4 py-2.5 rounded-full border-2 border-stone-200 text-stone-700 hover:border-teal-300 hover:bg-teal-50 transition-all font-semibold text-sm"
                >
                  <LayoutDashboard size={16} />
                  Dashboard
                </motion.button>

                {/* Profile Dropdown */}
                   <div className="relative group">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="flex cursor-pointer items-center gap-2 px-2 py-1 rounded-full bg-gradient-to-r from-teal-50 to-emerald-50 border-2 border-teal-200 hover:border-teal-400 transition-all"
                  >
                    <UserAvatar
                      name={user?.full_name}
                      size="default"
                      className="h-8 w-8"
                    />
                    <span className="text-sm font-semibold text-stone-700 max-w-[100px] truncate">
                      {user?.full_name?.split(' ')[0]}
                    </span>
                    <ChevronDown size={14} className={`text-stone-400 transition-transform duration-200 ${dropdownOpen ? 'rotate-180' : ''}`} />
                  </motion.button>

                  {/* Dropdown Menu */}
                  <div className="absolute right-0 mt-2 w-56 bg-white rounded-2xl shadow-xl border border-stone-200/60 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 overflow-hidden">
                    <div className="p-3 border-b border-stone-100">
                      <p className="text-sm font-bold text-stone-800">{user?.full_name}</p>
                      <p className="text-xs text-stone-500">{user?.email}</p>
                      <span className="inline-block mt-1 text-[10px] font-semibold px-2 py-0.5 rounded-full bg-teal-50 text-teal-700 border border-teal-200 capitalize">
                        {user?.role || 'User'}
                      </span>
                    </div>
                    <div className="p-2 space-y-1">
                      <button
                        onClick={handleDashboard}
                        className="flex cursor-pointer items-center gap-3 w-full px-3 py-2 text-sm text-stone-700 hover:bg-stone-50 rounded-xl transition-all"
                      >
                        <LayoutDashboard size={16} className="text-stone-400" />
                        Dashboard
                      </button>
                      <button
                        onClick={() => router.push('/dashboard/profile')}
                        className="flex cursor-pointer items-center gap-3 w-full px-3 py-2 text-sm text-stone-700 hover:bg-stone-50 rounded-xl transition-all"
                      >
                        <Settings size={16} className="text-stone-400" />
                        Profile Settings
                      </button>
                      <button
                        onClick={() => router.push('/dashboard/bookings')}
                        className="flex cursor-pointer items-center gap-3 w-full px-3 py-2 text-sm text-stone-700 hover:bg-stone-50 rounded-xl transition-all"
                      >
                        <Calendar size={16} className="text-stone-400" />
                        My Appointments
                      </button>
                      <hr className="my-1 border-stone-100" />
                      <button
                        onClick={handleLogout}
                        className="flex cursor-pointer items-center gap-3 w-full px-3 py-2 text-sm text-rose-600 hover:bg-rose-50 rounded-xl transition-all"
                      >
                        <LogOut size={16} />
                        Sign Out
                      </button>
                    </div>
                  </div>
                </div>
              </>
            ) : (
              <>
                <motion.button
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={() => handleAuth('signin')}
                  className="flex cursor-pointer items-center gap-2 px-5 py-2.5 rounded-full border-2 border-teal-600 text-teal-700 hover:bg-teal-50 transition-all font-semibold text-sm shadow-sm"
                >
                  <LogIn size={16} />
                  Login
                </motion.button>

                <motion.button
                  whileHover={{ scale: 1.03, y: -1 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={() => handleAuth('signup')}
                  className="flex cursor-pointer items-center gap-2 px-5 py-2.5 rounded-full bg-gradient-to-r from-teal-600 to-emerald-600 text-white font-bold text-sm shadow-md shadow-teal-600/20 hover:shadow-lg hover:shadow-teal-600/30 transition-all"
                >
                  <UserPlus size={16} />
                  Sign Up
                </motion.button>
              </>
            )}
          </div>

          {/* Mobile Menu Toggle */}
          <button
            className="lg:hidden cursor-pointer text-stone-700 focus:outline-none p-2 hover:bg-stone-50 rounded-xl transition-all focus-visible:ring-2 focus-visible:ring-teal-500 focus-visible:ring-offset-2"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle menu"
            aria-expanded={mobileMenuOpen}
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
              transition={{ duration: 0.3, ease: 'easeInOut' }}
              className="lg:hidden bg-white border-t border-stone-100 shadow-2xl overflow-x-hidden overflow-y-auto max-h-[calc(100dvh-7rem)]"
            >
              <div className="container mx-auto px-4 py-6 flex flex-col gap-3">
                {/* User info if authenticated */}
                {isAuthenticated && (
                  <div className="flex items-center gap-3 pb-4 mb-2 border-b border-stone-100">
                    <UserAvatar
                      name={user?.full_name}
                      size="xl"
                      className="h-14 w-14 shadow-md"
                    />
                    <div>
                      <p className="font-bold text-stone-800 text-base">{user?.full_name}</p>
                      <p className="text-xs text-stone-500">{user?.email}</p>
                      <span className="inline-block mt-0.5 text-[10px] font-semibold px-2 py-0.5 rounded-full bg-teal-50 text-teal-700 border border-teal-200 capitalize">
                        {user?.role || 'User'}
                      </span>
                    </div>
                  </div>
                )}

                {/* Navigation Links */}
                {navLinks.map((link) => (
                  <Link
                    key={link.name}
                    href={link.href}
                    className={`text-base font-semibold py-2.5 px-3 rounded-xl transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-500 ${
                      isActiveLink(link.href, link.id)
                        ? 'text-teal-700 bg-teal-50 border-l-4 border-teal-500'
                        : 'text-stone-700 hover:text-teal-600 hover:bg-stone-50'
                    }`}
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    {link.name}
                  </Link>
                ))}

                {/* Mobile Auth / User Actions */}
                <div className="flex flex-col gap-3 mt-4 pt-4 border-t border-stone-100">
                  {!isHydrated ? (
                    <div className="h-12 w-full bg-stone-100 rounded-xl animate-pulse" />
                  ) : isAuthenticated ? (
                    <>
                      <button
                        onClick={handleDashboard}
                        className="flex cursor-pointer items-center justify-center gap-2 w-full bg-gradient-to-r from-teal-600 to-emerald-600 text-white py-3.5 rounded-xl hover:shadow-lg transition-all font-bold text-base"
                      >
                        <LayoutDashboard size={18} />
                        Dashboard
                      </button>
                      <button
                        onClick={handleLogout}
                        className="flex cursor-pointer items-center justify-center gap-2 w-full border-2 border-rose-600 text-rose-600 py-3.5 rounded-xl hover:bg-rose-50 transition-all font-semibold text-base"
                      >
                        <LogOut size={18} />
                        Sign Out
                      </button>
                    </>
                  ) : (
                    <>
                      <button
                        onClick={() => handleAuth('signin')}
                        className="flex cursor-pointer items-center justify-center gap-2 w-full border-2 border-teal-600 text-teal-700 py-3.5 rounded-xl hover:bg-teal-50 transition-all font-semibold text-base"
                      >
                        <LogIn size={18} />
                        Login
                      </button>
                      <button
                        onClick={() => handleAuth('signup')}
                        className="flex cursor-pointer items-center justify-center gap-2 w-full bg-gradient-to-r from-teal-600 to-emerald-600 text-white py-3.5 rounded-xl hover:shadow-lg transition-all font-bold text-base"
                      >
                        <UserPlus size={18} />
                        Sign Up
                      </button>
                    </>
                  )}
                </div>

                {/* Mobile Footer */}
                <div className="mt-2 pt-3 border-t border-stone-100 flex items-center justify-between text-xs text-stone-400">
                  <span className="flex items-center gap-1">
                    <Shield size={12} className="text-teal-400" />
                    Secure
                  </span>
                  <span>© {new Date().getFullYear()} CPH</span>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <LoginModal
          isOpen={isLoginOpen}
          setIsOpen={closeLoginModal}
          onRedirect={() => {
            closeLoginModal()
            setIsRegisterOpen(true)
          }}
        />
        <RegisterModal
          isOpen={isRegisterOpen}
          setIsOpen={setIsRegisterOpen}
          onSuccessRedirect={() => {
            openLoginModal()
          }}
        />
      </nav>
    </header>
  )
}

export default Navbar