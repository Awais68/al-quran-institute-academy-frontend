import Header from "@/components/header";
import Hero from "@/components/hero";
import IntroVideo from "@/components/intro-video";
import About from "@/components/about";
import Programs from "@/components/programs";
import Statistics from "@/components/statistics";
import Gallery from "@/components/gallery";
import Testimonials from "@/components/testimonials";
import Faculty from "@/components/faculty";
import Contact from "@/components/contact";
import Footer from "@/components/footer";
import ChatWidget from "@/components/chatPage";
import WhatsAppFloat from "@/components/whatsapp-float";
import JsonLd from "@/components/json-ld";
import {
  organizationSchema,
  reviewListSchema,
  websiteSchema,
} from "@/lib/schema";
import { testimonials } from "@/lib/testimonials";

// The homepage's own title/description/OG/Twitter tags live in app/layout.tsx:
// in the App Router the root layout's `metadata` IS the "/" metadata, and every
// other route overrides it through its own generateMetadata export.

export default function Home() {
  return (
    <main className="min-h-screen w-full overflow-x-hidden overflow-y-auto">
      {/* Organization + WebSite identify the brand; the Review list covers the
          testimonials section rendered further down this same page. */}
      <JsonLd
        data={[
          organizationSchema(),
          websiteSchema(),
          reviewListSchema(testimonials),
        ]}
      />

      <Header />
      <Hero />
      <IntroVideo />
      <About />
      <Programs />
      <Statistics />
      <Gallery />
      <Faculty />
      <Testimonials />
      <Contact />
      <Footer />

      {/* <ChatWidget /> */}
      <WhatsAppFloat />
    </main>
  );
}
