"use client";
import AddTagForm from "@/components/sections/admin/tags/AddTagForm";
import TagList from "@/components/sections/admin/tags/TagList";
import { useFetch } from "iso-hooks";
import { BiTag } from "react-icons/bi";
import { BsTagsFill } from "react-icons/bs";
import { ImWarning } from "react-icons/im";

interface ITageResponse {
  message: string;
  data: TTag[];
}

export default function TagsPage() {
  const tagsResponse = useFetch<ITageResponse>("/api/tags");

  if (tagsResponse.loading) {
    return (
      <div className="flex flex-col gap-6 flex-1 justify-center items-center h-full text-center py-24">
        <BiTag size={48} className="text-neon-blue animate-pulse mb-2" />
        <span className="text-xl font-semibold text-neon-blue">
          در حال بارگذاری تگ‌ها...
        </span>
      </div>
    );
  }

  if (tagsResponse.error || !tagsResponse.data) {
    return (
      <div className="text-2xl flex flex-col gap-10 flex-1 justify-center items-center h-full">
        <ImWarning size={50} className="text-yellow-400" />
        <span>مشکلی به وجود آمده است لطفا دوباره تلاش کنید</span>
        <button
          className="bg-neon-blue px-6 py-3 rounded-xl cursor-pointer text-black text-base"
          onClick={async () => await tagsResponse.refetch()}
        >
          تازه سازی صفحه
        </button>
      </div>
    );
  }

  const tags = tagsResponse.data.data;

  return (
    <div>
      <div className="flex gap-2 items-center text-neon-blue text-2xl font-bold">
        <BsTagsFill />
        <span>مدیریت تگ ها</span>
      </div>

      <div>
        <AddTagForm refetch={tagsResponse.refetch} />
      </div>

      <TagList tags={tags} />
    </div>
  );
}
