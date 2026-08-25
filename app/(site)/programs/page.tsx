import type { Metadata } from "next";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowRight, Clock, CalendarDays, Users } from "lucide-react";
import { programs } from "@/lib/programs";
import { SITE_NAME } from "@/lib/site";
import { pageMetadata } from "@/lib/seo";
import JsonLd from "@/components/json-ld";
import { breadcrumbSchema, courseListSchema } from "@/lib/schema";

export async function generateMetadata(): Promise<Metadata> {
  return pageMetadata({
    title: "Online Quran & Islamic Studies Programs",
    description:
      "Explore all courses at Al-Quran Institute Online: Hifz-ul-Quran, Tajweed, Nazrah Quran, Qaida, Arabic Language, Islamic Studies and Namaz Course. One-to-one online classes with qualified teachers.",
    path: "/programs",
    keywords: [
      "online Quran courses",
      "Hifz ul Quran course online",
      "online Tajweed course",
      "Nazrah Quran course",
      "Noorani Qaida online",
      "online Islamic studies course",
    ],
  });
}

export default function ProgramsPage() {
  return (
    <main className="min-h-screen bg-white">
      <JsonLd data={[courseListSchema(programs), breadcrumbSchema([
        { name: "Home", path: "/" },
        { name: "Programs", path: "/programs" },
      ])]} />

      <section className="border-b border-blue-100 bg-gradient-to-b from-blue-50 to-white pt-24 sm:pt-28">
        <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 sm:py-16">
          <h1 className="text-3xl font-bold tracking-tight text-blue-900 sm:text-4xl">
            Our Programs
          </h1>
          <p className="mt-4 max-w-3xl text-base leading-relaxed text-gray-600 sm:text-lg">
            {SITE_NAME} offers a range of structured programs designed for
            students of every level — from absolute beginners learning the
            Arabic letters to advanced students memorizing the entire Quran.
            Every course is taught one-to-one online by qualified teachers.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Button asChild className="bg-blue-600 hover:bg-blue-700">
              <Link href="/signup">Book a free trial class</Link>
            </Button>
            <Button asChild variant="outline">
              <Link href="/contact">Contact us</Link>
            </Button>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-12 sm:px-6 sm:py-16">
        <h2 className="sr-only">All courses</h2>
        <ul className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {programs.map((program) => (
            <li key={program.slug}>
              {/* `relative` + the stretched-link pseudo element makes the whole card clickable */}
              <Card className="relative flex h-full flex-col border-blue-100 transition-shadow hover:shadow-md">
                <CardContent className="flex flex-1 flex-col p-6">
                  <h3 className="text-xl font-semibold text-blue-900">
                    <Link
                      href={`/programs/${program.slug}`}
                      className="after:absolute after:inset-0 hover:underline"
                    >
                      {program.title}
                    </Link>
                  </h3>
                  <p
                    lang="ur"
                    dir="rtl"
                    className="mt-1 font-noto text-lg text-blue-700"
                  >
                    {program.urduTitle}
                  </p>

                  <p className="mt-3 flex-1 text-sm leading-relaxed text-gray-600">
                    {program.tagline}
                  </p>

                  <dl className="mt-4 space-y-2 text-xs text-gray-500">
                    <div className="flex items-center gap-2">
                      <Clock className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
                      <dt className="sr-only">Duration</dt>
                      <dd>{program.duration}</dd>
                    </div>
                    <div className="flex items-center gap-2">
                      <CalendarDays className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
                      <dt className="sr-only">Schedule</dt>
                      <dd>{program.schedule}</dd>
                    </div>
                    <div className="flex items-center gap-2">
                      <Users className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
                      <dt className="sr-only">Suitable for</dt>
                      <dd>{program.ageGroup}</dd>
                    </div>
                  </dl>

                  <span className="mt-5 inline-flex items-center gap-1 text-sm font-medium text-blue-700">
                    View course details
                    <ArrowRight className="h-4 w-4" aria-hidden="true" />
                  </span>
                </CardContent>
              </Card>
            </li>
          ))}
        </ul>
      </section>
    </main>
  );
}
