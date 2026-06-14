import Link from "next/link";
import { LuArrowRight, LuSearch, LuGhost } from "react-icons/lu";
import { FaHome } from "react-icons/fa";

export default function NotFound() {
  return (
    <div className="relative min-h-[90vh] flex items-center justify-center overflow-hidden bg-[#0b1220] px-6">
      {/* بک‌گراند نوری (Glow) */}
      <div
        aria-hidden
        className="pointer-events-none absolute left-1/2 top-1/2 h-[500px] w-[500px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-indigo-500/10 blur-[120px]"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute right-0 top-0 h-[300px] w-[300px] rounded-full bg-cyan-500/5 blur-[100px]"
      />

      <div className="relative z-10 w-full max-w-2xl text-center">
        {/* المان گرافیکی 404 */}
        <div className="mb-8 flex justify-center">
          <div className="relative">
            <div className="absolute -inset-4 animate-pulse rounded-full bg-indigo-500/20 blur-2xl" />
            <div className="relative flex h-32 w-32 items-center justify-center rounded-3xl border border-white/10 bg-white/5 backdrop-blur-xl sm:h-40 sm:w-40">
              <span className="text-7xl font-black tracking-tighter text-transparent bg-clip-text bg-gradient-to-br from-indigo-300 to-cyan-300 sm:text-8xl">
                404
              </span>
            </div>
          </div>
        </div>

        {/* متن اصلی */}
        <h1 className="mb-4 text-3xl font-black text-white sm:text-5xl">
          مسیر رو <span className="text-indigo-400">گم کردی؟</span>
        </h1>

        <p className="mx-auto mb-10 max-w-md text-base leading-8 text-slate-400 sm:text-lg">
          صفحه‌ای که دنبالش می‌گردی وجود نداره یا جابه‌جا شده. نگران نباش، بیا
          با هم برگردیم به صفحه های اصلی!
        </p>

        <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
          <Link
            href="/"
            className="flex h-14 w-full items-center justify-center gap-3 rounded-2xl bg-indigo-600 px-8 text-base font-bold text-white transition-all hover:bg-indigo-500 hover:shadow-[0_0_20px_rgba(99,102,241,0.4)] sm:w-auto"
          >
            <FaHome className="text-xl" />
            برگشت به خانه
          </Link>

          <Link
            href="/blogs"
            className="flex h-14 w-full items-center justify-center gap-3 rounded-2xl border border-white/10 bg-white/5 px-8 text-base font-bold text-slate-200 transition-all hover:bg-white/10 sm:w-auto"
          >
            مطالعه بلاگ
            <LuArrowRight className="text-xl" />
          </Link>
        </div>

        {/* فوتر کوچک کمکی */}
        <div className="mt-12 flex items-center justify-center gap-6 text-sm text-slate-500">
          <div className="flex items-center gap-2">
            <LuSearch className="text-indigo-400/60" />
            <span>دنبال چیزی می‌گردی؟</span>
          </div>
          <div className="flex items-center gap-2">
            <LuGhost className="text-cyan-400/60" />
            <span>خطای ناشناخته</span>
          </div>
        </div>
      </div>
    </div>
  );
}
