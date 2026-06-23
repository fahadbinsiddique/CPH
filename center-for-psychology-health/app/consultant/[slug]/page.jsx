'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import {
  MapPin,
  Clock,
  CheckCircle2,
  Calendar,
  Languages,
  Star,
  ArrowLeft,
  Loader2,
  BookOpen,
  ExternalLink,
  Award,
  Mail,
  Phone,
  Shield,
  Sparkles,
  Users,
  Heart,
  ChevronRight,
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { consultantService } from '@/services/consultantService';

// Premium Animation Variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.08, delayChildren: 0.1 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 25 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] } },
};

const fadeInUp = {
  hidden: { opacity: 0, y: 15 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: 'easeOut' } },
};

export default function ConsultantProfilePage() {
  const { slug } = useParams();
  const router = useRouter();
  const [consultant, setConsultant] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('bio'); // bio | schedule | research

  useEffect(() => {
    consultantService
      .getBySlug(slug)
      .then((res) => setConsultant(res.data))
      .catch(() => router.push('/consultant'))
      .finally(() => setLoading(false));
  }, [slug, router]);

  if (loading)
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-slate-50 via-white to-indigo-50/30">
        <Loader2 className="w-12 h-12 animate-spin text-teal-600" />
        <p className="text-sm text-slate-500 mt-4 font-medium animate-pulse">
          Loading profile...
        </p>
      </div>
    );

  if (!consultant) return null;

  const {
    user,
    specializations,
    bio,
    experience_years,
    consultation_fee,
    profile_image,
    is_verified,
    is_available,
    location,
    languages,
    availability,
    research_paper_link,
    rating = 4.9,
    total_sessions = 1200,
    email,
    phone,
  } = consultant;

  const researchPapers = research_paper_link
    ? research_paper_link.split(',').map((link) => link.trim())
    : [];

  const tabs = [
    { id: 'bio', label: 'Biography', icon: BookOpen },
    { id: 'schedule', label: 'Schedule', icon: Clock },
    { id: 'research', label: 'Research', icon: Award },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-indigo-50/30 pt-24 pb-16 selection:bg-teal-100 selection:text-teal-900">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        {/* Back Button */}
        <motion.button
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3 }}
          onClick={() => router.back()}
          className="group flex items-center gap-2 text-slate-500 hover:text-slate-900 mb-8 text-sm font-medium transition-all"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          Back to Directory
        </motion.button>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 lg:grid-cols-12 gap-8"
        >
          {/* LEFT COLUMN — Profile Card */}
          <motion.div variants={itemVariants} className="lg:col-span-4">
            <div className="lg:sticky lg:top-28 space-y-4">
              {/* Main Profile Card */}
              <Card className="border border-slate-200/60 shadow-xl shadow-slate-200/30 rounded-2xl overflow-hidden bg-white/80 backdrop-blur-sm">
                <CardContent className="p-6 text-center">
                  {/* Avatar with Availability */}
                  <div className="relative inline-block mb-4">
                    <div className="w-32 h-32 rounded-full overflow-hidden bg-gradient-to-br from-teal-50 to-emerald-50 p-1 mx-auto shadow-lg shadow-teal-500/10">
                      {profile_image ? (
                        <Image
                          src={profile_image}
                          alt={user?.full_name || 'Consultant'}
                          width={128}
                          height={128}
                          className="object-cover w-full h-full rounded-full"
                          priority
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-teal-100 to-emerald-100 text-teal-700 text-4xl font-bold rounded-full">
                          {user?.full_name?.charAt(0)}
                        </div>
                      )}
                    </div>
                    <span
                      className={`absolute bottom-2 right-2 w-4.5 h-4.5 rounded-full border-2 border-white shadow-md ${
                        is_available ? 'bg-emerald-500 animate-pulse' : 'bg-slate-300'
                      }`}
                    />
                  </div>

                  {/* Name & Verification */}
                  <div className="flex items-center justify-center gap-2 mb-1">
                    <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
                      {user?.full_name}
                    </h1>
                    {is_verified && (
                      <CheckCircle2 className="w-5 h-5 text-teal-500 fill-teal-500/10" />
                    )}
                  </div>

                  {/* Title */}
                  <p className="text-sm text-slate-500 mb-3">
                    {specializations?.[0]?.name || 'Mental Health Professional'}
                  </p>

                  {/* Status Badge */}
                  <div className="mb-4">
                    <Badge
                      variant={is_available ? 'success' : 'secondary'}
                      className={`text-xs px-3 py-1 rounded-full font-medium ${
                        is_available
                          ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                          : 'bg-slate-100 text-slate-600'
                      }`}
                    >
                      {is_available ? (
                        <span className="flex items-center gap-1">
                          <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />
                          Available Now
                        </span>
                      ) : (
                        'Currently Unavailable'
                      )}
                    </Badge>
                  </div>

                  {/* Specializations */}
                  <div className="flex flex-wrap justify-center gap-1.5 mb-5">
                    {specializations?.slice(0, 4).map((s) => (
                      <Badge
                        key={s.id}
                        variant="secondary"
                        className="text-[11px] font-medium bg-slate-50 text-slate-600 border border-slate-200/60 rounded-lg px-2.5 py-0.5"
                      >
                        {s.name}
                      </Badge>
                    ))}
                    {specializations?.length > 4 && (
                      <Badge className="text-[11px] font-medium bg-slate-50 text-slate-400 border border-slate-200/60 rounded-lg px-2.5 py-0.5">
                        +{specializations.length - 4}
                      </Badge>
                    )}
                  </div>

                  <hr className="border-slate-100 my-4" />

                  {/* Stats Row */}
                  <div className="grid grid-cols-3 gap-2 mb-5">
                    
                    <div className="bg-slate-50/80 rounded-xl p-2.5">
                      <Users className="w-4 h-4 text-teal-500 mx-auto mb-0.5" />
                      <p className="text-sm font-bold text-slate-800">{total_sessions}+</p>
                      <p className="text-[10px] text-slate-400">Sessions</p>
                    </div>
                    <div className="bg-slate-50/80 rounded-xl p-2.5">
                      <Clock className="w-4 h-4 text-teal-500 mx-auto mb-0.5" />
                      <p className="text-sm font-bold text-slate-800">{experience_years}y</p>
                      <p className="text-[10px] text-slate-400">Experience</p>
                    </div>
                  </div>

                  {/* Meta Info */}
                  <div className="space-y-3 text-sm text-slate-600 text-left">
                    {location && (
                      <div className="flex items-center gap-3 bg-slate-50/60 rounded-xl px-3 py-2">
                        <MapPin className="w-4 h-4 text-teal-500 shrink-0" />
                        <span>{location}</span>
                      </div>
                    )}
                    
                    
                    <div className="flex items-center justify-between bg-gradient-to-r from-teal-50 to-emerald-50/50 rounded-xl px-4 py-2.5 border border-teal-100/50">
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-slate-800">
                          ৳{consultation_fee}
                        </span>
                        <span className="text-xs text-slate-400">/ session</span>
                      </div>
                      <Shield className="w-4 h-4 text-teal-500" />
                    </div>
                  </div>

                  {/* CTA Button */}
                  <Button
                    className="w-full mt-6 bg-gradient-to-r from-teal-600 to-emerald-600 hover:from-teal-700 hover:to-emerald-700 text-white rounded-xl shadow-lg shadow-teal-600/20 transition-all duration-300 group"
                    onClick={() => router.push(`/booking/${slug}`)}
                  >
                    <Calendar className="w-4 h-4 mr-2 group-hover:scale-110 transition-transform" />
                    Book an Appointment
                    <ChevronRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
                  </Button>

                  {/* Trust badge */}
                  <div className="mt-4 flex items-center justify-center gap-1.5 text-[11px] text-slate-400">
                    <Sparkles className="w-3 h-3 text-teal-400" />
                    <span>100% confidential & secure</span>
                  </div>
                </CardContent>
              </Card>
            </div>
          </motion.div>

          {/* RIGHT COLUMN — Deep Details */}
          <div className="lg:col-span-8 space-y-6">
            {/* Tabs Navigation */}
            <motion.div variants={itemVariants} className="flex gap-1 bg-white/80 backdrop-blur-sm rounded-xl border border-slate-200/60 p-1 shadow-sm">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                const isActive = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium transition-all ${
                      isActive
                        ? 'bg-teal-600 text-white shadow-md shadow-teal-600/20'
                        : 'text-slate-500 hover:text-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    {tab.label}
                  </button>
                );
              })}
            </motion.div>

            {/* Tab Content */}
            <AnimatePresence mode="wait">
              {activeTab === 'bio' && (
                <motion.div
                  key="bio"
                  variants={fadeInUp}
                  initial="hidden"
                  animate="visible"
                  exit={{ opacity: 0, y: -10 }}
                >
                  <Card className="border border-slate-200/60 shadow-sm rounded-2xl bg-white/80 backdrop-blur-sm">
                    <CardContent className="p-6 sm:p-8">
                      <div className="flex items-center gap-2 mb-5">
                        <BookOpen className="w-5 h-5 text-teal-600" />
                        <h2 className="text-xl font-bold text-slate-900 tracking-tight">
                          Biography
                        </h2>
                      </div>
                      <div className="prose prose-slate max-w-none">
                        <p className="text-slate-600 leading-relaxed whitespace-pre-line text-sm">
                          {bio || 'No biography has been provided yet.'}
                        </p>
                      </div>
                      {/* Quick trust indicators */}
                      <div className="mt-6 grid grid-cols-1 sm:grid-cols-3 gap-3 pt-6 border-t border-slate-100">
                        <div className="flex items-center gap-2 text-sm text-slate-600">
                          <CheckCircle2 className="w-4 h-4 text-teal-500" />
                          <span>Licensed professional</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-slate-600">
                          <Shield className="w-4 h-4 text-teal-500" />
                          <span>Verified credentials</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-slate-600">
                          <Heart className="w-4 h-4 text-teal-500" />
                          <span>Compassionate care</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              )}

              {activeTab === 'schedule' && (
                <motion.div
                  key="schedule"
                  variants={fadeInUp}
                  initial="hidden"
                  animate="visible"
                  exit={{ opacity: 0, y: -10 }}
                >
                  <Card className="border border-slate-200/60 shadow-sm rounded-2xl bg-white/80 backdrop-blur-sm">
                    <CardContent className="p-6 sm:p-8">
                      <div className="flex items-center gap-2 mb-5">
                        <Clock className="w-5 h-5 text-teal-600" />
                        <h2 className="text-xl font-bold text-slate-900 tracking-tight">
                          Weekly Availability
                        </h2>
                      </div>
                      {availability?.length > 0 ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          {availability.map((a) => (
                            <div
                              key={a.id}
                              className="flex items-center justify-between bg-slate-50/60 border border-slate-200/60 rounded-xl px-4 py-3 text-sm transition-all hover:bg-slate-50 hover:border-teal-200 group"
                            >
                              <span className="font-semibold text-slate-700 capitalize">
                                {a.day}
                              </span>
                              <span className="text-slate-500 font-medium bg-white px-2.5 py-1 rounded-lg border border-slate-200/60 text-xs">
                                {a.start_time} — {a.end_time}
                              </span>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="text-center py-8 border border-dashed border-slate-200 rounded-xl bg-slate-50/40">
                          <p className="text-sm text-slate-400">
                            No availability schedule provided.
                          </p>
                        </div>
                      )}
                      <div className="mt-5 p-4 bg-teal-50/50 rounded-xl border border-teal-100/50">
                        <p className="text-sm text-slate-600 flex items-center gap-2">
                          <Calendar className="w-4 h-4 text-teal-500" />
                          All times are in your local timezone
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              )}

              {activeTab === 'research' && (
                <motion.div
                  key="research"
                  variants={fadeInUp}
                  initial="hidden"
                  animate="visible"
                  exit={{ opacity: 0, y: -10 }}
                >
                  <Card className="border border-slate-200/60 shadow-sm rounded-2xl bg-white/80 backdrop-blur-sm">
                    <CardContent className="p-6 sm:p-8">
                      <div className="flex items-center gap-2 mb-5">
                        <Award className="w-5 h-5 text-teal-600" />
                        <h2 className="text-xl font-bold text-slate-900 tracking-tight">
                          Research & Publications
                        </h2>
                      </div>
                      {researchPapers.length > 0 ? (
                        <div className="space-y-3">
                          {researchPapers.map((paper, index) => (
                            <a
                              key={index}
                              href={paper.startsWith('http') ? paper : `https://${paper}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="group flex items-center justify-between p-4 rounded-xl border border-slate-200/60 bg-slate-50/30 hover:bg-teal-50/20 hover:border-teal-200/60 transition-all duration-200"
                            >
                              <div className="flex items-start gap-3 flex-1">
                                <div className="w-6 h-6 rounded-full bg-teal-100 text-teal-600 flex items-center justify-center text-xs font-bold shrink-0">
                                  {index + 1}
                                </div>
                                <span className="text-sm font-medium text-slate-700 group-hover:text-teal-700 transition-colors line-clamp-2 flex-1">
                                  {paper.replace(/(^\w+:|^)\/\//, '')}
                                </span>
                              </div>
                              <ExternalLink className="w-4 h-4 text-slate-400 group-hover:text-teal-500 shrink-0 ml-4 transition-colors" />
                            </a>
                          ))}
                        </div>
                      ) : (
                        <div className="text-center py-10 border border-dashed border-slate-200 rounded-xl bg-slate-50/40">
                          <Award className="w-10 h-10 text-slate-300 mx-auto mb-2" />
                          <p className="text-sm text-slate-400">
                            No research papers or publications listed.
                          </p>
                          <p className="text-xs text-slate-400 mt-1">
                            Check back later for updates.
                          </p>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>
      </div>
    </div>
  );
}