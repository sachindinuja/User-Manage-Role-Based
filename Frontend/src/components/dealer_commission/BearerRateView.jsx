import React from "react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";

const bearerRateData = [
  { serviceType: "Fiber", orderType: "New", compliance: "High", rate: 85.5, volume: 234 },
  { serviceType: "DSL", orderType: "Upgrade", compliance: "Medium", rate: 45.2, volume: 167 },
  { serviceType: "Wireless", orderType: "Migration", compliance: "High", rate: 92.8, volume: 198 },
  { serviceType: "Satellite", orderType: "New", compliance: "Low", rate: 38.4, volume: 89 }
];

function BearerRate() {
  return (
    <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
      {/* Bearer Rate Performance */}
      <div className="p-8 rounded-2xl shadow-2xl bg-black/50 border border-white/10 backdrop-blur-sm">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold text-white mb-2">Bearer Rate Performance</h2>
            <p className="text-white/60 text-sm">Service type performance metrics</p>
          </div>
        </div>
        
        <div className="bg-white/5 rounded-xl p-6 h-80">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={bearerRateData}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
              <XAxis dataKey="serviceType" stroke="#fff" fontSize={12} />
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
              <Line type="monotone" dataKey="rate" stroke="#3b82f6" strokeWidth={3} name="Rate" />
              <Line type="monotone" dataKey="volume" stroke="#10b981" strokeWidth={3} name="Volume" />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Service Details */}
      <div className="p-8 rounded-2xl shadow-2xl bg-black/50 border border-white/10 backdrop-blur-sm">
        <h2 className="text-xl font-bold text-white mb-6">Service Details</h2>
        
        <div className="space-y-4">
          {bearerRateData.map((service, index) => (
            <div key={index} className="p-4 bg-white/5 rounded-xl hover:bg-white/10 transition-colors duration-200">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-white font-semibold">{service.serviceType}</h3>
                <span className="text-blue-400 font-bold">LKR{service.rate}</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-white/60">{service.orderType}</span>
                <span className="text-green-400">{service.volume} orders</span>
              </div>
              <div className="mt-2">
                <div className={`inline-block px-2 py-1 rounded text-xs ${
                  service.compliance === 'High' ? 'bg-green-500/20 text-green-400' :
                  service.compliance === 'Medium' ? 'bg-yellow-500/20 text-yellow-400' :
                  'bg-red-500/20 text-red-400'
                }`}>
                  {service.compliance} Compliance
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default BearerRate;
