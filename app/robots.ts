import type { MetadataRoute } from "next";
import { absoluteUrl } from "@/lib/site";

/**
 * Served at /robots.txt.
 *
 * The authenticated app areas (/students, /teacher, /admin, /session,
 * /video-call, /currentUser, /messages, /studentbyId, /signup/account) are kept
 * out of the index with `robots: { index: false }` in their own layouts, and
 * are deliberately NOT disallowed here: a crawler blocked by robots.txt never
 * fetches the page, so it never sees the noindex and the URL can still surface
 * as a bare listing. Only the internal API is blocked from crawling.
 */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/api/"],
      },
    ],
    sitemap: absoluteUrl("/sitemap.xml"),
    host: absoluteUrl("/").replace(/\/$/, ""),
  };
}
