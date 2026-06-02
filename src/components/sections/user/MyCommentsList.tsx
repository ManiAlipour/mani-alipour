"use client";

import { useState } from "react";
import toast from "react-hot-toast";
import { formatDate } from "@/utils/persianMonth";
import { FiTrash2, FiMessageSquare } from "react-icons/fi";
import DeleteModal from "@/components/sections/admin/blogs/DeleteModal";

export default function MyCommentsList({
  comments,
  meta,
  page,
  onPageChange,
  refetch,
  blogsForNewComment,
}: {
  comments: TUserComment[];
  meta: TCommentsMeta;
  page: number;
  onPageChange: (p: number) => void;
  refetch: () => Promise<void>;
  blogsForNewComment: TBlogPreview[];
}) {
  const [openDelete, setOpenDelete] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [postId, setPostId] = useState("");
  const [content, setContent] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleDelete = async () => {
    if (!deletingId) return;
    setDeleting(true);
    try {
      const res = await fetch(`/api/user/comments/${deletingId}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error();
      await refetch();
      toast.success("نظر حذف شد");
      setOpenDelete(false);
      if (comments.length === 1 && page > 1) onPageChange(page - 1);
    } catch {
      toast.error("خطا در حذف");
    } finally {
      setDeleting(false);
    }
  };

  const handleAddComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!postId || !content.trim()) {
      toast.error("مقاله و متن نظر را وارد کنید");
      return;
    }
    setSubmitting(true);
    try {
      const res = await fetch("/api/user/comments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ postId, content: content.trim() }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message);
      toast.success("نظر ثبت شد");
      setContent("");
      setPostId("");
      await refetch();
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : "خطا در ثبت نظر");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <DeleteModal
        open={openDelete}
        setOpen={setOpenDelete}
        onDelete={handleDelete}
        loading={deleting}
        title="حذف نظر"
        message="آیا از حذف این نظر مطمئن هستید؟"
      />

      <form
        onSubmit={handleAddComment}
        className="mb-8 p-5 rounded-2xl border border-violet-800/40 bg-violet-950/20 space-y-4"
      >
        <h3 className="font-bold text-violet-200 flex items-center gap-2">
          <FiMessageSquare />
          ثبت نظر جدید
        </h3>
        <select
          value={postId}
          onChange={(e) => setPostId(e.target.value)}
          className="w-full bg-slate-900 border border-white/10 rounded-xl px-4 py-3 text-white text-sm"
        >
          <option value="">انتخاب مقاله...</option>
          {blogsForNewComment.map((b) => (
            <option key={b._id} value={b._id}>
              {b.title}
            </option>
          ))}
        </select>
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          rows={3}
          placeholder="متن نظر خود را بنویسید..."
          className="w-full bg-slate-900 border border-white/10 rounded-xl px-4 py-3 text-white text-sm resize-none"
        />
        <button
          type="submit"
          disabled={submitting}
          className="px-6 py-2.5 rounded-xl bg-violet-500 text-white font-bold text-sm hover:bg-violet-400 disabled:opacity-50"
        >
          {submitting ? "در حال ارسال..." : "ارسال نظر"}
        </button>
      </form>

      {!comments.length ? (
        <div className="text-center py-12 text-zinc-400 border border-dashed border-zinc-700 rounded-2xl">
          نظری ثبت نکرده‌اید
        </div>
      ) : (
        <ul className="space-y-4">
          {comments.map((c) => {
            const post =
              c.postId && typeof c.postId === "object" ? c.postId : null;
            return (
              <li
                key={c._id}
                className="p-4 rounded-2xl border border-white/10 bg-slate-900/50"
              >
                <div className="flex justify-between gap-3 items-start">
                  <div className="min-w-0 flex-1">
                    <p className="text-white font-medium text-sm mb-1">
                      {post?.title ?? "مقاله حذف‌شده"}
                    </p>
                    <p className="text-zinc-300 text-sm leading-relaxed">
                      {c.content}
                    </p>
                    <p className="text-zinc-500 text-xs mt-2">
                      {formatDate(c.createdAt)}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      setDeletingId(c._id);
                      setOpenDelete(true);
                    }}
                    className="p-2 text-red-400 hover:bg-red-500/10 rounded-lg shrink-0"
                  >
                    <FiTrash2 />
                  </button>
                </div>
              </li>
            );
          })}
        </ul>
      )}

      {meta.totalPages > 1 && (
        <div className="flex justify-center gap-3 mt-8">
          <button
            type="button"
            disabled={!meta.hasPrevPage}
            onClick={() => onPageChange(page - 1)}
            className="px-5 py-2 rounded-xl bg-white/5 border text-white disabled:opacity-40"
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
            className="px-5 py-2 rounded-xl bg-white/5 border text-white disabled:opacity-40"
          >
            بعدی
          </button>
        </div>
      )}
    </>
  );
}
