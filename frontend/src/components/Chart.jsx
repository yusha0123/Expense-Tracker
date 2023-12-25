import ReactECharts from "echarts-for-react";
import moment from "moment";
import React, { useRef, useEffect } from "react";

const Chart = ({ data, type }) => {
  const chartRef = useRef(null);

  const formattedData = data.map((item) => {
    const { amount, ...rest } = item;
    return {
      ...rest,
      Amount: item.amount,
      createdAt: moment(item.createdAt).format(
        type === "monthly" ? "D MMMM" : "DD MMMM YYYY"
      ),
    };
  });

  const labels = formattedData.map((item) => item.createdAt);
  const amounts = formattedData.map((item) => item.Amount);

  const options = {
    grid: {
      left: "5%",
      top: "5%",
      bottom: "5%",
      right: "5%",
      containLabel: true,
    },
    xAxis: {
      type: "category",
      data: labels,
    },
    yAxis: {
      type: "value",
    },
    series: [
      {
        data: amounts,
        type: "line",
        smooth: true,
      },
    ],
    tooltip: {
      trigger: "axis",
    },
  };

  useEffect(() => {
    const chartInstance = chartRef.current.getEchartsInstance();
    if (chartInstance) {
      window.addEventListener("resize", () => {
        chartInstance.resize();
      });
    }

    return () => {
      window.removeEventListener("resize", () => {
        chartInstance.resize();
      });
    };
  }, []);

  return <ReactECharts ref={chartRef} option={options} />;
};

export default Chart;
