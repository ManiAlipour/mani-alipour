import AboutSection from "@/components/sections/home/About";
import Blogs from "@/components/sections/home/Blogs";
import Contact from "@/components/sections/home/Contact";
import HeroSection from "@/components/sections/home/HeroSection";
import Projects from "@/components/sections/home/Projects";

export default function Home() {
  return (
    <div>
      <HeroSection />
      <AboutSection />
      <Projects />
      <Blogs />
      <Contact />
    </div>
  );
}
