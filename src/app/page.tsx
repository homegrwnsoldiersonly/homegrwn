import { Navbar } from "@/components/Navbar";
import { BookCall } from "@/components/sections/BookCall";
import { Faq } from "@/components/sections/Faq";
import { Footer } from "@/components/sections/Footer";
import { Guarantee } from "@/components/sections/Guarantee";
import { Hero } from "@/components/sections/Hero";
import { IndustryMarquee } from "@/components/sections/IndustryMarquee";
import { Problem } from "@/components/sections/Problem";
import { Process } from "@/components/sections/Process";
import { Services } from "@/components/sections/Services";
import { StatsBar } from "@/components/sections/StatsBar";
import { VideoSection } from "@/components/sections/VideoSection";

export default function Home() {
  return (
    <>
      <Navbar />
      <main>
        <Hero />
        <IndustryMarquee />
        <VideoSection />
        <StatsBar />
        <Problem />
        <Services />
        <Process />
        <Guarantee />
        <Faq />
        <BookCall />
      </main>
      <Footer />
    </>
  );
}
