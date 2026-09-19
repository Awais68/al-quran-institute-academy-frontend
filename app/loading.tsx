import { Skeleton } from "@/components/ui/skeleton";

/**
 * Route transition fallback. Without this, navigating to a data-heavy page
 * leaves the previous screen frozen until the fetch resolves — which, against a
 * backend that can take tens of seconds to wake up, reads as a broken link.
 */
export default function Loading() {
  return (
    <div className="container mx-auto px-4 sm:px-6 py-12 sm:py-16" aria-busy="true">
      <span className="sr-only">Loading…</span>
      <Skeleton className="h-9 w-2/3 max-w-md" />
      <Skeleton className="mt-4 h-4 w-full max-w-2xl" />
      <Skeleton className="mt-2 h-4 w-5/6 max-w-xl" />
      <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <Skeleton key={i} className="h-40 w-full rounded-lg" />
        ))}
      </div>
    </div>
  );
}
