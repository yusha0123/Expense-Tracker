import { Chart as ReactChart, registerables } from "chart.js";
import moment from "moment";
import React from "react";
import { Line } from "react-chartjs-2";
ReactChart.register(...registerables);

const Chart = ({ data, type }) => {
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

  const chartData = {
    labels: labels,
    datasets: [
      {
        label: "Amount",
        data: amounts,
        fill: true,
        backgroundColor: "rgba(75,192,192,0.2)",
        borderColor: "rgba(75,192,192,1)",
        borderWidth: 2,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: true,
    plugins: {
      legend: {
        position: "bottom",
      },
      title: {
        display: true,
        text: "Visualize Your Expenses",
      },
      tooltip: {
        mode: "index",
        intersect: false,
      },
      hover: {
        mode: "index",
        intersect: false,
      },
    },
  };

  return <Line options={options} data={chartData} />;
};

export default Chart;
