"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  MdClose,
  MdOutlineSpaceDashboard,
  MdOutlinePerson,
  MdOutlineFavorite,
  MdOutlineComment,
  MdOutlineHome,
} from "react-icons/md";
import { BsStars } from "react-icons/bs";
import { Dispatch, SetStateAction, useEffect, useRef } from "react";

interface IUserSidebarProps {
  isDesktop: boolean;
  sidebarOpen: boolean;
  setSidebarOpen: Dispatch<SetStateAction<boolean>>;
}

const navItems = [
  { label: "داشبورد", href: "/dashboard", icon: MdOutlineSpaceDashboard },
  { label: "پروفایل", href: "/dashboard/profile", icon: MdOutlinePerson },
  { label: "علاقه‌مندی‌ها", href: "/dashboard/liked", icon: MdOutlineFavorite },
  { label: "نظرات من", href: "/dashboard/comments", icon: MdOutlineComment },
  { label: "بازگشت به سایت", href: "/", icon: MdOutlineHome },
];

export default function UserSidebar({
  isDesktop,
  sidebarOpen,
  setSidebarOpen,
}: IUserSidebarProps) {
  const pathname = usePathname();
  const sidebarRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!sidebarOpen || isDesktop) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setSidebarOpen(false);
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [sidebarOpen, isDesktop, setSidebarOpen]);

  const closeSidebar = () => {
    if (!isDesktop) setSidebarOpen(false);
  };

  return (
    <>
      {!isDesktop && sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/60 backdrop-blur-md"
          onClick={closeSidebar}
          aria-hidden
        />
      )}

      <aside
        ref={sidebarRef}
        className={`
          fixed top-0 right-0 h-full w-72 z-50
          bg-linear-to-br from-slate-900 via-indigo-950/90 to-slate-900
          border-l border-violet-900/50 rounded-tl-3xl rounded-bl-3xl
          backdrop-blur-xl shadow-lg flex flex-col
          transition-transform duration-300
          ${isDesktop ? "translate-x-0" : sidebarOpen ? "translate-x-0" : "translate-x-full pointer-events-none"}
        `}
        aria-label="منوی کاربری"
      >
        <div className="flex items-center justify-between px-7 py-5 border-b border-violet-900/40">
          <div className="flex items-center gap-2">
            <BsStars className="text-violet-400 w-5 h-5" />
            <span className="text-lg font-bold bg-gradient-to-l from-violet-300 to-cyan-300 bg-clip-text text-transparent">
              پنل کاربری
            </span>
          </div>
          {!isDesktop && (
            <button
              type="button"
              onClick={closeSidebar}
              className="p-2 rounded-full bg-violet-900/50 hover:bg-violet-800/80"
              aria-label="بستن"
            >
              <MdClose className="w-6 h-6 text-violet-100" />
            </button>
          )}
        </div>

        <nav className="flex flex-col gap-1.5 mt-6 px-3">
          {navItems.map(({ href, label, icon: Icon }) => {
            const active =
              href === "/"
                ? false
                : href === "/dashboard"
                  ? pathname === "/dashboard"
                  : pathname.startsWith(href);
            return (
              <Link
                key={href}
                href={href}
                onClick={closeSidebar}
                className={`
                  flex items-center gap-3 px-4 py-3 rounded-xl text-base font-bold
                  border transition-all
                  ${
                    active
                      ? "bg-violet-600/30 text-violet-100 border-violet-500/50"
                      : "text-violet-200/90 bg-violet-950/30 border-transparent hover:border-violet-500/30 hover:bg-violet-950/50"
                  }
                `}
              >
                <Icon className="w-5 h-5 shrink-0" />
                <span className="truncate">{label}</span>
              </Link>
            );
          })}
        </nav>
      </aside>
    </>
  );
}
