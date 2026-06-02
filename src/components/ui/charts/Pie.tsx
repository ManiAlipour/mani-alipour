"use client";

import { Pie } from "react-chartjs-2";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(ArcElement, Tooltip, Legend);

export default function PieChart({
  data,
  options,
  className = "",
  emptyMessage = "داده‌ای برای نمایش وجود ندارد.",
}: {
  data: any;
  options?: any;
  className?: string;
  emptyMessage?: string;
}) {
  if (!data?.datasets?.[0]?.data?.length) {
    return <div className="mt-12 text-lg text-cyan-200">{emptyMessage}</div>;
  }
  return (
    <Pie
      data={data}
      options={options}
      className={`!w-full !h-full ${className}`}
    />
  );
}
