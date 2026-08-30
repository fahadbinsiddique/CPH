import AssessmentListPage from '@/components/pages/AssessmentListPage'
import { baseOpenGraph } from '@/lib/seo'

export const metadata = {
  title: 'Self-Assessments',
  description:
    'Take free, confidential mental health self-assessments from the Centre for Psychological Health (CPH) to reflect on your well-being and find a clear next step.',
  alternates: {
    canonical: '/assessment',
  },
  openGraph: baseOpenGraph({
    title: 'Self-Assessments',
    description:
      'Free, confidential mental health self-assessments to reflect on your well-being.',
    url: '/assessment',
  }),
}

export default function Page() {
  return <AssessmentListPage />
}