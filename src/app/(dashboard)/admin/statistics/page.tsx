"use client";

import StatisticsDashboard, {
  type IStatisticsData,
} from "@/components/sections/admin/statistics/StatisticsDashboard";
import { useFetch } from "iso-hooks";
import { ImWarning } from "react-icons/im";
import { MdOutlineBarChart } from "react-icons/md";

interface IAnalyticsResponse<T> {
  success: boolean;
  data: T;
}

const emptyContactStats: TContactStats = {
  new: 0,
  read: 0,
  replied: 0,
  archived: 0,
  total: 0,
};

export default function StatisticsPage() {
  const overviewResponse = useFetch<TOverviewResponse>("/api/admin/overviews");
  const blogsAnalytics = useFetch<IAnalyticsResponse<IStatisticsData["blogs"]>>(
    "/api/admin/analytics/blogs",
  );
  const usersAnalytics = useFetch<IAnalyticsResponse<IStatisticsData["users"]>>(
    "/api/admin/analytics/users",
  );
  const viewsAnalytics = useFetch<IAnalyticsResponse<IStatisticsData["views"]>>(
    "/api/admin/analytics/views",
  );
  const tagsAnalytics = useFetch<IAnalyticsResponse<IStatisticsData["tags"]>>(
    "/api/admin/analytics/tags",
  );
  const projectsAnalytics = useFetch<
    IAnalyticsResponse<IStatisticsData["projects"]>
  >("/api/admin/analytics/projects");
  const contactsAnalytics = useFetch<TContactsResponse>(
    "/api/admin/contacts?page=1&limit=1",
    {
      initialData: {
        message: "",
        data: [],
        stats: emptyContactStats,
        meta: {
          totalItems: 0,
          totalPages: 0,
          currentPage: 1,
          itemsPerPage: 1,
          hasNextPage: false,
          hasPrevPage: false,
        },
      },
    },
  );

  const responses = [
    overviewResponse,
    blogsAnalytics,
    usersAnalytics,
    viewsAnalytics,
    tagsAnalytics,
    projectsAnalytics,
    contactsAnalytics,
  ];

  const loading = responses.some((r) => r.loading);
  const hasError = responses.some((r) => r.error);

  if (loading) {
    return (
      <div className="flex flex-col gap-6 flex-1 justify-center items-center h-full text-center py-24">
        <MdOutlineBarChart
          size={48}
          className="text-neon-blue animate-pulse mb-2"
        />
        <span className="text-xl font-semibold text-neon-blue">
          در حال بارگذاری آمار و نمودارها...
        </span>
      </div>
    );
  }

  const overview = overviewResponse.data?.data;
  const blogs = blogsAnalytics.data?.data;
  const users = usersAnalytics.data?.data;
  const views = viewsAnalytics.data?.data;
  const tags = tagsAnalytics.data?.data;
  const projects = projectsAnalytics.data?.data;
  const contactStats = contactsAnalytics.data?.stats;

  if (hasError || !overview || !blogs || !users || !views || !tags || !projects || !contactStats) {
    return (
      <div className="text-2xl flex flex-col gap-10 flex-1 justify-center items-center h-full">
        <ImWarning size={50} className="text-yellow-400" />
        <span>مشکلی در دریافت آمار به وجود آمده است</span>
        <button
          type="button"
          className="bg-neon-blue px-6 py-3 rounded-xl cursor-pointer text-black text-base"
          onClick={async () => {
            await Promise.all(responses.map((r) => r.refetch()));
          }}
        >
          تازه‌سازی
        </button>
      </div>
    );
  }

  const dashboardData: IStatisticsData = {
    overview,
    blogs,
    users,
    views,
    tags,
    projects,
    contactStats,
  };

  return (
    <div className="min-h-full px-5 py-5 pb-16 max-w-7xl mx-auto w-full">
      <div className="flex items-center gap-3 text-3xl font-bold text-neon-blue">
        <MdOutlineBarChart />
        <span>آمار سایت</span>
      </div>
      <p className="text-zinc-400 text-sm mt-2 mr-1 mb-6">
        نمودارهای خطی، میله‌ای، دایره‌ای، رادار، قطبی و ترکیبی
      </p>

      <StatisticsDashboard data={dashboardData} />
    </div>
  );
}
