"use client";
import Image from "next/image";
import Link from "next/link";
import { BiLogoTypescript } from "react-icons/bi";
import { DiReact } from "react-icons/di";
import { RiNextjsFill, RiTailwindCssFill } from "react-icons/ri";
import { FaEllipsisH, FaTelegram } from "react-icons/fa";
import { FaGithub, FaLinkedin, FaTwitter, FaInstagram } from "react-icons/fa6";

export default function HeroSection() {
  const HEADER_HEIGHT = 64;
  // سوشیال مدیاها (لینک و آیکون)
  const socialLinks = [
    {
      href: "https://github.com/mani-alipour",
      label: "GitHub",
      icon: <FaGithub />,
    },
    {
      href: "https://linkedin.com/in/mani-alipour",
      label: "LinkedIn",
      icon: <FaLinkedin />,
    },
    {
      href: "https://t.me/ManiAlipour",
      label: "Telegram",
      icon: <FaTelegram />,
    },
    {
      href: "https://instagram.com/mani.alipour",
      label: "Instagram",
      icon: <FaInstagram />,
    },
  ];

  return (
    <section
      className="relative w-full flex items-center justify-center bg-linear-to-br from-cyan-950 via-slate-900 to-cyan-950 overflow-hidden"
      style={{
        minHeight: `calc(100dvh - ${HEADER_HEIGHT}px)`,
        direction: "rtl",
      }}
      dir="rtl"
    >
      {/* Animated Blobs */}
      <div className="pointer-events-none absolute -top-24 left-0 w-72 h-72 bg-neon-green/15 blur-3xl rounded-full z-0 animate-pulse-slow" />
      <div className="pointer-events-none absolute -bottom-20 right-2 w-56 h-56 bg-neon-blue/10 blur-2xl rounded-full z-0 animate-pulse-slower" />
      <div className="pointer-events-none absolute top-32 right-10 w-36 h-36 bg-cyan-400/10 blur-2xl rounded-full z-0 animate-pulse" />

      <div className="relative z-10 w-full max-w-3xl mx-auto flex flex-col items-center justify-center gap-7 px-2 md:px-6 py-10">
        {/* Avatar */}
        <div className="relative group">
          <span className="absolute -bottom-3 -left-3 bg-neon-green/90 border-2 border-white rounded-full px-2 py-1 text-xs font-yekan font-bold text-white shadow-lg animate-bounce duration-1000 group-hover:scale-110 transition">
            آنلاین
          </span>
          <span className="absolute inset-0 rounded-full bg-gradient-to-tr from-neon-green/20 via-cyan-400/10 to-neon-blue/20 blur-xl scale-110 -z-10 animate-glow" />
          <div
            className="overflow-hidden"
            style={{
              width: 128,
              height: 128,
              borderRadius: "44%/50%",
            }}
          >
            <Image
              src="/images/profile.png"
              alt="مانی علیپور"
              width={128}
              height={128}
              className="shadow-xl border-4 border-cyan-400/80 
               transition-transform duration-200 group-hover:rotate-2 
               group-hover:scale-105 object-cover"
              style={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
                borderRadius: "44%/50%",
              }}
              priority
            />
          </div>
        </div>

        {/* Headline */}
        <h1 className="font-yekan font-extrabold text-2xl md:text-4xl text-center bg-gradient-to-l from-neon-blue via-cyan-100 to-neon-green bg-clip-text text-transparent leading-tight mb-0.5 tracking-tight relative">
          سلام! من{" "}
          <span className="text-neon-green drop-shadow-[0_2px_10px_rgba(37,255,83,0.3)]">
            مانی علیپور
          </span>{" "}
          هستم
          <span className="absolute left-1/2 bottom-[-8px] w-24 h-1 bg-gradient-to-r from-cyan-400/60 to-neon-green/40 blur-[1.5px] rounded-lg -translate-x-1/2" />
        </h1>

        {/* Subtitle */}
        <h2 className="font-shabnam text-base md:text-xl text-cyan-300 text-center font-bold mb-2 flex flex-row-reverse items-center justify-center gap-1">
          <span className="text-neon-blue inline-block animate-bounce">💻</span>
          <span className="text-neon-blue">فول استک</span>
          مهندس نرم‌افزار و توسعه‌دهنده{" "}
        </h2>

        {/* Description */}
        <p className="font-yekan text-cyan-100/90 text-center text-base md:text-lg leading-7 max-w-xl relative">
          عاشق ساخت تجربه‌های{" "}
          <span className="text-neon-green/90 bg-cyan-900/30 px-1.5 py-0.5 rounded transition">
            تعـاملی و سریع
          </span>{" "}
          با تکنولوژی‌های نوین.
          <br className="hidden md:block" />
          <span className="text-cyan-400/90">طرفدار سادگی در طراحی</span> و{" "}
          <span className="text-neon-blue/90">شفافیت در کد.</span>
        </p>

        {/* Social Media Section */}
        <div className="flex items-center justify-center gap-3 mt-1 mb-2">
          {socialLinks.map(({ href, label, icon }) => (
            <a
              key={label}
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={label}
              className="text-cyan-300 hover:text-neon-green hover:scale-110 bg-cyan-900/60 border border-cyan-700/20 rounded-full p-2 transition-all shadow-[0_2px_14px_0_rgba(58,221,221,0.05)] flex items-center"
            >
              <span className="text-xl">{icon}</span>
            </a>
          ))}
        </div>

        {/* CTA Buttons */}
        <div className="flex flex-wrap items-center justify-center gap-3 mt-2">
          <Link
            href="/projects"
            className="font-yekan px-7 py-2.5 rounded-lg bg-gradient-to-l from-neon-blue via-cyan-400 to-neon-green shadow-lg shadow-neon-blue/20 text-white font-bold text-base hover:scale-105 active:scale-100 transition-all focus-visible:ring-2 focus-visible:ring-neon-green flex items-center gap-2"
          >
            {/* Project icon */}
            <span className="inline-block animate-wiggle">🚀</span>
            نمونه کارها
          </Link>
          <Link
            href="/#contact"
            className="font-yekan px-6 py-2.5 rounded-lg border-2 border-cyan-400 text-cyan-100 font-bold text-base hover:bg-cyan-950/60 hover:text-neon-green hover:border-neon-green transition focus-visible:ring-2 focus-visible:ring-neon-blue flex items-center gap-2"
          >
            <span className="inline-block animate-pulse">✉️</span>
            ارتباط با من
          </Link>
        </div>

        {/* Skills Badges */}
        <div className="flex flex-wrap gap-2 items-center justify-center mt-6 select-none">
          <span className="bg-cyan-900/60 border border-cyan-400/20 text-cyan-200 px-3 py-1 rounded-md text-xs font-bold font-yekan flex items-center gap-1 hover:border-cyan-300 transition">
            <DiReact />
            React
          </span>
          <span className="bg-cyan-900/60 border border-neon-green/30 text-neon-green px-3 py-1 rounded-md text-xs font-bold font-yekan flex items-center gap-1 hover:border-neon-green transition">
            <RiNextjsFill className="inline-block text-base" />
            Next.js
          </span>
          <span className="bg-cyan-900/60 border border-neon-blue/25 text-neon-blue px-3 py-1 rounded-md text-xs font-bold font-yekan flex items-center gap-1 hover:border-neon-blue transition">
            <BiLogoTypescript className="inline-block text-base" />
            TypeScript
          </span>
          <span className="bg-cyan-900/60 border border-cyan-300/25 text-cyan-300 px-3 py-1 rounded-md text-xs font-bold font-yekan flex items-center gap-1 hover:border-cyan-200 transition">
            <RiTailwindCssFill className="inline-block text-base" />
            TailwindCSS
          </span>
          {/* اسکیل‌های دیگر */}
          <button
            type="button"
            className="bg-cyan-900/60 border border-cyan-400/20 text-cyan-200 px-3 py-1 rounded-md text-xs font-bold font-yekan flex items-center gap-1 hover:border-cyan-300 transition focus:outline-none"
            style={{ minWidth: "2.5rem" }}
            aria-label="اسکیل‌های دیگر"
          >
            <FaEllipsisH className="inline-block text-base" />
            اسکیل‌های دیگر
          </button>
        </div>

        {/* Divider */}
        <div className="w-24 h-1 bg-gradient-to-r from-cyan-400/25 via-cyan-950 to-neon-blue/30 rounded-full mx-auto mt-4 shadow-neon-blue/10 shadow-sm" />

        {/* Footer */}
        <div className="mt-2 text-xs md:text-sm text-cyan-100/60 font-yekan text-center">
          <span className="mr-1 animate-sparkle inline-block">✨</span> شروع یک
          مسیر تازه، با هر خط کد
        </div>
      </div>
    </section>
  );
}
