"use client";

import { useState } from "react";
import toast from "react-hot-toast";
import { RiRefreshLine } from "react-icons/ri";
import DeleteModal from "./DeleteModal";

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

  const handleDelete = async () => {
    if (!deletingId) return;
    setDeleting(true);
    try {
      // TODO: API call to delete the blog by deletingId
      const res = await fetch(`/api/blogs/${deletingId}`, {
        method: "DELETE",
      });

      if (!res.ok) {
        toast.error("عملیات موفقیت آمیز نبود!");
        setOpenDeleteModal(false);
        setDeletingId(null);
      }

      await refetch();
      toast.success("مقاله با موفقیت حذف شد");
      setOpenDeleteModal(false);
      setDeletingId(null);
    } catch (err) {
      toast.error("خطا در حذف مقاله");
    } finally {
      setDeleting(false);
    }
  };

  const onShowDeleteModal = (id: string) => {
    setDeletingId(id);
    setOpenDeleteModal(true);
  };

  return (
    <>
      <DeleteModal
        open={openDeleteModal}
        setOpen={setOpenDeleteModal}
        onDelete={handleDelete}
        loading={deleting}
      />

      <div className="my-20">
        <div className="flex justify-between items-center px-5 py-5">
          <h2 className="mb-6 text-2xl font-bold text-neon-blue">
            لیست مقالات
          </h2>

          <button
            className="flex gap-1 items-center px-5 py-2 rounded-lg bg-linear-to-br from-neon-green to-neon-blue text-black"
            onClick={async () => await refetch()}
            // TODO : ADD REFRESH, DELETE AND UPDATE LOGIC
          >
            <RiRefreshLine />
            رفرش
          </button>
        </div>

        {/* Desktop Table */}
        <div className="hidden overflow-hidden border md:block rounded-2xl border-zinc-800">
          <table className="w-full">
            <thead className="border-b bg-zinc-900 border-zinc-800">
              <tr className="text-sm text-zinc-400">
                <th className="px-6 py-4 text-right">نام مقاله</th>
                <th className="px-6 py-4 text-right">اسلاگ</th>
                <th className="px-6 py-4 text-right">عملیات</th>
              </tr>
            </thead>

            <tbody>
              {blogs.map((b) => (
                <tr
                  key={b._id}
                  className="transition border-b border-zinc-800 hover:bg-zinc-900/60"
                >
                  <td className="px-6 py-4 text-white">{b.title}</td>

                  <td className="px-6 py-4 font-mono text-xs text-zinc-400">
                    {b.slug}
                  </td>

                  <td className="flex gap-2 px-6 py-4">
                    <button className="px-3 py-1 text-xs text-black rounded-lg bg-neon-blue">
                      ویرایش
                    </button>

                    <button
                      className="px-3 py-1 text-xs text-red-400 border border-red-500 rounded-lg"
                      onClick={() => onShowDeleteModal(b._id)}
                    >
                      حذف
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Mobile Cards */}
        <div className="space-y-4 md:hidden">
          {blogs.map((b) => (
            <div
              key={b._id}
              className="p-4 border rounded-xl border-zinc-800 bg-zinc-900/40"
            >
              <div className="mb-1 font-medium text-white">{b.title}</div>

              <div className="mb-3 font-mono text-xs text-zinc-400">
                {b._id}
              </div>

              <div className="flex gap-2">
                <button className="flex-1 py-1.5 text-xs rounded-lg bg-neon-blue text-black">
                  ویرایش
                </button>

                <button
                  onClick={() => onShowDeleteModal(b._id)}
                  className="flex-1 py-1.5 text-xs rounded-lg border border-red-500 text-red-400"
                >
                  حذف
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
