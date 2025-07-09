import Link from "next/link";
import Image from "next/image";
import {
  Facebook,
  Instagram,
  Mail,
  MapPin,
  Phone,
  Twitter,
  Youtube,
} from "lucide-react";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-primary-900 text-white islamic-pattern-light">
      <div className="container mx-auto px-4 py-12 md:py-16">
        <div className="grid grid-cols-1 xs:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8 md:gap-12">
          <div>
            <div className="flex items-center mb-3 sm:mb-4 md:mb-6">
              <div className="relative h-16 w-24 md:h-20 md:w-20 bg-white mr-2 backdrop-blur-sm rounded-full overflow-hidden shadow-lg">
                <Image
                  src="/images/logotp.png"
                  alt="Madarsa Hajira Logo"
                  fill={true}
                  className="object-contain"
                />
              </div>
              <div>
                <h3 className="text-lg sm:text-xl md:text-2xl font-bold font-noto text-white">
                  Al-Quran Institute Online
                </h3>
                <br />
                {/* <p className="text-[8px] sm:text-[10px] md:text-xs text-accent-300">ESTABLISHED 2010</p> */}
              </div>
            </div>
            <p className="mb-3 sm:mb-4 md:mb-6 text-primary-200 leading-relaxed text-xs sm:text-sm">
              Providing quality Islamic education with a focus on character
              development and practical implementation of knowledge.
            </p>
            <div className="flex space-x-2 sm:space-x-3 md:space-x-4">
              <Link
                href="#"
                className="text-accent-400 hover:text-accent-300 transition-colors"
              >
                <Facebook size={16} className="sm:h-5 sm:w-5" />
                <span className="sr-only">Facebook</span>
              </Link>
              <Link
                href="#"
                className="text-accent-400 hover:text-accent-300 transition-colors"
              >
                <Twitter size={16} className="sm:h-5 sm:w-5" />
                <span className="sr-only">Twitter</span>
              </Link>
              <Link
                href="#"
                className="text-accent-400 hover:text-accent-300 transition-colors"
              >
                <Instagram size={16} className="sm:h-5 sm:w-5" />
                <span className="sr-only">Instagram</span>
              </Link>
              <Link
                href="#"
                className="text-accent-400 hover:text-accent-300 transition-colors"
              >
                <Youtube size={16} className="sm:h-5 sm:w-5" />
                <span className="sr-only">YouTube</span>
              </Link>
            </div>
          </div>

          <div>
            <h4 className="text-sm sm:text-base md:text-lg font-bold mb-3 sm:mb-4 md:mb-6 text-white">
              Quick Links
            </h4>
            <ul className="space-y-1.5 sm:space-y-2 md:space-y-3">
              <li>
                <Link
                  href="/#about"
                  className="text-primary-200 hover:text-white transition-colors flex items-center text-xs sm:text-sm"
                >
                  <span className="w-1 h-1 sm:w-1.5 sm:h-1.5 bg-accent-500 rounded-full mr-1.5 sm:mr-2"></span>
                  About Us
                </Link>
              </li>
              <li>
                <Link
                  href="/#programs"
                  className="text-primary-200 hover:text-white transition-colors flex items-center text-xs sm:text-sm"
                >
                  <span className="w-1 h-1 sm:w-1.5 sm:h-1.5 bg-accent-500 rounded-full mr-1.5 sm:mr-2"></span>
                  Our Programs
                </Link>
              </li>
              <li>
                <Link
                  href="/#gallery"
                  className="text-primary-200 hover:text-white transition-colors flex items-center text-xs sm:text-sm"
                >
                  <span className="w-1 h-1 sm:w-1.5 sm:h-1.5 bg-accent-500 rounded-full mr-1.5 sm:mr-2"></span>
                  Gallery
                </Link>
              </li>
              <li>
                <Link
                  href="/#faculty"
                  className="text-primary-200 hover:text-white transition-colors flex items-center text-xs sm:text-sm"
                >
                  <span className="w-1 h-1 sm:w-1.5 sm:h-1.5 bg-accent-500 rounded-full mr-1.5 sm:mr-2"></span>
                  Faculty
                </Link>
              </li>
              <li>
                <Link
                  href="/#testimonials"
                  className="text-primary-200 hover:text-white transition-colors flex items-center text-xs sm:text-sm"
                >
                  <span className="w-1 h-1 sm:w-1.5 sm:h-1.5 bg-accent-500 rounded-full mr-1.5 sm:mr-2"></span>
                  Testimonials
                </Link>
              </li>
              <li>
                <Link
                  href="/#contact"
                  className="text-primary-200 hover:text-white transition-colors flex items-center text-xs sm:text-sm"
                >
                  <span className="w-1 h-1 sm:w-1.5 sm:h-1.5 bg-accent-500 rounded-full mr-1.5 sm:mr-2"></span>
                  Contact Us
                </Link>
              </li>
            </ul>
          </div>

          <div className="xs:col-span-2 lg:col-span-1">
            <h4 className="text-sm sm:text-base md:text-lg font-bold mb-3 sm:mb-4 md:mb-6 text-white">
              Programs
            </h4>
            <ul className="space-y-1.5 sm:space-y-2 md:space-y-3">
              <li>
                <Link
                  href="/#programs"
                  className="text-primary-200 hover:text-white transition-colors flex items-center text-xs sm:text-sm"
                >
                  <span className="w-1 h-1 sm:w-1.5 sm:h-1.5 bg-accent-500 rounded-full mr-1.5 sm:mr-2"></span>
                  Hifz-ul-Quran
                </Link>
              </li>
              <li>
                <Link
                  href="/programs"
                  className="text-primary-200 hover:text-white transition-colors flex items-center text-xs sm:text-sm"
                >
                  <span className="w-1 h-1 sm:w-1.5 sm:h-1.5 bg-accent-500 rounded-full mr-1.5 sm:mr-2"></span>
                  Tajweed
                </Link>
              </li>
              <li>
                <Link
                  href="/#programs"
                  className="text-primary-200 hover:text-white transition-colors flex items-center text-xs sm:text-sm"
                >
                  <span className="w-1 h-1 sm:w-1.5 sm:h-1.5 bg-accent-500 rounded-full mr-1.5 sm:mr-2"></span>
                  Islamic Studies
                </Link>
              </li>
              <li>
                <Link
                  href="/#programs"
                  className="text-primary-200 hover:text-white transition-colors flex items-center text-xs sm:text-sm"
                >
                  <span className="w-1 h-1 sm:w-1.5 sm:h-1.5 bg-accent-500 rounded-full mr-1.5 sm:mr-2"></span>
                  Arabic Language
                </Link>
              </li>
              <li>
                <Link
                  href="/#programs"
                  className="text-primary-200 hover:text-white transition-colors flex items-center text-xs sm:text-sm"
                >
                  <span className="w-1 h-1 sm:w-1.5 sm:h-1.5 bg-accent-500 rounded-full mr-1.5 sm:mr-2"></span>
                  Fiqh
                </Link>
              </li>
            </ul>
          </div>

          <div className="xs:col-span-2 lg:col-span-1">
            <h4 className="text-sm sm:text-base md:text-lg font-bold mb-3 sm:mb-4 md:mb-6 text-white">
              Contact Info
            </h4>
            <ul className="space-y-2 sm:space-y-3 md:space-y-4">
              <li className="flex items-center">
                <Phone className="h-3.5 w-3.5 sm:h-4 sm:w-4 md:h-5 md:w-5 mr-2 md:mr-3 text-accent-400 flex-shrink-0" />
                <span className="text-primary-200 text-xs sm:text-sm">
                  +92-340-3201940
                </span>
              </li>
              <li className="flex items-center">
                <Mail className="h-3.5 w-3.5 sm:h-4 sm:w-4 md:h-5 md:w-5 mr-2 md:mr-3 text-accent-400 flex-shrink-0" />
                <span className="text-primary-200 text-xs sm:text-sm">
                  info@alquraninstituteonline.com
                </span>
              </li>
            </ul>

            <div className="mt-4 sm:mt-5 md:mt-6 pt-4 sm:pt-5 md:pt-6 border-t border-primary-800">
              <Link
                href="/signup"
                className="bg-accent-600 hover:bg-accent-500 text-white px-3 sm:px-4 md:px-5 py-1.5 sm:py-2 md:py-3 rounded-md text-[10px] xs:text-xs sm:text-sm font-medium transition-colors inline-block"
              >
                Enroll Now
              </Link>
            </div>
          </div>
        </div>

        <div className="border-t border-primary-800 mt-6 sm:mt-8 md:mt-12 pt-4 sm:pt-6 md:pt-8 text-center text-primary-300 text-[10px] xs:text-xs sm:text-sm">
          <p>
            &copy; {currentYear} Al-Quran Institute Online. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
