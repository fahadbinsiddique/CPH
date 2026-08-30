import ServicesPage from '@/components/pages/ServicesPage'
import { baseOpenGraph } from '@/lib/seo'

export const metadata = {
  title: 'Mental Health Services',
  description:
    'Explore evidence-based therapy services at the Centre for Psychological Health (CPH): individual therapy, couples counseling, child & adolescent therapy, anxiety, depression and trauma care.',
  alternates: {
    canonical: '/services',
  },
  openGraph: baseOpenGraph({
    title: 'Mental Health Services',
    description:
      'Explore evidence-based therapy services at CPH: individual therapy, couples counseling, child & adolescent therapy and more.',
    url: '/services',
  }),
}

export default function Page() {
  return <ServicesPage />
}