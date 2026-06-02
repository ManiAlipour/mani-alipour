"use client";

import ProfileForm from "@/components/sections/user/ProfileForm";
import { useFetch } from "iso-hooks";
import { ImWarning } from "react-icons/im";

export default function ProfilePage() {
  const response = useFetch<{ message: string; data: TUserProfile }>(
    "/api/user/profile",
  );

  if (response.loading) {
    return (
      <div className="text-center py-24 text-violet-300 animate-pulse">
        در حال بارگذاری پروفایل...
      </div>
    );
  }

  if (response.error || !response.data?.data) {
    return (
      <div className="flex flex-col items-center gap-6 py-20">
        <ImWarning className="text-yellow-400 text-4xl" />
        <button
          type="button"
          onClick={() => response.refetch()}
          className="px-6 py-3 rounded-xl bg-violet-500 text-white"
        >
          تلاش مجدد
        </button>
      </div>
    );
  }

  return (
    <div>
      <p className="text-zinc-400 text-sm mb-8">
        اطلاعات حساب و رمز عبور خود را مدیریت کنید.
      </p>
      <ProfileForm
        profile={response.data.data}
        onSaved={response.refetch}
      />
    </div>
  );
}
