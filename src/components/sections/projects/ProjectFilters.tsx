"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useCallback, useEffect, useState, useTransition } from "react";
import { FiSearch, FiX } from "react-icons/fi";
import { PROJECT_STATUS_LABELS } from "@/lib/project-status";

const STATUS_OPTIONS: { value: TProjectStatus | ""; label: string }[] = [
  { value: "", label: "همه وضعیت‌ها" },
  { value: "done", label: PROJECT_STATUS_LABELS.done },
  { value: "in-progress", label: PROJECT_STATUS_LABELS["in-progress"] },
  { value: "planned", label: PROJECT_STATUS_LABELS.planned },
  { value: "archived", label: PROJECT_STATUS_LABELS.archived },
];

export default function ProjectFilters() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  const activeQ = searchParams.get("q") ?? "";
  const activeStatus = searchParams.get("status") ?? "";
  const [query, setQuery] = useState(activeQ);

  useEffect(() => {
    setQuery(activeQ);
  }, [activeQ]);

  const updateParams = useCallback(
    (next: { q?: string; status?: string }) => {
      const params = new URLSearchParams(searchParams.toString());

      if (next.q !== undefined) {
        if (next.q) params.set("q", next.q);
        else params.delete("q");
      }

      if (next.status !== undefined) {
        if (next.status) params.set("status", next.status);
        else params.delete("status");
      }

      const qs = params.toString();
      startTransition(() => {
        router.push(qs ? `/projects?${qs}` : "/projects");
      });
    },
    [router, searchParams],
  );

  useEffect(() => {
    const timer = setTimeout(() => {
      if (query !== activeQ) {
        updateParams({ q: query.trim() });
      }
    }, 400);

    return () => clearTimeout(timer);
  }, [query, activeQ, updateParams]);

  const clearAll = () => {
    setQuery("");
    startTransition(() => router.push("/projects"));
  };

  const hasFilters = Boolean(activeQ || activeStatus);

  return (
    <div className="space-y-5">
      <div className="relative">
        <FiSearch className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-cyan-400/70" />
        <input
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="جستجو در عنوان، توضیحات یا تکنولوژی..."
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

      <div className="flex flex-wrap gap-2">
        {STATUS_OPTIONS.map((option) => (
          <button
            key={option.value || "all"}
            type="button"
            onClick={() => updateParams({ status: option.value })}
            className={`rounded-full border px-4 py-2 text-sm font-medium transition ${
              activeStatus === option.value
                ? "border-cyan-400/50 bg-cyan-500/20 text-cyan-100"
                : "border-white/10 bg-white/5 text-cyan-200/70 hover:border-cyan-400/30 hover:text-cyan-100"
            }`}
          >
            {option.label}
          </button>
        ))}
      </div>
    </div>
  );
}
