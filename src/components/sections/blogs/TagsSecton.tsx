"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { FaTags } from "react-icons/fa";

export default function TagsSection({ tags }: { tags: TTag[] }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const currentTag = searchParams.get("tag") || "";

  const handleChange = (value: string) => {
    if (!value) router.push("/blogs");
    else router.push(`/blogs?tag=${value}`);
  };

  return (
    <section className="my-10 mx-auto max-w-4xl px-4">
      {/* Section Heading */}
      <div className="flex items-center gap-3 mb-3 text-slate-300">
        <FaTags className="text-cyan-400 text-xl" />
        <h3 className="font-bold text-lg sm:text-xl">جستجو با تگ‌ها</h3>
        <span className="ml-auto text-xs text-cyan-200/60">{tags.length} تگ</span>
      </div>
      {/* 📱 Mobile */}
      <div className="md:hidden mb-4">
        <div className="relative">
          <select
            value={currentTag}
            onChange={(e) => handleChange(e.target.value)}
            className="w-full py-3 px-4 pr-10 bg-gradient-to-tr from-slate-800 via-blue-900/60 to-slate-700 border-2 border-slate-700 rounded-xl shadow focus:outline-none focus:ring-2 focus:ring-cyan-400 text-slate-200 font-semibold appearance-none transition"
          >
            <option value="">همه تگ‌ها</option>
            {tags.map((tag) => (
              <option key={tag.slug} value={tag.slug}>
                {tag.name} ({tag.postCount})
              </option>
            ))}
          </select>
          <div className="pointer-events-none absolute inset-y-0 right-3 flex items-center">
            <svg className="w-5 h-5 text-cyan-300" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path d="M19 9l-7 7-7-7" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
        </div>
      </div>

      <div className="hidden md:flex flex-wrap gap-3 bg-slate-800/70 rounded-xl px-4 py-3 shadow border border-slate-700">
        <Link
          href="/blogs"
          className={`px-4 py-2 rounded-lg border font-medium transition-all duration-150
            ${
              currentTag === ""
                ? "bg-gradient-to-br from-cyan-600 to-blue-700 border-cyan-300 text-white shadow-md scale-105"
                : "bg-slate-800 border-slate-700 text-slate-300 hover:bg-slate-700 hover:border-cyan-500"
            }
          `}
          style={{ minWidth: 70, textAlign: "center" }}
        >
          همه
        </Link>
        {tags.map((tag) => {
          const isActive = currentTag === tag.slug;
          return (
            <Link
              key={tag.slug}
              href={`/blogs?tag=${tag.slug}`}
              className={`flex items-center gap-1 px-4 py-2 rounded-lg border font-medium transition-all duration-150
                ${
                  isActive
                    ? "bg-gradient-to-br from-cyan-600 to-blue-700 border-cyan-300 text-white shadow-md scale-105"
                    : "bg-slate-800 border-slate-700 text-slate-300 hover:bg-slate-700 hover:border-cyan-500"
                }
              `}
              style={{
                minWidth: 70,
                textAlign: "center",
                boxShadow: isActive ? "0px 4px 18px 0px rgba(0,255,255,0.08)" : undefined,
              }}
            >
              <span>{tag.name}</span>
              <span className="text-xs text-cyan-300 font-bold bg-cyan-800/40 px-2 py-0.5 rounded-full ml-1">{tag.postCount}</span>
            </Link>
          );
        })}
      </div>
    </section>
  );
}
