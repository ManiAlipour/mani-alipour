"use client";

import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend,
  Filler,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend,
  Filler,
);

export default function LineChart({
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
  if (
    !data?.datasets?.length ||
    !data.datasets.some((d: { data?: number[] }) => d.data?.length)
  ) {
    return <div className="mt-12 text-lg text-cyan-200">{emptyMessage}</div>;
  }
  return (
    <Line data={data} options={options} className={`!w-full !h-full ${className}`} />
  );
}
