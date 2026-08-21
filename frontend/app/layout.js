import { Geist, Geist_Mono, Plus_Jakarta_Sans } from 'next/font/google'
import './globals.css'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import MotionProvider from '@/components/layout/MotionProvider'
import { Toaster } from 'sonner'
import GoogleOneTap from '@/components/auth/GoogleOneTap'
import ServiceWorkerRegister from '@/components/shared/ServiceWorkerRegister'
import PWAInstallPrompt from '@/components/shared/PWAInstallPrompt'
import ConnectionStatusBanner from '@/components/shared/ConnectionStatusBanner'
import ProductTourReturn from '@/components/product-tour/ProductTourReturn'
import GTM from '@/components/analytics/GTM'
import MetaPixel from '@/components/analytics/MetaPixel'
import TawkTo from '@/components/analytics/TawkTo'
import JsonLd from '@/components/seo/JsonLd'
import {
  SITE_NAME,
  SITE_URL,
  SITE_DESCRIPTION,
  DEFAULT_OG_IMAGE_URL,
} from '@/lib/seo'

// Geist Sans for body and general text.
const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
})

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
})

// Plus Jakarta Sans for headings and UI accents.
const plusJakartaSans = Plus_Jakarta_Sans({
  variable: '--font-plus-jakarta',
  subsets: ['latin'],
  weight: ['500', '600', '700', '800'],
})

export const metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: SITE_NAME,
    template: `%s | ${SITE_NAME}`,
  },
  description: SITE_DESCRIPTION,
  keywords: [
    'psychology',
    'mental health',
    'therapy',
    'counselling',
    'counseling',
    'psychologist',
    'online therapy',
    'psychological assessment',
    'Bangladesh',
  ],
  applicationName: SITE_NAME,
  authors: [{ name: SITE_NAME }],
  creator: SITE_NAME,
  publisher: SITE_NAME,
  category: 'health',

  // Canonical is intentionally NOT set at the root layout — doing so would
  // canonicalize every page to the site root. Each page sets its own canonical.
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },

  manifest: '/manifest.webmanifest',

  icons: {
    icon: [
      { url: '/icons/favicon-96x96.png', sizes: '96x96', type: 'image/png' },
      { url: '/icons/favicon.svg', type: 'image/svg+xml' },
    ],
    shortcut: '/icons/favicon.ico',
    apple: '/icons/apple-touch-icon.png',
  },

  appleWebApp: {
    title: 'CPH',
    capable: true,
    statusBarStyle: 'default',
  },
  formatDetection: {
    telephone: false,
  },

  openGraph: {
    type: 'website',
    siteName: SITE_NAME,
    title: SITE_NAME,
    description: SITE_DESCRIPTION,
    url: SITE_URL,
    locale: 'en_US',
    images: [{ url: DEFAULT_OG_IMAGE_URL, alt: SITE_NAME }],
  },

  twitter: {
    card: 'summary_large_image',
    title: SITE_NAME,
    description: SITE_DESCRIPTION,
    images: [DEFAULT_OG_IMAGE_URL],
  },
}

export const viewport = {
  themeColor: '#0d9488',
  width: 'device-width',
  initialScale: 1,
}

const ORGANIZATION_SCHEMA = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: SITE_NAME,
  url: SITE_URL,
  logo: new URL('/logo.png', SITE_URL).toString(),
  description: SITE_DESCRIPTION,
}

const WEBSITE_SCHEMA = {
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  name: SITE_NAME,
  url: SITE_URL,
  description: SITE_DESCRIPTION,
}

export default function RootLayout({ children, modal }) {
  return (
    <html
      lang="en"
      data-scroll-behavior="smooth"
      className={`${geistSans.variable} ${geistMono.variable} ${plusJakartaSans.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        {/* Analytics (only load when env IDs are configured) */}
        <GTM />
        <MetaPixel />
        <TawkTo />
        {/* Service Worker Auto Registration */}
        <ServiceWorkerRegister />
        <ConnectionStatusBanner />
        <JsonLd data={ORGANIZATION_SCHEMA} />
        <JsonLd data={WEBSITE_SCHEMA} />
        <Navbar />
        <MotionProvider>
          <GoogleOneTap />
          {children}
          {modal}
        </MotionProvider>
        {/* PWA Install Banner Popup */}
        {/* <PWAInstallPrompt /> */}
        <Toaster position="top-center" richColors closeButton />
        <ProductTourReturn />
        <Footer />
      </body>
    </html>
  )
}