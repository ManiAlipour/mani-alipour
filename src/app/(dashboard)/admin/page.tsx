"use client";

import { useEffect, useState } from "react";
import { BsStars, BsEye } from "react-icons/bs";
import { FiLogOut, FiUsers } from "react-icons/fi";
import { PiProjectorScreenChartBold } from "react-icons/pi";
import { LuFileText } from "react-icons/lu";

type User = {
  id: string;
  name: string;
  username: string;
  email: string;
  phone?: string;
  avatar?: string | null;
  createdAt?: string;
  updatedAt?: string;
  role: string;
  emailVerified?: boolean;
};

export default function AdminPage() {
  const [stats, setStats] = useState({
    userCount: 0,
    blogCount: 0,
    projectCount: 0,
    viewCount: 0,
  });
  const [admin, setAdmin] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [loadingAdmin, setLoadingAdmin] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [adminError, setAdminError] = useState<string | null>(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true);
        const res = await fetch("/api/admin/overviews");
        if (!res.ok) {
          const errData = await res.json();
          setError(errData.message || "خطا در دریافت اطلاعات");
        } else {
          const data = await res.json();
          setStats(data.data);
          setError(null);
        }
      } catch (err) {
        setError("ارتباط با سرور برقرار نشد");
      } finally {
        setLoading(false);
      }
    };

    const fetchAdmin = async () => {
      try {
        setLoadingAdmin(true);
        const res = await fetch("/api/auth/me");
        if (!res.ok) {
          const errData = await res.json();
          setAdminError(errData.message || "خطا در دریافت اطلاعات ادمین");
          setAdmin(null);
        } else {
          const data = await res.json();
          const user: User = data.user || data;
          setAdmin(user);
          setAdminError(null);
        }
      } catch (err) {
        setAdminError("ارتباط با سرور برای دریافت ادمین برقرار نشد");
        setAdmin(null);
      } finally {
        setLoadingAdmin(false);
      }
    };

    fetchStats();
    fetchAdmin();
  }, []);

  useEffect(() => {
    console.log(admin);
  }, [admin]);

  const handleLogout = () => {
    alert("عملیات خروج شما انجام شد.");
  };

  return (
    <main className="min-h-screen bg-linear-to-br-darksite flex flex-col items-center font-yekan p-0 m-0">
      <div className="w-full max-w-2xl bg-cyan-950/80 rounded-3xl shadow-2xl border border-cyan-800/60 flex flex-col items-center px-0 md:px-0 pt-0 pb-8 md:pb-8">
        {/* Header */}
        <header className="w-full flex flex-col items-center gap-1 pt-9 pb-4 border-b border-cyan-900/40 mb-4">
          <BsStars className="text-neon-blue w-14 h-14 animate-pulse drop-shadow-[0_0_20px_#60aaff33]" />
          <h1 className="text-3xl md:text-4xl font-bold text-neon-green mt-1 flex items-center gap-2">
            داشبورد ادمین
            <span className="text-xl md:text-2xl animate-bounce">
              <BsStars className="inline w-6 h-6 text-neon-green" />
            </span>
          </h1>
          <span className="text-cyan-300/90 mt-1 text-base">
            سلام! مدیریت ساده‌تر از همیشه.
          </span>
        </header>

        {/* Loading/Error */}
        {loading && (
          <div className="my-8 w-full flex justify-center items-center">
            <span className="text-cyan-400 animate-pulse">
              در حال بارگذاری...
            </span>
          </div>
        )}
        {error && (
          <div className="my-4 w-full flex justify-center items-center">
            <span className="text-red-400 text-sm">{error}</span>
          </div>
        )}

        {/* Widgets */}
        <section className="grid grid-cols-1 md:grid-cols-4 w-full gap-4 px-6 pb-6">
          {/* Users */}
          <div className="flex flex-col items-center rounded-xl bg-cyan-900/80 border border-cyan-800 w-full py-8 gap-1 hover:shadow-lg transition">
            <div className="text-2xl md:text-3xl font-bold text-neon-green mb-0.5">
              {loading ? "--" : stats.userCount.toLocaleString("fa-IR")}
            </div>
            <div className="flex items-center text-cyan-200 gap-1">
              کاربران <FiUsers className="text-lg" />
            </div>
            <span className="text-xs text-cyan-400/90 mt-1">کاربر فعال</span>
          </div>

          {/* Content */}
          <div className="flex flex-col items-center rounded-xl bg-cyan-900/60 border border-cyan-800 w-full py-8 gap-1 hover:shadow-lg transition">
            <div className="text-2xl md:text-3xl font-bold text-neon-blue mb-0.5">
              {loading ? "--" : stats.blogCount.toLocaleString("fa-IR")}
            </div>
            <div className="flex items-center text-cyan-200 gap-1">
              محتوا <LuFileText className="text-lg" />
            </div>
            <span className="text-xs text-cyan-400/90 mt-1">پست منتشر شده</span>
          </div>

          {/* Projects */}
          <div className="flex flex-col items-center rounded-xl bg-cyan-900/80 border border-cyan-800 w-full py-8 gap-1 hover:shadow-lg transition">
            <div className="text-2xl md:text-3xl font-bold text-neon-green mb-0.5">
              {loading ? "--" : stats.projectCount.toLocaleString("fa-IR")}
            </div>
            <div className="flex items-center text-cyan-200 gap-1">
              پروژه‌ها <PiProjectorScreenChartBold className="text-lg" />
            </div>
            <span className="text-xs text-cyan-400/90 mt-1">پروژه فعال</span>
          </div>

          {/* Views */}
          <div className="flex flex-col items-center rounded-xl bg-cyan-900/60 border border-cyan-800 w-full py-8 gap-1 hover:shadow-lg transition">
            <div className="text-2xl md:text-3xl font-bold text-yellow-400 mb-0.5">
              {loading ? "--" : stats.viewCount.toLocaleString("fa-IR")}
            </div>
            <div className="flex items-center text-cyan-200 gap-1">
              بازدیدها <BsEye className="text-lg" />
            </div>
            <span className="text-xs text-cyan-400/90 mt-1">
              بازدید ثبت‌شده
            </span>
          </div>
        </section>

        {/* Admin Info CARD */}
        <section className="w-full px-0 md:px-10 mb-8">
          <div className="relative bg-gradient-to-tr from-cyan-900 via-teal-900/80 to-cyan-950 border border-cyan-800 rounded-3xl shadow-2xl overflow-hidden mb-7 p-0 md:p-0 ring-1 ring-neon-green/10">
            <div className="absolute z-0 right-0 top-0 left-0 bottom-0 pointer-events-none">
              <svg
                aria-hidden
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                width="100%"
                height="100%"
              >
                <defs>
                  <radialGradient
                    id="admin-card-glow-v2"
                    cx="55%"
                    cy="14%"
                    r="85%"
                    fx="60%"
                    fy="9%"
                    gradientTransform="rotate(-12 .5 .5)"
                  >
                    <stop stopColor="#37ffbc77" />
                    <stop offset="1" stopColor="#06345000" />
                  </radialGradient>
                </defs>
                <rect
                  width="100%"
                  height="100%"
                  fill="url(#admin-card-glow-v2)"
                />
              </svg>
            </div>
            <div className="relative z-10 flex flex-col md:flex-row items-center gap-7 px-5 sm:px-10 pt-8 pb-6">
              {/* Avatar + Name */}
              <div className="flex-shrink-0 flex flex-col items-center md:items-start gap-2">
                {admin && admin.avatar ? (
                  <span className="relative block group">
                    <span className="absolute -z-10 -top-2 -left-2 w-32 h-32 rounded-full bg-gradient-to-tr from-neon-green/50 via-white/10 to-transparent blur-2xl opacity-70 group-hover:scale-110 transition-all pointer-events-none" />
                    <img
                      src={admin.avatar}
                      alt={admin.name || admin.username || "ادمین"}
                      className="border-4 border-neon-green shadow-2xl rounded-full w-28 h-28 object-cover bg-cyan-800 ring-1 ring-neon-green/30 transition"
                    />
                    <span className="absolute bottom-2.5 left-3 w-4 h-4 bg-neon-green border-2 border-white rounded-full shadow-neon-glow animate-pulse ring-1 ring-neon-green" />
                  </span>
                ) : (
                  <div className="border-4 border-cyan-800 bg-cyan-700/80 rounded-full w-28 h-28 flex items-center justify-center text-cyan-200 text-5xl font-extrabold select-none shadow-lg">
                    {admin && admin.name ? admin.name[0] : "A"}
                  </div>
                )}
                <div className="mt-3 flex flex-row gap-1 items-center">
                  <BsStars className="text-neon-blue w-5 h-5 animate-pulse" />
                  <span className="text-neon-green font-bold text-lg">
                    {admin?.name || "--"}
                  </span>
                </div>
                <div className="flex gap-1 text-xs text-cyan-300 items-center">
                  <span className="bg-cyan-950/60 border px-2 rounded text-cyan-400 border-cyan-700 font-mono">
                    {admin?.role === "admin" ? "ادمین" : "کاربر"}
                  </span>
                  {admin?.username && (
                    <span className="ml-1">
                      <span className="opacity-60">/</span>
                      <span className="font-mono px-1">{admin.username}</span>
                    </span>
                  )}
                  {admin?.emailVerified && (
                    <span className="bg-neon-green/20 text-neon-green px-2 py-0.5 rounded border border-neon-green ml-1">
                      تایید ایمیل
                    </span>
                  )}
                </div>
              </div>

              {/* Info Section */}
              <div className="flex-1 w-full grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-x-8 gap-y-3 text-cyan-50">
                <div className="flex flex-col gap-1.5">
                  <span className="font-bold text-cyan-400 text-sm">
                    ایمیل:
                  </span>
                  <span className="font-mono text-cyan-200 select-all break-all text-base">
                    {admin?.email || "--"}
                  </span>
                </div>
                <div className="flex flex-col gap-1.5">
                  <span className="font-bold text-cyan-400 text-sm">
                    تاریخ ثبت‌نام:
                  </span>
                  <span className="text-base">
                    {admin?.createdAt
                      ? new Date(admin.createdAt).toLocaleDateString("fa-IR", {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        })
                      : "--"}
                  </span>
                </div>
                {admin?.phone && (
                  <div className="flex flex-col gap-1.5 col-span-2 md:col-span-1">
                    <span className="font-bold text-cyan-400 text-sm">
                      تلفن تماس:
                    </span>
                    <span
                      dir="ltr"
                      className="text-cyan-200 font-mono text-base"
                    >
                      {admin.phone}
                    </span>
                  </div>
                )}
                <div className="flex flex-col gap-1.5 col-span-2 md:col-span-2 text-cyan-200/70 mt-2">
                  <span className="flex items-center gap-1">
                    <BsStars className="w-4 h-4 text-neon-blue animate-bounce" />
                    <span>
                      <span>خوش آمدی </span>
                      <span className="text-neon-green font-bold">
                        {admin?.name}
                      </span>
                      <span className="hidden xs:inline">
                        ! مدیریت سایت پیش روی شماست ✨
                      </span>
                    </span>
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Loading & Error States */}
          {loadingAdmin && (
            <div className="w-full flex justify-center py-7 animate-pulse text-cyan-300">
              <span className="px-4 py-2 bg-cyan-900/40 rounded-lg border border-cyan-800/60 backdrop-blur">
                در حال بارگذاری اطلاعات ادمین...
              </span>
            </div>
          )}
          {adminError && (
            <div className="w-full flex justify-center py-7 text-red-400">
              <span className="px-4 py-2 bg-red-950/60 rounded-lg border border-red-900/60">
                {adminError}
              </span>
            </div>
          )}
        </section>

        {/* Logout Button */}
        <button
          className="flex items-center gap-2 px-8 py-3 rounded-lg font-yekan font-bold text-neon-green bg-cyan-950/80 hover:bg-cyan-900 border border-cyan-800 hover:border-neon-green transition-all focus:outline-none focus:ring-1 focus:ring-neon-green text-base shadow-[0_1.5px_12px_0_rgba(37,255,138,0.11)] mt-auto w-full max-w-[320px]"
          style={{ fontFamily: "inherit" }}
          onClick={handleLogout}
        >
          <FiLogOut className="w-5 h-5" />
          خروج
        </button>

        {/* Footer */}
        <footer className="text-xs text-cyan-400/80 pt-8 pb-2 w-full flex flex-col items-center border-t border-cyan-900/20 mt-6">
          <span>© {new Date().getFullYear()} - تمام حقوق محفوظ است.</span>
          <span>ساخته‌شده با ❤️ توسط تیم توسعه</span>
        </footer>

        <style jsx global>{`
          .bg-linear-to-br-darksite {
            background: linear-gradient(
              120deg,
              #063450 17%,
              #143547 80%,
              #05233a 100%
            );
          }
          .shadow-neon-glow {
            box-shadow: 0 0 7px 3px #37ffbc66;
          }
        `}</style>
      </div>
    </main>
  );
}
