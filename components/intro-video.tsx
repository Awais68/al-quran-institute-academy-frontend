"use client";

/**
 * Homepage introduction video, rendered directly under the hero.
 * The player itself (lazy loading, pause-on-scroll, custom controls) lives in
 * components/video-player.tsx so the gallery testimonials can reuse it.
 */

import VideoPlayer from "@/components/video-player";

export default function IntroVideo() {
  return (
    <section
      id="intro-video"
      aria-labelledby="intro-video-heading"
      className="bg-primary-50 islamic-pattern py-12 sm:py-16 md:py-20"
    >
      <div className="container mx-auto px-4">
        <div className="mx-auto max-w-3xl text-center">
          <p className="mb-2 text-xs font-medium uppercase tracking-wider text-primary-600 sm:text-sm">
            Watch
          </p>
          <h2
            id="intro-video-heading"
            className="mb-3 text-2xl font-bold text-gray-900 sm:text-3xl md:text-4xl"
          >
            Inside Al-Quran Institute Online
          </h2>
          <div className="islamic-divider mx-auto mb-4 w-20 sm:mb-6 sm:w-24" />
          <p className="mb-6 text-sm text-gray-600 sm:mb-8 md:text-base">
            A short look at how our one-to-one Quran classes run — the teachers,
            the method, and the students learning Hifz, Tajweed and Nazrah with
            us.
          </p>
        </div>

        <div className="mx-auto w-full max-w-4xl">
          {/* Caption skeleton lives at
              public/captions/al-quran-institute-online-introduction.en.vtt.
              Fill in its cues, then uncomment `captionsSrc` and mirror the same
              lines into `transcript`. */}
          <VideoPlayer
            src="/images/al-quran-institute-online-introduction.mp4"
            poster="/images/al-quran-institute-online-introduction-poster.jpg"
            title="Inside Al-Quran Institute Online"
            aspectClassName="aspect-video"
            // captionsSrc="/captions/al-quran-institute-online-introduction.en.vtt"
            // transcript={[{ text: "…" }]}
          />
        </div>
      </div>
    </section>
  );
}
