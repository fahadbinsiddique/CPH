'use client'

import Script from 'next/script'
import { usePathname } from 'next/navigation'
import { useEffect } from 'react'

const PROPERTY_ID = process.env.NEXT_PUBLIC_TAWK_PROPERTY_ID
const WIDGET_ID = process.env.NEXT_PUBLIC_TAWK_WIDGET_ID

const isPrivatePath = (pathname) =>
  pathname?.startsWith('/dashboard') || pathname?.startsWith('/auth')

/**
 * Tawk.to live chat loader.
 * - Loads only when NEXT_PUBLIC_TAWK_PROPERTY_ID and NEXT_PUBLIC_TAWK_WIDGET_ID
 *   are configured.
 * - Uses next/script with `afterInteractive`, so it never blocks rendering and is
 *   de-duplicated by Next across client-side navigations (initialized exactly once).
 * - The widget is hidden on private routes (dashboard / auth) and shown on public
 *   routes. Visibility is enforced on route changes and again when the widget
 *   finishes loading (Tawk_API only exists after the script executes).
 */
export default function TawkTo() {
  const pathname = usePathname()

  useEffect(() => {
    if (typeof window === 'undefined' || !window.Tawk_API) return
    if (isPrivatePath(pathname)) {
      window.Tawk_API.hideWidget()
    } else {
      window.Tawk_API.showWidget()
    }
  }, [pathname])

  if (!PROPERTY_ID || !WIDGET_ID) return null

  return (
    <Script
      id="tawk-to"
      strategy="afterInteractive"
      src={`https://embed.tawk.to/${PROPERTY_ID}/${WIDGET_ID}`}
      onLoad={() => {
        if (typeof window === 'undefined' || !window.Tawk_API) return
        if (isPrivatePath(window.location.pathname)) {
          window.Tawk_API.hideWidget()
        } else {
          window.Tawk_API.showWidget()
        }
      }}
    />
  )
}