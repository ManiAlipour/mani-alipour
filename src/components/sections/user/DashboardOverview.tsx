"use client";

import Link from "next/link";
import { formatDate } from "@/utils/persianMonth";
import {
  FaHeart,
  FaComment,
  FaBookmark,
  FaArrowLeft,
} from "react-icons/fa";
import { LuFileText } from "react-icons/lu";

function getPost(
  item: { postId?: TBlogPreview | null },
): TBlogPreview | null {
  if (!item.postId || typeof item.postId !== "object") return null;
  return item.postId;
}

export default function DashboardOverview({
  data,
}: {
  data: TUserDashboardResponse["data"];
}) {
  const { user, stats, recentLikes, recentComments, latestBlogs } = data;

  return (
    <div className="space-y-10">
      <section className="relative overflow-hidden rounded-3xl border border-violet-500/30 bg-gradient-to-br from-violet-950/80 to-slate-900/90 p-6 md:p-8">
        <h2 className="text-2xl md:text-3xl font-black text-white mb-1">
          سلام، {user.name} 👋
        </h2>
        <p className="text-violet-200/80 text-sm md:text-base">
          به داشبورد شخصی خود خوش آمدید. از اینجا فعالیت‌ها و علاقه‌مندی‌هایتان را
          مدیریت کنید.
        </p>
        <p className="text-zinc-500 text-xs mt-2 font-mono">{user.email}</p>
      </section>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <StatBox
          label="لایک‌ها"
          value={stats.likesCount}
          icon={<FaHeart className="text-pink-400" />}
          href="/dashboard/liked"
        />
        <StatBox
          label="نظرات"
          value={stats.commentsCount}
          icon={<FaComment className="text-cyan-400" />}
          href="/dashboard/comments"
        />
        <StatBox
          label="ذخیره‌شده"
          value={stats.savedCount}
          icon={<FaBookmark className="text-violet-400" />}
          href="/dashboard/liked"
        />
      </div>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
        <section className="rounded-2xl border border-white/10 bg-slate-900/50 p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-violet-200 flex items-center gap-2">
              <FaHeart /> آخرین علاقه‌مندی‌ها
            </h3>
            <Link
              href="/dashboard/liked"
              className="text-xs text-cyan-400 hover:text-cyan-300 flex items-center gap-1"
            >
              همه <FaArrowLeft className="text-[10px]" />
            </Link>
          </div>
          {!(recentLikes as { postId?: unknown }[])?.length ? (
            <p className="text-zinc-500 text-sm py-6 text-center">
              هنوز مقاله‌ای لایک نکرده‌اید
            </p>
          ) : (
            <ul className="space-y-3">
              {(recentLikes as { postId?: TBlogPreview }[]).map((like, i) => {
                const post = getPost(like);
                if (!post) return null;
                return (
                  <li
                    key={i}
                    className="flex gap-3 p-3 rounded-xl bg-white/5 border border-white/5"
                  >
                    {post.cover && (
                      <img
                        src={post.cover}
                        alt=""
                        className="w-14 h-14 rounded-lg object-cover shrink-0"
                      />
                    )}
                    <div className="min-w-0">
                      <p className="text-white font-medium text-sm line-clamp-1">
                        {post.title}
                      </p>
                      <p className="text-zinc-500 text-xs mt-0.5">
                        /{post.slug}
                      </p>
                    </div>
                  </li>
                );
              })}
            </ul>
          )}
        </section>

        <section className="rounded-2xl border border-white/10 bg-slate-900/50 p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-violet-200 flex items-center gap-2">
              <FaComment /> آخرین نظرات
            </h3>
            <Link
              href="/dashboard/comments"
              className="text-xs text-cyan-400 hover:text-cyan-300 flex items-center gap-1"
            >
              همه <FaArrowLeft className="text-[10px]" />
            </Link>
          </div>
          {!(recentComments as TUserComment[])?.length ? (
            <p className="text-zinc-500 text-sm py-6 text-center">
              هنوز نظری ثبت نکرده‌اید
            </p>
          ) : (
            <ul className="space-y-3">
              {(recentComments as TUserComment[]).map((c) => {
                const post = getPost(c);
                return (
                  <li
                    key={c._id}
                    className="p-3 rounded-xl bg-white/5 border border-white/5"
                  >
                    <p className="text-zinc-300 text-sm line-clamp-2">
                      {c.content}
                    </p>
                    <p className="text-zinc-500 text-xs mt-1">
                      {post?.title ?? "—"} · {formatDate(c.createdAt)}
                    </p>
                  </li>
                );
              })}
            </ul>
          )}
        </section>
      </div>

      <section className="rounded-2xl border border-white/10 bg-slate-900/50 p-5">
        <h3 className="font-bold text-violet-200 flex items-center gap-2 mb-4">
          <LuFileText /> جدیدترین مقالات
        </h3>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {latestBlogs.map((blog) => (
            <Link
              key={blog._id}
              href="/"
              className="flex gap-3 p-4 rounded-xl bg-white/5 border border-white/5 hover:border-violet-500/40 transition-colors"
            >
              {blog.cover && (
                <img
                  src={blog.cover}
                  alt=""
                  className="w-16 h-16 rounded-lg object-cover shrink-0"
                />
              )}
              <div className="min-w-0">
                <p className="text-white font-medium line-clamp-2">{blog.title}</p>
                <p className="text-zinc-500 text-xs mt-1 line-clamp-2">
                  {blog.excerpt}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}

function StatBox({
  label,
  value,
  icon,
  href,
}: {
  label: string;
  value: number;
  icon: React.ReactNode;
  href: string;
}) {
  return (
    <Link
      href={href}
      className="flex flex-col items-center p-5 rounded-2xl border border-violet-800/40 bg-violet-950/30 hover:bg-violet-900/30 transition-colors"
    >
      <div className="text-3xl font-black text-white mb-1">
        {value.toLocaleString("fa-IR")}
      </div>
      <div className="flex items-center gap-1.5 text-sm text-violet-200">
        {icon}
        {label}
      </div>
    </Link>
  );
}
