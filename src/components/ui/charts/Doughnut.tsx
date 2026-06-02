import { Doughnut } from "react-chartjs-2";

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Tooltip,
  Legend,
  Title,
  ArcElement,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  ArcElement,
  Tooltip,
  Legend,
  Title,
);
/**
 * @param data Full data object according to chart.js
 * @param options Chart.js Doughnut options
 * @param className (optional) extra classnames
 * @param emptyMessage (optional) message to show if data not present
 */
export default function DoughnutChart({
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
    !data ||
    !data.datasets ||
    !data.datasets[0] ||
    !data.datasets[0].data?.length
  )
    return <div className="mt-12 text-lg text-cyan-200">{emptyMessage}</div>;
  return (
    <Doughnut
      data={data}
      options={options}
      className={`!w-full !h-full ${className}`}
    />
  );
}
