import Link from 'next/link';
import Image from 'next/image';
import { MapPin, Clock, Star, CheckCircle2 } from 'lucide-react';
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
  } = consultant;

  const cloudName = "ds8pqfvld";

  const fullImageUrl = profile_image
    ? `https://res.cloudinary.com/${cloudName}/${profile_image}`
    : null;

  return (
    <Card className="group relative border border-slate-200/60 shadow-sm hover:shadow-xl hover:border-teal-500/20 transition-all duration-300 rounded-2xl overflow-hidden bg-white">

      <CardContent className="p-4 sm:p-5">

        {/* ================= TOP ================= */}
        <div className="flex items-start gap-4 mb-4">

          {/* Avatar (BIGGER + PREMIUM) */}
          <div className="relative flex-shrink-0">

            <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl overflow-hidden bg-teal-50 border border-slate-100 shadow-sm">

              {fullImageUrl ? (
                <Image
                  src={fullImageUrl}
                  alt={user?.full_name || "Consultant"}
                  width={96}
                  height={96}
                  className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-300"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-teal-600 font-bold text-xl">
                  {user?.full_name?.charAt(0)}
                </div>
              )}

            </div>

            {/* Online Dot */}
            <span
              className={`absolute bottom-1 right-1 w-3.5 h-3.5 rounded-full border-2 border-white shadow-sm ${
                is_available ? 'bg-emerald-500' : 'bg-slate-300'
              }`}
            />
          </div>

          {/* Info */}
          <div className="flex-1 min-w-0">

            {/* Name + Verified */}
            <div className="flex items-center gap-2 flex-wrap">

              <h3 className="font-bold text-slate-900 group-hover:text-teal-600 transition-colors truncate text-base">
                {user?.full_name}
              </h3>

              {is_verified && (
                <CheckCircle2 className="w-4 h-4 text-teal-600 fill-teal-50" />
              )}

            </div>

            {/* Specializations */}
            <div className="flex flex-wrap gap-1 mt-1">
              {specializations?.slice(0, 2).map((s) => (
                <Badge
                  key={s.id}
                  className="text-[10px] bg-slate-100 text-slate-500 px-2 py-0 border-none"
                >
                  {s.name}
                </Badge>
              ))}
            </div>

          </div>
        </div>

        {/* ================= META ================= */}
        <div className="space-y-2 border-t border-b border-slate-50 py-3 mb-4">

          {location && (
            <div className="flex items-center gap-2 text-xs text-slate-500">
              <MapPin className="w-3.5 h-3.5 text-slate-400" />
              <span className="truncate">{location}</span>
            </div>
          )}

          <div className="flex items-center gap-2 text-xs text-slate-500">
            <Clock className="w-3.5 h-3.5 text-slate-400" />
            <span>{experience_years} Years Experience</span>
          </div>

          <div className="flex items-center gap-2 text-sm font-bold text-slate-900">
            <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
            <span>
              ৳{consultation_fee}
              <span className="text-[11px] font-medium text-slate-400">
                {' '} / session
              </span>
            </span>
          </div>

        </div>

        {/* ================= CTA ================= */}
        <div className="flex gap-3">

          {/* View Profile */}
          <Link href={`/consultant/${slug}`} className="flex-1">
            <Button className="w-full btn-outline-soft">
              View Profile
            </Button>
          </Link>

          {/* Book Now */}
          <Link href={`/booking/${slug}`} className="flex-1">
            <Button className="w-full btn-primary-gradient">
              Book Now
            </Button>
          </Link>

        </div>

      </CardContent>
    </Card>
  );
}