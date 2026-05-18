"use client";

import { useRef } from "react";

interface IModalProps {
  open: boolean;
  setOpen: (v: boolean) => void;
  onDelete: () => void;
  loading?: boolean;
}

export default function DeleteModal({ open, setOpen, onDelete, loading }: IModalProps) {
  const modalRef = useRef<HTMLDivElement>(null);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 flex items-center justify-center z-50 bg-black/70"
      onClick={() => setOpen(false)}
    >
      <div
        ref={modalRef}
        className="bg-zinc-900 text-white rounded-2xl shadow-lg w-[90vw] max-w-sm p-6"
        onClick={(e) => e.stopPropagation()}
      >
        <h3 className="mb-4 text-lg font-bold text-red-400">حذف مقاله</h3>
        <p className="mb-6 text-sm">
          آیا مطمئن هستید که می‌خواهید این مقاله را حذف کنید؟ این عملیات قابل بازگشت نیست.
        </p>
        <div className="flex justify-end gap-2">
          <button
            disabled={loading}
            className="px-4 py-2 rounded-lg border text-zinc-300 border-zinc-700 hover:bg-zinc-800 transition"
            onClick={() => setOpen(false)}
            type="button"
          >
            انصراف
          </button>
          <button
            disabled={loading}
            className="px-4 py-2 rounded-lg bg-red-500 text-white font-bold hover:bg-red-600 transition disabled:bg-red-400"
            onClick={onDelete}
            type="button"
          >
            {loading ? "در حال حذف..." : "حذف"}
          </button>
        </div>
      </div>
    </div>
  );
}
