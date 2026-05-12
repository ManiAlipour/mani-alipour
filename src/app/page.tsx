import AboutSection from "@/components/sections/home/About";
import HeroSection from "@/components/sections/home/HeroSection";
import Projects from "@/components/sections/home/Projects";
import Link from "next/link";

export default function Home() {
  return (
    <div>
      <HeroSection />
      <AboutSection />
      <Projects />
    </div>
  );
}
