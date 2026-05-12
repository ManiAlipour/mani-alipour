"use client";
import Link from "next/link";
import { BiLogoTypescript } from "react-icons/bi";
import { DiReact } from "react-icons/di";
import { RiNextjsFill, RiTailwindCssFill } from "react-icons/ri";
import { FaEllipsisH, FaTelegram } from "react-icons/fa";
import { FaGithub, FaLinkedin, FaTwitter, FaInstagram } from "react-icons/fa6";

function DynamicGridPattern() {
  return (
    <>
      {/* Desktop */}
      <svg
        aria-hidden
        className="pointer-events-none absolute inset-0 w-full h-full z-0 hidden md:block"
        viewBox="0 0 1200 800"
        fill="none"
        style={{
          opacity: 0.19,
        }}
        preserveAspectRatio="none"
      >
        <g>
          {/* خطوط افقی/عمودی پراکنده به سبک نرم و نقاط */}
          <line
            x1="200"
            y1="30"
            x2="200"
            y2="800"
            stroke="#67e8f9"
            strokeWidth="0.7"
            opacity="0.16"
          />
          <line
            x1="550"
            y1="0"
            x2="550"
            y2="800"
            stroke="#38bdf8"
            strokeWidth="1.1"
            opacity="0.12"
          />
          <line
            x1="940"
            y1="40"
            x2="1040"
            y2="800"
            stroke="#7dd3fc"
            strokeWidth="1"
            opacity="0.098"
          />
          <line
            x1="70"
            y1="160"
            x2="1190"
            y2="180"
            stroke="#5fe2d0"
            strokeWidth="0.72"
            opacity="0.09"
          />
          <line
            x1="0"
            y1="530"
            x2="1200"
            y2="570"
            stroke="#0ea5e9"
            strokeWidth="0.9"
            opacity="0.11"
          />
          <rect
            x="280"
            y="178"
            width="17"
            height="17"
            rx="4"
            fill="#36e1da"
            opacity=".18"
          />
          <rect
            x="860"
            y="420"
            width="28"
            height="28"
            rx="8"
            fill="#a5b4fc"
            opacity=".09"
          />
          <rect
            x="1120"
            y="610"
            width="13"
            height="13"
            rx="3"
            fill="#7dd3fc"
            opacity=".13"
          />
          <circle cx="180" cy="580" r="15" fill="#38bdf8" opacity="0.14" />
          <circle cx="1000" cy="125" r="18" fill="#10b981" opacity=".09" />
          <circle cx="650" cy="740" r="25" fill="#a7f3d0" opacity=".06" />
          <circle cx="450" cy="555" r="9" fill="#f7dd88" opacity=".13" />
          {/* پراکندگی نقطه‌ها */}
          {[...Array(13)].map((_, i) => (
            <circle
              key={"dpt" + i}
              cx={
                80 + Math.sin(i * 1.6) * 260 + (i % 2) * 60 + ((i * 88) % 1170)
              }
              cy={70 + ((i * 55) % 650) + ((i * 13) % 120)}
              r={i % 3 === 0 ? 3.5 : i % 2 === 0 ? 2.5 : 1.3}
              fill="#38bdf8"
              opacity={i % 3 ? 0.16 : 0.24}
            />
          ))}
        </g>
      </svg>

      <svg
        aria-hidden
        className="pointer-events-none absolute inset-0 w-full h-full z-0 block md:hidden"
        viewBox="0 0 400 650"
        fill="none"
        style={{ opacity: 0.13 }}
        preserveAspectRatio="none"
      >
        <g>
          <line
            x1="65"
            y1="20"
            x2="95"
            y2="650"
            stroke="#38bdf8"
            strokeWidth="0.6"
            opacity="0.13"
          />
          <line
            x1="240"
            y1="0"
            x2="400"
            y2="560"
            stroke="#5fe2d0"
            strokeWidth="0.7"
            opacity="0.10"
          />
          <rect
            x="320"
            y="510"
            width="17"
            height="17"
            rx="4"
            fill="#a5b4fc"
            opacity=".10"
          />
          <circle cx="180" cy="460" r="11" fill="#38bdf8" opacity="0.16" />
          <circle cx="70" cy="360" r="4.6" fill="#38bdf8" opacity="0.13" />
          <circle cx="312" cy="140" r="6" fill="#a5f3fc" opacity="0.12" />
        </g>
      </svg>
    </>
  );
}

function Decor3DShape() {
  return (
    <>
      <div
        className="pointer-events-none absolute z-10 select-none"
        style={{
          left: "4%",
          top: "86px",
          width: 100,
          height: 100,
          opacity: 0.78,
          animation: "heroneon3d 13s ease-in-out infinite alternate",
          filter: "blur(.7px) drop-shadow(0 4px 24px #67e8f988)",
        }}
      >
        <svg width="100%" height="100%" viewBox="0 0 104 104">
          <defs>
            <radialGradient id="radial3d" cx="50%" cy="37%" r="75%">
              <stop offset="0%" stopColor="#21fbce" stopOpacity="0.89" />
              <stop offset="40%" stopColor="#22d3ee" stopOpacity="0.43" />
              <stop offset="100%" stopColor="#67e8f9" stopOpacity="0.12" />
            </radialGradient>
          </defs>
          <polygon
            points="52,6 94,32 84,97 19,92 6,29"
            fill="url(#radial3d)"
            stroke="#54f2ed"
            strokeWidth="1.4"
            opacity="0.97"
          />
          <ellipse
            cx="51"
            cy="26"
            rx="17"
            ry="7"
            fill="#eafeed"
            opacity=".10"
          />
        </svg>
      </div>

      <div
        className="pointer-events-none absolute z-10 select-none md:hidden"
        style={{
          left: 16,
          top: 68,
          width: 44,
          height: 44,
          opacity: 0.59,
          animation: "heroneon3dmobile 9s ease-in-out infinite alternate",
          filter: "blur(.5px) drop-shadow(0 2px 12px #67e8f966)",
        }}
      >
        <svg width="100%" height="100%" viewBox="0 0 44 44">
          <defs>
            <radialGradient id="radial3d2" cx="60%" cy="30%" r="90%">
              <stop offset="0%" stopColor="#21fbce" stopOpacity="0.93" />
              <stop offset="100%" stopColor="#67e8f9" stopOpacity="0.28" />
            </radialGradient>
          </defs>
          <polygon
            points="22,2 41,13 37,43 6,41 2,13"
            fill="url(#radial3d2)"
            stroke="#67e8f9"
            strokeWidth="0.95"
            opacity="0.89"
          />
        </svg>
      </div>
      <style>
        {`
          @keyframes heroneon3d {
            0%   { transform: translateY(0px)   rotate(-2deg) scale(1); }
            45%  { transform: translateY(-12px) rotate(7deg)  scale(1.05);}
            100% { transform: translateY(15px)  rotate(-2deg) scale(0.92);}
          }
          @keyframes heroneon3dmobile {
            0%   { transform: translateY(0px) rotate(-4deg) scale(1); }
            100% { transform: translateY(10px) rotate(2deg)  scale(1.03);}
          }
        `}
      </style>
    </>
  );
}


function CodeSnippets() {
  return (
    <>
      <div
        className="absolute z-20 hidden md:block"
        style={{
          top: "38px",
          left: "max(5%,32px)",
          minWidth: 138,
          fontSize: 15,
          fontFamily: "Fira Mono, Consolas, monospace",
          color: "#b1f4ff",
          background: "rgba(10,39,46,0.77)",
          border: "1px solid #55d9ff22",
          borderRadius: "19px",
          padding: "11px 17px",
          boxShadow: "0 6px 30px 0 #4ef1e81b",
          lineHeight: 1.67,
          animation: "codetopfloat 7.2s ease-in-out infinite alternate",
          direction: "ltr", // 👈 badge ltr
        }}
      >
        <span
          dangerouslySetInnerHTML={{
            __html: `<span style="color:#4ef1e8;">function</span> <span style="color:#7cf4b8;">سلام</span>() { <span style="color:#84d8ff;">return</span> "<span style="color:#f7ed88;">دنیا!</span>"; }`,
          }}
        />
        <style>
          {`
            @keyframes codetopfloat {
              0% { transform:translateY(0px) scale(1);}
              40%{ transform:translateY(-7px) scale(1.01);}
              100%{ transform:translateY(8px) scale(0.99);}
            }
          `}
        </style>
      </div>
      <div
        className="absolute z-20 hidden md:block"
        style={{
          bottom: "80px",
          right: "6%",
          minWidth: 108,
          fontSize: 13,
          fontFamily: "Fira Mono, Consolas, monospace",
          color: "#c9fafb",
          background: "rgba(26,46,49,0.84)",
          border: "1px solid #22d3ee27",
          borderRadius: "15px",
          padding: "6px 14px",
          boxShadow: "0 2px 16px 0 #38bdf80f",
          lineHeight: 1.6,
          animation: "codebotfloat 6s ease-in-out infinite alternate",
          direction: "ltr", // 👈 badge ltr
        }}
      >
        <span
          dangerouslySetInnerHTML={{
            __html: `<span style="color:#a7f3d0;">const</span> <span style="color:#4ef1e8;">کد</span> = "<span style="color:#f7ed88;">جدید!</span>";`,
          }}
        />
        <style>
          {`
            @keyframes codebotfloat {
              0% { transform: translateY(0px) scale(1);}
              35%{ transform: translateY(-6px) scale(1.01);}
              100%{ transform: translateY(6px) scale(0.98);}
            }
          `}
        </style>
      </div>
      <div
        className="absolute top-3 right-4 z-20 md:hidden"
        style={{
          minWidth: 85,
          fontSize: 10.8,
          fontFamily: "Fira Mono, Consolas, monospace",
          color: "#89faea",
          background: "rgba(13,36,50,0.73)",
          border: "1px solid #3bfff935",
          borderRadius: "11px",
          padding: "3.5px 12px",
          boxShadow: "0 1px 9px 0 #38bdf807",
          animation: "codemobilefloat 9s ease-in-out infinite alternate",
          direction: "ltr",
        }}
      >
        <span
          dangerouslySetInnerHTML={{
            __html: `<span style="color:#4ef1e8;">let</span> x = "<span style="color:#f7ed88;">Fun!</span>";`,
          }}
        />
        <style>
          {`
            @keyframes codemobilefloat {
              0% { transform: translateY(0px) scale(1);}
              50%{ transform: translateY(-8px) scale(1.01);}
              100%{ transform: translateY(6px) scale(0.97);}
            }
          `}
        </style>
      </div>
    </>
  );
}

export default function HeroSection() {
  const HEADER_HEIGHT = 64;
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
      <DynamicGridPattern />
      <Decor3DShape />
      <CodeSnippets />
      <div className="relative z-20 w-full max-w-3xl mx-auto flex flex-col items-center justify-center gap-7 px-3 md:px-6 pt-16 pb-10 md:py-16">
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
          <span
            className="bg-cyan-900/60 border border-cyan-400/20 text-cyan-200 px-3 py-1 rounded-md text-xs font-bold font-yekan flex items-center gap-1 hover:border-cyan-300 transition"
            dir="ltr"
          >
            <DiReact />
            React
          </span>
          <span
            className="bg-cyan-900/60 border border-neon-green/30 text-neon-green px-3 py-1 rounded-md text-xs font-bold font-yekan flex items-center gap-1 hover:border-neon-green transition"
            dir="ltr"
          >
            <RiNextjsFill className="inline-block text-base" />
            Next.js
          </span>
          <span
            className="bg-cyan-900/60 border border-neon-blue/25 text-neon-blue px-3 py-1 rounded-md text-xs font-bold font-yekan flex items-center gap-1 hover:border-neon-blue transition"
            dir="ltr"
          >
            <BiLogoTypescript className="inline-block text-base" />
            TypeScript
          </span>
          <span
            className="bg-cyan-900/60 border border-cyan-300/25 text-cyan-300 px-3 py-1 rounded-md text-xs font-bold font-yekan flex items-center gap-1 hover:border-cyan-200 transition"
            dir="ltr"
          >
            <RiTailwindCssFill className="inline-block text-base" />
            TailwindCSS
          </span>
          <button
            type="button"
            className="bg-cyan-900/60 border border-cyan-400/20 text-cyan-200 px-3 py-1 rounded-md text-xs font-bold font-yekan flex items-center gap-1 hover:border-cyan-300 transition focus:outline-none"
            style={{ minWidth: "2.5rem" }}
            aria-label="اسکیل‌های دیگر"
            dir="ltr"
          >
            <FaEllipsisH className="inline-block text-base" />
            اسکیل‌های دیگر
          </button>
        </div>
        <div className="w-24 h-1 bg-gradient-to-r from-cyan-400/25 via-cyan-950 to-neon-blue/30 rounded-full mx-auto mt-4 shadow-neon-blue/10 shadow-sm" />
        <div className="mt-2 text-xs md:text-sm text-cyan-100/60 font-yekan text-center">
          <span className="mr-1 animate-sparkle inline-block">✨</span> شروع یک
          مسیر تازه، با هر خط کد
        </div>
      </div>
      <style jsx>{`
        .bg-linear-to-br {
          background: linear-gradient(
            120deg,
            #05233a 24%,
            #102230 76%,
            #05233a 100%
          );
        }
        @media (max-width: 700px) {
          .bg-linear-to-br {
            background: linear-gradient(
              120deg,
              #063450 17%,
              #143547 80%,
              #05233a 100%
            );
          }
        }
      `}</style>
    </section>
  );
}
