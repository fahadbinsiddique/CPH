'use client'

import { Loader2 } from 'lucide-react'

export default function RootLoading() {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center gap-4">
      <div className="relative">
        <Loader2 className="h-8 w-8 animate-spin text-teal-600" />
        <div className="absolute inset-0 h-8 w-8 animate-ping rounded-full border-2 border-teal-100 opacity-20" />
      </div>
      <p className="text-sm font-medium tracking-wide text-stone-400">Loading...</p>
    </div>
  )
}
