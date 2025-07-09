"use client";

import { useEffect } from "react";

import { useState, useRef } from "react";
import Image from "next/image";
import { motion, useInView } from "framer-motion";
import { X, ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { useMediaQuery } from "@/hooks/use-media-query";

const galleryImages = [
  {
    id: 1,
    src: "/images/hifzclass.png",
    alt: "Students learning Quran",
    caption: "Students in Hifz class",
    category: "Classes",
  },
  {
    id: 2,
    src: "/images/ab.jpg",
    alt: "Madarsa building",
    caption: "Our Online Student",
    category: "Classes",
  },
  {
    id: 3,
    src: "/images/mubashir.png",
    alt: "Graduation ceremony",
    caption: "Students in Hifz class",
    category: "Events",
  },
  {
    id: 4,
    src: "/images/compition.png",
    alt: "Quran competition",
    caption: "Quran recitation competition",
    category: "Events",
  },
  {
    id: 5,
    src: "/images/single2.png",
    alt: "Islamic calligraphy class",
    caption: "Students learning Islamic calligraphy",
    category: "Classes",
  },
  {
    id: 6,
    src: "/images/single.png",
    alt: "Community event",
    caption: "Eid celebration with community",
    category: "Events",
  },
  {
    id: 7,
    src: "/images/person3.png",
    alt: "Community event",
    caption: "Reciting Quran",
    category: "Events",
  },

  {
    id: 8,
    src: "/images/single.png",
    alt: "Community event",
    caption: "Eid celebration with community",
    category: "Events",
  },
  // {
  //   id: 7,
  //   src: "/images/library.png",
  //   alt: "Library",
  //   caption: "Our extensive Islamic library",
  //   category: "Campus",
  // },
  // {
  //   id: 8,
  //   src: "/images/prayar.png",
  //   alt: "Prayer hall",
  //   caption: "Main prayer hall",
  //   category: "Campus",
  // },
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
  }, [selectedImage]);

  return (
    <section id="gallery" ref={ref} className="py-16 md:py-24 bg-white">
      <div className="container mx-auto px-4">
        <motion.div
          className="text-center mb-10 sm:mb-12 md:mb-16"
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.6 }}
        >
          <h6 className="text-primary-600 font-medium mb-2 uppercase tracking-wider text-xs sm:text-sm">
            Gallery
          </h6>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-3 sm:mb-4">
            Glimpses of Al-Quran Institute Online
          </h2>
          <div className="w-16 md:w-20 h-1 bg-primary-600 mx-auto mb-3 sm:mb-4 md:mb-6"></div>
          <p className="text-gray-600 max-w-2xl mx-auto text-sm md:text-base">
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
                    "px-3 sm:px-4 md:px-5 py-2 sm:py-2.5 rounded-md text-xs sm:text-sm font-medium transition-all duration-300",
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

        <motion.div
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 md:gap-6"
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          {filteredImages.map((image, index) => (
            <motion.div
              key={image.id}
              className="relative overflow-hidden rounded-lg shadow-md group cursor-pointer h-48 sm:h-56 md:h-64"
              onClick={() => openLightbox(image.id)}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={
                isInView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.9 }
              }
              transition={{ duration: 0.5, delay: 0.1 * index }}
              whileHover={{ scale: 1.02 }}
            >
              <Image
                src={image.src}
                alt={image.alt}
                fill
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                className="object-cover transition-transform duration-500 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-4">
                <span className="text-xs text-primary-300 uppercase tracking-wider mb-1">
                  {image.category}
                </span>
                <h4 className="text-white font-medium text-sm sm:text-base">
                  {image.caption}
                </h4>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
      <div className="container mx-10 px-4 my-6 rounded-lg inline-flex gap-6  justify-center border-blue-400">
        <video
          width="220"
          height="220"
          controls
          preload="none"
          className="rounded-lg w-96 h-64 "
        >
          <source src="/images/cd.mp4" type="video/mp4" />
          <track
            src="../public/images/cd.mp4"
            kind="subtitles"
            srcLang="en"
            label="English"
          />{" "}
          Your browser does not support the video tag.
        </video>
        <video
          width="220"
          height="220"
          controls
          preload="none"
          className="rounded-lg w-96 h-64 "
        >
          <source src="/images/ef.mp4" type="video/mp4" />
          <track
            src="../public/images/ef.mp4"
            kind="subtitles"
            srcLang="en"
            label="English"
          />{" "}
          Your browser does not support the video tag.
        </video>
      </div>

      {/* Lightbox */}
      {selectedImage !== null && currentImage && (
        <div className="fixed inset-0 bg-black/95 z-50 flex items-center justify-center p-4">
          <button
            className="absolute top-2 sm:top-4 right-2 sm:right-4 text-white hover:text-primary-400 transition-colors p-1 sm:p-2 bg-black/30 rounded-full"
            onClick={closeLightbox}
          >
            <X size={isMobile ? 20 : 24} />
            <span className="sr-only">Close lightbox</span>
          </button>

          <button
            className="absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 text-white hover:text-primary-400 transition-colors p-1 sm:p-2 bg-black/30 rounded-full"
            onClick={() => navigateLightbox("prev")}
          >
            <ChevronLeft size={isMobile ? 20 : 24} />
            <span className="sr-only">Previous image</span>
          </button>

          <div className="relative w-[90vw] h-[60vh] sm:h-[70vh] md:w-[80vw] md:h-[70vh]">
            <Image
              src={currentImage.src}
              alt={currentImage.alt}
              fill
              sizes="90vw"
              className="object-contain"
            />
          </div>

          <button
            className="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 text-white hover:text-primary-400 transition-colors p-1 sm:p-2 bg-black/30 rounded-full"
            onClick={() => navigateLightbox("next")}
          >
            <ChevronRight size={isMobile ? 20 : 24} />
            <span className="sr-only">Next image</span>
          </button>

          <div className="absolute bottom-2 sm:bottom-4 left-0 right-0 text-center bg-black/60 py-2 px-4">
            <p className="text-white text-sm sm:text-base md:text-lg font-medium">
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
