import React from "react";
import { BsTelegram, BsLinkedin, BsEnvelope } from "react-icons/bs";

export default function Footer() {
  return (
    <footer className="bg-gradient-to-tr from-slate-950 to-cyan-950/95 w-full pt-8 pb-5 px-4 border-t border-cyan-900/40 shadow-inner">
      <div className="relative mx-auto max-w-3xl flex flex-col items-center gap-5">
        {/* Brand logo  */}
        <div className="flex items-center justify-center gap-2 mb-1">
          <div className="h-12 w-12 rounded-full bg-gradient-to-tr from-cyan-400 to-blue-800 flex items-center justify-center shadow-lg border-2 border-cyan-700/20 relative">
            <span className="text-2xl md:text-3xl animate-pulse text-cyan-100 absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 flex items-center justify-center w-full h-full">
              💙
            </span>
          </div>
          <span className="text-transparent bg-gradient-to-r from-cyan-300 via-indigo-300 to-cyan-400 bg-clip-text font-black text-lg md:text-2xl tracking-wider drop-shadow-sm">
            Mani Alipour
          </span>
        </div>

        {/* Socials and contact */}
        <div className="flex items-center gap-5 my-2">
          <FooterCircleBtn
            href="mailto:hello@manialipour.com"
            label="ایمیل"
            icon={<BsEnvelope className="w-5 h-5" />}
          />
          <FooterCircleBtn
            href="https://t.me/manialipour"
            label="تلگرام"
            icon={<BsTelegram className="w-5 h-5" />}
            target="_blank"
          />
          <FooterCircleBtn
            href="https://linkedin.com/in/manialipour"
            label="لینکدین"
            icon={<BsLinkedin className="w-5 h-5" />}
            target="_blank"
          />
        </div>

        {/* divider */}
        <div className="w-[85%] h-px bg-gradient-to-r from-cyan-500/0 via-cyan-600/30 to-cyan-500/0 mb-2" />

        {/* Tagline */}
        <div className="flex flex-col items-center gap-0.5">
          <span className="flex items-center gap-1 text-cyan-100 text-xs md:text-sm font-semibold">
            ساخته شده با
            <span
              className="animate-heartbeat mx-1 text-pink-300"
              role="img"
              aria-label="love"
            >
              ❤️
            </span>
            و{" "}
            <span className="inline-block bg-slate-800/60 px-1.5 rounded font-bold text-cyan-300">
              Next.js
            </span>
          </span>
          <span className="text-cyan-400/80 text-xs mt-0.5">
            برای فردایی روشن‌تر
          </span>
        </div>
        <div className="mt-3 text-xs text-cyan-100/60 font-mono text-center">
          © {new Date().getFullYear()} مانی علی‌پور – تمامی حقوق محفوظ است
        </div>
      </div>
    </footer>
  );
}

// Circular social/contact button with nice hover
function FooterCircleBtn({
  href,
  label,
  icon,
  target,
}: {
  href: string;
  label: string;
  icon: React.ReactNode;
  target?: string;
}) {
  return (
    <a
      href={href}
      className="group rounded-full w-11 h-11 flex items-center justify-center bg-cyan-800/40 border-2 border-cyan-700/30 hover:bg-cyan-400/90 hover:border-cyan-200 shadow-md transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-cyan-400/50"
      rel={target === "_blank" ? "noopener noreferrer" : "noopener"}
      target={target ?? "_self"}
      aria-label={label}
      tabIndex={0}
    >
      <span className="text-cyan-200 group-hover:text-cyan-950 text-xl transition-colors">
        {icon}
      </span>
    </a>
  );
}
