import React, { Dispatch, SetStateAction, useRef, useEffect } from "react";
import {
  MdOutlineSpaceDashboard,
  MdOutlinePeopleAlt,
  MdOutlineSettings,
  MdClose,
  MdOutlineComment,
  MdOutlineLabel,
  MdOutlineMail,
  MdOutlineBarChart,
  MdOutlineViewList,
  MdOutlineLibraryBooks,
  MdOutlineFolderOpen,
} from "react-icons/md";
import { FiLogOut } from "react-icons/fi";
import { BsStars } from "react-icons/bs";
import Link from "next/link";

interface ISidebarProps {
  isDesktop: boolean;
  sidebarOpen: boolean;
  setSidebarOpen: Dispatch<SetStateAction<boolean>>;
}

const navItems = [
  {
    label: "داشبورد",
    href: "/admin",
    icon: MdOutlineSpaceDashboard,
  },
  {
    label: "کاربران",
    href: "/admin/users",
    icon: MdOutlinePeopleAlt,
  },
  {
    label: "پروژه‌ها",
    href: "/admin/projects",
    icon: MdOutlineFolderOpen,
  },
  {
    label: "بلاگ‌ها",
    href: "/admin/blogs",
    icon: MdOutlineLibraryBooks,
  },
  {
    label: "تگ‌ها",
    href: "/admin/tags",
    icon: MdOutlineLabel,
  },
  {
    label: "کامنت‌ها",
    href: "/admin/comments",
    icon: MdOutlineComment,
  },
  {
    label: "پیام‌ها",
    href: "/admin/messages",
    icon: MdOutlineMail,
  },
  {
    label: "آمار سایت",
    href: "/admin/statistics",
    icon: MdOutlineBarChart,
  },
  {
    label: "اطلاعات آماری",
    href: "/admin/overviews",
    icon: MdOutlineViewList,
  },
  {
    label: "تنظیمات",
    href: "/admin/settings",
    icon: MdOutlineSettings,
  },
];

export default function AdminSidebar({
  isDesktop,
  sidebarOpen,
  setSidebarOpen,
}: ISidebarProps) {
  const sidebarRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!sidebarOpen || isDesktop) return;
    function handleKey(e: KeyboardEvent) {
      if (e.key === "Escape") setSidebarOpen(false);
    }
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [sidebarOpen, setSidebarOpen, isDesktop]);

  useEffect(() => {
    if (!sidebarOpen || isDesktop) return;
    const focusable = sidebarRef.current?.querySelectorAll<HTMLElement>(
      'a,button,[tabindex]:not([tabindex="-1"])',
    );
    if (!focusable?.length) return;
    const first = focusable[0],
      last = focusable[focusable.length - 1];
    function trapFocus(e: KeyboardEvent) {
      if (e.key !== "Tab") return;
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    }
    sidebarRef.current?.addEventListener("keydown", trapFocus);
    first.focus();
    return () => sidebarRef.current?.removeEventListener("keydown", trapFocus);
  }, [sidebarOpen, isDesktop]);

  const closeSidebar = () => {
    if (!isDesktop) setSidebarOpen(false);
  };

  return (
    <>
      {!isDesktop && sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/60 backdrop-blur-md transition-opacity animate-fadein"
          onClick={closeSidebar}
          aria-label="بستن منو"
          tabIndex={-1}
        />
      )}

      <aside
        ref={sidebarRef}
        className={`
          fixed top-0 right-0 h-full w-72 z-50
          bg-linear-to-br-darksite
          border-l border-cyan-900/60
          rounded-tl-3xl rounded-bl-3xl
          overflow-hidden backdrop-blur-xl
          shadow-[0_3px_12px_0_rgba(0,224,208,0.13)]
          flex flex-col
          transition-transform duration-300 ease-out
          focus:outline-none
          ${
            isDesktop
              ? "translate-x-0"
              : sidebarOpen
                ? "translate-x-0"
                : "translate-x-full pointer-events-none"
          }
        `}
        tabIndex={-1}
        aria-label="سایدبار مدیریت"
        role="navigation"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-7 py-5 border-b border-cyan-900/30">
          <div className="flex items-center gap-2">
            <span className="w-8 h-8 flex items-center justify-center rounded-full bg-cyan-950/50 border border-cyan-800 shadow-inner animate-sparkle">
              <BsStars className="text-neon-green w-5 h-5" />
            </span>
            <span className="text-xl font-bold bg-gradient-to-l from-neon-blue to-neon-green bg-clip-text text-transparent font-yekan drop-shadow-[0_2px_9px_#23ff8a44] select-none">
              مدیریت
            </span>
          </div>
          {!isDesktop && (
            <button
              onClick={closeSidebar}
              className="p-2 rounded-full bg-cyan-900/50 hover:bg-cyan-800/90 border border-cyan-800/60 transition shadow focus:outline-none focus:ring-2 focus:ring-neon-blue/80"
              aria-label="بستن"
              tabIndex={0}
            >
              <MdClose className="w-6 h-6 text-cyan-100" />
            </button>
          )}
        </div>

        {/* Navigation */}
        <nav
          className="flex flex-col gap-1.5 mt-6 px-3"
          aria-label="لینک های اصلی"
        >
          {navItems.map(({ href, label, icon: Icon }) => (
            <Link
              key={href}
              href={href}
              onClick={closeSidebar}
              className={`
                group flex items-center gap-3.5 px-4 py-3 rounded-xl
                text-base font-bold font-yekan tracking-tight
                text-cyan-200 bg-cyan-900/40
                border border-transparent
                outline-none focus-visible:ring-2 focus-visible:ring-neon-green/40
                hover:bg-cyan-950/60 hover:text-neon-green/90
                hover:border-neon-green/50
                hover:shadow-[0_2px_16px_0_rgba(37,255,138,0.18)]
                transition-all
                active:scale-98
              `}
              tabIndex={0}
            >
              <span className="w-9 h-9 flex items-center justify-center rounded-lg bg-cyan-950/60 border border-cyan-800 shadow-inner group-hover:bg-gradient-to-l group-hover:from-neon-green/10 group-hover:to-cyan-700 transition">
                <Icon className="w-5 h-5 text-cyan-300 group-hover:text-neon-green/90 transition-colors" />
              </span>
              <span className="truncate">{label}</span>
            </Link>
          ))}
        </nav>

        {/* divider */}
        <div className="mx-7 my-7 border-t border-cyan-800/40"></div>

        {/* بخش خوش آمد */}
        <div className="px-6 pb-6 mt-auto">
          <div
            className="
            rounded-2xl p-4 flex items-center gap-3 justify-between
            bg-gradient-to-br from-cyan-900/60 to-cyan-800/70
            border border-cyan-800/70 shadow
          "
          >
            <div className="flex flex-col font-yekan">
              <span className="text-neon-green font-extrabold text-sm flex items-center gap-1">
                خوش آمدید!{" "}
                <span aria-label="سلام" role="img">
                  👋
                </span>
              </span>
              <span className="text-xs text-cyan-300/90 mt-0.5">
                مدیریت آسان و هوشمند
              </span>
            </div>
            <BsStars className="w-7 h-7 text-neon-blue drop-shadow-[0_0_11px_#60aaff44] animate-sparkle" />
          </div>
        </div>

        {/* Logout */}
        <div className="px-6 pb-7">
          <button
            className="
              w-full py-3 rounded-xl font-bold font-yekan
              text-neon-green bg-cyan-950/60
              border border-cyan-800/70
              hover:bg-gradient-to-l hover:from-cyan-800 hover:to-neon-blue/40
              hover:border-neon-green
              transition-shadow
              shadow-[0_2px_14px_0_rgba(37,255,138,0.17)]
              flex items-center gap-2 justify-center
              outline-none focus-visible:ring-2 focus-visible:ring-neon-green/80
              active:scale-98
            "
            tabIndex={0}
            aria-label="خروج"
          >
            <FiLogOut className="w-5 h-5" />
            خروج
          </button>
        </div>
      </aside>
    </>
  );
}
