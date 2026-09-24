// Shared helpers for the blog module: safe image handling, payload
// normalization, date formatting, reading time and heading extraction.

/**
 * Normalize an image src to a safe HTTPS URL.
 * - strips surrounding whitespace
 * - upgrades `http://` -> `https://`
 * - upgrades protocol-relative `//` -> `https://`
 * Returns `undefined` for falsy / non-string input so callers can fall back.
 */
export function parseImageSrc(src) {
  if (!src || typeof src !== 'string') return undefined;
  const trimmed = src.trim();
  if (!trimmed) return undefined;
  if (trimmed.startsWith('http://')) return trimmed.replace('http://', 'https://');
  if (trimmed.startsWith('//')) return `https:${trimmed}`;
  return trimmed;
}

/**
 * Extract an array of items from any of the payload shapes the API returns:
 * plain array, `{ results }`, `{ data }`, or `{ data: { results } }`.
 */
export function extractList(payload) {
  if (Array.isArray(payload)) return payload;
  if (!payload || typeof payload !== 'object') return [];
  if (Array.isArray(payload.results)) return payload.results;
  if (Array.isArray(payload.data?.results)) return payload.data.results;
  if (Array.isArray(payload.data)) return payload.data;
  return [];
}

/**
 * Pull a single object out of a detail response regardless of nesting.
 */
export function extractOne(payload) {
  if (payload && typeof payload === 'object' && payload.data && payload.data.id) {
    return payload.data;
  }
  if (payload && typeof payload === 'object' && payload.id !== undefined) return payload;
  return payload || null;
}

/**
 * Format an ISO date string as a human readable date.
 */
export function formatDate(iso, options) {
  if (!iso) return '';
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return '';
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    ...options,
  });
}

/**
 * Generate a URL-safe slug from a title (mirrors Django's slugify).
 */
export function slugifyTitle(title = '') {
  return title
    .toLowerCase()
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9\s-]/g, '')
    .trim()
    .replace(/[\s_]+/g, '-')
    .replace(/-{2,}/g, '-');
}

/**
 * Estimate reading time in minutes based on a 200 wpm average.
 */
export function estimateReadTime(html = '') {
  const text = html
    .replace(/<[^>]+>/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
  const words = text ? text.split(' ').length : 0;
  return Math.max(1, Math.round(words / 200));
}

/**
 * Add stable `id` attributes to every h2/h3 in the content HTML and return
 * the enriched HTML plus a flat list of headings for the table of contents.
 */
export function prepareContent(html = '') {
  const headings = [];
  let index = 0;
  const enriched = html.replace(
    /<h([23])([^>]*)>([\s\S]*?)<\/h\1>/gi,
    (match, level, attrs, inner) => {
      index += 1;
      const id = `heading-${index}`;
      const text = inner.replace(/<[^>]+>/g, '').trim();
      const safeAttrs = attrs.includes('id=') ? attrs : `${attrs} id="${id}"`.trim();
      headings.push({ id, text, level: Number(level) });
      return `<h${level}${safeAttrs}>${inner}</h${level}>`;
    }
  );
  return { html: enriched, headings };
}

/**
 * Human-readable error message from an axios / DRF error payload.
 */
export function toErrorMessage(error) {
  const data = error?.response?.data;
  if (!data) {
    if (error?.code === 'ECONNABORTED') return 'Request timed out. Please try again.';
    return error?.message || 'Something went wrong. Please try again.';
  }
  if (typeof data === 'string') return data;
  if (typeof data.detail === 'string') return data.detail;
  if (Array.isArray(data.detail)) return data.detail[0];
  if (typeof data.message === 'string') return data.message;
  const firstKey = Object.keys(data)[0];
  if (!firstKey) return 'Something went wrong. Please try again.';
  const firstValue = data[firstKey];
  if (Array.isArray(firstValue)) return firstValue[0] || 'Something went wrong. Please try again.';
  if (typeof firstValue === 'string') return firstValue;
  return 'Something went wrong. Please try again.';
}
