import type React from "react";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import localFont from "next/font/local";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import AuthContextProvider from "./context/AuthContext";
import ErrorBoundary from "@/components/error-boundary";
import { Toaster } from "@/components/ui/toaster";
import "react-day-picker/dist/style.css";

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
  title: "AL-QURAN Institute Online - Islamic Education Center",
  description:
    "Al-Quran Institute Online provides quality Islamic education with a focus on character development and practical implementation of knowledge.",
  icons: {
    icon: "/images/logotp.png",
  },
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "Quran Academy",
  },
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
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
        <link rel="manifest" href="/manifest.json" />
        <link rel="apple-touch-icon" href="/icons/icon-192x192.png" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="format-detection" content="telephone=no" />
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
