"use client";

import StatCard from "@/components/ui/cards/StatsCard";
import BarChart from "@/components/ui/charts/Bar";
import DoughnutChart from "@/components/ui/charts/Doughnut";
import LineChart from "@/components/ui/charts/Line";
import PieChart from "@/components/ui/charts/Pie";
import RadarChart from "@/components/ui/charts/Radar";
import PolarAreaChart from "@/components/ui/charts/PolarArea";
import ChartContainer, {
  chartLayoutOptions,
} from "@/components/ui/charts/ChartContainer";
import { normalizeMonthlyStats } from "@/utils/persianMonth";
import {
  FaUsers,
  FaEye,
  FaCheckCircle,
  FaComment,
  FaEnvelope,
} from "react-icons/fa";
import { LuFileText, LuFolderOpen, LuTags } from "react-icons/lu";

interface MonthlyStat {
  _id: { year: number; month: number };
  count: number;
}

export interface IStatisticsData {
  overview: TAdminOverview;
  blogs: {
    totalBlogs: number;
    publishedBlogs: number;
    draftBlogs: number;
    monthlyStats: MonthlyStat[];
    averageViews: number;
    blogsByAuthor?: { authorName?: string; count: number }[];
  };
  users: {
    totalUsers: number;
    activeUsers: number;
    inactiveUsers: number;
    adminCount: number;
    userCount: number;
    monthlyStats: MonthlyStat[];
  };
  views: {
    totalViews: number;
    uniqueViews: number;
    monthlyViews: MonthlyStat[];
    avgViewsPerBlog: number;
    viewsByType?: { _id: string; count: number }[];
  };
  tags: {
    totalTags: number;
    tagsInUse: number;
    unusedTags: string[];
    topTags: { name: string; blogCount: number }[];
  };
  projects: {
    totalProjects: number;
    statusCounts: Record<string, number>;
    monthlyStats: MonthlyStat[];
  };
  contactStats: TContactStats;
}

const chartTooltip = {
  backgroundColor: "#020617ee",
  borderColor: "#92f0fa",
  borderWidth: 2,
  cornerRadius: 8,
  titleFont: { family: "inherit" },
  bodyFont: { family: "inherit" },
};

const legendBottom = {
  display: true,
  position: "bottom" as const,
  labels: { color: "#cffafe", font: { size: 12, family: "inherit" } },
};

const barScales = {
  x: {
    ticks: { color: "#c6fbff", font: { family: "inherit", size: 11 } },
    grid: { color: "#19364d", drawOnChartArea: false },
  },
  y: {
    beginAtZero: true,
    ticks: { color: "#dfffd6", font: { family: "inherit", size: 11 } },
    grid: { color: "#184a6177", borderDash: [4, 4] as number[] },
  },
};

const PROJECT_STATUS_LABELS: Record<string, string> = {
  planned: "برنامه‌ریزی",
  "in-progress": "در حال انجام",
  done: "تکمیل",
  finished: "پایان‌یافته",
  archived: "آرشیو",
};

const VIEW_TYPE_LABELS: Record<string, string> = {
  blog: "مقاله",
  page: "صفحه",
  project: "پروژه",
  home: "خانه",
};

function normalizeForRadar(values: number[]): number[] {
  const max = Math.max(...values, 1);
  return values.map((v) => Math.round((v / max) * 100));
}

export default function StatisticsDashboard({ data }: { data: IStatisticsData }) {
  const { overview, blogs, users, views, tags, projects, contactStats } = data;

  const blogMonthly = normalizeMonthlyStats(blogs.monthlyStats);
  const userMonthly = normalizeMonthlyStats(users.monthlyStats);
  const viewMonthly = normalizeMonthlyStats(views.monthlyViews);
  const projectMonthly = normalizeMonthlyStats(projects.monthlyStats);

  const trendLabels = blogMonthly.map((l) => l.label);

  const combinedLineData = {
    labels: trendLabels,
    datasets: [
      {
        label: "مقالات",
        data: blogMonthly.map((l) => l.count),
        borderColor: "#22d3ee",
        backgroundColor: "rgba(34,211,238,0.15)",
        fill: true,
        tension: 0.35,
      },
      {
        label: "کاربران",
        data: userMonthly.map((l) => l.count),
        borderColor: "#4ade80",
        backgroundColor: "rgba(74,222,128,0.12)",
        fill: true,
        tension: 0.35,
      },
      {
        label: "بازدید",
        data: viewMonthly.map((l) => l.count),
        borderColor: "#fbbf24",
        backgroundColor: "rgba(251,191,36,0.1)",
        fill: true,
        tension: 0.35,
      },
    ],
  };

  const usersStackedBar = {
    labels: ["کاربران"],
    datasets: [
      {
        label: "فعال",
        data: [users.activeUsers],
        backgroundColor: "rgba(74,222,128,0.8)",
        borderRadius: 8,
      },
      {
        label: "غیرفعال",
        data: [users.inactiveUsers],
        backgroundColor: "rgba(248,113,113,0.8)",
        borderRadius: 8,
      },
    ],
  };

  const topTagsBar = {
    labels: tags.topTags.map((t) => t.name),
    datasets: [
      {
        label: "استفاده در مقالات",
        data: tags.topTags.map((t) => t.blogCount),
        backgroundColor: [
          "rgba(168,85,247,0.8)",
          "rgba(59,130,246,0.8)",
          "rgba(34,211,238,0.8)",
          "rgba(74,222,128,0.8)",
          "rgba(251,191,36,0.8)",
        ],
        borderRadius: 10,
      },
    ],
  };

  const contactPieData = {
    labels: ["جدید", "خوانده‌شده", "پاسخ‌داده", "آرشیو"],
    datasets: [
      {
        data: [
          contactStats.new,
          contactStats.read,
          contactStats.replied,
          contactStats.archived,
        ],
        backgroundColor: [
          "rgba(59,130,246,0.85)",
          "rgba(34,211,238,0.85)",
          "rgba(74,222,128,0.85)",
          "rgba(113,113,122,0.85)",
        ],
        borderWidth: 2,
      },
    ],
  };

  const projectStatusEntries = Object.entries(projects.statusCounts).filter(
    ([, c]) => c > 0,
  );
  const projectPieData = {
    labels: projectStatusEntries.map(
      ([k]) => PROJECT_STATUS_LABELS[k] ?? k,
    ),
    datasets: [
      {
        data: projectStatusEntries.map(([, c]) => c),
        backgroundColor: [
          "rgba(251,191,36,0.85)",
          "rgba(34,211,238,0.85)",
          "rgba(74,222,128,0.85)",
          "rgba(168,85,247,0.85)",
          "rgba(113,113,122,0.85)",
        ],
        borderWidth: 2,
      },
    ],
  };

  const viewsByType = views.viewsByType ?? [];
  const viewsTypePie = {
    labels: viewsByType.map(
      (v) => VIEW_TYPE_LABELS[v._id] ?? v._id ?? "سایر",
    ),
    datasets: [
      {
        data: viewsByType.map((v) => v.count),
        backgroundColor: [
          "rgba(34,211,238,0.85)",
          "rgba(74,222,128,0.85)",
          "rgba(251,191,36,0.85)",
          "rgba(248,113,113,0.85)",
        ],
        borderWidth: 2,
      },
    ],
  };

  const polarData = {
    labels: [
      "کاربران",
      "مقالات",
      "پروژه‌ها",
      "کامنت‌ها",
      "پیام‌ها",
      "بازدید",
    ],
    datasets: [
      {
        data: [
          overview.userCount,
          overview.blogCount,
          overview.projectCount,
          overview.commentCount,
          overview.contactCount,
          overview.viewCount,
        ],
        backgroundColor: [
          "rgba(74,222,128,0.6)",
          "rgba(34,211,238,0.6)",
          "rgba(168,85,247,0.6)",
          "rgba(244,114,182,0.6)",
          "rgba(45,212,191,0.6)",
          "rgba(251,191,36,0.6)",
        ],
        borderWidth: 2,
      },
    ],
  };

  const radarValues = normalizeForRadar([
    overview.userCount,
    overview.blogCount,
    overview.projectCount,
    overview.commentCount,
    overview.contactCount,
    Math.min(overview.viewCount, 9999),
  ]);

  const engagementRadar = {
    labels: [
      "کاربران",
      "مقالات",
      "پروژه‌ها",
      "کامنت‌ها",
      "پیام‌ها",
      "بازدید",
    ],
    datasets: [
      {
        label: "شاخص نسبی",
        data: radarValues,
        backgroundColor: "rgba(34,211,238,0.25)",
        borderColor: "#22d3ee",
        borderWidth: 2,
        pointBackgroundColor: "#4ade80",
      },
    ],
  };

  const tagsUsageDoughnut = {
    labels: ["استفاده‌شده", "بدون استفاده"],
    datasets: [
      {
        data: [
          tags.tagsInUse,
          Math.max(0, tags.totalTags - tags.tagsInUse),
        ],
        backgroundColor: [
          "rgba(74,222,128,0.75)",
          "rgba(113,113,122,0.6)",
        ],
        borderWidth: 2,
      },
    ],
  };

  const lineOptions = {
    ...chartLayoutOptions,
    interaction: { mode: "index" as const, intersect: false },
    plugins: { legend: legendBottom, tooltip: chartTooltip },
    scales: barScales,
  };

  const barOptions = {
    ...chartLayoutOptions,
    plugins: { legend: { display: false }, tooltip: chartTooltip },
    scales: barScales,
  };

  const stackedBarOptions = {
    ...chartLayoutOptions,
    indexAxis: "y" as const,
    plugins: { legend: legendBottom, tooltip: chartTooltip },
    scales: {
      x: { stacked: true, ...barScales.x, grid: { display: false } },
      y: { stacked: true, ticks: { color: "#c6fbff", display: false } },
    },
  };

  const horizontalBarOptions = {
    ...chartLayoutOptions,
    indexAxis: "y" as const,
    plugins: { legend: { display: false }, tooltip: chartTooltip },
    scales: {
      x: { ...barScales.y, grid: { display: false } },
      y: { ...barScales.x, grid: { display: false } },
    },
  };

  const doughnutOpts = {
    ...chartLayoutOptions,
    plugins: { legend: legendBottom, tooltip: chartTooltip },
    cutout: "58%",
  };

  const pieOpts = {
    ...chartLayoutOptions,
    plugins: { legend: legendBottom, tooltip: chartTooltip },
  };

  const radarOpts = {
    ...chartLayoutOptions,
    plugins: { legend: { display: false }, tooltip: chartTooltip },
    scales: {
      r: {
        beginAtZero: true,
        max: 100,
        ticks: { color: "#94a3b8", backdropColor: "transparent", stepSize: 25 },
        grid: { color: "#334155" },
        pointLabels: { color: "#cffafe", font: { size: 11 } },
      },
    },
  };

  const polarOpts = {
    ...chartLayoutOptions,
    plugins: { legend: legendBottom, tooltip: chartTooltip },
    scales: {
      r: {
        ticks: { color: "#94a3b8", backdropColor: "transparent" },
        grid: { color: "#334155" },
      },
    },
  };

  const tagsChartHeight = Math.min(
    300,
    Math.max(200, tags.topTags.length * 44),
  );

  return (
    <>
      <div className="flex flex-wrap items-center justify-center gap-3 my-10">
        <StatCard count={overview.userCount} gradient="from-neon-green to-green-600" icon={<FaUsers />} label="کاربران" />
        <StatCard count={overview.blogCount} gradient="from-neon-blue to-blue-400" icon={<LuFileText />} label="مقالات" />
        <StatCard count={overview.projectCount} gradient="from-violet-400 to-purple-600" icon={<LuFolderOpen />} label="پروژه‌ها" />
        <StatCard count={overview.viewCount} gradient="from-yellow-300 to-amber-500" icon={<FaEye />} label="بازدیدها" />
        <StatCard count={overview.commentCount} gradient="from-pink-400 to-rose-500" icon={<FaComment />} label="کامنت‌ها" />
        <StatCard count={overview.contactCount} gradient="from-teal-400 to-cyan-600" icon={<FaEnvelope />} label="پیام‌ها" />
        <StatCard count={tags.totalTags} gradient="from-purple-400 to-indigo-500" icon={<LuTags />} label="تگ‌ها" />
      </div>

      <div className="grid grid-cols-1 gap-6 mb-8 md:grid-cols-3">
        <MiniStat label="منتشر شده" value={overview.publishedBlogCount} icon={<FaCheckCircle className="text-neon-green" />} />
        <MiniStat label="بازدید یکتا" value={views.uniqueViews} />
        <MiniStat label="پیام جدید" value={overview.newContactCount} accent="blue" />
      </div>

      <ChartCard title="روند رشد ماهانه (خطی ترکیبی)" fullWidth>
        <ChartContainer size="line">
          <LineChart data={combinedLineData} options={lineOptions} />
        </ChartContainer>
      </ChartCard>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
        <ChartCard title="شاخص‌های تعامل (رادار)">
          <ChartContainer size="radar">
            <RadarChart data={engagementRadar} options={radarOpts} />
          </ChartContainer>
        </ChartCard>
        <ChartCard title="توزیع موجودیت‌های سایت (قطبی)">
          <ChartContainer size="radar">
            <PolarAreaChart data={polarData} options={polarOpts} />
          </ChartContainer>
        </ChartCard>

        <ChartCard title="نسبت انتشار مقالات">
          <ChartContainer size="circular">
            <DoughnutChart
              data={{
                labels: ["منتشر شده", "پیش‌نویس"],
                datasets: [{
                  data: [blogs.publishedBlogs, blogs.draftBlogs],
                  backgroundColor: ["rgba(74,222,128,0.75)", "rgba(248,113,113,0.75)"],
                  borderWidth: 2,
                }],
              }}
              options={doughnutOpts}
            />
          </ChartContainer>
        </ChartCard>
        <ChartCard title="نقش کاربران">
          <ChartContainer size="circular">
            <DoughnutChart
              data={{
                labels: ["ادمین", "کاربر"],
                datasets: [{
                  data: [users.adminCount, users.userCount],
                  backgroundColor: ["rgba(59,130,246,0.75)", "rgba(168,85,247,0.75)"],
                  borderWidth: 2,
                }],
              }}
              options={doughnutOpts}
            />
          </ChartContainer>
        </ChartCard>
        <ChartCard title="استفاده از تگ‌ها">
          <ChartContainer size="circular">
            <DoughnutChart data={tagsUsageDoughnut} options={doughnutOpts} />
          </ChartContainer>
        </ChartCard>

        <ChartCard title="تگ‌های پرکاربرد" className="md:col-span-2">
          <div
            className="relative w-full max-w-xl mx-auto"
            style={{ height: tagsChartHeight }}
          >
            <div className="absolute inset-0">
              <BarChart
                data={topTagsBar}
                options={horizontalBarOptions}
                emptyMessage="تگی یافت نشد"
              />
            </div>
          </div>
        </ChartCard>

        <ChartCard title="وضعیت پیام‌های تماس">
          <ChartContainer size="circular">
            <PieChart data={contactPieData} options={pieOpts} emptyMessage="پیامی ثبت نشده" />
          </ChartContainer>
        </ChartCard>
        <ChartCard title="وضعیت پروژه‌ها">
          <ChartContainer size="circular">
            <PieChart data={projectPieData} options={pieOpts} emptyMessage="پروژه‌ای ثبت نشده" />
          </ChartContainer>
        </ChartCard>
        <ChartCard title="نوع بازدیدها">
          <ChartContainer size="circular">
            <PieChart data={viewsTypePie} options={pieOpts} emptyMessage="بازدیدی ثبت نشده" />
          </ChartContainer>
        </ChartCard>

        <ChartCard title="کاربران فعال / غیرفعال">
          <ChartContainer size="compact">
            <BarChart data={usersStackedBar} options={stackedBarOptions} />
          </ChartContainer>
        </ChartCard>

        <ChartCard title="ثبت مقالات ماهانه">
          <ChartContainer size="bar">
            <BarChart
              data={{
                labels: blogMonthly.map((l) => l.label),
                datasets: [{
                  label: "مقالات",
                  data: blogMonthly.map((l) => l.count),
                  backgroundColor: "rgba(34,211,238,0.75)",
                  borderRadius: 8,
                }],
              }}
              options={barOptions}
            />
          </ChartContainer>
        </ChartCard>
        <ChartCard title="ثبت پروژه ماهانه">
          <ChartContainer size="bar">
            <BarChart
              data={{
                labels: projectMonthly.map((l) => l.label),
                datasets: [{
                  label: "پروژه",
                  data: projectMonthly.map((l) => l.count),
                  backgroundColor: "rgba(168,85,247,0.75)",
                  borderRadius: 8,
                }],
              }}
              options={barOptions}
            />
          </ChartContainer>
        </ChartCard>
        <ChartCard title="بازدید ماهانه" className="md:col-span-2 xl:col-span-3">
          <ChartContainer size="barWide">
            <BarChart
              data={{
                labels: viewMonthly.map((l) => l.label),
                datasets: [{
                  label: "بازدید",
                  data: viewMonthly.map((l) => l.count),
                  backgroundColor: "rgba(251,191,36,0.75)",
                  borderRadius: 8,
                }],
              }}
              options={barOptions}
            />
          </ChartContainer>
        </ChartCard>
      </div>
    </>
  );
}

function ChartCard({
  title,
  children,
  className = "",
  fullWidth = false,
}: {
  title: string;
  children: React.ReactNode;
  className?: string;
  fullWidth?: boolean;
}) {
  return (
    <div
      className={`p-5 md:p-6 border shadow-lg bg-slate-900/40 rounded-2xl border-cyan-600/80 backdrop-blur-xl ${
        fullWidth ? "mb-6" : ""
      } ${className}`}
    >
      <p className="mb-4 text-base font-bold text-center text-cyan-100">{title}</p>
      <div className="flex justify-center w-full overflow-hidden">{children}</div>
    </div>
  );
}

function MiniStat({
  label,
  value,
  icon,
  accent,
}: {
  label: string;
  value: number;
  icon?: React.ReactNode;
  accent?: "blue";
}) {
  return (
    <div className="p-5 border rounded-2xl bg-slate-900/50 border-cyan-800/60 text-center">
      <div className={`text-3xl font-black ${accent === "blue" ? "text-neon-blue" : "text-neon-green"}`}>
        {value.toLocaleString("fa-IR")}
      </div>
      <div className="flex items-center justify-center gap-1 mt-1 text-sm text-cyan-200">
        {icon}
        {label}
      </div>
    </div>
  );
}
