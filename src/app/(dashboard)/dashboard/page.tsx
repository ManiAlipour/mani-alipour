"use client";

import DashboardOverview from "@/components/sections/user/DashboardOverview";
import { useFetch } from "iso-hooks";
import { ImWarning } from "react-icons/im";
import { MdOutlineSpaceDashboard } from "react-icons/md";

export default function DashboardPage() {
  const response = useFetch<TUserDashboardResponse>("/api/user/dashboard");

  if (response.loading) {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-violet-300">
        <MdOutlineSpaceDashboard className="text-5xl animate-pulse mb-4" />
        <span>در حال بارگذاری داشبورد...</span>
      </div>
    );
  }

  if (response.error || !response.data?.data) {
    return (
      <div className="flex flex-col items-center gap-8 py-20 text-center">
        <ImWarning className="text-yellow-400 text-5xl" />
        <p className="text-lg text-zinc-300">خطا در بارگذاری داشبورد</p>
        <button
          type="button"
          onClick={() => response.refetch()}
          className="px-6 py-3 rounded-xl bg-violet-500 text-white font-bold"
        >
          تلاش مجدد
        </button>
      </div>
    );
  }

  return <DashboardOverview data={response.data.data} />;
}
