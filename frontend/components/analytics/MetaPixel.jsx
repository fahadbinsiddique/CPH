'use client'

import { useEffect, useRef } from 'react'
import { usePathname } from 'next/navigation'
import Script from 'next/script'

const PIXEL_ID = process.env.NEXT_PUBLIC_META_PIXEL_ID

/**
 * Meta (Facebook) Pixel loader.
 * - Loads only when NEXT_PUBLIC_META_PIXEL_ID is configured.
 * - Initializes the pixel once via the standard base snippet (which also fires the
 *   initial PageView on page load).
 * - Tracks a PageView on every client-side route change, skipping the very first
 *   route so the base snippet's PageView is never duplicated.
 */
export default function MetaPixel() {
  const pathname = usePathname()
  const firstRouteRef = useRef(true)

  useEffect(() => {
    if (!PIXEL_ID) return
    if (firstRouteRef.current) {
      // The base pixel snippet fires the initial PageView as soon as it loads.
      firstRouteRef.current = false
      return
    }
    if (typeof window !== 'undefined' && window.fbq) {
      window.fbq('track', 'PageView')
    }
  }, [pathname])

  if (!PIXEL_ID) return null

  return (
    <Script id="meta-pixel" strategy="afterInteractive">
      {`!function(f,b,e,v,n,t,s)
{if(f.fbq)return;n=f.fbq=function(){n.callMethod?
n.callMethod.apply(n,arguments):n.queue.push(arguments)};
if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
n.queue=[];t=b.createElement(e);t.async=!0;
t.src=v;s=b.getElementsByTagName(e)[0];
s.parentNode.insertBefore(t,s)}(window, document,'script',
'https://connect.facebook.net/en_US/fbevents.js');
fbq('init', '${PIXEL_ID}');
fbq('track', 'PageView');`}
    </Script>
  )
}