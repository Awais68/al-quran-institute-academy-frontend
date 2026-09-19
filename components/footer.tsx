import Link from "next/link";
import Image from "next/image";
import { Facebook, Instagram } from "lucide-react";
import { SOCIAL_LINKS } from "@/lib/site";

// lucide-react ships no TikTok glyph, so draw it here with the same
// `size`/`className` contract the lucide icons use.
function TikTok({ size = 24, className }: { size?: number; className?: string }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
      className={className}
    >
      <path d="M16.5 2h-2.9v13.1a2.6 2.6 0 1 1-2.6-2.6c.2 0 .4 0 .6.1V9.6a5.6 5.6 0 1 0 4.9 5.5V8.7a6.6 6.6 0 0 0 3.9 1.3V7.1a3.7 3.7 0 0 1-3.9-3.6V2Z" />
    </svg>
  );
}

// Icons are matched to the URLs configured in lib/site.ts, which is the same
// list the Organization JSON-LD publishes as `sameAs`.
const SOCIAL_ICONS = [
  { match: "facebook.com", label: "Facebook", Icon: Facebook },
  { match: "tiktok.com", label: "TikTok", Icon: TikTok },
] as const;

const SOCIAL_PROFILES = SOCIAL_LINKS.flatMap((href) => {
  const icon = SOCIAL_ICONS.find((entry) => href.includes(entry.match));
  return icon ? [{ href, label: icon.label, Icon: icon.Icon }] : [];
});

// Single source of truth for the footer link columns. These used to exist as
// two separate copies (one `lg:hidden`, one `hidden lg:block`), which rendered
// every link twice in the DOM and let the two lists drift apart — the desktop
// Programs column was missing Nazrah Quran entirely.
const FOOTER_LINK_SECTIONS = [
  {
    title: "Quick Links",
    links: [
      { href: "/about", label: "About Us" },
      { href: "/programs", label: "Our Programs" },
      { href: "/gallery", label: "Gallery" },
      { href: "/faculty", label: "Faculty" },
      { href: "/testimonials", label: "Testimonials" },
      { href: "/contact", label: "Contact Us" },
    ],
  },
  {
    title: "Programs",
    links: [
      { href: "/programs/hifz-ul-quran", label: "Hifz-ul-Quran" },
      { href: "/programs/tajweed", label: "Tajweed" },
      { href: "/programs/islamic-studies", label: "Islamic Studies" },
      { href: "/programs/arabic-language", label: "Arabic Language" },
      { href: "/programs/namaz-course", label: "Namaz Course" },
      { href: "/programs/qaida", label: "Qaida Course" },
      { href: "/programs/nazrah-quran", label: "Nazrah Quran" },
    ],
  },
] as const;

function FooterLinkSection({
  title,
  links,
}: {
  title: string;
  links: readonly { href: string; label: string }[];
}) {
  return (
    <div className="flex flex-col items-center text-center w-full lg:items-start lg:text-left">
      <h4 className="text-sm sm:text-base md:text-lg font-bold mb-2 sm:mb-3 md:mb-4 text-white">
        {title}
      </h4>
      <ul className="space-y-1.5 sm:space-y-2 md:space-y-3">
        {links.map(({ href, label }) => (
          <li key={href}>
            <Link
              href={href}
              className="text-primary-200 hover:text-white transition-colors flex items-center text-xs sm:text-sm md:text-base"
            >
              <span className="w-1 h-1 sm:w-1.5 sm:h-1.5 md:w-2 md:h-2 bg-accent-500 rounded-full mr-1 sm:mr-2 md:mr-2.5"></span>
              {label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

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
                  src="/images/al-quran-institute-online-logo-transparent.png"
                  alt="Al-Quran Institute Online logo"
                  fill={true}
                  sizes="(max-width: 640px) 64px, (max-width: 768px) 80px, 112px"
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
              {SOCIAL_PROFILES.map(({ href, label, Icon }) => (
                <Link
                  key={href}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-accent-400 hover:text-accent-300 transition-colors"
                >
                  <Icon size={14} className="sm:h-5 sm:w-5 md:h-6 md:w-6" />
                  <span className="sr-only">{label}</span>
                </Link>
              ))}
              {/* Instagram is shown for brand recognition only — the account
                  is not live yet, so it is deliberately not a link. */}
              <span className="text-accent-400" aria-hidden="true">
                <Instagram size={14} className="sm:h-5 sm:w-5 md:h-6 md:w-6" />
              </span>
            </div>
          </div>

          {/* One DOM copy of both link columns. Below `lg` the wrapper is a
              2-column grid sitting inside a single cell of the footer grid;
              from `lg` up it becomes `display: contents`, so the two sections
              promote into cells of the parent 4-column grid. No duplicated
              markup, no duplicated links in the DOM. */}
          <div className="w-full grid grid-cols-2 gap-4 justify-center lg:contents">
            {FOOTER_LINK_SECTIONS.map((section) => (
              <FooterLinkSection
                key={section.title}
                title={section.title}
                links={section.links}
              />
            ))}
          </div>

          <div className="xs:col-span-2 lg:col-span-1">
            <h4 className="text-sm sm:text-base md:text-lg font-bold mb-2 sm:mb-3 md:mb-4 text-white">
              Contact Info
            </h4>
            <ul className="space-y-2 sm:space-y-3 md:space-y-4">
              {/* <li className="flex items-center">
                <Phone className="h-3.5 w-3.5 sm:h-4 sm:w-4 md:h-5 md:w-5 mr-2 md:mr-3 text-accent-400 flex-shrink-0" />
                <span className="text-primary-200 text-xs sm:text-sm md:text-base">
                  +92-340-3201940
                </span>
              </li> */}
              {/* Both entries were bare <a> children of the <ul> (invalid HTML,
                  with an empty <li> wedged between them as a spacer). */}
              <li>
                <a
                  href="https://wa.me/923403201940"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-white hover:text-accent-300 transition-colors text-xs md:text-sm underline"
                >
                  +92-340-3201940
                </a>
              </li>
              <li>
                <a
                  href="mailto:aqionline786@gmail.com"
                  className="text-white hover:text-accent-300 transition-colors text-xs md:text-sm underline"
                >
                  aqionline786@gmail.com
                </a>
              </li>
            </ul>

            <div className="mt-4 sm:mt-5 md:mt-6 pt-4 sm:pt-5 md:pt-6 border-t border-primary-800">
              <Link
                href="/signup"
                className="bg-accent-600 hover:bg-accent-500 border-white text-white px-3 sm:px-4 border-2 md:px-5  py-1.5 sm:py-2 md:py-3 rounded-md text-[10px] sm:text-xs md:text-sm lg:text-base font-medium transition-colors inline-block"
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
