'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { motion, AnimatePresence } from 'framer-motion'
import {
  X,
  MapPin,
  Clock,
  CheckCircle2,
  Calendar,
  Languages,
  Users,
  ShieldCheck,
  BookOpen,
  Loader2,
  ArrowUpRight,
  Newspaper,
  AlertCircle,
} from 'lucide-react'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from '@/components/ui/dialog'

import { consultantService } from '@/services/consultantService'
import useAuthStore from '@/store/authStore'
import { requireLogin } from '@/lib/authGate'
import BookingModal from '@/components/booking/BookingModal'

const tabs = [
  { id: 'bio', label: 'Biography', icon: BookOpen },
  { id: 'schedule', label: 'Schedule', icon: Clock },
  { id: 'blog', label: 'Blog', icon: Newspaper },
]

const fadeInUp = {
  hidden: { opacity: 0, y: 10 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.25, ease: 'easeOut' } },
  exit: { opacity: 0, y: -6, transition: { duration: 0.15 } },
}

/**
 * Consultant profile dialog.
 *
 * Mounted through the `@modal/(.)consultant/[slug]` intercepted route, so it is
 * rendered on top of the current page while the browser URL stays
 * `/consultant/[slug]`. Closing (X, Escape, outside click or browser Back)
 * returns the URL to the previous route via `router.back()`.
 *
 * Content is organized the same way as the dedicated `/consultant/[slug]`
 * page (Biography / Schedule / Blog tabs) so both surfaces stay in sync.
 */
export default function ConsultantProfileModal({ slug }) {
  const router = useRouter()
  const { isAuthenticated } = useAuthStore()

  const [consultant, setConsultant] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)
  const [activeTab, setActiveTab] = useState('bio')
  const [bookingOpen, setBookingOpen] = useState(false)

  useEffect(() => {
    let active = true

    consultantService
      .getBySlug(slug)
      .then((res) => {
        if (active) setConsultant(res.data)
      })
      .catch(() => {
        if (active) setError(true)
      })
      .finally(() => {
        if (active) setLoading(false)
      })

    return () => {
      active = false
    }
  }, [slug])

  const closeModal = () => router.back()

  const handleBook = () => {
    if (!isAuthenticated) {
      requireLogin({ resumePath: `/booking/${slug}` })
      return
    }
    setBookingOpen(true)
  }

  const handleViewFullProfile = () => {
    // The modal renders while the URL is already `/consultant/[slug]`
    // (intercepted route), so a normal router.push() to that same path
    // is a no-op — Next.js dedupes navigation when the href doesn't
    // change. A hard navigation forces the real page to load and
    // breaks out of the intercepted modal.
    window.location.href = `/consultant/${slug}`
  }

  return (
    <>
      <Dialog
        open
        onOpenChange={(open) => {
          if (!open) closeModal()
        }}
      >
      <DialogContent
        showCloseButton={false}
        className="flex max-h-[88dvh] w-full flex-col gap-0 overflow-hidden rounded-2xl bg-white p-0 sm:max-w-2xl lg:max-w-3xl"
      >
        <DialogTitle className="sr-only">
          {consultant?.user?.full_name || 'Consultant profile'}
        </DialogTitle>
        <DialogDescription className="sr-only">
          Detailed profile of {consultant?.user?.full_name || 'the consultant'}
        </DialogDescription>

        {loading && <ProfileSkeleton />}

        {!loading && error && <ProfileError onClose={closeModal} />}

        {!loading && !error && consultant && (
          <>
            {/* ------ Header: clean white surface, photo is the anchor (no banner) ------ */}
            <div className="relative shrink-0 border-b border-slate-100 px-5 pb-5 pt-5 sm:px-8 sm:pt-6">
              <DialogClose asChild>
                <button
                  type="button"
                  aria-label="Close profile"
                  className="absolute right-4 top-4 z-20 flex h-8 w-8 items-center justify-center rounded-full text-slate-400 transition-all hover:bg-slate-100 hover:text-slate-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-500/40 sm:right-6 sm:top-5"
                >
                  <X className="h-4 w-4" />
                </button>
              </DialogClose>

              <div className="flex items-center gap-4 pr-8 sm:gap-5">
                <div className="relative shrink-0">
                  <div className="flex h-28 w-28 items-center justify-center overflow-hidden rounded-2xl bg-slate-100 shadow-sm ring-1 ring-slate-200/70 sm:h-36 sm:w-36">
                    {consultant.profile_image ? (
                      <Image
                        src={consultant.profile_image}
                        alt={consultant.user?.full_name || 'Consultant'}
                        width={144}
                        height={144}
                        className="h-full w-full  object-center"
                        priority
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-teal-100 to-emerald-100 text-4xl font-bold text-teal-700">
                        {consultant.user?.full_name?.charAt(0) || 'C'}
                      </div>
                    )}
                  </div>
                  <span
                    className={`absolute bottom-1.5 right-1.5 h-4 w-4 rounded-full border-2 border-white shadow-sm ${
                      consultant.is_available ? 'animate-pulse bg-emerald-500' : 'bg-slate-300'
                    }`}
                  />
                </div>

                <div className="flex-1">
                  <div className="flex flex-wrap items-center gap-1.5">
                    <h2 className="text-lg font-bold leading-tight tracking-tight text-slate-900 sm:text-2xl">
                      {consultant.user?.full_name}
                    </h2>
                  </div>
                  <p className="mt-0.5 text-sm text-slate-500 sm:text-base">
                    {consultant.specializations?.[0]?.name || 'Mental Health Professional'}
                  </p>
                  <span
                    className={`mt-2 inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[11px] font-semibold ${
                      consultant.is_available
                        ? 'bg-emerald-50 text-emerald-700'
                        : 'bg-slate-100 text-slate-500'
                    }`}
                  >
                    <span
                      className={`h-1.5 w-1.5 rounded-full ${
                        consultant.is_available ? 'bg-emerald-500' : 'bg-slate-400'
                      }`}
                    />
                    {consultant.is_available ? 'Available now' : 'Unavailable'}
                  </span>
                </div>
              </div>
            </div>

            {/* ------ Scrollable body ------ */}
            <div className="flex-1 overflow-y-auto overscroll-contain">
              <div className="space-y-5 px-5 py-5 sm:px-8">
                {/* Stats */}
                <div className="grid grid-cols-3 gap-3">
                  <StatTile
                    icon={<Users className="h-4 w-4 text-teal-600" />}
                    value={`${consultant.total_sessions ?? 1200}+`}
                    label="Sessions"
                  />
                  <StatTile
                    icon={<Clock className="h-4 w-4 text-teal-600" />}
                    value={`${consultant.experience_years ?? 0}y`}
                    label="Experience"
                  />
                  <StatTile
                    icon={<ShieldCheck className="h-4 w-4 text-teal-600" />}
                    value={`৳${consultant.consultation_fee ?? 0}`}
                    label="Per session"
                  />
                </div>

                {/* Specializations */}
                {specializations().length > 0 && (
                  <div className="space-y-1.5">
                    <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                      Areas of Expertise
                    </p>
                    <div className="flex flex-wrap gap-1.5">
                      {specializations().map((s) => (
                        <Badge
                          key={s.id}
                          className="rounded-full border border-teal-200/60 bg-teal-50 px-2.5 py-0.5 text-[11px] font-medium text-teal-700"
                        >
                          {s.name}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}

                {/* Location + languages */}
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <InfoLine
                    icon={<MapPin className="h-3.5 w-3.5 text-slate-400" />}
                    value={consultant.location || 'Not specified'}
                  />
                  <InfoLine
                    icon={<Languages className="h-3.5 w-3.5 text-slate-400" />}
                    value={languageList().length ? languageList().join(', ') : 'Not specified'}
                  />
                </div>

                {/* Tabs */}
                <div className="flex gap-1 rounded-xl border border-slate-200/60 bg-slate-50/80 p-1">
                  {tabs.map((tab) => {
                    const Icon = tab.icon
                    const isActive = activeTab === tab.id
                    return (
                      <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={`flex flex-1 items-center justify-center gap-1.5 rounded-lg px-3 py-2 text-xs font-medium transition-all sm:text-sm ${
                          isActive
                            ? 'bg-teal-600 text-white shadow-sm shadow-teal-600/20'
                            : 'text-slate-500 hover:bg-white hover:text-slate-700'
                        }`}
                      >
                        <Icon className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                        {tab.label}
                      </button>
                    )
                  })}
                </div>

                {/* Tab content */}
                <AnimatePresence mode="wait">
                  {activeTab === 'bio' && (
                    <motion.div
                      key="bio"
                      variants={fadeInUp}
                      initial="hidden"
                      animate="visible"
                      exit="exit"
                      className="rounded-xl border border-slate-100 bg-slate-50/60 p-4 sm:p-5"
                    >
                      <p className="whitespace-pre-line text-sm leading-relaxed text-slate-600">
                        {consultant.bio || 'No biography has been provided yet.'}
                      </p>
                    </motion.div>
                  )}

                  {activeTab === 'schedule' && (
                    <motion.div
                      key="schedule"
                      variants={fadeInUp}
                      initial="hidden"
                      animate="visible"
                      exit="exit"
                    >
                      {availability().length > 0 ? (
                        <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                          {availability().map((a) => (
                            <div
                              key={a.id}
                              className="flex items-center justify-between rounded-xl border border-slate-100 bg-slate-50/60 px-3.5 py-2.5 text-sm"
                            >
                              <span className="font-semibold capitalize text-slate-700">
                                {a.day}
                              </span>
                              <span className="rounded-lg border border-slate-200/60 bg-white px-2 py-1 text-xs font-medium text-slate-500">
                                {a.start_time} — {a.end_time}
                              </span>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="rounded-xl border border-dashed border-slate-200 bg-slate-50/40 py-8 text-center">
                          <p className="text-sm text-slate-400">
                            No availability schedule provided.
                          </p>
                        </div>
                      )}
                    </motion.div>
                  )}

                  {activeTab === 'blog' && (
                    <motion.div
                      key="blog"
                      variants={fadeInUp}
                      initial="hidden"
                      animate="visible"
                      exit="exit"
                      className="space-y-2"
                    >
                      {blogPosts().length > 0 ? (
                        blogPosts().map((post) => (
                          <a
                            key={post.id ?? post.slug}
                            href={`/blog/${post.slug}`}
                            className="group flex items-start gap-3 rounded-xl border border-slate-100 bg-slate-50/60 px-3.5 py-3 text-sm transition-all hover:border-teal-200 hover:bg-teal-50/40"
                          >
                            {post.cover_image ? (
                              <Image
                                src={post.cover_image}
                                alt={post.title}
                                width={56}
                                height={56}
                                className="h-14 w-14 shrink-0 rounded-lg object-cover"
                              />
                            ) : (
                              <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-lg bg-teal-100 text-teal-600">
                                <Newspaper className="h-5 w-5" />
                              </span>
                            )}
                            <div className="min-w-0 flex-1">
                              <p className="line-clamp-1 font-semibold text-slate-800 group-hover:text-teal-700">
                                {post.title}
                              </p>
                              {post.excerpt && (
                                <p className="mt-0.5 line-clamp-2 text-xs text-slate-500">
                                  {post.excerpt}
                                </p>
                              )}
                              {post.published_at && (
                                <p className="mt-1 text-[11px] font-medium text-slate-400">
                                  {new Date(post.published_at).toLocaleDateString('en-US', {
                                    month: 'short',
                                    day: 'numeric',
                                    year: 'numeric',
                                  })}
                                </p>
                              )}
                            </div>
                            <ArrowUpRight className="h-4 w-4 shrink-0 text-slate-400" />
                          </a>
                        ))
                      ) : (
                        <div className="rounded-xl border border-dashed border-slate-200 bg-slate-50/40 py-8 text-center">
                          <Newspaper className="mx-auto mb-2 h-8 w-8 text-slate-300" />
                          <p className="text-sm text-slate-400">
                            {consultant.user?.full_name || 'This consultant'} has not published any
                            blog posts yet.
                          </p>
                        </div>
                      )}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>

            {/* ------ Footer actions ------ */}
            <div className="flex shrink-0 flex-col gap-3 border-t border-slate-100 bg-slate-50/80 px-5 py-4 sm:flex-row sm:px-8">
              <Button
                variant="outline"
                onClick={handleViewFullProfile}
                className="h-11 w-full flex-1 rounded-xl border-slate-200 text-sm font-medium text-slate-600 transition-colors hover:border-teal-300 hover:bg-white hover:text-teal-700"
              >
                View Full Profile
                <ArrowUpRight className="h-4 w-4" />
              </Button>
              <Button
                onClick={handleBook}
                className="h-11 w-full flex-1 rounded-xl bg-gradient-to-r from-teal-600 to-emerald-600 text-sm font-medium text-white shadow-lg shadow-teal-600/20 transition-all hover:from-teal-700 hover:to-emerald-700"
              >
                <Calendar className="h-4 w-4" />
                Book an Appointment
              </Button>
            </div>
          </>
        )}
      </DialogContent>
      </Dialog>

      <BookingModal
        open={bookingOpen}
        onOpenChange={setBookingOpen}
        consultant={consultant}
      />
    </>
  )

  function profile_image() {
    return consultant?.profile_image
  }

  function specializations() {
    return Array.isArray(consultant?.specializations) ? consultant.specializations : []
  }

  function languageList() {
    if (!consultant?.languages) return []
    if (Array.isArray(consultant.languages)) return consultant.languages.filter(Boolean)
    return String(consultant.languages)
      .split(',')
      .map((l) => l.trim())
      .filter(Boolean)
  }

  function availability() {
    return Array.isArray(consultant?.availability) ? consultant.availability : []
  }

  function blogPosts() {
    // Expecting the consultant object to include their own authored posts,
    // e.g. consultant.blogs = [{ id, slug, title, excerpt, cover_image, published_at }]
    if (Array.isArray(consultant?.blogs)) return consultant.blogs
    if (Array.isArray(consultant?.blog_posts)) return consultant.blog_posts
    return []
  }
}

function StatTile({ icon, value, label }) {
  return (
    <div className="flex flex-col items-center gap-1 rounded-xl bg-slate-50/80 py-2.5 text-center">
      <span className="flex h-7 w-7 items-center justify-center rounded-full bg-white shadow-sm">
        {icon}
      </span>
      <div>
        <p className="text-sm font-bold leading-tight text-slate-900">{value}</p>
        <p className="text-[10px] font-medium text-slate-400">{label}</p>
      </div>
    </div>
  )
}

function InfoLine({ icon, value }) {
  return (
    <div className="flex items-center gap-1.5 min-w-0">
      {icon}
      <span className="truncate text-slate-600">{value}</span>
    </div>
  )
}

function ProfileSkeleton() {
  return (
    <div className="flex min-h-[420px] flex-col">
      <div className="flex items-center gap-4 px-5 pb-5 pt-5 sm:gap-5 sm:px-8 sm:pt-6">
        <Skeleton className="h-28 w-28 rounded-2xl sm:h-36 sm:w-36" />
        <div className="flex-1 space-y-2">
          <Skeleton className="h-6 w-40" />
          <Skeleton className="h-4 w-28" />
          <Skeleton className="h-5 w-24 rounded-full" />
        </div>
      </div>
      <div className="grid grid-cols-3 gap-3 px-5 py-4 sm:px-8">
        <Skeleton className="h-16 rounded-xl" />
        <Skeleton className="h-16 rounded-xl" />
        <Skeleton className="h-16 rounded-xl" />
      </div>
      <div className="space-y-3 px-5 sm:px-8">
        <Skeleton className="h-10 rounded-xl" />
        <Skeleton className="h-28 rounded-xl" />
      </div>
    </div>
  )
}

function ProfileError({ onClose }) {
  return (
    <div className="flex min-h-[300px] flex-col items-center justify-center gap-4 p-8 text-center">
      <div className="flex h-14 w-14 items-center justify-center rounded-full bg-rose-50">
        <AlertCircle className="h-6 w-6 text-rose-400" />
      </div>
      <div>
        <p className="text-base font-bold text-slate-900">Profile not found</p>
        <p className="mt-1 text-sm text-slate-500">
          This profile is unavailable or may have been removed.
        </p>
      </div>
      <Button variant="outline" onClick={onClose} className="text-slate-600">
        Close
      </Button>
    </div>
  )
}