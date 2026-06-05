'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import { motion } from 'framer-motion';
import {
  MapPin, Clock, CheckCircle2, Calendar,
  Languages, Star, ArrowLeft, Loader2
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { consultantService } from '@/services/consultantService';

const DAY_BN = {
  saturday: 'শনিবার', sunday: 'রবিবার', monday: 'সোমবার',
  tuesday: 'মঙ্গলবার', wednesday: 'বুধবার',
  thursday: 'বৃহস্পতিবার', friday: 'শুক্রবার',
};

export default function ConsultantProfilePage() {
  const { slug } = useParams();
  const router = useRouter();
  const [consultant, setConsultant] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    consultantService.getBySlug(slug)
      .then(res => setConsultant(res.data))
      .catch(() => router.push('/consultant'))
      .finally(() => setLoading(false));
  }, [slug]);

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center">
      <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
    </div>
  );

  if (!consultant) return null;

  const {
    user, specializations, bio, experience_years,
    consultation_fee, profile_image, is_verified,
    is_available, location, languages, availability,
  } = consultant;

  return (
    <div className="min-h-screen bg-slate-50 py-10">
      <div className="max-w-4xl mx-auto px-4">
        {/* Back */}
        <button
          onClick={() => router.back()}
          className="flex items-center gap-2 text-slate-500 hover:text-slate-700 mb-6 text-sm"
        >
          <ArrowLeft className="w-4 h-4" /> ফিরে যাও
        </button>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Left — Profile card */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="md:col-span-1"
          >
            <Card className="border-0 shadow-md rounded-2xl overflow-hidden">
              <CardContent className="p-6 text-center">
                {/* Avatar */}
                <div className="relative inline-block mb-4">
                  <div className="w-24 h-24 rounded-full overflow-hidden bg-blue-100 mx-auto">
                    {profile_image ? (
                      <Image
                        src={profile_image}
                        alt={user?.full_name}
                        width={96}
                        height={96}
                        className="object-cover w-full h-full"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-blue-600 text-3xl font-bold">
                        {user?.full_name?.charAt(0)}
                      </div>
                    )}
                  </div>
                  <span className={`absolute bottom-1 right-1 w-4 h-4 rounded-full border-2 border-white ${is_available ? 'bg-green-500' : 'bg-slate-300'}`} />
                </div>

                <div className="flex items-center justify-center gap-2 mb-1">
                  <h1 className="text-lg font-bold text-slate-800">{user?.full_name}</h1>
                  {is_verified && <CheckCircle2 className="w-5 h-5 text-blue-500" />}
                </div>

                <p className="text-sm text-slate-500 mb-3">
                  {is_available ? '✅ এখন Available' : '⏸ অনুপলব্ধ'}
                </p>

                <div className="flex flex-wrap justify-center gap-1.5 mb-4">
                  {specializations?.map((s) => (
                    <Badge key={s.id} variant="secondary" className="text-xs">{s.name}</Badge>
                  ))}
                </div>

                <div className="space-y-2 text-sm text-slate-600 text-left">
                  {location && (
                    <div className="flex items-center gap-2">
                      <MapPin className="w-4 h-4 text-slate-400" />
                      {location}
                    </div>
                  )}
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-slate-400" />
                    {experience_years} বছরের অভিজ্ঞতা
                  </div>
                  {languages && (
                    <div className="flex items-center gap-2">
                      <Languages className="w-4 h-4 text-slate-400" />
                      {languages}
                    </div>
                  )}
                  <div className="flex items-center gap-2 font-medium text-slate-800">
                    <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                    ৳{consultation_fee} / session
                  </div>
                </div>

                <Button
                  className="w-full mt-5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl"
                  onClick={() => router.push(`/booking/${slug}`)}
                >
                  <Calendar className="w-4 h-4 mr-2" />
                  Appointment নিন
                </Button>
              </CardContent>
            </Card>
          </motion.div>

          {/* Right — Details */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="md:col-span-2 space-y-5"
          >
            {/* Bio */}
            <Card className="border-0 shadow-md rounded-2xl">
              <CardContent className="p-6">
                <h2 className="text-base font-semibold text-slate-800 mb-3">পরিচিতি</h2>
                <p className="text-slate-600 leading-relaxed text-sm">
                  {bio || 'কোনো পরিচিতি দেওয়া হয়নি।'}
                </p>
              </CardContent>
            </Card>

            {/* Availability */}
            {availability?.length > 0 && (
              <Card className="border-0 shadow-md rounded-2xl">
                <CardContent className="p-6">
                  <h2 className="text-base font-semibold text-slate-800 mb-3">সাপ্তাহিক সময়সূচি</h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {availability.map((a) => (
                      <div
                        key={a.id}
                        className="flex items-center justify-between bg-slate-50 rounded-xl px-4 py-2.5 text-sm"
                      >
                        <span className="font-medium text-slate-700">{DAY_BN[a.day] || a.day}</span>
                        <span className="text-slate-500">{a.start_time} — {a.end_time}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </motion.div>
        </div>
      </div>
    </div>
  );
}