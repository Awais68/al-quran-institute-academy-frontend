import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { Card, CardContent } from "@/components/ui/card";
import { programs } from "@/lib/programs";
import { SITE_NAME } from "@/lib/site";
import { pageMetadata } from "@/lib/seo";
import EnrollForm from "./enroll-form";

// Server Component on purpose. The previous version was a single 783-line
// "use client" page gated behind `!mounted || authLoading || user`, so the
// prerendered HTML contained no <h1>, no <form> and no <input> at all.
export async function generateMetadata(): Promise<Metadata> {
  return pageMetadata({
    title: "Sign Up for Online Quran Classes",
    description:
      "Register for online Quran classes with Al-Quran Institute Online. Choose Hifz-ul-Quran, Tajweed, Nazrah Quran, Qaida, Arabic or Islamic Studies and book your free trial class.",
    path: "/signup",
    keywords: [
      "sign up online Quran classes",
      "free trial Quran class",
      "enroll online Quran academy",
    ],
  });
}

export default function SignupPage() {
  return (
    <main className="min-h-screen bg-white">
      <div className="mx-auto grid max-w-6xl gap-8 px-4 py-10 sm:px-6 lg:grid-cols-2 lg:gap-14 lg:py-16">
        {/* Left: server-rendered, crawlable copy */}
        <div>
          <Link href="/" className="inline-flex items-center gap-2">
            <Image
              src="/images/al-quran-institute-online-logo.png"
              alt={SITE_NAME}
              width={220}
              height={72}
              className="h-14 w-auto sm:h-16"
              priority
            />
          </Link>

          <h1 className="mt-6 text-3xl font-bold tracking-tight text-blue-900 sm:text-4xl">
            Sign Up for Online Quran Classes
          </h1>

          <p className="mt-4 text-base leading-relaxed text-gray-600">
            Tell us your name, how to reach you, and the course you want to
            study. A member of our team will contact you within 24 hours to
            arrange a <strong>free trial class</strong> with a qualified
            one-to-one teacher — no payment required to start.
          </p>

          <h2 className="mt-8 text-lg font-semibold text-blue-900">
            Courses you can enroll in
          </h2>
          <ul className="mt-3 grid gap-2 sm:grid-cols-2">
            {programs.map((program) => (
              <li key={program.slug}>
                <Link
                  href={`/programs/${program.slug}`}
                  className="flex items-center gap-2 text-sm text-gray-700 transition-colors hover:text-blue-700"
                >
                  <span
                    aria-hidden="true"
                    className="h-1.5 w-1.5 shrink-0 rounded-full bg-blue-600"
                  />
                  {program.title}
                </Link>
              </li>
            ))}
          </ul>

          <p className="mt-6 text-sm text-gray-500">
            Not sure which course fits?{" "}
            <Link href="/programs" className="font-medium text-blue-700 underline">
              Compare all programs
            </Link>
            .
          </p>
        </div>

        {/* Right: the form */}
        <div className="lg:pt-4">
          <Card className="border-blue-100 shadow-sm">
            <CardContent className="p-5 sm:p-7">
              <h2 className="text-xl font-semibold text-blue-900">
                Book your free trial class
              </h2>
              <p className="mb-6 mt-1 text-sm text-gray-500">
                All fields are required.
              </p>
              <EnrollForm />
            </CardContent>
          </Card>

          <p className="mt-5 text-center text-sm text-gray-600">
            Already enrolled or need a full student account with class
            scheduling?{" "}
            <Link
              href="/signup/account"
              className="font-medium text-blue-700 underline"
            >
              Create a student account
            </Link>
          </p>
        </div>
      </div>
    </main>
  );
}
