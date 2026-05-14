import { Doughnut } from "react-chartjs-2";

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
    return <div className="text-cyan-200 mt-12 text-lg">{emptyMessage}</div>;
  return (
    <Doughnut
      data={data}
      options={options}
      className={`max-w-[280px] w-full ${className}`}
    />
  );
}
