import ConsultantProfileModal from '@/components/consultant/ConsultantProfileModal'

/**
 * Intercepted route: navigating to `/consultant/[slug]` with client-side
 * navigation renders this profile modal over the current page instead of
 * performing a full page navigation. The browser URL becomes `/consultant/[slug]`
 * while the underlying page stays mounted.
 *
 * Direct visits, refreshes and hard navigations fall through to the standalone
 * `app/consultant/[slug]/page.jsx`.
 */
export default async function ConsultantProfileModalPage({ params }) {
  const { slug } = await params
  return <ConsultantProfileModal slug={slug} />
}