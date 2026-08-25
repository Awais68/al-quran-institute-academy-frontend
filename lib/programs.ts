/**
 * Single source of truth for the course catalogue.
 *
 * Plain data only (no JSX) so it can be imported from Server Components,
 * Client Components and the /api/signup route alike. components/programs.tsx
 * keeps its own presentational copy for the homepage section; this module
 * drives /programs, /programs/[slug] and signup course validation.
 */

export type Program = {
  slug: string;
  title: string;
  urduTitle: string;
  tagline: string;
  description: string;
  duration: string;
  schedule: string;
  ageGroup: string;
  features: string[];
};

export const programs: Program[] = [
  {
    slug: "hifz-ul-quran",
    title: "Hifz-ul-Quran",
    urduTitle: "حفظ القرآن",
    tagline: "Complete memorization of the Holy Quran.",
    description:
      "Complete memorization of the Holy Quran with proper tajweed and understanding of the text. Our experienced instructors guide students through a structured program that ensures correct memorization, strong retention and confident recitation.",
    duration: "3-5 years",
    schedule: "Daily, 5 days a week",
    ageGroup: "1 hour class & 1/2 half hour classes",
    features: [
      "One-to-One classes individually",
      "Regular revision (dawr) sessions",
      "Tajweed rules application",
      "Proven memorization techniques",
      "Certification upon completion",
    ],
  },
  {
    slug: "tajweed",
    title: "Tajweed",
    urduTitle: "تجوید",
    tagline: "Master the rules of beautiful Quranic recitation.",
    description:
      "Learn the proper pronunciation and recitation rules of the Holy Quran. This program focuses on the correct articulation of Arabic letters, practical application of Tajweed rules, and beautiful, accurate recitation.",
    duration: "1-2 years",
    schedule: "Daily, 5 days a week",
    ageGroup: "All ages",
    features: [
      "Makharij (articulation points) training",
      "Rules of recitation",
      "Practical application with a qualified teacher",
      "Regular recitation practice",
      "Certification upon completion",
    ],
  },
  {
    slug: "nazrah-quran",
    title: "Nazrah Quran",
    urduTitle: "ناظرہ قرآن",
    tagline: "Perfecting your Quranic recitation.",
    description:
      "Fluent, accurate reading of the Holy Quran directly from the mushaf, with Tajweed applied throughout. Ideal for students who can already identify Arabic letters and want to build speed, accuracy and confidence.",
    duration: "1-2 years",
    schedule: "Daily, 5 days a week",
    ageGroup: "1 hour class & 1/2 half hour classes",
    features: [
      "One-to-One classes individually",
      "Regular revision sessions",
      "Tajweed rules application",
      "Certification upon completion",
    ],
  },
  {
    slug: "qaida",
    title: "Qaida Course",
    urduTitle: "قاعدہ",
    tagline: "The foundation course for absolute beginners.",
    description:
      "The Noorani Qaida is the starting point for every Quran learner. Students master Arabic letters, their sounds, joining rules and basic Tajweed before moving on to Nazrah Quran.",
    duration: "3-6 months",
    schedule: "Daily, 5 days a week",
    ageGroup: "All ages, no prior knowledge needed",
    features: [
      "Letter recognition and correct pronunciation",
      "Harakat, madd and joining rules",
      "Step-by-step beginner-friendly pace",
      "One-to-One classes individually",
      "Certification upon completion",
    ],
  },
  {
    slug: "arabic-language",
    title: "Arabic Language",
    urduTitle: "عربی زبان",
    tagline: "Understand the language of the Quran.",
    description:
      "Learn classical and conversational Arabic so you can understand the Quran and Sunnah in their original language. Covers grammar (nahw), morphology (sarf) and practical vocabulary.",
    duration: "1-2 years",
    schedule: "Flexible, 3-5 days a week",
    ageGroup: "All ages",
    features: [
      "Nahw (grammar) and Sarf (morphology)",
      "Quranic vocabulary building",
      "Reading and comprehension practice",
      "Conversational Arabic sessions",
      "Certification upon completion",
    ],
  },
  {
    slug: "islamic-studies",
    title: "Islamic Studies",
    urduTitle: "اسلامی تعلیمات",
    tagline: "Aqeedah, Fiqh, Seerah and Hadith fundamentals.",
    description:
      "A structured curriculum covering the essentials every Muslim should know: correct beliefs (aqeedah), worship and daily rulings (fiqh), the life of the Prophet ﷺ (seerah) and selected ahadith.",
    duration: "1-2 years",
    schedule: "Flexible, 3-5 days a week",
    ageGroup: "All ages",
    features: [
      "Aqeedah and Tawheed foundations",
      "Fiqh of worship and daily life",
      "Seerah of the Prophet ﷺ",
      "Selected Hadith study",
      "Certification upon completion",
    ],
  },
  {
    slug: "namaz-course",
    title: "Namaz Course",
    urduTitle: "نماز کورس",
    tagline: "Learn to pray correctly, step by step.",
    description:
      "A focused short course teaching the complete method of salah: wudu, the postures, the supplications, and the common rulings — with correct Arabic pronunciation throughout.",
    duration: "2-3 months",
    schedule: "Flexible, 3-5 days a week",
    ageGroup: "All ages",
    features: [
      "Wudu and purification rulings",
      "Every posture of salah in order",
      "Memorization of the required duas",
      "Correct Arabic pronunciation",
      "Certification upon completion",
    ],
  },
];

/** Course names accepted by the signup form / API, in display order. */
export const programTitles = programs.map((p) => p.title);

export function getProgramBySlug(slug: string): Program | undefined {
  return programs.find((p) => p.slug === slug);
}
