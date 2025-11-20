import React from "react";
import SpotLightCard from "../common/SpotLightCard";
import CountUp from "../common/CountUp";
// import { formatNumber } from "../../utils/utils";

function StatCard({ statisticsData, filteredData }) {
  console.log("STATS CARD DATA: ", filteredData);
  return (
    <div className="grid grid-cols-4 w-full gap-4">
      {statisticsData.map((stats, index) => {
        const Icon = stats.icon;
        // Calculate required values only once
        const totalEligiblePcr = filteredData.reduce(
          (sum, item) => sum + Number(item.eligible_pcr || 0),
          0
        );
        const totalPcr = filteredData.reduce(
          (sum, item) => sum + Number(item.total_pcr || 0),
          0
        );
        const totalActiveSales = filteredData.reduce(
          (sum, item) => sum + Number(item.active_sales || 0),
          0
        );
        const totalSalesPersons = filteredData.length;

        if (stats.topic === "Total Commission") {
          stats.count = totalEligiblePcr;
        } else if (stats.topic === "Total Sales Persons") {
          stats.count = totalSalesPersons;
        } else if (stats.topic === "Total PCR") {
          stats.count = totalPcr;
        } else if (stats.topic === "Total Eligible PCR") {
          stats.count = totalEligiblePcr;
        } else if (stats.topic === "Total Active Sales") {
          stats.count = totalActiveSales;
        }
        return (
          <SpotLightCard
            className="text-white shadow-2xl"
            spotlightColor="#79E0EE"
            key={index}
          >
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-white">
                {stats.topic}
              </h2>
              <Icon
                color={stats.color}
                size={50}
                className={`p-2 bg-white/10 rounded-md`}
              />
            </div>
            <p className="text-6xl font-bold text-white">
              <CountUp
                from={0}
                to={stats.count}
                separator=","
                direction="up"
                duration={1}
                className="count-up-text"
              />
            </p>
            <h3 className="text-white/50">{stats.subTopic}</h3>
            <p className="text-white">
              <span className="text-2xl font-semibold text-green-500">
                {stats.increment}
              </span>{" "}
              vs last period
            </p>
          </SpotLightCard>
        );
      })}
    </div>
  );
}

export default StatCard;
