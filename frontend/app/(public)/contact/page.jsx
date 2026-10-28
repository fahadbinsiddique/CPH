import ContactPage from '@/components/pages/ContactPage'
import { baseOpenGraph } from '@/lib/seo'

export const metadata = {
  title: 'Contact Us',
  description:
    'Contact the Centre for Psychological Health — call +880 1762-389523, email cfphuk@gmail.com or visit our clinic at Green Road, Dhanmondi 1205. Open Sunday to Thursday, 9:00 AM – 8:00 PM.',
  alternates: {
    canonical: '/contact',
  },
  openGraph: baseOpenGraph({
    title: 'Contact Us',
    description:
      'Call, email or visit CPH in Dhanmondi — we reply within one business day.',
    url: '/contact',
  }),
}

export default function Page() {
  return <ContactPage />
}
