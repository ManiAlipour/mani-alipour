import React from "react";

interface ITagListProps {
  tags: TTag[];
}

export default function TagList({ tags }: ITagListProps) {
  if (!tags?.length) {
    return (
      <div className="text-center text-zinc-400 py-10 text-base">
        هیچ تگی پیدا نشد
      </div>
    );
  }

  return (
    <div className="my-20">
      <div className="flex justify-between items-center px-5 py-5">
        <h2 className="mb-6 text-2xl font-bold text-neon-blue">لیست تگ‌ها</h2>
        {/* TODO : Add refresh button */}
      </div>

      {/* Desktop Table */}
      <div className="hidden overflow-hidden border md:block rounded-2xl border-zinc-800">
        <table className="w-full">
          <thead className="border-b bg-zinc-900 border-zinc-800">
            <tr className="text-sm text-zinc-400">
              <th className="px-6 py-4 text-right">نام تگ</th>
              <th className="px-6 py-4 text-right">اسلاگ</th>
              <th className="px-6 py-4 text-right">توضیحات</th>
              <th className="px-6 py-4 text-right">پست‌ها</th>
              <th className="px-6 py-4 text-right">تاریخ ایجاد</th>
              {/* TODO: Add actions here */}
            </tr>
          </thead>
          <tbody>
            {tags.map((tag) => (
              <tr
                key={tag._id}
                className="transition border-b border-zinc-800 hover:bg-zinc-900/60"
              >
                <td className="px-6 py-4 font-bold text-white text-base">
                  {tag.name}
                </td>
                <td className="px-6 py-4 font-mono text-xs text-neon-blue ltr:direction-ltr rtl:direction-rtl">
                  {tag.slug}
                </td>
                <td className="px-6 py-4 text-xs text-zinc-400 max-w-xs truncate">
                  {tag.description || "-"}
                </td>
                <td className="px-6 py-4 text-xs text-neon-blue">
                  {tag.postCount}
                </td>
                <td className="px-6 py-4 text-xs text-zinc-400 tabular-nums">
                  {new Date(tag.createdAt).toLocaleDateString("fa-IR")}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile Cards */}
      <div className="space-y-4 md:hidden">
        {tags.map((tag) => (
          <div
            key={tag._id}
            className="p-4 border rounded-xl border-zinc-800 bg-zinc-900/40"
          >
            <div className="mb-1 font-medium text-white">{tag.name}</div>
            <div className="mb-2 font-mono text-xs text-neon-blue ltr:direction-ltr rtl:direction-rtl">
              {tag.slug}
            </div>
            {tag.description && (
              <div className="mb-2 text-xs text-zinc-400">
                {tag.description}
              </div>
            )}
            <div className="flex items-center gap-4 mt-3">
              <span className="inline-block bg-neon-blue/20 text-neon-blue border border-neon-blue rounded-full px-3 py-1 text-xs font-semibold shadow-sm">
                پست‌ها: {tag.postCount}
              </span>
              <span className="text-xs text-zinc-400 tabular-nums">
                {new Date(tag.createdAt).toLocaleDateString("fa-IR")}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
