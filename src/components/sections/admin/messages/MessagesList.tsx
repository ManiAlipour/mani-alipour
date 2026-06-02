"use client";

import { useState } from "react";
import toast from "react-hot-toast";
import { RiRefreshLine } from "react-icons/ri";
import {
  FiTrash2,
  FiMail,
  FiUser,
  FiEye,
  FiCheckCircle,
} from "react-icons/fi";
import { MdOutlineMail } from "react-icons/md";
import DeleteModal from "@/components/sections/admin/blogs/DeleteModal";
import { formatDate } from "@/utils/persianMonth";
import { AnimatePresence, motion } from "framer-motion";

const STATUS_FILTERS: { value: string; label: string }[] = [
  { value: "all", label: "همه" },
  { value: "new", label: "جدید" },
  { value: "read", label: "خوانده‌شده" },
  { value: "replied", label: "پاسخ‌داده" },
  { value: "archived", label: "آرشیو" },
];

const STATUS_LABELS: Record<TContactStatus, string> = {
  new: "جدید",
  read: "خوانده‌شده",
  replied: "پاسخ‌داده",
  archived: "آرشیو",
};

const STATUS_STYLES: Record<TContactStatus, string> = {
  new: "bg-neon-blue/10 text-neon-blue border-neon-blue/30",
  read: "bg-cyan-500/10 text-cyan-300 border-cyan-500/30",
  replied: "bg-neon-green/10 text-neon-green border-neon-green/30",
  archived: "bg-zinc-700/40 text-zinc-400 border-zinc-600/40",
};

interface IMessagesListProps {
  contacts: TContact[];
  stats: TContactStats;
  meta: TContactsMeta;
  page: number;
  statusFilter: string;
  onStatusFilterChange: (status: string) => void;
  onPageChange: (page: number) => void;
  refetch: () => Promise<void>;
}

export default function MessagesList({
  contacts,
  stats,
  meta,
  page,
  statusFilter,
  onStatusFilterChange,
  onPageChange,
  refetch,
}: IMessagesListProps) {
  const [openDeleteModal, setOpenDeleteModal] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [selected, setSelected] = useState<TContact | null>(null);
  const [updatingStatus, setUpdatingStatus] = useState(false);

  const handleDelete = async () => {
    if (!deletingId) return;
    setDeleting(true);
    try {
      const res = await fetch(`/api/contacts/${deletingId}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error();
      await refetch();
      toast.success("پیام با موفقیت حذف شد");
      setOpenDeleteModal(false);
      if (selected?._id === deletingId) setSelected(null);
      if (contacts.length === 1 && page > 1) onPageChange(page - 1);
    } catch {
      toast.error("خطا در حذف! دوباره تلاش کن");
    } finally {
      setDeleting(false);
    }
  };

  const handleStatusChange = async (
    contactId: string,
    status: TContactStatus,
  ) => {
    setUpdatingStatus(true);
    try {
      const res = await fetch(`/api/contacts/${contactId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });
      if (!res.ok) throw new Error();
      const json = await res.json();
      await refetch();
      if (selected?._id === contactId) {
        setSelected(json.data);
      }
      toast.success("وضعیت پیام به‌روز شد");
    } catch {
      toast.error("خطا در به‌روزرسانی وضعیت");
    } finally {
      setUpdatingStatus(false);
    }
  };

  return (
    <>
      <DeleteModal
        open={openDeleteModal}
        setOpen={setOpenDeleteModal}
        onDelete={handleDelete}
        loading={deleting}
        title="حذف پیام"
        message="آیا مطمئن هستید که می‌خواهید این پیام را حذف کنید؟ این عملیات قابل بازگشت نیست."
      />

      <AnimatePresence>
        {selected && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex justify-center items-start p-4 md:p-8 bg-black/80 backdrop-blur-md overflow-y-auto"
            onClick={() => setSelected(null)}
          >
            <motion.div
              initial={{ scale: 0.95, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 20 }}
              className="w-full max-w-2xl my-6 bg-[#0f172a] border border-white/10 rounded-3xl p-6 md:p-8 shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-start justify-between gap-4 mb-6">
                <div>
                  <h3 className="text-xl font-bold text-white flex items-center gap-2">
                    <FiMail className="text-neon-blue" />
                    {selected.subject || "بدون موضوع"}
                  </h3>
                  <p className="text-zinc-500 text-sm mt-1">
                    {formatDate(selected.createdAt)}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setSelected(null)}
                  className="text-zinc-400 hover:text-white text-sm px-3 py-1 rounded-lg border border-white/10"
                >
                  بستن
                </button>
              </div>

              <div className="space-y-4 mb-6">
                <div className="flex items-center gap-3 text-sm">
                  <FiUser className="text-neon-green shrink-0" />
                  <span className="text-white font-medium">{selected.name}</span>
                  <span className="text-zinc-500 font-mono">{selected.email}</span>
                </div>
                <p className="text-zinc-300 text-sm leading-relaxed whitespace-pre-wrap bg-white/5 rounded-2xl p-4 border border-white/5">
                  {selected.message}
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between border-t border-white/10 pt-5">
                <label className="text-sm text-zinc-400 flex items-center gap-2">
                  وضعیت:
                  <select
                    value={selected.status}
                    disabled={updatingStatus}
                    onChange={(e) =>
                      handleStatusChange(
                        selected._id,
                        e.target.value as TContactStatus,
                      )
                    }
                    className="bg-zinc-900 border border-white/10 rounded-xl px-3 py-2 text-white text-sm"
                  >
                    {(Object.keys(STATUS_LABELS) as TContactStatus[]).map(
                      (s) => (
                        <option key={s} value={s}>
                          {STATUS_LABELS[s]}
                        </option>
                      ),
                    )}
                  </select>
                </label>
                <button
                  type="button"
                  onClick={() => {
                    setDeletingId(selected._id);
                    setOpenDeleteModal(true);
                  }}
                  className="flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-red-500/10 text-red-500 border border-red-500/30 hover:bg-red-500 hover:text-white transition-all text-sm font-bold"
                >
                  <FiTrash2 />
                  حذف پیام
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="flex flex-wrap gap-2 px-4 mb-6">
        {STATUS_FILTERS.map((f) => (
          <button
            key={f.value}
            type="button"
            onClick={() => {
              onStatusFilterChange(f.value);
              onPageChange(1);
            }}
            className={`px-4 py-2 rounded-xl text-sm font-bold border transition-all ${
              statusFilter === f.value
                ? "bg-neon-blue text-black border-neon-blue"
                : "bg-white/5 text-zinc-300 border-white/10 hover:border-neon-blue/50"
            }`}
          >
            {f.label}
            {f.value === "all" && (
              <span className="mr-1 opacity-70">({stats.total})</span>
            )}
            {f.value !== "all" && stats[f.value as keyof TContactStats] != null && (
              <span className="mr-1 opacity-70">
                ({stats[f.value as keyof TContactStats]})
              </span>
            )}
          </button>
        ))}
      </div>

      {meta.totalItems === 0 ? (
        <div className="my-20 text-center text-zinc-400 py-12 border border-dashed border-zinc-700 rounded-2xl mx-4">
          <MdOutlineMail className="mx-auto mb-3 text-4xl text-zinc-600" />
          پیامی با این فیلتر یافت نشد
        </div>
      ) : (
        <div className="mt-8 mb-20 space-y-8">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 px-4">
            <div className="space-y-1">
              <h2 className="text-3xl font-black text-white flex items-center gap-3">
                <span className="w-2 h-8 bg-neon-green rounded-full" />
                لیست پیام‌ها
              </h2>
              <p className="text-zinc-500 text-sm mr-5">
                نمایش {contacts.length} از {meta.totalItems} پیام
              </p>
            </div>
            <button
              type="button"
              className="w-full md:w-auto flex items-center justify-center gap-2 px-8 py-3.5 rounded-2xl bg-white/5 border border-white/10 text-white font-bold hover:bg-neon-green hover:text-black transition-all group"
              onClick={() => refetch()}
            >
              <RiRefreshLine className="text-xl group-hover:rotate-180 transition-transform duration-500" />
              به‌روزرسانی
            </button>
          </div>

          <div className="hidden md:block overflow-hidden rounded-[2.5rem] border border-white/10 bg-[#0f172a]/40 backdrop-blur-md mx-4">
            <table className="w-full text-right">
              <thead>
                <tr className="bg-white/5 border-b border-white/10 text-zinc-400 text-sm">
                  <th className="px-8 py-6 font-bold">فرستنده</th>
                  <th className="px-8 py-6 font-bold">موضوع</th>
                  <th className="px-8 py-6 font-bold">وضعیت</th>
                  <th className="px-8 py-6 font-bold">تاریخ</th>
                  <th className="px-8 py-6 font-bold text-center">عملیات</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {contacts.map((contact) => (
                  <tr
                    key={contact._id}
                    className="group hover:bg-white/[0.02] transition-colors"
                  >
                    <td className="px-8 py-5">
                      <div className="text-white font-bold">{contact.name}</div>
                      <div className="text-zinc-500 text-xs font-mono mt-0.5">
                        {contact.email}
                      </div>
                    </td>
                    <td className="px-8 py-5 max-w-xs">
                      <p className="text-zinc-300 text-sm line-clamp-1">
                        {contact.subject || "—"}
                      </p>
                    </td>
                    <td className="px-8 py-5">
                      <span
                        className={`inline-flex px-3 py-1 rounded-full text-[10px] font-bold border ${STATUS_STYLES[contact.status]}`}
                      >
                        {STATUS_LABELS[contact.status]}
                      </span>
                    </td>
                    <td className="px-8 py-5 text-zinc-400 text-sm whitespace-nowrap">
                      {formatDate(contact.createdAt)}
                    </td>
                    <td className="px-8 py-5">
                      <div className="flex justify-center gap-2">
                        <button
                          type="button"
                          onClick={() => setSelected(contact)}
                          className="p-3 bg-neon-blue/10 text-neon-blue rounded-xl hover:bg-neon-blue hover:text-black transition-all"
                          title="مشاهده"
                        >
                          <FiEye size={18} />
                        </button>
                        {contact.status === "new" && (
                          <button
                            type="button"
                            onClick={() =>
                              handleStatusChange(contact._id, "read")
                            }
                            disabled={updatingStatus}
                            className="p-3 bg-neon-green/10 text-neon-green rounded-xl hover:bg-neon-green hover:text-black transition-all"
                            title="علامت خوانده‌شده"
                          >
                            <FiCheckCircle size={18} />
                          </button>
                        )}
                        <button
                          type="button"
                          onClick={() => {
                            setDeletingId(contact._id);
                            setOpenDeleteModal(true);
                          }}
                          className="p-3 bg-red-500/10 text-red-500 rounded-xl hover:bg-red-500 hover:text-white transition-all"
                          title="حذف"
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

          <div className="grid grid-cols-1 gap-5 md:hidden px-4 pb-10">
            {contacts.map((contact) => (
              <div
                key={contact._id}
                className="bg-[#161b22] rounded-3xl border border-white/5 p-5 flex flex-col gap-4"
              >
                <div className="flex justify-between items-start gap-2">
                  <div>
                    <div className="text-white font-bold">{contact.name}</div>
                    <div className="text-zinc-500 text-xs font-mono">
                      {contact.email}
                    </div>
                  </div>
                  <span
                    className={`shrink-0 px-2 py-0.5 rounded-full text-[10px] font-bold border ${STATUS_STYLES[contact.status]}`}
                  >
                    {STATUS_LABELS[contact.status]}
                  </span>
                </div>
                <p className="text-sm text-zinc-300 line-clamp-2">
                  {contact.subject || contact.message}
                </p>
                <div className="flex justify-between items-center border-t border-white/5 pt-3">
                  <span className="text-[11px] text-zinc-500">
                    {formatDate(contact.createdAt)}
                  </span>
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => setSelected(contact)}
                      className="w-10 h-10 flex items-center justify-center bg-neon-blue text-black rounded-xl"
                    >
                      <FiEye />
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setDeletingId(contact._id);
                        setOpenDeleteModal(true);
                      }}
                      className="w-10 h-10 flex items-center justify-center bg-red-500/10 text-red-500 border border-red-500/20 rounded-xl"
                    >
                      <FiTrash2 />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {meta.totalPages > 1 && (
            <div className="flex flex-wrap items-center justify-center gap-3 px-4">
              <button
                type="button"
                disabled={!meta.hasPrevPage}
                onClick={() => onPageChange(page - 1)}
                className="px-5 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white font-bold disabled:opacity-40 hover:bg-neon-green hover:text-black transition-all"
              >
                قبلی
              </button>
              <span className="text-zinc-400 text-sm">
                صفحه {meta.currentPage} از {meta.totalPages}
              </span>
              <button
                type="button"
                disabled={!meta.hasNextPage}
                onClick={() => onPageChange(page + 1)}
                className="px-5 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white font-bold disabled:opacity-40 hover:bg-neon-green hover:text-black transition-all"
              >
                بعدی
              </button>
            </div>
          )}
        </div>
      )}
    </>
  );
}
