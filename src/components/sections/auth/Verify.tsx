"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { useState } from "react";

export default function VerifyPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const email = searchParams.get("email");

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
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, code }),
      });

      const data = await res.json();

      if (res.ok) {
        // بعد از وریفای موفق → ورود به صفحه اصلی یا داشبورد
        router.replace("/");
      } else {
        setError(data.message);
      }
    } catch (err: any) {
      setError("خطا در ارتباط با سرور");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-slate-900 text-white p-6">
      <div className="bg-slate-800 p-8 rounded-xl w-full max-w-sm">
        <h2 className="text-xl font-bold mb-4 text-center">تایید ایمیل</h2>

        <p className="text-sm text-gray-400 mb-6 text-center">
          کد ارسال شده به {email} را وارد کنید
        </p>

        <input
          type="text"
          maxLength={6}
          value={code}
          onChange={(e) => setCode(e.target.value)}
          className="w-full text-center text-2xl tracking-widest py-3 rounded-lg bg-slate-700 outline-none"
          placeholder="------"
        />

        {error && (
          <p className="text-red-400 text-sm mt-3 text-center">{error}</p>
        )}

        <button
          onClick={handleVerify}
          disabled={loading}
          className="w-full mt-6 py-3 bg-cyan-500 rounded-lg font-bold"
        >
          {loading ? "در حال بررسی..." : "تایید کد"}
        </button>
      </div>
    </div>
  );
}
