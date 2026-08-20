// Server-only data access for SEO surfaces (sitemap, generateMetadata, JSON-LD).
// Uses plain fetch because lib/api.js is browser-coupled (IndexedDB/offline queue)
// and must never be imported from server code. Every call is guarded by try/catch
// plus a timeout so the Docker `next build` (which runs without a live backend)
// always succeeds and falls back to empty results.

const API_BASE = (process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8000').replace(/\/+$/, '')

const REVALIDATE = {
  sitemap: 3600,
  detail: 600,
}

async function fetchJson(path, revalidate = REVALIDATE.detail) {
  const controller = new AbortController()
  const timer = setTimeout(() => controller.abort(), 8000)
  try {
    const res = await fetch(`${API_BASE}${path}`, {
      signal: controller.signal,
      headers: { Accept: 'application/json' },
      next: { revalidate },
    })
    clearTimeout(timer)
    if (!res.ok) return null
    return await res.json()
  } catch {
    clearTimeout(timer)
    return null
  }
}

// Published, publicly indexable blog posts (the API already filters by status).
export async function fetchPublishedBlogs() {
  const items = []
  let page = 1
  let next = true
  for (page = 1; page <= 50 && next; page += 1) {
    const data = await fetchJson(`/api/blogs/?page_size=30&page=${page}`, REVALIDATE.sitemap)
    if (!data || !Array.isArray(data.results)) break
    items.push(...data.results)
    next = Boolean(data.next)
  }
  return items
}

// Verified, publicly directory-listed consultants.
export async function fetchConsultants() {
  const data = await fetchJson('/api/consultants/?page_size=100', REVALIDATE.sitemap)
  if (Array.isArray(data)) return data
  if (data && Array.isArray(data.results)) return data.results
  return []
}

// Active psychological assessments.
export async function fetchAssessments() {
  const data = await fetchJson('/api/assessments/', REVALIDATE.sitemap)
  if (Array.isArray(data)) return data
  if (data && Array.isArray(data.results)) return data.results
  return []
}

export async function fetchBlogBySlug(slug) {
  if (!slug) return null
  return fetchJson(`/api/blogs/${encodeURIComponent(slug)}/`, REVALIDATE.detail)
}

export async function fetchConsultantBySlug(slug) {
  if (!slug) return null
  return fetchJson(`/api/consultants/${encodeURIComponent(slug)}/`, REVALIDATE.detail)
}