'use client'
// Client implementation of the About Us page. Rendered by the server wrapper at app/about-us/page.jsx.

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Link from 'next/link'
import {
  Heart,
  Brain,
  Users,
  Target,
  Eye,
  Award,
  Shield,
  Clock,
  CheckCircle,
  ArrowRight,
  Phone,
  Mail,
  Calendar,
  Star,
  Quote,
  ChevronRight,
  BookOpen,
  Handshake,
  Smile,
  Leaf,
  Compass,
  BarChart,
  Activity,
  Sparkles,
  Globe,
  Lightbulb,
  TrendingUp,
  UserCheck,
  BadgeCheck,
  HeartHandshake,
  Feather,
  XOctagon,
  Loader2,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { consultantService } from '@/services/consultantService'

// Animation variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.08, delayChildren: 0.1 },
  },
}

const itemVariants = {
  hidden: { opacity: 0, y: 30, scale: 0.95 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { type: 'spring', stiffness: 300, damping: 24 },
  },
}

const fadeInUp = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: 'easeOut' },
  },
}

// Team members are fetched from the backend (consultantService.getAll) at runtime.
// Core values
const coreValues = [
  {
    icon: HeartHandshake,
    title: 'Compassion',
    description: 'We approach every individual with empathy, understanding, and genuine care.',
    color: 'from-rose-400 to-pink-500',
  },
  {
    icon: Shield,
    title: 'Integrity',
    description: 'We uphold the highest ethical standards and maintain confidentiality at all times.',
    color: 'from-blue-400 to-indigo-500',
  },
  {
    icon: Award,
    title: 'Excellence',
    description: 'We strive for clinical excellence through evidence-based practices.',
    color: 'from-amber-400 to-orange-500',
  },
  {
    icon: Users,
    title: 'Inclusivity',
    description: 'We welcome individuals from all backgrounds and walks of life.',
    color: 'from-emerald-400 to-teal-500',
  },
]

// Stats
const stats = [
  { icon: Users, value: '500+', label: 'Happy Clients' },
  { icon: Award, value: '15+', label: 'Years of Excellence' },
  { icon: UserCheck, label: 'Expert Consultants' },
  { icon: Star, value: '4.9/5', label: 'Average Rating' },
]

// Milestones
const milestones = [
  {
    year: '2010',
    title: 'Founded',
    description: 'Centre For Psychological Health was established with a vision to provide accessible mental health care.',
  },
  {
    year: '2013',
    title: 'Expansion',
    description: 'Expanded services to include child & adolescent therapy and couples counseling.',
  },
  {
    year: '2016',
    title: 'Online Therapy',
    description: 'Launched online therapy services to reach individuals across Bangladesh.',
  },
  {
    year: '2019',
    title: 'New Location',
    description: 'Opened our new state-of-the-art facility in Dhanmondi, Dhaka.',
  },
  {
    year: '2023',
    title: 'Team Growth',
    description: 'Grew our team to 6 expert consultants, expanding our range of services.',
  },
]

// http:// -> https:// and protocol-relative -> https, safe for <img>.
function normalizeProfileImage(src) {
  if (!src || typeof src !== 'string') return undefined
  const trimmed = src.trim()
  if (!trimmed) return undefined
  if (trimmed.startsWith('http://')) return trimmed.replace('http://', 'https://')
  if (trimmed.startsWith('//')) return `https:${trimmed}`
  return trimmed
}

export default function AboutUsPage() {
  const [selectedTeamMember, setSelectedTeamMember] = useState(null)
  const [consultants, setConsultants] = useState([])
  const [teamLoading, setTeamLoading] = useState(true)
  const [teamError, setTeamError] = useState(false)

  useEffect(() => {
    let mounted = true
    consultantService
      .getAll({ is_featured: true })
      .then((res) => {
        if (mounted) setConsultants(res.data.results || res.data || [])
      })
      .catch(() => {
        if (mounted) setTeamError(true)
      })
      .finally(() => {
        if (mounted) setTeamLoading(false)
      })
    return () => {
      mounted = false
    }
  }, [])

  const teamMembers = consultants.map((c) => ({
    id: c.id,
    slug: c.slug,
    name: c.user?.full_name || 'Mental Health Expert',
    role: c.specializations?.[0]?.name || 'Consultant Psychologist',
    specialization: (c.specializations || []).map((s) => s.name).join(', '),
    experience: c.experience_years ? `${c.experience_years}+ Years` : 'N/A',
    education: c.location || c.languages || '—',
    image: normalizeProfileImage(c.profile_image),
    bio: c.bio || 'No biography has been provided yet.',
  }))

  useEffect(() => {
    if (selectedTeamMember) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
    }
    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [selectedTeamMember])

  return (
    <div className="min-h-screen bg-gradient-to-br from-stone-50 via-white to-orange-50/25 pt-28 pb-16 font-sans">
      
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-teal-900 via-teal-800 to-emerald-800 text-white py-20">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 right-0 w-96 h-96 bg-white/20 rounded-full blur-3xl" />
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-emerald-400/20 rounded-full blur-3xl" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-teal-400/10 rounded-full blur-3xl" />
        </div>

        <div className="relative container mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <Badge className="mb-4 bg-white/10 text-white border-white/20 backdrop-blur-sm">
              <Heart className="w-3 h-3 mr-1" />
              About Us
            </Badge>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight mb-4">
              Your Trusted Partner in{' '}
              <span className="bg-gradient-to-r from-teal-300 to-emerald-300 bg-clip-text text-transparent">
                Mental Wellness
              </span>
            </h1>
            <p className="text-xl text-teal-100/90 max-w-2xl mx-auto font-light">
              At Centre For Psychological Health, we are committed to providing compassionate,
              evidence-based mental health care to individuals and families in Bangladesh.
            </p>

            {/* Quick Stats */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 max-w-3xl mx-auto mt-12">
              {stats.map((stat, idx) => {
                const Icon = stat.icon
                return (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 * idx }}
                    className="bg-white/10 backdrop-blur-sm rounded-2xl p-4 border border-white/10"
                  >
                    <Icon className="w-6 h-6 text-teal-300 mx-auto mb-1" />
                    <p className="text-2xl font-bold">
                      {stat.label === 'Expert Consultants'
                        ? `${consultants.length}+`
                        : stat.value}
                    </p>
                    <p className="text-xs text-teal-200/80">{stat.label}</p>
                  </motion.div>
                )
              })}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Mission & Vision Section */}
      <section className="py-16 container mx-auto px-4">
        <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 border border-stone-200/60 shadow-sm hover:shadow-md transition-all"
          >
            <div className="w-14 h-14 rounded-2xl bg-teal-50 flex items-center justify-center mb-4">
              <Eye className="w-7 h-7 text-teal-600" />
            </div>
            <h2 className="text-2xl font-bold text-stone-900 mb-3">Our Vision</h2>
            <p className="text-stone-600 leading-relaxed">
              To create a Bangladesh where mental health is prioritized, stigma is eliminated,
              and every individual has access to compassionate, high-quality psychological care.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 border border-stone-200/60 shadow-sm hover:shadow-md transition-all"
          >
            <div className="w-14 h-14 rounded-2xl bg-emerald-50 flex items-center justify-center mb-4">
              <Target className="w-7 h-7 text-emerald-600" />
            </div>
            <h2 className="text-2xl font-bold text-stone-900 mb-3">Our Mission</h2>
            <p className="text-stone-600 leading-relaxed">
              To deliver evidence-based, culturally-sensitive mental health services that empower
              individuals to achieve emotional well-being, build resilience, and lead fulfilling lives.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Our Story Section */}
      <section className="bg-white/60 backdrop-blur-sm py-16 border-t border-b border-stone-200/60">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center max-w-3xl mx-auto mb-12"
          >
            <Badge className="mb-3 bg-teal-50 text-teal-700 border-teal-200">Our Journey</Badge>
            <h2 className="text-3xl sm:text-4xl font-bold text-stone-900">Our Story</h2>
            <p className="text-stone-500 mt-2">
              From a single vision to a trusted mental health institution — our journey of compassion
              and commitment.
            </p>
          </motion.div>

          <div className="relative max-w-4xl mx-auto">
            {/* Timeline Line */}
            <div className="absolute left-1/2 -translate-x-1/2 w-0.5 h-full bg-gradient-to-b from-teal-400 via-emerald-400 to-teal-400 hidden md:block" />

            {milestones.map((milestone, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.1 * idx }}
                className={`relative flex flex-col md:flex-row items-center gap-6 mb-8 ${
                  idx % 2 === 0 ? 'md:pr-1/2' : 'md:pl-1/2 md:flex-row-reverse'
                }`}
              >
                {/* Timeline Dot */}
                <div className="hidden md:block absolute left-1/2 -translate-x-1/2 w-4 h-4 bg-teal-500 rounded-full border-4 border-white shadow-md z-10" />

                <div
                  className={`w-full md:w-5/12 bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-stone-200/60 shadow-sm hover:shadow-md transition-all ${
                    idx % 2 === 0 ? 'md:text-right' : 'md:text-left'
                  }`}
                >
                  <div className="inline-block px-3 py-1 rounded-full bg-teal-50 text-teal-700 font-bold text-sm mb-2">
                    {milestone.year}
                  </div>
                  <h3 className="text-lg font-bold text-stone-800">{milestone.title}</h3>
                  <p className="text-sm text-stone-500 mt-1">{milestone.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Core Values */}
      <section className="py-16 container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center max-w-2xl mx-auto mb-12"
        >
          <Badge className="mb-3 bg-amber-50 text-amber-700 border-amber-200">Our Values</Badge>
          <h2 className="text-3xl sm:text-4xl font-bold text-stone-900">What We Stand For</h2>
          <p className="text-stone-500 mt-2">The principles that guide everything we do.</p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-5xl mx-auto">
          {coreValues.map((value, idx) => {
            const Icon = value.icon
            return (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.1 * idx }}
                className="text-center p-6 rounded-2xl bg-white/70 backdrop-blur-sm border border-stone-200/60 hover:shadow-lg hover:border-teal-200 transition-all group"
              >
                <div
                  className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${value.color} flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform`}
                >
                  <Icon className="w-7 h-7 text-white" />
                </div>
                <h3 className="font-bold text-stone-800">{value.title}</h3>
                <p className="text-sm text-stone-500 mt-1">{value.description}</p>
              </motion.div>
            )
          })}
        </div>
      </section>

      {/* Team Section */}
      <section className="bg-white/60 backdrop-blur-sm py-16 border-t border-b border-stone-200/60">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center max-w-2xl mx-auto mb-12"
          >
            <Badge className="mb-3 bg-indigo-50 text-indigo-700 border-indigo-200">
              <Users className="w-3 h-3 mr-1" />
              Our Team
            </Badge>
            <h2 className="text-3xl sm:text-4xl font-bold text-stone-900">
              Meet Our Expert Consultants
            </h2>
            <p className="text-stone-500 mt-2">
              A dedicated team of licensed professionals committed to your well-being.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
            {teamLoading ? (
              Array.from({ length: 3 }).map((_, i) => (
                <div
                  key={i}
                  className="rounded-2xl border border-stone-200/60 bg-white/80 backdrop-blur-sm shadow-sm overflow-hidden"
                >
                  <Skeleton className="h-48 w-full rounded-none" />
                  <div className="p-5 space-y-3">
                    <Skeleton className="h-5 w-2/3" />
                    <Skeleton className="h-4 w-1/2" />
                    <Skeleton className="h-4 w-3/4" />
                  </div>
                </div>
              ))
            ) : teamError || teamMembers.length === 0 ? (
              <div className="col-span-full text-center py-20">
                <Users className="w-12 h-12 text-stone-300 mx-auto mb-3" />
                <p className="text-stone-500 font-medium">
                  {teamError
                    ? 'Could not load our consultants right now.'
                    : 'Our consultants will be listed here soon.'}
                </p>
                {teamError && (
                  <Button
                    variant="outline"
                    className="mt-4 rounded-xl border-stone-200 text-stone-700"
                    onClick={() => window.location.reload()}
                  >
                    Try again
                  </Button>
                )}
              </div>
            ) : (
              teamMembers.map((member, index) => (
              <motion.div
                key={member.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.05 * index }}
                whileHover={{ y: -6 }}
                className="group cursor-pointer"
                onClick={() => setSelectedTeamMember(member)}
              >
                <Card className="h-full border border-stone-200/60 bg-white/80 backdrop-blur-sm shadow-sm hover:shadow-xl hover:border-teal-500/20 transition-all duration-500 overflow-hidden rounded-2xl">
                  <div className="relative h-48 overflow-hidden bg-gradient-to-br from-teal-50 to-emerald-100">
                    {member.image ? (
                      <>
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={member.image}
                          alt={member.name}
                          loading="lazy"
                          decoding="async"
                          className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-500"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                      </>
                    ) : (
                      <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-teal-50 to-emerald-100">
                        <div className="flex h-20 w-20 items-center justify-center rounded-full border border-teal-200 bg-white/90 shadow-sm">
                          <span className="text-3xl font-bold text-teal-700">
                            {member.name.charAt(0).toUpperCase()}
                          </span>
                        </div>
                      </div>
                    )}
                    <div className="absolute bottom-4 left-4">
                      <Badge className="bg-white/20 text-white border-white/20 backdrop-blur-sm">
                        {member.experience}
                      </Badge>
                    </div>
                  </div>
                  <CardContent className="p-5">
                    <h3 className="text-lg font-bold text-stone-800 group-hover:text-teal-600 transition-colors">
                      {member.name}
                    </h3>
                    <p className="text-sm text-teal-600 font-medium">{member.role}</p>
                    <p className="text-xs text-stone-500 mt-1">{member.specialization}</p>
                    <div className="mt-3 flex items-center text-teal-600 font-medium text-sm group-hover:gap-2 transition-all">
                      View Profile <ChevronRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
              ))
            )}
          </div>
        </div>
      </section>

      {/* Team Member Detail Modal */}
      <AnimatePresence>
        {selectedTeamMember && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
            onClick={() => setSelectedTeamMember(null)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 30 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 30 }}
              className="bg-white rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="relative">
                <div className="relative h-64 rounded-t-3xl overflow-hidden bg-gradient-to-br from-teal-50 to-emerald-100">
                  {selectedTeamMember.image ? (
                    <>
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={selectedTeamMember.image}
                        alt={selectedTeamMember.name}
                        loading="lazy"
                        decoding="async"
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
                    </>
                  ) : (
                    <div className="flex h-full w-full items-center justify-center">
                      <div className="flex h-28 w-28 items-center justify-center rounded-full border border-teal-200 bg-white/90 shadow-md">
                        <span className="text-5xl font-bold text-teal-700">
                          {selectedTeamMember.name.charAt(0).toUpperCase()}
                        </span>
                      </div>
                    </div>
                  )}
                  <button
                    onClick={() => setSelectedTeamMember(null)}
                    className="absolute top-4 right-4 p-2 bg-white/20 backdrop-blur-sm rounded-full hover:bg-white/30 transition-all"
                  >
                    <XOctagon className="w-6 h-6 text-white" />
                  </button>
                  <div className="absolute bottom-6 left-6">
                    <h2 className="text-2xl font-bold text-white">{selectedTeamMember.name}</h2>
                    <p className="text-teal-200 font-medium">{selectedTeamMember.role}</p>
                  </div>
                </div>

                <div className="p-6 space-y-5">
                  <div className="grid grid-cols-2 gap-3">
                    <div className="bg-stone-50 rounded-xl p-3 text-center">
                      <p className="text-xs text-stone-500">Experience</p>
                      <p className="font-semibold text-stone-800">{selectedTeamMember.experience}</p>
                    </div>
                    <div className="bg-stone-50 rounded-xl p-3 text-center">
                      <p className="text-xs text-stone-500">Education</p>
                      <p className="text-xs font-medium text-stone-800">{selectedTeamMember.education}</p>
                    </div>
                  </div>

                  <div>
                    <h3 className="font-semibold text-stone-800 mb-2">About</h3>
                    <p className="text-stone-600 text-sm leading-relaxed">{selectedTeamMember.bio}</p>
                  </div>

                  <div>
                    <h3 className="font-semibold text-stone-800 mb-2">Specialization</h3>
                    <Badge className="bg-teal-50 text-teal-700 border-teal-200">
                      {selectedTeamMember.specialization}
                    </Badge>
                  </div>

                  <div className="pt-4 border-t border-stone-200 flex flex-col sm:flex-row gap-3">
                    {selectedTeamMember.slug && (
                      <Link
                        href={`/consultant/${selectedTeamMember.slug}`}
                        className="flex-1"
                        onClick={() => setSelectedTeamMember(null)}
                      >
                        <Button variant="outline" className="w-full rounded-xl border-stone-200">
                          <ChevronRight className="mr-2 w-4 h-4" />
                          View Full Profile
                        </Button>
                      </Link>
                    )}
                    <Link href="/consultant" className="flex-1">
                      <Button className="w-full bg-gradient-to-r from-teal-600 to-emerald-600 hover:from-teal-700 hover:to-emerald-700 text-white rounded-xl shadow-lg shadow-teal-600/20">
                        Book a Session
                        <ArrowRight className="ml-2 w-4 h-4" />
                      </Button>
                    </Link>
                    <Link href="/contact" className="flex-1">
                      <Button variant="outline" className="w-full rounded-xl border-stone-200">
                        <Mail className="mr-2 w-4 h-4" />
                        Contact
                      </Button>
                    </Link>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Why Choose Us */}
      <section className="py-16 container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center max-w-2xl mx-auto mb-12"
        >
          <Badge className="mb-3 bg-emerald-50 text-emerald-700 border-emerald-200">
            <CheckCircle className="w-3 h-3 mr-1" />
            Why Choose CPH
          </Badge>
          <h2 className="text-3xl sm:text-4xl font-bold text-stone-900">
            Why Families Trust CPH
          </h2>
          <p className="text-stone-500 mt-2">
            Experience the difference of compassionate, professional mental health care.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-5xl mx-auto">
          {[
            { icon: BadgeCheck, title: 'Licensed Professionals', desc: 'All our therapists are fully licensed and experienced.' },
            { icon: Shield, title: 'Confidential Care', desc: 'Your privacy and trust are our top priorities.' },
            { icon: Calendar, title: 'Flexible Scheduling', desc: 'Book appointments that fit your busy life.' },
            { icon: HeartHandshake, title: 'Compassionate Support', desc: 'Caring, non-judgmental care for everyone.' },
          ].map((item, idx) => {
            const Icon = item.icon
            return (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.1 * idx }}
                className="text-center p-6 rounded-2xl bg-white/70 backdrop-blur-sm border border-stone-200/60 hover:shadow-lg hover:border-teal-200 transition-all"
              >
                <div className="w-14 h-14 rounded-full bg-teal-50 flex items-center justify-center mx-auto mb-3">
                  <Icon className="w-7 h-7 text-teal-600" />
                </div>
                <h3 className="font-bold text-stone-800">{item.title}</h3>
                <p className="text-sm text-stone-500 mt-1">{item.desc}</p>
              </motion.div>
            )
          })}
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-gradient-to-r from-teal-900 to-emerald-800 text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">
              Ready to Start Your Journey?
            </h2>
            <p className="text-xl text-teal-100/90 max-w-2xl mx-auto mb-8">
              Take the first step toward better mental health. Our compassionate team is here to help.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/consultant">
                <Button className="bg-white text-teal-800 hover:bg-teal-50 rounded-xl px-8 py-6 text-lg font-semibold shadow-lg shadow-teal-900/20">
                  Find a Consultant
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Button>
              </Link>
              <Link href="/contact">
                <Button variant="outline" className="border-white/30 text-teal-800  hover:bg-white/10 rounded-xl px-8 py-6 text-lg font-semibold">
                  <Phone className="mr-2 w-5 h-5" />
                  Contact Us
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* X button for modal - need to import */}
    </div>
  )
}