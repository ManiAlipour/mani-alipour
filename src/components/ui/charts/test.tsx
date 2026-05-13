"use client";

import ReactECharts from "echarts-for-react";

export default function Chart() {
  const option = {
    xAxis: {
      type: "category",
      data: ["Jan", "Feb", "Mar"],
    },
    yAxis: {
      type: "value",
    },
    series: [
      {
        data: [120, 200, 150],
        type: "line",
        smooth: true,
      },
    ],
  };

  return <ReactECharts option={option} style={{ height: 350 }} />;
}
