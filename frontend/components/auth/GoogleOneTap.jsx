'use client'
import { useEffect, useCallback, useRef } from 'react'
import { usePathname } from 'next/navigation'
import axios from 'axios'
import { toast } from 'sonner'
import useAuthStore from '@/store/authStore'
import useUiStore from '@/store/uiStore'
import { consumeResumePath } from '@/lib/authGate'

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8000'
const GOOGLE_CLIENT_ID = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID

// Guard: a missing client ID is the #1 silent instant-failure for One Tap. Surf
// it loudly in dev instead of waiting for a browser console 400.
if (typeof window !== 'undefined' && !GOOGLE_CLIENT_ID) {
  console.error(
    '[Google One Tap] NEXT_PUBLIC_GOOGLE_CLIENT_ID is not set. It must match the backend GOOGLE_CLIENT_ID exactly.',
  )
}

// Module-level dedupe: the GSI script is appended at most once per page load,
// even across React StrictMode double-mounts and multiple drawer opens.
let gsiLoadingPromise = null

function loadGsiScript() {
  if (typeof window === 'undefined') return Promise.resolve(null)
  if (window.google?.accounts?.id) return Promise.resolve(window.google)

  if (!gsiLoadingPromise) {
    gsiLoadingPromise = new Promise((resolve, reject) => {
      const script = document.createElement('script')
      script.src = 'https://accounts.google.com/gsi/client'
      script.async = true
      script.defer = true
      script.onload = () => resolve(window.google)
      script.onerror = () => {
        gsiLoadingPromise = null
        reject(new Error('Failed to load GSI client script.'))
      }
      document.body.appendChild(script)
    })
  }
  return gsiLoadingPromise
}

export default function GoogleOneTap({ onLoginSuccess }) {
  const nonceRef = useRef(null)
  const promptedRef = useRef(false)
  const promptParentRef = useRef(null)
  const pathname = usePathname()
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated)

  const exchangeCredential = useCallback(
    async (credential) => {
      try {
        const res = await axios.post(
          `${API_BASE_URL}/api/auth/google/`,
          {
            token: credential,
            nonce: nonceRef.current,
          },
          { withCredentials: true },
        )

        if (res.status === 200 && res.data.success) {
          await useAuthStore.getState().fetchMe()

          useUiStore.getState().closeLoginModal()

          // Tear down the One Tap session so a stale iframe does not linger.
          if (window.google?.accounts?.id) {
            window.google.accounts.id.cancel()
          }
          nonceRef.current = null
          promptedRef.current = false

          toast.success('Signed in with Google')

          const resumePath = consumeResumePath()
          if (onLoginSuccess) {
            onLoginSuccess(res.data.user)
          } else if (resumePath) {
            window.location.href = resumePath
          } else {
            window.location.reload()
          }
        }
      } catch (error) {
        const message =
          error?.response?.data?.error || 'Google sign-in failed. Please try again.'
        toast.error(message)
        // Allow a later attempt to re-prompt.
        promptedRef.current = false
        nonceRef.current = null
      }
    },
    [onLoginSuccess],
  )

  // Receives the credential from the /auth/google-handler page (ITP top-frame
  // flow) and completes the login through the same single backend path.
  const handleGoogleResponse = useCallback(
    (response) => {
      if (!response?.credential) return
      return exchangeCredential(response.credential)
    },
    [exchangeCredential],
  )

  const showOneTap = useCallback(async () => {
    if (promptedRef.current || !GOOGLE_CLIENT_ID) return

    let google
    try {
      google = await loadGsiScript()
    } catch {
      return
    }
    if (!google?.accounts?.id) return

    nonceRef.current = crypto.randomUUID()
    promptedRef.current = true

    google.accounts.id.initialize({
      client_id: GOOGLE_CLIENT_ID,
      callback: handleGoogleResponse,
      nonce: nonceRef.current,
      // One account pre-selected without friction for returning users.
      auto_select: true,
      // FedCM works in the Chrome ecosystem where 3P cookies are blocked.
      use_fedcm_for_prompt: true,
      // iOS Safari / ITP fallback — redirects through the handler page below.
      itp_support: true,
      login_uri: `${window.location.origin}/auth/google-handler`,
      prompt_parent: promptParentRef.current || undefined,
    })

    google.accounts.id.prompt((notification) => {
      if (notification.isNotDisplayed() || notification.isSkippedMoment()) {
        const reason =
          notification.getNotDisplayedReason() || notification.getSkippedReason()
        if (reason !== 'user_skipped' && reason !== 'user_closed' && reason !== 'browser_not_supported') {
          console.warn('[Google One Tap] prompt suppressed:', reason)
        }
        // Reset so a later drawer open can retry.
        promptedRef.current = false
      }
    })
  }, [handleGoogleResponse])

  // Gate: only prompt on the home page when the user is signed out. Other routes
  // stay quiet so the prompt is never spammy (Google suppresses it otherwise).
  useEffect(() => {
    if (pathname === '/' && !isAuthenticated) {
      showOneTap()
    } else {
      if (window.google?.accounts?.id) {
        window.google.accounts.id.cancel()
      }
      promptedRef.current = false
      nonceRef.current = null
    }
  }, [pathname, isAuthenticated, showOneTap])

  // ITP top-frame handler relays the credential via postMessage; validate the
  // sender origin so a cross-site page cannot inject a credential.
  useEffect(() => {
    const onMessage = (event) => {
      if (event.origin !== window.location.origin) return
      const data = event.data
      if (data?.type === 'GOOGLE_ONE_TAP_CREDENTIAL' && data.credential) {
        exchangeCredential(data.credential)
      } else if (data?.type === 'GOOGLE_ONE_TAP_ERROR') {
        toast.error('Google sign-in could not be completed on this browser.')
      }
    }
    window.addEventListener('message', onMessage)
    return () => window.removeEventListener('message', onMessage)
  }, [exchangeCredential])

  // Preload the GSI script eagerly so One Tap is instant when the drawer opens.
  useEffect(() => {
    loadGsiScript().catch((err) => console.error('[Google One Tap]', err.message))

    return () => {
      if (window.google?.accounts?.id) {
        window.google.accounts.id.cancel()
      }
      promptedRef.current = false
    }
  }, [])

  return (
    <div
      ref={promptParentRef}
      className={`fixed right-4 top-24 z-[60] ${pathname === '/' && !isAuthenticated ? 'block' : 'hidden'}`}
      aria-hidden="true"
    />
  )
}
