"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaHeart } from "react-icons/fa";

import { useDispatch, useSelector } from "react-redux";
import { toggleBlog } from "@/store/slices/blogLikes";
import { RootState } from "@/store";

export default function BlogLikeButton({ id }: { id: string }) {
  const dispatch = useDispatch();

  const liked = useSelector((state: RootState) =>
    state.likedBlogs.includes(id),
  );

  const [count, setCount] = useState(0);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const controller = new AbortController();

    const fetchLike = async () => {
      try {
        const res = await fetch(`/api/blogs/${id}/like`, {
          signal: controller.signal,
        });

        if (!res.ok) throw new Error("Failed to fetch likes");

        const data = await res.json();
        setCount(data.data.likeCount);
      } catch (err: any) {
        if (err.name !== "AbortError") {
          console.error("Like fetch error:", err);
        }
      }
    };

    fetchLike();

    return () => controller.abort();
  }, [id]);

  const updateCount = (isLiked: boolean) => {
    setCount((prev) => (isLiked ? prev + 1 : prev - 1));
  };

  const handleLike = async () => {
    if (loading) return;

    setLoading(true);

    const optimistic = !liked;

    dispatch(toggleBlog(id));
    updateCount(optimistic);

    try {
      const res = await fetch(`/api/blogs/${id}/like`, {
        method: "POST",
      });

      if (!res.ok) throw new Error("Failed to update like");
    } catch (err) {
      dispatch(toggleBlog(id));
      updateCount(!optimistic);
      console.error("Like update error:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.button
      onClick={handleLike}
      disabled={loading}
      whileTap={{ scale: 0.9 }}
      className="group relative flex items-center gap-2 px-4 py-2 rounded-xl
      bg-white/5 backdrop-blur-md border border-white/10
      hover:border-[oklch(68.5%_0.169_237.323)]
      transition-all duration-300 disabled:opacity-50"
    >
      <div
        className="absolute inset-0 transition opacity-0 pointer-events-none rounded-xl group-hover:opacity-100 blur-xl"
        style={{
          background:
            "radial-gradient(circle, oklch(68.5% 0.169 237.323 / 0.35), transparent 70%)",
        }}
      />

      <motion.span
        animate={
          liked ? { scale: [1, 1.4, 1], rotate: [0, -10, 10, 0] } : { scale: 1 }
        }
        transition={{ duration: 0.4 }}
      >
        <FaHeart
          className={`text-lg transition ${
            liked
              ? "text-[oklch(70.4%_0.14_182.503)] drop-shadow-[0_0_6px_oklch(70.4%_0.14_182.503)]"
              : "text-zinc-400 group-hover:text-zinc-200"
          }`}
        />
      </motion.span>

      <AnimatePresence mode="wait">
        <motion.span
          key={count}
          initial={{ y: 8, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -8, opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="text-sm text-zinc-300"
        >
          {count}
        </motion.span>
      </AnimatePresence>
    </motion.button>
  );
}
