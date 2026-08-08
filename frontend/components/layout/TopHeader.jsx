'use client'

import { Phone, Mail, Clock, MapPin, UserPlus, ChevronDown, ChevronUp } from 'lucide-react'
import Link from 'next/link'
import { useState } from 'react'

const TopHeader = () => {
  const [showDetails, setShowDetails] = useState(false)

  return (
    <div className="relative bg-gradient-to-r from-teal-900 via-teal-800 to-emerald-800 text-white overflow-hidden">
      {/* Subtle background pattern */}
      <div className="absolute inset-0 opacity-5 pointer-events-none">
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-emerald-400/10 rounded-full blur-3xl" />
      </div>

      <div className="relative container mx-auto px-4 py-2">
        {/* Main Header Bar */}
        <div className="flex items-center justify-between gap-2 text-xs md:text-sm">
          
          {/* Left: Contact Info */}
          <div className="flex items-center gap-3 sm:gap-5">
            {/* Phone */}
            <Link 
              href="tel:+8801762389523" 
              className="flex items-center gap-1.5 hover:text-teal-200 transition-colors group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/40 rounded-lg"
            >
              <div className="p-1 rounded-full bg-white/10 group-hover:bg-white/20 transition-colors">
                <Phone size={12} className="text-teal-300" />
              </div>
              <span className="font-medium text-[11px] sm:text-xs md:text-sm">+880 1762-389523</span>
            </Link>

            {/* Email - Hidden on mobile */}
            <Link 
              href="mailto:cfphuk@gmail.com" 
              className="hidden sm:flex items-center gap-1.5 hover:text-teal-200 transition-colors group"
            >
              <div className="p-1 rounded-full bg-white/10 group-hover:bg-white/20 transition-colors">
                <Mail size={12} className="text-teal-300" />
              </div>
              <span className="font-medium text-[11px] sm:text-xs md:text-sm">cfphuk@gmail.com</span>
            </Link>

            {/* Hours - Visible on Large screens */}
            <div className="hidden lg:flex items-center gap-1.5 text-white/80">
              <Clock size={12} className="text-teal-300" />
              <span className="text-xs">Sun-Thu: 9:00 AM - 8:00 PM</span>
            </div>
          </div>

          {/* Right: Location & Join Link */}
          <div className="flex items-center gap-2 sm:gap-4">
            {/* Location - Hidden on small mobile screens */}
            <div className="hidden md:flex items-center gap-1.5 text-white/80 max-w-[280px] lg:max-w-[400px]">
              <MapPin size={12} className="text-teal-300 flex-shrink-0" />
              <span className="truncate text-xs">
                28/1 Green Corner (5th floor), Green Road, Dhanmondi 1205
              </span>
            </div>

            {/* Mobile Info Toggle Button */}
            <button
              onClick={() => setShowDetails(!showDetails)}
              className="md:hidden flex items-center gap-1 text-[11px] bg-white/10 px-2 py-1 rounded-md text-teal-200 hover:bg-white/20 transition-colors"
              aria-expanded={showDetails}
            >
              <span>Info</span>
              {showDetails ? <ChevronUp size={12} /> : <ChevronDown size={12} />}
            </button>

            <span className="text-white/30 hidden sm:inline">|</span>

            {/* Join as Therapist Link */}
            <Link
              href="/join-as-therapist"
              className="flex items-center gap-1.5 bg-emerald-600/60 hover:bg-emerald-600/80 px-2.5 py-1 rounded-full transition-colors border border-emerald-400/30"
            >
              <UserPlus size={12} className="text-emerald-200" />
              <span className="text-[11px] sm:text-xs text-white font-medium whitespace-nowrap">
                Join as Therapist
              </span>
            </Link>
          </div>
        </div>

        {/* Expandable Mobile View Details */}
        {showDetails && (
          <div className="md:hidden pt-2.5 mt-2 border-t border-white/10 flex flex-col gap-2 text-[11px] text-white/90 animate-fadeIn">
            <div className="flex items-center gap-2 sm:hidden">
              <Mail size={12} className="text-teal-300 flex-shrink-0" />
              <span>cfphuk@gmail.com</span>
            </div>
            <div className="flex items-center gap-2 lg:hidden">
              <Clock size={12} className="text-teal-300 flex-shrink-0" />
              <span>Sun-Thu: 9:00 AM - 8:00 PM</span>
            </div>
            <div className="flex items-start gap-2">
              <MapPin size={12} className="text-teal-300 flex-shrink-0 mt-0.5" />
              <span>28/1 Green Corner (5th floor), Green Road, Dhanmondi 1205</span>
            </div>
          </div>
        )}

      </div>
    </div>
  )
}

export default TopHeader