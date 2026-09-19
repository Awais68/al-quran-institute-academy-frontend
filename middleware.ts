import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Routes that require authentication (any role).
//
// This is a first filter, not the authorisation boundary. Middleware only sees
// an opaque token, so it cannot tell a Student from an Admin — the real check
// belongs on the backend endpoints these pages call. What it does buy us is
// that an anonymous visitor never receives the prerendered dashboard shell.
const protectedRoutes = [
  '/students',
  '/teacher',
  '/currentUser',
  '/admin',
  '/session',
  '/video-call',
  '/change-password',
];

// Routes that should redirect authenticated users away (account creation).
// NOTE: '/signup' itself is a public, indexable lead-capture page — it must NOT
// be redirected, or the canonical URL would 302 for logged-in users and crawlers.
const authRoutes = ['/signup/account'];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const token =
    request.cookies.get('token')?.value ||
    request.headers.get('authorization')?.replace('Bearer ', '');

  // Signup: a logged-in user has no business on the account creation page.
  const isAuthRoute = authRoutes.some((route) => pathname.startsWith(route));
  if (isAuthRoute && token) {
    return NextResponse.redirect(new URL('/', request.url));
  }

  // Protected pages: no token means no dashboard HTML. `next` carries the
  // requested path so the login modal can send the user back afterwards.
  const isProtectedRoute = protectedRoutes.some((route) => pathname.startsWith(route));
  if (isProtectedRoute && !token) {
    const loginUrl = new URL('/', request.url);
    loginUrl.searchParams.set('next', pathname);
    const response = NextResponse.redirect(loginUrl);
    // Never let an intermediary cache the redirect against the real page.
    response.headers.set('Cache-Control', 'no-store');
    return response;
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
    '/change-password',
    '/signup/account',
  ],
};
