import { NextResponse } from 'next/server'

// Routes that require an authenticated session.
const PROTECTED_PREFIX = ['/dashboard']

export function proxy(request) {
  const { pathname } = request.nextUrl

  const isProtected = PROTECTED_PREFIX.some(
    (prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`)
  )

  if (!isProtected) return NextResponse.next()

  // JWT tokens are HttpOnly cookies, so only the server can inspect them here.
  // This is a first-layer guard; AuthGuard still verifies the session against
  // the backend (fetchMe) before rendering protected content.
  const hasAccessToken = Boolean(request.cookies.get('access_token')?.value)
  const hasRefreshToken = Boolean(request.cookies.get('refresh_token')?.value)

  if (!hasAccessToken && !hasRefreshToken) {
    const url = new URL('/', request.url)
    url.searchParams.set('message', 'login_required')
    return NextResponse.redirect(url)
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/dashboard/:path*'],
}