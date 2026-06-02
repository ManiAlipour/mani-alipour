"use client";

import FancyInputBox from "@/components/sections/admin/blogs/Input";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import {
  MdOutlineSettings,
  MdOutlineWeb,
  MdOutlineNotifications,
  MdOutlineSecurity,
} from "react-icons/md";
import { FiSave, FiUser } from "react-icons/fi";
import { BsStars } from "react-icons/bs";

interface ISettingsFormProps {
  settings: TSiteSettings;
  adminName?: string;
  adminEmail?: string;
  onSaved: () => Promise<void>;
}

export default function SettingsForm({
  settings,
  adminName,
  adminEmail,
  onSaved,
}: ISettingsFormProps) {
  const [form, setForm] = useState<TSiteSettings>(settings);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    setForm(settings);
  }, [settings]);

  const updateField = <K extends keyof TSiteSettings>(
    key: K,
    value: TSiteSettings[K],
  ) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await fetch("/api/admin/settings", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          siteName: form.siteName,
          siteDescription: form.siteDescription,
          contactEmail: form.contactEmail,
          maintenanceMode: form.maintenanceMode,
          allowComments: form.allowComments,
          allowRegistration: form.allowRegistration,
          postsPerPage: form.postsPerPage,
          notifyNewContact: form.notifyNewContact,
          notifyNewComment: form.notifyNewComment,
        }),
      });
      if (!res.ok) throw new Error();
      await onSaved();
      toast.success("تنظیمات با موفقیت ذخیره شد");
    } catch {
      toast.error("خطا در ذخیره تنظیمات");
    } finally {
      setSaving(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-10 max-w-3xl mx-auto">
      <section className="p-6 md:p-8 rounded-3xl border border-white/10 bg-[#0f172a]/60 backdrop-blur-md">
        <h2 className="flex items-center gap-2 text-xl font-bold text-neon-blue mb-6">
          <MdOutlineWeb />
          اطلاعات سایت
        </h2>
        <div className="space-y-5">
          <FancyInputBox
            icon={<MdOutlineSettings />}
            label="نام سایت"
            name="siteName"
            value={form.siteName}
            onChange={(e) => updateField("siteName", e.target.value)}
          />
          <FancyInputBox
            as="textarea"
            rows={3}
            icon={<BsStars />}
            label="توضیح کوتاه سایت"
            name="siteDescription"
            value={form.siteDescription}
            onChange={(e) => updateField("siteDescription", e.target.value)}
          />
          <FancyInputBox
            icon={<MdOutlineNotifications />}
            label="ایمیل تماس عمومی"
            name="contactEmail"
            type="email"
            value={form.contactEmail}
            onChange={(e) => updateField("contactEmail", e.target.value)}
          />
          <div>
            <label className="text-sm text-zinc-400 mb-2 block">
              تعداد پست در هر صفحه ({form.postsPerPage})
            </label>
            <input
              type="range"
              min={5}
              max={50}
              step={5}
              value={form.postsPerPage}
              onChange={(e) =>
                updateField("postsPerPage", Number(e.target.value))
              }
              className="w-full accent-neon-blue"
            />
          </div>
        </div>
      </section>

      <section className="p-6 md:p-8 rounded-3xl border border-white/10 bg-[#0f172a]/60 backdrop-blur-md">
        <h2 className="flex items-center gap-2 text-xl font-bold text-neon-green mb-6">
          <MdOutlineSecurity />
          دسترسی و عملکرد
        </h2>
        <div className="space-y-4">
          <ToggleRow
            label="حالت تعمیر و نگهداری"
            description="بازدیدکنندگان پیام نگهداری می‌بینند"
            checked={form.maintenanceMode}
            onChange={(v) => updateField("maintenanceMode", v)}
            accent="red"
          />
          <ToggleRow
            label="ثبت‌نام کاربران جدید"
            description="امکان ساخت حساب کاربری"
            checked={form.allowRegistration}
            onChange={(v) => updateField("allowRegistration", v)}
          />
          <ToggleRow
            label="ثبت کامنت"
            description="کاربران می‌توانند کامنت بگذارند"
            checked={form.allowComments}
            onChange={(v) => updateField("allowComments", v)}
          />
        </div>
      </section>

      <section className="p-6 md:p-8 rounded-3xl border border-white/10 bg-[#0f172a]/60 backdrop-blur-md">
        <h2 className="flex items-center gap-2 text-xl font-bold text-cyan-300 mb-6">
          <MdOutlineNotifications />
          اعلان‌های ادمین
        </h2>
        <div className="space-y-4">
          <ToggleRow
            label="پیام تماس جدید"
            checked={form.notifyNewContact}
            onChange={(v) => updateField("notifyNewContact", v)}
          />
          <ToggleRow
            label="کامنت جدید"
            checked={form.notifyNewComment}
            onChange={(v) => updateField("notifyNewComment", v)}
          />
        </div>
      </section>

      {(adminName || adminEmail) && (
        <section className="p-6 rounded-3xl border border-cyan-800/40 bg-cyan-950/40">
          <h2 className="flex items-center gap-2 text-lg font-bold text-cyan-200 mb-4">
            <FiUser className="text-neon-green" />
            حساب ادمین فعلی
          </h2>
          <p className="text-white font-medium">{adminName ?? "—"}</p>
          <p className="text-zinc-400 text-sm font-mono mt-1">{adminEmail}</p>
        </section>
      )}

      <button
        type="submit"
        disabled={saving}
        className="w-full md:w-auto flex items-center justify-center gap-2 px-10 py-4 rounded-2xl bg-neon-blue text-black font-bold hover:scale-[1.02] transition-all disabled:opacity-50"
      >
        <FiSave size={20} />
        {saving ? "در حال ذخیره..." : "ذخیره تنظیمات"}
      </button>
    </form>
  );
}

function ToggleRow({
  label,
  description,
  checked,
  onChange,
  accent = "blue",
}: {
  label: string;
  description?: string;
  checked: boolean;
  onChange: (v: boolean) => void;
  accent?: "blue" | "red";
}) {
  const activeClass =
    accent === "red"
      ? "bg-red-500/80"
      : "bg-neon-blue";
  return (
    <label className="flex items-center justify-between gap-4 p-4 rounded-2xl bg-white/5 border border-white/10 cursor-pointer hover:bg-white/[0.07] transition-colors">
      <div>
        <span className="text-white font-medium block">{label}</span>
        {description && (
          <span className="text-zinc-500 text-xs mt-0.5 block">{description}</span>
        )}
      </div>
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        onClick={() => onChange(!checked)}
        className={`relative w-12 h-7 rounded-full transition-colors ${checked ? activeClass : "bg-zinc-700"}`}
      >
        <span
          className={`absolute top-1 w-5 h-5 rounded-full bg-white shadow transition-all ${checked ? "right-1" : "right-6"}`}
        />
      </button>
    </label>
  );
}
