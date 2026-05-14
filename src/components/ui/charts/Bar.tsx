// --- قابل استفاده‌ی مجدد: کامپوننت BarChart ---

import { Bar } from "react-chartjs-2";

/**
 * @param data Full data object according to chart.js
 * @param options Chart.js Bar options
 * @param className (optional) extra classnames
 * @param emptyMessage (optional) message to show if data not present
 */
export default function BarChart({
  data,
  options,
  className = "",
  emptyMessage = "داده‌ای یافت نشد.",
}: {
  data: any;
  options?: any;
  className?: string;
  emptyMessage?: string;
}) {
  if (!data || !data.labels || !data.labels.length)
    return <div className="text-cyan-200 mt-12 text-lg">{emptyMessage}</div>;
  return (
    <Bar
      data={data}
      options={options}
      className={`max-h-80 w-full ${className}`}
    />
  );
}
