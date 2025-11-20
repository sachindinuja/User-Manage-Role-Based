import React from "react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";

const packageRatesData = [
  { package: "Basic Plan", tariffId: "TF001", compliance: "High", baseRate: 150, slabRate: 125, activeDeals: 89 },
  { package: "Premium Plan", tariffId: "TF002", compliance: "Medium", baseRate: 280, slabRate: 220, activeDeals: 156 },
  { package: "Enterprise Plan", tariffId: "TF003", compliance: "High", baseRate: 450, slabRate: 380, activeDeals: 203 },
  { package: "Custom Plan", tariffId: "TF004", compliance: "Low", baseRate: 320, slabRate: 280, activeDeals: 76 }
];

const blacklistedPackages = [
  { packageName: "Legacy Basic", tariffId: "TF005", reason: "Discontinued", blockedDate: "2024-11-15" },
  { packageName: "Trial Premium", tariffId: "TF006", reason: "Compliance Issues", blockedDate: "2024-12-01" },
  { packageName: "Beta Enterprise", tariffId: "TF007", reason: "Under Review", blockedDate: "2024-12-10" }
];

function PackageAnalysis() {
  return (
    <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
      {/* Package Performance Chart */}
      <div className="xl:col-span-2 p-8 rounded-2xl shadow-2xl bg-black/50 border border-white/10 backdrop-blur-sm">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold text-white mb-2">Package Rate Analysis</h2>
            <p className="text-white/60 text-sm">Base rates vs slab rates comparison</p>
          </div>
        </div>
        
        <div className="bg-white/5 rounded-xl p-6 h-96">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={packageRatesData}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
              <XAxis dataKey="package" stroke="#fff" fontSize={12} />
              <YAxis stroke="#fff" fontSize={12} />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: 'rgba(0,0,0,0.8)', 
                  border: '1px solid rgba(255,255,255,0.2)',
                  borderRadius: '12px',
                  color: '#fff'
                }} 
              />
              <Legend />
              <Bar dataKey="baseRate" fill="#f59e0b" name="Base Rate" radius={[4, 4, 0, 0]} />
              <Bar dataKey="slabRate" fill="#3b82f6" name="Slab Rate" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Package Details */}
      <div className="p-8 rounded-2xl shadow-2xl bg-black/50 border border-white/10 backdrop-blur-sm">
        <h2 className="text-xl font-bold text-white mb-6">Package Details</h2>
        
        <div className="space-y-4">
          {packageRatesData.map((pkg, index) => (
            <div key={index} className="p-4 bg-white/5 rounded-xl hover:bg-white/10 transition-colors duration-200">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-white font-semibold text-sm">{pkg.package}</h3>
                <span className={`px-2 py-1 rounded text-xs font-medium ${
                  pkg.compliance === 'High' ? 'bg-green-500/20 text-green-400' :
                  pkg.compliance === 'Medium' ? 'bg-yellow-500/20 text-yellow-400' :
                  'bg-red-500/20 text-red-400'
                }`}>
                  {pkg.compliance}
                </span>
              </div>
              <div className="space-y-1 text-xs text-white/60">
                <p>Tariff: {pkg.tariffId}</p>
                <p>Active Deals: {pkg.activeDeals}</p>
                <p>Rate Diff: LKR{pkg.baseRate - pkg.slabRate}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Blacklisted Packages Alert */}
        <div className="mt-6 p-4 bg-red-500/10 border border-red-500/20 rounded-xl">
          <h3 className="text-red-400 font-semibold text-sm mb-2">⚠️ Blacklisted Packages</h3>
          <div className="space-y-2 text-xs">
            {blacklistedPackages.map((pkg, index) => (
              <div key={index} className="text-white/60">
                <span className="text-red-400">{pkg.packageName}</span> - {pkg.reason}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default PackageAnalysis;
