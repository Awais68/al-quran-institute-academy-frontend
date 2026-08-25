/**
 * NOTE: this file wins over `next.config.mjs`. Next.js resolves `next.config.js`
 * first, so anything added to a `.mjs` sibling is silently ignored. Keep all
 * configuration here.
 *
 * @type {import('next').NextConfig}
 */

// Canonical host — every other hostname 301s here. Keep in sync with lib/site.ts.
const CANONICAL_HOST = "alquraninstituteonline.com";

const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
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
