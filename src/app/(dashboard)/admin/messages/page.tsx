"use client";

import MessagesList from "@/components/sections/admin/messages/MessagesList";
import StatCard from "@/components/ui/cards/StatsCard";
import { useFetch } from "iso-hooks";
import { useState } from "react";
import { MdOutlineMail, MdMarkEmailUnread } from "react-icons/md";
import { ImWarning } from "react-icons/im";
import { FiInbox } from "react-icons/fi";

const PAGE_SIZE = 10;

const emptyMeta: TContactsMeta = {
  totalItems: 0,
  totalPages: 0,
  currentPage: 1,
  itemsPerPage: PAGE_SIZE,
  hasNextPage: false,
  hasPrevPage: false,
};

const emptyStats: TContactStats = {
  new: 0,
  read: 0,
  replied: 0,
  archived: 0,
  total: 0,
};

export default function MessagesPage() {
  const [page, setPage] = useState(1);
  const [statusFilter, setStatusFilter] = useState("all");

  const statusQuery =
    statusFilter !== "all" ? `&status=${statusFilter}` : "";

  const contactsResponse = useFetch<TContactsResponse>(
    `/api/admin/contacts?page=${page}&limit=${PAGE_SIZE}${statusQuery}`,
    {
      initialData: {
        message: "",
        data: [],
        stats: emptyStats,
        meta: emptyMeta,
      },
    },
  );

  if (contactsResponse.loading) {
    return (
      <div className="flex flex-col gap-6 flex-1 justify-center items-center h-full text-center py-24">
        <MdOutlineMail size={48} className="text-neon-green animate-pulse mb-2" />
        <span className="text-xl font-semibold text-neon-green">
          در حال بارگذاری پیام‌ها...
        </span>
      </div>
    );
  }

  if (contactsResponse.error || !contactsResponse.data) {
    return (
      <div className="text-2xl flex flex-col gap-10 flex-1 justify-center items-center h-full">
        <ImWarning size={50} className="text-yellow-400" />
        <span>مشکلی به وجود آمده است، لطفاً دوباره تلاش کنید</span>
        <button
          type="button"
          className="bg-neon-green px-6 py-3 rounded-xl cursor-pointer text-black text-base font-bold"
          onClick={async () => await contactsResponse.refetch()}
        >
          تازه‌سازی صفحه
        </button>
      </div>
    );
  }

  const { data: contacts, meta, stats } = contactsResponse.data;

  return (
    <div className="min-h-full px-5 py-5 bg-gradient-to-br from-slate-800 to-neon-green/20">
      <div className="flex items-center gap-3 text-3xl font-bold text-neon-green">
        <MdOutlineMail />
        <span>مدیریت پیام‌ها</span>
      </div>

      <div className="flex flex-wrap items-center justify-center gap-4 my-14">
        <StatCard
          count={stats.total}
          gradient="from-neon-green to-green-600"
          icon={<FiInbox />}
          label="کل پیام‌ها"
        />
        <StatCard
          count={stats.new}
          gradient="from-neon-blue to-blue-400"
          icon={<MdMarkEmailUnread />}
          label="جدید"
        />
        <StatCard
          count={stats.replied}
          gradient="from-orange-300 to-orange-500"
          icon={<MdOutlineMail />}
          label="پاسخ‌داده"
        />
      </div>

      <MessagesList
        contacts={contacts}
        stats={stats}
        meta={meta}
        page={page}
        statusFilter={statusFilter}
        onStatusFilterChange={setStatusFilter}
        onPageChange={setPage}
        refetch={contactsResponse.refetch}
      />
    </div>
  );
}
