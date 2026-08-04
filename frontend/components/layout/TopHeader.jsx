'use client'

import { Phone, Mail, Clock, MapPin, Heart, Shield, Award } from 'lucide-react'
import Link from 'next/link'
import { useState } from 'react'

const TopHeader = () => {
  const [showFullAddress, setShowFullAddress] = useState(false)

  return (
    <div className="relative bg-gradient-to-r from-teal-900 via-teal-800 to-emerald-800 text-white overflow-hidden">
      {/* Subtle background pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-emerald-400/10 rounded-full blur-3xl" />
      </div>

      <div className="relative container mx-auto px-4 py-1.5 flex flex-wrap items-center justify-between gap-1 text-[11px] sm:text-xs md:text-sm">
        {/* Left: Contact Info */}
        <div className="flex items-center gap-3 sm:gap-5 flex-wrap">
          {/* Phone */}
          <Link 
            href="tel:+8801762389523" 
            className="flex items-center gap-1.5 hover:text-teal-200 transition-colors group"
          >
            <div className="p-1 rounded-full bg-white/10 group-hover:bg-white/20 transition-colors">
              <Phone size={11} className="text-teal-300" />
            </div>
            <span className=" xs:inline font-medium">+880 1762-389523</span>
          </Link>

          {/* Email - Hidden on smallest screens */}
          <Link 
            href="mailto:cfphuk@gmail.com" 
            className="hidden sm:flex items-center gap-1.5 hover:text-teal-200 transition-colors group"
          >
            <div className="p-1 rounded-full bg-white/10 group-hover:bg-white/20 transition-colors">
              <Mail size={11} className="text-teal-300" />
            </div>
            <span className="font-medium">cfphuk@gmail.com</span>
          </Link>

          {/* Hours - Hidden on tablet */}
          <div className="hidden lg:flex items-center gap-1.5 text-white/80">
            <Clock size={11} className="text-teal-300" />
            <span>Sun-Thu: 9:00 AM - 8:00 PM</span>
          </div>
        </div>

        {/* Right: Location & Emergency */}
        <div className="flex items-center gap-2 sm:gap-4">
          {/* Location - Hidden on mobile */}
          <div className="hidden md:flex items-center gap-1.5 text-white/70 max-w-[280px] lg:max-w-[400px]">
            <MapPin size={11} className="text-teal-300 flex-shrink-0" />
            <span className="truncate text-[10px] sm:text-xs">
              28/1 Green Corner (5th floor), Green Road, Dhanmondi 1205
            </span>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-white/30">|</span>
            
            

            {/* Trust Badge */}
            <div className="hidden lg:flex items-center gap-1 bg-white/5 px-2 py-0.5 rounded-full">
              <Shield size={10} className="text-emerald-300" />
              <span className="text-[9px] text-white/60 font-medium">HIPAA Compliant</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default TopHeader