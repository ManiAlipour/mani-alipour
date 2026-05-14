"use client";
import { useFetch } from "iso-hooks";
import { RiUserSettingsLine } from "react-icons/ri";
import { IoWarning } from "react-icons/io5";
import { useRouter } from "next/navigation";
import {
  FaUserShield,
  FaUser,
  FaUserAltSlash,
  FaCalendarAlt,
  FaUserPlus,
} from "react-icons/fa";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Tooltip,
  Legend,
  Title,
} from "chart.js";
import toPersianMonth, { formatDate } from "@/utils/persianMonth";
import BarChart from "@/components/ui/charts/Bar";
import DoughnutChart from "@/components/ui/charts/Doughnut";
import StatCard from "@/components/ui/cards/StatsCard";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Tooltip,
  Legend,
  Title,
);

interface IUser {
  _id: string;
  name: string;
  email: string;
  role: string;
  likedBlogs: any[];
  createdAt: string;
  updatedAt: string;
}

interface IResponse<T> {
  data: T;
  message: string;
}

interface IUsersAnalytics {
  totalUsers: number;
  activeUsers: number;
  inactiveUsers: number;
  adminCount: number;
  userCount: number;
  monthlyStats: MonthlyStat[];
  latestUsers: LatestUser[];
}

interface LatestUser {
  _id: string;
  name: string;
  email: string;
  role: string;
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

function getUsersBarChartDataAndOptions(monthlyStats: MonthlyStat[]) {
  const labels = monthlyStats.map(
    (stat) => `${toPersianMonth(stat._id.month)} ${stat._id.year}`,
  );
  const data = {
    labels,
    datasets: [
      {
        label: "ثبت‌نام کاربران",
        data: monthlyStats.map((stat) => stat.count),
        backgroundColor: "rgba(48,190,255,0.5)",
        borderColor: "#04d9ff",
        borderWidth: 2,
        borderRadius: 16,
        maxBarThickness: 36,
      },
    ],
  };
  const options = {
    responsive: true,
    plugins: {
      legend: { display: false },
      title: {
        display: false,
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
            return ` ${context.raw} کاربر`;
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
        grid: {
          color: "#184a6177",
          borderDash: [4, 4],
        },
      },
    },
  };
  return { data, options };
}

function getUsersDoughnutChartDataAndOptions({
  totalUsers,
  adminCount,
  activeUsers,
  inactiveUsers,
}: {
  totalUsers: number;
  adminCount: number;
  activeUsers: number;
  inactiveUsers: number;
}) {
  const data = {
    labels: ["کل کاربران", "ادمین", "فعال", "غیرفعال"],
    datasets: [
      {
        label: "آمار کاربران",
        data: [totalUsers, adminCount, activeUsers, inactiveUsers],
        backgroundColor: [
          "rgba(33,255,122,0.78)",
          "rgba(48,190,255,0.90)",
          "rgba(255,215,64,0.90)",
          "rgba(221, 83, 134, 0.93)",
        ],
        borderColor: ["#23ff8a", "#04d9ff", "#ffd740", "#dd5386"],
        borderWidth: 0,
        hoverOffset: 18,
      },
    ],
  };

  const options = {
    cutout: "65%",
    plugins: {
      legend: {
        display: true,
        position: "right" as const,
        labels: {
          color: "#dfffd6",
          font: {
            family: "Vazirmatn, Yekan, inherit",
            size: 15,
            weight: "bold",
          },
          padding: 24,
          boxWidth: 24,
        },
      },
      tooltip: {
        backgroundColor: "#1e293b",
        borderColor: "#04d9ff",
        borderWidth: 1,
        bodyFont: { family: "inherit", size: 16 },
        callbacks: {
          label(context: any) {
            return ` ${context.raw} نفر`;
          },
        },
      },
      title: {
        display: false,
      },
    },
  };

  return { data, options };
}

/* --- Main Page --- */
export default function UsersPage() {
  const usersResponse = useFetch<IResponse<IUser[]>>("/api/admin/users", {
    initialData: { message: "", data: [] as IUser[] },
  });
  const usersAnalyticsResponse = useFetch<IResponse<IUsersAnalytics>>(
    "/api/admin/analytics/users",
  );
  const router = useRouter();

  if (usersResponse.error || usersAnalyticsResponse.error)
    return (
      <div className="text-4xl flex flex-col items-center justify-center gap-10 h-full w-full">
        <IoWarning className="text-8xl text-yellow-400 drop-shadow-xl animate-bounce" />
        <span>خطا در بارگزاری کاربران!</span>
        <div className="flex justify-center gap-10 items-center text-base">
          <button
            className="bg-gradient-to-l from-pink-400/90 to-neon-blue/90 shadow-lg rounded-xl px-6 py-3 text-black font-bold cursor-pointer hover:scale-105 hover:bg-neon-blue/80 transition-all duration-300"
            onClick={() => router.refresh()}
          >
            بارگزاری مجدد
          </button>
        </div>
      </div>
    );

  if (usersResponse.loading || usersAnalyticsResponse.loading)
    return (
      <div className="flex flex-col items-center justify-center gap-8 h-full w-full text-xl text-cyan-100">
        <div className="w-16 h-16 border-4 border-neon-blue border-t-pink-300 border-b-green-400 border-r-yellow-300 border-l-transparent rounded-full animate-spin mb-4"></div>
        <span className="text-lg text-gradient bg-gradient-to-l from-cyan-200 via-pink-400 to-neon-blue bg-clip-text text-transparent font-bold animate-pulse">
          در حال دریافت اطلاعات...
        </span>
      </div>
    );

  const users = usersResponse.data?.data ?? [];
  const usersAnalytics = usersAnalyticsResponse.data?.data;

  const barChartConfig = usersAnalytics
    ? getUsersBarChartDataAndOptions(usersAnalytics.monthlyStats)
    : { data: { labels: [], datasets: [] }, options: {} };

  const doughnutChartConfig = usersAnalytics
    ? getUsersDoughnutChartDataAndOptions({
        totalUsers: usersAnalytics.totalUsers,
        adminCount: usersAnalytics.adminCount,
        activeUsers: usersAnalytics.activeUsers,
        inactiveUsers: usersAnalytics.inactiveUsers,
      })
    : { data: { labels: [], datasets: [] }, options: {} };

  return (
    <div className="flex flex-col gap-10 animate-fade-in pb-12">
      <div
        className="flex items-center gap-4 text-3xl font-extrabold bg-linear-to-l from-neon-blue via-cyan-100 to-neon-green
         bg-clip-text text-transparent pb-2"
        style={{ letterSpacing: "-1.5px" }}
      >
        <RiUserSettingsLine className="animate-pulse drop-shadow-[0_0_14px_#23ff8a99]" />
        مدیریت کاربران
      </div>
      {usersAnalytics && (
        <section className="grid grid-cols-1 md:grid-cols-5 gap-7 w-full">
          <div className="md:col-span-3 bg-linear-to-br from-cyan-900/80 to-sky-900/90 rounded-2xl p-8 shadow-xl border border-cyan-900/25 flex flex-col items-center min-h-[380px] relative overflow-hidden">
            <span className="absolute -top-11 -left-10 rounded-full w-56 h-56 bg-cyan-500/10 blur-2xl z-0" />
            <h3 className="mb-2 font-bold text-xl text-cyan-100 flex items-center gap-2 drop-shadow-[0_2px_8px_#41aceb88]">
              <FaCalendarAlt className="text-cyan-100/80" />
              ثبت‌نام کاربران طی ماه‌های اخیر
            </h3>
            <div className="w-full flex-1 flex items-end justify-center z-10 pt-3 pr-0">
              {/* ری‌یوز چارت بار */}
              <BarChart
                data={barChartConfig.data}
                options={barChartConfig.options}
                className="max-h-80 w-full"
                emptyMessage="آماری یافت نشد."
              />
            </div>
          </div>
          <div
            className="md:col-span-2 flex flex-col justify-center items-center bg-linear-to-br from-indigo-950/60
           to-cyan-950/85 rounded-2xl p-8 shadow-xl border border-cyan-900/25 relative overflow-hidden"
          >
            <span className="absolute bottom-2 left-0 w-32 h-24 rounded-full bg-teal-400/10 blur-2xl z-0" />
            <h3 className="mb-2 font-bold text-xl text-cyan-100 drop-shadow-[0_2px_10px_#12fbd099]">
              ترکیب کاربران
            </h3>
            <div className="w-full flex justify-center z-10 py-2 min-h-[230px]">
              <DoughnutChart
                data={doughnutChartConfig.data}
                options={doughnutChartConfig.options}
                emptyMessage="آماری وجود ندارد."
              />
            </div>
            <div className="flex justify-center items-center gap-3 md:gap-4 mt-6 w-full flex-wrap">
              <StatCard
                label="کل کاربران"
                count={usersAnalytics.totalUsers}
                icon={<FaUserPlus className="text-green-400 text-xl" />}
                gradient="from-green-400/90 to-lime-400/80"
              />
              <StatCard
                label="ادمین"
                count={usersAnalytics.adminCount}
                icon={<FaUserShield className="text-blue-400 text-xl" />}
                gradient="from-blue-400/80 to-cyan-300/80"
              />
              <StatCard
                label="فعال"
                count={usersAnalytics.activeUsers}
                icon={<FaUser className="text-violet-400 text-xl" />}
                gradient="from-indigo-400/70 to-blue-200/80"
              />
              <StatCard
                label="غیرفعال"
                count={usersAnalytics.inactiveUsers}
                icon={<FaUserAltSlash className="text-rose-500 text-xl" />}
                gradient="from-rose-300/90 to-pink-100/70"
              />
            </div>
          </div>
        </section>
      )}

      {/* Latest Users */}
      {usersAnalytics &&
        usersAnalytics.latestUsers &&
        usersAnalytics.latestUsers.length > 0 && (
          <section className="bg-gradient-to-br from-blue-950/90 to-cyan-950/70 rounded-2xl p-7 shadow-xl border border-cyan-900/25 relative overflow-hidden">
            <span className="absolute -bottom-5 -left-14 rounded-full w-48 h-40 bg-neon-blue/10 blur-2xl z-0" />
            <div className="font-bold text-xl mb-6 flex items-center gap-2 bg-gradient-to-l from-neon-blue/70 via-cyan-100/80 to-neon-green/60 bg-clip-text text-transparent drop-shadow-[0_5px_18px_#60aaff88]">
              <FaUser className="text-neon-blue" />
              جدیدترین کاربران ثبت شده
            </div>

            <div className="block md:hidden space-y-3">
              {usersAnalytics.latestUsers.map((user) => (
                <UserMobileCard user={user} key={user._id} />
              ))}
            </div>
            {/* برای دسکتاپ: جدول */}
            <div className="hidden md:block overflow-x-auto rounded-xl shadow-inner">
              <table className="w-full border-separate border-spacing-y-1 text-base font-normal">
                <thead>
                  <tr className="bg-gradient-to-l from-cyan-900/75 to-cyan-950/85">
                    <th className="px-5 py-3 rounded-r-lg">نام</th>
                    <th className="px-5 py-3">ایمیل</th>
                    <th className="px-5 py-3">نقش</th>
                    <th className="px-5 py-3 rounded-l-lg">تاریخ عضویت</th>
                  </tr>
                </thead>
                <tbody>
                  {usersAnalytics.latestUsers.map((user) => (
                    <tr
                      key={user._id}
                      className="bg-gradient-to-l from-cyan-950/80 to-blue-950/70 hover:from-cyan-900/80 hover:to-cyan-950/90 hover:scale-[1.015] transition shadow-sm"
                    >
                      <td className="px-5 py-2">{user.name}</td>
                      <td className="px-5 py-2 font-mono text-cyan-100">
                        {user.email}
                      </td>
                      <td className="px-5 py-2 font-semibold">
                        {user.role === "admin" ? (
                          <span className="text-neon-blue">ادمین</span>
                        ) : (
                          <span className="text-cyan-200">کاربر</span>
                        )}
                      </td>
                      <td className="px-5 py-2">
                        {formatDate(user.createdAt)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        )}

      {/* All Users */}
      <section className="bg-gradient-to-br from-cyan-900/90 to-sky-900/80 rounded-2xl p-7 shadow-xl border border-cyan-900/25 transition">
        <div className="font-bold text-xl mb-5 flex items-center gap-2 bg-gradient-to-l from-neon-blue/90 via-cyan-100 to-neon-green/60 bg-clip-text text-transparent drop-shadow-[0_5px_14px_#44ddff77]">
          <FaUser className="text-cyan-200" />
          لیست کامل کاربران ({users.length})
        </div>
        <div className="block md:hidden space-y-3">
          {users.length === 0 ? (
            <div className="text-center py-6 text-cyan-300 bg-cyan-950/80 rounded-xl">
              کاربری ثبت نشده است.
            </div>
          ) : (
            users.map((user, idx) => (
              <UserMobileCard
                user={user}
                index={idx + 1}
                key={user._id}
                adminAction
              />
            ))
          )}
        </div>

        <div className="hidden md:block overflow-x-auto rounded-xl shadow-inner">
          <table className="w-full border-separate border-spacing-y-1 text-base font-normal">
            <thead>
              <tr className="bg-gradient-to-l from-cyan-900/70 to-cyan-950/85">
                <th className="px-3 py-3 rounded-r-xl">#</th>
                <th className="px-3 py-3">نام</th>
                <th className="px-3 py-3">ایمیل</th>
                <th className="px-3 py-3">نقش</th>
                <th className="px-3 py-3">تاریخ عضویت</th>
                <th className="px-3 py-3 rounded-l-xl">عملیات</th>
              </tr>
            </thead>
            <tbody>
              {users.length === 0 ? (
                <tr>
                  <td
                    colSpan={6}
                    className="text-center py-6 text-cyan-300 bg-cyan-950/80 rounded-xl"
                  >
                    کاربری ثبت نشده است.
                  </td>
                </tr>
              ) : (
                users.map((user, idx) => (
                  <tr
                    key={user._id}
                    className="bg-gradient-to-l from-blue-950/80 to-cyan-900/60 hover:from-cyan-950/80 hover:to-sky-900/90 hover:scale-[1.01] transition"
                  >
                    <td className="px-3 py-2 font-bold">{idx + 1}</td>
                    <td className="px-3 py-2">{user.name}</td>
                    <td className="px-3 py-2 font-mono">{user.email}</td>
                    <td className="px-3 py-2 font-semibold">
                      {user.role === "admin" ? (
                        <span className="text-neon-blue">ادمین</span>
                      ) : (
                        <span className="text-cyan-100">کاربر</span>
                      )}
                    </td>
                    <td className="px-3 py-2">{formatDate(user.createdAt)}</td>
                    <td className="px-1 py-2">
                      <button
                        className={
                          "py-1 px-5 rounded-md font-bold bg-gradient-to-l from-neon-blue to-green-400 text-black text-sm ring-1 ring-cyan-100/30 shadow-md transition-all hover:scale-105 focus:ring-2 active:scale-95 duration-200 disabled:opacity-50 disabled:from-zinc-600"
                        }
                        // TODO: Add user management functionality
                        onClick={() => {}}
                        disabled={user.role === "admin"}
                        title={
                          user.role === "admin"
                            ? "ادمین غیر قابل مدیریت است"
                            : "مدیریت کاربر"
                        }
                      >
                        مدیریت
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}

function UserMobileCard({
  user,
  index,
  adminAction = false,
}: {
  user: IUser | LatestUser;
  index?: number;
  adminAction?: boolean;
}) {
  return (
    <div className="rounded-xl bg-gradient-to-l from-blue-950/80 to-cyan-900/60 shadow p-4 flex flex-col gap-3 text-xs relative overflow-hidden border border-sky-800/50">
      {typeof index === "number" && (
        <span className="absolute left-2 top-2 text-xs text-cyan-400 bg-cyan-950/60 rounded-full w-8 h-8 flex items-center justify-center font-black ring-2 ring-blue-700/60">
          {index}
        </span>
      )}
      <div className="flex gap-2 flex-col sm:flex-row items-center sm:items-start justify-between">
        <div className="flex flex-col flex-1 min-w-0">
          <span className="text-sm flex items-center gap-1 font-bold text-cyan-100 truncate">
            <FaUser className="text-cyan-400" />
            {user.name}
          </span>
          <span className="mt-1 flex gap-1 text-cyan-200 font-mono break-all sm:break-normal">
            {user.email}
          </span>
        </div>
        <div className="flex flex-col items-end mt-2 sm:mt-0 min-w-[70px]">
          <span
            className={`inline-flex items-center gap-1 text-xs font-semibold ${user.role === "admin" ? "text-neon-blue" : "text-cyan-100"}`}
          >
            {user.role === "admin" ? (
              <FaUserShield className="text-lg" />
            ) : (
              <FaUser className="text-lg" />
            )}
            {user.role === "admin" ? "ادمین" : "کاربر"}
          </span>
        </div>
      </div>
      <div className="flex justify-between items-center text-[11px] text-cyan-200 mt-1">
        <span>عضویت: {formatDate(user.createdAt)}</span>
        {adminAction && (
          <button
            className={
              "py-1 px-5 rounded-md font-bold bg-gradient-to-l from-neon-blue to-green-400 text-black text-xs ring-1 ring-cyan-100/30 shadow-md transition-all hover:scale-105 focus:ring-2 active:scale-95 duration-200 disabled:opacity-50 disabled:from-zinc-600"
            }
            onClick={() => {
              // مدیریت کاربر
            }}
            disabled={user.role === "admin"}
            title={
              user.role === "admin"
                ? "ادمین غیر قابل مدیریت است"
                : "مدیریت کاربر"
            }
          >
            مدیریت
          </button>
        )}
      </div>
    </div>
  );
}
