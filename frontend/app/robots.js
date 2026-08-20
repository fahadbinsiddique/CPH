import { SITE_URL } from '@/lib/seo'

// Robots of the public storefront.
// - Dashboard, auth, booking and assessment-result routes are authenticated or
//   private and must not be crawled.
// - The frontend exposes no /api routes, but it is disallowed defensively.
export default function robots() {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: [
          '/dashboard',
          '/auth',
          '/api',
          '/booking',
          '/assessment/result',
        ],
      },
    ],
    sitemap: `${SITE_URL}/sitemap.xml`,
  }
}