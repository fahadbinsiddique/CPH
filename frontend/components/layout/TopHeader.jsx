'use client';

import { Phone, Mail, Clock, MapPin, UserPlus, ChevronDown, ChevronUp } from 'lucide-react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useState } from 'react';
import { SOCIAL_LINKS } from '@/lib/social';
import { cn } from '@/lib/utils';

const TopHeader = () => {
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
    <div className="relative bg-gradient-to-r from-primary via-primary/90 to-accent text-on-primary overflow-hidden">
      {/* Subtle background pattern */}
      <div className="absolute inset-0 opacity-5 pointer-events-none">
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-accent/20 rounded-full blur-3xl" />
      </div>

      <div className="relative container mx-auto px-4 py-2">
        {/* Main Header Bar */}
        <div className="flex items-center justify-between gap-2 text-xs md:text-sm">
          {/* Left: Contact Info */}
          <div className="flex items-center gap-3 sm:gap-5">
            {/* Phone */}
            <Link
              href="tel:+8801762389523"
              className={cn(
                'flex items-center gap-1.5 transition-colors group',
                'text-on-primary/90 hover:text-on-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-primary rounded-lg'
              )}
            >
              <div className={cn(
                'p-1 rounded-full transition-colors',
                'bg-white/10 group-hover:bg-white/20'
              )}>
                <Phone size={12} className="text-on-primary/80" />
              </div>
              <span className="font-medium text-[11px] sm:text-xs md:text-sm">+880 1762-389523</span>
            </Link>

            {/* Email - Hidden on mobile */}
            <Link
              href="mailto:cfphuk@gmail.com"
              className={cn(
                'hidden sm:flex items-center gap-1.5 transition-colors group',
                'text-on-primary/90 hover:text-on-primary'
              )}
            >
              <div className={cn(
                'p-1 rounded-full transition-colors',
                'bg-white/10 group-hover:bg-white/20'
              )}>
                <Mail size={12} className="text-on-primary/80" />
              </div>
              <span className="font-medium text-[11px] sm:text-xs md:text-sm">cfphuk@gmail.com</span>
            </Link>

            {/* Hours - Visible on Large screens */}
            <div className="hidden lg:flex items-center gap-1.5 text-on-primary/80">
              <Clock size={12} className="text-on-primary/70" />
              <span className="text-xs">Sun-Thu: 9:00 AM - 8:00 PM</span>
            </div>
          </div>

          {/* Right: Location & Join Link */}
          <div className="flex items-center gap-2 sm:gap-4">
            {/* Location - Hidden on small mobile screens */}
            <div className="hidden md:flex items-center gap-1.5 text-on-primary/80 max-w-[280px] lg:max-w-[400px]">
              <MapPin size={12} className="text-on-primary/70 flex-shrink-0" />
              <span className="truncate text-xs">
                28/1 Green Corner (5th floor), Green Road, Dhanmondi 1205
              </span>
            </div>

            {/* Mobile Info Toggle Button */}
            <button
              onClick={() => setShowDetails((o) => !o)}
              className={cn(
                'md:hidden flex cursor-pointer items-center gap-1 text-xs rounded-md transition-colors',
                'bg-white/10 hover:bg-white/20 text-on-primary/90'
              )}
              aria-expanded={showDetails}
              aria-controls="mobile-info-details"
            >
              <span>Info</span>
              {showDetails ? <ChevronUp size={12} /> : <ChevronDown size={12} />}
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
                      'p-1.5 rounded-full transition-colors',
                      'bg-white/10 hover:bg-white/20 text-on-primary/70 hover:text-on-primary'
                    )}
                    aria-label={social.label}
                  >
                    <Icon size={13} />
                  </a>
                );
              })}
            </div>

            <span className="text-white/30 hidden sm:inline">|</span>

            {/* Join as Therapist Link — accent CTA */}
            <button
              type="button"
              onClick={handleJoinAsTherapist}
              className={cn(
                'flex cursor-pointer items-center gap-1.5 px-2.5 py-2 rounded-full transition-colors border focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-primary',
                'bg-accent text-on-accent border-accent/30 hover:brightness-95 hover:border-accent/50'
              )}
            >
              <UserPlus size={12} className="text-on-accent" />
              <span className="text-[11px] sm:text-xs font-medium whitespace-nowrap">
                Join as Therapist
              </span>
            </button>
          </div>
        </div>

        {/* Expandable Mobile View Details */}
        {showDetails && (
          <div id="mobile-info-details" className="md:hidden pt-2.5 mt-2 border-t border-white/10 flex flex-col gap-2 text-[11px] text-on-primary/90 animate-fadeIn">
            <div className="flex items-center gap-2 sm:hidden">
              <Mail size={12} className="text-on-primary/70 flex-shrink-0" />
              <span>cfphuk@gmail.com</span>
            </div>
            <div className="flex items-center gap-2 lg:hidden">
              <Clock size={12} className="text-on-primary/70 flex-shrink-0" />
              <span>Sun-Thu: 9:00 AM - 8:00 PM</span>
            </div>
            <div className="flex items-start gap-2">
              <MapPin size={12} className="text-on-primary/70 flex-shrink-0 mt-0.5" />
              <span>28/1 Green Corner (5th floor), Green Road, Dhanmondi 1205</span>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};

export default TopHeader;