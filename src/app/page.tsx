import AboutSection from "@/components/sections/home/About";
import Blogs from "@/components/sections/home/Blogs";
import Contact from "@/components/sections/home/Contact";
import HeroSection from "@/components/sections/home/HeroSection";
import Projects from "@/components/sections/home/Projects";

export default function Home() {
  const personSchema = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: "مانی علیپور",
    alternateName: "Mani Alipour",
    url: "https://manialipour.ir",
    jobTitle: "توسعه‌دهنده فول‌استک وب",
    knowsAbout: ["Next.js", "React", "Node.js", "توسعه وب", "سئو تکنیکال"],
    sameAs: ["https://t.me/manialipour", "https://linkedin.com/in/manialipour"],
  };

  return (
    <div>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(personSchema).replace(/</g, "\\u003c"),
        }}
      />
      <HeroSection />
      <AboutSection />
      <Projects />
      <Blogs />
      <Contact />
    </div>
  );
}
