import type { Metadata } from "next";
import { OG_IMAGE, SITE_NAME, absoluteUrl } from "@/lib/site";

/**
 * Trim a description to a length Google will display whole, cutting on a word
 * boundary rather than mid-word.
 */
export function truncate(text: string, max = 158): string {
  const clean = text.replace(/\s+/g, " ").trim();
  if (clean.length <= max) return clean;
  const cut = clean.slice(0, max);
  return `${cut.slice(0, cut.lastIndexOf(" ")).replace(/[,;:.\s]+$/, "")}…`;
}

type PageMetaInput = {
  /** Short page title WITHOUT the brand suffix — the root template appends it. */
  title: string;
  description: string;
  /** Route path, e.g. "/about". Drives both canonical and og:url. */
  path: string;
  /** Override the default share card. Relative paths resolve against SITE_URL. */
  image?: { url: string; width?: number; height?: number; alt?: string };
  /** "website" for hub pages, "article" for a single course / post. */
  type?: "website" | "article";
  keywords?: string[];
};

/**
 * Single source of truth for per-page metadata.
 *
 * Every public page calls this so canonical, Open Graph and Twitter Card tags
 * can never drift apart — the most common cause of "WhatsApp shows no preview"
 * is one of the three being present and the other two missing.
 */
export function pageMetadata({
  title,
  description,
  path,
  image = OG_IMAGE,
  type = "website",
  keywords,
}: PageMetaInput): Metadata {
  const url = absoluteUrl(path);
  const ogImage = {
    url: image.url,
    width: image.width ?? 1200,
    height: image.height ?? 630,
    alt: image.alt ?? title,
  };
  // og:title / twitter:title carry the brand explicitly: unlike <title>, they
  // are not run through the root `title.template`.
  const socialTitle = `${title} | ${SITE_NAME}`;

  return {
    title,
    description,
    ...(keywords?.length ? { keywords } : {}),
    alternates: { canonical: path },
    openGraph: {
      type,
      url,
      siteName: SITE_NAME,
      title: socialTitle,
      description,
      locale: "en_US",
      images: [ogImage],
    },
    twitter: {
      card: "summary_large_image",
      title: socialTitle,
      description,
      images: [ogImage.url],
    },
  };
}

/** Metadata for private/app routes: keep them out of the index entirely. */
export function noIndexMetadata(title: string, path: string): Metadata {
  return {
    title,
    alternates: { canonical: path },
    robots: { index: false, follow: false, nocache: true },
  };
}
