"use client";

import { motion } from "framer-motion";
import { HiOutlineClock, HiOutlineChatBubbleLeft } from "react-icons/hi2";
import { IoHeartOutline } from "react-icons/io5";

// مانی جان، این تایپ دقیقاً مطابق با دیتایی هست که از روت GET جدید می‌گیری
interface IComment {
  _id: string;
  postId: string;
  content: string;
  createdAt: string;
  userId: {
    _id: string;
    name: string;
    image?: string;
    isAdmin?: boolean;
  };
}

type Props = {
  comments: IComment[];
};

export default function CommentList({ comments }: Props) {
  const neonBlue = "oklch(68.5% 0.169 237.323)";
  const neonGreen = "oklch(70.4% 0.14 182.503)";

  if (!comments || comments.length === 0) {
    return (
      <div className="mt-12 rounded-3xl border border-white/5 bg-white/[0.01] py-16 text-center backdrop-blur-sm">
        <p className="text-white/40 text-sm font-light">
          هنوز هیچ دیدگاهی ثبت نشده. اولین نفر باشید!
        </p>
      </div>
    );
  }

  return (
    <div className="mt-16 space-y-10">
      <div className="flex items-center gap-4 px-2">
        <h3 className="text-xl font-black text-white">نظرات کاربران</h3>
        <div className="flex h-6 items-center rounded-full bg-white/5 px-3 text-[12px] font-bold text-white/60">
          {comments.length}
        </div>
        <div className="h-px flex-1 bg-gradient-to-l from-white/10 to-transparent" />
      </div>

      <div className="grid gap-8">
        {comments.map((item, index) => (
          <motion.div
            key={item._id}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.05 }}
            className="group relative flex gap-5"
          >
            <div className="absolute right-6 top-14 bottom-[-40px] w-[1px] bg-gradient-to-b from-white/10 to-transparent group-last:hidden" />

            <div className="relative shrink-0">
              <div
                className="h-12 w-12 overflow-hidden rounded-2xl border bg-[#0d1117] transition-all duration-500 group-hover:scale-105"
                style={{
                  borderColor: item.userId?.isAdmin
                    ? neonGreen
                    : "rgba(255,255,255,0.1)",
                  boxShadow: item.userId?.isAdmin
                    ? `0 0 15px -5px ${neonGreen}55`
                    : "none",
                }}
              >
                <img
                  src={
                    item.userId?.image ||
                    `https://ui-avatars.com/api/?name=${item.userId?.name}&background=random`
                  }
                  alt={item.userId?.name}
                  className="h-full w-full object-cover transition-all grayscale-[0.2] group-hover:grayscale-0"
                />
              </div>
              {item.userId?.isAdmin && (
                <div
                  className="absolute -bottom-1 -right-1 h-4 w-4 rounded-full border-2 border-[#0a0a0a]"
                  style={{ backgroundColor: neonGreen }}
                />
              )}
            </div>

            <div className="flex-1 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span
                    className={`text-sm font-bold ${item.userId?.isAdmin ? "text-white" : "text-gray-300"}`}
                  >
                    {item.userId?.name}
                    {item.userId?.isAdmin && (
                      <span
                        className="mr-2 rounded-md bg-white/5 px-2 py-0.5 text-[10px] font-medium"
                        style={{ color: neonGreen }}
                      >
                        نویسنده
                      </span>
                    )}
                  </span>
                  <span className="flex items-center gap-1 text-[11px] text-white/30">
                    <HiOutlineClock size={12} />
                    {new Date(item.createdAt).toLocaleDateString("fa-IR")}
                  </span>
                </div>

                <button className="text-white/20 transition-colors hover:text-red-500">
                  <IoHeartOutline size={18} />
                </button>
              </div>

              <div className="relative rounded-2xl rounded-tr-none border border-white/5 bg-white/[0.02] p-5 text-[14px] leading-8 text-gray-400 transition-all group-hover:bg-white/[0.03] group-hover:text-gray-300">
                {item.content}

                {/* <button
                  className="absolute -bottom-3 left-6 flex items-center gap-2 rounded-full border border-white/10 bg-[#0a0a0a] px-4 py-1 text-[11px] font-bold opacity-0 transition-all group-hover:bottom-2 group-hover:opacity-100"
                  style={{ color: neonBlue }}
                >
                  <HiOutlineChatBubbleLeft size={14} />
                  پاسخ به این دیدگاه
                </button> */}
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
