import type { Metadata } from "next";
import Link from "next/link";
import Faculty from "@/components/faculty";
import PageHero from "@/components/page-hero";
import { Button } from "@/components/ui/button";
import { pageMetadata } from "@/lib/seo";

export async function generateMetadata(): Promise<Metadata> {
  return pageMetadata({
    title: "Our Quran Teachers & Faculty",
    description:
      "Meet the qualified teachers at Al-Quran Institute Online — Hifz and Tajweed specialists, Arabic language experts and Islamic studies scholars, with male and female teachers available for one-to-one online classes.",
    path: "/faculty",
    keywords: [
      "qualified Quran teachers online",
      "female Quran teacher online",
      "Hifz teacher",
      "Tajweed teacher",
    ],
  });
}

export default function FacultyPage() {
  return (
    <main>
      <PageHero
        title="Our Faculty"
        description="Every course at Al-Quran Institute Online is taught by a qualified teacher — Hifz and Tajweed specialists, Arabic language experts and Islamic studies scholars. Male and female teachers are available, so students can be matched with the teacher they are most comfortable learning from."
      >
        <Button asChild className="bg-blue-600 hover:bg-blue-700">
          <Link href="/signup">Request a teacher</Link>
        </Button>
      </PageHero>
      <Faculty />
    </main>
  );
}
