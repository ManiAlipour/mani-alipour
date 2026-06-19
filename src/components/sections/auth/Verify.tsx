"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { useState } from "react";

export default function VerifyPage() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const email = searchParams.get("email");
  const callbackUrl = searchParams.get("callbackUrl");

  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleVerify = async () => {
    if (!code) return;

    try {
      setLoading(true);
      setError("");

      const res = await fetch("/api/auth/verify-email", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          code,
        }),
      });

      const data = await res.json();

      if (res.ok) {
        const redirectUrl =
          callbackUrl && callbackUrl.startsWith("/") ? callbackUrl : "/";

        router.replace(redirectUrl);
      } else {
        setError(data.message || "کد تایید نامعتبر است");
      }
    } catch (error) {
      setError("خطا در ارتباط با سرور");
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    if (!email) return;

    try {
      setLoading(true);
      setError("");

      const res = await fetch("/api/auth/resend-code", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.message || "ارسال مجدد کد ناموفق بود");
      }
    } catch {
      setError("خطا در ارسال مجدد کد");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-cyan-950 via-slate-900 to-cyan-950 px-4">
      <div className="w-full max-w-sm bg-slate-900/70 backdrop-blur border border-cyan-900/40 rounded-2xl p-8 shadow-lg">
        <h2 className="text-xl font-bold text-center mb-4 text-cyan-200">
          تایید ایمیل
        </h2>

        <p className="text-sm text-cyan-300/80 text-center mb-6">
          کد ارسال شده به
          <br />
          <span className="font-bold text-neon-green">{email}</span>
          <br />
          را وارد کنید
        </p>

        <input
          type="text"
          inputMode="numeric"
          maxLength={6}
          value={code}
          onChange={(e) => setCode(e.target.value)}
          className="w-full text-center text-2xl tracking-[0.6em] py-3 rounded-xl bg-slate-800 border border-cyan-900 text-cyan-100 outline-none focus:border-cyan-500 transition"
          placeholder="------"
        />

        {error && (
          <p className="text-red-400 text-sm mt-4 text-center">{error}</p>
        )}

        <button
          onClick={handleVerify}
          disabled={loading}
          className="w-full mt-6 py-3 rounded-xl font-bold bg-gradient-to-r from-cyan-400 to-emerald-400 text-slate-900 hover:opacity-90 transition"
        >
          {loading ? "در حال بررسی..." : "تایید کد"}
        </button>

        <button
          onClick={handleResend}
          disabled={loading}
          className="w-full mt-3 text-sm text-cyan-300 hover:text-emerald-300 transition"
        >
          ارسال مجدد کد
        </button>
      </div>
    </div>
  );
}
