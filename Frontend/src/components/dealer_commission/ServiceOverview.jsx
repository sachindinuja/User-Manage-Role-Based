import React from "react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";

/*const soTypesData = [
  { product: "Internet", serviceType: "Fiber", orderType: "New Connection", count: 445, revenue: 156780 },
  { product: "TV", serviceType: "Cable", orderType: "Upgrade", count: 289, revenue: 98450 },
  { product: "Phone", serviceType: "VoIP", orderType: "Migration", count: 167, revenue: 45680 },
  { product: "Bundle", serviceType: "Mixed", orderType: "New Connection", count: 203, revenue: 189320 }
]; */



function ServiceOverview({ data, filters }) {

   const filtered = data.filter((item) =>
  (!filters.region || item.region === filters.region) &&
  (!filters.province || item.province === filters.province) &&
  (!filters.rtom || item.rtom === filters.rtom) &&
  (!filters.saleschannel || item.saleschannel === filters.saleschannel) &&
  (!filters.year || item.year === filters.year) &&
  (!filters.month || item.month === filters.month)
  );

  const data3 = filtered.map((item) => ({
  product: item.product,
  count: item.count,
  revenue: item.revenue
  }));

  return (
    <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
      {/* SO Types Chart */}
      <div className="xl:col-span-2 p-8 rounded-2xl shadow-2xl bg-black/50 border border-white/10 backdrop-blur-sm">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold text-white mb-2">Service Order Types</h2>
            <p className="text-white/60 text-sm">Product-wise order distribution and revenue</p>
          </div>
        </div>
        
        <div className="bg-white/5 rounded-xl p-6 h-96">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data3}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
              <XAxis dataKey="product" stroke="#fff" fontSize={12} />
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
              <Bar dataKey="count" fill="#8b5cf6" name="Order Count" radius={[4, 4, 0, 0]} />
              <Bar dataKey="revenue" fill="#06b6d4" name="Revenue (LKR)" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Quick Metrics */}
      <div className="p-8 rounded-2xl shadow-2xl bg-black/50 border border-white/10 backdrop-blur-sm">
        <h2 className="text-xl font-bold text-white mb-6">Quick Metrics</h2>
        
        <div className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div className="text-center p-4 bg-white/5 rounded-lg">
              <p className="text-3xl font-bold text-blue-400">1,104</p>
              <p className="text-white/60 text-sm">Total Orders</p>
            </div>
            <div className="text-center p-4 bg-white/5 rounded-lg">
              <p className="text-3xl font-bold text-green-400">592,230</p>
              <p className="text-white/60 text-sm">Total Revenue (LKR)</p>
            </div>
          </div>

          <div className="text-white/70 text-sm space-y-1">
            <p>Average order value: LKR 535</p>
            <p>Highest revenue product: Bundle</p>
            <p>Active service types: 4</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ServiceOverview;
