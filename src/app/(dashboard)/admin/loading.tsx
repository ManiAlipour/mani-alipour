"use client";

import { BsStars } from "react-icons/bs";
import { ImSpinner2 } from "react-icons/im";

export default function AdminLoading() {
  return (
    <div className="flex flex-1 h-screen items-center justify-center bg-gradient-to-br from-cyan-950/95 via-cyan-900 to-cyan-900/90">
      <div className="flex flex-col items-center justify-center gap-8 px-8 py-12 bg-cyan-950/90 border border-cyan-800/60 rounded-2xl shadow-xl max-w-sm w-full transition-all animate-fadein">
        {/* Header/stars */}
        <div className="flex flex-col items-center gap-1 w-full">
          <div className="flex items-center justify-center animate-sparkle">
            <BsStars className="text-neon-green w-9 h-9 animate-pulse drop-shadow-[0_0_12px_#60aaff77]" />
          </div>
          <span
            className="font-yekan font-bold text-2xl md:text-3xl bg-gradient-to-l from-neon-blue via-cyan-200 to-neon-green bg-clip-text text-transparent tracking-tight select-none mt-1"
            aria-label="پنل مدیریت"
          >
            پنل مدیریت
          </span>
        </div>

        {/* Spinner + loading */}
        <div className="flex flex-col items-center gap-4 w-full mt-2">
          <ImSpinner2 className="text-neon-green/90 animate-spin w-11 h-11 drop-shadow-[0_0_30px_#23ff8aaa]" />
          <span className="text-xl md:text-2xl text-neon-green font-bold font-yekan tracking-tight">
            در حال بارگذاری بخش مدیریت
          </span>
        </div>

        {/* Progress/encouragement */}
        <div
          className="w-full mt-2 px-4 py-2 text-center rounded-xl bg-cyan-900/70 border border-cyan-800/30 text-cyan-200/80 font-yekan text-base flex items-center justify-center gap-2 shadow-inner"
        >
          <span className="inline-block animate-bounce">🚀</span>
          <span>لطفاً شکیبا باشید، بزودی آماده می‌شود</span>
        </div>
        
        {/* Progress bar animation */}
        <div className="relative w-32 h-2 mt-2 bg-cyan-800/30 rounded-full overflow-hidden">
          <div className="absolute inset-0 w-full h-full animate-progressbar">
            <div className="h-2 rounded-full bg-gradient-to-l from-neon-blue via-neon-green/60 to-neon-green animate-progressbar-inner" />
          </div>
        </div>
        <style jsx>{`
          @keyframes progressbar {
            0% { transform: translateX(-100%); }
            100% { transform: translateX(100%); }
          }
          .animate-progressbar-inner {
            width: 50%;
            animation: progressbar 1.6s cubic-bezier(.4,0,.2,1) infinite;
          }
        `}</style>
      </div>
    </div>
  );
}