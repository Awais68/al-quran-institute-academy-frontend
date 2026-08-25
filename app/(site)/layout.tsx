import Header from "@/components/header";
import Footer from "@/components/footer";
import WhatsAppFloat from "@/components/whatsapp-float";

/**
 * Shell for the standalone marketing pages (/about, /programs, /gallery,
 * /faculty, /testimonials, /contact).
 *
 * The homepage renders Header/Footer itself because it is a one-page scroll,
 * so it deliberately sits outside this route group. A route group adds no
 * path segment — /about stays /about.
 */
export default function SiteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen w-full flex-col overflow-x-hidden">
      <Header />
      <div className="flex-1">{children}</div>
      <Footer />
      <WhatsAppFloat />
    </div>
  );
}
