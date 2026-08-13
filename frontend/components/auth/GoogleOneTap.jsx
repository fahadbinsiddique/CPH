'use client'
import { useEffect, useCallback, useRef } from 'react'
import axios from 'axios'
import useAuthStore from '@/store/authStore'
import useUiStore from '@/store/uiStore'

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8000'

export default function GoogleOneTap({ onLoginSuccess }) {
  const nonceRef = useRef(null)

  const handleGoogleResponse = useCallback(
    async (response) => {
      try {
        const res = await axios.post(
          `${API_BASE_URL}/api/auth/google/`,
          {
            token: response.credential,
            nonce: nonceRef.current,
          },
          { withCredentials: true },
        )

        if (res.status === 200 && res.data.success) {
          // Keep the auth store in sync so the Navbar / guards reflect the session
          // without requiring a full page reload.
          await useAuthStore.getState().fetchMe()

          // Close the login drawer in case the user was prompted to log in in-place.
          useUiStore.getState().closeLoginDrawer()

          if (onLoginSuccess) {
            onLoginSuccess(res.data.user)
          } else {
            window.location.reload()
          }
        }
      } catch (error) {
        console.error('Google One Tap Login Failed:', error)
      }
    },
    [onLoginSuccess],
  )

  useEffect(() => {
    let isMounted = true

    const checkAuthAndInitOneTap = async () => {
      try {
        await axios.get(`${API_BASE_URL}/api/auth/me/`, { withCredentials: true });

        return
      } catch (err) {
        if (!isMounted) return

        // Dedupe: React StrictMode double-mounts effects in dev, which would
        // append the GSI script twice and re-initialize Google.
        if (window.google?.accounts?.id) {
          initializeOneTap()
          return
        }

        const script = document.createElement('script')
        script.src = 'https://accounts.google.com/gsi/client'
        script.async = true
        script.defer = true
        document.body.appendChild(script)

        script.onload = () => {
          if (isMounted && window.google) initializeOneTap()
        }

        script.onerror = () => {
          console.error('[Google One Tap] Failed to load GSI client script.')
        }
      }
    }

    const initializeOneTap = () => {
      nonceRef.current = crypto.randomUUID()

      window.google.accounts.id.initialize({
        client_id: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID,
        callback: handleGoogleResponse,
        nonce: nonceRef.current,
        // Force the legacy iframe prompt. FedCM's token retrieval is fragile
        // (e.g. under 3P-cookie blocking) and surfaces as a silent NetworkError.
        use_fedcm_for_prompt: false,
      })

      // Inspect the notification so skipped reasons are never invisible again.
      window.google.accounts.id.prompt((notification) => {
        if (notification.isNotDisplayed() || notification.isSkippedMoment()) {
          console.warn(
            '[Google One Tap] prompt suppressed:',
            notification.getNotDisplayedReason() || notification.getSkippedReason()
          )
        }
      })
    }

    checkAuthAndInitOneTap()

    return () => {
      isMounted = false
      if (window.google?.accounts?.id) {
        window.google.accounts.id.cancel()
      }
    }
  }, [handleGoogleResponse])

  return null
}
