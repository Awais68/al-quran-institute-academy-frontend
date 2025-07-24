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

        {/* Video Section */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 mb-6 sm:mb-8 md:mb-10">
          <div className="grid grid-cols-1">
            <video
              width="100%"
              height="500px"
              controls
              preload="metadata"
              poster="/images/mosa.jpg"
              className="rounded-lg w-full h-96 sm:h-96 md:h-96 object-cover"
            >
              <source src="/images/cd.mp4" type="video/mp4" />
              <track
                src="/images/cd.vtt"
                kind="subtitles"
                srcLang="en"
                label="English"
              />
              Your browser does not support the video tag.
            </video>
            <div className=" px-4 bg-blue-100 shadow-inner rounded mt-1 p-2">
              <h3 className="text-xl font-bold text-gray-900 tracking-tight ">
                Musa Irfan
              </h3>
              <p className="text-base text-gray-700 mt-2 leading-relaxed text-justify">
                Musa Irfan from UK is one of the best student. He is memorizing
                Quran and Alhamdulillah has finished 4 siparahs yet. May Allah
                bless upon him and give him a chance to finish this course
                easily, Ameen.
              </p>
            </div>
          </div>
          <div className="grid grid-cols-1">
            <video
              width="100%"
              height="500px"
              controls
              preload="metadata"
              poster="/images/single2.png"
              className="rounded-lg w-full h-96 sm:h-96 md:h-96 object-cover"
            >
              <source src="/images/ef.mp4" type="video/mp4" />
              <track
                src="/images/ef.vtt"
                kind="subtitles"
                srcLang="en"
                label="English"
              />
              Your browser does not support the video tag.
            </video>
            <div className=" px-4 bg-blue-100 shadow-inner rounded mt-1 p-2">
              <h3 className="text-xl font-bold text-gray-900 tracking-tight ">
                Fatma's Arabic Journey
              </h3>
              <p className="text-base text-gray-700 mt-2 leading-relaxed text-justify">
                Fatma, a brilliant student, is passionately mastering the Arabic
                language with dedication and enthusiasm. Her journey reflects a
                deep commitment to linguistic excellence and cultural
                understanding.
              </p>
            </div>
          </div>
        </div>

        {/* Image Grid */}
        <motion.div
          className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4 md:gap-6"
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          {filteredImages.map((image, index) => (
            // <motion.div
            //   key={image.id}
            //   className="relative overflow-hidden rounded-lg shadow-md group cursor-pointer h-48 sm:h-96 md:h-84"
            //   onClick={() => openLightbox(image.id)}
            //   initial={{ opacity: 0, scale: 0.9 }}
            //   animate={
            //     isInView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.9 }
            //   }
            //   transition={{ duration: 0.5, delay: 0.1 * index }}
            //   whileHover={{ scale: 1.02 }}
            // >
            //   <Image
            //     src={image.src}
            //     alt={image.alt}
            //     fill
            //     sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
            //     className="object-cover transition-transform duration-500 group-hover:scale-110"
            //   />
            <motion.div
              key={image.id}
              className="relative overflow-hidden rounded-lg shadow-md group cursor-pointer w-full h-64 sm:h-72 md:h-80 lg:h-96"
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
                sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
                className="object-cover transition-transform duration-500 group-hover:scale-110 w-full h-full"
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

          <div className="relative w-[95vw] sm:w-[90vw] md:w-[80vw] h-[60vh] sm:h-[70vh] md:h-[80vh]">
            <Image
              src={currentImage.src}
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
