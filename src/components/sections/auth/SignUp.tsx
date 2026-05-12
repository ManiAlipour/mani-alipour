"use client";

import { useState } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as yup from "yup";
import Link from "next/link";
import { FiEye, FiEyeOff } from "react-icons/fi";
import { useRouter } from "next/navigation";

const userFields = [
  {
    name: "firstName",
    label: "نام",
    type: "text",
    placeholder: "نام خود را وارد کنید",
    autoComplete: "given-name",
  },
  {
    name: "email",
    label: "ایمیل",
    type: "email",
    placeholder: "you@example.com",
    autoComplete: "email",
  },
  {
    name: "password",
    label: "رمز عبور",
    type: "password",
    placeholder: "حداقل ۶ کاراکتر",
    autoComplete: "new-password",
    showToggler: true,
  },
  {
    name: "confirmPassword",
    label: "تکرار رمز عبور",
    type: "password",
    placeholder: "تکرار رمز عبور",
    autoComplete: "new-password",
    showToggler: true,
  },
];

function AuthBackgroundDecor() {
  return (
    <>
      {/* Subtle grid */}
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
          {/* Random shapes */}
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
      {/* Neon blurry glow top left */}
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
          <circle
            cx="80"
            cy="80"
            r="70"
            fill="url(#radialGlow1)"
            opacity="0.84"
          />
        </svg>
      </div>

      {/* Neon blurry glow bottom right */}
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
          <ellipse
            cx="78"
            cy="68"
            rx="62"
            ry="38"
            fill="url(#radialGlow2)"
            opacity="0.85"
          />
        </svg>
      </div>

      {/* Mobile grid */}
      <svg
        aria-hidden
        className="pointer-events-none absolute inset-0 w-full h-full z-0 block md:hidden"
        viewBox="0 0 400 650"
        fill="none"
        style={{ opacity: 0.1 }}
        preserveAspectRatio="none"
      >
        <g>
          <line
            x1="70"
            y1="10"
            x2="85"
            y2="660"
            stroke="#38bdf8"
            strokeWidth="0.5"
            opacity="0.13"
          />
          <line
            x1="240"
            y1="0"
            x2="400"
            y2="590"
            stroke="#5fe2d0"
            strokeWidth="0.5"
            opacity="0.09"
          />
          <rect
            x="320"
            y="510"
            width="17"
            height="17"
            rx="4"
            fill="#a5b4fc"
            opacity=".07"
          />
          <circle cx="120" cy="300" r="11" fill="#38bdf8" opacity="0.10" />
          <circle cx="70" cy="480" r="6" fill="#a5f3fc" opacity="0.12" />
        </g>
      </svg>
    </>
  );
}

const SignUpSchema = yup.object().shape({
  firstName: yup.string().required("نام ضروری است"),
  email: yup
    .string()
    .email("یک ایمیل معتبر وارد کنید")
    .required("ایمیل ضروری است"),
  password: yup
    .string()
    .min(6, "رمز عبور باید حداقل ۶ کاراکتر باشد")
    .required("رمز عبور ضروری است"),
  confirmPassword: yup
    .string()
    .oneOf([yup.ref("password")], "رمز عبور مطابقت ندارد")
    .required("تکرار رمز عبور ضروری است"),
});

export default function SignUp() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  // مقدار اولیه براساس مدل User
  const initialValues = {
    firstName: "",
    email: "",
    password: "",
    confirmPassword: "",
  };

  const getToggle = (name: string) => {
    if (name === "password")
      return {
        show: showPassword,
        setShow: setShowPassword,
        label: showPassword ? "مخفی کردن رمز عبور" : "نمایش رمز عبور",
      };
    if (name === "confirmPassword")
      return {
        show: showConfirm,
        setShow: setShowConfirm,
        label: showConfirm
          ? "مخفی کردن تکرار رمز عبور"
          : "نمایش تکرار رمز عبور",
      };
    return null;
  };

  const router = useRouter();

  return (
    <div className="relative flex flex-col items-center justify-center min-h-screen py-12 px-4 bg-gradient-to-br from-cyan-950 via-slate-900 to-cyan-950 overflow-hidden">
      <AuthBackgroundDecor />
      <div className="relative z-10 w-full max-w-sm bg-gradient-to-b from-cyan-900/80 to-cyan-950/90 rounded-3xl shadow-lg px-6 pt-10 pb-8 backdrop-blur-lg border border-cyan-900/30">
        <h2 className="mb-7 text-center text-2xl font-yekan font-extrabold bg-gradient-to-l from-neon-blue via-cyan-100 to-neon-green bg-clip-text text-transparent drop-shadow-[0_1px_6px_rgba(37,255,83,0.2)]">
          ساخت حساب کاربری
        </h2>
        <Formik
          initialValues={initialValues}
          validationSchema={SignUpSchema}
          onSubmit={async (values, { setSubmitting, resetForm, setErrors }) => {
            setSubmitting(true);

            const data = {
              name: values.firstName,
              email: values.email,
              password: values.password,
            };

            try {
              const res = await fetch("/api/auth/register", {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                },
                body: JSON.stringify(data),
              });

              const body = await res.json();

              if (res.ok) {
                resetForm();
                router.replace("/");
              } else {
                if (body?.message) {
                  setErrors({ email: body.message });
                }

                if (body?.errors) {
                  setErrors({ email: body.errors });
                }
              }
            } catch (error: any) {
              setErrors({ email: error?.message || "خطایی رخ داد" });
            } finally {
              setSubmitting(false);
            }
          }}
        >
          {({ isSubmitting }) => (
            <Form className="flex flex-col gap-6">
              {userFields.map((field) => {
                const isPassword =
                  field.name === "password" || field.name === "confirmPassword";
                const toggler = field.showToggler
                  ? getToggle(field.name)
                  : null;
                return (
                  <div key={field.name}>
                    <label
                      htmlFor={field.name}
                      className="block text-sm font-yekan font-bold text-cyan-200 mb-2 pr-1"
                    >
                      {field.label}
                    </label>
                    <div className="relative">
                      <Field
                        id={field.name}
                        name={field.name}
                        type={
                          toggler
                            ? toggler.show
                              ? "text"
                              : "password"
                            : field.type
                        }
                        className="w-full font-shabnam rounded-xl border border-cyan-800 bg-cyan-900/30 text-cyan-100 placeholder-cyan-200/50 shadow-sm px-3 py-3 focus:border-neon-blue focus:ring-2 focus:ring-cyan-600/40 transition text-base outline-none disabled:bg-cyan-950/30"
                        placeholder={field.placeholder}
                        autoComplete={field.autoComplete}
                      />
                      {toggler && (
                        <button
                          type="button"
                          tabIndex={-1}
                          aria-label={toggler.label}
                          onClick={() => toggler.setShow((v: boolean) => !v)}
                          className="absolute left-3 top-1/2 -translate-y-1/2 w-8 h-8 flex items-center justify-center text-cyan-300 hover:text-neon-green/80 transition"
                        >
                          {toggler.show ? (
                            <FiEyeOff size={20} />
                          ) : (
                            <FiEye size={20} />
                          )}
                        </button>
                      )}
                    </div>
                    <ErrorMessage
                      name={field.name}
                      component="div"
                      className="text-xs text-neon-green font-bold pr-1 mt-1"
                    />
                  </div>
                );
              })}
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full flex justify-center font-extrabold py-3 px-4 rounded-xl bg-gradient-to-r from-neon-blue via-cyan-500/80 to-neon-green text-slate-950 shadow-[0_2px_18px_0_rgba(37,255,83,0.13)] hover:bg-cyan-300/90 transition-colors text-lg tracking-wide outline-none disabled:opacity-55 focus:ring focus:ring-neon-green/30"
              >
                {isSubmitting ? "در حال ثبت نام..." : "ساخت حساب کاربری"}
              </button>
              <div className="flex flex-col items-center gap-2 mt-2">
                <div className="text-sm font-shabnam text-cyan-200 mt-2 select-none">
                  حساب کاربری دارید؟{" "}
                  <Link
                    href="/auth/signin"
                    className="font-yekan font-bold text-neon-green hover:underline underline-offset-2 transition-colors"
                  >
                    ورود به حساب
                  </Link>
                </div>
                <Link
                  href="/"
                  className="inline-block text-cyan-300 font-yekan text-sm font-bold px-2 py-1.5 mt-2 hover:text-neon-green/90 transition-colors underline"
                  tabIndex={isSubmitting ? -1 : 0}
                >
                  بازگشت به صفحه اصلی
                </Link>
              </div>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
}
