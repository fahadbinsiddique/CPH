// src/components/shared/ConsultantCard.jsx
import Link from 'next/link';
import Image from 'next/image';
import { MapPin, Clock, Star, CheckCircle2 } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

export default function ConsultantCard({ consultant }) {
  const {
    slug, user, specializations, experience_years,
    consultation_fee, profile_image, is_verified,
    is_available, location,
  } = consultant;

  // Cloudinary configuration for dynamic images
  const cloudName = "ds8pqfvld";
  const fullImageUrl = `https://res.cloudinary.com/${cloudName}/${profile_image}`;

  return (
    <Card className="border border-slate-200/60 shadow-sm hover:shadow-md hover:border-teal-500/20 transition-all duration-300 rounded-2xl overflow-hidden bg-white group">
      <CardContent className="p-5">
        
        {/* Top row: Avatar & Core Info */}
        <div className="flex items-start gap-4 mb-4">
          {/* Dynamic Profile Avatar */}
          <div className="relative flex-shrink-0">
            <div className="w-16 h-16 rounded-full overflow-hidden bg-teal-50 border border-slate-100">
              {profile_image ? (
                <Image
                  src={fullImageUrl}
                  alt={user?.full_name || "Consultant"}
                  width={64}
                  height={64}
                  className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-350"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-teal-600 text-xl font-bold">
                  {user?.full_name?.charAt(0)}
                </div>
              )}
            </div>
            {/* Ambient Availability Live Dot */}
            <span className={`absolute bottom-0 right-0 w-3.5 h-3.5 rounded-full border-2 border-white shadow-sm ${is_available ? 'bg-emerald-500' : 'bg-slate-300'}`} />
          </div>

          {/* Text Info */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-1.5 flex-wrap">
              <h3 className="font-bold text-slate-900 group-hover:text-teal-600 transition-colors truncate text-base leading-tight">
                {user?.full_name}
              </h3>
              {is_verified && (
                <CheckCircle2 className="w-4 h-4 text-teal-600 fill-teal-50 flex-shrink-0" />
              )}
            </div>

            {/* Specialization Badges Matrix */}
            <div className="flex flex-wrap gap-1 mt-1">
              {specializations?.slice(0, 2).map((s) => (
                <Badge key={s.id} variant="secondary" className="text-[10px] bg-slate-100 text-slate-500 font-medium px-2 py-0 border-none">
                  {s.name}
                </Badge>
              ))}
            </div>
          </div>
        </div>

        {/* Meta Segment Details */}
        <div className="space-y-2 mb-5 border-t border-b border-slate-50 py-3">
          {location && (
            <div className="flex items-center gap-2 text-xs font-medium text-slate-500">
              <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
              <span className="truncate">{location}</span>
            </div>
          )}
          
          <div className="flex items-center gap-2 text-xs font-medium text-slate-500">
            <Clock className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            <span>{experience_years} Years Experience</span>
          </div>
          
          <div className="flex items-center gap-2 text-sm font-bold text-slate-900 pt-0.5">
            <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400 shrink-0" />
            <span>৳{consultation_fee} <span className="text-[11px] font-medium text-slate-400">/ session</span></span>
          </div>
        </div>

        {/* CTA Button Trigger */}
        <Link href={`/consultant/${slug}`} passHref>
          <Button
            className="w-full bg-slate-950 hover:bg-teal-600 text-white rounded-xl shadow-sm font-semibold text-xs h-10 transition-colors duration-200"
            size="sm"
          >
            View Profile
          </Button>
        </Link>
      </CardContent>
    </Card>
  );
}