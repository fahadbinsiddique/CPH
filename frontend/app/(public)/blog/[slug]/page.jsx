import BlogDetailPage from '@/components/pages/BlogDetailPage'
import JsonLd from '@/components/seo/JsonLd'
import { fetchBlogBySlug } from '@/lib/serverData'
import { SITE_NAME, SITE_URL, DEFAULT_OG_IMAGE_URL, baseOpenGraph } from '@/lib/seo'

export async function generateMetadata({ params }) {
  const { slug } = await params
  const post = await fetchBlogBySlug(slug)
  if (!post) return {}

  const url = new URL(`/blog/${post.slug}`, SITE_URL).toString()
  const description = post.excerpt || post.title
  const images = post.featured_image
    ? [{ url: post.featured_image, alt: post.title }]
    : [DEFAULT_OG_IMAGE_URL]

  return {
    title: post.title,
    description,
    alternates: { canonical: url },
    openGraph: baseOpenGraph({
      type: 'article',
      title: post.title,
      description,
      url,
      images,
    }),
    twitter: {
      card: 'summary_large_image',
      title: post.title,
      description,
      images,
    },
  }
}

export default async function BlogArticlePage({ params }) {
  const { slug } = await params
  const post = await fetchBlogBySlug(slug)

  const articleSchema = post
    ? {
        '@context': 'https://schema.org',
        '@type': 'Article',
        headline: post.title,
        description: post.excerpt || undefined,
        image: post.featured_image ? [post.featured_image] : undefined,
        ...(post.published_at ? { datePublished: post.published_at } : {}),
        ...(post.updated_at ? { dateModified: post.updated_at } : {}),
        author: {
          '@type': 'Person',
          name: post.author?.full_name || SITE_NAME,
        },
        publisher: {
          '@type': 'Organization',
          name: SITE_NAME,
          logo: {
            '@type': 'ImageObject',
            url: new URL('/logo.png', SITE_URL).toString(),
          },
        },
        mainEntityOfPage: new URL(`/blog/${post.slug}`, SITE_URL).toString(),
      }
    : null

  return (
    <>
      {articleSchema && <JsonLd data={articleSchema} />}
      <BlogDetailPage />
    </>
  )
}