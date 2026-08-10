import { Geist, Geist_Mono, Plus_Jakarta_Sans } from 'next/font/google'
import './globals.css'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import MotionProvider from '@/components/layout/MotionProvider'
import { Toaster } from 'sonner'
import GoogleOneTap from '@/components/auth/GoogleOneTap'

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
  title: 'Center for Psychologycal Health',
  description: 'A modern mental wellness platform',
}

export default function RootLayout({ children, modal }) {
  return (
    <html
      lang="en"
      data-scroll-behavior="smooth"
      className={`${geistSans.variable} ${geistMono.variable} ${plusJakartaSans.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <Navbar />
        <MotionProvider>
          <GoogleOneTap />
          {children}
          {modal}
        </MotionProvider>
        <Toaster position="top-center" richColors closeButton />
        <Footer />
      </body>
    </html>
  )
}
