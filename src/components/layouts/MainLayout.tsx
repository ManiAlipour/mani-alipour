"use client";
import { usePathname } from "next/navigation";
import RootProvider from "../providers";
import Footer from "../sections/Footer";
import Header from "../sections/Header";
import { Toaster } from "react-hot-toast";

import { useEffect } from "react";

const HIDE_LAYOUT_PATHS = ["/auth", "/dashboard", "/admin"];

function shouldHideLayout(pathname: string) {
  return (
    HIDE_LAYOUT_PATHS.some(
      (base) =>
        pathname === base ||
        (base !== "/auth" && pathname.startsWith(`${base}/`)),
    ) || pathname.startsWith("/auth/")
  );
}

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const hideLayout = shouldHideLayout(pathname);

  return (
    <RootProvider>
      <div>
        <Toaster
          position="top-center"
          reverseOrder={false}
          gutter={8}
          containerClassName=""
          containerStyle={{}}
          toasterId="default"
          toastOptions={{
            className: "",
            duration: 5000,
            removeDelay: 1000,
            style: {
              background: "#363636",
              color: "#fff",
            },

            success: {
              duration: 3000,
              iconTheme: {
                primary: "green",
                secondary: "black",
              },
            },
          }}
        />
        {!hideLayout && <Header />}
        {children}
        {!hideLayout && <Footer />}
      </div>
    </RootProvider>
  );
}
