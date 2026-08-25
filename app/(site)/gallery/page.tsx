import type { Metadata } from "next";
import Gallery from "@/components/gallery";
import PageHero from "@/components/page-hero";
import { pageMetadata } from "@/lib/seo";

export async function generateMetadata(): Promise<Metadata> {
  return pageMetadata({
    title: "Gallery — Our Students & Online Classes",
    description:
      "Photos and videos from Al-Quran Institute Online: Hifz completions, online Quran class sessions, competitions and student celebrations at our online Quran academy.",
    path: "/gallery",
    keywords: [
      "online Quran academy gallery",
      "Hifz completion ceremony",
      "Quran class photos",
    ],
  });
}

export default function GalleryPage() {
  return (
    <main>
      <PageHero
        title="Gallery"
        description="A look inside Al-Quran Institute Online — moments from our online Quran classes, Hifz completions, competitions and student celebrations."
      />
      <Gallery />
    </main>
  );
}
