"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useCallback, useEffect, useState, useTransition } from "react";
import { FiSearch, FiX } from "react-icons/fi";

interface BlogFiltersProps {
  tags: TTag[];
}

export default function BlogFilters({ tags }: BlogFiltersProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  const activeTag = searchParams.get("tag") ?? "";
  const activeSearch = searchParams.get("search") ?? "";
  const [query, setQuery] = useState(activeSearch);

  useEffect(() => {
    setQuery(activeSearch);
  }, [activeSearch]);

  const updateParams = useCallback(
    (next: { search?: string; tag?: string }) => {
      const params = new URLSearchParams(searchParams.toString());

      if (next.search !== undefined) {
        if (next.search) params.set("search", next.search);
        else params.delete("search");
      }

      if (next.tag !== undefined) {
        if (next.tag) params.set("tag", next.tag);
        else params.delete("tag");
      }

      const qs = params.toString();
      startTransition(() => {
        router.push(qs ? `/blogs?${qs}` : "/blogs");
      });
    },
    [router, searchParams],
  );

  useEffect(() => {
    const timer = setTimeout(() => {
      if (query !== activeSearch) {
        updateParams({ search: query.trim() });
      }
    }, 400);

    return () => clearTimeout(timer);
  }, [query, activeSearch, updateParams]);

  const clearAll = () => {
    setQuery("");
    startTransition(() => router.push("/blogs"));
  };

  const hasFilters = Boolean(activeSearch || activeTag);

  return (
    <div className="space-y-5">
      <div className="relative">
        <FiSearch className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-cyan-400/70" />
        <input
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="جستجو در عنوان، خلاصه و محتوا..."
          className="w-full rounded-2xl border border-cyan-500/20 bg-[#0f172a]/70 py-4 pr-12 pl-12 text-sm text-cyan-50 placeholder:text-cyan-200/40 shadow-inner shadow-black/20 outline-none transition focus:border-cyan-400/50 focus:ring-2 focus:ring-cyan-500/20"
        />
        {hasFilters ? (
          <button
            type="button"
            onClick={clearAll}
            className="absolute left-3 top-1/2 flex -translate-y-1/2 items-center gap-1 rounded-xl border border-white/10 bg-white/5 px-3 py-1.5 text-xs text-cyan-200/80 transition hover:bg-white/10"
          >
            <FiX />
            پاک کردن
          </button>
        ) : null}
        {isPending ? (
          <span className="absolute left-4 top-1/2 -translate-y-1/2 text-xs text-cyan-400/60">
            ...
          </span>
        ) : null}
      </div>

      {tags.length ? (
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => updateParams({ tag: "" })}
            className={`rounded-full border px-4 py-2 text-sm font-medium transition ${
              !activeTag
                ? "border-cyan-400/50 bg-cyan-500/20 text-cyan-100"
                : "border-white/10 bg-white/5 text-cyan-200/70 hover:border-cyan-400/30 hover:text-cyan-100"
            }`}
          >
            همه
          </button>
          {tags.map((tag) => (
            <button
              key={tag._id}
              type="button"
              onClick={() =>
                updateParams({ tag: activeTag === tag.slug ? "" : tag.slug })
              }
              className={`rounded-full border px-4 py-2 text-sm font-medium transition ${
                activeTag === tag.slug
                  ? "border-cyan-400/50 bg-cyan-500/20 text-cyan-100"
                  : "border-white/10 bg-white/5 text-cyan-200/70 hover:border-cyan-400/30 hover:text-cyan-100"
              }`}
            >
              #{tag.name}
            </button>
          ))}
        </div>
      ) : null}
    </div>
  );
}
