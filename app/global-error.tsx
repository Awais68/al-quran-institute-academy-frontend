"use client";

import { useEffect } from "react";

/**
 * Last resort: an error thrown in the root layout itself, where `app/error.tsx`
 * cannot render because the layout it lives in is the thing that failed. This
 * component replaces the whole document, so it must render <html> and <body>
 * and cannot rely on the app's fonts or providers.
 */
export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Global error:", error);
  }, [error]);

  return (
    <html lang="en">
      <body
        style={{
          margin: 0,
          minHeight: "100vh",
          display: "grid",
          placeItems: "center",
          fontFamily: "system-ui, -apple-system, sans-serif",
          background: "#ffffff",
          color: "#111827",
          padding: "2rem",
        }}
      >
        <main style={{ maxWidth: "32rem", textAlign: "center" }}>
          <h1 style={{ fontSize: "1.5rem", margin: "0 0 0.75rem" }}>
            Something went wrong
          </h1>
          <p style={{ color: "#4b5563", lineHeight: 1.6, margin: "0 0 1.5rem" }}>
            The application failed to load. Please reload the page — if it keeps
            happening, contact us on WhatsApp at +92-340-3201940.
          </p>
          <button
            onClick={reset}
            style={{
              background: "#1f6f5c",
              color: "#ffffff",
              border: "none",
              borderRadius: "0.375rem",
              padding: "0.65rem 1.25rem",
              fontSize: "1rem",
              cursor: "pointer",
            }}
          >
            Reload
          </button>
        </main>
      </body>
    </html>
  );
}
