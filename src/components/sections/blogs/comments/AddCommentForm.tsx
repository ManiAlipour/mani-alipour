"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { HiOutlineLockClosed } from "react-icons/hi2";
import { BiMessageSquare, BiSend } from "react-icons/bi";
import { FaUser } from "react-icons/fa";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

type Props = {
  postId: string;
  slug: string;
};

export default function AddCommentForm({ postId, slug }: Props) {
  const [comment, setComment] = useState("");
  const [loading, setLoading] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const [user, setUser] = useState<any>(null);

  const router = useRouter();

  useEffect(() => {
    async function fetchMe() {
      try {
        const res = await fetch("/api/auth/me", {
          method: "GET",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
        });
        if (!res.ok) throw new Error();
        const data = await res.json();
        setUser(data.user);
      } catch {
        setUser(null);
      } finally {
        setLoading(false);
      }
    }
    fetchMe();
  }, []);

  const neonBlue = "oklch(68.5% 0.169 237.323)";
  const neonGreen = "oklch(70.4% 0.14 182.503)";

  const submitHandler = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!comment.trim()) return;

    setLoading(true);
    try {
      const res = await fetch(`/api/blogs/${postId}/comments`, {
        method: "POST",
        body: JSON.stringify({ postId, content: comment }),
        headers: { "Content-Type": "application/json" },
      });
      if (res.ok) {
        setComment("");
        toast.success("کامنت شما با موفقیت ثبت شد.");
      }
    } catch (error) {
      console.error("Failed to send comment", error);
      toast.error("مشکل در برقرای ارتباط با سرور");
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return (
      <div className="mt-12 overflow-hidden rounded-2xl border border-white/5 bg-white/[0.02] p-8 text-center backdrop-blur-md">
        <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-white/5 text-white/40">
          <HiOutlineLockClosed size={24} />
        </div>
        <h3 className="mb-2 text-lg font-medium text-white">
          دیدگاه شما ارزشمند است
        </h3>
        <p className="mb-6 text-sm text-white/50">
          برای ثبت نظر و شرکت در گفتگو، لطفا ابتدا وارد حساب کاربری شوید.
        </p>
        <button
          className="rounded-xl bg-white px-6 py-2.5 text-sm font-bold text-black transition-transform hover:scale-105 active:scale-95"
          onClick={() => {
            router.push(
              `/auth/signin?callbackUrl=/blogs/${encodeURIComponent(slug)}`,
            );
          }}
        >
          ورود به حساب کاربری
        </button>
      </div>
    );
  }

  return (
    <div className="mt-12 space-y-4">
      <div className="flex items-center gap-2 px-1">
        <BiMessageSquare size={20} style={{ color: neonBlue }} />
        <h3 className="text-lg font-bold text-white">ثبت دیدگاه</h3>
      </div>

      <motion.form
        onSubmit={submitHandler}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative overflow-hidden rounded-2xl border border-white/10 bg-[#0d1117]/50 p-1 backdrop-blur-xl transition-all"
        style={{
          boxShadow: isFocused ? `0 0 20px -10px ${neonBlue}` : "none",
        }}
      >
        <div className="flex flex-col md:flex-row gap-4 p-4">
          <div className="hidden shrink-0 md:block">
            <div className="h-10 w-10 overflow-hidden rounded-full border border-white/10 ring-2 ring-white/5 flex justify-center items-center">
              <FaUser />
            </div>
          </div>

          <div className="flex-1 space-y-4">
            <textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              onFocus={() => setIsFocused(true)}
              onBlur={() => setIsFocused(false)}
              placeholder={`${user.name} عزیز، نظرت رو اینجا بنویس...`}
              rows={3}
              className="w-full resize-none bg-transparent p-2 text-sm text-white/90 outline-none placeholder:text-white/20"
            />

            <div className="flex items-center justify-between border-t border-white/5 pt-4">
              <span className="text-[10px] text-white/30 tracking-widest uppercase">
                Markdown Supported
              </span>

              <button
                disabled={loading || !comment.trim()}
                type="submit"
                className="group relative flex items-center gap-2 overflow-hidden rounded-xl px-6 py-2 text-sm font-bold transition-all disabled:opacity-50"
                style={{
                  backgroundColor: neonBlue,
                  color: "#000",
                }}
              >
                {loading ? (
                  <div className="h-5 w-5 animate-spin rounded-full border-2 border-black/30 border-t-black" />
                ) : (
                  <>
                    <span>ارسال نظر</span>
                    <BiSend
                      size={16}
                      className="transition-transform group-hover:translate-x-1 group-hover:-translate-y-1"
                    />
                  </>
                )}
              </button>
            </div>
          </div>
        </div>

        <motion.div
          initial={{ scaleX: 0 }}
          animate={{ scaleX: isFocused ? 1 : 0 }}
          className="absolute bottom-0 left-0 h-[2px] w-full origin-left"
          style={{ backgroundColor: neonBlue }}
        />
      </motion.form>
    </div>
  );
}
