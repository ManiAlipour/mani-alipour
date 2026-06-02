"use client";

import { PolarArea } from "react-chartjs-2";
import {
  Chart as ChartJS,
  RadialLinearScale,
  ArcElement,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(RadialLinearScale, ArcElement, Tooltip, Legend);

export default function PolarAreaChart({
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
    <PolarArea
      data={data}
      options={options}
      className={`!w-full !h-full ${className}`}
    />
  );
}
