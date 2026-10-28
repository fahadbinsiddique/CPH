import Link from 'next/link'
import LegalShell, { LegalSection } from '@/components/pages/LegalShell'
import { baseOpenGraph } from '@/lib/seo'

export const metadata = {
  title: 'Terms of Service',
  description:
    'The terms that govern your use of the Centre for Psychological Health website, self-assessments and appointment booking.',
  alternates: {
    canonical: '/terms',
  },
  openGraph: baseOpenGraph({
    title: 'Terms of Service',
    description:
      'The terms that govern your use of the CPH website, self-assessments and appointment booking.',
    url: '/terms',
  }),
}

export default function Page() {
  return (
    <LegalShell title="Terms of Service" updated="29 September 2026">
      <LegalSection title="Acceptance of these terms">
        <p>
          By accessing the Centre for Psychological Health (&quot;CPH&quot;,
          &quot;we&quot;) website or booking any service, you agree to these
          Terms of Service and to our <Link href="/privacy">Privacy Policy</Link>. If
          you do not agree, please do not use the service.
        </p>
      </LegalSection>
      <LegalSection title="What we provide">
        <p>
          CPH is a platform that connects you with licensed psychologists and
          therapists, offers psychological self-assessments, and publishes
          educational resources. Content on this site — including articles,
          screening tools and result summaries — is provided for general
          information and is <strong>not a medical diagnosis</strong>. A
          diagnosis can only come from a qualified practitioner after a proper
          evaluation.
        </p>
      </LegalSection>

      <LegalSection title="In an emergency">
        <p>
          CPH is <strong>not an emergency service</strong>. If you or someone
          else is in immediate danger or crisis, contact your local emergency
          number or go to the nearest emergency department without delay.
        </p>
      </LegalSection>

      <LegalSection title="Accounts">
        <p>
          You must provide accurate information when registering and keep your
          credentials confidential. You are responsible for activity that
          happens under your account. Please tell us promptly about any
          unauthorised use.
        </p>
      </LegalSection>

      <LegalSection title="Appointments and cancellations">
        <p>
          Sessions are booked with individual practitioners. Scheduling
          availability, rescheduling and cancellation rules are shown during
          booking and may differ between practitioners. Repeated no-shows may
          affect your ability to keep booking.
        </p>
      </LegalSection>

      <LegalSection title="Acceptable use">
        <ul>
          <li>Do not impersonate another person or misrepresent yourself.</li>
          <li>Do not attempt to disrupt, reverse engineer or abuse the site.</li>
          <li>
            Do not upload unlawful, harmful or infringing content, or use the
            platform to harass staff or practitioners.
          </li>
          <li>Do not resell or scrape content or assessment material.</li>
        </ul>
      </LegalSection>

      <LegalSection title="Intellectual property">
        <p>
          The CPH name, logo, site design, assessment instruments and written
          content are owned by CPH or our licensors. You may view and print
          pages for personal use; anything else requires our written
          permission.
        </p>
      </LegalSection>

      <LegalSection title="Disclaimers and limitation of liability">
        <p>
          The service is provided &quot;as is&quot; without warranties of any
          kind, to the extent permitted by law. Self-assessment scores are
          screening indicators, not clinical conclusions. To the extent
          permitted by law, CPH is not liable for indirect, incidental or
          consequential losses arising from your use of the site or reliance on
          its content.
        </p>
      </LegalSection>

      <LegalSection title="Changes and governing law">
        <p>
          We may update these terms; the &quot;Last updated&quot; date shows
          when that last happened. These terms are governed by the laws of
          Bangladesh, and the courts of Dhaka have jurisdiction over any
          dispute. Contact us via the <Link href="/contact">contact page</Link> with
          any questions.
        </p>
      </LegalSection>
    </LegalShell>
  )
}
