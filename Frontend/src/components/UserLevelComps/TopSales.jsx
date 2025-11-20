import React from "react";
import {
  BarChart,
  Bar,
  Rectangle,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { barChartData } from "../../data/sales_incentive/chartData";
function TopSales() {
  return (
    <div>
      <BarChart
        width={850}
        height={400}
        data={barChartData}
        margin={{
          top: 5,
          right: 30,
          left: 20,
          bottom: 5,
        }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="name" />
        <YAxis />
        <Tooltip />
        <Legend />
        <Bar
          dataKey="Active"
          fill="#2074d8"
          activeBar={<Rectangle stroke="#2074d8" />}
        />
        <Bar
          dataKey="Inactive"
          fill="#dd172e"
          activeBar={<Rectangle stroke="#dd172e" />}
        />
      </BarChart>
    </div>
  );
}

export default TopSales;
