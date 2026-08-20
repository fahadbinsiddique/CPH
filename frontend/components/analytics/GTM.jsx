'use client'

import Script from 'next/script'

const GTM_ID = process.env.NEXT_PUBLIC_GTM_ID

/**
 * Google Tag Manager container loader.
 * - Loads only when NEXT_PUBLIC_GTM_ID is configured (no traffic in dev otherwise).
 * - Uses next/script with `afterInteractive`, so it never blocks rendering and is
 *   de-duplicated by Next across client-side navigations (initialized exactly once).
 * - Renders the standard <noscript> fallback for non-JavaScript crawlers.
 */
export default function GTM() {
  if (!GTM_ID) return null

  return (
    <>
      <Script id="gtm-data-layer" strategy="afterInteractive">
        {`window.dataLayer = window.dataLayer || [];
window.dataLayer.push({'gtm.start': new Date().getTime(), event:'gtm.js'});`}
      </Script>
      <Script
        id="gtm-container"
        strategy="afterInteractive"
        src={`https://www.googletagmanager.com/gtm.js?id=${GTM_ID}&l=dataLayer`}
      />
      <noscript>
        <iframe
          src={`https://www.googletagmanager.com/ns.html?id=${GTM_ID}&l=dataLayer`}
          height="0"
          width="0"
          style={{ display: 'none', visibility: 'hidden' }}
          title="Google Tag Manager"
        />
      </noscript>
    </>
  )
}