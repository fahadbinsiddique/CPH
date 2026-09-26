'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Menu, X, LogIn, UserPlus,
  LogOut, Settings, Calendar, LayoutDashboard, ChevronDown,
  User, Sparkles, Shield
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

  const navLinks = [
    { name: 'Home', href: '/', id: 'home' },
    { name: 'Consultants', href: '/consultant', id: 'consultant' },
    { name: 'Services', href: '/services', id: 'services' },
    { name: 'Blog', href: '/blog', id: 'blog' },
    { name: 'About', href: '/about-us', id: 'about-us' },
  ];

  const isActiveLink = (href, id) => {
    if (href === '/') {
      return pathname === '/';
    }
    return pathname?.startsWith(href) || pathname === href;
  };

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

  const handleNavigation = (href) => {
    router.push(href);
    setMobileMenuOpen(false);
  };

  return (
    <header className="fixed top-0 left-0 w-full z-50 font-sans">
      {/* Skip link for keyboard users */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only fixed top-4 left-4 z-[100] px-4 py-2 bg-primary text-on-primary rounded-lg shadow-lg font-semibold transition-all"
      >
        Skip to main content
      </a>

      <TopHeader />

      <nav
        ref={mobileMenuRef}
        className={cn(
          'transition-all duration-300 border-b border-border',
          scrolled
            ? 'bg-background/95 backdrop-blur-md shadow-lg py-2'
            : 'bg-background/98 backdrop-blur-sm py-3'
        )}
      >
        <div className="container mx-auto px-4 flex items-center justify-between">
          {/* Logo */}
          <Link
            href="/"
            aria-label="Centre For Psychological Health — Home"
            className="flex items-center rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
          >
            <Image
              src={'/logo1.png'}
              loading="eager"
              width={240}
              height={160}
              alt="Centre For Psychological Health"
              className="object-contain h-auto w-auto max-h-16 max-w-[160px] sm:max-w-[180px] md:max-h-20 md:max-w-[200px]"
              priority
            />
          </Link>

          {/* Desktop Navigation Links */}
          <div className="hidden lg:flex items-center gap-1 xl:gap-6">
            {navLinks.map((link) => {
              const isActive = isActiveLink(link.href, link.id);
              return (
                <Link
                  key={link.name}
                  href={link.href}
                  className={cn(
                    'relative px-3 py-2 text-base xl:text-lg transition-all duration-300 tracking-tight rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
                    isActive
                      ? 'text-primary font-bold bg-primary/10'
                      : 'text-foreground font-medium hover:text-primary hover:bg-muted'
                  )}
                >
                  {link.name}
                  {isActive && (
                    <motion.span
                      layoutId="activeNavIndicator"
                      className="absolute bottom-0 left-1/2 -translate-x-1/2 w-8 h-1 bg-gradient-to-r from-primary to-accent rounded-full"
                      transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                    />
                  )}
                </Link>
              );
            })}
          </div>

          {/* Desktop Auth / User Menu */}
          <div className="hidden lg:flex items-center gap-3">
            {!isHydrated && !hasAccessToken ? (
              <div className="h-10 w-24 bg-muted rounded-full animate-pulse" />
            ) : isLoggedIn ? (
              <>
                {/* Dashboard Button — primary CTA */}
                <motion.button
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={handleDashboard}
                  className={cn(
                    'flex cursor-pointer items-center gap-2 px-4 py-2.5 rounded-full border-2 transition-all font-semibold text-sm',
                    'bg-primary text-on-primary border-primary/30 hover:brightness-95 hover:border-primary/50'
                  )}
                >
                  <LayoutDashboard size={16} />
                  Dashboard
                </motion.button>

                {/* Profile Dropdown */}
                <div className="relative" ref={dropdownRef}>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setDropdownOpen((o) => !o)}
                    aria-haspopup="menu"
                    aria-expanded={dropdownOpen}
                    aria-controls="profile-dropdown"
                    className={cn(
                      'flex cursor-pointer items-center gap-2 px-2 py-1 rounded-full border-2 transition-all',
                      'bg-muted border-border hover:border-primary/30 hover:bg-primary/10'
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
                      className={cn(
                        'text-muted-foreground transition-transform duration-200',
                        dropdownOpen && 'rotate-180'
                      )}
                    />
                  </motion.button>

                  {/* Dropdown Menu — accessible */}
                  <div
                    id="profile-dropdown"
                    role="menu"
                    className={cn(
                      'absolute right-0 z-50 mt-2 w-56 bg-card rounded-2xl shadow-xl border border-border overflow-hidden transition-all duration-200',
                      dropdownOpen
                        ? 'visible opacity-100 translate-y-0'
                        : 'invisible opacity-0 -translate-y-1'
                    )}
                  >
                    <div className="p-3 border-b border-border">
                      <p className="text-sm font-bold text-foreground">{user?.full_name}</p>
                      <p className="text-xs text-muted-foreground">{user?.email}</p>
                      <span className="inline-block mt-1 text-[10px] font-semibold px-2 py-0.5 rounded-full bg-primary/10 text-primary border border-primary/20 capitalize">
                        {user?.role || 'User'}
                      </span>
                    </div>
                    <div className="p-2 space-y-1">
                      <button
                        role="menuitem"
                        onClick={handleDashboard}
                        className="flex cursor-pointer items-center gap-3 w-full px-3 py-2 text-sm text-foreground hover:bg-muted rounded-xl transition-all"
                      >
                        <LayoutDashboard size={16} className="text-muted-foreground" />
                        Dashboard
                      </button>
                      <button
                        role="menuitem"
                        onClick={() => {
                          router.push('/dashboard/profile');
                          setDropdownOpen(false);
                        }}
                        className="flex cursor-pointer items-center gap-3 w-full px-3 py-2 text-sm text-foreground hover:bg-muted rounded-xl transition-all"
                      >
                        <Settings size={16} className="text-muted-foreground" />
                        Profile Settings
                      </button>
                      <button
                        role="menuitem"
                        onClick={() => {
                          router.push('/dashboard/bookings');
                          setDropdownOpen(false);
                        }}
                        className="flex cursor-pointer items-center gap-3 w-full px-3 py-2 text-sm text-foreground hover:bg-muted rounded-xl transition-all"
                      >
                        <Calendar size={16} className="text-muted-foreground" />
                        My Appointments
                      </button>
                      <hr className="my-1 border-border" />
                      <button
                        role="menuitem"
                        onClick={() => {
                          handleLogout();
                          setDropdownOpen(false);
                        }}
                        className="flex cursor-pointer items-center gap-3 w-full px-3 py-2 text-sm text-destructive hover:bg-destructive/10 rounded-xl transition-all"
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
                  className={cn(
                    'flex cursor-pointer items-center gap-2 px-5 py-2.5 rounded-full border-2 font-semibold text-sm transition-all shadow-sm',
                    'border-primary text-primary hover:bg-primary/10'
                  )}
                >
                  <LogIn size={16} />
                  Login
                </motion.button>

                <motion.button
                  whileHover={{ scale: 1.03, y: -1 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={() => handleAuth('signup')}
                  className={cn(
                    'flex cursor-pointer items-center gap-2 px-5 py-2.5 rounded-full font-bold text-sm transition-all',
                    'bg-accent text-on-accent shadow-md shadow-accent/20 hover:brightness-95 hover:shadow-lg'
                  )}
                >
                  <UserPlus size={16} />
                  Sign Up
                </motion.button>
              </>
            )}
          </div>

          {/* Mobile Menu Toggle */}
          <button
            className={cn(
              'lg:hidden cursor-pointer text-foreground focus:outline-none p-2 hover:bg-muted rounded-xl transition-all focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2'
            )}
            onClick={() => setMobileMenuOpen((o) => !o)}
            aria-label="Toggle menu"
            aria-expanded={mobileMenuOpen}
            aria-controls="mobile-menu"
          >
            {mobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
          </button>
        </div>

        {/* Mobile Menu Dropdown */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              id="mobile-menu"
              role="navigation"
              aria-label="Mobile navigation"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3, ease: 'easeInOut' }}
              className="lg:hidden bg-card border-t border-border shadow-2xl overflow-x-hidden overflow-y-auto max-h-[calc(100dvh-4.5rem)]"
            >
              <div className="container mx-auto px-4 py-6 flex flex-col gap-3">
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
                      <span className="inline-block mt-0.5 text-[10px] font-semibold px-2 py-0.5 rounded-full bg-primary/10 text-primary border border-primary/20 capitalize">
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
                      'text-base font-semibold py-2.5 px-3 rounded-xl transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
                      isActiveLink(link.href, link.id)
                        ? 'text-primary bg-primary/10 border-l-4 border-primary'
                        : 'text-foreground hover:text-primary hover:bg-muted'
                    )}
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    {link.name}
                  </Link>
                ))}

                {/* Mobile Auth / User Actions */}
                <div className="flex flex-col gap-3 mt-4 pt-4 border-t border-border">
                  {!isHydrated && !hasAccessToken ? (
                    <div className="h-12 w-full bg-muted rounded-xl animate-pulse" />
                  ) : isLoggedIn ? (
                    <>
                      <button
                        onClick={handleDashboard}
                        className={cn(
                          'flex cursor-pointer items-center justify-center gap-2 w-full py-3.5 rounded-xl transition-all font-bold text-base',
                          'bg-primary text-on-primary hover:brightness-95'
                        )}
                      >
                        <LayoutDashboard size={18} />
                        Dashboard
                      </button>
                      <button
                        onClick={handleLogout}
                        className={cn(
                          'flex cursor-pointer items-center justify-center gap-2 w-full border-2 py-3.5 rounded-xl transition-all font-semibold text-base',
                          'border-destructive text-destructive hover:bg-destructive/10'
                        )}
                      >
                        <LogOut size={18} />
                        Sign Out
                      </button>
                    </>
                  ) : (
                    <>
                      <button
                        onClick={() => handleAuth('signin')}
                        className={cn(
                          'flex cursor-pointer items-center justify-center gap-2 w-full border-2 py-3.5 rounded-xl transition-all font-semibold text-base',
                          'border-primary text-primary hover:bg-primary/10'
                        )}
                      >
                        <LogIn size={18} />
                        Login
                      </button>
                      <button
                        onClick={() => handleAuth('signup')}
                        className={cn(
                          'flex cursor-pointer items-center justify-center gap-2 w-full py-3.5 rounded-xl transition-all font-bold text-base',
                          'bg-accent text-on-accent hover:brightness-95'
                        )}
                      >
                        <UserPlus size={18} />
                        Sign Up
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