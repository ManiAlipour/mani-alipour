"use client";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import { FiMenu, FiX } from "react-icons/fi";
import AuthButton from "../features/AuthButton";
import Search from "../features/Search";

export default function Header() {
  const links = [
    { title: "خانه", href: "/" },
    { title: "وبلاگ", href: "/blogs" },
    { title: "پروژه ها", href: "/projects" },
    { title: "ارتباط با من", href: "/#contact" },
    { title: "درباره من", href: "/about" },
  ];

  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    // Handler checks screen width and closes mobile menu if now in desktop
    function handleResize() {
      if (window.innerWidth >= 1024 && mobileOpen) {
        setMobileOpen(false);
      }
    }

    window.addEventListener("resize", handleResize);

    // Also run once on mount in case SSR hydration mismatch
    handleResize();

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, [mobileOpen]);

  return (
    <header
      className={`
        w-full z-50 px-2.5 sm:px-4 md:px-6 py-2 md:py-3 2xl:py-4
        bg-linear-to-bl from-slate-900/90 to-cyan-950/90
        shadow-md border-b border-cyan-700/15
        sticky top-0 flex items-center justify-between transition-all
        min-h-[54px] md:min-h-[67px]
      `}
      dir="rtl"
    >
      {/* LOGO & TITLE */}
      <div className="flex items-center gap-2 xs:gap-2.5 sm:gap-3 md:gap-4 min-w-0">
        <Image
          className="rounded-full border-2 border-cyan-400 shadow-lg shrink-0"
          alt="logo"
          src="/mani-alipour-logo.ico"
          width={38}
          height={38}
        />
        <span
          className="
            text-xl sm:text-2xl md:text-3xl 
            font-bold sm:font-extrabold font-yekan 
            bg-linear-to-l from-neon-blue via-cyan-400 to-neon-green 
            bg-clip-text text-transparent 
            whitespace-nowrap select-none
            max-w-[160px] sm:max-w-[220px] md:max-w-[260px] overflow-hidden 
            text-ellipsis **:leading-tight
          "
          title="مانی علیپور"
        >
          مانی علیپور
        </span>
      </div>

      {/* Desktop NAV & actions */}
      <nav className="hidden lg:flex gap-6 xl:gap-10 items-center ml-3 flex-1 justify-center min-w-0">
        {links.map((l, i) => (
          <div
            key={i}
            className="relative"
            onMouseEnter={() => setHoveredIdx(i)}
            onMouseLeave={() => setHoveredIdx(null)}
          >
            <Link
              className={`
                whitespace-nowrap
                py-1.5 px-3.5 xl:px-5 font-bold transition-all duration-200 rounded-xl
                ${hoveredIdx === i ? "text-cyan-300 scale-[1.11] bg-cyan-950/40 shadow-md" : "text-cyan-100"}
                hover:text-neon-green hover:bg-cyan-900/20
                focus-visible:text-cyan-300
                focus-visible:outline-none
                flex items-center
              `}
              href={l.href}
              tabIndex={0}
            >
              {l.title}
            </Link>
            {/* HOVER ANIMATION GLIDER */}
            <motion.div
              className="absolute bottom-0.5 left-1/2 h-[3px] rounded-2xl bg-linear-to-r from-cyan-400 to-neon-green"
              initial={false}
              animate={
                hoveredIdx === i
                  ? {
                      width: "80%",
                      opacity: 1,
                    }
                  : {
                      width: "0%",
                      opacity: 0.2,
                    }
              }
              transition={{ duration: 0.23, ease: "easeOut" }}
              style={{
                transform: "translateX(-50%)",
                pointerEvents: "none",
                minWidth: 5,
              }}
            />
          </div>
        ))}
      </nav>

      {/* Controls (Search/Auth) */}
      <div className="flex items-center gap-2 xs:gap-2.5 md:gap-3 xl:gap-4">
        {/* Always show search & auth on desktop, move to nav on tablet and up */}
        <div className="hidden sm:flex items-center gap-2 xs:gap-2.5 md:gap-3">
          <Search />
          <AuthButton />
        </div>
        {/* MOBILE MENU BUTTON, show below lg (<1024px) */}

        <div className="sm:hidden">
          <Search />
        </div>

        <button
          aria-label={mobileOpen ? "بستن منو" : "باز کردن منو"}
          className="
            flex lg:hidden text-cyan-300 bg-cyan-900/40 p-2 rounded-lg
            shadow-neon-cyan border border-cyan-700/20
            hover:bg-cyan-900/60 focus:outline-none focus:ring-2 focus:ring-cyan-400
            transition active:scale-95
          "
          onClick={() => setMobileOpen((v) => !v)}
        >
          {mobileOpen ? (
            <FiX className="w-7 h-7" />
          ) : (
            <FiMenu className="w-7 h-7" />
          )}
        </button>
      </div>

      {/* MOBILE NAV DRAWER */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.nav
            key="mobile-drawer"
            initial={{ x: "100%", opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: "100%", opacity: 0 }}
            transition={{ duration: 0.22, ease: "easeOut" }}
            className="
              fixed inset-0 z-9999 flex flex-col bg-linear-to-bl from-slate-950/99 via-cyan-950/98 to-slate-900/98
              shadow-2xl border-l border-cyan-800/25
              w-full xs:w-[90vw] sm:max-w-[380px] md:max-w-[410px] h-dvh right-0 top-0
              p-4 xs:p-6 pt-5 xs:pt-7 gap-5 overflow-y-auto
              lg:hidden
              animate-slide-in
            "
          >
            {/* Close btn */}
            <div className="flex items-center justify-between mb-2 xs:mb-5">
              <span className="text-xl font-bold text-cyan-300 select-none">
                ناوبری
              </span>
              <button
                aria-label="بستن منو"
                className="p-2 rounded-lg text-cyan-300 border border-cyan-800/40 hover:bg-cyan-950/60"
                onClick={() => setMobileOpen(false)}
              >
                <FiX className="w-6 h-6" />
              </button>
            </div>
            <div className="flex flex-col gap-1.5 sm:gap-2">
              {links.map((l, i) => (
                <Link
                  key={i}
                  href={l.href}
                  className={`
                    py-2.5 px-4 rounded-lg text-right text-cyan-200 font-yekan
                    text-base xs:text-lg font-bold
                    hover:bg-cyan-950/80 hover:text-neon-green focus:bg-cyan-900/80 transition
                  `}
                  onClick={() => setMobileOpen(false)}
                >
                  {l.title}
                </Link>
              ))}
            </div>
            <hr className="my-3 border-cyan-800/15" />
            <div className="flex flex-col gap-2 xs:gap-3">
              <AuthButton />
            </div>
            <div className="mt-auto flex items-center justify-center pt-6 opacity-70 text-xs xs:text-sm text-cyan-100 font-yekan select-none">
              © 2024 mani.alipour
            </div>
          </motion.nav>
        )}
      </AnimatePresence>

      {/* BACKDROP for mobile */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            key="backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.26 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.17 }}
            className="fixed inset-0 z-9900 bg-linear-to-br from-cyan-800/50 to-slate-950/80 backdrop-blur-[2.5px] lg:hidden"
            onClick={() => setMobileOpen(false)}
            aria-hidden
          />
        )}
      </AnimatePresence>
    </header>
  );
}
