'use client'

import { useRef } from 'react'
import { useRouter } from 'next/navigation'
import { Dialog as DialogPrimitive } from 'radix-ui'
import { motion } from 'framer-motion'
import { X } from 'lucide-react'

import JoinTherapistForm from './JoinTherapistForm'

/**
 * Full-screen "Join as a Therapist" onboarding modal.
 *
 * Mounted through the `/join-as-therapist` intercepted route (@modal/(.)join-as-therapist).
 * Rendered on top of the current page; the browser URL is `/join-as-therapist`
 * while the underlying page stays mounted.
 *
 * Closing (X button, Escape, browser Back) returns the URL to the previous route.
 */
export default function JoinTherapistModal() {
  const router = useRouter()
  const contentRef = useRef(null)

  const closeModal = () => {
    router.back()
  }

  return (
    <DialogPrimitive.Root open onOpenChange={(open) => (open ? null : closeModal())}>
      <DialogPrimitive.Portal>
        {/* Calm, professional overlay — covers the viewport and blocks interaction with the page below. */}
        <DialogPrimitive.Overlay className="fixed inset-0 z-[60] bg-slate-900/40 backdrop-blur-[3px] data-open:animate-in data-open:fade-in-0" />

        <DialogPrimitive.Content
          ref={contentRef}
          className="fixed inset-0 z-[70] flex items-center justify-center outline-none sm:p-6"
          onInteractOutside={(event) => event.preventDefault()}
          onPointerDownOutside={(event) => event.preventDefault()}
          onFocusOutside={(event) => event.preventDefault()}
          onOpenAutoFocus={(event) => {
            // Move focus to the first form field instead of the dialog chrome.
            event.preventDefault()
            const focusTarget = contentRef.current?.querySelector('[data-join-focus]')
            if (focusTarget) focusTarget.focus()
          }}
        >
          <motion.div
            initial={{ opacity: 0, y: 14, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.25, ease: 'easeOut' }}
            className="relative flex h-full w-full flex-col overflow-hidden bg-white shadow-float sm:h-[88vh] sm:max-w-3xl sm:rounded-3xl sm:border sm:border-slate-100"
          >
            {/* Accessible dialog title/description (visible heading lives in the form). */}
            <DialogPrimitive.Title className="sr-only">Join as a Therapist</DialogPrimitive.Title>
            <DialogPrimitive.Description className="sr-only">
              Two-step application to join the Centre for Psychological Health therapist network.
            </DialogPrimitive.Description>

            {/* Close button — clear, comfortable target, with hover + focus states. */}
            <DialogPrimitive.Close asChild>
              <button
                type="button"
                aria-label="Close"
                className="absolute right-3 top-3 z-10 flex h-10 w-10 items-center justify-center rounded-full border border-slate-200 bg-white/95 text-slate-500 shadow-sm transition-all hover:border-teal-300 hover:bg-teal-50 hover:text-teal-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-500 focus-visible:ring-offset-2"
              >
                <X className="h-5 w-5" />
              </button>
            </DialogPrimitive.Close>

            <JoinTherapistForm mode="modal" />
          </motion.div>
        </DialogPrimitive.Content>
      </DialogPrimitive.Portal>
    </DialogPrimitive.Root>
  )
}