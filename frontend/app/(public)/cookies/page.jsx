import Link from 'next/link'
import LegalShell, { LegalSection } from '@/components/pages/LegalShell'
import { baseOpenGraph } from '@/lib/seo'

export const metadata = {
  title: 'Cookie Policy',
  description:
    'The cookies and similar technologies the Centre for Psychological Health uses, why they are needed, and how to control them.',
  alternates: {
    canonical: '/cookies',
  },
  openGraph: baseOpenGraph({
    title: 'Cookie Policy',
    description:
      'The cookies and similar technologies CPH uses, why they are needed, and how to control them.',
    url: '/cookies',
  }),
}

export default function Page() {
  return (
    <LegalShell title="Cookie Policy" updated="29 September 2026">
      <LegalSection title="What cookies are">
        <p>
          Cookies are small text files a website stores on your device to
          remember information between visits. We also use similar technologies
          such as local storage, which works the same way but lives in your
          browser instead.
        </p>
      </LegalSection>

      <LegalSection title="Cookies we use">
        <ul>
          <li>
            <strong>Essential</strong> — the authentication cookie
            (<code>access_token</code>) that keeps you signed in, plus
            security-related cookies. These are strictly necessary; the site
            cannot function without them.
          </li>
          <li>
            <strong>Preferences</strong> — interface state saved in local
            storage (for example, whether you were signed in before the page
            finished loading) so the site behaves consistently between visits.
          </li>
          <li>
            <strong>Embedded content</strong> — pages such as{' '}
            <Link href="/contact">Contact</Link> embed Google Maps, which may set its
            own cookies. Google&apos;s handling is governed by its own privacy
            policy.
          </li>
        </ul>
      </LegalSection>

      <LegalSection title="How we use them">
        <p>
          Cookies keep you signed in, protect your account, remember your
          preferences and help us understand — in aggregate — how the site is
          used so we can improve it. We do not use cookies to build advertising
          profiles or to sell data about you.
        </p>
      </LegalSection>

      <LegalSection title="Managing cookies">
        <p>
          You can block or delete cookies in your browser settings (usually
          under Settings → Privacy). Blocking essential cookies will sign you
          out and prevent login until they are allowed again. Clearing local
          storage resets interface preferences but does not affect your
          account data.
        </p>
      </LegalSection>

      <LegalSection title="Updates to this policy">
        <p>
          We may change this policy as our use of cookies evolves. The
          &quot;Last updated&quot; date above shows when it last changed.
          Questions? Email{' '}
          <a href="mailto:cfphuk@gmail.com">cfphuk@gmail.com</a> or use the{' '}
          <Link href="/contact">contact page</Link>.
        </p>
      </LegalSection>
    </LegalShell>
  )
}
