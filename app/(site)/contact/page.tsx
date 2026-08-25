import type { Metadata } from "next";
import Contact from "@/components/contact";
import PageHero from "@/components/page-hero";
import JsonLd from "@/components/json-ld";
import { pageMetadata } from "@/lib/seo";
import { faqSchema } from "@/lib/schema";
import { faqs } from "@/lib/faqs";
import { CONTACT } from "@/lib/site";

export async function generateMetadata(): Promise<Metadata> {
  return pageMetadata({
    title: "Contact Us — Online Quran Classes",
    description:
      "Contact Al-Quran Institute Online to book a free trial Quran class. Message us on WhatsApp at +92-340-3201940, email aqionline786@gmail.com, or send us your details and we will reply within 24 hours.",
    path: "/contact",
    keywords: [
      "contact online Quran academy",
      "book free trial Quran class",
      "online Quran classes enquiry",
    ],
  });
}

export default function ContactPage() {
  return (
    <main>
      {/* FAQPage markup mirrors the visible Q&A below — Google requires the
          answers to be present on the page, not only in the JSON-LD. */}
      <JsonLd data={faqSchema(faqs)} />

      <PageHero
        title="Contact Al-Quran Institute Online"
        description="Have a question about our online Quran classes, or ready to book a free trial? Message us on WhatsApp, send an email, or use the form below — we reply within 24 hours."
      >
        <div className="flex flex-wrap gap-4 text-sm">
          <a
            href={CONTACT.whatsapp}
            target="_blank"
            rel="noopener noreferrer"
            className="font-medium text-blue-700 underline"
          >
            WhatsApp {CONTACT.phoneDisplay}
          </a>
          <a
            href={`mailto:${CONTACT.email}`}
            className="font-medium text-blue-700 underline"
          >
            {CONTACT.email}
          </a>
        </div>
      </PageHero>

      <Contact />

      <section
        id="faq"
        aria-labelledby="faq-heading"
        className="border-t border-blue-100 bg-white"
      >
        <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6 sm:py-16">
          <h2
            id="faq-heading"
            className="text-2xl font-bold tracking-tight text-blue-900 sm:text-3xl"
          >
            Frequently asked questions
          </h2>
          <dl className="mt-8 divide-y divide-blue-100 border-t border-blue-100">
            {faqs.map((faq) => (
              <div key={faq.question} className="py-5">
                <dt className="text-base font-semibold text-gray-900">
                  {faq.question}
                </dt>
                <dd className="mt-2 text-sm leading-relaxed text-gray-600 sm:text-base">
                  {faq.answer}
                </dd>
              </div>
            ))}
          </dl>
        </div>
      </section>
    </main>
  );
}
