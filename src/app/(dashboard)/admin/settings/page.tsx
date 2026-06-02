"use client";

import SettingsForm from "@/components/sections/admin/settings/SettingsForm";
import { useFetch } from "iso-hooks";
import { useEffect, useState } from "react";
import { MdOutlineSettings } from "react-icons/md";
import { ImWarning } from "react-icons/im";

interface IMeResponse {
  user: {
    name: string;
    email: string;
    role: string;
  };
}

const defaultSettings: TSiteSettings = {
  key: "global",
  siteName: "",
  siteDescription: "",
  contactEmail: "",
  maintenanceMode: false,
  allowComments: true,
  allowRegistration: true,
  postsPerPage: 10,
  notifyNewContact: true,
  notifyNewComment: true,
};

export default function SettingsPage() {
  const settingsResponse = useFetch<TSettingsResponse>("/api/admin/settings", {
    initialData: { message: "", data: defaultSettings },
  });
  const [admin, setAdmin] = useState<IMeResponse["user"] | null>(null);

  useEffect(() => {
    fetch("/api/auth/me")
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data?.user) setAdmin(data.user);
      })
      .catch(() => {});
  }, []);

  if (settingsResponse.loading) {
    return (
      <div className="flex flex-col gap-6 flex-1 justify-center items-center h-full text-center py-24">
        <MdOutlineSettings
          size={48}
          className="text-neon-blue animate-spin mb-2"
        />
        <span className="text-xl font-semibold text-neon-blue">
          در حال بارگذاری تنظیمات...
        </span>
      </div>
    );
  }

  if (settingsResponse.error || !settingsResponse.data?.data) {
    return (
      <div className="text-2xl flex flex-col gap-10 flex-1 justify-center items-center h-full">
        <ImWarning size={50} className="text-yellow-400" />
        <span>مشکلی در دریافت تنظیمات به وجود آمده است</span>
        <button
          type="button"
          className="bg-neon-blue px-6 py-3 rounded-xl cursor-pointer text-black text-base"
          onClick={async () => await settingsResponse.refetch()}
        >
          تلاش مجدد
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-full px-5 py-5 pb-16">
      <div className="flex items-center gap-3 text-3xl font-bold text-neon-blue mb-2">
        <MdOutlineSettings />
        <span>تنظیمات پنل</span>
      </div>
      <p className="text-zinc-400 text-sm mb-10">
        مدیریت اطلاعات سایت، دسترسی‌ها و اعلان‌ها
      </p>

      <SettingsForm
        settings={settingsResponse.data.data}
        adminName={admin?.name}
        adminEmail={admin?.email}
        onSaved={settingsResponse.refetch}
      />
    </div>
  );
}
