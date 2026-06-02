"use client";

type ChartContainerSize = "line" | "bar" | "barWide" | "circular" | "radar" | "compact";

const sizeMap: Record<ChartContainerSize, string> = {
  line: "w-full max-w-4xl mx-auto h-[300px] md:h-[320px]",
  bar: "w-full h-[260px] md:h-[280px]",
  barWide: "w-full max-w-5xl mx-auto h-[280px] md:h-[300px]",
  circular: "w-[220px] h-[220px] sm:w-[240px] sm:h-[240px] mx-auto shrink-0",
  radar: "w-[260px] h-[260px] sm:w-[280px] sm:h-[280px] mx-auto shrink-0",
  compact: "w-full max-w-md mx-auto h-[140px] md:h-[160px]",
};

/** Fixed-size wrapper so Chart.js does not stretch on wide desktop columns */
export default function ChartContainer({
  children,
  size = "bar",
  className = "",
}: {
  children: React.ReactNode;
  size?: ChartContainerSize;
  className?: string;
}) {
  return (
    <div
      className={`relative ${sizeMap[size]} ${className}`}
    >
      <div className="absolute inset-0">{children}</div>
    </div>
  );
}

export const chartLayoutOptions = {
  responsive: true,
  maintainAspectRatio: false,
} as const;
