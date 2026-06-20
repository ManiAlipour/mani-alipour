"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaHeart } from "react-icons/fa";

import { useDispatch, useSelector } from "react-redux";
import { toggleBlog } from "@/store/slices/blogLikes";
import { RootState } from "@/store";

export default function BlogLikeButton({ id }: { id: string }) {
  const dispatch = useDispatch();

  const likedBlogs = useSelector((state: RootState) => state.likedBlogs);

  const liked = likedBlogs.includes(id);

  const [count, setCount] = useState(0);

  useEffect(() => {
    const fetchLike = async () => {
      const res = await fetch(`/api/blogs/${id}/like`);
      const data = await res.json();

      const { likeCount } = data.data;

      setCount(likeCount);
    };

    fetchLike();
  }, [id]);

  const handleLike = async () => {
    const optimisticLiked = !liked;

    dispatch(toggleBlog(id));

    setCount((prev) => (optimisticLiked ? prev + 1 : prev - 1));

    try {
      await fetch(`/api/blogs/${id}/like`, {
        method: "POST",
      });
    } catch {
      dispatch(toggleBlog(id));
      setCount((prev) => (optimisticLiked ? prev - 1 : prev + 1));
    }
  };

  return (
    <motion.button
      onClick={handleLike}
      whileTap={{ scale: 0.9 }}
      className="group relative flex items-center gap-2 px-4 py-2 rounded-xl
      bg-white/5 backdrop-blur-md border border-white/10
      hover:border-[oklch(68.5%_0.169_237.323)]
      transition-all duration-300"
    >
      <div
        className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100
        blur-xl transition pointer-events-none"
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
