/**
 * Shared visual metadata for the assessment experience.
 * Kept in sync with the site brand: calm teal/emerald foundation with
 * restrained, distinct category tones so screening cards stay scannable
 * without feeling like a dashboard.
 */

export const CATEGORY_META = {
  stress: {
    label: 'Stress',
    badge: 'bg-teal-50 text-teal-700 ring-teal-200/70',
    tile: 'from-teal-50 to-emerald-50 ring-teal-100',
    bar: 'bg-gradient-to-r from-teal-500 to-emerald-500',
    ring: 'group-hover:border-teal-300/70 group-hover:shadow-teal-900/5',
  },
  anxiety: {
    label: 'Anxiety',
    badge: 'bg-amber-50 text-amber-700 ring-amber-200/70',
    tile: 'from-amber-50 to-orange-50 ring-amber-100',
    bar: 'bg-gradient-to-r from-amber-500 to-orange-400',
    ring: 'group-hover:border-amber-300/70 group-hover:shadow-amber-900/5',
  },
  depression: {
    label: 'Depression',
    badge: 'bg-sky-50 text-sky-700 ring-sky-200/70',
    tile: 'from-sky-50 to-indigo-50 ring-sky-100',
    bar: 'bg-gradient-to-r from-sky-500 to-indigo-500',
    ring: 'group-hover:border-sky-300/70 group-hover:shadow-sky-900/5',
  },
  burnout: {
    label: 'Burnout',
    badge: 'bg-rose-50 text-rose-700 ring-rose-200/70',
    tile: 'from-rose-50 to-pink-50 ring-rose-100',
    bar: 'bg-gradient-to-r from-rose-500 to-pink-500',
    ring: 'group-hover:border-rose-300/70 group-hover:shadow-rose-900/5',
  },
  sleep: {
    label: 'Sleep',
    badge: 'bg-indigo-50 text-indigo-700 ring-indigo-200/70',
    tile: 'from-indigo-50 to-violet-50 ring-indigo-100',
    bar: 'bg-gradient-to-r from-indigo-500 to-violet-500',
    ring: 'group-hover:border-indigo-300/70 group-hover:shadow-indigo-900/5',
  },
  wellbeing: {
    label: 'Wellbeing',
    badge: 'bg-emerald-50 text-emerald-700 ring-emerald-200/70',
    tile: 'from-emerald-50 to-green-50 ring-emerald-100',
    bar: 'bg-gradient-to-r from-emerald-500 to-green-500',
    ring: 'group-hover:border-emerald-300/70 group-hover:shadow-emerald-900/5',
  },
  adhd: {
    label: 'ADHD',
    badge: 'bg-violet-50 text-violet-700 ring-violet-200/70',
    tile: 'from-violet-50 to-purple-50 ring-violet-100',
    bar: 'bg-gradient-to-r from-violet-500 to-purple-500',
    ring: 'group-hover:border-violet-300/70 group-hover:shadow-violet-900/5',
  },
  social: {
    label: 'Social',
    badge: 'bg-cyan-50 text-cyan-700 ring-cyan-200/70',
    tile: 'from-cyan-50 to-sky-50 ring-cyan-100',
    bar: 'bg-gradient-to-r from-cyan-500 to-sky-500',
    ring: 'group-hover:border-cyan-300/70 group-hover:shadow-cyan-900/5',
  },
}

export function getCategoryMeta(category) {
  return CATEGORY_META[category] || CATEGORY_META.stress
}

/**
 * Severity tones. Warm-to-alert progression (soft → strong) but each level
 * keeps a calm, low-saturation treatment rather than alarmist styling.
 */
export const SEVERITY_META = {
  minimal: {
    label: 'Minimal',
    text: 'text-emerald-700',
    bg: 'bg-emerald-50',
    bar: 'bg-gradient-to-r from-emerald-500 to-teal-500',
    border: 'border-emerald-200',
    ring: 'ring-emerald-200',
    dot: 'bg-emerald-500',
    chip: 'bg-emerald-50 text-emerald-700 ring-emerald-200/70',
  },
  mild: {
    label: 'Mild',
    text: 'text-amber-700',
    bg: 'bg-amber-50',
    bar: 'bg-gradient-to-r from-amber-500 to-yellow-500',
    border: 'border-amber-200',
    ring: 'ring-amber-200',
    dot: 'bg-amber-500',
    chip: 'bg-amber-50 text-amber-700 ring-amber-200/70',
  },
  moderate: {
    label: 'Moderate',
    text: 'text-orange-700',
    bg: 'bg-orange-50',
    bar: 'bg-gradient-to-r from-orange-500 to-amber-500',
    border: 'border-orange-200',
    ring: 'ring-orange-200',
    dot: 'bg-orange-500',
    chip: 'bg-orange-50 text-orange-700 ring-orange-200/70',
  },
  severe: {
    label: 'Severe',
    text: 'text-rose-700',
    bg: 'bg-rose-50',
    bar: 'bg-gradient-to-r from-rose-500 to-red-500',
    border: 'border-rose-200',
    ring: 'ring-rose-200',
    dot: 'bg-rose-500',
    chip: 'bg-rose-50 text-rose-700 ring-rose-200/70',
  },
}

export const getSeverityMeta = (severity) =>
  SEVERITY_META[severity] || SEVERITY_META.minimal

export const formatAssessmentDate = (iso) =>
  new Date(iso).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })

export const formatCompactDate = (iso) =>
  new Date(iso).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  })