import type { MetadataRoute } from "next";
import { PROGRAMS_UPDATED_AT, programs } from "@/lib/programs";
import { absoluteUrl } from "@/lib/site";

/**
 * Served at /sitemap.xml.
 *
 * Public, indexable routes only — dashboards (/students, /teacher, /admin,
 * /session, /video-call, /currentUser, /messages, /signup/account) are
 * noindex'd in their layouts and must never appear here, or Search Console
 * reports "Submitted URL marked noindex".
 */
/**
 * Per-route edit dates, YYYY-MM-DD. These are deliberately hand-maintained
 * rather than new Date(): a <lastmod> that moves on every crawl is noise, and
 * Google stops trusting the whole sitemap. Bump the one route you edited.
 */
const ROUTE_UPDATED_AT: Record<string, string> = {
  "/": "2026-09-19",
  "/about": "2026-08-25",
  "/programs": PROGRAMS_UPDATED_AT,
  "/faculty": "2026-08-25",
  "/gallery": "2026-08-25",
  "/testimonials": "2026-08-25",
  "/contact": "2026-09-19",
  "/signup": "2026-09-19",
};

export default function sitemap(): MetadataRoute.Sitemap {
  const staticRoutes: {
    path: string;
    changeFrequency: MetadataRoute.Sitemap[number]["changeFrequency"];
    priority: number;
  }[] = [
    { path: "/", changeFrequency: "weekly", priority: 1 },
    { path: "/about", changeFrequency: "monthly", priority: 0.8 },
    { path: "/programs", changeFrequency: "weekly", priority: 0.9 },
    { path: "/faculty", changeFrequency: "monthly", priority: 0.7 },
    { path: "/gallery", changeFrequency: "monthly", priority: 0.6 },
    { path: "/testimonials", changeFrequency: "monthly", priority: 0.6 },
    { path: "/contact", changeFrequency: "monthly", priority: 0.8 },
    { path: "/signup", changeFrequency: "monthly", priority: 0.9 },
  ];

  const programRoutes = programs.map((program) => ({
    url: absoluteUrl(`/programs/${program.slug}`),
    lastModified: new Date(program.updatedAt ?? PROGRAMS_UPDATED_AT),
    changeFrequency: "monthly" as const,
    priority: 0.8,
  }));

  return [
    ...staticRoutes.map(({ path, changeFrequency, priority }) => ({
      url: absoluteUrl(path),
      lastModified: new Date(ROUTE_UPDATED_AT[path] ?? PROGRAMS_UPDATED_AT),
      changeFrequency,
      priority,
    })),
    ...programRoutes,
  ];
}
