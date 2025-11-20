/* CboGmDashboard_stub.jsx — design-only, no axios -------------------------------- */
import React, { useState } from "react";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend,
  ResponsiveContainer, PieChart, Pie, Cell,
} from "recharts";
import { Users, DollarSign, Star, Briefcase } from "lucide-react";

/* ---------- helpers ---------- */
const COLORS = ["#8B5CF6","#06B6D4","#10B981","#F59E0B","#EF4444"];
const StatCard = ({ title,value,icon:Icon }) => (
  <div className="bg-gray-800 p-4 rounded-xl text-white shadow flex items-center space-x-4">
    <Icon className="w-6 h-6 text-purple-400" />
    <div><p className="text-sm text-gray-400">{title}</p><p className="text-xl font-bold">{value}</p></div>
  </div>
);
const Select = ({ label,value,onChange,children }) => (
  <label className="flex flex-col text-sm text-gray-300 space-y-1">
    {label}
    <select className="bg-gray-800 border border-gray-700 rounded p-2 text-gray-200"
            value={value} onChange={e=>onChange(e.target.value)}>
      {children}
    </select>
  </label>
);

/* ---------- hard-coded demo data ---------- */
const KPI = { commission:"$ 3 200 000", sales:"$ 8 450 000", active:"2 143", topRtom:"RTOM-Metro" };
const COMM_REGION = [
  { region:"Metro",  commission:950000 },
  { region:"South",  commission:620000 },
  { region:"Central",commission:480000 },
  { region:"North",  commission:390000 },
  { region:"West",   commission:260000 },
];
const PIE = [ {name:"FTTH",count:1200},{name:"Copper",count:950},{name:"LTE",count:780} ];
const GROUPED = [
  { bearer:"FTTH",   voice:350, bb:620, coupon:180 },
  { bearer:"Copper", voice:420, bb:310, coupon:220 },
  { bearer:"LTE",    voice:210, bb:390, coupon: 85 },
];
const TOGGLE_SALES = [
  { bearer:"FTTH",   sales:845000 },
  { bearer:"Copper", sales:620000 },
  { bearer:"LTE",    sales:430000 },
];
const TOGGLE_COMM = [
  { bearer:"FTTH",   commission:245000 },
  { bearer:"Copper", commission:160000 },
  { bearer:"LTE",    commission: 95000 },
];

/* ---------- component ---------- */
export default function Gmcbsdashboard() {
  const [module,setModule]           = useState("incentive");
  const [yearMonth,setYearMonth]     = useState("2025-06");
  const [commissionMonth,setComMth]  = useState("2025-06");
  const [pieRegion,setPieRegion]     = useState("All");
  const [gm,setGm]   = useState("All");
  const [dgm,setDgm] = useState("All");
  const [rtom,setRtom]= useState("All");
  const [view,setView]= useState("sales");            // sales | commission

  const toggleData = view==="sales" ? TOGGLE_SALES : TOGGLE_COMM;

  return (
    <div className="min-h-screen bg-gray-900 text-white p-6">
      <div className="max-w-7xl mx-auto space-y-8">
        <h1 className="text-3xl font-bold text-purple-400">Sales Incentive Dashboard</h1>

        {/* filters */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
          <Select label="Module" value={module} onChange={setModule}>
            <option value="incentive">Incentive</option>
            <option value="dealer">Dealer</option>
            <option value="finance">Finance</option>
            <option value="manager">Manager</option>
          </Select>
          <label className="flex flex-col text-sm text-gray-300 space-y-1">
            Year & Month
            <input type="month" value={yearMonth}
              onChange={e=>setYearMonth(e.target.value)}
              className="bg-gray-800 border border-gray-700 rounded p-2 text-gray-200"/>
          </label>
          <label className="flex flex-col text-sm text-gray-300 space-y-1">
            Commission Paid Month
            <input type="month" value={commissionMonth}
              onChange={e=>setComMth(e.target.value)}
              className="bg-gray-800 border border-gray-700 rounded p-2 text-gray-200"/>
          </label>
        </div>

        {/* KPI cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <StatCard title="Total Commission"     value={KPI.commission} icon={DollarSign}/>
          <StatCard title="Total Sales"          value={KPI.sales}      icon={Briefcase}/>
          <StatCard title="Active Sales Persons" value={KPI.active}     icon={Users}/>
          <StatCard title="Highest Sales RTOM"   value={KPI.topRtom}    icon={Star}/>
        </div>

        {/* ---- 4 charts, 2 per row ---- */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* bar 1 */}
          <div className="bg-gray-800 p-4 rounded-xl">
            <h2 className="text-xl mb-2">Commission by Region</h2>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={COMM_REGION}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151"/>
                <XAxis dataKey="region" stroke="#9CA3AF"/><YAxis stroke="#9CA3AF"/>
                <Tooltip/><Bar dataKey="commission" fill="#8B5CF6"/>
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* pie */}
          <div className="bg-gray-800 p-4 rounded-xl">
            <div className="flex justify-between items-center mb-2">
              <h2 className="text-xl">Sales Count by Bearer</h2>
              <select className="bg-gray-700 border border-gray-600 rounded p-1 text-sm"
                      value={pieRegion} onChange={e=>setPieRegion(e.target.value)}>
                <option>All</option><option>Metro</option><option>South</option><option>Central</option>
              </select>
            </div>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie data={PIE} cx="50%" cy="50%" innerRadius={60} outerRadius={100}
                     dataKey="count" label={({name,count})=>`${name}: ${count}`}>
                  {PIE.map((e,i)=><Cell key={i} fill={COLORS[i%COLORS.length]}/>)}
                </Pie>
                <Tooltip/>
              </PieChart>
            </ResponsiveContainer>
          </div>

          {/* grouped bar */}
          <div className="bg-gray-800 p-4 rounded-xl">
            <h2 className="text-xl mb-2">Sales Count by Product &amp; Bearer</h2>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={GROUPED}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151"/>
                <XAxis dataKey="bearer" stroke="#9CA3AF"/><YAxis stroke="#9CA3AF"/>
                <Tooltip/><Legend/>
                {Object.keys(GROUPED[0]).filter(k=>k!=="bearer").map((k,i)=>(
                  <Bar key={k} dataKey={k} fill={COLORS[i%COLORS.length]}/>
                ))}
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* toggle bar */}
          <div className="bg-gray-800 p-4 rounded-xl space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex space-x-3">
                <button onClick={()=>setView("sales")}
                        className={`px-4 py-2 rounded ${view==="sales"?"bg-blue-600":"bg-gray-700"}`}>Sales Count</button>
                <button onClick={()=>setView("commission")}
                        className={`px-4 py-2 rounded ${view==="commission"?"bg-blue-600":"bg-gray-700"}`}>Commission</button>
              </div>
              <div className="flex space-x-2">
                <Select label="GM" value={gm} onChange={setGm}><option>All</option></Select>
                <Select label="DGM" value={dgm} onChange={setDgm}><option>All</option></Select>
                <Select label="RTOM" value={rtom} onChange={setRtom}><option>All</option></Select>
              </div>
            </div>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={toggleData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151"/>
                <XAxis dataKey="bearer" stroke="#9CA3AF"/><YAxis stroke="#9CA3AF"/>
                <Tooltip/>
                <Bar dataKey={view==="sales"?"sales":"commission"}
                     fill={view==="sales"?"#06B6D4":"#F59E0B"}/>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}
