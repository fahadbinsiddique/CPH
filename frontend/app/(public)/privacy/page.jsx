import Link from 'next/link'
import LegalShell, { LegalSection } from '@/components/pages/LegalShell'
import { baseOpenGraph } from '@/lib/seo'

export const metadata = {
  title: 'Privacy Policy',
  description:
    'How the Centre for Psychological Health collects, uses and protects your personal data, assessment responses and session records.',
  alternates: {
    canonical: '/privacy',
  },
  openGraph: baseOpenGraph({
    title: 'Privacy Policy',
    description:
      'How CPH collects, uses and protects your personal data, assessment responses and session records.',
    url: '/privacy',
  }),
}

export default function Page() {
  return (
    <LegalShell title="Privacy Policy" updated="29 September 2026">
      <LegalSection title="Introduction">
        <p>
          The Centre for Psychological Health (&quot;CPH&quot;, &quot;we&quot;,
          &quot;us&quot;) provides online counselling, psychological assessments
          and related resources. This policy explains what personal information
          we collect, why we collect it, and the choices you have. By using our
          website and services you agree to the practices described here.
        </p>
      </LegalSection>

      <LegalSection title="Information we collect">
        <ul>
          <li>
            <strong>Account details</strong> — your name, email address, phone
            number and password when you register.
          </li>
          <li>
            <strong>Assessment responses</strong> — your answers to our
            self-assessments and screening questionnaires.
          </li>
          <li>
            <strong>Appointment data</strong> — sessions you book, practitioner
            notes shared with you, and appointment status history.
          </li>
          <li>
            <strong>Technical data</strong> — IP address, browser type and
            pages visited, collected automatically for security and reliability.
          </li>
        </ul>
      </LegalSection>

      <LegalSection title="How we use your information">
        <p>
          We use your information to provide and improve the service: creating
          and securing your account, delivering assessments and their results,
          scheduling and managing appointments, responding to your enquiries,
          and sending service-related notifications. We do not sell your
          personal data.
        </p>
      </LegalSection>

      <LegalSection title="Confidentiality of mental-health records">
        <p>
          Assessment responses and anything you share with a practitioner are
          treated as confidential health information. They are accessible only
          to the practitioner involved in your care and to the limited staff who
          operate the platform. We will not disclose them without your consent
          except where required by law, or where there is an imminent risk of
          serious harm to you or another person.
        </p>
      </LegalSection>

      <LegalSection title="How we store and protect your data">
        <p>
          Data is transmitted over encrypted connections (HTTPS) and access is
          restricted by role. We keep personal data only for as long as needed
          for the purposes above, including legal and record-keeping
          obligations, and then delete or anonymise it. No system is perfectly
          secure, so please safeguard your login credentials and tell us
          promptly if you suspect unauthorised access.
        </p>
      </LegalSection>

      <LegalSection title="Sharing">
        <p>
          We share data only with service providers who help us run the
          platform (for example hosting and infrastructure), with the
          practitioner you choose to book, and with authorities where the law
          obliges us. Any provider who handles your data is bound by
          confidentiality obligations.
        </p>
      </LegalSection>

      <LegalSection title="Your rights">
        <ul>
          <li>Access a copy of the personal data we hold about you.</li>
          <li>Correct data that is inaccurate or incomplete.</li>
          <li>Request deletion of your account and associated data.</li>
          <li>Withdraw consent for optional communications at any time.</li>
        </ul>
        <p>
          To exercise any of these, contact us using the details at the end of
          this page. See also our{' '}
          <Link href="/cookies">Cookie Policy</Link> for how we use cookies and
          similar technologies.
        </p>
      </LegalSection>

      <LegalSection title="Children&apos;s privacy">
        <p>
          Our self-assessment tools are intended for adults. Services for
          anyone under 18 must be arranged through a parent or legal guardian.
        </p>
      </LegalSection>

      <LegalSection title="Changes to this policy">
        <p>
          We may update this policy from time to time. The &quot;Last
          updated&quot; date above shows when it last changed. Continued use of
          the service after a change means you accept the revised policy.
        </p>
      </LegalSection>

      <LegalSection title="Contact us">
        <p>
          Questions about your privacy? Email{' '}
          <a href="mailto:cfphuk@gmail.com">cfphuk@gmail.com</a>, call{' '}
          <a href="tel:+8801762389523">+880 1762-389523</a>, or use our{' '}
          <Link href="/contact">contact page</Link>.
        </p>
      </LegalSection>
    </LegalShell>
  )
}
