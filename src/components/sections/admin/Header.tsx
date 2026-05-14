import React, { Dispatch, SetStateAction } from "react";
import { MdMenu } from "react-icons/md";
import { BsStars } from "react-icons/bs";

interface ISidebarProps {
  isDesktop: boolean;
  sidebarOpen: boolean;
  setSidebarOpen: Dispatch<SetStateAction<boolean>>;
}

export default function AdminHeader({
  isDesktop,
  setSidebarOpen,
  sidebarOpen,
}: ISidebarProps) {
  return (
    <header
      className="
        sticky top-0 z-30 w-full
        flex items-center justify-between
        px-4 md:px-8 py-4
        bg-cyan-950/75
        backdrop-blur-xl
        border-b border-cyan-900/60
        shadow-[0_2px_14px_0_rgba(0,255,180,0.05)]
        font-yekan
        transition-all
      "
      aria-label="هدر مدیریت"
    >
      {/* Mobile Sidebar Toggle */}
      {!isDesktop ? (
        <button
          aria-label={sidebarOpen ? "بستن منو" : "نمایش منو"}
          onClick={() => setSidebarOpen(!sidebarOpen)}
          type="button"
          className="
            flex items-center justify-center w-10 h-10
            rounded-full border border-cyan-800/50
            bg-cyan-950/60 hover:bg-cyan-900/80
            shadow-inner transition
            focus:outline-none focus:ring-2 focus:ring-neon-green/80
          "
        >
          <MdMenu className="w-6 h-6 text-neon-green drop-shadow-[0_0_6px_#23ff8a66]" />
        </button>
      ) : (
        <div className="w-10 h-10" aria-hidden="true"></div>
      )}

      {/* Title */}
      <div className="flex items-center gap-3 select-none">
        <span
          className="
            w-10 h-10 flex items-center justify-center rounded-xl
            bg-cyan-950/60 border border-cyan-800/60 shadow-inner
          "
        >
          <BsStars className="text-neon-blue w-6 h-6 animate-pulse drop-shadow-[0_0_10px_#60aaff44]" />
        </span>

        <span
          className="
            font-yekan text-2xl md:text-3xl font-bold
            bg-gradient-to-l from-neon-blue via-cyan-200 to-neon-green
            bg-clip-text text-transparent
            tracking-tight
          "
        >
          پنل مدیریت
        </span>
      </div>

      {/* Future slot */}
      <div className="w-10 h-10 flex items-center justify-center">
        {/* Placeholder */}
        <span className="text-transparent">•</span>
      </div>
    </header>
  );
}
