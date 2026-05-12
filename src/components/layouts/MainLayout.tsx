"use client";
import { usePathname } from "next/navigation";
import RootProvider from "../providers";
import Footer from "../sections/Footer";
import Header from "../sections/Header";

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
        {!hideLayout && <Header />}
        {children}
        {!hideLayout && <Footer />}
      </div>
    </RootProvider>
  );
}
