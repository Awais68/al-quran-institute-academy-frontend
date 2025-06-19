import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import localFont from "next/font/local"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
})

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
})

export const metadata: Metadata = {
  title: "Madarsa Hajira - Islamic Education Center",
  description:
    "Madarsa Hajira provides quality Islamic education with a focus on character development and practical implementation of knowledge.",
     icons: {
    icon: "/images/hajiraLogo.png", 
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.variable} ${notoNastaliq.variable} font-sans overflow-x-hidden overflow-y-auto`}  cz-shortcut-listen="true">
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem disableTransitionOnChange>
          {children}
        </ThemeProvider>
      </body>
    </html>
  )
}
