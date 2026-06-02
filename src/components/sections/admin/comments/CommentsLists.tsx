"use client";

import { useState } from "react";
import toast from "react-hot-toast";
import { RiRefreshLine } from "react-icons/ri";
import { FiTrash2, FiUser, FiFileText } from "react-icons/fi";
import { MdOutlineComment } from "react-icons/md";
import DeleteModal from "@/components/sections/admin/blogs/DeleteModal";
import { formatDate } from "@/utils/persianMonth";

interface ICommentsListProps {
  comments: TComment[];
  meta: TCommentsMeta;
  page: number;
  onPageChange: (page: number) => void;
  refetch: () => Promise<void>;
}

function getPopulatedUser(comment: TComment): TCommentUser | null {
  if (comment.userId && typeof comment.userId === "object") {
    return comment.userId;
  }
  return null;
}

function getPopulatedPost(comment: TComment): TCommentPost | null {
  if (comment.postId && typeof comment.postId === "object") {
    return comment.postId;
  }
  return null;
}

export default function CommentsLists({
  comments,
  meta,
  page,
  onPageChange,
  refetch,
}: ICommentsListProps) {
  const [openDeleteModal, setOpenDeleteModal] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);

  const handleDelete = async () => {
    if (!deletingId) return;
    setDeleting(true);
    try {
      const res = await fetch(`/api/admin/comments/${deletingId}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error();
      await refetch();
      toast.success("کامنت با موفقیت حذف شد");
      setOpenDeleteModal(false);
      if (comments.length === 1 && page > 1) {
        onPageChange(page - 1);
      }
    } catch {
      toast.error("خطا در حذف! دوباره تلاش کن");
    } finally {
      setDeleting(false);
    }
  };

  if (meta.totalItems === 0) {
    return (
      <div className="my-20 text-center text-zinc-400 py-12 border border-dashed border-zinc-700 rounded-2xl">
        <MdOutlineComment className="mx-auto mb-3 text-4xl text-zinc-600" />
        هنوز کامنتی ثبت نشده است
      </div>
    );
  }

  return (
    <>
      <DeleteModal
        open={openDeleteModal}
        setOpen={setOpenDeleteModal}
        onDelete={handleDelete}
        loading={deleting}
        title="حذف کامنت"
        message="آیا مطمئن هستید که می‌خواهید این کامنت را حذف کنید؟ این عملیات قابل بازگشت نیست."
      />

      <div className="mt-12 mb-20 space-y-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 px-4">
          <div className="space-y-1">
            <h2 className="text-3xl font-black text-white flex items-center gap-3">
              <span className="w-2 h-8 bg-neon-blue rounded-full" />
              لیست کامنت‌ها
            </h2>
            <p className="text-zinc-500 text-sm mr-5">
              نمایش {comments.length} از {meta.totalItems} کامنت
            </p>
          </div>

          <button
            type="button"
            className="w-full md:w-auto flex items-center justify-center gap-2 px-8 py-3.5 rounded-2xl bg-white/5 border border-white/10 text-white font-bold hover:bg-neon-blue hover:text-black transition-all group"
            onClick={() => refetch()}
          >
            <RiRefreshLine className="text-xl group-hover:rotate-180 transition-transform duration-500" />
            به‌روزرسانی لیست
          </button>
        </div>

        <div className="hidden md:block overflow-hidden rounded-[2.5rem] border border-white/10 bg-[#0f172a]/40 backdrop-blur-md">
          <table className="w-full text-right">
            <thead>
              <tr className="bg-white/5 border-b border-white/10 text-zinc-400 text-sm">
                <th className="px-8 py-6 font-bold">کاربر</th>
                <th className="px-8 py-6 font-bold">مقاله</th>
                <th className="px-8 py-6 font-bold">متن کامنت</th>
                <th className="px-8 py-6 font-bold">تاریخ</th>
                <th className="px-8 py-6 font-bold text-center">عملیات</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {comments.map((comment) => {
                const user = getPopulatedUser(comment);
                const post = getPopulatedPost(comment);
                return (
                  <tr
                    key={comment._id}
                    className="group hover:bg-white/[0.02] transition-colors"
                  >
                    <td className="px-8 py-5">
                      <div className="flex items-center gap-3">
                        <span className="flex items-center justify-center w-10 h-10 rounded-xl bg-neon-blue/10 text-neon-blue shrink-0">
                          <FiUser size={18} />
                        </span>
                        <div>
                          <div className="text-white font-bold">
                            {user?.name ?? "—"}
                          </div>
                          <div className="text-zinc-500 text-xs mt-0.5 font-mono ltr:text-left">
                            {user?.email ?? "—"}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-8 py-5">
                      <div className="flex items-start gap-2">
                        <FiFileText className="text-neon-green mt-1 shrink-0" />
                        <div>
                          <div className="text-white font-medium line-clamp-1">
                            {post?.title ?? "—"}
                          </div>
                          {post?.slug && (
                            <div className="text-zinc-500 text-xs mt-1 font-mono">
                              /{post.slug}
                            </div>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-8 py-5 max-w-xs">
                      <p className="text-zinc-300 text-sm line-clamp-3">
                        {comment.content}
                      </p>
                    </td>
                    <td className="px-8 py-5 text-zinc-400 text-sm whitespace-nowrap">
                      {formatDate(comment.createdAt)}
                    </td>
                    <td className="px-8 py-5">
                      <div className="flex justify-center">
                        <button
                          type="button"
                          onClick={() => {
                            setDeletingId(comment._id);
                            setOpenDeleteModal(true);
                          }}
                          className="p-3 bg-red-500/10 text-red-500 rounded-xl hover:bg-red-500 hover:text-white transition-all"
                          title="حذف کامنت"
                        >
                          <FiTrash2 size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        <div className="grid grid-cols-1 gap-5 md:hidden px-4 pb-10">
          {comments.map((comment) => {
            const user = getPopulatedUser(comment);
            const post = getPopulatedPost(comment);
            return (
              <div
                key={comment._id}
                className="bg-[#161b22] rounded-3xl border border-white/5 p-5 flex flex-col gap-4 shadow-xl"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <div className="text-white font-bold truncate">
                      {user?.name ?? "—"}
                    </div>
                    <div className="text-zinc-500 text-xs font-mono truncate">
                      {user?.email ?? "—"}
                    </div>
                  </div>
                  <span className="text-[11px] text-zinc-500 shrink-0">
                    {formatDate(comment.createdAt)}
                  </span>
                </div>

                <div className="text-sm text-neon-green font-medium line-clamp-1">
                  {post?.title ?? "—"}
                </div>

                <p className="text-zinc-300 text-sm leading-relaxed">
                  {comment.content}
                </p>

                <div className="flex justify-end border-t border-white/5 pt-4">
                  <button
                    type="button"
                    onClick={() => {
                      setDeletingId(comment._id);
                      setOpenDeleteModal(true);
                    }}
                    className="w-10 h-10 flex items-center justify-center bg-red-500/10 text-red-500 border border-red-500/20 rounded-xl active:scale-90 transition-transform"
                  >
                    <FiTrash2 />
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {meta.totalPages > 1 && (
          <div className="flex flex-wrap items-center justify-center gap-3 px-4">
            <button
              type="button"
              disabled={!meta.hasPrevPage}
              onClick={() => onPageChange(page - 1)}
              className="px-5 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white font-bold disabled:opacity-40 disabled:cursor-not-allowed hover:bg-neon-blue hover:text-black transition-all"
            >
              قبلی
            </button>
            <span className="text-zinc-400 text-sm tabular-nums">
              صفحه {meta.currentPage} از {meta.totalPages}
            </span>
            <button
              type="button"
              disabled={!meta.hasNextPage}
              onClick={() => onPageChange(page + 1)}
              className="px-5 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white font-bold disabled:opacity-40 disabled:cursor-not-allowed hover:bg-neon-blue hover:text-black transition-all"
            >
              بعدی
            </button>
          </div>
        )}
      </div>
    </>
  );
}
