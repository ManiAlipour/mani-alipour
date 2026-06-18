import type { Metadata } from "next";
import "./globals.css";
import MainLayout from "@/components/layouts/MainLayout";
import { NextSSRPlugin } from "@uploadthing/react/next-ssr-plugin";
import { extractRouterConfig } from "uploadthing/server";
import { ourFileRouter } from "@/app/api/uploadthing/core";
export const metadata: Metadata = {
  title: "مانی علیپور | توسعه دهنده فول استک و نویسنده مقالات وب",
  description:
    "وبسایت شخصی مانی، توسعه دهنده فول استک وب. مجموعه ای از پروژه ها، مقالات فنی و تجربیات توسعه با فناوری های مدرن وب و معماری اپلیکیشن های مقیاس پذیر.",
  keywords: [
    "مانی",
    "توسعه دهنده وب",
    "Next.js developer",
    "Node.js developer",
    "Full-Stack developer",
    "برنامه نویس فول استک",
    "نکست جی اس",
    "نود جی اس",
    "برنامه نویس وب",
    "برنامه نویس",
    "مقاله وب",
    "نمونه کار سایت",
  ],
  authors: [{ name: "Mani" }],
  creator: "Mani",
  openGraph: {
    title: "مانی | توسعه دهنده وب",
    description:
      "وبسایت شخصی مانی، توسعه دهنده فول استک وب. مجموعه ای از پروژه ها، مقالات فنی و تجربیات توسعه با فناوری های مدرن وب و معماری اپلیکیشن های مقیاس پذیر.",
    url: "https://manialipour.ir",
    siteName: "Mani Alipour",
    locale: "fa_IR",
    type: "website",
  },
  alternates: {
    canonical: "https://manialipour.ir",
  },
  robots: {
    index: true,
    follow: true,
  },
  icons: {
    icon: "/mani-alipour-logo.ico",
    shortcut: "/mani-alipour-logo.ico",
    apple: "/mani-alipour-logo.ico",
  },
};
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fa" dir="rtl" suppressHydrationWarning>
      <body
        className="bg-gradient-to-br from-cyan-950 via-slate-900 to-cyan-950 text-white font-yekan"
        style={{
          minHeight: "100dvh",
        }}
      >
        <NextSSRPlugin
          routerConfig={extractRouterConfig(ourFileRouter)}
        />
        <MainLayout>{children}</MainLayout>
      </body>
    </html>
  );
}
