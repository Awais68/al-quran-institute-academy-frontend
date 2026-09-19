"use client";
import { useEffect } from "react";
import { useState, useRef } from "react";
import Image from "next/image";
import { motion, useInView } from "framer-motion";
import { X, ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { useMediaQuery } from "@/hooks/use-media-query";
import VideoPlayer from "@/components/video-player";

const galleryImages = [
  {
    id: 1,
    src: "/images/online-hifz-class-students.jpg",
    alt: "Collage of Hifz-ul-Quran students attending their online Quran memorisation class",
    caption: "Students in our online Hifz class",
    category: "Classes",
  },
  {
    id: 2,
    src: "/images/online-quran-student-with-smartphone.jpg",
    alt: "Young student taking an online Quran lesson on a smartphone at home",
    caption: "One of our online students joining class from home",
    category: "Classes",
  },
  {
    id: 3,
    src: "/images/quran-recitation-competition-participant.jpg",
    alt: "Student reciting the Quran into a microphone during a recitation competition",
    caption: "A student reciting at our Quran recitation competition",
    category: "Events",
  },
  {
    id: 4,
    src: "/images/quran-recitation-competition-stage.jpg",
    alt: "Quran recitation competition on stage with participants and judges seated in front of the audience",
    caption: "Annual Quran recitation competition",
    category: "Events",
  },
  {
    id: 5,
    src: "/images/girl-learning-quran-online-on-laptop.jpg",
    alt: "Girl studying the Quran online with her teacher on a laptop",
    caption: "One-to-one online Quran lesson for sisters",
    category: "Classes",
  },
  {
    id: 6,
    src: "/images/boy-learning-quran-online-with-headset.jpg",
    alt: "Boy wearing a headset during a one-to-one online Quran lesson",
    caption: "One-to-one online Quran lesson with headset",
    category: "Events",
  },
  {
    id: 7,
    src: "/images/man-reading-quran-in-mosque.png",
    alt: "Man reading the Quran from a wooden rehal inside a mosque",
    caption: "Reciting the Quran in the masjid",
    category: "Events",
  },
  {
    id: 8,
    src: "/images/child-in-online-quran-class.jpg",
    alt: "Smiling child attending an online Quran class",
    caption: "A young learner enjoying an online Quran class",
    category: "Events",
  },
];
const categories = ["All", "Classes", "Events"];

export default function Gallery() {
  const [selectedImage, setSelectedImage] = useState<number | null>(null);
  const [activeCategory, setActiveCategory] = useState("All");
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.2 });
  const isMobile = useMediaQuery("(max-width: 639px)");

  const filteredImages =
    activeCategory === "All"
      ? galleryImages
      : galleryImages.filter((img) => img.category === activeCategory);

  const openLightbox = (id: number) => {
    setSelectedImage(id);
    document.body.style.overflow = "hidden";
  };

  const closeLightbox = () => {
    setSelectedImage(null);
    document.body.style.overflow = "auto";
  };

  const navigateLightbox = (direction: "next" | "prev") => {
    if (selectedImage === null) return;
    const currentIndex = filteredImages.findIndex(
      (img) => img.id === selectedImage
    );
    let newIndex;
    if (direction === "next") {
      newIndex = (currentIndex + 1) % filteredImages.length;
    } else {
      newIndex =
        (currentIndex - 1 + filteredImages.length) % filteredImages.length;
    }
    setSelectedImage(filteredImages[newIndex].id);
  };

  const currentImage = galleryImages.find((img) => img.id === selectedImage);

  // Handle keyboard navigation for lightbox
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (selectedImage === null) return;
      if (e.key === "Escape") {
        closeLightbox();
      } else if (e.key === "ArrowRight") {
        navigateLightbox("next");
      } else if (e.key === "ArrowLeft") {
        navigateLightbox("prev");
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [selectedImage, filteredImages]);

  return (
    <section
      id="gallery"
      ref={ref}
      className="py-8 sm:py-12 md:py-16 lg:py-24 bg-white"
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          className="text-center mb-8 sm:mb-10 md:mb-12 lg:mb-16"
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.6 }}
        >
          <h6 className="text-primary-600 font-medium mb-2 uppercase tracking-wider text-xs sm:text-sm">
            Gallery
          </h6>
          <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-gray-900 mb-3 sm:mb-4">
            Glimpses of Al-Quran Institute Online
          </h2>
          <div className="w-16 sm:w-20 h-1 bg-primary-600 mx-auto mb-3 sm:mb-4 md:mb-6"></div>
          <p className="text-gray-600 max-w-md sm:max-w-lg md:max-w-2xl mx-auto text-xs sm:text-sm md:text-base">
            Take a glimpse into the life through our photo gallery.
          </p>
        </motion.div>

        <motion.div
          className="flex flex-wrap justify-center mb-6 sm:mb-8 md:mb-10 gap-2"
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <div className="w-full overflow-x-auto pb-4 flex justify-center">
            <div className="flex space-x-2 min-w-max">
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => setActiveCategory(category)}
                  className={cn(
                    "px-3 sm:px-4 md:px-5 py-1.5 sm:py-2 rounded-md text-xs sm:text-sm font-medium transition-all duration-300",
                    activeCategory === category
                      ? "bg-primary-600 text-white"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  )}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Video Section - Fixed height to match image gallery */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 mb-6 sm:mb-8 md:mb-10">
          <div className="grid grid-cols-1">
            {/* VideoPlayer keeps the poster on screen and downloads nothing
                until the card scrolls near the viewport, and pauses playback
                again once it scrolls away.

                Captions: this clip has an audio track, so it needs them. The
                cue text has to come from someone who can hear the recording —
                the skeleton file is at
                public/captions/musa-irfan-hifz-student-testimonial.en.vtt.
                Once its cues are filled in, uncomment `captionsSrc` and fill
                `transcript` with the same lines. Shipping invented caption
                text would be worse than shipping none, so both stay off until
                then. */}
            <VideoPlayer
              src="/images/musa-irfan-hifz-student-testimonial.mp4"
              poster="/images/musa-irfan-hifz-student-testimonial-poster.jpg"
              title="Musa Irfan — Hifz student"
              aspectClassName="h-64"
              // captionsSrc="/captions/musa-irfan-hifz-student-testimonial.en.vtt"
              // transcript={[{ speaker: "Musa Irfan", text: "…" }]}
            />
            <div className="px-4 bg-blue-100 shadow-inner rounded mt-1 p-2">
              <h3 className="text-lg sm:text-xl font-bold text-gray-900 tracking-tight">
                Musa Irfan
              </h3>
              <p className="text-sm sm:text-base text-gray-700 mt-2 leading-relaxed text-justify">
                Musa Irfan from the UK is one of our best students. He is
                memorising the Quran and, Alhamdulillah, has completed four
                siparahs so far. May Allah bless him and make the rest of this
                course easy for him, Ameen.
              </p>
            </div>
          </div>
          <div className="grid grid-cols-1">
            {/* This clip is 4 seconds long and carries no audio stream at all
                (ffprobe reports video only), so there is nothing to caption or
                transcribe — it is decorative b-roll, not a spoken testimonial.
                If a real recorded testimonial replaces it, add a .vtt under
                public/captions/ and wire `captionsSrc` + `transcript`. */}
            <VideoPlayer
              src="/images/fatma-arabic-student-testimonial.mp4"
              poster="/images/fatma-arabic-student-testimonial-poster.jpg"
              title="Fatma's Arabic journey"
              aspectClassName="h-64"
            />
            <div className="px-4 bg-blue-100 shadow-inner rounded mt-1 p-2">
              <h3 className="text-lg sm:text-xl font-bold text-gray-900 tracking-tight">
                {"Fatma's Arabic Journey"}
              </h3>
              <p className="text-sm sm:text-base text-gray-700 mt-2 leading-relaxed text-justify">
                Fatma, a brilliant student, is passionately mastering the Arabic
                language with dedication and enthusiasm. Her journey reflects a
                deep commitment to linguistic excellence and cultural
                understanding.
              </p>
            </div>
          </div>
        </div>

        {/* Image Grid - Fixed consistent height */}
        <motion.div
          className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4 md:gap-6"
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          {filteredImages.map((image, index) => (
            <motion.div
              key={image.id}
              className="relative overflow-hidden rounded-lg shadow-md group cursor-pointer w-full h-64"
              onClick={() => openLightbox(image.id)}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={
                isInView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.9 }
              }
              transition={{ duration: 0.5, delay: 0.1 * index }}
              whileHover={{ scale: 1.02 }}
            >
              <Image
                src={image.src || "/placeholder.svg"}
                alt={image.alt}
                fill
                sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
                className="object-cover transition-transform duration-500 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-3 sm:p-4">
                <span className="text-xs text-primary-300 uppercase tracking-wider mb-1">
                  {image.category}
                </span>
                <h4 className="text-white font-medium text-xs sm:text-sm md:text-base">
                  {image.caption}
                </h4>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>

      {/* Lightbox */}
      {selectedImage !== null && currentImage && (
        <div className="fixed inset-0 bg-black/95 z-50 flex items-center justify-center p-2 sm:p-4">
          <button
            className="absolute top-2 sm:top-4 right-2 sm:right-4 text-white hover:text-primary-400 transition-colors p-1 sm:p-2 bg-black/30 rounded-full"
            onClick={closeLightbox}
          >
            <X size={isMobile ? 16 : 20} />
            <span className="sr-only">Close lightbox</span>
          </button>
          <button
            className="absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 text-white hover:text-primary-400 transition-colors p-1 sm:p-2 bg-black/30 rounded-full"
            onClick={() => navigateLightbox("prev")}
          >
            <ChevronLeft size={isMobile ? 16 : 20} />
            <span className="sr-only">Previous image</span>
          </button>
          <div className="relative w-[95vw] sm:w-[60vw] md:w-[80vw] h-[60vh] sm:h-[80vh] md:h-[80vh]">
            <Image
              src={currentImage.src || "/placeholder.svg"}
              alt={currentImage.alt}
              fill
              sizes="(max-width: 640px) 95vw, (max-width: 768px) 90vw, 80vw"
              className="object-contain"
            />
          </div>
          <button
            className="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 text-white hover:text-primary-400 transition-colors p-1 sm:p-2 bg-black/30 rounded-full"
            onClick={() => navigateLightbox("next")}
          >
            <ChevronRight size={isMobile ? 16 : 20} />
            <span className="sr-only">Next image</span>
          </button>
          <div className="absolute bottom-2 sm:bottom-4 left-0 right-0 text-center bg-black/60 py-2 px-3 sm:px-4">
            <p className="text-white text-xs sm:text-sm md:text-base font-medium">
              {currentImage.caption}
            </p>
            <p className="text-primary-300 text-xs sm:text-sm">
              {currentImage.category}
            </p>
          </div>
        </div>
      )}
    </section>
  );
}
