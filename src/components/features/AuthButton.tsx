"use client";
import { getCookie } from "cookies-next";
import { FaUserAlt } from "react-icons/fa";
import { FaSignOutAlt } from "react-icons/fa";
import { useState } from "react";
import Link from "next/link";

export default function AuthButton() {
  const token = getCookie("token");
  const [dropdownOpen, setDropdownOpen] = useState(false);

  if (!token)
    return (
      <Link href="/auth/signin" passHref>
        <button
          className="cursor-pointer group bg-linear-to-l from-neon-blue to-neon-green hover:from-neon-green hover:to-neon-blue
          px-6 py-2 rounded-full transition-all duration-200 flex items-center gap-3 shadow-md border-2 border-transparent
          hover:border-cyan-400 focus:outline-none focus:ring-2 focus:ring-cyan-400 text-black font-semibold"
        >
          <span className="flex items-center gap-2 text-lg">
            <FaUserAlt className="transition-transform group-hover:scale-110" />
            ثبت نام / ورود
          </span>
        </button>
      </Link>
    );

  return (
    <div className="relative">
      <button
        onClick={() => setDropdownOpen((v) => !v)}
        className="group bg-linear-to-l from-neon-blue to-neon-green hover:from-neon-green hover:to-neon-blue
          px-5 py-2 rounded-full transition-all duration-200 flex items-center gap-2 shadow-md border-2 border-transparent
          hover:border-cyan-400 focus:outline-none focus:ring-2 focus:ring-cyan-400 text-black font-semibold"
        aria-haspopup="true"
        aria-expanded={dropdownOpen}
      >
        <FaUserAlt className="transition-transform group-hover:scale-110" />
        <span className="hidden sm:inline">حساب کاربری</span>
      </button>
      {dropdownOpen && (
        <div
          className="absolute left-1/2 z-20 w-44 mt-2 -translate-x-1/2 bg-slate-950 shadow-lg border border-cyan-400/30 rounded-xl py-2 animate-fade-in
            flex flex-col"
        >
          <Link
            href="/dashboard"
            className="px-4 py-2 text-white hover:bg-cyan-900/40 transition-colors rounded-t-xl"
            onClick={() => setDropdownOpen(false)}
          >
            داشبورد من
          </Link>
          <button
            className="flex items-center gap-2 px-4 py-2 text-red-400 hover:bg-red-950/40 transition-colors rounded-b-xl w-full"
            // onClick={handleLogout} // TODO: Implement logout
          >
            <FaSignOutAlt />
            خروج
          </button>
        </div>
      )}
    </div>
  );
}
