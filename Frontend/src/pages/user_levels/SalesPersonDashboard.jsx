import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import {
  DollarSign,
  BarChart2,
  Users,
  ChevronDown,
} from "lucide-react";

// Mock data
const commissionData = [
  { name: "January", value: 2 },
  { name: "April", value: 3 },
  { name: "May", value: 4 },
  { name: "June", value: 2.5 },
  { name: "December", value: 1.5 },
];

const salesCountData = [
  { name: "January", value: 30 },
  { name: "April", value: 40 },
  { name: "May", value: 50 },
  { name: "June", value: 35 },
  { name: "December", value: 25 },
];

const months = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
];

const years = Array.from({ length: 10 }, (_, i) => 2020 + i);

const Header = () => (
  <div className="flex items-center justify-between mb-8">
    <div>
      <span className="text-white text-3xl font-bold">Sales Person Dashboard</span>
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

const DropdownSelect = ({ value, options, onChange, className }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className={`relative ${className}`}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center justify-between w-full px-4 py-2 text-white bg-gray-700/50 border border-gray-600 rounded-lg hover:bg-gray-600/50 transition-colors"
      >
        <span>{value}</span>
        <ChevronDown className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>
      {isOpen && (
        <div className="absolute z-10 w-full mt-1 bg-gray-800 border border-gray-700 rounded-lg shadow-lg">
          {options.map((option) => (
            <button
              key={option}
              onClick={() => {
                onChange(option);
                setIsOpen(false);
              }}
              className="block w-full px-4 py-2 text-left text-white hover:bg-purple-600/50 transition-colors"
            >
              {option}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

const SalesPersonDashboard = () => {
  const [selectedMonth, setSelectedMonth] = useState("July");
  const [selectedYear, setSelectedYear] = useState("2025");
  const stats = [
    { title: "Total Commission", value: "2.5L", subtitle: "Total Commission", icon: DollarSign },
    { title: "Total Sales", value: "43+", subtitle: "Total Sales Count", icon: BarChart2 },
    { title: "Total Terminations", value: "10", subtitle: "Termination Count", icon: Users },
    { title: "PCR Eligible", value: "12+", subtitle: "PCR Eligible Count", icon: Users },
    { title: "Slab Eligible", value: "15+", subtitle: "Slab Eligible Count", icon: Users },
    { title: "Additional Amount", value: "50K", subtitle: "Total Additional Amount", icon: DollarSign },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-black p-6">
      <div className="max-w-7xl mx-auto">
        <Header />

        {/* Info Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8 text-white">
          <div className="bg-gray-800/60 p-4 rounded-2xl border border-gray-700">
            <p className="text-sm text-gray-400">SP Name</p>
            <p className="text-xl font-semibold">PS Silva</p>
          </div>
          <div className="bg-gray-800/60 p-4 rounded-2xl border border-gray-700">
            <p className="text-sm text-gray-400">Emp Name</p>
            <p className="text-xl font-semibold">SLT-225</p>
          </div>
          <div className="bg-gray-800/60 p-4 rounded-2xl border border-gray-700">
            <p className="text-sm text-gray-400">Salary Month</p>
            <DropdownSelect
              value={selectedMonth}
              options={months}
              onChange={setSelectedMonth}
              className="mt-2"
            />
          </div>
          <div className="bg-gray-800/60 p-4 rounded-2xl border border-gray-700">
            <p className="text-sm text-gray-400">Year</p>
            <DropdownSelect
              value={selectedYear}
              options={years}
              onChange={setSelectedYear}
              className="mt-2"
            />
          </div>
        </div>

        {/* Key Metrics */}
        <motion.div
          className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8"
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
          <ChartCard title="Commission (Laks)">
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={commissionData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis dataKey="name" stroke="#9CA3AF" />
                <YAxis stroke="#9CA3AF" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#1F2937',
                    border: '1px solid #374151',
                    borderRadius: '8px',
                    color: '#F9FAFB'
                  }}
                />
                <Bar dataKey="value" fill="#8B5CF6" />
              </BarChart>
            </ResponsiveContainer>
          </ChartCard>

          <ChartCard title="Sales Count">
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={salesCountData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis dataKey="name" stroke="#9CA3AF" />
                <YAxis stroke="#9CA3AF" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#1F2937',
                    border: '1px solid #374151',
                    borderRadius: '8px',
                    color: '#F9FAFB'
                  }}
                />
                <Bar dataKey="value" fill="#10B981" />
              </BarChart>
            </ResponsiveContainer>
          </ChartCard>
        </div>

        {/* Product Table */}
        <ChartCard title="Product Details">
          <div className="overflow-x-auto">
            <table className="w-full text-white border-collapse">
              <thead className="bg-gray-800 sticky top-0">
                <tr>
                  <th className="px-6 py-4 text-left text-lg font-semibold border-b border-gray-700">Frame</th>
                  <th className="px-6 py-4 text-left text-lg font-semibold border-b border-gray-700">Product Name</th>
                  <th className="px-6 py-4 text-left text-lg font-semibold border-b border-gray-700">Bearer Type</th>
                  <th className="px-6 py-4 text-left text-lg font-semibold border-b border-gray-700">Slab Eligible</th>
                  <th className="px-6 py-4 text-left text-lg font-semibold border-b border-gray-700">PCR Eligible</th>
                  <th className="px-6 py-4 text-left text-lg font-semibold border-b border-gray-700">PCR</th>
                </tr>
              </thead>
              <tbody>
                {[1, 2, 3, 4, 5].map((item, index) => (
                  <motion.tr
                    key={index}
                    className={`hover:bg-gray-700/50 transition-colors duration-200 ${index % 2 === 0 ? 'bg-gray-900' : 'bg-gray-800'}`}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                  >
                    <td className="px-6 py-4 text-lg"></td>
                    <td className="px-6 py-4 text-lg"></td>
                    <td className="px-6 py-4 text-lg"></td>
                    <td className="px-6 py-4 text-lg"></td>
                    <td className="px-6 py-4 text-lg"></td>
                    <td className="px-6 py-4 text-lg"></td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        </ChartCard>
      </div>
    </div>
  );
};

export default SalesPersonDashboard;