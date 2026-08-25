import type { MetadataRoute } from "next";
import { programs } from "@/lib/programs";
import { absoluteUrl } from "@/lib/site";

/**
 * Served at /sitemap.xml.
 *
 * Public, indexable routes only — dashboards (/students, /teacher, /admin,
 * /session, /video-call, /currentUser, /messages, /signup/account) are
 * noindex'd in their layouts and must never appear here, or Search Console
 * reports "Submitted URL marked noindex".
 */
export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();

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
    lastModified,
    changeFrequency: "monthly" as const,
    priority: 0.8,
  }));

  return [
    ...staticRoutes.map(({ path, changeFrequency, priority }) => ({
      url: absoluteUrl(path),
      lastModified,
      changeFrequency,
      priority,
    })),
    ...programRoutes,
  ];
}
