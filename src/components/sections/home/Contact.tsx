"use client";
import React, { useState, useRef } from "react";
import { BsTelegram, BsLinkedin, BsEnvelope } from "react-icons/bs";

export default function Contact() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    message: "",
  });
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const formRef = useRef<HTMLFormElement>(null);

  function scrollFormToTop() {
    formRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);

    setTimeout(() => {
      if (!form.name || !form.email || !form.message) {
        setError("لطفاً تمام فیلدها را پر کنید.");
        setSubmitting(false);
        scrollFormToTop();
        return;
      }
      setSubmitting(false);
      setSubmitted(true);
      setForm({ name: "", email: "", message: "" });
      scrollFormToTop();
      setTimeout(() => setSubmitted(false), 3500);
    }, 1400);
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  return (
    <section
      id="contact"
      className="relative w-full py-24 px-4 md:px-0 bg-gradient-to-br from-[#273143] via-[#212749] to-[#172537] min-h-[500px] overflow-x-clip rounded-[2.75rem] shadow-2xl border-t-2 border-cyan-800/50 mt-20 mb-10 flex flex-col items-center"
    >
      {/* Gradient */}
      <AnimatedBG />
      <div className="relative z-10 max-w-2xl mx-auto flex flex-col items-center gap-5 mb-12 w-full">
        {/* Headline with Lottie or SVG effect for attention */}
        <div className="flex flex-row-reverse items-center gap-3 select-none animate-in slide-in-from-top fade-in">
          <span className="rounded-full shadow-md p-3 bg-gradient-to-tr from-cyan-500/60 via-indigo-400/50 to-cyan-800/50 text-5xl md:text-[3.5rem] border border-cyan-400/20 animate-bounce-slow">
            📩
          </span>
          <span className="text-transparent bg-gradient-to-r from-cyan-400 via-indigo-200 to-cyan-300 bg-clip-text font-black text-3xl md:text-5xl leading-tight drop-shadow-lg">
            تماس باما
          </span>
        </div>
        <p className="text-center text-cyan-100/80 text-lg md:text-xl leading-relaxed mt-1.5 font-normal max-w-xl mx-auto">
          برای استعلام، همکاری، پروژه یا ارتباط هرچه سریع‌تر از راه‌های زیر با
          من در تماس باشید.
          <br />
          <span className="text-cyan-400/90 font-medium">
            سعی میکنم سریع جواب بدم 💬
          </span>
        </p>
      </div>

      {/* Contact Cards */}
      <div className="relative z-10 grid grid-cols-1 md:grid-cols-3 gap-5 md:gap-8 max-w-4xl mx-auto w-full mb-10">
        <ContactCard
          href="mailto:hello@manialipour.com"
          icon={<BsEnvelope size={27} />}
          color="from-cyan-500 to-indigo-400"
          shadow="shadow-cyan-400/40"
          title="ایمیل"
          value="hello@manialipour.com"
        />
        <ContactCard
          href="https://t.me/manialipour"
          icon={<BsTelegram size={27} />}
          color="from-sky-500 to-blue-900"
          shadow="shadow-sky-400/40"
          title="تلگرام"
          value="@manialipour"
        />
        <ContactCard
          href="https://linkedin.com/in/manialipour"
          icon={<BsLinkedin size={27} />}
          color="from-blue-700 via-blue-800 to-cyan-400"
          shadow="shadow-blue-400/40"
          title="لینکدین"
          value="/manialipour"
        />
      </div>
      {/* Animated Line Divider */}
      <div className="w-[90%] mx-auto py-2 hidden md:block">
        <div className="relative h-3">
          <div className="h-[2px] w-full bg-gradient-to-r from-transparent via-cyan-400/30 to-transparent absolute top-2 left-0 z-0 blur" />
          <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-gradient-to-r from-cyan-400 via-indigo-400 to-cyan-400 w-16 h-3 rounded-full blur-lg opacity-70 animate-pulse" />
        </div>
      </div>
      {/* Contact Form */}
      <div className="relative z-10 max-w-xl mx-auto w-full mt-6 animate-in fade-in slide-in-from-bottom">
        <form
          ref={formRef}
          autoComplete="off"
          onSubmit={handleSubmit}
          className="bg-gradient-to-br from-[#222c3d] via-[#25304a]/85 to-[#223358] border border-cyan-700/30 rounded-3xl shadow-2xl px-8 py-8 flex flex-col gap-6 md:gap-7"
        >
          <div className="flex items-center gap-2 mb-2">
            <span className="text-2xl md:text-3xl text-cyan-300/80 animate-pulse">
              📝
            </span>
            <span className="font-bold text-lg md:text-xl text-cyan-100/95">
              فرم ارتباط سریع
            </span>
          </div>

          {submitted && (
            <div className="bg-cyan-900/80 border border-cyan-400/40 text-cyan-100 px-4 py-2 rounded-xl text-center mb-3 font-extrabold shadow-xl animate-in fade-in slide-in-from-bottom">
              پیام شما با موفقیت ارسال شد! ممنون از ارتباط شما 💙
            </div>
          )}
          {error && (
            <div className="bg-red-900/50 border border-red-700/20 text-red-100 px-4 py-2 rounded-xl text-center mb-3 font-bold shadow-md animate-fade-in">
              {error}
            </div>
          )}

          <div className="flex flex-col md:flex-row gap-5">
            <Field
              id="name"
              icon="👤"
              label="نام"
              name="name"
              type="text"
              value={form.name}
              onChange={handleChange}
              disabled={submitting}
              placeholder="مثلاً: علی"
              required
            />
            <Field
              id="email"
              icon={<BsEnvelope className="inline" />}
              label="ایمیل"
              name="email"
              type="email"
              value={form.email}
              onChange={handleChange}
              disabled={submitting}
              placeholder="your@email.com"
              required
              autoComplete="email"
            />
          </div>
          <div>
            <Field
              id="message"
              icon="💬"
              label="پیام"
              name="message"
              as="textarea"
              value={form.message}
              onChange={handleChange}
              disabled={submitting}
              placeholder="سلام! خواستم بپرسم ..."
              required
              minRows={4}
            />
          </div>

          <button
            type="submit"
            className="relative bg-gradient-to-r from-cyan-500 to-indigo-800 hover:from-cyan-600 hover:to-indigo-700 active:scale-95 text-white font-bold rounded-full px-8 py-3 shadow-2xl shadow-cyan-400/20 transition-all duration-150 flex items-center justify-center gap-2 focus:outline-none focus:ring-2 focus:ring-cyan-300 disabled:opacity-40 disabled:cursor-not-allowed group"
            disabled={submitting}
            aria-busy={submitting}
          >
            {submitting ? (
              <>
                <svg
                  className="animate-spin mr-2 h-5 w-5 text-white"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-40"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                  ></path>
                </svg>
                در حال ارسال...
              </>
            ) : (
              <>
                <span className="group-hover:animate-wiggle mr-1">🚀</span>
                ارسال پیام
              </>
            )}
          </button>
        </form>
      </div>
    </section>
  );
}

// ====== Animated BG ======
function AnimatedBG() {
  return (
    <div className="pointer-events-none absolute inset-0 z-0 overflow-hidden">
      <span className="absolute left-[7%] top-16 w-56 h-56 bg-cyan-400/15 rounded-full blur-3xl animate-pulse-slow" />
      <span className="absolute right-[15%] bottom-8 w-40 h-40 bg-indigo-500/25 rounded-full blur-2xl animate-float" />
      <span className="absolute left-1/2 top-2/3 w-40 h-40 bg-blue-600/10 rounded-full blur-2xl animate-float2" />
      <span className="absolute right-[12%] top-[18%] w-20 h-20 bg-gradient-to-br from-cyan-400/20 via-indigo-400/25 to-white/0 rounded-full blur-2xl animate-pulse" />
      {/* Border lights */}
      <span className="absolute left-0 bottom-0 w-4 h-full bg-cyan-400/5 blur-2xl" />
      <span className="absolute right-0 top-0 w-5 h-full bg-indigo-400/5 blur-2xl" />
    </div>
  );
}

// ====== Contact Card ======
function ContactCard({
  href,
  icon,
  color,
  shadow,
  title,
  value,
}: {
  href: string;
  icon: React.ReactNode;
  color: string;
  shadow?: string;
  title: string;
  value: string;
}) {
  // On mobile, reduce padding, gap, font sizes, and icon size
  return (
    <a
      href={href}
      target={href.startsWith("mailto:") ? "_self" : "_blank"}
      rel={href.startsWith("mailto:") ? undefined : "noopener noreferrer"}
      className={`flex flex-col items-center gap-1.5 md:gap-2 bg-gradient-to-tr ${color} px-4 md:px-7 py-4 md:py-7 rounded-2xl transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-cyan-300 text-white shadow-xl ${shadow ?? ""} hover:scale-105 hover:shadow-2xl cursor-pointer group contact-card-ux w-full max-w-xs sm:max-w-md md:max-w-none`}
      tabIndex={0}
      style={{
        minHeight: "100px",
        maxWidth: "95vw",
      }}
    >
      <span className="mb-0.5 text-2xl md:text-4xl group-hover:animate-bounce">
        {icon}
      </span>
      <span className="text-base md:text-lg font-bold drop-shadow">
        {title}
      </span>
      <span className="font-mono text-xs md:text-base text-white/85 select-text break-all drop-shadow tracking-wide bg-black/10 rounded px-1.5 py-0.5 mt-0.5">
        {value}
      </span>
    </a>
  );
}

// ====== Field  ======
function Field({
  id,
  icon,
  label,
  name,
  value,
  onChange,
  type = "text",
  placeholder,
  as = "input",
  disabled,
  required,
  autoComplete,
  minRows = 2,
}: {
  id: string;
  icon: React.ReactNode;
  label: string;
  name: string;
  value: string;
  onChange: (e: React.ChangeEvent<any>) => void;
  type?: string;
  placeholder?: string;
  as?: "input" | "textarea";
  disabled?: boolean;
  required?: boolean;
  autoComplete?: string;
  minRows?: number;
}) {
  const Comp = as === "textarea" ? "textarea" : "input";
  return (
    <div className="relative flex items-stretch w-full group">
      {/* Input */}
      <Comp
        id={id}
        name={name}
        type={as === "textarea" ? undefined : type}
        value={value}
        onChange={onChange}
        disabled={disabled}
        placeholder={label + (required ? " *" : "")}
        autoComplete={autoComplete}
        rows={as === "textarea" ? minRows : undefined}
        required={required}
        aria-required={required}
        className={`bg-cyan-900/50 text-cyan-100 text-base md:text-lg px-5 pt-8 pb-2 rounded-xl transition-all outline-none border-2 border-cyan-600/10 focus:border-cyan-400 
          placeholder:text-cyan-400/70 shadow-inner w-full font-medium leading-[1.6] hover:border-cyan-400/30
          focus:bg-cyan-900/60 disabled:bg-cyan-900/20 disabled:opacity-70 resize-none`}
        style={{
          resize: as === "textarea" ? "vertical" : "none",
          minHeight: as === "textarea" ? 48 + minRows * 8 : undefined,
        }}
      />
      {/* Icon */}
      <span className="absolute right-3 top-2.5 text-xl text-cyan-400/60 pointer-events-none transition-all duration-200 peer-focus:scale-110 peer-focus:text-cyan-200/90 flex items-center">
        {icon}
      </span>
    </div>
  );
}
