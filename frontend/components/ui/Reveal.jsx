'use client'

import { useEffect, useRef } from 'react'
import { gsap, ScrollTrigger, prefersReducedMotion } from '@/lib/motion'

/**
 * Reveal — GSAP ScrollTrigger-powered scroll entrance.
 * Animates children into view once, unless the user prefers reduced motion.
 */
export default function Reveal({
  as: Tag = 'div',
  children,
  className,
  y = 30,
  x = 0,
  duration = 0.8,
  delay = 0,
  stagger = 0,
  start = 'top 85%',
  blur = false,
  ...props
}) {
  const ref = useRef(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return

    const targets = stagger
      ? Array.from(el.children)
      : el

    if (prefersReducedMotion()) {
      gsap.set(targets, { clearProps: 'all' })
      return
    }

    const ctx = gsap.context(() => {
      gsap.fromTo(
        targets,
        {
          opacity: 0,
          y,
          x,
          ...(blur ? { filter: 'blur(6px)' } : {}),
        },
        {
          opacity: 1,
          y: 0,
          x: 0,
          ...(blur ? { filter: 'blur(0px)' } : {}),
          duration,
          delay,
          stagger,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: el,
            start,
            once: true,
          },
        }
      )
    }, el)

    return () => {
      ctx.revert()
      ScrollTrigger.refresh()
    }
  }, [y, x, duration, delay, stagger, start, blur])

  return (
    <Tag ref={ref} className={className} {...props}>
      {children}
    </Tag>
  )
}
