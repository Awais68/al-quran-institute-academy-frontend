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
      <div className="container mx-auto px-4 sm:px-6 md:px-8 lg:px-10 py-6 sm:py-8 md:py-10 lg:py-12">
        <div className="grid grid-cols-1 xs:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 md:gap-8 justify-items-center text-center lg:justify-items-start lg:text-left">
          <div>
            <div className="flex flex-col items-center lg:flex-row lg:items-center mb-3 sm:mb-4 md:mb-6">
              <div className="relative h-12 w-16 sm:h-16 sm:w-20 md:h-20 md:w-24 lg:h-24 lg:w-28 bg-white mr-0 lg:mr-2 sm:mr-3 md:mr-4 backdrop-blur-sm rounded-full overflow-hidden shadow-lg mx-auto lg:mx-0">
                <Image
                  src="/images/logotp.png"
                  alt="Al-Quran Logo"
                  fill={true}
                  className="object-contain"
                />
              </div>
              <div>
                <h3 className="text-base sm:text-lg md:text-xl lg:text-2xl font-bold font-noto text-white">
                  Al-Quran Institute Online
                </h3>
                <br />
              </div>
            </div>
            <p className="mb-3 sm:mb-4 md:mb-6 text-primary-200 leading-relaxed text-xs sm:text-sm md:text-base">
              Providing quality Islamic education with a focus on character
              development and practical implementation of knowledge.
            </p>
            <div className="flex  space-x-2 sm:space-x-3  md:space-x-4 sm:flex justify-center">
              <Link
                href="#"
                className="text-accent-400 hover:text-accent-300 transition-colors"
              >
                <Facebook size={14} className="sm:h-5 sm:w-5 md:h-6 md:w-6" />
                <span className="sr-only">Facebook</span>
              </Link>
              <Link
                href="#"
                className="text-accent-400 hover:text-accent-300 transition-colors"
              >
                <Twitter size={14} className="sm:h-5 sm:w-5 md:h-6 md:w-6" />
                <span className="sr-only">Twitter</span>
              </Link>
              <Link
                href="#"
                className="text-accent-400 hover:text-accent-300 transition-colors"
              >
                <Instagram size={14} className="sm:h-5 sm:w-5 md:h-6 md:w-6" />
                <span className="sr-only">Instagram</span>
              </Link>
              <Link
                href="#"
                className="text-accent-400 hover:text-accent-300 transition-colors"
              >
                <Youtube size={14} className="sm:h-5 sm:w-5 md:h-6 md:w-6" />
                <span className="sr-only">YouTube</span>
              </Link>
            </div>
          </div>

          {/* Mobile/Tablet: Quick Links and Programs side by side, Desktop: Quick Links only */}
          <div className="lg:hidden w-full">
            <div className="grid grid-cols-2 w-full gap-4 justify-center">
              <div className="flex flex-col items-center text-center w-full">
                <h4 className="text-sm sm:text-base md:text-lg font-bold mb-2 sm:mb-3 md:mb-4 text-white">
                  Quick Links
                </h4>
                <ul className="space-y-1.5 sm:space-y-2 md:space-y-3">
                  <li>
                    <Link
                      href="/#about"
                      className="text-primary-200 hover:text-white transition-colors flex items-center text-xs sm:text-sm md:text-base"
                    >
                      <span className="w-1 h-1 sm:w-1.5 sm:h-1.5 md:w-2 md:h-2 bg-accent-500 rounded-full mr-1 sm:mr-2 md:mr-2.5"></span>
                      About Us
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/#programs"
                      className="text-primary-200 hover:text-white transition-colors flex items-center text-xs sm:text-sm md:text-base"
                    >
                      <span className="w-1 h-1 sm:w-1.5 sm:h-1.5 md:w-2 md:h-2 bg-accent-500 rounded-full mr-1 sm:mr-2 md:mr-2.5"></span>
                      Our Programs
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/#gallery"
                      className="text-primary-200 hover:text-white transition-colors flex items-center text-xs sm:text-sm md:text-base"
                    >
                      <span className="w-1 h-1 sm:w-1.5 sm:h-1.5 md:w-2 md:h-2 bg-accent-500 rounded-full mr-1 sm:mr-2 md:mr-2.5"></span>
                      Gallery
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/#faculty"
                      className="text-primary-200 hover:text-white transition-colors flex items-center text-xs sm:text-sm md:text-base"
                    >
                      <span className="w-1 h-1 sm:w-1.5 sm:h-1.5 md:w-2 md:h-2 bg-accent-500 rounded-full mr-1 sm:mr-2 md:mr-2.5"></span>
                      Faculty
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/#testimonials"
                      className="text-primary-200 hover:text-white transition-colors flex items-center text-xs sm:text-sm md:text-base"
                    >
                      <span className="w-1 h-1 sm:w-1.5 sm:h-1.5 md:w-2 md:h-2 bg-accent-500 rounded-full mr-1 sm:mr-2 md:mr-2.5"></span>
                      Testimonials
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/#contact"
                      className="text-primary-200 hover:text-white transition-colors flex items-center text-xs sm:text-sm md:text-base"
                    >
                      <span className="w-1 h-1 sm:w-1.5 sm:h-1.5 md:w-2 md:h-2 bg-accent-500 rounded-full mr-1 sm:mr-2 md:mr-2.5"></span>
                      Contact Us
                    </Link>
                  </li>
                </ul>
              </div>
              <div className="flex flex-col items-center text-center w-full">
                <h4 className="text-sm sm:text-base md:text-lg font-bold mb-2 sm:mb-3 md:mb-4 text-white">
                  Programs
                </h4>
                <ul className="space-y-1.5 sm:space-y-2 md:space-y-3">
                  <li>
                    <Link
                      href="/#programs"
                      className="text-primary-200 hover:text-white transition-colors flex items-center text-xs sm:text-sm md:text-base"
                    >
                      <span className="w-1 h-1 sm:w-1.5 sm:h-1.5 md:w-2 md:h-2 bg-accent-500 rounded-full mr-1 sm:mr-2 md:mr-2.5"></span>
                      Hifz-ul-Quran
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/programs"
                      className="text-primary-200 hover:text-white transition-colors flex items-center text-xs sm:text-sm md:text-base"
                    >
                      <span className="w-1 h-1 sm:w-1.5 sm:h-1.5 md:w-2 md:h-2 bg-accent-500 rounded-full mr-1 sm:mr-2 md:mr-2.5"></span>
                      Tajweed
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/#programs"
                      className="text-primary-200 hover:text-white transition-colors flex items-center text-xs sm:text-sm md:text-base"
                    >
                      <span className="w-1 h-1 sm:w-1.5 sm:h-1.5 md:w-2 md:h-2 bg-accent-500 rounded-full mr-1 sm:mr-2 md:mr-2.5"></span>
                      Islamic Studies
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/#programs"
                      className="text-primary-200 hover:text-white transition-colors flex items-center text-xs sm:text-sm md:text-base"
                    >
                      <span className="w-1 h-1 sm:w-1.5 sm:h-1.5 md:w-2 md:h-2 bg-accent-500 rounded-full mr-1 sm:mr-2 md:mr-2.5"></span>
                      Arabic Language
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/#programs"
                      className="text-primary-200 hover:text-white transition-colors flex items-center text-xs sm:text-sm md:text-base"
                    >
                      <span className="w-1 h-1 sm:w-1.5 sm:h-1.5 md:w-2 md:h-2 bg-accent-500 rounded-full mr-1 sm:mr-2 md:mr-2.5"></span>
                      Namaz Course
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/#programs"
                      className="text-primary-200 hover:text-white transition-colors flex items-center text-xs sm:text-sm md:text-base"
                    >
                      <span className="w-1 h-1 sm:w-1.5 sm:h-1.5 md:w-2 md:h-2 bg-accent-500 rounded-full mr-1 sm:mr-2 md:mr-2.5"></span>
                      Quaida Course
                    </Link>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          {/* Desktop: Quick Links */}
          <div className="hidden lg:block">
            <h4 className="text-sm sm:text-base md:text-lg font-bold mb-2 sm:mb-3 md:mb-4 text-white">
              Quick Links
            </h4>
            <ul className="space-y-1.5 sm:space-y-2 md:space-y-3">
              <li>
                <Link
                  href="/#about"
                  className="text-primary-200 hover:text-white transition-colors flex items-center text-xs sm:text-sm md:text-base"
                >
                  <span className="w-1 h-1 sm:w-1.5 sm:h-1.5 md:w-2 md:h-2 bg-accent-500 rounded-full mr-1 sm:mr-2 md:mr-2.5"></span>
                  About Us
                </Link>
              </li>
              <li>
                <Link
                  href="/#programs"
                  className="text-primary-200 hover:text-white transition-colors flex items-center text-xs sm:text-sm md:text-base"
                >
                  <span className="w-1 h-1 sm:w-1.5 sm:h-1.5 md:w-2 md:h-2 bg-accent-500 rounded-full mr-1 sm:mr-2 md:mr-2.5"></span>
                  Our Programs
                </Link>
              </li>
              <li>
                <Link
                  href="/#gallery"
                  className="text-primary-200 hover:text-white transition-colors flex items-center text-xs sm:text-sm md:text-base"
                >
                  <span className="w-1 h-1 sm:w-1.5 sm:h-1.5 md:w-2 md:h-2 bg-accent-500 rounded-full mr-1 sm:mr-2 md:mr-2.5"></span>
                  Gallery
                </Link>
              </li>
              <li>
                <Link
                  href="/#faculty"
                  className="text-primary-200 hover:text-white transition-colors flex items-center text-xs sm:text-sm md:text-base"
                >
                  <span className="w-1 h-1 sm:w-1.5 sm:h-1.5 md:w-2 md:h-2 bg-accent-500 rounded-full mr-1 sm:mr-2 md:mr-2.5"></span>
                  Faculty
                </Link>
              </li>
              <li>
                <Link
                  href="/#testimonials"
                  className="text-primary-200 hover:text-white transition-colors flex items-center text-xs sm:text-sm md:text-base"
                >
                  <span className="w-1 h-1 sm:w-1.5 sm:h-1.5 md:w-2 md:h-2 bg-accent-500 rounded-full mr-1 sm:mr-2 md:mr-2.5"></span>
                  Testimonials
                </Link>
              </li>
              <li>
                <Link
                  href="/#contact"
                  className="text-primary-200 hover:text-white transition-colors flex items-center text-xs sm:text-sm md:text-base"
                >
                  <span className="w-1 h-1 sm:w-1.5 sm:h-1.5 md:w-2 md:h-2 bg-accent-500 rounded-full mr-1 sm:mr-2 md:mr-2.5"></span>
                  Contact Us
                </Link>
              </li>
            </ul>
          </div>

          {/* Desktop: Programs */}
          <div className="hidden lg:block">
            <h4 className="text-sm sm:text-base md:text-lg font-bold mb-2 sm:mb-3 md:mb-4 text-white">
              Programs
            </h4>
            <ul className="space-y-1.5 sm:space-y-2 md:space-y-3">
              <li>
                <Link
                  href="/#programs"
                  className="text-primary-200 hover:text-white transition-colors flex items-center text-xs sm:text-sm md:text-base"
                >
                  <span className="w-1 h-1 sm:w-1.5 sm:h-1.5 md:w-2 md:h-2 bg-accent-500 rounded-full mr-1 sm:mr-2 md:mr-2.5"></span>
                  Hifz-ul-Quran
                </Link>
              </li>
              <li>
                <Link
                  href="/programs"
                  className="text-primary-200 hover:text-white transition-colors flex items-center text-xs sm:text-sm md:text-base"
                >
                  <span className="w-1 h-1 sm:w-1.5 sm:h-1.5 md:w-2 md:h-2 bg-accent-500 rounded-full mr-1 sm:mr-2 md:mr-2.5"></span>
                  Tajweed
                </Link>
              </li>
              <li>
                <Link
                  href="/#programs"
                  className="text-primary-200 hover:text-white transition-colors flex items-center text-xs sm:text-sm md:text-base"
                >
                  <span className="w-1 h-1 sm:w-1.5 sm:h-1.5 md:w-2 md:h-2 bg-accent-500 rounded-full mr-1 sm:mr-2 md:mr-2.5"></span>
                  Islamic Studies
                </Link>
              </li>
              <li>
                <Link
                  href="/#programs"
                  className="text-primary-200 hover:text-white transition-colors flex items-center text-xs sm:text-sm md:text-base"
                >
                  <span className="w-1 h-1 sm:w-1.5 sm:h-1.5 md:w-2 md:h-2 bg-accent-500 rounded-full mr-1 sm:mr-2 md:mr-2.5"></span>
                  Arabic Language
                </Link>
              </li>
              <li>
                <Link
                  href="/#programs"
                  className="text-primary-200 hover:text-white transition-colors flex items-center text-xs sm:text-sm md:text-base"
                >
                  <span className="w-1 h-1 sm:w-1.5 sm:h-1.5 md:w-2 md:h-2 bg-accent-500 rounded-full mr-1 sm:mr-2 md:mr-2.5"></span>
                  Namaz Course
                </Link>
              </li>
              <li>
                <Link
                  href="/#programs"
                  className="text-primary-200 hover:text-white transition-colors flex items-center text-xs sm:text-sm md:text-base"
                >
                  <span className="w-1 h-1 sm:w-1.5 sm:h-1.5 md:w-2 md:h-2 bg-accent-500 rounded-full mr-1 sm:mr-2 md:mr-2.5"></span>
                  Quaida Course
                </Link>
              </li>
            </ul>
          </div>

          <div className="xs:col-span-2 lg:col-span-1">
            <h4 className="text-sm sm:text-base md:text-lg font-bold mb-2 sm:mb-3 md:mb-4 text-white">
              Contact Info
            </h4>
            <ul className="space-y-2 sm:space-y-3 md:space-y-4">
              <li className="flex items-center">
                <Phone className="h-3.5 w-3.5 sm:h-4 sm:w-4 md:h-5 md:w-5 mr-2 md:mr-3 text-accent-400 flex-shrink-0" />
                <span className="text-primary-200 text-xs sm:text-sm md:text-base">
                  +92-340-3201940
                </span>
              </li>
              <li className="flex items-center">
                <Mail className="h-3.5 w-3.5 sm:h-4 sm:w-4 md:h-5 md:w-5 mr-2 md:mr-3 text-accent-400 flex-shrink-0" />
                <span className="text-primary-200 text-xs sm:text-sm md:text-base">
                  info@alquraninstituteonline.com
                </span>
              </li>
            </ul>

            <div className="mt-4 sm:mt-5 md:mt-6 pt-4 sm:pt-5 md:pt-6 border-t border-primary-800">
              <Link
                href="/signup"
                className="bg-accent-600 hover:bg-accent-500 border-2 text-white px-3 sm:px-4 border-2 md:px-5  py-1.5 sm:py-2 md:py-3 rounded-md text-[10px] sm:text-xs md:text-sm lg:text-base font-medium transition-colors inline-block"
              >
                Enroll Now
              </Link>
            </div>
          </div>
        </div>

        <div className="border-t border-primary-800 mt-4 sm:mt-6 md:mt-8 pt-2 sm:pt-3 md:pt-4 text-center text-primary-300 text-[10px] sm:text-xs md:text-sm lg:text-base">
          <p>© {currentYear} Al-Quran Institute Online. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
