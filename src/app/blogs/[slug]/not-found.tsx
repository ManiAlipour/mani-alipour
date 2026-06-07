import Link from "next/link";

export default function BlogNotFoundPage() {
  return (
    <div className="flex min-h-[70vh] flex-col items-center justify-center bg-[#0b1220] px-4 text-center">
      <span className="mb-4 text-6xl">📭</span>
      <h1 className="text-3xl font-black text-cyan-50">مقاله یافت نشد</h1>
      <p className="mt-2 max-w-md text-cyan-200/70">
        این مقاله وجود ندارد یا منتشر نشده است.
      </p>
      <Link
        href="/blogs"
        className="mt-8 rounded-2xl border border-cyan-400/30 bg-cyan-500/15 px-6 py-3 font-bold text-cyan-100 transition hover:bg-cyan-500/25"
      >
        بازگشت به وبلاگ
      </Link>
    </div>
  );
}
