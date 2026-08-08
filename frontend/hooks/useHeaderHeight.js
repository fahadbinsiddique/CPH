'use client'

import { useEffect, useState } from 'react'

/**
 * Measures the fixed site header (TopHeader + Navbar) so pages can offset
 * sticky elements and top padding without hard-coding pixel values that
 * break on mobile/desktop. Returns 0 until the header is measurable.
 */
export function useHeaderHeight() {
  const [height, setHeight] = useState(0)

  useEffect(() => {
    let frame
    let timeout

    const measure = () => {
      const header = document.querySelector('header')
      if (!header) return
      const next = header.offsetHeight
      setHeight((prev) => (prev === next ? prev : next))
    }

    const schedule = () => {
      cancelAnimationFrame(frame)
      frame = requestAnimationFrame(measure)
    }

    // Measure after first paint and again once fonts/images settle.
    measure()
    timeout = setTimeout(measure, 350)

    window.addEventListener('resize', schedule)
    window.addEventListener('scroll', schedule, { passive: true })
    return () => {
      cancelAnimationFrame(frame)
      clearTimeout(timeout)
      window.removeEventListener('resize', schedule)
      window.removeEventListener('scroll', schedule)
    }
  }, [])

  return height
}
