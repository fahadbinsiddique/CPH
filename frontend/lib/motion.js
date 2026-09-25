'use client';

import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

export const prefersReducedMotion = () =>
  typeof window !== 'undefined' &&
  window.matchMedia('(prefers-reduced-motion: reduce)').matches;

export { gsap, ScrollTrigger };

/**
 * Framer Motion variants for dashboard animations
 * Respects prefers-reduced-motion via useReducedMotion hook
 */

/**
 * Container stagger animation - parent orchestrates children
 */
export const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.06, delayChildren: 0.1 },
  },
};

/**
 * Item entrance animation - spring-based for natural feel
 */
export const itemVariants = {
  hidden: { opacity: 0, y: 20, scale: 0.97 },
  show: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { type: 'spring', stiffness: 300, damping: 24 },
  },
};

/**
 * Stat card animation - slightly faster spring
 */
export const statVariants = {
  hidden: { opacity: 0, y: 15, scale: 0.95 },
  show: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { type: 'spring', stiffness: 350, damping: 25 },
  },
};

/**
 * Appointment card animation - layout animation support
 */
export const cardVariants = {
  hidden: { opacity: 0, y: 20, scale: 0.97 },
  show: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { type: 'spring', stiffness: 300, damping: 24 },
  },
};

/**
 * Simple fade-in-up for non-staggered elements
 */
export const fadeInUp = {
  hidden: { opacity: 0, y: 20 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.45, ease: [0.16, 1, 0.3, 1] },
  },
};

/**
 * Page transition variants for AnimatePresence
 */
export const pageVariants = {
  initial: { opacity: 0, y: 10 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -10 },
  transition: { duration: 0.2, ease: 'easeInOut' },
};

/**
 * Modal/dialog variants
 */
export const modalVariants = {
  hidden: { opacity: 0, scale: 0.95, y: 20 },
  show: { 
    opacity: 1, 
    scale: 1, 
    y: 0,
    transition: { type: 'spring', stiffness: 400, damping: 28 }
  },
  exit: { 
    opacity: 0, 
    scale: 0.95, 
    y: 20,
    transition: { duration: 0.15 }
  },
};

/**
 * Tooltip/popover variants
 */
export const tooltipVariants = {
  hidden: { opacity: 0, scale: 0.9, y: 8 },
  show: { 
    opacity: 1, 
    scale: 1, 
    y: 0,
    transition: { type: 'spring', stiffness: 500, damping: 30 }
  },
};

/**
 * Helper to create motion props that respect reduced motion
 * Usage: <motion.div {...getMotionProps(itemVariants)} />
 */
export function getMotionProps(variants, custom = {}) {
  if (prefersReducedMotion()) {
    return {
      initial: false,
      animate: false,
      exit: false,
      transition: { duration: 0 },
      ...custom,
    };
  }
  return {
    variants,
    ...custom,
  };
}

/**
 * Helper for whileHover/whileTap that respect reduced motion
 */
export function getInteractionProps(hover = {}, tap = {}) {
  if (prefersReducedMotion()) {
    return {};
  }
  return {
    whileHover: hover,
    whileTap: tap,
  };
}