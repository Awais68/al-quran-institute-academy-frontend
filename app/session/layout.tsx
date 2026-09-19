import type { Metadata } from "next";

// Private / non-marketing route: keep it out of the index and give it its own
// canonical so it never inherits the homepage canonical from the root layout.
export const metadata: Metadata = {
  title: "Class Session",
  alternates: { canonical: "/session" },
  robots: { index: false, follow: false, nocache: true },
};

export default function SessionLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
