"use client";
import { useCopyToClipboard } from "iso-hooks";
import { AiOutlineShareAlt } from "react-icons/ai";

export default function ShareBlogButton({ slug }: { slug: string }) {
  const [copiedText, copyToClipboard] = useCopyToClipboard(3000);
  const shareUrl =
    typeof window !== "undefined"
      ? window.location.href
      : typeof process !== "undefined"
        ? `${process.env.NEXT_PUBLIC_SITE_URL || ""}/blogs/${slug}`
        : "";

  return (
    <button
      className="flex items-center gap-2 px-3 py-2 border border-cyan-600 text-cyan-400 rounded-xl hover:bg-cyan-700/15 hover:text-white transition-all shadow active:scale-95 select-none"
      title="اشتراک گذاری"
      onClick={async () => {
        copyToClipboard(
          typeof window !== "undefined" ? window.location.href : shareUrl,
        );
        if (typeof window !== "undefined") {
          // Toast feedback (requires toast lib or alert fallback)
          window?.alert("لینک کپی شد!");
        }
      }}
      type="button"
    >
      <AiOutlineShareAlt className="text-lg" />
      <span className="text-sm hidden sm:inline">اشتراک گذاری</span>
    </button>
  );
}
