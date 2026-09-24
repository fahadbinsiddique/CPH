import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// ── Helpers ─────────────────────────────────────────────────────────────────

function decodeJwtPayload(token: string): Record<string, unknown> | null {
  try {
    const parts = token.split('.');
    if (parts.length !== 3) return null;
    let payload = parts[1].replace(/-/g, '+').replace(/_/g, '/');
    payload += '='.repeat((4 - (payload.length % 4)) % 4); // tolerate unpadded base64url
    return JSON.parse(atob(payload));
  } catch {
    return null;
  }
}

function isPayloadLive(payload: Record<string, unknown> | null): boolean {
  if (!payload) return false;
  const exp = payload.exp as number | undefined;
  return !exp || exp * 1000 >= Date.now();
}

/** Seconds left until the token's exp claim (or a fallback when absent). */
function remainingLifespan(payload: Record<string, unknown> | null, fallback: number): number {
  const exp = payload?.exp;
  if (typeof exp === 'number') return Math.max(1, Math.floor(exp - Date.now() / 1000));
  return fallback;
}

function getJwtSecret(): string | null {
  // Server-side only. AUTH_JWT_SECRET should equal the backend SECRET_KEY so
  // middleware can verify cookie signatures; SECRET_KEY is accepted as a
  // convenience alias. When neither is set, admission falls back to the exp
  // claim alone — the API signature-checks every data call regardless, so a
  // forged cookie still cannot fetch anything.
  const secret = process.env.AUTH_JWT_SECRET || process.env.SECRET_KEY || '';
  return secret || null;
}

function base64UrlFromBytes(bytes: Uint8Array): string {
  let binary = '';
  for (const byte of bytes) binary += String.fromCharCode(byte);
  return btoa(binary).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}

async function verifyJwtSignature(token: string, secret: string): Promise<boolean> {
  // rest_framework_simplejwt signs with HS256; verify with WebCrypto so role
  // and exp claims taken from a client-controlled cookie are never trusted
  // without proof.
  try {
    const parts = token.split('.');
    if (parts.length !== 3) return false;
    const encoder = new TextEncoder();
    const key = await crypto.subtle.importKey(
      'raw',
      encoder.encode(secret),
      { name: 'HMAC', hash: 'SHA-256' },
      false,
      ['sign'],
    );
    const signature = await crypto.subtle.sign(
      'HMAC',
      key,
      encoder.encode(`${parts[0]}.${parts[1]}`),
    );
    const expected = base64UrlFromBytes(new Uint8Array(signature));
    if (expected.length !== parts[2].length) return false;
    let diff = 0; // constant-time-ish comparison
    for (let i = 0; i < expected.length; i += 1) {
      diff |= expected.charCodeAt(i) ^ parts[2].charCodeAt(i);
    }
    return diff === 0;
  } catch {
    return false;
  }
}

// ── Session refresh (middleware-owned) ──────────────────────────────────────

type RefreshOutcome =
  | { status: 'ok'; access: string; refresh: string | null }
  | { status: 'unauthorized' }
  | { status: 'error' };

async function requestSessionRefresh(
  request: NextRequest,
  refreshToken: string,
): Promise<RefreshOutcome> {
  // Talk to Django directly when its URL is configured; otherwise go through
  // the app's own /api proxy (the matcher excludes api/, so no recursion).
  const base = process.env.API_BACKEND_URL || request.url;

  let res: Response;
  try {
    res = await fetch(new URL('/api/auth/refresh/', base), {
      method: 'POST',
      headers: {
        // Accept: without it DEBUG's BrowsableAPIRenderer (listed first)
        // answers with an HTML page instead of JSON and the parse below fails.
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        Cookie: `refresh_token=${refreshToken}`,
      },
      cache: 'no-store',
      signal: AbortSignal.timeout(8000),
    });
  } catch (err) {
    console.error('[auth-middleware] refresh endpoint unreachable:', err);
    return { status: 'error' }; // transient — do not destroy the session
  }

  if (res.status === 401 || res.status === 400) return { status: 'unauthorized' };
  if (!res.ok) return { status: 'error' };

  let access: string | null = null;
  let refresh: string | null = null;
  try {
    const body = await res.json();
    access = body?.access || null;
    refresh = body?.refresh || null;
  } catch {
    // Malformed body — treated as a transient error below.
  }

  if (!access) return { status: 'error' };
  return { status: 'ok', access, refresh };
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
  return null;
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
    "img-src 'self' http://res.cloudinary.com https://res.cloudinary.com https://images.unsplash.com https://centreforpsychologicalhealth.com https://*.tawk.to https://lh3.googleusercontent.com https://ssl.gstatic.com https://www.facebook.com https://www.googletagmanager.com https://*.google.com https://www.google.com.ad https://www.google-analytics.com data: blob:",
    "font-src 'self' https://*.tawk.to",
    `connect-src 'self' ${backendUrl} https://stats.g.doubleclick.net https://www.google-analytics.com https://analytics.google.com https://*.tawk.to wss://*.tawk.to https://accounts.google.com https://connect.facebook.net https://www.facebook.com`,
    "frame-src https://www.googletagmanager.com https://*.tawk.to https://accounts.google.com",
    "frame-ancestors 'self'",
    "object-src 'none'",
    "base-uri 'self'",
    "form-action 'self'",
    "upgrade-insecure-requests",
  ].join('; ');
}

// ── Middleware ──────────────────────────────────────────────────────────────

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const isProduction = process.env.NODE_ENV === 'production';

  // ── Auth gate for /dashboard routes ────────────────────────────────────
  if (pathname.startsWith('/dashboard')) {
    const accessCookie = request.cookies.get('access_token');
    const refreshCookie = request.cookies.get('refresh_token');
    const accessPayload = accessCookie ? decodeJwtPayload(accessCookie.value) : null;
    const refreshPayload = refreshCookie ? decodeJwtPayload(refreshCookie.value) : null;

    let accessLive = isPayloadLive(accessPayload);
    const refreshLive = isPayloadLive(refreshPayload);

    // A live-looking cookie must still prove its signature before we trust
    // its claims (decoding base64 proves nothing — anyone can mint them).
    const jwtSecret = getJwtSecret();
    if (accessLive && accessCookie && jwtSecret) {
      if (!(await verifyJwtSignature(accessCookie.value, jwtSecret))) {
        accessLive = false;
      }
    }

    let sessionPayload: Record<string, unknown> | null = accessLive ? accessPayload : null;
    let rotatedAccess: string | null = null;
    let rotatedRefresh: string | null = null;
    let refreshOutcome: RefreshOutcome | null = null;

    // Access missing/expired/unverified but the refresh cookie is still good
    // → rotate the session HERE. Middleware is the only code that runs before
    // server components AND can write response cookies — cookies().set()
    // throws during a Server Component render in Next.js, which is why the
    // old server-side refresh silently lost every rotated token.
    if (!accessLive && refreshLive && refreshCookie) {
      refreshOutcome = await requestSessionRefresh(request, refreshCookie.value);
      if (refreshOutcome.status === 'ok') {
        rotatedAccess = refreshOutcome.access;
        rotatedRefresh = refreshOutcome.refresh;
        // Minted by our own backend over a server-side fetch → safe to trust.
        sessionPayload = decodeJwtPayload(rotatedAccess);
      }
    }

    // No usable session → clean the jar and bounce. A transient refresh
    // failure (backend unreachable) with a still-live refresh cookie falls
    // through so a network blip doesn't log everyone out; the server render
    // fails gracefully if the session is truly gone.
    if (!sessionPayload) {
      const transient = refreshOutcome?.status === 'error' && refreshLive;
      if (!transient) {
        const loginUrl = new URL('/', request.url);
        loginUrl.searchParams.set(
          'message',
          accessCookie || refreshCookie ? 'session_expired' : 'login_required',
        );
        const redirect = NextResponse.redirect(loginUrl);
        if (accessCookie) redirect.cookies.delete('access_token');
        if (refreshCookie) redirect.cookies.delete('refresh_token');
        return redirect;
      }
    }

    // ── Role-based access control — enforced on every request ────────────
    // Previously skipped whenever the access token was expired, which let a
    // merely-present refresh cookie open admin routes. sessionPayload is only
    // ever a signature-verified cookie, a token just minted by the backend,
    // or (when no secret is configured) an exp-valid cookie — see above.
    const requiredRole = getRequiredRole(pathname);
    if (requiredRole && sessionPayload) {
      const userRole = sessionPayload.role as string | undefined;

      const allowed =
        requiredRole === 'staff'
          ? userRole === 'admin' || userRole === 'consultant'
          : userRole === requiredRole;

      if (!allowed) {
        const deniedUrl = new URL('/', request.url);
        deniedUrl.searchParams.set('message', 'unauthorized');
        return NextResponse.redirect(deniedUrl);
      }
    }

    // Continue the request. If we rotated above, hand the fresh access token
    // to the render via a request header: the request's own cookies still
    // carry the old/expired value for this one render (serverApi reads it).
    const requestHeaders = rotatedAccess ? new Headers(request.headers) : null;
    if (requestHeaders && rotatedAccess) {
      requestHeaders.set('x-access-token', rotatedAccess);
    }

    const response = requestHeaders
      ? NextResponse.next({ request: { headers: requestHeaders } })
      : NextResponse.next();

    if (rotatedAccess) {
      response.cookies.set('access_token', rotatedAccess, {
        httpOnly: true,
        secure: isProduction,
        sameSite: 'lax',
        path: '/',
        maxAge: remainingLifespan(decodeJwtPayload(rotatedAccess), 60),
      });
    }
    if (rotatedRefresh) {
      response.cookies.set('refresh_token', rotatedRefresh, {
        httpOnly: true,
        secure: isProduction,
        sameSite: 'lax',
        path: '/',
        maxAge: remainingLifespan(decodeJwtPayload(rotatedRefresh), 60 * 60 * 24 * 7),
      });
    }

    // Signal to Django that the original client request was HTTPS
    response.headers.set('X-Forwarded-Proto', 'https');

    // ── Security Headers ──────────────────────────────────────────────────
    response.headers.set('X-Content-Type-Options', 'nosniff');
    response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
    response.headers.set(
      'Permissions-Policy',
      'camera=(), microphone=(), geolocation=(), interest-cohort=()',
    );
    response.headers.set('X-XSS-Protection', '1; mode=block');
    response.headers.set(
      'Strict-Transport-Security',
      'max-age=31536000; includeSubDomains; preload',
    );
    response.headers.set('Content-Security-Policy', buildCsp(isProduction));

    return response;
  }

  const response = NextResponse.next();

  // Signal to Django that the original client request was HTTPS,
  // so SECURE_SSL_REDIRECT does not issue a 301 back to HTTPS.
  response.headers.set('X-Forwarded-Proto', 'https');

  // ── Security Headers ────────────────────────────────────────────────────
  response.headers.set('X-Content-Type-Options', 'nosniff');
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
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
    '/((?!_next/static|_next/data|_next/flight|_next/image|favicon.ico|robots.txt|sitemap.xml|api/|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};
