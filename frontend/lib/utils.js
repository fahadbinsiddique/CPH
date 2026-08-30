import { clsx } from "clsx";
import { twMerge } from "tailwind-merge"

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

export function normalizeProfileImage(src) {
  if (!src || typeof src !== 'string') return undefined
  const trimmed = src.trim()
  if (!trimmed) return undefined
  if (trimmed.startsWith('http://')) return trimmed.replace('http://', 'https://')
  if (trimmed.startsWith('//')) return `https:${trimmed}`
  return trimmed
}
