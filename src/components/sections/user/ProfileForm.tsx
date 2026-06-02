"use client";

import FancyInputBox from "@/components/sections/admin/blogs/Input";
import { formatDate } from "@/utils/persianMonth";
import { useState } from "react";
import toast from "react-hot-toast";
import { FiSave, FiUser, FiMail, FiLock } from "react-icons/fi";

export default function ProfileForm({
  profile,
  onSaved,
}: {
  profile: TUserProfile;
  onSaved: () => Promise<void>;
}) {
  const [name, setName] = useState(profile.name);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [saving, setSaving] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const body: Record<string, string> = { name };
      if (newPassword) {
        body.currentPassword = currentPassword;
        body.newPassword = newPassword;
      }

      const res = await fetch("/api/user/profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message);

      toast.success("پروفایل به‌روز شد");
      setCurrentPassword("");
      setNewPassword("");
      await onSaved();
    } catch (err: unknown) {
      toast.error(
        err instanceof Error ? err.message : "خطا در ذخیره پروفایل",
      );
    } finally {
      setSaving(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-xl mx-auto space-y-8">
      <div className="rounded-2xl border border-violet-800/40 bg-violet-950/20 p-5 text-sm text-violet-200/90 space-y-2">
        <p className="flex items-center gap-2">
          <FiMail className="text-cyan-400" />
          {profile.email}
        </p>
        <p>
          عضویت: {formatDate(profile.createdAt)}
        </p>
        <p>
          نقش:{" "}
          <span className="text-violet-300 font-bold">
            {profile.role === "admin" ? "ادمین" : "کاربر"}
          </span>
        </p>
      </div>

      <FancyInputBox
        icon={<FiUser />}
        label="نام نمایشی"
        name="name"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />

      <div className="space-y-4 pt-4 border-t border-white/10">
        <h3 className="text-lg font-bold text-violet-200 flex items-center gap-2">
          <FiLock />
          تغییر رمز عبور
        </h3>
        <p className="text-zinc-500 text-xs">
          در صورت عدم نیاز به تغییر رمز، فیلدهای زیر را خالی بگذارید.
        </p>
        <FancyInputBox
          icon={<FiLock />}
          label="رمز فعلی"
          name="currentPassword"
          type="password"
          value={currentPassword}
          onChange={(e) => setCurrentPassword(e.target.value)}
        />
        <FancyInputBox
          icon={<FiLock />}
          label="رمز جدید"
          name="newPassword"
          type="password"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
        />
      </div>

      <button
        type="submit"
        disabled={saving}
        className="flex items-center justify-center gap-2 w-full md:w-auto px-10 py-3.5 rounded-2xl bg-violet-500 text-white font-bold hover:bg-violet-400 transition-all disabled:opacity-50"
      >
        <FiSave />
        {saving ? "در حال ذخیره..." : "ذخیره تغییرات"}
      </button>
    </form>
  );
}
