"use client"

import { useState } from "react"
import Link from "next/link"
import { Menu, X } from "lucide-react"
import { cn } from "@/lib/utils"

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen)
  }

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white/90 backdrop-blur-sm shadow-sm">
      <div className="container mx-auto px-4 py-3 flex items-center justify-between">
        <Link href="/" className="flex items-center">
          <span className="font-noto text-3xl font-bold text-blue-600">Al-Quran Institute Online</span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-8">
          <Link href="/#about" className="text-gray-700 hover:text-blue-600 transition-colors">
            About
          </Link>
          <Link href="/#courses" className="text-gray-700 hover:text-blue-600 transition-colors">
            Courses
          </Link>
          <Link href="/#gallery" className="text-gray-700 hover:text-blue-600 transition-colors">
            Gallery
          </Link>
          <Link href="/#testimonials" className="text-gray-700 hover:text-blue-600 transition-colors">
            Testimonials
          </Link>
          <Link
            href="/#contact"
            className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
          >
            Contact Us
          </Link>
        </nav>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden text-gray-700 hover:text-blue-600 transition-colors"
          onClick={toggleMenu}
          aria-label="Toggle menu"
        >
          {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Navigation */}
      <div
        className={cn(
          "fixed inset-0 bg-white z-40 pt-20 px-4 md:hidden transition-transform duration-300 ease-in-out",
          isMenuOpen ? "translate-x-0" : "translate-x-full",
        )}
      >
        <nav className="flex flex-col items-center space-y-6">
          <Link
            href="/#about"
            className="text-xl text-gray-700 hover:text-blue-600 transition-colors"
            onClick={toggleMenu}
          >
            About
          </Link>
          <Link
            href="/#courses"
            className="text-xl text-gray-700 hover:text-blue-600 transition-colors"
            onClick={toggleMenu}
          >
            Courses
          </Link>
          <Link
            href="/#gallery"
            className="text-xl text-gray-700 hover:text-blue-600 transition-colors"
            onClick={toggleMenu}
          >
            Gallery
          </Link>
          <Link
            href="/#testimonials"
            className="text-xl text-gray-700 hover:text-blue-600 transition-colors"
            onClick={toggleMenu}
          >
            Testimonials
          </Link>
          <Link
            href="/#contact"
            className="bg-blue-600 text-white px-6 py-3 rounded-md text-xl hover:bg-blue-700 transition-colors"
            onClick={toggleMenu}
          >
            Contact Us
          </Link>
        </nav>
      </div>
    </header>
  )
}
