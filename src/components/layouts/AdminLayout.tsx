"use client";

import { useState, useEffect } from "react";
import AdminHeader from "../sections/admin/Header";
import AdminSidebar from "../sections/admin/Sidebar";
import { useMediaQuery } from "iso-hooks";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const isDesktop = useMediaQuery("(min-width: 1024px)");
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    if (isDesktop) setSidebarOpen(true);
    else setSidebarOpen(false);
  }, [isDesktop]);

  const props = { isDesktop, sidebarOpen, setSidebarOpen };

  return (
    <div className="min-h-screen flex bg-gradient-to-br dark:from-gray-950 dark:via-gray-900 dark:to-gray-900 relative overflow-hidden">
      {/* Sidebar */}
      <AdminSidebar {...props} />

      {/* Mobile Overlay */}
      {!isDesktop && sidebarOpen && (
        <div
          onClick={() => setSidebarOpen(false)}
          className="fixed inset-0 bg-black/40 backdrop-blur-sm z-20 transition-opacity"
        />
      )}

      {/* Main Content */}
      <div
        className={`
          flex flex-col flex-1 min-w-0 transition-all duration-300
          ${isDesktop ? "lg:mr-72" : "mr-0"}
        `}
      >
        {/* Header */}
        <AdminHeader {...props} />

        {/* Container */}
        <div className="flex-1 p-4 md:p-8">
          <div
            className="
              rounded-2xl shadow
              bg-linear-to-br-darksite dark:bg-linear-to-br-darksite
              border border-primary-100 dark:border-gray-800
              min-h-[400px] h-full flex flex-col
              transition-shadow relative
            "
          >
            <main className="flex-1 w-full px-4 pt-4 pb-8">{children}</main>
          </div>
        </div>
      </div>

      {isDesktop && (
        <div className="fixed top-0 right-0 h-full w-64 pointer-events-none z-0">
          <div
            className="absolute inset-0 bg-gradient-to-tl 
            from-primary-100/80 via-primary-50/60 to-transparent 
            dark:from-gray-950/80 dark:via-primary-900/20 dark:to-transparent 
            blur-2xl"
          />

          <div
            className="absolute bottom-12 right-8 w-36 h-36 
            rounded-full bg-primary-200 dark:bg-primary-900/40 
            blur-3xl opacity-50"
          />
        </div>
      )}
    </div>
  );
}
