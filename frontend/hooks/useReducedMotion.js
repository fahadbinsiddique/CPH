'use client';

import { useEffect, useState } from 'react';

/**
 * Hook to detect user's reduced motion preference
 * Returns true if user prefers reduced motion
 * Follows WCAG 2.3.3 Animation from Interactions
 */
export function useReducedMotion() {
  const [reduceMotion, setReduceMotion] = useState(false);

  useEffect(() => {
    // Check initial preference
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setReduceMotion(mediaQuery.matches);

    // Listen for changes
    const handler = (event) => setReduceMotion(event.matches);
    
    if (mediaQuery.addEventListener) {
      mediaQuery.addEventListener('change', handler);
    } else {
      // Safari < 14 support
      mediaQuery.addListener(handler);
    }

    return () => {
      if (mediaQuery.removeEventListener) {
        mediaQuery.removeEventListener('change', handler);
      } else {
        mediaQuery.removeListener(handler);
      }
    };
  }, []);

  return reduceMotion;
}

/**
 * Hook to get motion-safe variants for framer-motion
 * Returns empty objects when reduced motion is preferred
 */
export function useMotionVariants(variants) {
  const reduceMotion = useReducedMotion();
  
  if (reduceMotion) {
    return {
      initial: false,
      animate: false,
      exit: false,
      transition: { duration: 0 },
      ...variants,
    };
  }
  
  return variants;
}

export default useReducedMotion;