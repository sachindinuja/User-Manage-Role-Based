// This is DGM Metro/R1/R2/R3 Dashboard

import React, { useState } from "react";
import { motion } from "framer-motion";
import { BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { ChevronDown, ToggleLeft, DollarSign, BarChart2, Users } from "lucide-react";

// Mock data for Metro region
const metroBranches = ["Maradana", "Boralla", "Kollupitiya", "RTOM"];
const commissionData = [
  { name: "Maradana", value: 2.0 },
  { name: "Boralla", value: 3.0 },
  { name: "Kollupitiya", value: 1.5 },
  
];
const salesCountData = [
  { name: "Maradana", value: 40 },
  { name: "Boralla", value: 50 },
  { name: "Kollupitiya", value: 30 },
  
];
const branchSalesData = {
  Maradana: [ { name: "Copper", value: 45 }, { name: "LTE", value: 1200 }, { name: "FTTH", value: 150 } ],
  Boralla: [ { name: "Copper", value: 50 }, { name: "LTE", value: 1100 }, { name: "FTTH", value: 200 } ],
  Kollupitiya: [ { name: "Copper", value: 40 }, { name: "LTE", value: 1300 }, { name: "FTTH", value: 180 } ],
  RTOM: [ { name: "Copper", value: 45 }, { name: "LTE", value: 1200 }, { name: "FTTH", value: 1570 } ],
};
const bearerData = {
  Commission: [
    { name: "FTTH", PEO: 300, Voice: 200, BB: 400, Coupon: 200 },
    { name: "LTE", PEO: 300, Voice: 200, BB: 400, Coupon: 200 },
    { name: "Copper", PEO: 100, Voice: 80, BB: 120, Coupon: 80 },
  ],
  SalesCount: [
    { name: "FTTH", PEO: 300, Voice: 200, BB: 400, Coupon: 200 },
    { name: "LTE", PEO: 800, Voice: 600, BB: 900, Coupon: 500 },
    { name: "Copper", PEO: 120, Voice: 80, BB: 150, Coupon: 100 },
  ],
};
const employeeData = [
  { name: "John Doe", empNum: "E123", rtom: "Maradana", totalSales: { FTTH: 50, LTE: 400, Copper: 15 }, totalCommission: { FTTH: 5, LTE: 40, Copper: 1.5 } },
  { name: "Jane Smith", empNum: "E124", rtom: "Boralla", totalSales: { FTTH: 60, LTE: 350, Copper: 20 }, totalCommission: { FTTH: 6, LTE: 35, Copper: 2 } },
  { name: "Bob Johnson", empNum: "E125", rtom: "Kollupitiya", totalSales: { FTTH: 70, LTE: 300, Copper: 25 }, totalCommission: { FTTH: 7, LTE: 30, Copper: 2.5 } },
  { name: "Alice Brown", empNum: "E126", rtom: "RTOM", totalSales: { FTTH: 80, LTE: 450, Copper: 30 }, totalCommission: { FTTH: 8, LTE: 45, Copper: 3 } },
  { name: "Charlie Davis", empNum: "E127", rtom: "Maradana", totalSales: { FTTH: 55, LTE: 380, Copper: 18 }, totalCommission: { FTTH: 5.5, LTE: 38, Copper: 1.8 } },
];

const COLORS = ['#FFB6C1', '#10B981', '#8B5CF6', '#06B6D4'];

const Header = () => (
  <div className="flex items-center justify-between mb-8">
    <div>
      <span className="text-white text-3xl font-bold">DGM Metro/R1/R2/R3 Dashboard</span>
    </div>
    <div className="flex items-center space-x-4">
      <select className="bg-gray-800/50 text-gray-300 rounded-lg px-3 py-2 transition-all duration-300 hover:bg-gray-700">
        <option>2025</option>
        <option>2024</option>
      </select>
      <select className="bg-gray-800/50 text-gray-300 rounded-lg px-3 py-2 transition-all duration-300 hover:bg-gray-700">
        <option>Sales Incentive</option>
        <option>Dealer</option>
        <option>Manager Incentive</option>
        <option>Micro Business Module</option>
        <option>BFRD Module</option>
      </select>
    </div>
  </div>
);

const StatCard = ({ title, value, subtitle, icon: Icon }) => (
  <motion.div
    className="bg-gradient-to-br from-gray-800 to-gray-900 backdrop-blur-xl border border-gray-700/50 rounded-2xl p-6 hover:shadow-lg hover:shadow-purple-500/20 transition-all duration-300 flex-1 h-32 flex flex-col justify-between"
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.3 }}
    whileHover={{ scale: 1.05 }}
  >
    <div className="flex items-center space-x-2">
      <Icon className="text-purple-400 w-6 h-6" />
      <p className="text-gray-400 text-sm">{title}</p>
    </div>
    <p className="text-white text-4xl font-bold">{value}</p>
    <p className="text-gray-500 text-sm">{subtitle}</p>
  </motion.div>
);

const ChartCard = ({ title, children }) => (
  <motion.div
    className="bg-gray-900/50 backdrop-blur-xl border border-gray-700/50 rounded-2xl p-6 hover:bg-gray-800/50 transition-all duration-300"
    initial={{ opacity: 0, scale: 0.9 }}
    animate={{ opacity: 1, scale: 1 }}
    transition={{ duration: 0.5 }}
  >
    <h3 className="text-white text-xl font-bold mb-4">{title}</h3>
    {children}
  </motion.div>
);

function DGMMetroDashboard() {
  const [selectedBranch, setSelectedBranch] = useState("RTOM");
  const [selectedRTOMBranch, setSelectedRTOMBranch] = useState("RTOM");
  const [showCommission, setShowCommission] = useState(true);
  const [showDonutCommission, setShowDonutCommission] = useState(true);

  const stats = [
    { title: "Total Commission", value: "5M", subtitle: "Total Commission", icon: DollarSign },
    { title: "Highest Sales RTOM", value: "250+", subtitle: "Highest Sales RTOM", icon: BarChart2 },
    { title: "No of Active Sales Persons", value: "175+", subtitle: "Active Sales Persons", icon: Users },
  ];



  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-black p-6">
      <div className="max-w-7xl mx-auto">
        <Header />

        {/* Key Metrics */}
        <motion.div
          className="flex gap-8 mb-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3, staggerChildren: 0.1 }}
        >
          {stats.map((stat, index) => (
            <StatCard key={index} {...stat} />
          ))}
        </motion.div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          <ChartCard title="Total Commission of all RTOMs assigned">
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={commissionData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis dataKey="name" stroke="#9CA3AF" />
                <YAxis stroke="#9CA3AF" />
                <Tooltip />
                <Bar dataKey="value" fill="#8B5CF6" />
              </BarChart>
            </ResponsiveContainer>
          </ChartCard>

          <ChartCard title="Total Sales of all RTOMs assigned">
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={salesCountData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis dataKey="name" stroke="#9CA3AF" />
                <YAxis stroke="#9CA3AF" />
                <Tooltip />
                <Bar dataKey="value" fill="#10B981" />
              </BarChart>
            </ResponsiveContainer>
          </ChartCard>
        </div>

        {/* Middle Section: Donut Chart and Toggleable Chart */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          <div>
            <div className="flex items-center justify-between mb-4">
              <select
                className="bg-gray-800/50 text-gray-300 rounded-lg px-3 py-2 transition-all duration-300 hover:bg-gray-700"
                value={selectedBranch}
                onChange={(e) => setSelectedBranch(e.target.value)}
              >
                {metroBranches.map(branch => (
                  <option key={branch}>{branch}</option>
                ))}
              </select>
             
            </div>
            <ChartCard title="Total Sales by Bearer Type">
              <ResponsiveContainer width="100%" height={350}>
                <PieChart>
                  <Pie
                    data={branchSalesData[selectedBranch]}
                    cx="50%"
                    cy="50%"
                    innerRadius={80}
                    outerRadius={120}
                    dataKey="value"
                    label={({ name, value }) => `${name}: ${value}`}
                  >
                    {branchSalesData[selectedBranch].map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </ChartCard>
          </div>
          <div>
            <div className="flex items-center justify-between mb-4">
              <select
                className="bg-gray-800/50 text-gray-300 rounded-lg px-3 py-2 transition-all duration-300 hover:bg-gray-700"
                value={selectedRTOMBranch}
                onChange={(e) => setSelectedRTOMBranch(e.target.value)}
              >
                {metroBranches.map(branch => (
                  <option key={branch}>{branch}</option>
                ))}
              </select>
              <button
                className="bg-gray-800/50 text-gray-300 rounded-lg px-4 py-2 flex items-center transition-all duration-300 hover:bg-gray-700"
                onClick={() => setShowCommission(!showCommission)}
              >
                <ToggleLeft className="w-4 h-4 mr-2" />
                {showCommission ? "Commission" : "Sales Count"}
              </button>
            </div>
            <ChartCard title={showCommission ? "Total Commission by Bearer Type and its service type" : "Total Sales by Bearer Type and its service type"}>
              <ResponsiveContainer width="100%" height={350}>
                <BarChart
                  data={bearerData[showCommission ? "Commission" : "SalesCount"]}
                  margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                  <XAxis dataKey="name" stroke="#9CA3AF" />
                  <YAxis stroke="#9CA3AF" />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="PEO" fill="#FFB6C1" name="PEO" />
                  <Bar dataKey="Voice" fill="#10B981" name="Voice" />
                  <Bar dataKey="BB" fill="#8B5CF6" name="BB" />
                  <Bar dataKey="Coupon" fill="#06B6D4" name="Coupon" />
                </BarChart>
              </ResponsiveContainer>
            </ChartCard>
          </div>
        </div>

        {/* Employee Table */}
        <ChartCard title="Summary Table">
          <div className="overflow-x-auto">
            <table className="w-full text-white border-collapse">
              <thead className="bg-gray-800 sticky top-0">
                <tr>
                  <th className="px-6 py-4 text-left text-lg font-semibold border-b border-gray-700">Name</th>
                  <th className="px-6 py-4 text-left text-lg font-semibold border-b border-gray-700">Emp Num</th>
                  <th className="px-6 py-4 text-left text-lg font-semibold border-b border-gray-700">RTOM</th>
                  <th colSpan="3" className="px-6 py-4 text-center text-lg font-semibold border-b border-gray-700">Total Sales</th>
                  <th colSpan="3" className="px-6 py-4 text-center text-lg font-semibold border-b border-gray-700">Total Commission</th>
                </tr>
                <tr>
                  <th className="px-6 py-2 border-b border-gray-700"></th>
                  <th className="px-6 py-2 border-b border-gray-700"></th>
                  <th className="px-6 py-2 border-b border-gray-700"></th>
                  <th className="px-6 py-2 text-center border-b border-gray-700">FTTH</th>
                  <th className="px-6 py-2 text-center border-b border-gray-700">LTE</th>
                  <th className="px-6 py-2 text-center border-b border-gray-700">Copper</th>
                  <th className="px-6 py-2 text-center border-b border-gray-700">FTTH</th>
                  <th className="px-6 py-2 text-center border-b border-gray-700">LTE</th>
                  <th className="px-6 py-2 text-center border-b border-gray-700">Copper</th>
                </tr>
              </thead>
              <tbody>
                {employeeData.map((employee, index) => (
                  <motion.tr
                    key={index}
                    className={`hover:bg-gray-700/50 transition-colors duration-200 ${index % 2 === 0 ? 'bg-gray-900' : 'bg-gray-800'}`}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                  >
                    <td className="px-6 py-4 text-lg">{employee.name}</td>
                    <td className="px-6 py-4 text-lg">{employee.empNum}</td>
                    <td className="px-6 py-4 text-lg">{employee.rtom}</td>
                    <td className="px-6 py-4 text-center text-lg">{employee.totalSales.FTTH}</td>
                    <td className="px-6 py-4 text-center text-lg">{employee.totalSales.LTE}</td>
                    <td className="px-6 py-4 text-center text-lg">{employee.totalSales.Copper}</td>
                    <td className="px-6 py-4 text-center text-lg">{employee.totalCommission.FTTH}</td>
                    <td className="px-6 py-4 text-center text-lg">{employee.totalCommission.LTE}</td>
                    <td className="px-6 py-4 text-center text-lg">{employee.totalCommission.Copper}</td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        </ChartCard>
      </div>
    </div>
  );
}

export default DGMMetroDashboard;


