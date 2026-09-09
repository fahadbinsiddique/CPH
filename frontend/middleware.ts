import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// ── Helpers ─────────────────────────────────────────────────────────────────

function decodeJwtPayload(token: string): Record<string, unknown> | null {
  try {
    const parts = token.split('.');
    if (parts.length !== 3) return null;
    const payload = parts[1];
    const decoded = atob(payload.replace(/-/g, '+').replace(/_/g, '/'));
    return JSON.parse(decoded);
  } catch {
    return null;
  }
}

// ── Route → role mapping ────────────────────────────────────────────────────

const ADMIN_ONLY = [
  '/dashboard/users',
  '/dashboard/analytics',
  '/dashboard/blogs',
  '/dashboard/product-tour',
];

const CONSULTANT_ONLY = [
  '/dashboard/availability',
  '/dashboard/patients',
];

const ADMIN_OR_CONSULTANT = [
  '/dashboard/appointments',
];

function getRequiredRole(pathname: string): string | null {
  if (ADMIN_ONLY.some((route) => pathname.startsWith(route))) return 'admin';
  if (CONSULTANT_ONLY.some((route) => pathname.startsWith(route))) return 'consultant';
  if (ADMIN_OR_CONSULTANT.some((route) => pathname.startsWith(route))) return 'staff';
  return null; // no role restriction — any authenticated user can access
}

// ── CSP builder ─────────────────────────────────────────────────────────────

function buildCsp(isProduction: boolean): string {
  const backendUrl = isProduction
    ? 'https://psychology-backend-29vm.onrender.com'
    : 'http://localhost:8000';

  return [
    "default-src 'self'",
    "script-src 'self' 'unsafe-eval' 'unsafe-inline' https://www.googletagmanager.com https://www.google-analytics.com https://*.tawk.to https://accounts.google.com https://ssl.gstatic.com https://connect.facebook.net https://cdn.jsdelivr.net",
    "style-src 'self' 'unsafe-inline' https://accounts.google.com https://*.tawk.to",
    "img-src 'self' https://images.unsplash.com https://res.cloudinary.com https://centreforpsychologicalhealth.com https://*.tawk.to https://lh3.googleusercontent.com https://ssl.gstatic.com https://www.facebook.com https://www.googletagmanager.com https://*.google.com https://cdn.jsdelivr.net data: blob:",
    "font-src 'self' https://*.tawk.to",
    `connect-src 'self' ${backendUrl} https://stats.g.doubleclick.net https://www.google-analytics.com https://analytics.google.com https://*.tawk.to wss://*.tawk.to https://accounts.google.com https://connect.facebook.net https://www.facebook.com`,
    "frame-src https://www.googletagmanager.com https://*.tawk.to https://accounts.google.com",
    "frame-ancestors 'self'",
    "object-src 'none'",
    "base-uri 'self'",
    "form-action 'self'",
  ].join('; ');
}

// ── Middleware ───────────────────────────────────────────────────────────────

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const isProduction = process.env.NODE_ENV === 'production';

  // ── Auth guard for /dashboard routes ────────────────────────────────────
  if (pathname.startsWith('/dashboard')) {
    const accessToken = request.cookies.get('access_token');
    if (!accessToken) {
      const loginUrl = new URL('/', request.url);
      loginUrl.searchParams.set('message', 'login_required');
      return NextResponse.redirect(loginUrl);
    }

    // ── Role-based access control ─────────────────────────────────────────
    const requiredRole = getRequiredRole(pathname);
    if (requiredRole) {
      const payload = decodeJwtPayload(accessToken.value);
      const userRole = payload?.role as string | undefined;

      let allowed = false;
      if (requiredRole === 'staff') {
        // admin-or-consultant routes: both are allowed, clients are not
        allowed = userRole === 'admin' || userRole === 'consultant';
      } else {
        allowed = userRole === requiredRole;
      }

      if (!allowed) {
        const deniedUrl = new URL('/', request.url);
        deniedUrl.searchParams.set('message', 'unauthorized');
        return NextResponse.redirect(deniedUrl);
      }
    }
  }

  const response = NextResponse.next();

  // Signal to Django that the original client request was HTTPS,
  // so SECURE_SSL_REDIRECT does not issue a 301 back to HTTPS.
  response.headers.set('X-Forwarded-Proto', 'https');

  // ── Security Headers ────────────────────────────────────────────────────
  response.headers.set('X-Content-Type-Options', 'nosniff');
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
  response.headers.set(
    'Permissions-Policy',
    'camera=(), microphone=(), geolocation=(), interest-cohort=()',
  );
  response.headers.set('X-XSS-Protection', '1; mode=block');

  // HSTS — only effective over HTTPS
  response.headers.set(
    'Strict-Transport-Security',
    'max-age=31536000; includeSubDomains; preload',
  );

  // Content Security Policy — environment-aware
  response.headers.set('Content-Security-Policy', buildCsp(isProduction));

  return response;
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|robots.txt|sitemap.xml|api/|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};
