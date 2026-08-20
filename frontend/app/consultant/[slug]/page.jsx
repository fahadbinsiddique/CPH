import ConsultantProfilePage from '@/components/pages/ConsultantProfilePage'
import JsonLd from '@/components/seo/JsonLd'
import { fetchConsultantBySlug } from '@/lib/serverData'
import { SITE_URL, DEFAULT_OG_IMAGE_URL, baseOpenGraph } from '@/lib/seo'

export async function generateMetadata({ params }) {
  const { slug } = await params
  const consultant = await fetchConsultantBySlug(slug)
  if (!consultant) return {}

  const name = consultant.user?.full_name || 'Consultant'
  const role = consultant.specializations?.[0]?.name || 'Mental Health Professional'
  const url = new URL(`/consultant/${consultant.slug}`, SITE_URL).toString()
  const description = consultant.bio || `${role} at the Centre for Psychological Health (CPH).`
  const images = consultant.profile_image
    ? [{ url: consultant.profile_image, alt: name }]
    : [DEFAULT_OG_IMAGE_URL]

  return {
    title: `${name} — ${role}`,
    description,
    alternates: { canonical: url },
    openGraph: baseOpenGraph({
      type: 'profile',
      title: `${name} — ${role}`,
      description,
      url,
      images,
      firstName: name.split(' ')[0] || name,
      lastName: name.split(' ').slice(1).join(' ') || undefined,
    }),
    twitter: {
      card: 'summary_large_image',
      title: `${name} — ${role}`,
      description,
      images,
    },
  }
}

export default async function ConsultantProfileRoute({ params }) {
  const { slug } = await params
  const consultant = await fetchConsultantBySlug(slug)

  const personSchema = consultant
    ? {
        '@context': 'https://schema.org',
        '@type': 'Person',
        name: consultant.user?.full_name || undefined,
        description: consultant.bio || undefined,
        ...(consultant.profile_image ? { image: consultant.profile_image } : {}),
        jobTitle:
          (consultant.specializations || []).map((s) => s.name).join(', ') ||
          'Mental Health Professional',
        url: new URL(`/consultant/${consultant.slug}`, SITE_URL).toString(),
        ...(consultant.location
          ? { address: { '@type': 'PostalAddress', addressLocality: consultant.location } }
          : {}),
      }
    : null

  return (
    <>
      {personSchema && <JsonLd data={personSchema} />}
      <ConsultantProfilePage />
    </>
  )
}