import AboutSection from "@/components/sections/home/About";
import HeroSection from "@/components/sections/home/HeroSection";
import Link from "next/link";

export default function Home() {
  return (
    <div>
      <HeroSection />
      <AboutSection />
    </div>
  );
}
