import JoinTherapistForm from '@/components/consultant/JoinTherapistForm'
import { baseOpenGraph } from '@/lib/seo'

export const metadata = {
  title: 'Join as a Therapist',
  description:
    'Apply to join the Centre for Psychological Health therapist network. A two-step application covering your account and professional information.',
  alternates: {
    canonical: '/join-as-therapist',
  },
  openGraph: baseOpenGraph({
    title: 'Join as a Therapist',
    description:
      'Apply to join the Centre for Psychological Health (CPH) therapist network.',
    url: '/join-as-therapist',
  }),
}

/**
 * Standalone fallback page for `/join-as-therapist`.
 *
 * Rendered for direct visits, browser refreshes and hard navigations, where no
 * client-side navigation interception takes place. Mirrors the modal flow so the
 * route is never broken or blank.
 */
export default function JoinAsTherapistPage() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-teal-50/40 via-white to-white pb-20 pt-28 sm:pt-32">
      <div className="mx-auto w-full max-w-2xl px-4">
        <div className="overflow-hidden rounded-3xl border border-slate-100 bg-white shadow-float">
          <JoinTherapistForm mode="page" />
        </div>
      </div>
    </main>
  )
}