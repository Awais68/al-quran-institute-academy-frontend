/**
 * NOTE: this file wins over `next.config.mjs`. Next.js resolves `next.config.js`
 * first, so anything added to a `.mjs` sibling is silently ignored. Keep all
 * configuration here.
 *
 * @type {import('next').NextConfig}
 */

// Canonical host — every other hostname 301s here. Keep in sync with lib/site.ts.
const CANONICAL_HOST = "alquraninstituteonline.com";

// Backend origin the browser is allowed to call. Keep in sync with
// app/constant/constant.js.
const BACKEND_ORIGIN =
  process.env.NEXT_PUBLIC_API_BASE_URL ||
  "https://al-quran-institute-online-backend.onrender.com";

const nextConfig = {
  eslint: {
    // Lint runs as part of the build. The config in eslint.config.mjs keeps
    // the pre-existing debt at "warn" so only new hard errors break a deploy.
    ignoreDuringBuilds: false,
  },
  typescript: {
    // The codebase type-checks cleanly, so let the build fail on real errors
    // rather than shipping them. (A syntax error in a stale `page_backup.tsx`
    // used to make `tsc` skip semantic checks entirely and hide 12 of them.)
    ignoreBuildErrors: false,
  },
  images: {
    // Widths the optimizer is allowed to emit for `fill` / `sizes`-driven
    // images. 3840 stays in the list for genuine full-bleed 4K displays, but
    // because every image now declares a real `sizes`, the browser only asks
    // for the width it actually renders at.
    deviceSizes: [360, 414, 640, 750, 828, 1080, 1200, 1440, 1920, 2048, 3840],
    // Widths used for fixed-size images (logos, avatars, thumbnails).
    imageSizes: [16, 32, 48, 64, 96, 128, 160, 200, 256, 320, 384],
    // AVIF first, WebP fallback — both far smaller than the source PNGs.
    formats: ["image/avif", "image/webp"],
    // Cache optimized variants at the edge for 30 days.
    minimumCacheTTL: 60 * 60 * 24 * 30,
    // `images.domains` is deprecated in Next 15 and removed in 16.
    remotePatterns: [
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
        port: "",
        pathname: "/**",
      },
    ],
  },
  async headers() {
    // Content-Security-Policy is deliberately Report-Only for now: the app
    // loads Cloudinary images, talks to the backend over XHR + websockets, and
    // Tailwind/Next inject inline styles. Watch the violation reports, then
    // switch this to `Content-Security-Policy` once it is clean.
    const csp = [
      "default-src 'self'",
      // 'unsafe-inline'/'unsafe-eval' are required by the Next.js runtime.
      "script-src 'self' 'unsafe-inline' 'unsafe-eval'",
      "style-src 'self' 'unsafe-inline'",
      "img-src 'self' data: blob: https://res.cloudinary.com",
      "media-src 'self' blob:",
      "font-src 'self' data:",
      `connect-src 'self' ${BACKEND_ORIGIN} ${BACKEND_ORIGIN.replace(/^https/, "wss")} https://api.cloudinary.com`,
      "frame-ancestors 'none'",
      "base-uri 'self'",
      "form-action 'self'",
      "object-src 'none'",
    ].join("; ");

    return [
      {
        source: "/:path*",
        headers: [
          // Clickjacking. `frame-ancestors` above is the modern equivalent;
          // X-Frame-Options stays for older browsers.
          { key: "X-Frame-Options", value: "DENY" },
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          // Camera and microphone are needed by the video call pages, so they
          // are allowed for this origin only. Everything else is denied.
          {
            key: "Permissions-Policy",
            value: "camera=(self), microphone=(self), geolocation=(), interest-cohort=()",
          },
          {
            key: "Strict-Transport-Security",
            value: "max-age=63072000; includeSubDomains; preload",
          },
          { key: "X-DNS-Prefetch-Control", value: "on" },
          { key: "Content-Security-Policy-Report-Only", value: csp },
        ],
      },
      {
        // The service worker must never be served from a stale cache, or a bad
        // version pins itself in place.
        source: "/sw.js",
        headers: [
          { key: "Cache-Control", value: "no-cache, no-store, must-revalidate" },
        ],
      },
    ];
  },
  async redirects() {
    return [
      {
        // www.alquraninstituteonline.com/<anything> -> alquraninstituteonline.com/<anything>
        source: "/:path*",
        has: [{ type: "host", value: `www.${CANONICAL_HOST}` }],
        destination: `https://${CANONICAL_HOST}/:path*`,
        // Explicit 301 rather than `permanent: true` (which emits 308) so older
        // SEO crawlers and audit tools see the status code they expect.
        statusCode: 301,
      },
      {
        // The homepage "#programs" anchor is fine, but bare /program(s) variants
        // and old links should land on the real page rather than 404.
        source: "/program",
        destination: "/programs",
        permanent: true,
      },
      {
        source: "/courses",
        destination: "/programs",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
