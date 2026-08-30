import AboutUsPage from '@/components/pages/AboutUsPage'
import { baseOpenGraph } from '@/lib/seo'

export const metadata = {
  title: 'About Us',
  description:
    'Learn about the Centre for Psychological Health (CPH) — our vision, mission, story, core values and the expert team of licensed psychologists and therapists.',
  alternates: {
    canonical: '/about-us',
  },
  openGraph: baseOpenGraph({
    title: 'About Us',
    description:
      'Learn about the Centre for Psychological Health (CPH) — our vision, mission, story and expert team.',
    url: '/about-us',
  }),
}

export default function Page() {
  return <AboutUsPage />
}