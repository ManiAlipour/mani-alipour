import Link from "next/link";

export default function ProjectsEmpty() {
  return (
    <div className="flex flex-col items-center justify-center rounded-3xl border border-dashed border-cyan-500/25 bg-[#0f172a]/40 px-6 py-20 text-center">
      <span className="mb-4 text-6xl">🛸</span>
      <h3 className="text-2xl font-black text-cyan-100">پروژه‌ای پیدا نشد</h3>
      <p className="mt-2 max-w-md text-sm text-cyan-200/70">
        فیلترها را تغییر دهید یا بعداً دوباره سر بزنید. پروژه‌های جدید به‌زودی
        اضافه می‌شوند.
      </p>
      <Link
        href="/#contact"
        className="mt-6 rounded-2xl border border-cyan-400/30 bg-cyan-500/15 px-6 py-3 text-sm font-bold text-cyan-100 transition hover:bg-cyan-500/25"
      >
        پیشنهاد همکاری بدهید
      </Link>
    </div>
  );
}
