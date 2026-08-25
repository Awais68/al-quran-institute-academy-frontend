import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Routes that require authentication (any role)
const protectedRoutes = ['/students', '/teacher', '/currentUser', '/admin', '/session', '/video-call'];

// Routes that should redirect authenticated users away (login/signup)
const authRoutes = ['/signup'];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const token = request.cookies.get('token')?.value ||
                request.headers.get('authorization')?.replace('Bearer ', '');

  // Check if token exists in cookie (for SSR-aware check)
  // Note: localStorage is not accessible in middleware (server-side),
  // so we rely on an auth cookie or a special header if set.
  // The client-side pages still handle their own redirects via AuthContext.

  // For auth routes (signup): if user has a token cookie, redirect to home
  // This prevents logged-in users from seeing signup page
  const isAuthRoute = authRoutes.some(route => pathname.startsWith(route));
  if (isAuthRoute && token) {
    return NextResponse.redirect(new URL('/', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/students/:path*',
    '/teacher/:path*',
    '/currentUser/:path*',
    '/admin/:path*',
    '/session/:path*',
    '/video-call/:path*',
    '/signup',
  ],
};
