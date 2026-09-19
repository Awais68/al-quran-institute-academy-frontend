/**
 * Minimal fixed-window rate limiter for Route Handlers.
 *
 * Deliberately in-memory: this app has no Redis/KV binding, and a per-instance
 * counter still removes the trivial "curl in a for-loop" abuse that costs us
 * Resend quota and fills the backend with junk leads. Its limits:
 *   - state is per serverless instance, so the effective limit is
 *     (limit x instances) under load;
 *   - it resets on cold start.
 * When a durable store is available, swap the Map for it — the call site does
 * not change. Anything that must be strictly enforced belongs on the backend.
 */

type Window = { count: number; resetAt: number };

const windows = new Map<string, Window>();

// Bound the map so a spray of spoofed X-Forwarded-For values can't grow it
// without limit. Eviction is oldest-reset-first, which is also the entry
// closest to being useless.
const MAX_TRACKED_KEYS = 5_000;

function evictIfNeeded() {
  if (windows.size < MAX_TRACKED_KEYS) return;
  const now = Date.now();
  for (const [key, window] of windows) {
    if (window.resetAt <= now) windows.delete(key);
  }
  if (windows.size < MAX_TRACKED_KEYS) return;
  // Still full: drop the entry that expires soonest.
  let oldestKey: string | null = null;
  let oldestReset = Infinity;
  for (const [key, window] of windows) {
    if (window.resetAt < oldestReset) {
      oldestReset = window.resetAt;
      oldestKey = key;
    }
  }
  if (oldestKey) windows.delete(oldestKey);
}

export interface RateLimitResult {
  allowed: boolean;
  remaining: number;
  /** Seconds until the window resets — send as Retry-After. */
  retryAfter: number;
}

export function rateLimit(
  key: string,
  limit: number,
  windowMs: number
): RateLimitResult {
  const now = Date.now();
  const existing = windows.get(key);

  if (!existing || existing.resetAt <= now) {
    evictIfNeeded();
    windows.set(key, { count: 1, resetAt: now + windowMs });
    return { allowed: true, remaining: limit - 1, retryAfter: 0 };
  }

  existing.count += 1;
  const retryAfter = Math.max(1, Math.ceil((existing.resetAt - now) / 1000));
  if (existing.count > limit) {
    return { allowed: false, remaining: 0, retryAfter };
  }
  return { allowed: true, remaining: limit - existing.count, retryAfter };
}

/**
 * Best-effort client IP. X-Forwarded-For is client-controlled in general, but
 * on Vercel the platform rewrites it, so the first entry is trustworthy there.
 */
export function clientIp(request: Request): string {
  const forwarded = request.headers.get("x-forwarded-for");
  if (forwarded) return forwarded.split(",")[0]!.trim();
  return request.headers.get("x-real-ip")?.trim() || "unknown";
}
