'use client';

/**
 * Web Vitals tracking for dashboard performance monitoring
 * Reports to console in dev, can be extended to send to analytics
 */

const VITALS_THRESHOLDS = {
  LCP: { good: 2500, poor: 4000 },      // Largest Contentful Paint
  FID: { good: 100, poor: 300 },        // First Input Delay
  CLS: { good: 0.1, poor: 0.25 },       // Cumulative Layout Shift
  FCP: { good: 1800, poor: 3000 },      // First Contentful Paint
  TTFB: { good: 800, poor: 1800 },      // Time to First Byte
  INP: { good: 200, poor: 500 },        // Interaction to Next Paint
};

function getRating(name, value) {
  const threshold = VITALS_THRESHOLDS[name];
  if (!threshold) return 'unknown';
  if (value <= threshold.good) return 'good';
  if (value >= threshold.poor) return 'poor';
  return 'needs-improvement';
}

function sendToAnalytics(metric) {
  // In production, send to your analytics endpoint
  // Example: fetch('/api/analytics/vitals', { method: 'POST', body: JSON.stringify(metric) });
  
  if (process.env.NODE_ENV === 'development') {
    const rating = getRating(metric.name, metric.value);
    const color = rating === 'good' ? 'green' : rating === 'poor' ? 'red' : 'orange';
    console.log(
      `%c[Web Vitals] ${metric.name}: ${metric.value.toFixed(2)}ms (${rating})`,
      `color: ${color}; font-weight: bold`
    );
  }
}

/**
 * Initialize Web Vitals tracking
 * Call once in your root layout or _app
 */
export function initWebVitals() {
  if (typeof window === 'undefined') return;

  // Dynamic import to avoid bundling in server components
  import('web-vitals').then(({ onCLS, onFID, onFCP, onLCP, onTTFB, onINP }) => {
    onCLS(sendToAnalytics);
    onFID(sendToAnalytics);
    onFCP(sendToAnalytics);
    onLCP(sendToAnalytics);
    onTTFB(sendToAnalytics);
    onINP(sendToAnalytics);
  }).catch(() => {
    // web-vitals not installed, silently skip
  });
}

/**
 * Measure custom timing marks
 * Usage: measureTiming('dashboard-render', startMark, endMark)
 */
export function measureTiming(name, startMark, endMark) {
  if (typeof window === 'undefined' || !window.performance) return;
  
  try {
    performance.measure(name, startMark, endMark);
    const entries = performance.getEntriesByName(name, 'measure');
    if (entries.length > 0) {
      const duration = entries[entries.length - 1].duration;
      if (process.env.NODE_ENV === 'development') {
        console.log(`%c[Timing] ${name}: ${duration.toFixed(2)}ms`, 'color: blue');
      }
      return duration;
    }
  } catch (e) {
    // Marks don't exist yet
  }
  return null;
}

/**
 * Mark a timing point
 */
export function markTiming(name) {
  if (typeof window !== 'undefined' && window.performance) {
    performance.mark(name);
  }
}

/**
 * Get navigation timing info
 */
export function getNavigationTiming() {
  if (typeof window === 'undefined' || !window.performance) return null;
  
  const navigation = performance.getEntriesByType('navigation')[0];
  if (!navigation) return null;
  
  return {
    dns: navigation.domainLookupEnd - navigation.domainLookupStart,
    tcp: navigation.connectEnd - navigation.connectStart,
    ttfb: navigation.responseStart - navigation.requestStart,
    download: navigation.responseEnd - navigation.responseStart,
    domInteractive: navigation.domInteractive - navigation.startTime,
    domComplete: navigation.domComplete - navigation.startTime,
    loadComplete: navigation.loadEventEnd - navigation.startTime,
  };
}

export default { initWebVitals, measureTiming, markTiming, getNavigationTiming };