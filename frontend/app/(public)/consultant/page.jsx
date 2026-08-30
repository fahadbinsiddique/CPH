import ConsultantListPage from '@/components/pages/ConsultantListPage'
import { baseOpenGraph } from '@/lib/seo'

export const metadata = {
  title: 'Find a Therapist',
  description:
    'Search the directory of verified psychologists and therapists at the Centre for Psychological Health. Filter by specialization, availability and location, then book a session.',
  alternates: {
    canonical: '/consultant',
  },
  openGraph: baseOpenGraph({
    title: 'Find a Therapist',
    description:
      'Search verified psychologists and therapists, filter by specialization and availability, then book a session.',
    url: '/consultant',
  }),
}

export default function Page() {
  return <ConsultantListPage />
}