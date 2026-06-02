"use client";

import MyCommentsList from "@/components/sections/user/MyCommentsList";
import { useFetch } from "iso-hooks";
import { useState } from "react";
import { ImWarning } from "react-icons/im";

const emptyMeta: TCommentsMeta = {
  totalItems: 0,
  totalPages: 0,
  currentPage: 1,
  itemsPerPage: 10,
  hasNextPage: false,
  hasPrevPage: false,
};

export default function CommentsPage() {
  const [page, setPage] = useState(1);

  const commentsResponse = useFetch<TUserCommentsResponse>(
    `/api/user/comments?page=${page}&limit=10`,
    { initialData: { message: "", data: [], meta: emptyMeta } },
  );

  const blogsResponse = useFetch<{ success: boolean; data: TBlogPreview[] }>(
    "/api/blogs",
  );

  const loading = commentsResponse.loading || blogsResponse.loading;

  if (loading) {
    return (
      <div className="text-center py-24 text-violet-300 animate-pulse">
        در حال بارگذاری نظرات...
      </div>
    );
  }

  if (commentsResponse.error || !commentsResponse.data) {
    return (
      <div className="flex flex-col items-center gap-6 py-20">
        <ImWarning className="text-yellow-400 text-4xl" />
        <button
          type="button"
          onClick={() => commentsResponse.refetch()}
          className="px-6 py-3 rounded-xl bg-violet-500 text-white"
        >
          تلاش مجدد
        </button>
      </div>
    );
  }

  const blogs = (blogsResponse.data?.data ?? []) as TBlogPreview[];

  return (
    <div>
      <p className="text-zinc-400 text-sm mb-6">
        مدیریت نظرات شما ({commentsResponse.data.meta.totalItems})
      </p>
      <MyCommentsList
        comments={commentsResponse.data.data}
        meta={commentsResponse.data.meta}
        page={page}
        onPageChange={setPage}
        refetch={commentsResponse.refetch}
        blogsForNewComment={blogs}
      />
    </div>
  );
}
