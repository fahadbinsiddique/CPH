// Shared SEO constants + builders. Kept in one place so every page-level
// `openGraph` block carries the full set of tags (Next.js replaces, rather than
// deep-merges, the `openGraph` object between root layout and pages).

export const SITE_NAME = 'Centre for Psychological Health'

export const SITE_URL = (
  process.env.NEXT_PUBLIC_SITE_URL ||
  (process.env.NODE_ENV === 'production'
    ? 'https://centreforpsychologicalhealth.com'
    : 'http://localhost:3000')
).replace(/\/+$/, '')

export const SITE_DESCRIPTION =
  'Evidence-based mental health care, online counselling and psychological assessments at the Centre for Psychological Health (CPH). Book a session with licensed psychologists and therapists.'

// Default social sharing image (a real asset in /public).
export const DEFAULT_OG_IMAGE_URL = new URL('/banner.png', SITE_URL).toString()

// Build a page-level openGraph object with all required fields, overriding any
// per-page fields (title/description/url/type/images/…).
export const baseOpenGraph = (fields = {}) => ({
  type: 'website',
  siteName: SITE_NAME,
  locale: 'en_US',
  images: [{ url: DEFAULT_OG_IMAGE_URL, alt: SITE_NAME }],
  ...fields,
})