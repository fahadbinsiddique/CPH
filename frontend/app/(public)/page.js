import HomePage from '@/components/pages/HomePage'
import { baseOpenGraph } from '@/lib/seo'

export const metadata = {
  title: { absolute: 'Centre for Psychological Health' },
  description:
    'Evidence-based mental health care, online counselling and psychological assessments at the Centre for Psychological Health (CPH). Book a session with licensed psychologists and therapists.',
  alternates: {
    canonical: '/',
  },
  openGraph: baseOpenGraph({
    type: 'website',
    title: 'Centre for Psychological Health',
    description:
      'Evidence-based mental health care, online counselling and psychological assessments at the Centre for Psychological Health (CPH).',
    url: '/',
  }),
}

export default function Page() {
  return <HomePage />
}