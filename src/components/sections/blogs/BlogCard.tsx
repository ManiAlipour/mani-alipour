"use client";

import { BlogDTO } from "@/lib/data/serializeBlog";
import Image from "next/image";
import Link from "next/link";
import { FaClock, FaUser } from "react-icons/fa";

interface BlogCardProps {
  blog: TBlog | BlogDTO;
  featured?: boolean;
}

function formatDate(date: string) {
  return new Date(date).toLocaleDateString("fa-IR", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

export default function BlogCard({ blog, featured = false }: BlogCardProps) {
  return (
    <Link
      href={`/blogs/${blog.slug}`}
      className={`group relative flex flex-col overflow-hidden rounded-3xl border border-cyan-500/15 bg-gradient-to-br from-[#121c2e]/95 via-[#172338]/95 to-[#1a2740]/95 shadow-xl transition-all duration-500 hover:-translate-y-1.5 hover:border-cyan-400/35 hover:shadow-2xl hover:shadow-cyan-900/30 ${
        featured ? "md:col-span-2 md:flex-row" : ""
      }`}
    >
      <div
        className={`relative overflow-hidden bg-cyan-950/40 ${
          featured
            ? "md:w-1/2 aspect-[16/10] md:aspect-auto md:min-h-[280px]"
            : "aspect-[16/10]"
        }`}
      >
        {blog.cover ? (
          <Image
            src={blog.cover}
            alt={blog.title}
            fill
            sizes={
              featured
                ? "(max-width: 768px) 100vw, 50vw"
                : "(max-width: 768px) 100vw, 33vw"
            }
            className="object-cover transition-transform duration-700 group-hover:scale-110"
          />
        ) : (
          <div className="flex h-full min-h-[180px] items-center justify-center bg-gradient-to-br from-cyan-950/60 to-indigo-950/60 text-6xl">
            📚
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-[#0f172a]/80 via-[#0f172a]/10 to-transparent" />
        {featured && (
          <span className="absolute top-4 right-4 rounded-full border border-cyan-400/30 bg-cyan-500/20 px-3 py-1 text-xs font-bold text-cyan-100 backdrop-blur-md">
            ⭐ مطلب ویژه
          </span>
        )}
      </div>

      <div
        className={`flex flex-1 flex-col gap-4 p-6 ${featured ? "md:justify-center" : ""}`}
      >
        <div className="flex flex-wrap items-center gap-2 text-xs text-cyan-300/70">
          <span className="inline-flex items-center gap-1 rounded-full border border-white/5 bg-white/5 px-2.5 py-1">
            <FaUser className="text-cyan-400" />
            {blog.author?.name ?? "مانی علی‌پور"}
          </span>
          <span className="rounded-full border border-white/5 bg-white/5 px-2.5 py-1">
            {formatDate(blog.createdAt as string)}
          </span>
          {blog.readAt ? (
            <span className="inline-flex items-center gap-1 rounded-full border border-white/5 bg-white/5 px-2.5 py-1">
              <FaClock className="text-amber-400" />
              {blog.readAt} دقیقه
            </span>
          ) : null}
        </div>

        <div>
          <h3
            className={`font-black leading-snug text-cyan-50 transition-colors group-hover:text-cyan-300 ${
              featured ? "text-2xl md:text-3xl" : "text-xl"
            }`}
          >
            {blog.title}
          </h3>
          {blog.excerpt ? (
            <p
              className={`mt-2 text-cyan-100/75 leading-relaxed ${
                featured ? "line-clamp-4 text-base" : "line-clamp-3 text-sm"
              }`}
            >
              {blog.excerpt}
            </p>
          ) : null}
        </div>

        {blog.tags?.length ? (
          <div className="flex flex-wrap gap-2">
            {blog.tags.slice(0, featured ? 4 : 3).map((tag, i) => (
              <span
                key={i}
                className="rounded-lg border border-cyan-500/20 bg-cyan-900/30 px-2.5 py-0.5 text-xs font-medium text-cyan-200/90"
              >
                #{tag.name}
              </span>
            ))}
          </div>
        ) : null}

        <span className="mt-auto inline-flex items-center gap-2 text-sm font-bold text-cyan-400 transition-all group-hover:gap-3">
          مطالعه مقاله
          <span className="transition-transform group-hover:-translate-x-1">
            ←
          </span>
        </span>
      </div>

      <div className="pointer-events-none absolute inset-0 rounded-3xl opacity-0 transition-opacity duration-500 group-hover:opacity-100 bg-gradient-to-br from-cyan-400/10 via-transparent to-indigo-500/10" />
    </Link>
  );
}
