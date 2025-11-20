import React from "react";

const statisticsData = [
  { topic: "TOTAL REVENUE", count: "LKR2.4M", subTopic: "This Month", increment: "+12.5%", color: "#3b82f6" },
  { topic: "ACTIVE DEALERS", count: "147", subTopic: "Commission Eligible", increment: "+8.2%", color: "#10b981" },
  { topic: "PACKAGES", count: "28", subTopic: "Active Packages", increment: "+3.1%", color: "#f59e0b" },
  { topic: "COMMISSIONS", count: "LKR345K", subTopic: "Paid This Month", increment: "+15.8%", color: "#ef4444" }
];

function StatisticsCards() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
      {statisticsData.map((stats) => (
        <div
          className="group relative overflow-hidden p-6 shadow-2xl bg-black/30 rounded-2xl border border-white/10 hover:border-white/20 transition-all duration-300 hover:shadow-3xl hover:scale-105"
          key={stats.topic}
        >
          <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          <div className="relative z-10">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-sm font-semibold text-white/90 uppercase tracking-wide">{stats.topic}</h2>
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-xl blur-sm" />
                <div className="relative w-12 h-12 rounded-xl backdrop-blur-sm flex items-center justify-center" style={{ backgroundColor: `${stats.color}20` }}>
                  <div className="w-6 h-6 rounded-full" style={{ backgroundColor: stats.color }} />
                </div>
              </div>
            </div>
            <div className="space-y-3">
              <p className="text-4xl font-bold text-white tracking-tight">{stats.count}</p>
              <h3 className="text-white/60 text-sm font-medium">{stats.subTopic}</h3>
              <div className="flex items-center space-x-2">
                <span className="text-xl font-semibold text-green-400">{stats.increment}</span>
                <span className="text-white/80 text-sm">vs last period</span>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

export default StatisticsCards;