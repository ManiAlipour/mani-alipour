"use client";

export default function BlogsList({ blogs }: { blogs: TBlog[] }) {
  return (
    <div className="my-20">
      <h2 className="mb-6 text-2xl font-bold text-neon-blue">لیست مقالات</h2>

      {/* Desktop Table */}
      <div className="hidden overflow-hidden border md:block rounded-2xl border-zinc-800">
        <table className="w-full">
          <thead className="border-b bg-zinc-900 border-zinc-800">
            <tr className="text-sm text-zinc-400">
              <th className="px-6 py-4 text-right">نام مقاله</th>
              <th className="px-6 py-4 text-right">ID</th>
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
                  {b._id}
                </td>

                <td className="flex gap-2 px-6 py-4">
                  <button className="px-3 py-1 text-xs text-black rounded-lg bg-neon-blue">
                    ویرایش
                  </button>

                  <button className="px-3 py-1 text-xs text-red-400 border border-red-500 rounded-lg">
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

            <div className="mb-3 font-mono text-xs text-zinc-400">{b._id}</div>

            <div className="flex gap-2">
              <button className="flex-1 py-1.5 text-xs rounded-lg bg-neon-blue text-black">
                ویرایش
              </button>

              <button className="flex-1 py-1.5 text-xs rounded-lg border border-red-500 text-red-400">
                حذف
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
