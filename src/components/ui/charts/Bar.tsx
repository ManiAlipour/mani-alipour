import { Bar } from "react-chartjs-2";

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip, Legend);

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
    return <div className="mt-12 text-lg text-cyan-200">{emptyMessage}</div>;
  return (
    <Bar
      data={data}
      options={options}
      className={`max-h-80 w-full ${className}`}
    />
  );
}
