'use client'

import { Users, Award, Star, HeartPulse, Shield, Lock, Heart } from 'lucide-react'
import Reveal from '@/components/ui/Reveal'

const metrics = [
  { icon: Users, value: '12,000+', label: 'People Supported' },
  { icon: HeartPulse, value: '450+', label: 'Licensed Therapists' },
  { icon: Award, value: '50,000+', label: 'Sessions Completed' },
  { icon: Star, value: '4.9/5', label: 'Average Rating' },
]

const trustBadges = [
  { icon: Shield, label: 'HIPAA Compliant' },
  { icon: Lock, label: 'End-to-End Encryption' },
  { icon: Heart, label: 'Licensed Professionals' },
  { icon: Award, label: 'Insurance Accepted' },
]

const SocialProofBar = () => {
  return (
    <section
      className="relative overflow-hidden bg-white border-y border-stone-100 py-16 md:py-24"
      aria-labelledby="social-proof-heading"
    >
      <div className="section-shell">
        <h2 id="social-proof-heading" className="sr-only">
          Trusted by thousands
        </h2>

        {/* Metrics Row with integrated trust badges */}
        <Reveal y={20} className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
          {metrics.map((item, index) => {
            const Icon = item.icon
            const badge = trustBadges[index]
            const BadgeIcon = badge.icon
            // Star reads amber (same as the Hero rating pill), every other
            // metric keeps the lavender primary — semantic, not decorative.
            const isRating = item.icon === Star
            return (
              <div
                key={item.label}
                className="text-center md:text-left flex flex-col items-center md:items-start gap-3 p-5 md:p-6 rounded-2xl bg-white border border-violet-100 shadow-soft transition-[transform,box-shadow,border-color] duration-300 ease-out hover:-translate-y-1 hover:border-violet-200 hover:shadow-card"
              >
                <div
                  className={`flex h-12 w-12 items-center justify-center rounded-xl ${
                    isRating ? 'bg-amber-50' : 'bg-violet-50'
                  }`}
                >
                  <Icon
                    className={`h-6 w-6 ${isRating ? 'text-amber-600' : 'text-violet-600'}`}
                    aria-hidden="true"
                  />
                </div>
                <div>
                  <p className="font-heading text-2xl md:text-3xl font-bold tracking-tight tabular-nums text-stone-900">
                    {item.value}
                  </p>
                  <p className="text-sm text-stone-600">{item.label}</p>
                </div>
                <div className="flex items-center gap-2 rounded-full border border-emerald-200/70 bg-emerald-50/70 px-3 py-1.5 text-xs font-medium text-emerald-800 w-full md:w-auto mt-2">
                  <BadgeIcon className="h-3.5 w-3.5 text-emerald-600" aria-hidden="true" />
                  {badge.label}
                </div>
              </div>
            )
          })}
        </Reveal>
      </div>
    </section>
  )
}

export default SocialProofBar