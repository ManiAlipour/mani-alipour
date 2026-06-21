"use client";

import { useEffect, useState } from "react";

export default function BlogViews({ blogId }: { blogId: string }) {
  const [views, setViews] = useState<number | null>(null);

  useEffect(() => {
    fetch(`/api/blogs/${blogId}/views`, { cache: "no-store" })
      .then((res) => res.json())
      .then((data) => setViews(data.views ?? 0));
  }, [blogId]);

  return <span>{views ?? "—"} بازدید</span>;
}
