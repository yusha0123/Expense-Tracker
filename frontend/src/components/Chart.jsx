import moment from "moment";
import React from "react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

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

  return (
    <ResponsiveContainer width="100%" height={300}>
      <AreaChart
        width={500}
        height={300}
        data={formattedData}
        margin={{
          top: 5,
          right: 30,
          left: 20,
          bottom: 5,
        }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="createdAt" />
        <YAxis dataKey="Amount" />
        <Tooltip />
        <Legend />
        <Area
          type="monotone"
          dataKey="Amount"
          stroke="#8884d8"
          activeDot={{ r: 8 }}
        />
      </AreaChart>
    </ResponsiveContainer>
  );
};

export default Chart;
