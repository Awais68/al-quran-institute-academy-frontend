"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { Menu, X } from "lucide-react";
import { cn } from "@/lib/utils";
import AuthButtons from "./auth/auth-buttons";
import { useMediaQuery } from "@/hooks/use-media-query";




export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const isMobile = useMediaQuery("(max-width: 1023px)");

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close mobile menu when switching to desktop view
  useEffect(() => {
    if (!isMobile && isMenuOpen) {
      setIsMenuOpen(false);
    }
  }, [isMobile, isMenuOpen]);

  // Prevent body scroll when mobile menu is open
  useEffect(() => {
    if (isMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isMenuOpen]);

  // After all hooks, conditionally render
  if (isMobile === undefined) return null;

  return (
    <header
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
        isScrolled
          ? "bg-white/95 backdrop-blur-md shadow-md py-2"
          : "bg-transparent py-0 md:py-0"
      )}
    >
      <div className="container mx-auto px-4 flex items-center justify-between">
        <Link href="/" className="flex items-center z-20 cursor-pointer">
          <div className="relative h-16 w-16 md:h-32 md:w-32">
            <Image
              src="/images/logotp.png"
              alt="Al-Quran Institute Online"
              fill={true}
              className="object-contain"
            />
          </div>
        </Link>

        <nav className="hidden lg:flex items-center space-x-6 xl:space-x-8">
          <Link
            href="/#about"
            className={cn(
              "text-sm font-medium hover:text-primary-700 transition-colors",
              isScrolled ? "text-gray-900" : "text-white"
            )}
          >
            About
          </Link>
          <Link
            href="/#programs"
            className={cn(
              "text-sm font-medium hover:text-primary-700 transition-colors",
              isScrolled ? "text-gray-900" : "text-white"
            )}
          >
            Programs
          </Link>
          <Link
            href="/#gallery"
            className={cn(
              "text-sm font-medium hover:text-primary-700 transition-colors",
              isScrolled ? "text-gray-900" : "text-white"
            )}
          >
            Gallery
          </Link>
          <Link
            href="/#faculty"
            className={cn(
              "text-sm font-medium hover:text-primary-700 transition-colors",
              isScrolled ? "text-gray-900" : "text-white"
            )}
          >
            Faculty
          </Link>
          <Link
            href="/#testimonials"
            className={cn(
              "text-sm font-medium hover:text-primary-700 transition-colors",
              isScrolled ? "text-gray-900" : "text-white"
            )}
          >
            Testimonials
          </Link>
          <Link
            href="/#contact"
            className={cn(
              "text-sm font-medium hover:text-primary-700 transition-colors",
              isScrolled ? "text-gray-900" : "text-white"
            )}
          >
            Contact
          </Link>

          <AuthButtons isScrolled={isScrolled} />
        </nav>

        {/* Mobile Menu Button */}
        <button
          className="lg:hidden text-gray-700 hover:text-primary-700 transition-colors p-1 z-20"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          aria-label="Toggle menu"
        >
          {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Navigation */}
      <div
        className={cn(
          "fixed inset-0 bg-white z-10 pt-20 px-4 lg:hidden transition-transform duration-300 ease-in-out overflow-y-auto",
          isMenuOpen ? "translate-x-0" : "translate-x-full"
        )}
      >
        <nav className="flex flex-col items-center space-y-5 py-8">
          <Link
            href="/#about"
            className="text-lg text-gray-700 hover:text-primary-700 transition-colors w-full text-center py-2"
            onClick={() => setIsMenuOpen(false)}
          >
            About
          </Link>
          <Link
            href="/#programs"
            className="text-lg text-gray-700 hover:text-primary-700 transition-colors w-full text-center py-2"
            onClick={() => setIsMenuOpen(false)}
          >
            Programs
          </Link>
          <Link
            href="/#gallery"
            className="text-lg text-gray-700 hover:text-primary-700 transition-colors w-full text-center py-2"
            onClick={() => setIsMenuOpen(false)}
          >
            Gallery
          </Link>
          <Link
            href="/#faculty"
            className="text-lg text-gray-700 hover:text-primary-700 transition-colors w-full text-center py-2"
            onClick={() => setIsMenuOpen(false)}
          >
            Faculty
          </Link>
          <Link
            href="/#testimonials"
            className="text-lg text-gray-700 hover:text-primary-700 transition-colors w-full text-center py-2"
            onClick={() => setIsMenuOpen(false)}
          >
            Testimonials
          </Link>
          <Link
            href="/#contact"
            className="text-lg text-gray-700 hover:text-primary-700 transition-colors w-full text-center py-2"
            onClick={() => setIsMenuOpen(false)}
          >
            Contact
          </Link>

          <div className="w-full pt-4 mt-4 border-t border-gray-100">
            <AuthButtons variant="mobile" isScrolled={isScrolled} />
          </div>
        </nav>
      </div>
    </header>
  );
}
