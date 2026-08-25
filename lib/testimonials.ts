/**
 * Testimonials, shared by components/testimonials.tsx (display) and
 * lib/schema.ts (Review JSON-LD) so the markup can never describe a
 * testimonial the page does not actually show.
 *
 * Only add entries that are complete and genuine: a real person, their real
 * words. Review markup on fabricated testimonials is a manual-action risk.
 */
export type Testimonial = {
  id: number;
  name: string;
  role: string;
  country: string;
  image: string;
  quote: string;
};

export const testimonials: Testimonial[] = [
  {
    id: 1,
    name: "Ahmed Khan",
    role: "Parent",
    country: "London, UK",
    image: "/images/quran-classroom-teacher-and-students.png",
    quote:
      "Al Quran Institute Online has transformed my understanding of the Quran. The teachers are knowledgeable and patient.",
  },
  {
    id: 2,
    name: "Fatima Ali",
    role: "Former Student",
    country: "Toronto, Canada",
    image: "/images/quran-teacher-teaching-children.png",
    quote:
      "My children love their online Quran classes. The interactive teaching methods are excellent.",
  },
  {
    id: 3,
    name: "Abdullah Rahman",
    role: "Community Leader",
    country: "Sydney, Australia",
    image: "/images/man-reading-quran-in-mosque.png",
    quote:
      "Flexible scheduling and quality education. Highly recommend for busy professionals.",
  },
];
