/**
 * schema.org / JSON-LD builders.
 *
 * Every block is emitted through <JsonLd /> in the relevant page or layout.
 * Validate changes with https://search.google.com/test/rich-results.
 */
import {
  CONTACT,
  SITE_DESCRIPTION,
  SITE_LOGO,
  SITE_NAME,
  SITE_URL,
  SOCIAL_LINKS,
  absoluteUrl,
} from "@/lib/site";
import type { Program } from "@/lib/programs";

/** Stable @id for the organisation so other nodes can reference it by URI. */
export const ORG_ID = `${SITE_URL}/#organization`;
export const WEBSITE_ID = `${SITE_URL}/#website`;

export function organizationSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "EducationalOrganization",
    "@id": ORG_ID,
    name: SITE_NAME,
    alternateName: "AQI Online",
    url: SITE_URL,
    description: SITE_DESCRIPTION,
    logo: {
      "@type": "ImageObject",
      url: absoluteUrl(SITE_LOGO),
      caption: `${SITE_NAME} logo`,
    },
    image: absoluteUrl("/images/og-default.png"),
    email: CONTACT.email,
    telephone: CONTACT.phone,
    // Classes are delivered online only, so the audience is not geo-bound.
    areaServed: "Worldwide",
    knowsLanguage: ["en", "ur", "ar"],
    // Only include profiles that genuinely belong to the organisation —
    // see SOCIAL_LINKS in lib/site.ts.
    ...(SOCIAL_LINKS.length ? { sameAs: SOCIAL_LINKS } : {}),
    contactPoint: [
      {
        "@type": "ContactPoint",
        contactType: "admissions",
        email: CONTACT.email,
        telephone: CONTACT.phone,
        url: absoluteUrl("/contact"),
        availableLanguage: ["English", "Urdu", "Arabic"],
      },
    ],
  };
}

export function websiteSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": WEBSITE_ID,
    url: SITE_URL,
    name: SITE_NAME,
    description: SITE_DESCRIPTION,
    inLanguage: "en",
    publisher: { "@id": ORG_ID },
  };
}

export function courseSchema(program: Program) {
  return {
    "@context": "https://schema.org",
    "@type": "Course",
    "@id": absoluteUrl(`/programs/${program.slug}#course`),
    name: program.title,
    alternateName: program.urduTitle,
    description: program.description,
    url: absoluteUrl(`/programs/${program.slug}`),
    inLanguage: ["en", "ur"],
    provider: {
      "@type": "EducationalOrganization",
      "@id": ORG_ID,
      name: SITE_NAME,
      url: SITE_URL,
    },
    // Google reads courseMode / courseWorkload from the CourseInstance.
    hasCourseInstance: {
      "@type": "CourseInstance",
      courseMode: "Online",
      courseWorkload: program.duration,
      instructor: {
        "@type": "Organization",
        "@id": ORG_ID,
      },
    },
    // Kept as a top-level hint as well — some consumers only read Course.
    courseMode: "Online",
    educationalLevel: program.ageGroup,
    teaches: program.features,
  };
}

/** ItemList of every course, for the /programs hub page. */
export function courseListSchema(programs: Program[]) {
  return {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: `Courses at ${SITE_NAME}`,
    itemListElement: programs.map((program, i) => ({
      "@type": "ListItem",
      position: i + 1,
      url: absoluteUrl(`/programs/${program.slug}`),
      name: program.title,
    })),
  };
}

export type Testimonial = {
  name: string;
  quote: string;
  role?: string;
  country?: string;
};

/**
 * Review schema for the testimonials section.
 *
 * NOTE: no `reviewRating` is emitted because the source testimonials carry no
 * star rating — inventing one would be fabricated structured data. Also note
 * Google does not show review rich results for reviews an organisation hosts
 * about itself ("self-serving reviews"); this markup is for entity
 * understanding, not for stars in the SERP.
 */
export function reviewListSchema(testimonials: Testimonial[]) {
  return {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: `Student and parent testimonials for ${SITE_NAME}`,
    itemListElement: testimonials.map((t, i) => ({
      "@type": "ListItem",
      position: i + 1,
      item: {
        "@type": "Review",
        author: {
          "@type": "Person",
          name: t.name,
          ...(t.country ? { address: t.country } : {}),
        },
        reviewBody: t.quote,
        itemReviewed: {
          "@type": "EducationalOrganization",
          "@id": ORG_ID,
          name: SITE_NAME,
        },
      },
    })),
  };
}

export type FaqItem = { question: string; answer: string };

export function faqSchema(items: FaqItem[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map(({ question, answer }) => ({
      "@type": "Question",
      name: question,
      acceptedAnswer: { "@type": "Answer", text: answer },
    })),
  };
}

export function breadcrumbSchema(crumbs: { name: string; path: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: crumbs.map((crumb, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: crumb.name,
      item: absoluteUrl(crumb.path),
    })),
  };
}
