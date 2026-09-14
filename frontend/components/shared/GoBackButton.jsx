'use client'

import { ArrowLeft } from 'lucide-react'

export default function GoBackButton() {
  return (
    <button onClick={() => window.history.back()} className="btn-outline">
      <ArrowLeft className="h-4 w-4" />
      Go Back
    </button>
  )
}
