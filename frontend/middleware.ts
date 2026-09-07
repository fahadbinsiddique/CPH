import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // ── Auth Guard for /dashboard routes ──────────────────────────────
  if (pathname.startsWith('/dashboard')) {
    const accessToken = request.cookies.get('access_token');
    if (!accessToken) {
      const loginUrl = new URL('/', request.url);
      loginUrl.searchParams.set('message', 'login_required');
      return NextResponse.redirect(loginUrl);
    }
  }

  const response = NextResponse.next();

  // Signal to Django that the original client request was HTTPS,
  // so SECURE_SSL_REDIRECT does not issue a 301 back to HTTPS.
  response.headers.set('X-Forwarded-Proto', 'https');

  // ── Security Headers ──────────────────────────────────────────────
  response.headers.set('X-Frame-Options', 'DENY');
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

  // Content Security Policy
  response.headers.set(
    'Content-Security-Policy',
    [
      "default-src 'self'",
      "script-src 'self' 'unsafe-eval' 'unsafe-inline' https://www.googletagmanager.com https://www.google-analytics.com https://*.tawk.to https://accounts.google.com https://ssl.gstatic.com https://connect.facebook.net https://cdn.jsdelivr.net",
      "style-src 'self' 'unsafe-inline' https://accounts.google.com https://*.tawk.to",
      "img-src 'self' https://images.unsplash.com https://res.cloudinary.com https://centreforpsychologicalhealth.com https://*.tawk.to https://lh3.googleusercontent.com https://ssl.gstatic.com https://www.facebook.com https://*.google.com https://cdn.jsdelivr.net data: blob:",
      "font-src 'self' https://*.tawk.to",
      "connect-src 'self' http://localhost:8000 https://psychology-backend-29vm.onrender.com https://www.google-analytics.com https://analytics.google.com https://*.tawk.to wss://*.tawk.to https://accounts.google.com https://connect.facebook.net https://www.facebook.com",
      "frame-src https://www.googletagmanager.com https://*.tawk.to https://accounts.google.com",
      "object-src 'none'",
      "base-uri 'self'",
      "form-action 'self'",
    ].join('; '),
  );

  return response;
}

export const config = {
  matcher: [
    // Exclude static assets, API proxy routes (handled by next.config.mjs rewrites),
    // and image files from the proxy middleware.
    '/((?!_next/static|_next/image|favicon.ico|robots.txt|sitemap.xml|api/|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};