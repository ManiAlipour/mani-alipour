"use client";

import { Dispatch, SetStateAction } from "react";
import { MdMenu } from "react-icons/md";
import { FiLogOut } from "react-icons/fi";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

interface IUserHeaderProps {
  isDesktop: boolean;
  sidebarOpen: boolean;
  setSidebarOpen: Dispatch<SetStateAction<boolean>>;
  title?: string;
}

export default function UserHeader({
  isDesktop,
  sidebarOpen,
  setSidebarOpen,
  title = "پنل کاربری",
}: IUserHeaderProps) {
  const router = useRouter();

  const handleLogout = async () => {
    try {
      const res = await fetch("/api/auth/logout", { method: "POST" });
      if (!res.ok) throw new Error();
      toast.success("خروج موفق بود");
      router.replace("/auth/signin");
    } catch {
      toast.error("خطا در خروج");
    }
  };

  return (
    <header className="sticky top-0 z-30 flex items-center justify-between px-4 md:px-8 py-4 bg-slate-900/80 backdrop-blur-xl border-b border-violet-900/40">
      {!isDesktop ? (
        <button
          type="button"
          aria-label="منو"
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="flex items-center justify-center w-10 h-10 rounded-full border border-violet-800/50 bg-violet-950/60"
        >
          <MdMenu className="w-6 h-6 text-violet-300" />
        </button>
      ) : (
        <div className="w-10" />
      )}

      <h1 className="text-xl md:text-2xl font-bold bg-gradient-to-l from-violet-300 to-cyan-300 bg-clip-text text-transparent">
        {title}
      </h1>

      <button
        type="button"
        onClick={handleLogout}
        className="flex items-center gap-1.5 px-3 py-2 text-sm font-bold text-violet-200 rounded-xl border border-violet-800/50 hover:bg-violet-900/50 transition-colors"
      >
        <FiLogOut className="w-4 h-4" />
        <span className="hidden sm:inline">خروج</span>
      </button>
    </header>
  );
}
