import { FaNodeJs, FaReact } from "react-icons/fa";
import {
  SiNextdotjs,
  SiTypescript,
  SiTailwindcss,
  SiMongodb,
} from "react-icons/si";

const technologies = [
  {
    name: "Next.js",
    icon: <SiNextdotjs className="text-2xl" />,
    style: "from-[#0C1220] to-[#4996D2] text-white",
  },
  {
    name: "React",
    icon: <FaReact className="text-2xl text-sky-300" />,
    style: "from-[#222] to-[#75E3FA] text-sky-100",
  },
  {
    name: "Node.js",
    icon: <FaNodeJs className="text-2xl text-green-400" />,
    style: "from-[#161D1A] to-[#2FB881] text-green-100",
  },
  {
    name: "TypeScript",
    icon: <SiTypescript className="text-2xl text-blue-500" />,
    style: "from-[#1A1D23] to-[#3162B9] text-blue-100",
  },
  {
    name: "TailwindCSS",
    icon: <SiTailwindcss className="text-2xl text-cyan-400" />,
    style: "from-[#142429] to-[#72EAE4] text-cyan-100",
  },
  {
    name: "MongoDB",
    icon: <SiMongodb className="text-2xl text-green-600" />,
    style: "from-[#191B13] to-[#30EC89] text-green-50",
  },
];

export default function AboutSection() {
  return (
    <section
      id="about"
      className="relative w-full py-28 px-4 md:px-10 bg-gradient-to-br from-[#121a23] via-[#13222e]/80 to-[#1f3042] overflow-hidden z-0 rounded-t-[2.5rem] shadow-lg border-t border-cyan-800/40"
    >
      {/* Background decorations */}
      <div
        className="absolute -top-24 -right-32 w-[330px] h-[330px] bg-cyan-500/15 rounded-full blur-3xl animate-pulse pointer-events-none select-none"
        aria-hidden
      />
      <div
        className="absolute left-[-110px] top-[40%] w-80 h-80 rounded-full bg-indigo-400/10 blur-2xl rotate-12 z-0"
        aria-hidden
      />
      <div
        className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[70vw] h-48 bg-gradient-to-tr from-cyan-500/5 via-transparent to-indigo-500/5 blur-lg pointer-events-none"
        aria-hidden
      />

      <div className="relative max-w-5xl mx-auto z-10">
        {/* Custom section badge */}
        <div className="flex items-center justify-end gap-2 mb-6 pr-2">
          <span className="bg-gradient-to-r from-cyan-500 to-indigo-500 w-2 h-2 rounded-full animate-ping opacity-70" />
          <span className="bg-cyan-950/80 text-cyan-300 border border-cyan-500/30 rounded px-3 py-1 text-xs font-semibold tracking-wider shadow-md select-none">
            یه کم درباره من
          </span>
        </div>

        {/* Main Card */}
        <div className="flex flex-col-reverse md:flex-row-reverse gap-8 px-2 items-center bg-zinc-800/80 backdrop-blur-md rounded-3xl border border-cyan-800/40 shadow-2xl overflow-hidden">
          {/* Profile */}
          <div className="w-full md:w-1/3 flex flex-col items-center md:items-end py-10 px-4 md:px-0 relative">
            <div className="relative group mb-2">
              <div className="w-32 h-32 rounded-full border-4 border-cyan-700 bg-gradient-to-br from-cyan-500/30 to-indigo-500/30 p-1 shadow-2xl overflow-hidden group-hover:-rotate-2 transition-all duration-300">
                {/* If you have your own image, change /profile.jpg */}
                <img
                  src="/images/profile.png"
                  alt="Ali Manialipour"
                  loading="lazy"
                  className="w-full h-full object-cover rounded-full"
                  style={{ objectPosition: "center 22%" }}
                />
              </div>
              <span className="absolute bottom-2 -right-3 bg-gradient-to-r from-cyan-500 to-indigo-500 px-4 py-2 text-white font-black tracking-wider text-lg rounded-full shadow-lg rotate-3 animate-bounce">
                🙂
              </span>
            </div>
            <div className="mt-3 text-right space-y-2">
              <h2 className="text-white text-2xl font-extrabold mb-1 drop-shadow-cyan">
                مانی علیپور
              </h2>
              <span className="inline-block bg-cyan-600/20 border border-cyan-400/30 rounded-xl px-3 py-1 text-cyan-200 text-xs shadow">
                عاشق ساختن چیزای جدید
              </span>
            </div>
          </div>

          {/* Rich Content */}
          <div className="w-full md:w-2/3 py-10 px-2 md:px-5 space-y-6 text-zinc-200 text-lg leading-9 text-justify">
            <h3 className="text-[1.5rem] md:text-2xl font-bold text-cyan-300 mb-1">
              <span className="inline-block align-middle -rotate-2">👨‍💻</span>{" "}
              برنامه‌نویسی از دید من
            </h3>
            <p>
              من از همون روزای اول که با کد آشنا شدم، احساس کردم با یه دنیا
              بی‌پایان طرفم. هر روز یه ایده جدید تو سرم شکل می‌گیره و بهترین راه
              واسه عملی کردنشون همین برنامه‌نویسیه؛ برام مثل یه بازی باهوشه که
              آخرش یه چیزی ساخته میشه که واقعاً به درد بقیه می‌خوره.
            </p>
            <p>
              همیشه دنبال اینم کارام فقط خوشگل و جذاب نباشه؛ باید همه‌چی راحت و
              سرراست پیش بره! چه فرقی داره سایت ساده باشه چه یه پروژه سنگین؛
              دوستم وقتی میاد تست کنه بگه: "چه راحت بود کار کردن باهاش."
            </p>

            <ul className="space-y-5 pr-4 border-s-4 border-cyan-500/40 text-base mt-5">
              <li>
                <span className="font-bold text-cyan-300">فول‌استک</span>: از
                صفر تا صد، چه طراحی چه برنامه‌نویسی؛ پای کارم.
              </li>
              <li>
                <span className="font-bold text-indigo-300">
                  تجربه کاربری خوش‌دست
                </span>
                : سایت باید سریع باشه، درست کار کنه و اذیت نکنه، نه فقط قشنگ
                باشه.
              </li>
              <li>
                <span className="font-bold text-teal-200">
                  همیشه در حال یادگیری
                </span>
                : دنیای وب همش در حال تغییر‌ه، منم دست روی دست نمی‌ذارم!
              </li>
            </ul>
          </div>
        </div>

        {/* Tech stack showcase */}
        <div className="mt-14 mb-2">
          <h4
            className="text-right mr-1 mb-5 font-bold text-base md:text-lg text-cyan-300/90 
          tracking-wide"
          >
            تکنولوژی‌هایی که هر روز باهاشون سروکله می‌زنم
          </h4>
          <div className="flex flex-wrap gap-5 items-center justify-center md:justify-end">
            {technologies.map((tech) => (
              <div
                key={tech.name}
                className={
                  "group flex flex-col items-center justify-center px-6 py-4 rounded-2xl border border-cyan-600/10 bg-gradient-to-br hover:scale-105 hover:shadow-xl transition-all duration-200 font-semibold hover:border-cyan-500/55 shadow-cyan-900/15 " +
                  tech.style
                }
                tabIndex={0}
                aria-label={tech.name}
              >
                <div className="mb-1 drop-shadow">{tech.icon}</div>
                <span className="text-[15px] font-bold group-hover:text-cyan-200 transition-colors">
                  {tech.name}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
