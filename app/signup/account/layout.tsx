import type { Metadata } from "next";

// The public, indexable enrolment page is /signup. This full-registration form
// is a logged-out utility page — noindex, with its own canonical so it doesn't
// inherit the homepage one from the root layout.
export const metadata: Metadata = {
  title: "Create Your Student Account | Al-Quran Institute Online",
  description:
    "Create your Al-Quran Institute Online student account to schedule classes and access your dashboard.",
  alternates: { canonical: "/signup/account" },
  robots: { index: false, follow: true },
};

export default function SignupAccountLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
