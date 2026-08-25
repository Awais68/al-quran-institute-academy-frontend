import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Check, ChevronRight } from "lucide-react";
import { programs, getProgramBySlug } from "@/lib/programs";
import { SITE_NAME } from "@/lib/site";
import { pageMetadata, truncate } from "@/lib/seo";
import JsonLd from "@/components/json-ld";
import { breadcrumbSchema, courseSchema } from "@/lib/schema";

type Params = { slug: string };

// Prerender every course page at build time — no 404s from the /programs cards.
export function generateStaticParams(): Params[] {
  return programs.map(({ slug }) => ({ slug }));
}

export const dynamicParams = false;

export async function generateMetadata({
  params,
}: {
  params: Promise<Params>;
}): Promise<Metadata> {
  const { slug } = await params;
  const program = getProgramBySlug(slug);
  if (!program) return { title: `Course not found | ${SITE_NAME}` };

  return pageMetadata({
    title: `${program.title} — Online Course`,
    // The tagline is often the opening sentence of the description, so use the
    // description alone and cut it on a word boundary.
    description: truncate(program.description),
    path: `/programs/${program.slug}`,
    type: "article",
    keywords: [
      `${program.title} online`,
      `online ${program.title} course`,
      "online Quran classes",
    ],
  });
}

export default async function ProgramPage({
  params,
}: {
  params: Promise<Params>;
}) {
  const { slug } = await params;
  const program = getProgramBySlug(slug);
  if (!program) notFound();

  const others = programs.filter((p) => p.slug !== program.slug).slice(0, 3);

  return (
    <main className="min-h-screen bg-white">
      <JsonLd
        data={[
          courseSchema(program),
          breadcrumbSchema([
            { name: "Home", path: "/" },
            { name: "Programs", path: "/programs" },
            { name: program.title, path: `/programs/${program.slug}` },
          ]),
        ]}
      />

      <div className="mx-auto max-w-4xl px-4 pb-10 pt-28 sm:px-6 sm:pb-14 sm:pt-32">
        <nav aria-label="Breadcrumb" className="text-sm text-gray-500">
          <ol className="flex flex-wrap items-center gap-1">
            <li>
              <Link href="/" className="hover:text-blue-700">
                Home
              </Link>
            </li>
            <ChevronRight className="h-3.5 w-3.5" aria-hidden="true" />
            <li>
              <Link href="/programs" className="hover:text-blue-700">
                Programs
              </Link>
            </li>
            <ChevronRight className="h-3.5 w-3.5" aria-hidden="true" />
            <li aria-current="page" className="text-gray-700">
              {program.title}
            </li>
          </ol>
        </nav>

        <h1 className="mt-5 text-3xl font-bold tracking-tight text-blue-900 sm:text-4xl">
          {program.title}
        </h1>
        <p lang="ur" dir="rtl" className="mt-2 font-noto text-2xl text-blue-700">
          {program.urduTitle}
        </p>

        <p className="mt-5 text-base leading-relaxed text-gray-600 sm:text-lg">
          {program.description}
        </p>

        <dl className="mt-8 grid gap-4 sm:grid-cols-3">
          {[
            { label: "Duration", value: program.duration },
            { label: "Schedule", value: program.schedule },
            { label: "Suitable for", value: program.ageGroup },
          ].map((item) => (
            <div
              key={item.label}
              className="rounded-lg border border-blue-100 bg-blue-50/50 p-4"
            >
              <dt className="text-xs font-medium uppercase tracking-wide text-blue-700">
                {item.label}
              </dt>
              <dd className="mt-1 text-sm text-gray-700">{item.value}</dd>
            </div>
          ))}
        </dl>

        <h2 className="mt-10 text-xl font-semibold text-blue-900">
          What this course includes
        </h2>
        <ul className="mt-4 space-y-2.5">
          {program.features.map((feature) => (
            <li key={feature} className="flex items-start gap-2.5 text-gray-700">
              <Check
                className="mt-0.5 h-4 w-4 shrink-0 text-green-600"
                aria-hidden="true"
              />
              <span className="text-sm sm:text-base">{feature}</span>
            </li>
          ))}
        </ul>

        <Card className="mt-10 border-blue-100 bg-blue-50/60">
          <CardContent className="flex flex-col items-start gap-4 p-6 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="text-lg font-semibold text-blue-900">
                Start {program.title} with a free trial class
              </h2>
              <p className="mt-1 text-sm text-gray-600">
                No payment required. We&apos;ll match you with a qualified teacher.
              </p>
            </div>
            <Button asChild className="shrink-0 bg-blue-600 hover:bg-blue-700">
              <Link href="/signup">Sign up now</Link>
            </Button>
          </CardContent>
        </Card>

        <h2 className="mt-12 text-xl font-semibold text-blue-900">
          Other programs
        </h2>
        <ul className="mt-4 grid gap-3 sm:grid-cols-3">
          {others.map((other) => (
            <li key={other.slug}>
              <Link
                href={`/programs/${other.slug}`}
                className="block rounded-lg border border-blue-100 p-4 text-sm font-medium text-blue-800 transition-colors hover:bg-blue-50"
              >
                {other.title}
              </Link>
            </li>
          ))}
        </ul>

        <p className="mt-8">
          <Link href="/programs" className="text-sm font-medium text-blue-700 underline">
            ← Back to all programs
          </Link>
        </p>
      </div>
    </main>
  );
}
