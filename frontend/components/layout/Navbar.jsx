'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Menu, X, LogIn,
  LogOut, Settings, Calendar, LayoutDashboard, ChevronDown,
  Shield
} from 'lucide-react';
import Image from 'next/image';
import TopHeader from './TopHeader';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import LoginModal from '../auth/LoginModal';
import UserAvatar from '@/components/ui/user-avatar';
import RegisterModal from '../auth/RegisterModal';
import useAuthStore from '@/store/authStore';
import useUiStore from '@/store/uiStore';
import { cn } from '@/lib/utils';

const Navbar = ({ hasAccessToken }) => {
  const router = useRouter();
  const pathname = usePathname();
  const { user, logout, isAuthenticated, isHydrated } = useAuthStore();
  const { isLoginOpen, openLoginModal, closeLoginModal } = useUiStore();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [isRegisterOpen, setIsRegisterOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);
  const mobileMenuRef = useRef(null);

  // If server says no cookie exists, clear any stale Zustand state from localStorage.
  useEffect(() => {
    if (!hasAccessToken) {
      useAuthStore.setState({ user: null, isAuthenticated: false });
      useAuthStore.persist.clearStorage();
    }
  }, [hasAccessToken]);

  // Auth gate: server cookie is the source of truth.
  // - hasAccessToken=true  → always show Dashboard (cookie is valid)
  // - hasAccessToken=false → only trust Zustand after hydration, and only if
  //   it wasn't stale (cleared above). Before hydration, show Login (no flash).
  const isLoggedIn = hasAccessToken
    ? true
    : (isHydrated ? isAuthenticated : false);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
      if (mobileMenuRef.current && !mobileMenuRef.current.contains(event.target) && mobileMenuOpen) {
        setMobileMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [mobileMenuOpen]);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = mobileMenuOpen ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [mobileMenuOpen]);

  // Keyboard navigation for dropdown
  useEffect(() => {
    if (!dropdownOpen) return undefined;
    const handleKeyDown = (event) => {
      if (event.key === 'Escape') setDropdownOpen(false);
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [dropdownOpen]);

  // Single source for the desktop row AND the mobile menu. Task-oriented
  // labels over unchanged routes, so prefix active-matching still lights up
  // child pages (/assessment/result/…, /consultant/…, /blog/…). No '/'
  // entry: the logo is home, which frees the slot for Self-Assessment.
  const navLinks = [
    { name: 'Self-Assessment', href: '/assessment' },
    { name: 'Find a Therapist', href: '/consultant' },
    { name: 'Services', href: '/services' },
    { name: 'Resources', href: '/blog' },
    { name: 'About', href: '/about-us' },
    { name: 'Contact', href: '/contact' },
  ];

  const isActiveLink = (href) =>
    pathname === href || pathname?.startsWith(href);

  const handleAuth = (action) => {
    if (action === 'signin') {
      openLoginModal();
      setMobileMenuOpen(false);
    } else if (action === 'signup') {
      setIsRegisterOpen(true);
      setMobileMenuOpen(false);
    }
  };

  const handleLogout = async () => {
    await logout();
    router.push('/');
    setMobileMenuOpen(false);
    setDropdownOpen(false);
  };

  const handleDashboard = () => {
    router.push('/dashboard');
    setMobileMenuOpen(false);
    setDropdownOpen(false);
  };

  return (
    <header className="fixed top-0 left-0 w-full z-50 font-sans">
      {/* Skip link for keyboard users */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only fixed top-4 left-4 z-[100] px-4 py-2 bg-violet-600 text-white rounded-lg shadow-lg font-semibold transition-all"
      >
        Skip to main content
      </a>

      {/* Collapses the utility bar to zero height once the user scrolls —
          useHeaderHeight re-measures header.offsetHeight on scroll, so pages
          pinning content under the header follow automatically. */}
      <TopHeader collapsed={scrolled} />

      <nav
        ref={mobileMenuRef}
        className={cn(
          'transition-[background-color,box-shadow,padding,backdrop-filter] duration-300 border-b border-border/60',
          scrolled
            ? 'bg-background/95 backdrop-blur-xl shadow-soft py-2'
            : 'bg-background/85 backdrop-blur-xl py-3'
        )}
      >
        {/* max-w-7xl + px-6/px-8 matches every page section's shell. The old
            `container mx-auto px-4` capped at 1536px on 2xl, drifting ~250px
            away from section content on large screens. The lg grid keeps the
            link cluster optically centred (flex justify-between cannot);
            gap tightens at lg where six labels + two buttons must fit 1024px. */}
        <div className="mx-auto flex w-full max-w-7xl items-center justify-between gap-2 px-6 lg:grid lg:grid-cols-[1fr_auto_1fr] lg:px-8 xl:gap-4">
          {/* Logo — the wordmark is 5.33:1, so width (not max-h) drives its
              rendered height; 210px still lands under the button row height.
              At lg it drops to 150px purely to make room for six nav labels. */}
          <Link
            href="/"
            aria-label="Centre For Psychological Health — Home"
            className="flex shrink-0 items-center rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 lg:justify-self-start"
          >
            <Image
              src={'/logo1.png'}
              loading="eager"
              width={240}
              height={160}
              alt="Centre For Psychological Health"
              className="object-contain h-auto w-auto max-h-14 max-w-[170px] sm:max-w-[190px] md:max-w-[210px] lg:max-w-[150px] xl:max-w-[210px]"
              priority
            />
          </Link>

          {/* Desktop Navigation Links — padding (not gap) carries spacing at
              lg so the six-label row fits a 1024px viewport; 15px/16px text
              rather than the old 18px, which priced out at ~100px extra. */}
          <div className="hidden lg:flex items-center justify-center xl:gap-1 lg:justify-self-center">
            {navLinks.map((link) => {
              const isActive = isActiveLink(link.href);
              return (
                <Link
                  key={link.name}
                  href={link.href}
                  className={cn(
                    'relative px-2 py-2 text-[14px] xl:px-2.5 xl:text-base font-medium transition-colors duration-300 tracking-tight rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background',
                    // One active cue only (weight + colour + the spring bar);
                    // the old bg-primary/10 tint was a third competing signal.
                    isActive
                      ? 'text-violet-700 font-semibold'
                      : 'text-foreground hover:text-violet-700 hover:bg-violet-50'
                  )}
                >
                  {link.name}
                  {isActive && (
                    <motion.span
                      layoutId="activeNavIndicator"
                      className="absolute bottom-0 left-1/2 -translate-x-1/2 w-7 h-1 bg-violet-600 rounded-full"
                      transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                    />
                  )}
                </Link>
              );
            })}
          </div>

          {/* Desktop Auth / User Menu — Book a Session is THE filled CTA in
              both auth states (the clinic's conversion action). Dashboard
              moved into the avatar dropdown, where it already was item #1. */}
          <div className="hidden lg:flex items-center gap-2 xl:gap-3 lg:justify-self-end">
            {!isHydrated && !hasAccessToken ? (
              <div className="flex items-center gap-2 xl:gap-3" aria-hidden="true">
                <div className="h-10 w-16 bg-muted rounded-full animate-pulse" />
                <div className="h-10 w-36 bg-muted rounded-full animate-pulse" />
              </div>
            ) : isLoggedIn ? (
              <>
                {/* Book a Session — primary conversion CTA (btn-primary
                    recipe, pill radius for the nav row). */}
                <Link
                  href="/consultant"
                  className={cn(
                    'flex cursor-pointer items-center gap-2 whitespace-nowrap px-3.5 xl:px-5 py-2.5 rounded-full font-semibold text-sm transition-all active:scale-[0.98]',
                    'bg-violet-600 text-white shadow-md shadow-violet-900/10 hover:bg-violet-700 hover:shadow-lg hover:shadow-violet-900/15',
                    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-500 focus-visible:ring-offset-2 focus-visible:ring-offset-background'
                  )}
                >
                  <Calendar size={16} aria-hidden="true" />
                  Book a Session
                </Link>

                {/* Profile Dropdown */}
                <div className="relative" ref={dropdownRef}>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setDropdownOpen((o) => !o)}
                    aria-expanded={dropdownOpen}
                    aria-controls="profile-dropdown"
                    className={cn(
                      'flex cursor-pointer items-center gap-2 px-2 py-1 rounded-full border transition-all',
                      'bg-violet-50 border-border hover:border-violet-300 hover:bg-violet-100',
                      'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background'
                    )}
                  >
                    <UserAvatar
                      name={user?.full_name}
                      size="default"
                      className="h-8 w-8"
                    />
                    <span className="text-sm font-semibold text-foreground max-w-[100px] truncate">
                      {user?.full_name?.split(' ')[0]}
                    </span>
                    <ChevronDown
                      size={14}
                      aria-hidden="true"
                      className={cn(
                        'text-muted-foreground transition-transform duration-200',
                        dropdownOpen && 'rotate-180'
                      )}
                    />
                  </motion.button>

                  {/* Disclosure popover — no `role="menu"`: that pattern promises
                      arrow-key roving focus, which this doesn't implement. */}
                  <div
                    id="profile-dropdown"
                    className={cn(
                      'absolute right-0 z-50 mt-2 w-56 bg-card rounded-2xl shadow-float border border-border overflow-hidden transition-all duration-200',
                      dropdownOpen
                        ? 'visible opacity-100 translate-y-0'
                        : 'invisible opacity-0 -translate-y-1'
                    )}
                  >
                    <div className="p-3 border-b border-border">
                      <p className="text-sm font-bold text-foreground">{user?.full_name}</p>
                      <p className="text-xs text-muted-foreground">{user?.email}</p>
                      <span className="inline-block mt-1 text-[10px] font-semibold px-2 py-0.5 rounded-full bg-primary/10 text-violet-700 border border-primary/20 capitalize">
                        {user?.role || 'User'}
                      </span>
                    </div>
                    <div className="p-2 space-y-1">
                      <button
                        type="button"
                        onClick={handleDashboard}
                        className={cn(
                          'flex cursor-pointer items-center gap-3 w-full px-3 py-2 text-sm text-foreground hover:bg-violet-50 rounded-xl transition-colors',
                          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-inset'
                        )}
                      >
                        <LayoutDashboard size={16} className="text-muted-foreground" aria-hidden="true" />
                        Dashboard
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          router.push('/dashboard/profile');
                          setDropdownOpen(false);
                        }}
                        className={cn(
                          'flex cursor-pointer items-center gap-3 w-full px-3 py-2 text-sm text-foreground hover:bg-violet-50 rounded-xl transition-colors',
                          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-inset'
                        )}
                      >
                        <Settings size={16} className="text-muted-foreground" aria-hidden="true" />
                        Profile Settings
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          router.push('/dashboard/bookings');
                          setDropdownOpen(false);
                        }}
                        className={cn(
                          'flex cursor-pointer items-center gap-3 w-full px-3 py-2 text-sm text-foreground hover:bg-violet-50 rounded-xl transition-colors',
                          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-inset'
                        )}
                      >
                        <Calendar size={16} className="text-muted-foreground" aria-hidden="true" />
                        My Appointments
                      </button>
                      <hr className="my-1 border-border" />
                      <button
                        type="button"
                        onClick={() => {
                          handleLogout();
                          setDropdownOpen(false);
                        }}
                        className={cn(
                          'flex cursor-pointer items-center gap-3 w-full px-3 py-2 text-sm text-destructive hover:bg-destructive/10 rounded-xl transition-colors',
                          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-destructive focus-visible:ring-inset'
                        )}
                      >
                        <LogOut size={16} aria-hidden="true" />
                        Sign Out
                      </button>
                    </div>
                  </div>
                </div>
              </>
            ) : (
              <>
                {/* Log in stays ghost — Book a Session owns the fill.
                    Registration left the navbar deliberately: it happens
                    in flow (LoginModal → RegisterModal, and when booking
                    forces account creation). */}
                <motion.button
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={() => handleAuth('signin')}
                  className={cn(
                    'flex cursor-pointer items-center whitespace-nowrap px-3 xl:px-4 py-2.5 rounded-full font-semibold text-sm transition-all',
                    'text-foreground/75 hover:text-violet-700 hover:bg-violet-50',
                    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-inset'
                  )}
                >
                  Log in
                </motion.button>

                <Link
                  href="/consultant"
                  className={cn(
                    'flex cursor-pointer items-center gap-2 whitespace-nowrap px-3.5 xl:px-5 py-2.5 rounded-full font-semibold text-sm transition-all active:scale-[0.98]',
                    'bg-violet-600 text-white shadow-md shadow-violet-900/10 hover:bg-violet-700 hover:shadow-lg hover:shadow-violet-900/15',
                    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-500 focus-visible:ring-offset-2 focus-visible:ring-offset-background'
                  )}
                >
                  <Calendar size={16} aria-hidden="true" />
                  Book a Session
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu Toggle */}
          <button
            type="button"
            className={cn(
              'lg:hidden cursor-pointer text-foreground focus:outline-none p-2 hover:bg-violet-50 hover:text-violet-700 rounded-xl transition-colors',
              'focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background'
            )}
            onClick={() => setMobileMenuOpen((o) => !o)}
            aria-label="Toggle menu"
            aria-expanded={mobileMenuOpen}
            aria-controls="mobile-menu"
          >
            {mobileMenuOpen ? <X size={28} aria-hidden="true" /> : <Menu size={28} aria-hidden="true" />}
          </button>
        </div>

        {/* Mobile Menu Dropdown — no `role="navigation"`: this sits inside the
            parent <nav>, so the extra role created a duplicate landmark.
            max-h subtracts the whole fixed header while idle (TopHeader
            ≈ 3rem + nav row ≈ 4.5rem ≈ 7.5rem) or the last items were pushed
            past the locked viewport; it stays valid when the utility bar has
            already collapsed on scroll (only over-subtracts). */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              id="mobile-menu"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3, ease: 'easeInOut' }}
              className="lg:hidden bg-card border-t border-border shadow-float overflow-x-hidden overflow-y-auto max-h-[calc(100dvh-7.5rem)] overscroll-contain"
            >
              <div className="mx-auto w-full max-w-7xl px-6 py-6 flex flex-col gap-3">
                {/* User info if authenticated */}
                {isLoggedIn && (
                  <div className="flex items-center gap-3 pb-4 mb-2 border-b border-border">
                    <UserAvatar
                      name={user?.full_name}
                      size="xl"
                      className="h-14 w-14 shadow-md"
                    />
                    <div>
                      <p className="font-heading font-bold text-foreground text-base">{user?.full_name}</p>
                      <p className="text-xs text-muted-foreground">{user?.email}</p>
                      <span className="inline-block mt-0.5 text-[10px] font-semibold px-2 py-0.5 rounded-full bg-primary/10 text-violet-700 border border-primary/20 capitalize">
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
                    className={cn(
                      'text-base font-semibold py-2.5 px-3 rounded-xl transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-inset',
                      // border-l-4 marks active on mobile instead of the
                      // desktop bar, but both now use the same violet-600.
                      isActiveLink(link.href)
                        ? 'text-violet-700 bg-violet-50 border-l-4 border-violet-600'
                        : 'text-foreground hover:text-violet-700 hover:bg-violet-50'
                    )}
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    {link.name}
                  </Link>
                ))}

                {/* Mobile Auth / User Actions */}
                <div className="flex flex-col gap-3 mt-4 pt-4 border-t border-border">
                  {!isHydrated && !hasAccessToken ? (
                    <div
                      className="h-12 w-full bg-muted rounded-xl animate-pulse"
                      aria-hidden="true"
                    />
                  ) : isLoggedIn ? (
                    <>
                      <Link
                        href="/consultant"
                        onClick={() => setMobileMenuOpen(false)}
                        className={cn(
                          'flex items-center justify-center gap-2 w-full py-3.5 rounded-xl transition-all font-bold text-base',
                          'bg-violet-600 text-white shadow-md shadow-violet-900/10 hover:bg-violet-700 hover:shadow-lg',
                          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-500 focus-visible:ring-offset-2 focus-visible:ring-offset-background'
                        )}
                      >
                        <Calendar size={18} aria-hidden="true" />
                        Book a Session
                      </Link>
                      <button
                        type="button"
                        onClick={handleDashboard}
                        className={cn(
                          'flex cursor-pointer items-center justify-center gap-2 w-full py-3.5 rounded-xl transition-all font-semibold text-base',
                          'border border-violet-300 text-violet-700 hover:bg-violet-50',
                          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background'
                        )}
                      >
                        <LayoutDashboard size={18} aria-hidden="true" />
                        Dashboard
                      </button>
                      <button
                        type="button"
                        onClick={handleLogout}
                        className={cn(
                          'flex cursor-pointer items-center justify-center gap-2 w-full py-3.5 rounded-xl transition-all font-semibold text-base',
                          'border border-destructive/50 text-destructive hover:bg-destructive/10',
                          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-destructive focus-visible:ring-offset-2 focus-visible:ring-offset-background'
                        )}
                      >
                        <LogOut size={18} aria-hidden="true" />
                        Sign Out
                      </button>
                    </>
                  ) : (
                    <>
                      <Link
                        href="/consultant"
                        onClick={() => setMobileMenuOpen(false)}
                        className={cn(
                          'flex items-center justify-center gap-2 w-full py-3.5 rounded-xl transition-all font-bold text-base',
                          'bg-violet-600 text-white shadow-md shadow-violet-900/10 hover:bg-violet-700 hover:shadow-lg',
                          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-500 focus-visible:ring-offset-2 focus-visible:ring-offset-background'
                        )}
                      >
                        <Calendar size={18} aria-hidden="true" />
                        Book a Session
                      </Link>
                      <button
                        type="button"
                        onClick={() => handleAuth('signin')}
                        className={cn(
                          'flex cursor-pointer items-center justify-center gap-2 w-full py-3.5 rounded-xl transition-all font-semibold text-base',
                          'border border-violet-300 text-violet-700 hover:bg-violet-50',
                          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background'
                        )}
                      >
                        <LogIn size={18} aria-hidden="true" />
                        Log in
                      </button>
                    </>
                  )}
                </div>

                {/* Mobile Footer */}
                <div className="mt-2 pt-3 border-t border-border flex items-center justify-between text-xs text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <Shield size={12} className="text-primary" />
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
            closeLoginModal();
            setIsRegisterOpen(true);
          }}
        />
        <RegisterModal
          isOpen={isRegisterOpen}
          setIsOpen={setIsRegisterOpen}
          onSuccessRedirect={() => {
            openLoginModal();
          }}
        />
      </nav>
    </header>
  );
};

export default Navbar;