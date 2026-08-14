'use client'
import { useEffect, useRef } from 'react'

/**
 * ITP redirect handler for Google One Tap (referenced via `login_uri` in
 * GoogleOneTap.jsx). On iOS Safari / other browsers that drop 3rd-party
 * cookies, Google cannot deliver the credential to the iframe, so it redirects
 * this top-level page with a `g_csrf_token`. We persist that cookie, re-drive
 * the prompt in the top frame, and hand the resulting credential back to the
 * opener via postMessage. The opener (GoogleOneTap host) completes the token
 * exchange so there is exactly one backend call path.
 */
export default function GoogleAuthHandler() {
  const seenRef = useRef(false)

  useEffect(() => {
    if (seenRef.current) return
    seenRef.current = true

    const params = new URLSearchParams(window.location.search)
    const gCsrfToken = params.get('g_csrf_token')

    // Google's GSI library reads the csrf cookie from the document it was
    // redirected to; persist it before any initialize()/prompt() call.
    if (gCsrfToken) {
      document.cookie = `g_csrf_token=${gCsrfToken}; path=/; max-age=${60 * 60 * 4}; SameSite=Lax`
    }

    const script = document.createElement('script')
    script.src = 'https://accounts.google.com/gsi/client'
    script.async = true
    script.defer = true

    script.onload = () => {
      window.google.accounts.id.initialize({
        client_id: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID,
        use_fedcm_for_prompt: true,
        itp_support: true,
        callback: (response) => {
          // Pass the raw credential to the window that opened this flow.
          // Parent must handle the response via GoogleOneTap's callback.listener.
          if (window.opener) {
            window.opener.postMessage(
              { type: 'GOOGLE_ONE_TAP_CREDENTIAL', credential: response.credential },
              window.location.origin,
            )
          }
        },
      })
      window.google.accounts.id.prompt()
    }

    script.onerror = () => {
      if (window.opener) {
        window.opener.postMessage(
          { type: 'GOOGLE_ONE_TAP_ERROR', error: 'GSI script failed to load' },
          window.location.origin,
        )
      }
    }

    document.body.appendChild(script)
  }, [])

  return (
    <div className="min-h-screen flex items-center justify-center text-slate-500 text-sm p-8">
      Completing Google sign-in…
    </div>
  )
}