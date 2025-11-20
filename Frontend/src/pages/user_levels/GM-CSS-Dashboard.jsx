import React, { useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  CartesianGrid,
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
} from "recharts";
import { DollarSign, Users, Briefcase } from "lucide-react";

const COLORS = ["#8B5CF6", "#06B6D4", "#10B981", "#F59E0B", "#EF4444"];

const rtomOptions = ["RTOM 1", "RTOM 2", "RTOM 3"];
const dgmOptions = ["Metro", "Suburban", "Rural"];
const regionOptions = ["Metro", "R1", "R2", "R3"];

// Sample data for RTOM sub-areas per region
const regionCommissionDetails = {
  Metro: [
    { name: "Borella", commission: 5 },
    { name: "Maradana", commission: 7 },
    { name: "Kollupitiya", commission: 4 },
    { name: "Dematagoda", commission: 3.5 },
    { name: "Narahenpita", commission: 4.2 },
    { name: "Wellawatte", commission: 3.8 },
  ],
  R1: [
    { name: "Colombo 1", commission: 3 },
    { name: "Colombo 2", commission: 2.5 },
    { name: "Colombo 3", commission: 2.7 },
    { name: "Colombo 4", commission: 2.9 },
    { name: "Colombo 5", commission: 3.1 },
    { name: "Colombo 6", commission: 2.8 },
    { name: "Kotte", commission: 3.2 },
    { name: "Dehiwala", commission: 3.4 },
  ],
  R2: [
    { name: "Gampaha", commission: 4 },
    { name: "Negombo", commission: 3 },
    { name: "Katunayake", commission: 3.5 },
    { name: "Wattala", commission: 3.2 },
    { name: "Ja-Ela", commission: 3.1 },
    { name: "Mahara", commission: 3.3 },
    { name: "Minuwangoda", commission: 3.0 },
  ],
  R3: [
    { name: "Kandy", commission: 6 },
    { name: "Matale", commission: 3.5 },
    { name: "Nuwara Eliya", commission: 3.7 },
    { name: "Diyatalawa", commission: 3.0 },
    { name: "Ginigathhena", commission: 2.8 },
    { name: "Hatton", commission: 3.1 },
    { name: "Talawakele", commission: 2.9 },
  ],
};

const regionSalesDetails = {
  Metro: [
    { name: "Borella", sales: 350 },
    { name: "Maradana", sales: 420 },
    { name: "Kollupitiya", sales: 300 },
    { name: "Dematagoda", sales: 280 },
    { name: "Narahenpita", sales: 320 },
    { name: "Wellawatte", sales: 310 },
  ],
  R1: [
    { name: "Colombo 1", sales: 200 },
    { name: "Colombo 2", sales: 180 },
    { name: "Colombo 3", sales: 190 },
    { name: "Colombo 4", sales: 195 },
    { name: "Colombo 5", sales: 205 },
    { name: "Colombo 6", sales: 185 },
    { name: "Kotte", sales: 210 },
    { name: "Dehiwala", sales: 215 },
  ],
  R2: [
    { name: "Gampaha", sales: 220 },
    { name: "Negombo", sales: 190 },
    { name: "Katunayake", sales: 200 },
    { name: "Wattala", sales: 195 },
    { name: "Ja-Ela", sales: 185 },
    { name: "Mahara", sales: 180 },
    { name: "Minuwangoda", sales: 170 },
  ],
  R3: [
    { name: "Kandy", sales: 280 },
    { name: "Matale", sales: 210 },
    { name: "Nuwara Eliya", sales: 220 },
    { name: "Diyatalawa", sales: 190 },
    { name: "Ginigathhena", sales: 180 },
    { name: "Hatton", sales: 175 },
    { name: "Talawakele", sales: 165 },
  ],
};

const bearerTypeSales = {
  "RTOM 1": [
    { name: "FTTH", value: 240 },
    { name: "LTE", value: 180 },
    { name: "Copper", value: 90 },
  ],
  "RTOM 2": [
    { name: "FTTH", value: 160 },
    { name: "LTE", value: 140 },
    { name: "Copper", value: 80 },
  ],
  "RTOM 3": [
    { name: "FTTH", value: 120 },
    { name: "LTE", value: 130 },
    { name: "Copper", value: 60 },
  ],
};

const bearerWiseSales = [
  { type: "PEO BB", FTTH: 400, LTE: 300, Copper: 150 },
  { type: "SLT BB", FTTH: 250, LTE: 200, Copper: 100 },
];

const commissionByBearer = [
  { type: "PEO BB", FTTH: 3.5, LTE: 2.8, Copper: 1.2 },
  { type: "SLT BB", FTTH: 2.5, LTE: 2.0, Copper: 0.9 },
];

const allSalesPersons = [
  // RTOM 1 TopSalespersons
  {
    name: "John Doe",
    emp: "EMP001",
    RTOM: "RTOM 1",
    totalSales: 120,
    commission: 2.5,
  },
  {
    name: "Ahmed Khan",
    emp: "EMP003",
    RTOM: "RTOM 1",
    totalSales: 110,
    commission: 2.1,
  },
  {
    name: "Nimal Perera",
    emp: "EMP007",
    RTOM: "RTOM 1",
    totalSales: 100,
    commission: 1.8,
  },
  {
    name: "Michael Lee",
    emp: "EMP010",
    RTOM: "RTOM 1",
    totalSales: 92,
    commission: 1.65,
  },
  {
    name: "Dilshan Fernando",
    emp: "EMP011",
    RTOM: "RTOM 1",
    totalSales: 88,
    commission: 1.55,
  },
  {
    name: "Saman Jayasuriya",
    emp: "EMP012",
    RTOM: "RTOM 1",
    totalSales: 85,
    commission: 1.5,
  },
  {
    name: "Kamal Perera",
    emp: "EMP013",
    RTOM: "RTOM 1",
    totalSales: 83,
    commission: 1.45,
  },
  {
    name: "Ruwan Silva",
    emp: "EMP014",
    RTOM: "RTOM 1",
    totalSales: 80,
    commission: 1.4,
  },
  {
    name: "Lasith Malinga",
    emp: "EMP015",
    RTOM: "RTOM 1",
    totalSales: 78,
    commission: 1.35,
  },
  {
    name: "Upul Tharanga",
    emp: "EMP016",
    RTOM: "RTOM 1",
    totalSales: 75,
    commission: 1.3,
  },

  // RTOM 2 TopSalespersons
  {
    name: "Jane Smith",
    emp: "EMP002",
    RTOM: "RTOM 2",
    totalSales: 115,
    commission: 2.3,
  },
  {
    name: "Raj Patel",
    emp: "EMP005",
    RTOM: "RTOM 2",
    totalSales: 105,
    commission: 1.9,
  },
  {
    name: "Suresh Babu",
    emp: "EMP008",
    RTOM: "RTOM 2",
    totalSales: 98,
    commission: 1.75,
  },
  {
    name: "Kamala Devi",
    emp: "EMP017",
    RTOM: "RTOM 2",
    totalSales: 90,
    commission: 1.6,
  },
  {
    name: "Anil Fernando",
    emp: "EMP018",
    RTOM: "RTOM 2",
    totalSales: 88,
    commission: 1.55,
  },
  {
    name: "Chathura Silva",
    emp: "EMP019",
    RTOM: "RTOM 2",
    totalSales: 85,
    commission: 1.5,
  },
  {
    name: "Niroshan Perera",
    emp: "EMP020",
    RTOM: "RTOM 2",
    totalSales: 82,
    commission: 1.45,
  },
  {
    name: "Sunil Jayawardena",
    emp: "EMP021",
    RTOM: "RTOM 2",
    totalSales: 80,
    commission: 1.4,
  },
  {
    name: "Gayan Kumara",
    emp: "EMP022",
    RTOM: "RTOM 2",
    totalSales: 77,
    commission: 1.35,
  },
  {
    name: "Ranjith Silva",
    emp: "EMP023",
    RTOM: "RTOM 2",
    totalSales: 75,
    commission: 1.3,
  },

  // RTOM 3 TopSalespersons
  {
    name: "Lisa Wong",
    emp: "EMP004",
    RTOM: "RTOM 3",
    totalSales: 108,
    commission: 2.0,
  },
  {
    name: "Emily Davis",
    emp: "EMP006",
    RTOM: "RTOM 3",
    totalSales: 102,
    commission: 1.85,
  },
  {
    name: "Thilini Silva",
    emp: "EMP009",
    RTOM: "RTOM 3",
    totalSales: 95,
    commission: 1.7,
  },
  {
    name: "Nadeesha Fernando",
    emp: "EMP024",
    RTOM: "RTOM 3",
    totalSales: 90,
    commission: 1.6,
  },
  {
    name: "Samantha Perera",
    emp: "EMP025",
    RTOM: "RTOM 3",
    totalSales: 88,
    commission: 1.55,
  },
  {
    name: "Ruwantha Silva",
    emp: "EMP026",
    RTOM: "RTOM 3",
    totalSales: 85,
    commission: 1.5,
  },
  {
    name: "Manoj Jayasuriya",
    emp: "EMP027",
    RTOM: "RTOM 3",
    totalSales: 82,
    commission: 1.45,
  },
  {
    name: "Harsha Fernando",
    emp: "EMP028",
    RTOM: "RTOM 3",
    totalSales: 80,
    commission: 1.4,
  },
  {
    name: "Chamara Kumara",
    emp: "EMP029",
    RTOM: "RTOM 3",
    totalSales: 77,
    commission: 1.35,
  },
  {
    name: "Dinesh Perera",
    emp: "EMP030",
    RTOM: "RTOM 3",
    totalSales: 75,
    commission: 1.3,
  },
];

const dropdownClassName =
  "bg-white/5 rounded-lg px-4 py-2 text-sm text-gray-300 outline-none";

const GMCSSDashboard = () => {
  const [selectedRegion, setSelectedRegion] = useState("Metro");
  const [toggleView, setToggleView] = useState("sales");
  const [selectedRTOM, setSelectedRTOM] = useState("RTOM 1");
  const [selectedDGM, setSelectedDGM] = useState("Metro");

  const filteredSalesPersons = allSalesPersons.filter(
    (p) => p.RTOM === selectedRTOM
  );

  return (
    <div className="px-6 py-10 text-white bg-gradient-to-br from-gray-900 via-blue-900 to-black min-h-screen">
      <div className="max-w-7xl mx-auto">
        
        {/* Header Section */}
        <div className="flex items-center justify-between mb-10">
          <div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent mb-2">
              GM CSS Dashboard
            </h1>
            <p className="text-gray-400 text-sm">Regional Sales Insights</p>
          </div>
          <div className="flex gap-4 items-center">
            <select className={dropdownClassName}>
              <option>Module 1</option>
              <option>Module 2</option>
            </select>
            <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
              <span className="text-white font-semibold text-sm">GM</span>
            </div>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          <div className="bg-blue-900/50 border border-blue-600 p-6 rounded-2xl shadow-lg relative">
            <div className="absolute top-4 left-4 bg-purple-700 p-2 rounded-xl">
              <DollarSign className="text-white w-3 h-3" />
            </div>
            <p className="text-2xl font-bold text-white mt-6">$10M</p>
            <p className="text-blue-300 text-sm mt-1">Total Commission</p>
          </div>
          <div className="bg-blue-900/50 border border-blue-600 p-6 rounded-2xl shadow-lg relative">
            <div className="absolute top-4 left-4 bg-purple-700 p-2 rounded-xl">
              <Briefcase className="text-white w-3 h-3" />
            </div>
            <p className="text-2xl font-bold text-white mt-6">
              Maradana - 500+
            </p>
            <p className="text-blue-300 text-sm mt-1">Highest Sales RTOM</p>
          </div>
          <div className="bg-blue-900/50 border border-blue-600 p-6 rounded-2xl shadow-lg relative">
            <div className="absolute top-4 left-4 bg-purple-700 p-2 rounded-xl">
              <Users className="text-white w-3 h-3" />
            </div>
            <p className="text-2xl font-bold text-white mt-6">75</p>
            <p className="text-blue-300 text-sm mt-1">No. of Salespersons</p>
          </div>
        </div>

        {/* First Row: Region Dropdown + TWO Bar Charts side by side */}
        <div className="mb-4">
          <select
            value={selectedRegion}
            onChange={(e) => setSelectedRegion(e.target.value)}
            className={dropdownClassName}
          >
            {regionOptions.map((opt) => (
              <option key={opt} value={opt}>
                {opt}
              </option>
            ))}
          </select>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-10">
          {/* Commission Bar Chart */}
          <div className="bg-gray-800 p-4 rounded-xl border border-blue-700">
            <h3 className="text-blue-300 mb-2 font-semibold">
              Total Commissions of all RTOMs in {selectedRegion}
            </h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={regionCommissionDetails[selectedRegion]}>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                <XAxis dataKey="name" stroke="#CBD5E0" />
                <YAxis stroke="#CBD5E0" />
                <Tooltip />
                <Legend />
                <Bar dataKey="commission" fill="#8B5CF6" barSize={50} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Sales Count Bar Chart */}
          <div className="bg-gray-800 p-4 rounded-xl border border-blue-700">
            <h3 className="text-blue-300 mb-2 font-semibold">
              Total Sales Count of all RTOMs in {selectedRegion}
            </h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={regionSalesDetails[selectedRegion]}>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                <XAxis dataKey="name" stroke="#CBD5E0" />
                <YAxis stroke="#CBD5E0" />
                <Tooltip />
                <Legend />
                <Bar dataKey="sales" fill="#06B6D4" barSize={50} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

      {/* RTOM Selection Dropdown */}
<select
  value={selectedRTOM}
  onChange={(e) => setSelectedRTOM(e.target.value)}
  className={dropdownClassName}
>
  {rtomOptions.map((opt) => (
    <option key={opt} value={opt}>
      {opt}
    </option>
  ))}
</select>

{/* Second Row - Pie + Toggle Charts */}
<div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-10">
  <div className="bg-gray-800 p-4 rounded-xl border border-blue-700">
    <h3 className="text-blue-300 mb-2 font-semibold">
      Total Sales Count by Bearer Type - {selectedRTOM}
    </h3>
    <ResponsiveContainer width="100%" height={300}>
      <PieChart>
        <Pie
          data={bearerTypeSales[selectedRTOM]}
          dataKey="value"
          nameKey="name"
          cx="50%"
          cy="50%"
          innerRadius={60}
          outerRadius={100}
          label
        >
          {bearerTypeSales[selectedRTOM].map((entry, index) => (
            <Cell key={index} fill={COLORS[index % COLORS.length]} />
          ))}
        </Pie>
        <Tooltip />
      </PieChart>
    </ResponsiveContainer>
  </div>

          <div className="lg:col-span-2">
            <div className="flex justify-between mb-4">
              <div className="space-x-2">
                <select
                  value={selectedRTOM}
                  onChange={(e) => setSelectedRTOM(e.target.value)}
                  className={dropdownClassName}
                >
                  {rtomOptions.map((opt) => (
                    <option key={opt} value={opt}>
                      {opt}
                    </option>
                  ))}
                </select>
                <select
                  value={selectedDGM}
                  onChange={(e) => setSelectedDGM(e.target.value)}
                  className={dropdownClassName}
                >
                  {dgmOptions.map((opt) => (
                    <option key={opt} value={opt}>
                      {opt}
                    </option>
                  ))}
                </select>
              </div>
              <div className="space-x-2">
                <button
                  className={`px-4 py-2 rounded ${
                    toggleView === "sales" ? "bg-blue-600" : "bg-gray-700"
                  }`}
                  onClick={() => setToggleView("sales")}
                >
                  Sales Count
                </button>
                <button
                  className={`px-4 py-2 rounded ${
                    toggleView === "commission" ? "bg-blue-600" : "bg-gray-700"
                  }`}
                  onClick={() => setToggleView("commission")}
                >
                  Commission
                </button>
              </div>
            </div>
            <div className="bg-gray-800 p-4 rounded-xl border border-blue-700">
              <h3 className="text-blue-300 mb-2 font-semibold">
                {toggleView === "sales"
                  ? "Sales Count by Bearer Type"
                  : "Commission by Bearer Type"}
              </h3>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart
                  data={
                    toggleView === "sales"
                      ? bearerWiseSales
                      : commissionByBearer
                  }
                >
                  <XAxis dataKey="type" stroke="#CBD5E0" />
                  <YAxis stroke="#CBD5E0" />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="FTTH" fill="#8B5CF6" barSize={50} />
                  <Bar dataKey="LTE" fill="#06B6D4" barSize={50} />
                  <Bar dataKey="Copper" fill="#10B981" barSize={50} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Third Row - Top Salespersons Table with RTOM filter */}
        <div className="bg-gray-800 p-4 rounded-xl border border-blue-700">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-blue-300 font-semibold">
              Top 10 Sales Persons
            </h3>

            <select
              value={selectedRTOM}
              onChange={(e) => setSelectedRTOM(e.target.value)}
              className={dropdownClassName}
            >
              {rtomOptions.map((opt) => (
                <option key={opt} value={opt}>
                  {opt}
                </option>
              ))}
            </select>
          </div>
          <div className="overflow-auto">
            <table className="w-full text-sm text-left text-blue-100">
              <thead>
                <tr className="text-xs uppercase text-blue-300 border-b border-blue-700">
                  <th className="py-2 px-4">Name</th>
                  <th className="py-2 px-4">Emp No</th>
                  <th className="py-2 px-4">RTOM</th>
                  <th className="py-2 px-4">Total Sales</th>
                  <th className="py-2 px-4">Total Commission</th>
                </tr>
              </thead>
              <tbody>
                {filteredSalesPersons.map((p, index) => (
                  <tr key={index} className="border-b border-blue-800">
                    <td className="py-2 px-4">{p.name}</td>
                    <td className="py-2 px-4">{p.emp}</td>
                    <td className="py-2 px-4">{p.RTOM}</td>
                    <td className="py-2 px-4">{p.totalSales}</td>
                    <td className="py-2 px-4">{p.commission} L</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
        {/* Footer */}
        <div className="pt-8 border-t border-gray-700/50">
          <div className="flex items-center justify-between text-gray-500 text-sm">
            <p>© 2025 FinanceCore. All rights reserved.</p>
            <p>
              Last updated: {new Date().toLocaleDateString()} • Real-time data
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GMCSSDashboard;
