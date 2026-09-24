'use client'

import { useEffect } from 'react'
import { AlertTriangle, RefreshCw, Home } from 'lucide-react'
import Link from 'next/link'

export default function GlobalError({ error, reset }) {
  useEffect(() => {
    console.error('Unhandled error:', error)
  }, [error])

  return (
    <div className="relative flex min-h-[70vh] items-center justify-center overflow-hidden px-6">
      {/* Background accents */}
      <div className="pointer-events-none absolute inset-0" aria-hidden="true">
        <div className="absolute -top-32 -left-28 h-96 w-96 rounded-full bg-rose-100/30 blur-3xl" />
        <div className="absolute -bottom-48 -right-24 h-[28rem] w-[28rem] rounded-full bg-orange-100/30 blur-3xl" />
      </div>

      <div className="relative z-10 mx-auto max-w-md text-center">
        {/* Icon */}
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-rose-50 ring-1 ring-rose-100">
          <AlertTriangle className="h-8 w-8 text-rose-500" />
        </div>

        {/* Heading */}
        <h1 className="mt-6 font-heading text-2xl font-bold tracking-tight text-stone-900 md:text-3xl">
          Something went wrong
        </h1>

        {/* Description */}
        <p className="mt-3 text-base leading-relaxed text-stone-500">
          An unexpected error occurred. Please try again or return to the home page.
        </p>

        {/* Error detail (dev only) */}
        {process.env.NODE_ENV === 'development' && error?.message && (
          <p className="mt-4 rounded-xl bg-stone-100 p-3 font-mono text-xs text-stone-600">
            {error.message}
          </p>
        )}

        {/* Actions */}
        <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
          <button onClick={reset} className="btn-primary">
            <RefreshCw className="h-4 w-4" />
            Try Again
          </button>
          <Link href="/" className="btn-outline">
            <Home className="h-4 w-4" />
            Go Home
          </Link>
        </div>
      </div>
    </div>
  )
}
