import BlogListPage from '@/components/pages/BlogListPage'
import { baseOpenGraph } from '@/lib/seo'

export const metadata = {
  title: 'Mental Health Blog',
  description:
    'Articles and insights on mental health, therapy, self-care and psychological well-being from the Centre for Psychological Health (CPH).',
  alternates: {
    canonical: '/blog',
  },
  openGraph: baseOpenGraph({
    title: 'Mental Health Blog',
    description:
      'Articles and insights on mental health, therapy and psychological well-being from the Centre for Psychological Health.',
    url: '/blog',
  }),
}

export default function Page() {
  return <BlogListPage />
}