"use client";

import { useEffect } from "react";
import Link from "next/link";
import { CONTACT } from "@/lib/site";

/**
 * Route-level error boundary. `components/error-boundary.tsx` only catches
 * client render errors inside the tree it wraps; anything thrown while a route
 * segment renders lands here instead of on the default Next.js error screen.
 */
export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Wire this to an error reporter (Sentry et al.) — right now the only
    // record of a production failure is the user's own console.
    console.error("Route error:", error);
  }, [error]);

  return (
    <main className="min-h-[70vh] bg-white">
      <div className="container mx-auto px-4 sm:px-6 py-16 sm:py-24 max-w-2xl">
        <p className="text-sm uppercase tracking-wide text-red-700">
          Something went wrong
        </p>
        <h1 className="mt-3 text-3xl sm:text-4xl font-bold text-gray-900">
          This page didn&apos;t load
        </h1>
        <p className="mt-4 text-gray-600 leading-relaxed">
          The problem is on our side, not yours. Trying again usually works — the
          server may have been waking up.
        </p>
        {error.digest && (
          <p className="mt-2 text-xs text-gray-400 font-mono">
            Reference: {error.digest}
          </p>
        )}

        <div className="mt-8 flex flex-wrap gap-3">
          <button
            onClick={reset}
            className="rounded-md bg-primary-700 px-5 py-2.5 text-white font-medium hover:bg-primary-800 transition-colors"
          >
            Try again
          </button>
          <Link
            href="/"
            className="rounded-md border border-gray-300 px-5 py-2.5 font-medium text-gray-800 hover:bg-gray-50 transition-colors"
          >
            Go to homepage
          </Link>
          <a
            href={CONTACT.whatsapp}
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-md border border-gray-300 px-5 py-2.5 font-medium text-gray-800 hover:bg-gray-50 transition-colors"
          >
            Tell us on WhatsApp
          </a>
        </div>
      </div>
    </main>
  );
}
