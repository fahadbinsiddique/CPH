'use client';

import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { Clock, ChevronRight } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import useAuthStore from '@/store/authStore';
import { requireLogin } from '@/lib/authGate';

export default function ConsultantCard({ consultant }) {
  const { isAuthenticated } = useAuthStore();
  const {
    slug,
    user,
    specializations,
    experience_years,
    consultation_fee,
    profile_image,
    is_available,
  } = consultant;

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, ease: 'easeOut' }}
      className="h-full"
    >
      {/* h-full এবং flex flex-col */}
      <div className="group flex h-full flex-col overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-teal-300 hover:shadow-md">
        
        {/* IMAGE CONTAINER  */}
        <div className="relative h-56 w-full shrink-0 overflow-hidden bg-slate-100/80 sm:h-60">
          {profile_image ? (
            <Image
              src={profile_image}
              alt={user?.full_name ? `Portrait of ${user.full_name}` : 'Consultant portrait'}
              fill
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
              className="object-contain object-bottom p-2 transition-transform duration-500 group-hover:scale-105"
              priority
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-teal-50 to-emerald-100">
              <div className="flex h-16 w-16 items-center justify-center rounded-full border border-teal-200 bg-white/90 shadow-sm">
                <span className="text-2xl font-bold text-teal-600">
                  {user?.full_name?.charAt(0) || 'C'}
                </span>
              </div>
            </div>
          )}

          {/* Availability Chip Badge */}
          <div className="absolute left-3 top-3 z-10">
            <span
              className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-[10px] font-semibold shadow-sm backdrop-blur-md ${
                is_available
                  ? 'border-emerald-200/80 bg-white/90 text-emerald-700'
                  : 'border-slate-200/80 bg-white/80 text-slate-600'
              }`}
            >
              <span
                className={`h-1.5 w-1.5 rounded-full ${
                  is_available ? 'animate-pulse bg-emerald-500' : 'bg-slate-400'
                }`}
              />
              {is_available ? 'Available' : 'Unavailable'}
            </span>
          </div>

          <div className="pointer-events-none absolute inset-x-0 bottom-0 h-10 bg-gradient-to-t from-white/80 to-transparent" />
        </div>

        {/*  (flex-1 ensures full height alignment) */}
        <div className="flex flex-1 flex-col p-4 sm:p-5">
          {/* Name & Title */}
          <div>
            <h3 className="line-clamp-1 text-base font-bold text-slate-900 transition-colors group-hover:text-teal-600">
              {user?.full_name}
            </h3>
            <p className="mt-0.5 truncate text-xs font-medium text-slate-500">
              {specializations?.[0]?.name || 'Mental Health Professional'}
            </p>
          </div>

          {/* Specialization Chips with Fixed Height Box */}
         
          <div className="mt-2.5 flex min-h-[42px] flex-wrap items-start content-start gap-1">
            {specializations?.length > 0 ? (
              <>
                {specializations.slice(0, 2).map((s) => (
                  <Badge
                    key={s.id}
                    className="rounded-md border-none bg-slate-100 px-2 py-0.5 text-[10px] font-medium text-slate-600 shadow-none"
                  >
                    {s.name}
                  </Badge>
                ))}
                {specializations.length > 2 && (
                  <Badge className="rounded-md border-none bg-slate-100 px-2 py-0.5 text-[10px] font-medium text-slate-400 shadow-none">
                    +{specializations.length - 2}
                  </Badge>
                )}
              </>
            ) : null}
          </div>

          {/* Meta Info (Experience) */}
          <div className="mt-2 flex items-center gap-1.5 border-t border-slate-100 pt-2.5 text-xs font-medium text-slate-500">
            <Clock className="h-3.5 w-3.5 text-teal-500 shrink-0" />
            <span>{experience_years} Years Experience</span>
          </div>

          {/* Price & Booking Status */}
          <div className="mt-2.5 flex items-center justify-between">
            <div className="flex items-baseline gap-1">
              <span className="text-lg font-bold text-slate-900">
                ৳{consultation_fee}
              </span>
              <span className="text-[10px] font-medium text-slate-400">
                / session
              </span>
            </div>
            <span
              className={`text-[10px] font-semibold ${
                is_available ? 'text-emerald-600' : 'text-slate-400'
              }`}
            >
              {is_available ? 'Accepting bookings' : 'Not available'}
            </span>
          </div>

          
          <div className="mt-auto flex gap-2 pt-4">
            <Link href={`/consultant/${slug}`} className="flex-1">
              <Button
                variant="outline"
                className="h-9 w-full rounded-xl border-slate-200 text-xs font-semibold text-slate-700 transition-colors hover:border-teal-300 hover:bg-slate-50 hover:text-teal-700"
              >
                Profile
              </Button>
            </Link>
            <Link
              href={`/booking/${slug}`}
              className="flex-1"
              onClick={(e) => {
                if (!isAuthenticated) {
                  e.preventDefault();
                  requireLogin({ resumePath: `/booking/${slug}` });
                }
              }}
            >
              <Button
                disabled={!is_available}
                className="group/btn h-9 w-full rounded-xl bg-teal-600 text-xs font-semibold text-white shadow-sm transition-all hover:bg-teal-700 disabled:cursor-not-allowed disabled:bg-slate-200 disabled:text-slate-400"
              >
                <span>{is_available ? 'Book Now' : 'Booked'}</span>
                {is_available && (
                  <ChevronRight className="ml-1 h-3.5 w-3.5 transition-transform group-hover/btn:translate-x-0.5" />
                )}
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </motion.div>
  );
}