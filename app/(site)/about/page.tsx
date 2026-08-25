import type { Metadata } from "next";
import Link from "next/link";
import About from "@/components/about";
import Statistics from "@/components/statistics";
import PageHero from "@/components/page-hero";
import { Button } from "@/components/ui/button";
import { pageMetadata } from "@/lib/seo";
import { SITE_NAME } from "@/lib/site";

export async function generateMetadata(): Promise<Metadata> {
  return pageMetadata({
    title: "About Our Online Quran Academy",
    description:
      "Learn about Al-Quran Institute Online — an online Quran academy teaching Hifz, Tajweed and Nazrah one-to-one, with qualified male and female teachers and a focus on character-building Islamic education.",
    path: "/about",
    keywords: [
      "about Al-Quran Institute Online",
      "online Quran academy",
      "Islamic education online",
      "qualified Quran teachers",
    ],
  });
}

export default function AboutPage() {
  return (
    <main>
      <PageHero
        title="About Al-Quran Institute Online"
        description={`${SITE_NAME} is an online Quran academy teaching Hifz-ul-Quran, Tajweed, Nazrah and Qaida to students worldwide. Every class is one-to-one with a qualified teacher, and our Islamic education programs focus on character development alongside correct recitation.`}
      >
        <div className="flex flex-wrap gap-3">
          <Button asChild className="bg-blue-600 hover:bg-blue-700">
            <Link href="/signup">Book a free trial class</Link>
          </Button>
          <Button asChild variant="outline">
            <Link href="/programs">See all programs</Link>
          </Button>
        </div>
      </PageHero>

      <About />
      <Statistics />
    </main>
  );
}
