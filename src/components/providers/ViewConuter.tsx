"use client";
import { useEffect } from "react";
import { setView } from "@/utils/api/blog/set-view";

export default function ViewCounter({ blogId }: { blogId: string }) {
  useEffect(() => {
    setView(blogId);
  }, [blogId]);
  return null;
}
