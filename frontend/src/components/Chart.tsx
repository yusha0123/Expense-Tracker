import ReactECharts from "echarts-for-react";
import moment from "moment";
import { useEffect, useRef } from "react";

type ReportData = {
  _id: string;
  amount: number;
  category: string;
  createdAt: Date;
  description: string;
};

const Chart = ({
  data,
  type,
}: {
  type: "weekly" | "monthly" | "yearly";
  data: ReportData[];
}) => {
  const chartRef = useRef<ReactECharts>(null);

  const formattedData = data?.map((item) => {
    const { amount, ...rest } = item;
    return {
      ...rest,
      Amount: amount,
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
    const chartInstance = chartRef.current?.getEchartsInstance();

    const handleResize = () => {
      chartInstance?.resize();
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return <ReactECharts ref={chartRef} option={options} />;
};

export default Chart;
