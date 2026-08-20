import {
  fetchPublishedBlogs,
  fetchConsultants,
  fetchAssessments,
} from '@/lib/serverData'
import { SITE_URL } from '@/lib/seo'

// The sitemap is regenerated hourly (ISR). If the API is unreachable (e.g. during
// the Docker `next build` where no backend is running) all data fetches resolve to
// empty and only the static public routes are served.
export const revalidate = 3600

export default async function sitemap() {
  const url = (path) => `${SITE_URL}${path}`

  const staticRoutes = [
    { url: url('/'), changeFrequency: 'monthly', priority: 1 },
    { url: url('/about-us'), changeFrequency: 'monthly', priority: 0.5 },
    { url: url('/services'), changeFrequency: 'monthly', priority: 0.7 },
    { url: url('/consultant'), changeFrequency: 'weekly', priority: 0.8 },
    { url: url('/blog'), changeFrequency: 'weekly', priority: 0.8 },
    { url: url('/assessment'), changeFrequency: 'monthly', priority: 0.6 },
    { url: url('/join-as-therapist'), changeFrequency: 'monthly', priority: 0.4 },
  ]

  // All fetches are API-filtered (published blogs, verified consultants, active
  // assessments) so only legitimately indexable URLs are ever emitted.
  const [blogs, consultants, assessments] = await Promise.all([
    fetchPublishedBlogs(),
    fetchConsultants(),
    fetchAssessments(),
  ])

  const blogRoutes = blogs.map((post) => ({
    url: url(`/blog/${post.slug}`),
    ...(post.published_at || post.updated_at
      ? { lastModified: post.published_at || post.updated_at }
      : {}),
    changeFrequency: 'weekly',
    priority: 0.6,
  }))

  const consultantRoutes = consultants.map((c) => ({
    url: url(`/consultant/${c.slug}`),
    ...(c.created_at ? { lastModified: c.created_at } : {}),
    changeFrequency: 'monthly',
    priority: 0.7,
  }))

  const assessmentRoutes = assessments.map((quiz) => ({
    url: url(`/assessment/${quiz.slug}`),
    changeFrequency: 'monthly',
    priority: 0.5,
  }))

  return [...staticRoutes, ...blogRoutes, ...consultantRoutes, ...assessmentRoutes]
}