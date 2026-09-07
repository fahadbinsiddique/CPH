'use client'

import { usePathname } from 'next/navigation'
import { useEffect, useRef } from 'react'

const PROPERTY_ID = process.env.NEXT_PUBLIC_TAWK_PROPERTY_ID
const WIDGET_ID = process.env.NEXT_PUBLIC_TAWK_WIDGET_ID

const isPrivatePath = (pathname) =>
  pathname?.startsWith('/dashboard') || pathname?.startsWith('/auth')

/**
 * Tawk.to live chat loader.
 * - Loads only when NEXT_PUBLIC_TAWK_PROPERTY_ID and NEXT_PUBLIC_TAWK_WIDGET_ID
 *   are configured.
 * - Injects the Tawk.to script directly via DOM manipulation (not next/script)
 *   to avoid deferred initialization that can prevent the widget from rendering.
 * - The widget is hidden on private routes (dashboard / auth) and shown on public
 *   routes. Visibility is enforced on route changes and again when the widget
 *   finishes loading (Tawk_API only exists after the script executes).
 */
export default function TawkTo() {
  const pathname = usePathname()
  const loadedRef = useRef(false)

  // Toggle widget visibility on route changes.
  useEffect(() => {
    if (typeof window === 'undefined' || !window.Tawk_API) return
    if (isPrivatePath(pathname)) {
      window.Tawk_API.hideWidget()
    } else {
      window.Tawk_API.showWidget()
    }
  }, [pathname])

  // Load the Tawk.to script once via direct DOM injection.
  useEffect(() => {
    if (!PROPERTY_ID || !WIDGET_ID) return
    if (loadedRef.current) return
    loadedRef.current = true

    const script = document.createElement('script')
    script.id = 'tawk-to'
    script.src = `https://embed.tawk.to/${PROPERTY_ID}/${WIDGET_ID}`
    script.async = true
    script.charset = 'UTF-8'
    script.crossOrigin = 'anonymous'
    script.onload = () => {
      if (typeof window === 'undefined' || !window.Tawk_API) return
      if (isPrivatePath(window.location.pathname)) {
        window.Tawk_API.hideWidget()
      } else {
        window.Tawk_API.showWidget()
      }
    }
    document.body.appendChild(script)
  }, [])

  return null
}
