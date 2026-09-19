/**
 * Canonical origin + shared brand facts for the public site.
 * Everything (metadataBase, canonical tags, Open Graph, sitemap, JSON-LD)
 * derives from this one module, so switching domains or updating a social
 * handle later is a single-line change.
 */
export const SITE_URL = (
  process.env.NEXT_PUBLIC_SITE_URL || "https://alquraninstituteonline.com"
).replace(/\/$/, "");

export const SITE_NAME = "Al-Quran Institute Online";

/** Default <title> for the site root. Kept under ~60 chars for SERP display. */
export const SITE_TITLE =
  "Online Quran Academy — Hifz, Tajweed & Nazrah Courses";

export const SITE_DESCRIPTION =
  "Al-Quran Institute Online is an online Quran academy offering one-to-one Hifz-ul-Quran, Tajweed, Nazrah and Qaida classes, plus Arabic and Islamic education for all ages. Book a free trial class.";

/** Default 1200x630 social share card used by every page without its own image. */
export const OG_IMAGE = {
  url: "/images/og-default.png",
  width: 1200,
  height: 630,
  alt: `${SITE_NAME} — online Quran classes in Hifz, Tajweed and Nazrah`,
} as const;

export const SITE_LOGO = "/images/al-quran-institute-online-logo-transparent.png";

export const CONTACT = {
  email: "aqionline786@gmail.com",
  phone: "+923403201940",
  phoneDisplay: "+92-340-3201940",
  whatsapp: "https://wa.me/923403201940",
} as const;

/**
 * Official profiles for schema.org `sameAs`.
 * Only add profiles that genuinely belong to the organisation — a wrong
 * `sameAs` links the wrong entity to the brand in Google's knowledge graph.
 */
export const SOCIAL_LINKS: string[] = [
  // Deliberately empty. The entries here used to be a developer's personal
  // Facebook/Instagram profiles, which would tie the wrong person to the brand
  // in Google's knowledge graph. Add the institute's own pages — nothing else.
];

/** Build an absolute URL on the canonical origin. */
export function absoluteUrl(path = "/"): string {
  return `${SITE_URL}${path.startsWith("/") ? path : `/${path}`}`;
}
