import React from "react";
import { LuSearchX } from "react-icons/lu";

export default function BlogNotFound() {
  return (
    <div className="flex flex-col items-center justify-center py-10 text-center text-cyan-200/80">
      <LuSearchX className="text-5xl mb-4 text-cyan-400" />
      <h4 className="text-xl font-semibold mb-2">مقاله‌ای پیدا نشد!</h4>
      <p className="text-base">
        هیچ مقاله‌ای با عبارت موردنظر شما وجود ندارد.
        <br />
        لطفا جستجوی خود را با عبارت دیگری امتحان کنید.
      </p>
    </div>
  );
}
