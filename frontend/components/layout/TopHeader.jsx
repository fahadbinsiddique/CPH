'use client';

import { Phone, Mail, Clock, MapPin, UserPlus, ChevronDown, ChevronUp } from 'lucide-react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useState } from 'react';
import { SOCIAL_LINKS } from '@/lib/social';
import { cn } from '@/lib/utils';

// Deep-violet utility bar (brand #4c1d95) instead of the saturated #8b5cf6
// surface: same palette, far calmer at full width, and lavender text clears
// 8:1 contrast on it. Collapses to zero height while the page is scrolled so
// only the main nav row stays pinned (useHeaderHeight re-measures on scroll,
// so pages tracking the header offset follow automatically).
const TopHeader = ({ collapsed = false }) => {
  const [showDetails, setShowDetails] = useState(false);
  const router = useRouter();
  const pathname = usePathname();

  // Opens the route-aware "Join as a Therapist" modal over the current page
  // without a full page navigation (the intercepting route renders the modal).
  const handleJoinAsTherapist = () => {
    if (pathname === '/join-as-therapist') return;
    router.push('/join-as-therapist', { scroll: false });
  };

  return (
    <div
      className={cn(
        'relative overflow-hidden bg-violet-900 text-violet-100',
        // visibility (not display) so collapsed links leave the tab order;
        // it interpolates "visible" until the collapse finishes.
        'transition-[max-height,opacity,visibility] duration-300 ease-in-out',
        collapsed ? 'max-h-0 invisible opacity-0' : 'max-h-64 visible opacity-100'
      )}
    >
      {/* px-5 on the smallest screens: this row carries phone + Info + Join
          and runs tight at 360px. From sm up it aligns with the nav row and
          every page section (max-w-7xl). */}
      <div className="relative mx-auto w-full max-w-7xl px-5 py-2 sm:px-6 lg:px-8">
        {/* Main Header Bar */}
        <div className="flex items-center justify-between gap-2 text-xs md:text-sm">
          {/* Left: Contact Info */}
          <div className="flex items-center gap-3 sm:gap-5">
            {/* Phone */}
            {/* Focus rings are violet-300 on violet-900: `ring-ring` (#8b5cf6)
                is nearly this bar's own colour and was invisible on it. */}
            <Link
              href="tel:+8801762389523"
              className={cn(
                'group flex items-center gap-1.5 rounded-lg transition-colors',
                'text-violet-100/90 hover:text-white',
                'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-300 focus-visible:ring-offset-2 focus-visible:ring-offset-violet-900'
              )}
            >
              <div className={cn(
                'rounded-full p-1 transition-colors',
                'bg-white/10 group-hover:bg-white/20'
              )}>
                <Phone size={12} className="text-violet-100/90" aria-hidden="true" />
              </div>
              {/* nowrap: single-value chip — under lg squeeze it was
                  breaking the number onto three lines. */}
              <span className="font-medium text-[11px] sm:text-xs md:text-sm whitespace-nowrap">+880 1762-389523</span>
            </Link>

            {/* Email - Hidden on mobile */}
            <Link
              href="mailto:cfphuk@gmail.com"
              className={cn(
                'group hidden sm:flex items-center gap-1.5 rounded-lg transition-colors',
                'text-violet-100/90 hover:text-white',
                'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-300 focus-visible:ring-offset-2 focus-visible:ring-offset-violet-900'
              )}
            >
              <div className={cn(
                'rounded-full p-1 transition-colors',
                'bg-white/10 group-hover:bg-white/20'
              )}>
                <Mail size={12} className="text-violet-100/90" aria-hidden="true" />
              </div>
              <span className="font-medium text-[11px] sm:text-xs md:text-sm whitespace-nowrap">cfphuk@gmail.com</span>
            </Link>

            {/* Hours — xl only: at lg the left cluster (phone + email) plus
                the address + Join pill left no room, so this chip wrapped to
                five lines and inflated the whole bar. Under md the details
                panel carries it (md–lg shows neither, as before). */}
            <div className="hidden xl:flex items-center gap-1.5 text-violet-100/80 whitespace-nowrap">
              <Clock size={12} className="text-violet-100/80" aria-hidden="true" />
              <span className="text-xs">Sun-Thu: 9:00 AM - 8:00 PM</span>
            </div>
          </div>

          {/* Right: Location & Join Link */}
          <div className="flex items-center gap-2 sm:gap-4">
            {/* Location - Hidden on small mobile screens */}
            <div className="hidden md:flex items-center gap-1.5 text-violet-100/80 max-w-[280px] lg:max-w-[400px]">
              <MapPin size={12} className="text-violet-100/80 flex-shrink-0" aria-hidden="true" />
              <span className="truncate text-xs">
                28/1 Green Corner (5th floor), Green Road, Dhanmondi 1205
              </span>
            </div>

            {/* Mobile Info Toggle Button */}
            <button
              type="button"
              onClick={() => setShowDetails((o) => !o)}
              className={cn(
                'md:hidden flex cursor-pointer items-center gap-1 rounded-md px-1.5 py-1 text-xs transition-colors',
                'bg-white/10 hover:bg-white/20 text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-300 focus-visible:ring-offset-2 focus-visible:ring-offset-violet-900'
              )}
              aria-expanded={showDetails}
              aria-controls="mobile-info-details"
            >
              <span>Info</span>
              {showDetails ? (
                <ChevronUp size={12} aria-hidden="true" />
              ) : (
                <ChevronDown size={12} aria-hidden="true" />
              )}
            </button>

            {/* Social Icons - Desktop */}
            <div className="hidden md:flex items-center gap-1.5">
              {SOCIAL_LINKS.map((social) => {
                const Icon = social.icon;
                return (
                  <a
                    key={social.label}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={cn(
                      'rounded-full p-1.5 transition-colors',
                      'bg-white/10 hover:bg-white/20 text-violet-100/90 hover:text-white',
                      'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-300 focus-visible:ring-offset-2 focus-visible:ring-offset-violet-900'
                    )}
                    aria-label={social.label}
                  >
                    <Icon size={13} aria-hidden="true" />
                  </a>
                );
              })}
            </div>

            {/* Hairline divider — a text "|" sat on the text baseline and read
                as a stray character at small sizes. */}
            <span
              className="hidden h-4 w-px bg-white/25 sm:block"
              aria-hidden="true"
            />

            {/* Join as Therapist — the bar's single CTA. White-on-violet-900
                (~9:1) replaces the emerald pill, which needed a white hairline
                to be visible at all against the old #8b5cf6 surface. */}
            <button
              type="button"
              onClick={handleJoinAsTherapist}
              className={cn(
                'flex cursor-pointer items-center gap-1.5 rounded-full px-2.5 py-2 transition-all',
                'bg-white text-violet-900 shadow-sm hover:bg-violet-50 active:scale-[0.98]',
                'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-300 focus-visible:ring-offset-2 focus-visible:ring-offset-violet-900'
              )}
            >
              <UserPlus size={12} className="text-violet-700" aria-hidden="true" />
              <span className="text-[11px] sm:text-xs font-semibold whitespace-nowrap">
                Join as Therapist
              </span>
            </button>
          </div>
        </div>

        {/* Expandable Mobile View Details — always mounted so the toggle's
            aria-controls resolves even while collapsed. Swapping display
            none/block is what re-triggers animate-fade-in on each open. */}
        <div
          id="mobile-info-details"
          className={cn(
            'md:hidden pt-2.5 mt-2 border-t border-white/15 flex flex-col gap-2 text-xs text-violet-100/90 animate-fade-in',
            !showDetails && 'hidden'
          )}
        >
          <div className="flex items-center gap-2 sm:hidden">
            <Mail size={12} className="text-violet-100/80 flex-shrink-0" aria-hidden="true" />
            <span>cfphuk@gmail.com</span>
          </div>
          <div className="flex items-center gap-2 xl:hidden">
            <Clock size={12} className="text-violet-100/80 flex-shrink-0" aria-hidden="true" />
            <span>Sun-Thu: 9:00 AM - 8:00 PM</span>
          </div>
          <div className="flex items-start gap-2">
            <MapPin
              size={12}
              className="text-violet-100/80 flex-shrink-0 mt-0.5"
              aria-hidden="true"
            />
            <span>28/1 Green Corner (5th floor), Green Road, Dhanmondi 1205</span>
          </div>
        </div>

      </div>
    </div>
  );
};

export default TopHeader;
