import type { Metadata } from "next";
import ProtectedRoute from "@/components/ProtectedRoute";

// Private / non-marketing route: keep it out of the index and give it its own
// canonical so it never inherits the homepage canonical from the root layout.
export const metadata: Metadata = {
  title: "Teacher Dashboard",
  alternates: { canonical: "/teacher" },
  robots: { index: false, follow: false, nocache: true },
};

export default function TeacherLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <ProtectedRoute allowedRoles={["Teacher"]}>{children}</ProtectedRoute>;
}
