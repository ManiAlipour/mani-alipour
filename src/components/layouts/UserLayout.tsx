"use client";

import { useEffect, useState } from "react";
import { useMediaQuery } from "iso-hooks";
import UserHeader from "@/components/sections/user/UserHeader";
import UserSidebar from "@/components/sections/user/UserSidebar";
import { usePathname } from "next/navigation";

const PAGE_TITLES: Record<string, string> = {
  "/dashboard": "داشبورد من",
  "/dashboard/profile": "پروفایل",
  "/dashboard/liked": "علاقه‌مندی‌ها",
  "/dashboard/comments": "نظرات من",
};

export default function UserLayout({ children }: { children: React.ReactNode }) {
  const isDesktop = useMediaQuery("(min-width: 1024px)");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    if (isDesktop) setSidebarOpen(true);
    else setSidebarOpen(false);
  }, [isDesktop]);

  const title = PAGE_TITLES[pathname] ?? "پنل کاربری";
  const sidebarProps = { isDesktop, sidebarOpen, setSidebarOpen };

  return (
    <div className="min-h-screen flex bg-gradient-to-br from-slate-950 via-indigo-950/40 to-slate-900">
      <UserSidebar {...sidebarProps} />

      <div
        className={`flex flex-col flex-1 transition-all ${isDesktop ? "lg:mr-72" : "mr-0"}`}
      >
        <UserHeader {...sidebarProps} title={title} />

        <div className="flex-1 p-4 md:p-8">
          <div className="min-h-[calc(100vh-8rem)] rounded-2xl border border-violet-900/30 bg-slate-900/40 backdrop-blur-sm shadow-inner">
            <main className="p-4 md:p-6 pb-10">{children}</main>
          </div>
        </div>
      </div>
    </div>
  );
}
