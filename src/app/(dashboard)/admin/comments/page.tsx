"use client";

import CommentsLists from "@/components/sections/admin/comments/CommentsLists";
import StatCard from "@/components/ui/cards/StatsCard";
import { useFetch } from "iso-hooks";
import { useState } from "react";
import { MdOutlineComment, MdOutlineForum } from "react-icons/md";
import { ImWarning } from "react-icons/im";
import { BiCommentDetail } from "react-icons/bi";

const PAGE_SIZE = 10;

const emptyMeta: TCommentsMeta = {
  totalItems: 0,
  totalPages: 0,
  currentPage: 1,
  itemsPerPage: PAGE_SIZE,
  hasNextPage: false,
  hasPrevPage: false,
};

export default function CommentsPage() {
  const [page, setPage] = useState(1);

  const commentsResponse = useFetch<TCommentsResponse>(
    `/api/admin/comments?page=${page}&limit=${PAGE_SIZE}`,
    {
      initialData: { message: "", data: [], meta: emptyMeta },
    },
  );

  if (commentsResponse.loading) {
    return (
      <div className="flex flex-col gap-6 flex-1 justify-center items-center h-full text-center py-24">
        <MdOutlineComment
          size={48}
          className="text-neon-blue animate-pulse mb-2"
        />
        <span className="text-xl font-semibold text-neon-blue">
          در حال بارگذاری کامنت‌ها...
        </span>
      </div>
    );
  }

  if (commentsResponse.error || !commentsResponse.data) {
    return (
      <div className="text-2xl flex flex-col gap-10 flex-1 justify-center items-center h-full">
        <ImWarning size={50} className="text-yellow-400" />
        <span>مشکلی به وجود آمده است، لطفاً دوباره تلاش کنید</span>
        <button
          type="button"
          className="bg-neon-blue px-6 py-3 rounded-xl cursor-pointer text-black text-base"
          onClick={async () => await commentsResponse.refetch()}
        >
          تازه‌سازی صفحه
        </button>
      </div>
    );
  }

  const { data: comments, meta } = commentsResponse.data;

  return (
    <div className="min-h-full px-5 py-5 bg-gradient-to-br from-slate-800 to-neon-blue/30">
      <div className="flex items-center gap-3 text-3xl font-bold text-neon-blue">
        <MdOutlineForum />
        <span>مدیریت کامنت‌ها</span>
      </div>

      <div className="flex flex-wrap items-center justify-center gap-4 my-14">
        <StatCard
          count={meta.totalItems}
          gradient="from-neon-blue to-blue-400"
          icon={<MdOutlineComment />}
          label="کل کامنت‌ها"
        />
        <StatCard
          count={comments.length}
          gradient="from-neon-green to-green-600"
          icon={<BiCommentDetail />}
          label="این صفحه"
        />
      </div>

      <CommentsLists
        comments={comments}
        meta={meta}
        page={page}
        onPageChange={setPage}
        refetch={commentsResponse.refetch}
      />
    </div>
  );
}
