const TOKEN_KEY = 'token';
const COOKIE_MAX_AGE = 60 * 60 * 24; // 1 day in seconds

/**
 * Token persistence.
 *
 * The cookie exists only so `middleware.ts` can tell logged-in from logged-out
 * before the page renders. It is readable by JavaScript, which means an XSS
 * would get the token — the proper fix is for the backend to set an
 * `HttpOnly; Secure; SameSite=Lax` cookie on login and for this module to go
 * away entirely (axios already sends `withCredentials: true`).
 */
function cookieAttributes() {
  const secure =
    typeof window !== 'undefined' && window.location.protocol === 'https:'
      ? '; Secure'
      : '';
  return `path=/; SameSite=Lax${secure}`;
}

/** Store token in both localStorage and a cookie (for middleware access) */
export function setAuthToken(token: string) {
  if (typeof window === 'undefined') return;
  localStorage.setItem(TOKEN_KEY, token);
  document.cookie = `${TOKEN_KEY}=${token}; ${cookieAttributes()}; max-age=${COOKIE_MAX_AGE}`;
}

/** Remove token from both localStorage and the cookie */
export function clearAuthToken() {
  if (typeof window === 'undefined') return;
  localStorage.removeItem(TOKEN_KEY);
  document.cookie = `${TOKEN_KEY}=; ${cookieAttributes()}; max-age=0`;
}

/** Read token from localStorage */
export function getAuthToken(): string | null {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem(TOKEN_KEY);
}
