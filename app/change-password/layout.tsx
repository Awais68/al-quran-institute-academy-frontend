import type { Metadata } from "next";

// Private route: never indexed, and given its own canonical so it does not
// inherit the homepage canonical from the root layout.
export const metadata: Metadata = {
  // The root layout appends the site name via its title template.
  title: "Change Password",
  alternates: { canonical: "/change-password" },
  robots: { index: false, follow: false, nocache: true },
};

export default function ChangePasswordLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
