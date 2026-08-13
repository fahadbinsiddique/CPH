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
  title: 'Center for Psychology',
  description: 'Mental wellness & online counseling platform',
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
    title: 'Cph',
    capable: true,
    statusBarStyle: 'default',
  },
  formatDetection: {
    telephone: false,
  },
}

export const viewport = {
  themeColor: '#0d9488',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
}

export default function RootLayout({ children, modal }) {
  return (
    <html
      lang="en"
      data-scroll-behavior="smooth"
      className={`${geistSans.variable} ${geistMono.variable} ${plusJakartaSans.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        {/* Service Worker Auto Registration */}
        <ServiceWorkerRegister />
        <ConnectionStatusBanner />
        <Navbar />
        <MotionProvider>
          <GoogleOneTap />
          {children}
          {modal}
        </MotionProvider>
        {/* PWA Install Banner Popup */}
        <PWAInstallPrompt />
        <Toaster position="top-center" richColors closeButton />
        <Footer />
      </body>
    </html>
  )
}
