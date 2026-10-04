// middleware.js
import { NextResponse } from 'next/server';

// Inlined at build time (NEXT_PUBLIC_*), so it works in the Edge runtime.
const PROMO_ONLY = process.env.NEXT_PUBLIC_PROMO_ONLY === 'true';

export function middleware(request) {
  const { pathname } = request.nextUrl;

  // Promo-only build: only /promo is served. Every other page (/, /prediction,
  // /profile, /bets, ...) redirects to /promo; the main app's API routes 404.
  if (PROMO_ONLY) {
    if (pathname === '/promo' || pathname.startsWith('/promo/')) return NextResponse.next();
    if (pathname.startsWith('/api/')) return new NextResponse('Not found', { status: 404 });
    return NextResponse.redirect(new URL('/promo', request.url));
  }

  // Full site: /profile requires the main-app login cookie.
  const token = request.cookies.get('token')?.value;
  const protectedPaths = ['/profile'];
  const isProtected = protectedPaths.some((path) => pathname.startsWith(path));
  if (isProtected && !token) {
    const loginUrl = new URL('/', request.url);
    return NextResponse.redirect(loginUrl);
  }
  return NextResponse.next();
}

export const config = {
  // Every path except Next.js internals and static files (anything with an extension,
  // e.g. /images/logo.svg, /og-epl-promo.png, fonts).
  matcher: ['/((?!_next/static|_next/image|favicon\\.ico|.*\\.[A-Za-z0-9]+$).*)'],
};
