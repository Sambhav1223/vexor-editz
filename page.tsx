import { Navbar } from "@/components/Navbar";
import { Hero } from "@/components/Hero";
import { Portfolio } from "@/components/Portfolio";
import { YouTubeSection } from "@/components/YouTubeSection";
import { About } from "@/components/About";
import { Contact } from "@/components/Contact";
import { Footer } from "@/components/Footer";

export default function Home() {
  return (
    <>
      <Navbar />
      <main id="main">
        <Hero />
        <Portfolio />
        <YouTubeSection />
        <About />
        <Contact />
      </main>
      <Footer />
    </>
  );
}
