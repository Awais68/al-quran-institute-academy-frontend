import Header from "@/components/header";
import Hero from "@/components/hero";
import About from "@/components/about";
import Programs from "@/components/programs";
import Statistics from "@/components/statistics";
import Gallery from "@/components/gallery";
import Testimonials from "@/components/testimonials";
import Faculty from "@/components/faculty";
import Contact from "@/components/contact";
import Footer from "@/components/footer";
import ChatWidget from "@/components/chatPage";

export default function Home() {
  return (
    <main className="min-h-screen w-full overflow-x-hidden overflow-y-auto">
      <Header />
      <Hero />
      <About />
      <Programs />
      <Statistics />
      <Gallery />
      <Faculty />
      <Testimonials />
      <Contact />
      <Footer />

      <ChatWidget />
    </main>
  );
}
