"use client";

import { Radar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend,
);

export default function RadarChart({
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
    <Radar data={data} options={options} className={`!w-full !h-full ${className}`} />
  );
}
