'use client'

import { MotionConfig } from 'framer-motion'

/**
 * Global motion provider.
 * `reducedMotion="user"` makes every framer-motion animation on the site
 * respect the visitor's `prefers-reduced-motion` OS setting automatically.
 */
export default function MotionProvider({ children }) {
  return <MotionConfig reducedMotion="user">{children}</MotionConfig>
}
