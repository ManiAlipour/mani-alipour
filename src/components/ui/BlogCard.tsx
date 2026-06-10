import Link from "next/link";
import Image from "next/image";

interface BlogCardProps {
  blog: {
    slug: string;
    title: string;
    excerpt?: string;
    cover?: string;
    createdAt?: string;
    author?: { name?: string };
    readAt?: number;
  };
}

function formatDate(date?: string) {
  if (!date) return "";
  return new Date(date).toLocaleDateString("fa-IR", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

export default function BlogCard({ blog }: BlogCardProps) {
  return (
    <Link
      href={`/blogs/${blog.slug}`}
      className="group relative flex flex-col overflow-hidden rounded-3xl border border-cyan-500/15 bg-gradient-to-br from-[#121c2e]/95 via-[#172338]/95 to-[#1a2740]/95 shadow-xl transition-all duration-500 hover:-translate-y-1.5 hover:border-cyan-400/35 hover:shadow-2xl hover:shadow-cyan-900/30"
    >
      <div className="relative overflow-hidden bg-cyan-950/40 aspect-[16/10]">
        {blog.cover ? (
          <Image
            unoptimized
            src={blog.cover}
            alt={blog.title}
            fill
            sizes="(max-width: 768px) 100vw, 33vw"
            className="object-cover transition-transform duration-700 group-hover:scale-110"
          />
        ) : (
          <div className="flex h-full min-h-[180px] items-center justify-center bg-gradient-to-br from-cyan-950/60 to-indigo-950/60 text-6xl">
            📚
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-[#0f172a]/80 via-[#0f172a]/10 to-transparent" />
      </div>
      <div className="flex flex-1 flex-col gap-4 p-6">
        <div className="flex flex-wrap items-center gap-2 text-xs text-cyan-300/70">
          <span className="inline-flex items-center gap-1 rounded-full border border-white/5 bg-white/5 px-2.5 py-1">
            {blog.author?.name ?? "مانی علی‌پور"}
          </span>
          <span className="rounded-full border border-white/5 bg-white/5 px-2.5 py-1">
            {formatDate(blog.createdAt)}
          </span>
          {blog.readAt ? (
            <span className="inline-flex items-center gap-1 rounded-full border border-white/5 bg-white/5 px-2.5 py-1">
              {blog.readAt} دقیقه مطالعه
            </span>
          ) : null}
        </div>
        <h3 className="text-cyan-200 text-xl font-black mb-1 group-hover:text-cyan-300 transition-all">
          {blog.title}
        </h3>
        {blog.excerpt && (
          <p className="text-cyan-100/90 text-xs md:text-sm mb-2 leading-6 line-clamp-3">
            {blog.excerpt}
          </p>
        )}
      </div>
    </Link>
  );
}
