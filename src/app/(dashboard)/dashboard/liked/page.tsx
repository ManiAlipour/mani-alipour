"use client";

import LikedBlogsList from "@/components/sections/user/LikedBlogsList";
import { useFetch } from "iso-hooks";
import { useState } from "react";
import { ImWarning } from "react-icons/im";

const emptyMeta: TCommentsMeta = {
  totalItems: 0,
  totalPages: 0,
  currentPage: 1,
  itemsPerPage: 12,
  hasNextPage: false,
  hasPrevPage: false,
};

export default function LikedPage() {
  const [page, setPage] = useState(1);
  const response = useFetch<TUserLikesResponse>(
    `/api/user/likes?page=${page}&limit=12`,
    { initialData: { message: "", data: [], meta: emptyMeta } },
  );

  if (response.loading) {
    return (
      <div className="text-center py-24 text-violet-300 animate-pulse">
        در حال بارگذاری علاقه‌مندی‌ها...
      </div>
    );
  }

  if (response.error || !response.data) {
    return (
      <div className="flex flex-col items-center gap-6 py-20">
        <ImWarning className="text-yellow-400 text-4xl" />
        <button
          type="button"
          onClick={() => response.refetch()}
          className="px-6 py-3 rounded-xl bg-violet-500 text-white"
        >
          تلاش مجدد
        </button>
      </div>
    );
  }

  return (
    <div>
      <p className="text-zinc-400 text-sm mb-6">
        مقالاتی که لایک کرده‌اید ({response.data.meta.totalItems})
      </p>
      <LikedBlogsList
        likes={response.data.data}
        meta={response.data.meta}
        page={page}
        onPageChange={setPage}
      />
    </div>
  );
}
