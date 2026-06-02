"use client";

import { FiHeart } from "react-icons/fi";

export default function LikedBlogsList({
  likes,
  meta,
  page,
  onPageChange,
}: {
  likes: TUserLike[];
  meta: TCommentsMeta;
  page: number;
  onPageChange: (p: number) => void;
}) {
  if (!likes.length) {
    return (
      <div className="text-center py-16 text-zinc-400 border border-dashed border-zinc-700 rounded-2xl">
        <FiHeart className="mx-auto text-4xl mb-3 text-zinc-600" />
        هنوز مقاله‌ای را لایک نکرده‌اید
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        {likes.map((like) => {
          const post =
            like.postId && typeof like.postId === "object"
              ? like.postId
              : null;
          if (!post) return null;
          return (
            <article
              key={like._id}
              className="flex gap-4 p-4 rounded-2xl border border-white/10 bg-slate-900/60 hover:border-violet-500/40 transition-colors"
            >
              {post.cover && (
                <img
                  src={post.cover}
                  alt=""
                  className="w-24 h-24 rounded-xl object-cover shrink-0"
                />
              )}
              <div className="min-w-0 flex-1">
                <h3 className="text-white font-bold line-clamp-2">{post.title}</h3>
                <p className="text-zinc-500 text-xs font-mono mt-1">/{post.slug}</p>
                {post.excerpt && (
                  <p className="text-zinc-400 text-sm mt-2 line-clamp-2">
                    {post.excerpt}
                  </p>
                )}
                <div className="flex flex-wrap gap-3 mt-2 text-xs text-zinc-500">
                  {post.author && typeof post.author === "object" && (
                    <span>نویسنده: {(post.author as { name: string }).name}</span>
                  )}
                  {post.readAt != null && <span>{post.readAt} دقیقه مطالعه</span>}
                </div>
              </div>
            </article>
          );
        })}
      </div>

      {meta.totalPages > 1 && (
        <div className="flex justify-center gap-3">
          <button
            type="button"
            disabled={!meta.hasPrevPage}
            onClick={() => onPageChange(page - 1)}
            className="px-5 py-2 rounded-xl bg-white/5 border border-white/10 text-white disabled:opacity-40"
          >
            قبلی
          </button>
          <span className="text-zinc-400 text-sm self-center">
            {meta.currentPage} / {meta.totalPages}
          </span>
          <button
            type="button"
            disabled={!meta.hasNextPage}
            onClick={() => onPageChange(page + 1)}
            className="px-5 py-2 rounded-xl bg-white/5 border border-white/10 text-white disabled:opacity-40"
          >
            بعدی
          </button>
        </div>
      )}
    </div>
  );
}
