"use client";

import { useState } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as yup from "yup";
import Link from "next/link";
import { FiEye, FiEyeOff } from "react-icons/fi";
import { useRouter, useSearchParams } from "next/navigation";

function AuthBackgroundDecor() {
  return (
    <>
      <svg
        aria-hidden
        className="pointer-events-none absolute inset-0 w-full h-full z-0 hidden md:block"
        viewBox="0 0 900 700"
        fill="none"
        style={{ opacity: 0.14 }}
        preserveAspectRatio="none"
      >
        <g>
          {[...Array(11)].map((_, i) => (
            <line
              key={`vx${i}`}
              x1={i * 90}
              y1={0}
              x2={i * 90}
              y2={700}
              stroke="#38bdf8"
              strokeWidth="0.7"
              opacity={i % 2 ? 0.16 : 0.1}
            />
          ))}
          {[...Array(8)].map((_, i) => (
            <line
              key={`vy${i}`}
              x1={0}
              y1={i * 100}
              x2={900}
              y2={i * 100}
              stroke="#7dd3fc"
              strokeWidth="0.4"
              opacity={i % 3 ? 0.11 : 0.18}
            />
          ))}
          <circle cx="670" cy="110" r="34" fill="#67e8f9" opacity="0.08" />
          <rect
            x="80"
            y="520"
            width="30"
            height="30"
            rx="8"
            fill="#5fe2d0"
            opacity=".07"
          />
        </g>
      </svg>

      <div
        className="absolute z-0 select-none"
        style={{
          left: -60,
          top: -70,
          width: 180,
          height: 180,
          opacity: 0.34,
          filter:
            "blur(18px) drop-shadow(0 4px 32px #2afcb188) brightness(1.3)",
          pointerEvents: "none",
        }}
      >
        <svg width="100%" height="100%" viewBox="0 0 160 160">
          <defs>
            <radialGradient id="radialGlow1" cx="45%" cy="45%" r="65%">
              <stop offset="0%" stopColor="#67e8f9" stopOpacity="0.77" />
              <stop offset="70%" stopColor="#22d3ee" stopOpacity="0.25" />
              <stop offset="100%" stopColor="#0e7490" stopOpacity="0.03" />
            </radialGradient>
          </defs>
          <circle cx="80" cy="80" r="70" fill="url(#radialGlow1)" />
        </svg>
      </div>

      <div
        className="absolute z-0 select-none"
        style={{
          right: -50,
          bottom: -80,
          width: 170,
          height: 140,
          opacity: 0.29,
          filter: "blur(13px) drop-shadow(0 2px 22px #a7f3d0aa)",
          pointerEvents: "none",
        }}
      >
        <svg width="100%" height="100%" viewBox="0 0 150 120">
          <defs>
            <radialGradient id="radialGlow2" cx="60%" cy="60%" r="80%">
              <stop offset="0%" stopColor="#a7f3d0" stopOpacity="0.89" />
              <stop offset="65%" stopColor="#4efcd0" stopOpacity="0.13" />
              <stop offset="100%" stopColor="#5eead4" stopOpacity="0.07" />
            </radialGradient>
          </defs>
          <ellipse cx="78" cy="68" rx="62" ry="38" fill="url(#radialGlow2)" />
        </svg>
      </div>
    </>
  );
}

const SignInSchema = yup.object().shape({
  email: yup
    .string()
    .email("یک ایمیل معتبر وارد کنید")
    .required("ایمیل ضروری است"),
  password: yup
    .string()
    .min(8, "رمز عبور باید حداقل 8 کاراکتر باشد")
    .required("رمز عبور ضروری است"),
});

export default function SignIn() {
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const router = useRouter();
  const searchParams = useSearchParams();

  const callbackUrl = searchParams.get("callbackUrl");

  const handleLogin = async (
    values: { email: string; password: string },
    { setSubmitting }: { setSubmitting: (v: boolean) => void },
  ) => {
    setError(null);
    setSuccess(null);
    setSubmitting(true);

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(values),
      });

      const data = await res.json();

      if (res.ok) {
        setSuccess(data.message || "ورود با موفقیت انجام شد!");

        const role = data.user?.role;

        const redirectUrl =
          callbackUrl && callbackUrl.startsWith("/")
            ? callbackUrl
            : role === "admin"
              ? "/admin"
              : "/";

        router.replace(redirectUrl);
      } else {
        setError(
          data.message ||
            (data.errors
              ? Array.isArray(data.errors)
                ? data.errors.join("\n")
                : String(data.errors)
              : "خطای ناشناخته‌ای رخ داد."),
        );
      }
    } catch {
      setError("ارتباط با سرور برقرار نشد.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="relative flex flex-col items-center justify-center min-h-screen py-12 px-4 bg-gradient-to-br from-cyan-950 via-slate-900 to-cyan-950 overflow-hidden">
      <AuthBackgroundDecor />

      <div className="relative z-10 w-full max-w-sm bg-gradient-to-b from-cyan-900/80 to-cyan-950/90 rounded-3xl shadow-lg px-6 pt-10 pb-8 backdrop-blur-lg border border-cyan-900/30">
        <h2 className="mb-7 text-center text-2xl font-yekan font-extrabold bg-gradient-to-l from-neon-blue via-cyan-100 to-neon-green bg-clip-text text-transparent">
          ورود به حساب
        </h2>

        <Formik
          initialValues={{ email: "", password: "" }}
          validationSchema={SignInSchema}
          onSubmit={handleLogin}
        >
          {({ isSubmitting }) => (
            <Form className="flex flex-col gap-6">
              {error && (
                <div className="text-xs text-red-400 bg-red-900/20 py-2 px-3 rounded text-center">
                  {error}
                </div>
              )}

              {success && (
                <div className="text-xs text-neon-green bg-green-900/20 py-2 px-3 rounded text-center">
                  {success}
                </div>
              )}

              <div>
                <label className="block text-sm font-bold text-cyan-200 mb-2">
                  ایمیل
                </label>

                <Field
                  name="email"
                  type="email"
                  className="w-full rounded-xl border border-cyan-800 bg-cyan-900/30 text-cyan-100 px-3 py-3 focus:border-neon-blue focus:ring-2 focus:ring-cyan-600/40 outline-none"
                  placeholder="you@example.com"
                />

                <ErrorMessage
                  name="email"
                  component="div"
                  className="text-xs text-neon-green mt-1"
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-cyan-200 mb-2">
                  رمز عبور
                </label>

                <div className="relative">
                  <Field
                    name="password"
                    type={showPassword ? "text" : "password"}
                    className="w-full rounded-xl border border-cyan-800 bg-cyan-900/30 text-cyan-100 px-3 py-3 outline-none"
                    placeholder="حداقل 8 کاراکتر"
                  />

                  <button
                    type="button"
                    onClick={() => setShowPassword((v) => !v)}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-cyan-300"
                  >
                    {showPassword ? (
                      <FiEyeOff size={20} />
                    ) : (
                      <FiEye size={20} />
                    )}
                  </button>
                </div>

                <ErrorMessage
                  name="password"
                  component="div"
                  className="text-xs text-neon-green mt-1"
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3 rounded-xl bg-gradient-to-r from-neon-blue to-neon-green text-slate-950 font-bold"
              >
                {isSubmitting ? "در حال ورود..." : "ورود"}
              </button>

              <div className="text-center text-sm text-cyan-200">
                حساب ندارید؟{" "}
                <Link
                  href={`/auth/signup${callbackUrl ? `?callbackUrl=${callbackUrl}` : ""}`}
                  className="text-neon-green font-bold"
                >
                  ثبت نام
                </Link>
              </div>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
}
