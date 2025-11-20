import React from "react";
import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";
export function ProgressChart() {
  const data = [
    {
      name: "Completed",
      value: 70,
      color: "#ffcd25",
    },
    {
      name: "Remaining",
      value: 30,
      color: "#E5E7EB",
    },
  ];
  return (
    <div className="flex flex-col items-center">
      <div className="w-1/3">
        <ResponsiveContainer width="100%" height={200}>
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              startAngle={90}
              endAngle={-270}
              innerRadius={60}
              outerRadius={80}
              paddingAngle={0}
              dataKey="value"
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
          </PieChart>
        </ResponsiveContainer>
      </div>
      <div className="w-2/3 pl-6 text-center">
        <h4 className="text-lg font-medium text-gray-200">
          Commission Completion Status
        </h4>
        <p className="text-gray-400 mt-2">
          You have completed 70% of your total commission target for this
          period. Continue your excellent performance to reach your full target.
        </p>
        <div className="mt-4 flex space-x-4 justify-center">
          <div className="flex items-center">
            <div className="w-3 h-3 rounded-full bg-[#ffcd25] mr-2"></div>
            <span className="text-sm text-gray-600">Completed: 70%</span>
          </div>
          <div className="flex items-center">
            <div className="w-3 h-3 rounded-full bg-gray-300 mr-2"></div>
            <span className="text-sm text-gray-600">Remaining: 30%</span>
          </div>
        </div>
      </div>
    </div>
  );
}
