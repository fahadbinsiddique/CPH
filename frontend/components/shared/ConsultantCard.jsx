import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { 
  MapPin, 
  Clock, 
  Star, 
  CheckCircle2, 
  Calendar, 
  Heart,
  ChevronRight,
  Sparkles,
  Shield
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

export default function ConsultantCard({ consultant }) {
  const {
    slug,
    user,
    specializations,
    experience_years,
    consultation_fee,
    profile_image,
    is_verified,
    is_available,
    location,
    rating = 4.9,
    total_sessions = 0,
  } = consultant;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -6 }}
      transition={{ duration: 0.3, ease: 'easeOut' }}
    >
      <Card className="group relative border border-slate-200/60 shadow-sm hover:shadow-xl hover:border-teal-500/20 transition-all duration-500 rounded-2xl overflow-hidden bg-white/80 backdrop-blur-sm h-full">
        
        {/* Decorative gradient overlay on hover */}
        <div className="absolute inset-0 bg-gradient-to-br from-teal-50/0 via-transparent to-teal-50/0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />
        
        {/* Top accent line */}
        <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-teal-400 via-emerald-400 to-teal-400 scale-x-0 group-hover:scale-x-100 transition-transform duration-700 origin-left" />

        <CardContent className="p-5 sm:p-6 relative z-10">
          
          {/* ================= TOP SECTION ================= */}
          <div className="flex items-start gap-4 mb-5">
            
            {/* Avatar - Premium with glow effect */}
            <div className="relative flex-shrink-0">
              <div className="relative w-24 h-24 sm:w-28 sm:h-28 rounded-2xl overflow-hidden bg-gradient-to-br from-teal-50 to-emerald-50 border-2 border-slate-100/80 shadow-md group-hover:shadow-teal-500/20 transition-all duration-300">
                {profile_image ? (
                  <Image
                    src={profile_image}
                    alt={user?.full_name || "Consultant"}
                    width={112}
                    height={112}
                    className="object-cover w-full h-full group-hover:scale-110 transition-transform duration-500"
                    priority
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-teal-600 font-bold text-3xl bg-gradient-to-br from-teal-100 to-emerald-100">
                    {user?.full_name?.charAt(0)}
                  </div>
                )}
                
                {/* Avatar glow ring */}
                <div className="absolute inset-0 rounded-2xl ring-1 ring-inset ring-white/20 group-hover:ring-teal-400/30 transition-all duration-300" />
              </div>
              
              {/* Availability Dot - Enhanced */}
              <div className="absolute -bottom-1 -right-1">
                <div className={`relative ${is_available ? 'animate-pulse' : ''}`}>
                  <span
                    className={`block w-4 h-4 rounded-full border-2 border-white shadow-lg ${
                      is_available 
                        ? 'bg-emerald-500 ring-2 ring-emerald-400/30' 
                        : 'bg-slate-300 ring-2 ring-slate-200/30'
                    }`}
                  />
                </div>
              </div>

             
            </div>

            {/* Name & Info */}
            <div className="flex-1 min-w-0 pt-1">
              
              {/* Name + Verified */}
              <div className="flex items-center gap-2 flex-wrap">
                <h3 className="font-bold text-slate-900 group-hover:text-teal-600 transition-colors truncate text-base sm:text-lg">
                  {user?.full_name}
                </h3>
                {is_verified && (
                  <CheckCircle2 className="w-4 h-4 text-teal-600 fill-teal-50 shrink-0" />
                )}
              </div>

              {/* Title / Specialty */}
              <p className="text-xs text-slate-500 truncate mt-0.5">
                {specializations?.[0]?.name || 'Mental Health Professional'}
              </p>

              {/* Specializations Chips */}
              <div className="flex flex-wrap gap-1 mt-1.5">
                {specializations?.slice(0, 2).map((s) => (
                  <Badge
                    key={s.id}
                    className="text-[10px] font-medium bg-slate-100/80 text-slate-600 px-2 py-0 border-none rounded-full"
                  >
                    {s.name}
                  </Badge>
                ))}
                {specializations?.length > 2 && (
                  <Badge className="text-[10px] font-medium bg-slate-100/80 text-slate-400 px-2 py-0 border-none rounded-full">
                    +{specializations.length - 2}
                  </Badge>
                )}
              </div>
            </div>
          </div>

          {/* ================= META INFO ================= */}
          <div className="grid grid-cols-2 gap-2 border-t border-b border-slate-100/80 py-3 mb-4">
            
            <div className="flex items-center gap-2 text-xs text-slate-500">
              <Clock className="w-3.5 h-3.5 text-teal-500 shrink-0" />
              <span className="truncate">{experience_years}+ Years</span>
            </div>

            {location && (
              <div className="flex items-center gap-2 text-xs text-slate-500">
                <MapPin className="w-3.5 h-3.5 text-teal-500 shrink-0" />
                <span className="truncate">{location}</span>
              </div>
            )}

            {total_sessions > 0 && (
              <div className="flex items-center gap-2 text-xs text-slate-500">
                <Calendar className="w-3.5 h-3.5 text-teal-500 shrink-0" />
                <span>{total_sessions}+ Sessions</span>
              </div>
            )}

          </div>

          {/* ================= PRICE & CTA ================= */}
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-baseline gap-1">
              <span className="text-xl font-bold text-slate-900">
                ৳{consultation_fee}
              </span>
              <span className="text-[11px] font-medium text-slate-400">
                / session
              </span>
            </div>
            
            {/* Availability Badge */}
            <Badge
              variant={is_available ? 'success' : 'secondary'}
              className={`text-[10px] font-medium rounded-full px-2.5 py-0.5 ${
                is_available
                  ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                  : 'bg-slate-100 text-slate-500'
              }`}
            >
              {is_available ? (
                <span className="flex items-center gap-1">
                  <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />
                  Available
                </span>
              ) : (
                'Unavailable'
              )}
            </Badge>
          </div>

          {/* ================= BUTTONS ================= */}
          <div className="flex gap-3">
            {/* View Profile - Outline */}
            <Link href={`/consultant/${slug}`} className="flex-1">
              <Button 
                variant="outline" 
                className="w-full rounded-xl border-slate-200 text-slate-600 hover:bg-slate-50 hover:border-teal-300 hover:text-teal-700 transition-all duration-300 text-sm font-medium h-11"
              >
                View Profile
              </Button>
            </Link>

            {/* Book Now - Primary Gradient */}
            <Link href={`/booking/${slug}`} className="flex-1">
              <Button 
                className="w-full rounded-xl bg-gradient-to-r from-teal-600 to-emerald-600 hover:from-teal-700 hover:to-emerald-700 text-white shadow-md shadow-teal-600/20 hover:shadow-lg hover:shadow-teal-600/30 transition-all duration-300 text-sm font-medium h-11 group/btn"
              >
                <span>Book Now</span>
                <ChevronRight className="w-4 h-4 ml-1 transition-transform group-hover/btn:translate-x-1" />
              </Button>
            </Link>
          </div>

          {/* Trust micro-badge */}
          <div className="mt-3 flex items-center justify-center gap-1 text-[10px] text-slate-400">
            <Sparkles className="w-3 h-3 text-teal-400" />
            <span>Secure booking • 100% confidential</span>
          </div>

        </CardContent>
      </Card>
    </motion.div>
  );
}