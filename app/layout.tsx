import type React from "react";
import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import localFont from "next/font/local";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import AuthContextProvider from "./context/AuthContext";
import ErrorBoundary from "@/components/error-boundary";
import { Toaster } from "@/components/ui/toaster";
import "react-day-picker/dist/style.css";
import {
  OG_IMAGE,
  SITE_DESCRIPTION,
  SITE_NAME,
  SITE_TITLE,
  SITE_URL,
} from "@/lib/site";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
});

// Load Noto Nastaliq Urdu font for Urdu text
const notoNastaliq = localFont({
  src: [
    {
      path: "../public/fonts/NotoNastaliqUrdu-Regular.ttf",
      weight: "400",
      style: "normal",
    },
    {
      path: "../public/fonts/NotoNastaliqUrdu-Bold.ttf",
      weight: "700",
      style: "normal",
    },
  ],
  display: "swap",
  variable: "--font-noto",
});

export const metadata: Metadata = {
  // metadataBase turns every relative `alternates.canonical` and every relative
  // OG/Twitter image path in a child segment into an absolute URL on the
  // canonical (non-www) host. Social crawlers reject relative image URLs.
  metadataBase: new URL(SITE_URL),
  title: {
    // Homepage title. Child segments export a short title and this template
    // appends the brand, so no page has to repeat it by hand.
    default: SITE_TITLE,
    template: `%s | ${SITE_NAME}`,
  },
  description: SITE_DESCRIPTION,
  applicationName: SITE_NAME,
  keywords: [
    "online Quran academy",
    "online Quran classes",
    "Hifz ul Quran online",
    "online Tajweed course",
    "Nazrah Quran online",
    "Noorani Qaida online",
    "learn Quran online with Tajweed",
    "female Quran teacher online",
    "Islamic education online",
    "online Arabic classes",
  ],
  authors: [{ name: SITE_NAME, url: SITE_URL }],
  creator: SITE_NAME,
  publisher: SITE_NAME,
  // Default canonical for the homepage. Every other page overrides this in its
  // own `metadata` / `generateMetadata` export.
  alternates: {
    canonical: "/",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
  openGraph: {
    type: "website",
    url: SITE_URL,
    siteName: SITE_NAME,
    title: `${SITE_TITLE} | ${SITE_NAME}`,
    description: SITE_DESCRIPTION,
    locale: "en_US",
    images: [OG_IMAGE],
  },
  twitter: {
    card: "summary_large_image",
    title: `${SITE_TITLE} | ${SITE_NAME}`,
    description: SITE_DESCRIPTION,
    images: [OG_IMAGE.url],
  },
  icons: {
    icon: "/images/al-quran-institute-online-logo-transparent.png",
    apple: "/icons/icon-192x192.png",
  },
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "Quran Academy",
  },
  formatDetection: {
    telephone: false,
  },
};

// WCAG 1.4.4 (Resize Text): the viewport must NOT block pinch-to-zoom, so no
// `maximumScale` / `userScalable: false` here — only width + initial scale.
export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#2563eb",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        {/* manifest, apple-touch-icon, apple-web-app and format-detection tags
            are emitted by the Metadata API above — hand-writing them here too
            produced duplicates in <head>. */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              if ('serviceWorker' in navigator) {
                window.addEventListener('load', () => {
                  navigator.serviceWorker.register('/sw.js')
                    .then(reg => console.log('Service Worker registered:', reg.scope))
                    .catch(err => console.warn('Service Worker registration failed:', err));
                });
              }
            `,
          }}
        />
      </head>
      <body
        className={`${inter.variable} ${notoNastaliq.variable} font-sans overflow-x-hidden overflow-y-auto`}
        cz-shortcut-listen="true"
      >
        <ErrorBoundary>
          <AuthContextProvider>
            <ThemeProvider
              attribute="class"
              defaultTheme="light"
              enableSystem
              disableTransitionOnChange
            >
              {children}
              <Toaster />
            </ThemeProvider>
          </AuthContextProvider>
        </ErrorBoundary>
      </body>
    </html>
  );
}
