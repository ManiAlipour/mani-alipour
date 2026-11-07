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
  alternates:{
    canonical: "https://manialipour.ir/about"    
  },
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
    <main className="max-w-6xl p-4 mx-auto space-y-8 md:p-12">
      {/* هدر */}
      <header className="px-2 mt-6 mb-10 md:mt-0">
        <h1 className="mb-4 text-3xl font-extrabold leading-tight text-white md:text-5xl">
          درباره <span style={{ color: "var(--neon-blue)" }}>من</span>
        </h1>
        <p className="max-w-2xl text-lg leading-relaxed text-gray-400 md:text-xl">
          برنامه نویس فول استک با تمرکز بر Next.js و بهینه‌سازی وب
        </p>
      </header>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        {/* معرفی */}
        <MotionWrapper className="p-6 border md:col-span-2 md:p-8 rounded-3xl border-white/10 bg-white/5 backdrop-blur-sm">
          <div className="flex items-center gap-3 mb-6">
            <FaUserGraduate
              size={22}
              className="shrink-0"
              style={{ color: "var(--neon-blue)" }}
            />
            <h2 className="text-xl font-bold leading-snug text-white md:text-2xl">
              برنامه نویس فول استک (Next.js Focused)
            </h2>
          </div>
          <div className="space-y-4 text-base leading-8 text-gray-300 md:text-lg">
            <p>
              من مانی علیپور هستم؛ توسعه‌دهنده فول استک وب با تمرکز ویژه بر
              <strong className="font-medium text-white"> Next.js </strong> و
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
        <MotionWrapper className="p-6 border md:p-8 rounded-3xl border-white/10 bg-white/5">
          <div className="flex items-center gap-3 mb-6">
            <FaCode
              size={22}
              className="shrink-0"
              style={{ color: "var(--neon-green)" }}
            />
            <h3 className="text-xl font-bold text-white">مهارت‌ها</h3>
          </div>

          <div className="grid grid-cols-3 gap-3 md:grid-cols-2">
            {skills.map((skill) => (
              <div
                key={skill.name}
                className="flex flex-col items-center justify-center p-3 transition-colors border rounded-2xl bg-white/5 hover:bg-white/10 border-white/5"
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
        <MotionWrapper className="p-8 text-center border md:col-span-3 md:p-12 rounded-3xl border-white/10 bg-gradient-to-br from-blue-900/20 via-transparent to-green-900/20">
          <FaRocket
            size={28}
            className="mx-auto mb-6"
            style={{ color: "var(--neon-blue)" }}
          />
          <h3 className="mb-4 text-2xl font-bold leading-tight text-white md:text-3xl">
            توسعه حرفه‌ای، ساختار استاندارد، نتیجه قابل اندازه‌گیری
          </h3>
          <p className="max-w-2xl mx-auto text-base leading-relaxed text-gray-400 md:text-lg">
            اگر به دنبال توسعه‌دهنده‌ای هستید که علاوه بر کدنویسی، به سئو،
            پرفورمنس و مقیاس‌پذیری پروژه اهمیت بدهد، خوشحال می‌شوم درباره همکاری
            صحبت کنیم.
          </p>
        </MotionWrapper>
      </div>
    </main>
  );
}
