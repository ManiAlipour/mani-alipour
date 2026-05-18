"use client";
import AddBlogForm from "@/components/sections/admin/blogs/AddBlogForm";
import BlogsList from "@/components/sections/admin/blogs/BlogsList";
import StatCard from "@/components/ui/cards/StatsCard";
import BarChart from "@/components/ui/charts/Bar";
import DoughnutChart from "@/components/ui/charts/Doughnut";
import { normalizeMonthlyStats } from "@/utils/persianMonth";
import { useFetch } from "iso-hooks";
import { useEffect, useRef } from "react";
import toast from "react-hot-toast";

import { FaCheckCircle, FaEye } from "react-icons/fa";
import { LuBookText } from "react-icons/lu";
import { MdArticle, MdDrafts } from "react-icons/md";

interface IStatsResponse {
  success: boolean;
  data: TBlogStats;
}

interface IBlogsData {
  message: string;
  data: TBlog[];
}

export default function BlogPage() {
  const blogsResponse = useFetch<IBlogsData>("/api/admin/blogs", {
    initialData: { message: "", data: [] },
  });
  const blogsStatsResponse = useFetch<IStatsResponse>(
    "/api/admin/analytics/blogs",
  );

  useEffect(() => {
    if (blogsResponse.loading) {
      toast.loading("در حال بارگزاری...");
    } else {
      toast.dismiss();
    }
  }, [blogsResponse.loading]);

  if (blogsStatsResponse.loading)
    return (
      <div className="flex items-center justify-center h-screen text-lg text-cyan-200">
        در حال بارگزاری ...
      </div>
    );

  const blogs = blogsResponse.data?.data;
  const stats = blogsStatsResponse.data?.data;
  if (!stats || !blogs) return <div>مشکلی پیش آمده است</div>;

  const normalizedStats = normalizeMonthlyStats(stats.monthlyStats);

  const monthlyBlogsChartData = {
    labels: normalizedStats.map((l) => l.label),
    datasets: [
      {
        label: "تعداد مقالات",
        data: normalizedStats.map((l) => l.count),
        backgroundColor: "rgba(34,211,238,0.7)",
        borderColor: "rgba(34,211,238,1)",
        borderWidth: 2,
        borderRadius: 6,
        barThickness: 45,
        maxBarThickness: 50,
      },
    ],
  };

  const publishDraftDoughnutData = {
    labels: ["منتشر شده", "پیش‌نویس"],
    datasets: [
      {
        label: "وضعیت مقالات",
        data: [stats.publishedBlogs, stats.draftBlogs],
        backgroundColor: [
          "rgba(34,197,94,0.7)", // سبز
          "rgba(239,68,68,0.7)", // قرمز
        ],
        borderColor: ["rgba(34,197,94,1)", "rgba(239,68,68,1)"],
        borderWidth: 2,
        hoverBorderWidth: 3,
        hoverOffset: 10,
      },
    ],
  };

  const doughnutOptions = {
    plugins: {
      legend: {
        display: true,
        position: "bottom",
        labels: {
          color: "#cffafe",
          font: { size: 14, family: "inherit" },
        },
      },
      tooltip: {
        backgroundColor: "#020617ee",
        borderColor: "#92f0fa",
        borderWidth: 2,
        cornerRadius: 8,
        titleFont: { family: "inherit" },
        bodyFont: { family: "inherit" },
        callbacks: {
          label(context: any) {
            return `${context.raw} مقاله`;
          },
        },
      },
    },
    cutout: "65%",
  };

  const barChartOptions = {
    responsive: true,
    plugins: {
      legend: { display: false },
      tooltip: {
        backgroundColor: "#020617ee",
        borderColor: "#92f0fa",
        borderWidth: 2,
        cornerRadius: 8,
        callbacks: {
          label(context: any) {
            return ` ${context.raw} مقاله`;
          },
        },
      },
    },
    scales: {
      x: {
        ticks: {
          color: "#c6fbff",
          font: { family: "inherit", size: 14, weight: "bold" },
          padding: 7,
        },
        grid: { color: "#19364d", drawOnChartArea: false },
      },
      y: {
        beginAtZero: true,
        ticks: {
          color: "#dfffd6",
          font: { family: "inherit", size: 13 },
          padding: 7,
        },
        grid: { color: "#184a6177", borderDash: [4, 4] },
      },
    },
  };

  return (
    <div className="min-h-full px-5 py-5 bg-gradient-to-br from-slate-800 to-neon-blue/30">
      {/* Header */}
      <div className="flex items-center gap-3 text-3xl font-bold text-neon-blue">
        <LuBookText />
        <span>مدیریت وبلاگ</span>
      </div>

      {/* Stat cards */}
      <div className="flex flex-wrap items-center justify-center gap-4 my-14">
        <StatCard
          count={stats.totalBlogs}
          gradient="from-neon-blue to-blue-400"
          icon={<MdArticle />}
          label="مقالات"
        />
        <StatCard
          count={stats.publishedBlogs}
          gradient="from-neon-green to-green-600"
          icon={<FaCheckCircle />}
          label="منتشر شده"
        />
        <StatCard
          count={stats.draftBlogs}
          gradient="from-red-300 to-red-600"
          icon={<MdDrafts />}
          label="پیش‌نویس‌ها"
        />
        <StatCard
          count={stats.averageViews}
          gradient="from-orange-200 to-orange-400"
          icon={<FaEye />}
          label="میانگین بازدید"
        />
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 gap-8 mt-10 lg:grid-cols-2">
        {/* -------- Doughnut Chart Card -------- */}
        <div className="p-6 border shadow-lg bg-slate-900/40 rounded-2xl border-cyan-600 backdrop-blur-xl">
          <p className="mb-6 text-xl font-bold text-center text-cyan-100">
            نسبت مقالات منتشر شده به پیش‌نویس
          </p>

          <div className="flex items-center justify-center h-[330px]">
            <DoughnutChart
              data={publishDraftDoughnutData}
              options={doughnutOptions}
              emptyMessage="داده‌ای برای نسبت انتشار وجود ندارد"
            />
          </div>
        </div>

        {/* -------- Bar Chart Card -------- */}
        <div className="p-6 border shadow-lg bg-slate-900/40 rounded-2xl border-cyan-600 backdrop-blur-xl">
          <p className="mb-6 text-xl font-bold text-center text-cyan-100">
            آمار ماهانه مقالات
          </p>

          <div className="w-full overflow-x-auto">
            <div className="min-w-[420px] h-[330px]">
              <BarChart
                data={monthlyBlogsChartData}
                options={barChartOptions}
                emptyMessage="دیتایی برای آمار ماهانه وجود ندارد"
              />
            </div>
          </div>
        </div>
      </div>

      <div>
        <AddBlogForm refetch={blogsResponse.refetch} />
      </div>

      <div>
        <BlogsList blogs={blogs} refetch={blogsResponse.refetch} />
      </div>
    </div>
  );
}

declare type TBlogStats = {
  totalBlogs: number;
  publishedBlogs: number;
  draftBlogs: number;
  blogsByAuthor: BlogsByAuthor[];
  monthlyStats: MonthlyStat[];
  latestBlogs: LatestBlog[];
  topViewedBlogs: LatestBlog[];
  averageViews: number;
};

interface LatestBlog {
  _id: string;
  slug: string;
  title: string;
  author: string;
  createdAt: string;
}

interface MonthlyStat {
  _id: Id;
  count: number;
}

interface Id {
  year: number;
  month: number;
}

interface BlogsByAuthor {
  count: number;
  authorId: string;
  authorName: string;
  authorEmail: string;
}
