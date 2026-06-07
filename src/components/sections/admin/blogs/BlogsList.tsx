"use client";

import { useState } from "react";
import toast from "react-hot-toast";
import { RiRefreshLine } from "react-icons/ri";
import { FiEdit3, FiTrash2, FiEye, FiClock } from "react-icons/fi";
import { HiOutlineStatusOnline, HiOutlineStatusOffline } from "react-icons/hi";
import DeleteModal from "./DeleteModal";
import EditBlogForm from "./EditBlog";
import { motion, AnimatePresence } from "framer-motion";

export default function BlogsList({
  blogs,
  refetch,
}: {
  blogs: TBlog[];
  refetch: (overrideUrl?: string | null) => Promise<void>;
}) {
  const [openDeleteModal, setOpenDeleteModal] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [editingBlog, setEditingBlog] = useState<TBlog | null>(null);

  const handleDelete = async () => {
    if (!deletingId) return;
    setDeleting(true);
    try {
      const res = await fetch(`/api/blogs/${deletingId}`, { method: "DELETE" });
      if (!res.ok) throw new Error();
      await refetch();
      toast.success("  مقاله با موفقیت حذف شد");
      setOpenDeleteModal(false);
    } catch (err) {
      toast.error("خطا در حذف! دوباره تلاش کن");
    } finally {
      setDeleting(false);
    }
  };

  return (
    <>
      <DeleteModal
        open={openDeleteModal}
        setOpen={setOpenDeleteModal}
        onDelete={handleDelete}
        loading={deleting}
      />

      <AnimatePresence>
        {editingBlog && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex justify-center items-start p-0 md:p-6 bg-black/90 backdrop-blur-xl overflow-y-auto"
          >
            <motion.div
              initial={{ scale: 0.95, y: 30 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 30 }}
              className="w-full max-w-4xl my-4 md:my-10"
            >
              <EditBlogForm
                blog={editingBlog}
                onClose={() => setEditingBlog(null)}
                refetch={refetch}
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="mt-12 mb-20 space-y-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 px-4">
          <div className="space-y-1">
            <h2 className="text-3xl font-black text-white flex items-center gap-3">
              <span className="w-2 h-8 bg-neon-blue rounded-full"></span>
              مدیریت محتوا
            </h2>
            <p className="text-zinc-500 text-sm mr-5">
              مجموعاً {blogs.length} مقاله ثبت شده است
            </p>
          </div>

          <button
            className="w-full md:w-auto flex items-center justify-center gap-2 px-8 py-3.5 rounded-2xl bg-white/5 border border-white/10 text-white font-bold hover:bg-neon-blue hover:text-black transition-all group"
            onClick={() => refetch()}
          >
            <RiRefreshLine className="text-xl group-hover:rotate-180 transition-transform duration-500" />
            به‌روزرسانی لیست
          </button>
        </div>

        {/* Desktop Table */}
        <div className="hidden md:block overflow-hidden rounded-[2.5rem] border border-white/10 bg-[#0f172a]/40 backdrop-blur-md">
          <table className="w-full text-right">
            <thead>
              <tr className="bg-white/5 border-b border-white/10 text-zinc-400 text-sm">
                <th className="px-8 py-6 font-bold">جزئیات مقاله</th>
                <th className="px-8 py-6 font-bold">وضعیت</th>
                <th className="px-8 py-6 font-bold">زمان مطالعه</th>
                <th className="px-8 py-6 font-bold text-center">عملیات</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {blogs.map((b) => (
                <tr
                  key={b._id}
                  className="group hover:bg-white/[0.02] transition-colors"
                >
                  <td className="px-8 py-5">
                    <div className="flex items-center gap-4">
                      <div className="w-14 h-14 rounded-xl overflow-hidden border border-white/10 shrink-0">
                        <img
                          src={b.cover}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform"
                          alt=""
                        />
                      </div>
                      <div>
                        <div className="text-white font-bold group-hover:text-neon-blue transition-colors">
                          {b.title}
                        </div>
                        <div className="text-zinc-500 text-xs mt-1 font-mono">
                          /{b.slug}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-8 py-5">
                    {b.isPublished ? (
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-neon-green/10 text-neon-green text-[10px] font-bold border border-neon-green/20">
                        <HiOutlineStatusOnline /> منتشر شده
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-zinc-800 text-zinc-400 text-[10px] font-bold">
                        <HiOutlineStatusOffline /> پیش‌نویس
                      </span>
                    )}
                  </td>
                  <td className="px-8 py-5">
                    <div className="text-zinc-400 text-xs flex items-center gap-1.5">
                      <FiClock /> {b.readAt || 0} دقیقه
                    </div>
                  </td>
                  <td className="px-8 py-5">
                    <div className="flex justify-center gap-2">
                      <button
                        onClick={() => setEditingBlog(b)}
                        className="p-3 bg-neon-blue/10 text-neon-blue rounded-xl hover:bg-neon-blue hover:text-black transition-all"
                      >
                        <FiEdit3 size={18} />
                      </button>
                      <button
                        onClick={() => {
                          setDeletingId(b._id);
                          setOpenDeleteModal(true);
                        }}
                        className="p-3 bg-red-500/10 text-red-500 rounded-xl hover:bg-red-500 hover:text-white transition-all"
                      >
                        <FiTrash2 size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Mobile Modern Cards */}
        <div className="grid grid-cols-1 gap-5 md:hidden px-4 pb-10">
          {blogs.map((b) => (
            <div
              key={b._id}
              className="relative overflow-hidden group bg-[#161b22] rounded-3xl border border-white/5 p-5 flex flex-col gap-5 shadow-xl"
            >
              {/* Card Header */}
              <div className="flex items-start gap-4">
                <img
                  src={b.cover}
                  className="w-20 h-20 rounded-2xl object-cover border border-white/10"
                  alt={b.title}
                />
                <div className="flex-1 space-y-2">
                  <div className="flex justify-between items-start">
                    {b.isPublished ? (
                      <span className="text-[10px] font-bold text-neon-green bg-neon-green/10 px-2 py-0.5 rounded-lg border border-neon-green/20">
                        منتشر شده
                      </span>
                    ) : (
                      <span className="text-[10px] font-bold text-zinc-500 bg-white/5 px-2 py-0.5 rounded-lg">
                        پیش‌نویس
                      </span>
                    )}
                    <span className="text-[10px] text-zinc-500 font-mono">
                      #{b.slug.substring(0, 8)}
                    </span>
                  </div>
                  <h3 className="text-white font-bold leading-tight line-clamp-2">
                    {b.title}
                  </h3>
                </div>
              </div>

              {/* Card Footer Info */}
              <div className="flex items-center justify-between border-t border-white/5 pt-4">
                <div className="flex gap-4">
                  <div className="flex items-center gap-1.5 text-zinc-500 text-[11px]">
                    <FiClock className="text-neon-blue" /> {b.readAt || 0} دقیقه
                  </div>
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={() => setEditingBlog(b)}
                    className="w-10 h-10 flex items-center justify-center bg-neon-blue text-black rounded-xl active:scale-90 transition-transform"
                  >
                    <FiEdit3 />
                  </button>
                  <button
                    onClick={() => {
                      setDeletingId(b._id);
                      setOpenDeleteModal(true);
                    }}
                    className="w-10 h-10 flex items-center justify-center bg-red-500/10 text-red-500 border border-red-500/20 rounded-xl active:scale-90 transition-transform"
                  >
                    <FiTrash2 />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
