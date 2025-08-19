// middleware.js
import { NextResponse } from 'next/server';
import { NextRequest } from 'next/server';

export function middleware(request) {
  const token = request.cookies.get('token')?.value;
  const protectedPaths = ['/profile'];
  const isProtected = protectedPaths.some((path) =>
    {
      return request.nextUrl.pathname.startsWith(path)
    }
  );

  if (isProtected && !token) {
    const loginUrl = new URL('/', request.url);
    return NextResponse.redirect(loginUrl);
  }
  return NextResponse.next();
}

export const config = {
  matcher: ['/profile/:path*'],
};
