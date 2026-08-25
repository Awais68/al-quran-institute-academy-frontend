import type { Metadata } from "next";
import Link from "next/link";
import Testimonials from "@/components/testimonials";
import PageHero from "@/components/page-hero";
import JsonLd from "@/components/json-ld";
import { Button } from "@/components/ui/button";
import { pageMetadata } from "@/lib/seo";
import { reviewListSchema } from "@/lib/schema";
import { testimonials } from "@/lib/testimonials";

export async function generateMetadata(): Promise<Metadata> {
  return pageMetadata({
    title: "Student & Parent Testimonials",
    description:
      "What students, parents and community members say about learning Hifz, Tajweed and Nazrah with Al-Quran Institute Online — reviews from the UK, Canada and Australia.",
    path: "/testimonials",
    keywords: [
      "online Quran academy reviews",
      "Quran classes testimonials",
      "Al-Quran Institute Online review",
    ],
  });
}

export default function TestimonialsPage() {
  return (
    <main>
      {/* Review markup covers only the complete, attributed testimonials in
          lib/testimonials.ts. No reviewRating is emitted — the source
          testimonials carry no star rating. */}
      <JsonLd data={reviewListSchema(testimonials)} />

      <PageHero
        title="What Our Students Say"
        description="Families in the UK, Canada, Australia and beyond study Hifz-ul-Quran, Tajweed and Nazrah with Al-Quran Institute Online. Here is what they tell us about their one-to-one online classes."
      >
        <Button asChild className="bg-blue-600 hover:bg-blue-700">
          <Link href="/signup">Start your free trial class</Link>
        </Button>
      </PageHero>
      <Testimonials />
    </main>
  );
}
