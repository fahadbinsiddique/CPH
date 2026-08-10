'use client'
import { useEffect, useCallback } from 'react'
import axios from 'axios'

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8000'

export default function GoogleOneTap({ onLoginSuccess }) {
  const handleGoogleResponse = useCallback(
    async (response) => {
      try {
        const res = await axios.post(
          `${API_BASE_URL}/api/auth/google/`,
          {
            token: response.credential,
          },
          { withCredentials: true },
        )

        if (res.status === 200 && res.data.success) {
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

        const script = document.createElement('script')
        script.src = 'https://accounts.google.com/gsi/client'
        script.async = true
        script.defer = true
        document.body.appendChild(script)

        script.onload = () => {
          if (window.google) {
            window.google.accounts.id.initialize({
              client_id: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID,
              callback: handleGoogleResponse,
            })

            window.google.accounts.id.prompt()
          }
        }
      }
    }

    checkAuthAndInitOneTap()

    return () => {
      isMounted = false
    }
  }, [handleGoogleResponse])

  return null
}
