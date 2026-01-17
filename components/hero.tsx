"use client";

import { useState, useEffect } from "react";
import dynamic from 'next/dynamic';
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { useIsMobile } from "@/hooks/use-mobile";

// Dynamically import the Three.js scene component with no SSR
const HeroScene = dynamic(() => import('./hero-scene'), {
  ssr: false,
  loading: () => <div className="absolute inset-0 -z-10 bg-gradient-to-b from-slate-900 to-slate-800" />
});

export default function Hero() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const isMobile = useIsMobile();

  const mobSlides = [
    {
      id: 1,
      image: "/images/mobile.png",
      // title: "Education with character-building, knowledge with action.",
      title: "",
      // subtitle: "Education with nurturing, knowledge with practice",
      urduText:
        // "Empowering modern education through the guidance of the Quran and Sunnah.",
        "",
      color: "#4CAF50",
    },
    {
      id: 2,
      image: "/images/mobile2.png",
      title: "",
      urduText: " ",
      color: "#673AB7",
    },
    {
      id: 3,
      image: "/images/hero3.png",
      title: "",
      urduText: "",
      color: "#009688",
    },
  ];

  const slides = [
    {
      id: 1,
      image: "/images/hero1.png",
      title: "Education with character-building, knowledge with action.",
      // subtitle: "Education with nurturing, knowledge with practice",
      urduText:
        "Empowering modern education through the guidance of the Quran and Sunnah.",
      color: "#4CAF50",
    },

    {
      id: 2,
      image: "/images/hero2.png",
      title: "A journey of life guided by the wisdom of the Quran",
      // subtitle: "Life's journey in the light of the Quran",
      urduText: "Building character and ethics is our top priority",
      color: "#2196F3",
    },
    {
      id: 3,
      image: "/images/hero3.png",
      title: "Promotion of Islamic values",
      // subtitle: "Islamic values",
      urduText: "A unified space for both Islamic and contemporary education",
      color: "#9C27B0",
    },
  ];

  const activeSlides = isMobile ? mobSlides : slides;

  useEffect(() => {
    const id = setInterval(
      () => setCurrentSlide((i) => (i + 1) % activeSlides.length),
      6000
    );
    return () => clearInterval(id);
  }, [activeSlides.length]);

  return (
    <section className="relative w-full h-screen overflow-hidden bg-gradient-to-b from-slate-900 to-slate-800">
      <div className="relative w-full h-screen overflow-hidden">
        <HeroScene />
        <div className="absolute inset-0 bg-black/40" />

        {/* Slides with Responsive Background Images */}
        {activeSlides.map((slide, i) => (
          <div
            key={slide.id}
            className={cn(
              "absolute inset-0 transition-opacity duration-1000",
              i === currentSlide ? "opacity-100" : "opacity-0"
            )}
          >
            <Image
              src={slide.image}
              alt={slide.title}
              fill
              priority={i === 0}
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
              className="object-cover brightness-50"
              style={{ objectPosition: "center" }}
            />
          </div>
        ))}
      </div>

      {/* Content */}
      <div className="absolute inset-0 flex items-center justify-center px-4 md:px-8 lg:px-16">
        <div className="w-full max-w-5xl grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Text */}
          <motion.div
            key={currentSlide}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center md:text-left"
          >
            <h3 className="text-sm sm:text-base text-gray-300 uppercase">
              Al-Quran Institute Online
            </h3>
            <h1 className="mt-2 text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-white">
              Al-Quran Institute Online
            </h1>
            <div className="mt-2 h-1 w-16 bg-accent-500 mx-auto md:mx-0" />
            <p className="mt-4 text-xl sm:text-2xl font-noto text-primary-200">
              {activeSlides[currentSlide].title}
            </p>
            <p className="mt-2 text-base sm:text-lg md:text-xl text-white">
              {activeSlides[currentSlide].urduText}
            </p>
            {/* <p className="mt-2 text-sm sm:text-base text-primary-200 italic">"{slides[currentSlide].subtitle}"</p> */}
            <div className="mt-6 flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
              <Link
                href="/#programs"
                className="px-6 py-2 bg-gradient-to-r from-primary-600 to-primary-700 text-white rounded-md text-sm sm:text-base w-full sm:w-auto text-center"
              >
                Our Programs
              </Link>
              <Link
                href="/signup"
                className="px-6 py-2 border border-accent-400 text-gray-300 rounded-md text-sm sm:text-base w-full sm:w-auto text-center hover:bg-accent-500/10"
              >
                Register Now
              </Link>
            </div>
          </motion.div>

          {/* Features on large screens */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="hidden lg:block"
          >
            <div className="p-6 bg-white/5 backdrop-blur-md rounded-2xl shadow-xl">
              {[
                {
                  icon: "📖",
                  title: "Authentic Quranic Learning",
                  desc: "Providing authentic Quranic learning with proper Tajweed and meaningful understanding",
                },
                {
                  icon: "🎓",
                  title: "Up-to-date Curriculum",
                  desc: "Delivering contemporary education rooted in Islamic values.",
                },
                {
                  icon: "🌱",
                  title: "Focus on Character Development",
                  desc: "Advancing ethical values and foundational principles.",
                },
                {
                  icon: "👨‍🏫",
                  title: "Expert and Passionate Teachers",
                  desc: "Driven and seasoned teachers devoted to excellence.",
                },
              ].map((f, idx) => (
                <div key={idx} className="flex items-start mb-4 last:mb-0">
                  <div className="text-2xl mr-3">{f.icon}</div>
                  <div className="text-white">
                    <h4 className="font-medium text-lg">{f.title}</h4>
                    <p className="text-sm mt-1 text-primary-200">{f.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>

      {/* Indicators */}
      <div className="absolute bottom-6 w-full flex justify-center gap-2">
        {activeSlides.map((_, idx) => (
          <button
            key={idx}
            onClick={() => setCurrentSlide(idx)}
            className={cn(
              "rounded-full transition-all duration-300",
              idx === currentSlide
                ? "w-4 h-4 bg-accent-500"
                : "w-2 h-2 bg-white/50 hover:bg-white/80"
            )}
            aria-label={`Slide ${idx + 1}`}
          />
        ))}
      </div>
    </section>
  );
}
