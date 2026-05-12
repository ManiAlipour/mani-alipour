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
      className="relative w-full py-20 md:py-28 px-2 sm:px-4 md:px-10 bg-gradient-to-br from-[#121a23] via-[#13222e]/80 to-[#1f3042] overflow-hidden z-0 rounded-t-[2.5rem] shadow-lg border-t border-cyan-800/40"
    >
      {/* Background decorations */}
      <div
        className="absolute -top-24 -right-32 w-[230px] sm:w-[330px] h-[230px] sm:h-[330px] bg-cyan-500/15 rounded-full blur-3xl animate-pulse pointer-events-none select-none"
        aria-hidden
      />
      <div
        className="absolute left-[-70px] sm:left-[-110px] top-[40%] w-48 sm:w-80 h-48 sm:h-80 rounded-full bg-indigo-400/10 blur-2xl rotate-12 z-0"
        aria-hidden
      />
      <div
        className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[90vw] sm:w-[70vw] h-32 sm:h-48 bg-gradient-to-tr from-cyan-500/5 via-transparent to-indigo-500/5 blur-lg pointer-events-none"
        aria-hidden
      />

      <div className="relative max-w-5xl mx-auto z-10">
        {/* section badge */}
        <div className="flex items-center justify-end gap-2 mb-6 pr-1 sm:pr-2">
          <span className="bg-gradient-to-r from-cyan-500 to-indigo-500 w-2 h-2 rounded-full animate-ping opacity-70" />
          <span className="bg-cyan-950/80 text-cyan-300 border border-cyan-500/30 rounded px-3 py-1 text-xs font-semibold tracking-wider shadow-md select-none">
            چند کلمه درباره من
          </span>
        </div>

        {/* Main Card */}
        <div className="flex flex-col-reverse md:flex-row-reverse gap-6 md:gap-8 px-1 sm:px-2 items-center bg-zinc-800/80 backdrop-blur-md rounded-3xl border border-cyan-800/40 shadow-2xl overflow-hidden">
          {/* Rich Content */}
          <div className="w-full md:w-2/3 py-7 sm:py-10 px-1 sm:px-2 md:px-5 space-y-5 sm:space-y-7 text-zinc-200 text-[0.99rem] sm:text-[1.08rem] leading-7 sm:leading-8 md:leading-9 text-justify md:text-right">
            <h3 className="text-[1.3rem] sm:text-[1.6rem] md:text-[2rem] font-extrabold text-cyan-300 mb-2 flex items-center gap-2">
              <span className="inline-block align-middle -rotate-2">👨‍💻</span>
              <span>نگاه من به برنامه‌نویسی</span>
            </h3>
            <p className="break-words sm:whitespace-normal">
              برای من برنامه‌نویسی فقط یه مهارت شغلی نیست؛ بیشتر راهیه برای خلق ایده‌هایی که به کار واقعی و زندگی روزمره آدم‌ها کمک کنه. سعی می‌کنم همیشه خروجی کارم ساده، راحت و قابل اطمینان باشه تا هرکسی با خیال راحت ازش استفاده کنه.
            </p>
            <p className="break-words sm:whitespace-normal">
              من همیشه تلاش کردم توی پروژه‌ها تعادل خوبی بین طراحی جذاب و کارایی عالی داشته باشم. رعایت استانداردها، توجه به جزئیات و نگاه کلی به پروژه برام خیلی مهمه و باعث شده به نتیجه‌هایی برسم که بهشون افتخار می‌کنم. حقیقتاً فکر می‌کنم ترکیب یادگیری، علاقه و تعهد رمز ساختن بهترین محصولاته.
            </p>
            <ul className="space-y-4 sm:space-y-5 pr-2 sm:pr-4 border-s-2 sm:border-s-4 border-cyan-500/40 text-sm sm:text-base mt-4 sm:mt-5">
              <li>
                <span className="font-bold text-cyan-300">توسعه فول‌استک:</span>
                <span>
                  {" "}
                  از شروع کار با یه ایده خام تا اجرا و پشتیبانی واقعی پیش رفتم و همیشه سعی کردم توی همه بخش‌ها حضور فعال و مؤثری داشته باشم.
                </span>
              </li>
              <li>
                <span className="font-bold text-indigo-300">
                  تمرکز روی تجربه کاربری
                </span>
                : برام مهمه که هر کسی بتونه راحت و بدون دردسر از محصول استفاده کنه؛ ظاهر سایت یا اپ جذاب باشه ولی کاربردیش رو هیچ‌وقت فدای زیبایی نمی‌کنم.
              </li>
              <li>
                <span className="font-bold text-teal-200">یادگیری مداوم</span>:
                دنیای برنامه‌نویسی خیلی سریع عوض میشه و من هم تلاش می‌کنم هر روز چیزی جدید یاد بگیرم تا بتونم همیشه با تکنولوژی‌های روز جلو برم.
              </li>
            </ul>
          </div>

          {/* Profile */}
          <div className="w-full md:w-1/3 flex flex-col items-center md:items-end py-6 sm:py-10 px-2 sm:px-4 md:px-0 relative">
            <div className="relative group mb-2">
              <div className="w-28 h-28 sm:w-32 sm:h-32 rounded-full border-4 border-cyan-700 bg-gradient-to-br from-cyan-500/30 to-indigo-500/30 p-1 shadow-2xl overflow-hidden group-hover:-rotate-2 transition-all duration-300">
                <img
                  src="/images/profile.png"
                  alt="Ali Manialipour"
                  loading="lazy"
                  className="w-full h-full object-cover rounded-full"
                  style={{ objectPosition: "center 22%" }}
                />
              </div>
              <span className="absolute bottom-2 -right-3 bg-gradient-to-r from-cyan-500 to-indigo-500 px-3 sm:px-4 py-1.5 sm:py-2 text-white font-black tracking-wider text-base sm:text-lg rounded-full shadow-lg rotate-3 animate-bounce">
                🙂
              </span>
            </div>
            <div className="mt-2 sm:mt-3 text-center md:text-right space-y-1 sm:space-y-2 و-full">
              <h2 className="text-white text-[1.25rem] sm:text-2xl font-extrabold mb-1 drop-shadow-cyan">
                مانی علیپور
              </h2>
              <span className="inline-block bg-cyan-600/20 border border-cyan-400/30 rounded-xl px-2.5 sm:px-3 py-1 text-cyan-200 text-xs shadow">
                عاشق یادگیری و ساختن چیزهای جدید!
              </span>
            </div>
          </div>
        </div>

        {/* Tech stack showcase */}
        <div className="mt-10 sm:mt-14 mb-2">
          <h4 className="text-right mr-1 mb-3 sm:mb-5 font-bold text-sm sm:text-base md:text-lg text-cyan-300/90 tracking-wide">
            تکنولوژی‌هایی که هر روز باهاشون سر و کار دارم
          </h4>
          <div className="flex flex-wrap gap-3 sm:gap-5 items-center justify-center md:justify-end">
            {technologies.map((tech) => (
              <div
                key={tech.name}
                className={
                  "group flex flex-col items-center justify-center px-4 sm:px-6 py-3 sm:py-4 rounded-2xl border border-cyan-600/10 bg-gradient-to-br hover:scale-105 hover:shadow-xl transition-all duration-200 font-semibold hover:border-cyan-500/55 shadow-cyan-900/15 " +
                  tech.style
                }
                tabIndex={0}
                aria-label={tech.name}
              >
                <div className="mb-0.5 sm:mb-1 drop-shadow">{tech.icon}</div>
                <span className="text-[13px] sm:text-[15px] font-bold group-hover:text-cyan-200 transition-colors text-center">
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
