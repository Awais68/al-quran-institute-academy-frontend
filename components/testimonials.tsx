"use client";

import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import { motion, useInView } from "framer-motion";
import { ChevronLeft, ChevronRight, Quote } from "lucide-react";
import { cn } from "@/lib/utils";
import { useMediaQuery } from "@/hooks/use-media-query";

const testimonials = [
  {
    id: 1,
    name: "Ahmed Khan",
    role: "Parent",
    country: "London, UK",
    image: "/images/person1.png",
    quote:
      " Al Quran Institute Online has transformed my understanding of the Quran. The Teachers are knowlegeable and patient.",
  },
  {
    id: 2,
    name: "Fatima Ali",
    country: "Toronto, Canada",
    role: "Former Student",
    image: "/images/person2.png",
    quote:
      "My children love their online Quran classes. The interactive teaching methods are excellent.",
  },
  {
    id: 3,
    name: "Abdullah Rahman",
    country: "Sydney, Australia",
    role: "Community Leader",
    image: "/images/person3.png",
    quote:
      "Flexible scheduling and quality education. Highly recommend for busy professionals.",
  },
];

export default function Testimonials() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [autoplay, setAutoplay] = useState(true);
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.3 });
  const isMobile = useMediaQuery("(max-width: 639px)");
  const autoplayRef = useRef<NodeJS.Timeout | null>(null);

  const nextTestimonial = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % testimonials.length);
  };

  const prevTestimonial = () => {
    setCurrentIndex(
      (prevIndex) => (prevIndex - 1 + testimonials.length) % testimonials.length
    );
  };

  useEffect(() => {
    if (autoplay) {
      autoplayRef.current = setInterval(() => {
        nextTestimonial();
      }, 6000);
    }

    return () => {
      if (autoplayRef.current) {
        clearInterval(autoplayRef.current);
      }
    };
  }, [autoplay, currentIndex]);

  return (
    <section
      id="testimonials"
      ref={ref}
      className="py-16 md:py-24 bg-primary-50 islamic-pattern"
    >
      <div className="container mx-auto px-4">
        <motion.div
          className="text-center mb-10 sm:mb-12 md:mb-16"
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.6 }}
        >
          <h6 className="text-primary-600 font-medium mb-2 uppercase tracking-wider text-xs sm:text-sm">
            Testimonials
          </h6>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-3 sm:mb-4">
            What People Say About Us
          </h2>
          <div className="islamic-divider w-20 sm:w-24 mx-auto mb-4 sm:mb-6"></div>
          <p className="text-gray-600 max-w-2xl mx-auto text-sm md:text-base">
            Hear what our students, parents, and community members have to say
            about Madarsa Hajira.
          </p>
        </motion.div>

        <motion.div
          className="max-w-4xl mx-auto relative"
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          onMouseEnter={() => setAutoplay(false)}
          onMouseLeave={() => setAutoplay(true)}
          onTouchStart={() => setAutoplay(false)}
          onTouchEnd={() => setAutoplay(true)}
        >
          <div className="relative bg-white rounded-xl shadow-xl p-5 sm:p-6 md:p-8 lg:p-12 overflow-hidden">
            <Quote className="absolute top-4 sm:top-6 left-4 sm:left-6 h-12 sm:h-16 md:h-20 w-12 sm:w-16 md:w-20 text-primary-100" />

            <div className="relative z-10">
              {testimonials.map((testimonial, index) => (
                <div
                  key={testimonial.id}
                  className={cn(
                    "transition-opacity duration-500",
                    index === currentIndex
                      ? "block opacity-100"
                      : "hidden opacity-0"
                  )}
                >
                  <blockquote className="text-gray-700 text-sm sm:text-base md:text-lg italic mb-3 sm:mb-4 md:mb-6 text-center max-w-2xl mx-auto">
                    "{testimonial.quote}"
                  </blockquote>

                  {/* <div className="font-noto text-primary-700 text-sm sm:text-base italic mb-4 sm:mb-6 md:mb-8 text-center max-w-2xl mx-auto urdu leading-relaxed">
                    "{testimonial.urduQuote}"
                  </div> */}

                  <div className="flex flex-col items-center">
                    <div className="relative w-14 h-14 sm:w-16 sm:h-16 md:w-20 md:h-20 rounded-full overflow-hidden mb-2 sm:mb-3 md:mb-4 border-4 border-primary-100">
                      <Image
                        src={testimonial.image}
                        alt={testimonial.name}
                        fill
                        sizes="(max-width: 640px) 3.5rem, (max-width: 768px) 4rem, 5rem"
                        className="object-cover"
                      />
                    </div>
                    <div className="text-center">
                      <h4 className="font-bold text-primary-800 text-sm sm:text-base md:text-lg">
                        {testimonial.name}
                      </h4>
                      <p className="text-gray-600 text-xs sm:text-sm">
                        {testimonial.role}
                      </p>
                      <p className="text-gray-600 text-xs sm:text-sm">
                        {testimonial.country}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="flex justify-center mt-4 sm:mt-6 md:mt-8 gap-2 sm:gap-3 md:gap-4">
            <button
              onClick={prevTestimonial}
              className="p-1.5 sm:p-2 md:p-3 rounded-full bg-white shadow-md hover:bg-primary-50 transition-colors"
              aria-label="Previous testimonial"
            >
              <ChevronLeft className="h-3 w-3 sm:h-4 sm:w-4 md:h-5 md:w-5 text-primary-600" />
            </button>
            <div className="flex gap-1.5 sm:gap-2 items-center">
              {testimonials.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentIndex(index)}
                  className={cn(
                    "w-2 sm:w-2.5 md:w-3 h-2 sm:h-2.5 md:h-3 rounded-full transition-all duration-300",
                    index === currentIndex
                      ? "bg-accent-500 w-5 sm:w-6 md:w-8"
                      : "bg-primary-200"
                  )}
                  aria-label={`Go to testimonial ${index + 1}`}
                />
              ))}
            </div>
            <button
              onClick={nextTestimonial}
              className="p-1.5 sm:p-2 md:p-3 rounded-full bg-white shadow-md hover:bg-primary-50 transition-colors"
              aria-label="Next testimonial"
            >
              <ChevronRight className="h-3 w-3 sm:h-4 sm:w-4 md:h-5 md:w-5 text-primary-600" />
            </button>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
