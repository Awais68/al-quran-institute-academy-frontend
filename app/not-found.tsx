import type { Metadata } from "next";
import Link from "next/link";
import { programs } from "@/lib/programs";
import { CONTACT, SITE_NAME } from "@/lib/site";

export const metadata: Metadata = {
  title: "Page not found",
  // A 404 must never be indexed, and it should not pass its own canonical.
  robots: { index: false, follow: true },
};

export default function NotFound() {
  return (
    <main className="min-h-[70vh] bg-white">
      <div className="container mx-auto px-4 sm:px-6 py-16 sm:py-24 max-w-3xl">
        <p className="text-sm uppercase tracking-wide text-primary-700">
          404 — Page not found
        </p>
        <h1 className="mt-3 text-3xl sm:text-4xl font-bold text-gray-900">
          We couldn&apos;t find that page
        </h1>
        <p className="mt-4 text-gray-600 leading-relaxed">
          The link may be out of date, or the address may have a typo. Here is
          everything {SITE_NAME} offers — one of these is probably what you were
          looking for.
        </p>

        <div className="mt-10">
          <h2 className="text-lg font-semibold text-gray-900">Our programs</h2>
          <ul className="mt-4 grid gap-2 sm:grid-cols-2">
            {programs.map((program) => (
              <li key={program.slug}>
                <Link
                  href={`/programs/${program.slug}`}
                  className="block rounded-md border border-gray-200 px-4 py-3 text-gray-800 hover:border-primary-400 hover:bg-primary-50 transition-colors"
                >
                  {program.title}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div className="mt-10 flex flex-wrap gap-3">
          <Link
            href="/"
            className="rounded-md bg-primary-700 px-5 py-2.5 text-white font-medium hover:bg-primary-800 transition-colors"
          >
            Go to homepage
          </Link>
          <Link
            href="/contact"
            className="rounded-md border border-gray-300 px-5 py-2.5 font-medium text-gray-800 hover:bg-gray-50 transition-colors"
          >
            Contact us
          </Link>
          <a
            href={CONTACT.whatsapp}
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-md border border-gray-300 px-5 py-2.5 font-medium text-gray-800 hover:bg-gray-50 transition-colors"
          >
            WhatsApp
          </a>
        </div>
      </div>
    </main>
  );
}
