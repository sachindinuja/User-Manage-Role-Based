import React, { useState } from "react";
import { BarChart } from "../chartComponents/BarChart";
import { DoughnutChart } from "../chartComponents/DoughnutChart";

function SlabPerformance({ data, filters }) {
  const filtered = data.filter(
    (item) =>
      (!filters.region || item.region === filters.region) &&
      (!filters.province || item.province === filters.province) &&
      (!filters.rtom || item.rtom === filters.rtom) &&
      (!filters.saleschannel || item.saleschannel === filters.saleschannel) &&
      (!filters.year || item.year === filters.year) &&
      (!filters.month || item.month === filters.month)
  );

  const data1 = {
    labels: filtered.map((item) => item.type),
    datasets: [
      {
        label: "Active Products",
        data: filtered.map((item) => item.active),
        backgroundColor: "rgba(59, 130, 246, 0.8)",
        borderColor: "rgba(59, 130, 246, 1)",
        borderWidth: 1,
      },
      {
        label: "Inactive Products",
        data: filtered.map((item) => item.inactive),
        backgroundColor: "rgba(239, 68, 68, 0.8)",
        borderColor: "rgba(239, 68, 68, 1)",
        borderWidth: 1,
      },
    ],
  };

  const connectionMap = {};
  filtered.forEach((item) => {
    if (!connectionMap[item.connectionType]) {
      connectionMap[item.connectionType] = 0;
    }
    connectionMap[item.connectionType] += 1;
  });

  const data2 = {
    labels: Object.keys(connectionMap),
    datasets: [
      {
        data: Object.values(connectionMap),
        backgroundColor: [
          "rgba(59, 130, 246, 0.8)",
          "rgba(239, 68, 68, 0.8)",
          "rgba(16, 185, 129, 0.8)",
          "rgba(251, 191, 36, 0.8)",
        ],
        borderColor: [
          "rgba(59, 130, 246, 1)",
          "rgba(239, 68, 68, 1)",
          "rgba(16, 185, 129, 1)",
          "rgba(251, 191, 36, 1)",
        ],
        borderWidth: 1,
      },
    ],
  };

  return (
    <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
      {/* Slab Levels Performance Chart */}
      <div className="xl:col-span-2 p-8 rounded-2xl shadow-2xl bg-black/50 border border-white/10 backdrop-blur-sm">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold text-white mb-2">
              Slab Level Performance
            </h2>
            <p className="text-white/60 text-sm">
              Revenue and order distribution across slab levels
            </p>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse" />
            <span className="text-white/60 text-sm">Live Data</span>
          </div>
        </div>
        <div className="bg-white/5 rounded-xl p-6">
          {/* call the bar chart */}
          <BarChart data={data1} />
        </div>
      </div>

      {/* Slab Rate Distribution */}
      <div className="p-8 rounded-2xl shadow-2xl bg-black/50 border border-white/10 backdrop-blur-sm">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-white">Rate Distribution</h2>
          <div className="px-3 py-1 bg-gradient-to-r from-green-500/20 to-blue-500/20 rounded-full">
            <span className="text-green-400 text-xs font-semibold">Active</span>
          </div>
        </div>
        <div className="bg-white/5 rounded-xl p-4 h-auto">
          <DoughnutChart data={data2} />
        </div>
      </div>
    </div>
  );
}

export default SlabPerformance;
