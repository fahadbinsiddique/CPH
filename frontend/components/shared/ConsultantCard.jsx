'use client';

import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import {
  MapPin,
  Clock,
  CheckCircle2,
  Languages,
  ChevronRight,
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
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
    is_verified,
    is_available,
    location,
    languages,
  } = consultant;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, ease: 'easeOut' }}
      className="h-full"
    >
      <Card className="group relative flex h-full flex-col gap-0 overflow-hidden rounded-2xl border border-slate-200/60 bg-white p-0 py-0 shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:border-teal-500/30 hover:shadow-xl">

        <div className="relative h-52 w-full overflow-hidden bg-gradient-to-br from-teal-50 via-emerald-50 to-slate-100 sm:h-56">
          {profile_image ? (
            <Image
              src={profile_image}
              alt={user?.full_name ? `Portrait of ${user.full_name}` : 'Consultant portrait'}
              fill
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              className="object-cover object-top transition-transform duration-700 group-hover:scale-105"
              priority
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-teal-100/60 to-emerald-100/60">
              <div className="flex h-20 w-20 items-center justify-center rounded-full border border-teal-200/50 bg-white/80 shadow-inner backdrop-blur-sm">
                <span className="text-3xl font-extrabold text-teal-600">
                  {user?.full_name?.charAt(0) || 'C'}
                </span>
              </div>
            </div>
          )}

          {/* Bottom fade into body */}
          <div className="pointer-events-none absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-white via-white/40 to-transparent" />
              {/* Availability chip */}
          <div className="absolute left-3 top-3 z-10">
            <span
              className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[10px] font-semibold shadow-sm backdrop-blur-md ${
                is_available
                  ? 'border-emerald-200/60 bg-white/90 text-emerald-700'
                  : 'border-slate-200/60 bg-white/80 text-slate-600'
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
        </div>

        {/* ================= BODY ================= */}
        <div className="flex flex-1 flex-col p-5 pt-0 sm:p-6 sm:pt-0">
          {/* Name + Title */}
          <div className="relative -mt-5">
            <div className="flex flex-wrap items-center gap-2">
              <h3 className="text-lg font-bold leading-tight text-slate-900 transition-colors group-hover:text-teal-600">
                {user?.full_name}
              </h3>
              {is_verified && (
                <CheckCircle2 className="h-4 w-4 shrink-0 text-teal-600" />
              )}
            </div>
            <p className="mt-0.5 truncate text-xs text-slate-500">
              {specializations?.[0]?.name || 'Mental Health Professional'}
            </p>
          </div>

          {/* Specialization chips */}
          {specializations?.length > 0 && (
            <div className="mt-3 flex flex-wrap gap-1">
              {specializations.slice(0, 2).map((s) => (
                <Badge
                  key={s.id}
                  className="rounded-full border-none bg-slate-100 px-2 py-0 text-[10px] font-medium text-slate-600"
                >
                  {s.name}
                </Badge>
              ))}
              {specializations.length > 2 && (
                <Badge className="rounded-full border-none bg-slate-100 px-2 py-0 text-[10px] font-medium text-slate-400">
                  +{specializations.length - 2}
                </Badge>
              )}
            </div>
          )}

          {/* Meta strip */}
          <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-1.5 border-t border-slate-100 pt-4 text-xs text-slate-500">
            <span className="flex min-w-0 items-center gap-1.5">
              <Clock className="h-3.5 w-3.5 shrink-0 text-teal-500" />
              <span className="truncate">{experience_years} yrs</span>
            </span>

          </div>

          {/* Price */}
          <div className="mt-4 flex items-center justify-between">
            <div className="flex items-baseline gap-1">
              <span className="text-xl font-bold text-slate-900">
                ৳{consultation_fee}
              </span>
              <span className="text-[11px] font-medium text-slate-400">
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

          {/* Buttons — pushed to bottom so uneven content doesn't misalign cards in a grid */}
          <div className="mt-auto flex gap-3 pt-4">
            <Link href={`/consultant/${slug}`} className="flex-1">
              <Button
                variant="outline"
                className="h-11 w-full rounded-xl border-slate-200 text-sm font-medium text-slate-600 transition-all duration-300 hover:border-teal-300 hover:bg-slate-50 hover:text-teal-700"
              >
                View Profile
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
                className="group/btn h-11 w-full rounded-xl bg-gradient-to-r from-teal-600 to-emerald-600 text-sm font-medium text-white shadow-md shadow-teal-600/20 transition-all duration-300 hover:from-teal-700 hover:to-emerald-700 hover:shadow-lg hover:shadow-teal-600/30 disabled:cursor-not-allowed disabled:from-slate-200 disabled:to-slate-200 disabled:text-slate-400 disabled:shadow-none"
              >
                <span>{is_available ? 'Book Now' : 'Fully Booked'}</span>
                {is_available && (
                  <ChevronRight className="ml-1 h-4 w-4 transition-transform group-hover/btn:translate-x-1" />
                )}
              </Button>
            </Link>
          </div>
        </div>
      </Card>
    </motion.div>
  );
}