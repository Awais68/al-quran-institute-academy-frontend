import type { FaqItem } from "@/lib/schema";
import { CONTACT, SITE_NAME } from "@/lib/site";
import { programTitles } from "@/lib/programs";

/**
 * FAQ content shown on /contact and emitted as FAQPage JSON-LD.
 *
 * Every answer here restates information already published elsewhere on the
 * site (course list, schedule, free trial, contact details). Google requires
 * FAQ markup to match visible page content, so edit this list — never the
 * markup alone.
 */
export const faqs: FaqItem[] = [
  {
    question: "Do you offer a free trial class?",
    answer:
      "Yes. Sign up with your name, contact details and the course you want, and our team will contact you within 24 hours to arrange a free trial class with a qualified teacher. No payment is required to start.",
  },
  {
    question: "Are the classes one-to-one or in a group?",
    answer:
      "Classes are taught one-to-one so the teacher can work at your own pace and correct your recitation directly.",
  },
  {
    question: "Which courses does Al-Quran Institute Online offer?",
    answer: `${SITE_NAME} offers ${programTitles.join(", ")}.`,
  },
  {
    question: "How often are classes held?",
    answer:
      "Most courses run five days a week. Class length is typically one hour, or two half-hour sessions, depending on the course and the student's age.",
  },
  {
    question: "Are female teachers available for female students?",
    answer:
      "Yes. Both male and female teachers are available, so female students and children can be matched with a female teacher on request.",
  },
  {
    question: "Do students receive a certificate?",
    answer:
      "Yes. Students receive a certificate on completion of their course, including Hifz-ul-Quran, Tajweed, Nazrah Quran and the Qaida course.",
  },
  {
    question: "How do I contact Al-Quran Institute Online?",
    answer: `You can reach us on WhatsApp at ${CONTACT.phoneDisplay} or by email at ${CONTACT.email}.`,
  },
];
