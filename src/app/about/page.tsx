import { Metadata } from "next";
import { MotionWrapper } from "@/components/MotionWrapper";
import {
  SiNextdotjs,
  SiReact,
  SiTypescript,
  SiTailwindcss,
  SiNodedotjs,
  SiMongodb,
  SiNestjs,
  SiGoogle,
} from "react-icons/si";
import { FaCode, FaRocket, FaUserGraduate, FaSearch } from "react-icons/fa";

// ۱. تنظیم متادیتا برای سئو
export const metadata: Metadata = {
  title: "درباره من | مانی علیپور - برنامه نویس فول استک",
  description:
    "مانی علیپور، توسعه‌دهنده فول استک متخصص Next.js و Node.js. متمرکز بر ساخت اپلیکیشن‌های وب بهینه، سئو تکنیکال و رابط‌های کاربری دسترسی‌پذیر.",
  keywords: [
    "مانی علیپور",
    "برنامه نویس فول استک",
    "توسعه دهنده Next.js",
    "سئو تکنیکال",
    "برنامه نویس نود جی اس",
    "Mani Alipour",
    "Full Stack Developer",
  ],
  openGraph: {
    title: "درباره مانی علیپور | توسعه‌دهنده فول استک وب",
    description: "توسعه محصولات وب مدرن با تمرکز بر عملکرد و تجربه کاربری.",
    url: "https://manialipour.ir/about",
    type: "profile",
    images: [
      {
        url: "/images/mani-alipour-logo.ico",
        width: 1200,
        height: 630,
        alt: "مانی علیپور - برنامه نویس فول استک",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "درباره مانی علیپور",
    description: "توسعه‌دهنده فول استک و متخصص بهینه‌سازی وب",
  },
};

const skills = [
  { icon: SiNextdotjs, name: "Next.js" },
  { icon: SiReact, name: "React" },
  { icon: SiTypescript, name: "TypeScript" },
  { icon: SiTailwindcss, name: "Tailwind" },
  { icon: SiNodedotjs, name: "Node.js" },
  { icon: SiNestjs, name: "NestJS" },
  { icon: SiMongodb, name: "MongoDB" },
  { icon: FaSearch, name: "SEO" },
  { icon: SiGoogle, name: "Optimization" },
];

export default function AboutPage() {
  return (
    <main className="max-w-6xl mx-auto p-4 md:p-12 space-y-8">
      {/* هدر */}
      <header className="mb-10 mt-6 md:mt-0 px-2">
        <h1 className="text-3xl md:text-5xl font-extrabold text-white mb-4 leading-tight">
          درباره <span style={{ color: "var(--neon-blue)" }}>من</span>
        </h1>
        <p className="text-lg md:text-xl text-gray-400 max-w-2xl leading-relaxed">
          برنامه نویس فول استک با تمرکز بر Next.js و بهینه‌سازی وب
        </p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* معرفی */}
        <MotionWrapper className="md:col-span-2 p-6 md:p-8 rounded-3xl border border-white/10 bg-white/5 backdrop-blur-sm">
          <div className="flex items-center gap-3 mb-6">
            <FaUserGraduate
              size={22}
              className="shrink-0"
              style={{ color: "var(--neon-blue)" }}
            />
            <h2 className="text-xl md:text-2xl font-bold text-white leading-snug">
              برنامه نویس فول استک (Next.js Focused)
            </h2>
          </div>
          <div className="text-base md:text-lg text-gray-300 leading-8 space-y-4">
            <p>
              من مانی علیپور هستم؛ توسعه‌دهنده فول استک وب با تمرکز ویژه بر
              <strong className="text-white font-medium"> Next.js </strong> و
              معماری مدرن وب. تخصص من طراحی و پیاده‌سازی کامل پروژه‌ها از UI تا
              Backend و دیتابیس است.
            </p>
            <p>
              در کنار توسعه فنی، به بهینه‌سازی عملکرد، سئو تکنیکال (Technical
              SEO) و ساختار استاندارد پروژه اهمیت ویژه می‌دهم تا خروجی نهایی هم
              برای کاربر و هم برای موتورهای جستجو بهینه باشد.
            </p>
          </div>
        </MotionWrapper>

        {/* مهارت‌ها */}
        <MotionWrapper className="p-6 md:p-8 rounded-3xl border border-white/10 bg-white/5">
          <div className="flex items-center gap-3 mb-6">
            <FaCode
              size={22}
              className="shrink-0"
              style={{ color: "var(--neon-green)" }}
            />
            <h3 className="text-xl font-bold text-white">مهارت‌ها</h3>
          </div>

          <div className="grid grid-cols-3 md:grid-cols-2 gap-3">
            {skills.map((skill) => (
              <div
                key={skill.name}
                className="flex flex-col items-center justify-center p-3 rounded-2xl bg-white/5 hover:bg-white/10 transition-colors border border-white/5"
              >
                <skill.icon size={20} className="mb-2 text-gray-400" />
                <span className="text-[10px] md:text-xs text-gray-500 font-mono text-center truncate w-full">
                  {skill.name}
                </span>
              </div>
            ))}
          </div>
        </MotionWrapper>

        {/* CTA */}
        <MotionWrapper className="md:col-span-3 p-8 md:p-12 rounded-3xl border border-white/10 bg-gradient-to-br from-blue-900/20 via-transparent to-green-900/20 text-center">
          <FaRocket
            size={28}
            className="mx-auto mb-6"
            style={{ color: "var(--neon-blue)" }}
          />
          <h3 className="text-2xl md:text-3xl font-bold text-white mb-4 leading-tight">
            توسعه حرفه‌ای، ساختار استاندارد، نتیجه قابل اندازه‌گیری
          </h3>
          <p className="text-base md:text-lg text-gray-400 max-w-2xl mx-auto leading-relaxed">
            اگر به دنبال توسعه‌دهنده‌ای هستید که علاوه بر کدنویسی، به سئو،
            پرفورمنس و مقیاس‌پذیری پروژه اهمیت بدهد، خوشحال می‌شوم درباره همکاری
            صحبت کنیم.
          </p>
        </MotionWrapper>
      </div>
    </main>
  );
}
