import React, { useState } from "react";
import { 
  Eye, Users, Package, Layers, TrendingUp, ArrowUpRight, 
  DollarSign, BarChart3, PieChart, Activity, Calendar,
  Target, Briefcase, TrendingDown
} from "lucide-react";
import { 
  LineChart, Line, AreaChart, Area, BarChart, Bar, PieChart as RechartsPieChart, 
  Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer 
} from "recharts";

// Mock data for charts
const revenueData = [
  { month: 'Jan', revenue: 45000, profit: 12000, expenses: 33000 },
  { month: 'Feb', revenue: 52000, profit: 15000, expenses: 37000 },
  { month: 'Mar', revenue: 48000, profit: 13500, expenses: 34500 },
  { month: 'Apr', revenue: 61000, profit: 18000, expenses: 43000 },
  { month: 'May', revenue: 55000, profit: 16500, expenses: 38500 },
  { month: 'Jun', revenue: 67000, profit: 22000, expenses: 45000 },
];

const departmentBudget = [
  { name: 'Sales', value: 35, amount: 350000 },
  { name: 'Marketing', value: 25, amount: 250000 },
  { name: 'Operations', value: 20, amount: 200000 },
  { name: 'R&D', value: 15, amount: 150000 },
  { name: 'HR', value: 5, amount: 50000 },
];

const performanceMetrics = [
  { metric: 'Q1', target: 85, actual: 92, previous: 78 },
  { metric: 'Q2', target: 88, actual: 86, previous: 82 },
  { metric: 'Q3', target: 90, actual: 94, previous: 85 },
  { metric: 'Q4', target: 92, actual: 89, previous: 88 },
];

const COLORS = ['#8B5CF6', '#06B6D4', '#10B981', '#F59E0B', '#EF4444'];

const Header = () => (
  <div className="flex items-center justify-between mb-8">
    <div className="flex items-center space-x-4">
      
      <div>
        <span className="text-white text-2xl font-bold">FinanceCore</span>
        <p className="text-gray-400 text-sm">Executive Dashboard</p>
      </div>
    </div>
    <div className="flex items-center space-x-6">
      <div className="flex items-center space-x-2 bg-white/5 rounded-lg px-4 py-2">
        <Calendar className="w-4 h-4 text-gray-400" />
        <span className="text-gray-300 text-sm">Jun 2025</span>
      </div>
      <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
        <span className="text-white font-semibold text-sm">CFO</span>
      </div>
    </div>
  </div>
);

const StatCard = ({ title, value, increment, icon: Icon, trend, subtitle }) => (
  <div className="relative group">
    <div className="absolute inset-0 bg-gradient-to-r from-purple-600/20 to-blue-600/20 rounded-2xl blur-xl opacity-50 group-hover:opacity-75 transition-all duration-300"></div>
    <div className="relative bg-gray-900/50 backdrop-blur-xl border border-gray-700/50 rounded-2xl p-6 hover:bg-gray-800/50 transition-all duration-300 hover:scale-105 hover:shadow-2xl">
      <div className="flex items-center justify-between mb-4">
        <div className="p-3 bg-gradient-to-r from-purple-600/20 to-blue-600/20 rounded-xl">
          <Icon className="w-6 h-6 text-purple-400" />
        </div>
        <div className={`flex items-center space-x-1 px-2 py-1 rounded-full text-xs font-medium ${
          trend === 'up' ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'
        }`}>
          {trend === 'up' ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
          <span>{increment}%</span>
        </div>
      </div>
      <div className="mb-2">
        <p className="text-white text-3xl font-bold mb-1">{value}</p>
        <p className="text-gray-400 text-sm">{subtitle}</p>
      </div>
    </div>
  </div>
);

const ChartCard = ({ title, children, fullWidth = false }) => (
  <div className={`bg-gray-900/50 backdrop-blur-xl border border-gray-700/50 rounded-2xl p-6 hover:bg-gray-800/50 transition-all duration-300 ${fullWidth ? 'col-span-full' : ''}`}>
    <h3 className="text-white text-xl font-bold mb-6 flex items-center space-x-2">
      <BarChart3 className="w-5 h-5 text-purple-400" />
      <span>{title}</span>
    </h3>
    {children}
  </div>
);

const ModuleCard = ({ title, description, icon: Icon, stats }) => (
  <div className="group relative">
    <div className="absolute inset-0 bg-gradient-to-r from-purple-600/20 to-blue-600/20 rounded-2xl blur-xl opacity-0 group-hover:opacity-75 transition-all duration-300"></div>
    <div className="relative bg-gray-900/50 backdrop-blur-xl border border-gray-700/50 rounded-2xl p-6 hover:bg-gray-800/50 transition-all duration-300 hover:scale-105">
      <div className="flex items-center justify-between mb-6">
        <div className="p-3 bg-gradient-to-r from-purple-600/20 to-blue-600/20 rounded-xl">
          <Icon className="w-8 h-8 text-purple-400" />
        </div>
        <ArrowUpRight className="w-5 h-5 text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity" />
      </div>
      <h3 className="text-white text-xl font-bold mb-3">{title}</h3>
      <p className="text-gray-400 text-sm mb-4 leading-relaxed">{description}</p>
      
      {stats && (
        <div className="grid grid-cols-2 gap-4 mb-6">
          {stats.map((stat, index) => (
            <div key={index} className="text-center">
              <p className="text-purple-400 text-lg font-bold">{stat.value}</p>
              <p className="text-gray-500 text-xs">{stat.label}</p>
            </div>
          ))}
        </div>
      )}
      
      <button className="w-full bg-gradient-to-r from-purple-600/20 to-blue-600/20 hover:from-purple-600/30 hover:to-blue-600/30 border border-purple-500/30 rounded-xl px-6 py-3 text-white font-medium transition-all duration-300 flex items-center justify-center space-x-2">
        <Eye className="w-4 h-4" />
        <span>View Analytics</span>
      </button>
    </div>
  </div>
);

function CfoDashboard() {
  const [selectedPeriod, setSelectedPeriod] = useState('6M');

  const stats = [
    {
      title: "Total Revenue",
      value: "$2.4M",
      increment: "12.5",
      trend: "up",
      subtitle: "Monthly recurring revenue",
      icon: DollarSign
    },
    {
      title: "Active Users",
      value: "200K",
      increment: "8.2",
      trend: "up",
      subtitle: "Registered customers",
      icon: Users
    },
    {
      title: "Profit Margin",
      value: "34.2%",
      increment: "2.1",
      trend: "up",
      subtitle: "Net profit margin",
      icon: TrendingUp
    },
    {
      title: "Expenses",
      value: "$1.6M",
      increment: "5.8",
      trend: "down",
      subtitle: "Operating expenses",
      icon: Briefcase
    }
  ];

  const modules = [
    {
      title: "Sales Analytics",
      description: "Real-time sales performance tracking with advanced forecasting and territory analysis.",
      icon: TrendingUp,
      stats: [
        { value: "$847K", label: "This Month" },
        { value: "23%", label: "Growth" }
      ]
    },
    {
      title: "Financial Reports",
      description: "Comprehensive financial reporting with P&L statements, balance sheets, and cash flow analysis.",
      icon: BarChart3,
      stats: [
        { value: "98.2%", label: "Accuracy" },
        { value: "12", label: "Reports" }
      ]
    },
    {
      title: "Budget Planning",
      description: "Strategic budget allocation and variance analysis across all departments and projects.",
      icon: Target,
      stats: [
        { value: "$5.2M", label: "Allocated" },
        { value: "15%", label: "Variance" }
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-black p-6">
      <div className="max-w-7xl mx-auto">
        <Header />
        
        {/* Page Title with Period Selector */}
        <div className="flex items-center justify-between mb-12">
          <div>
            <h1 className="text-5xl font-bold text-white mb-4 bg-gradient-to-r from-white via-purple-200 to-blue-200 bg-clip-text text-transparent">
              CFO Dashboard
            </h1>
            <p className="text-gray-400 text-lg">
              Financial insights and business intelligence
            </p>
          </div>
          <div className="flex items-center space-x-2 bg-gray-800/50 rounded-xl p-1">
            {['1M', '3M', '6M', '1Y'].map((period) => (
              <button
                key={period}
                onClick={() => setSelectedPeriod(period)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  selectedPeriod === period
                    ? 'bg-purple-600 text-white shadow-lg'
                    : 'text-gray-400 hover:text-white hover:bg-gray-700/50'
                }`}
              >
                {period}
              </button>
            ))}
          </div>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {stats.map((stat, index) => (
            <StatCard key={index} {...stat} />
          ))}
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
          {/* Revenue Trend */}
          <ChartCard title="Revenue & Profit Trend">
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={revenueData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis dataKey="month" stroke="#9CA3AF" />
                <YAxis stroke="#9CA3AF" />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#1F2937', 
                    border: '1px solid #374151',
                    borderRadius: '8px',
                    color: '#F9FAFB'
                  }} 
                />
                <Legend />
                <Area type="monotone" dataKey="revenue" stackId="1" stroke="#8B5CF6" fill="#8B5CF6" fillOpacity={0.6} />
                <Area type="monotone" dataKey="profit" stackId="2" stroke="#10B981" fill="#10B981" fillOpacity={0.6} />
              </AreaChart>
            </ResponsiveContainer>
          </ChartCard>

          {/* Department Budget */}
          <ChartCard title="Budget Distribution">
            <ResponsiveContainer width="100%" height={300}>
              <RechartsPieChart>
                <Pie
                  data={departmentBudget}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={120}
                  dataKey="value"
                  label={({ name, value }) => `${name}: ${value}%`}
                >
                  {departmentBudget.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#1F2937', 
                    border: '1px solid #374151',
                    borderRadius: '8px',
                    color: '#F9FAFB'
                  }} 
                />
              </RechartsPieChart>
            </ResponsiveContainer>
          </ChartCard>
        </div>

        {/* Performance Metrics */}
        <div className="mb-12">
          <ChartCard title="Quarterly Performance vs Targets" fullWidth>
            <ResponsiveContainer width="100%" height={400}>
              <BarChart data={performanceMetrics} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis dataKey="metric" stroke="#9CA3AF" />
                <YAxis stroke="#9CA3AF" />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#1F2937', 
                    border: '1px solid #374151',
                    borderRadius: '8px',
                    color: '#F9FAFB'
                  }} 
                />
                <Legend />
                <Bar dataKey="target" fill="#6B7280" name="Target" />
                <Bar dataKey="actual" fill="#8B5CF6" name="Actual" />
                <Bar dataKey="previous" fill="#06B6D4" name="Previous Period" />
              </BarChart>
            </ResponsiveContainer>
          </ChartCard>
        </div>

        {/* Module Access Section */}
        <div className="mb-8">
          <div className="flex items-center space-x-4 mb-8">
            <h2 className="text-3xl font-bold text-white">Analytics Modules</h2>
            <div className="flex-1 h-px bg-gradient-to-r from-purple-500/50 to-transparent"></div>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {modules.map((module, index) => (
              <ModuleCard key={index} {...module} />
            ))}
          </div>
        </div>

        {/* Quick Insights */}
        <div className="bg-gradient-to-r from-purple-900/50 to-blue-900/50 backdrop-blur-xl border border-purple-500/30 rounded-2xl p-8 mb-8">
          <h3 className="text-white text-2xl font-bold mb-6 flex items-center space-x-2">
            <Activity className="w-6 h-6 text-purple-400" />
            <span>Key Insights</span>
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="text-green-400 text-2xl font-bold mb-2">Revenue Growth</div>
              <p className="text-gray-300 text-sm">12.5% increase in monthly recurring revenue driven by new customer acquisitions</p>
            </div>
            <div className="text-center">
              <div className="text-blue-400 text-2xl font-bold mb-2">Cost Optimization</div>
              <p className="text-gray-300 text-sm">Reduced operational expenses by 5.8% through process automation and efficiency improvements</p>
            </div>
            <div className="text-center">
              <div className="text-purple-400 text-2xl font-bold mb-2">Profit Margin</div>
              <p className="text-gray-300 text-sm">Maintained healthy profit margins at 34.2% while scaling operations</p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="pt-8 border-t border-gray-700/50">
          <div className="flex items-center justify-between text-gray-500 text-sm">
            <p>© 2025 FinanceCore. All rights reserved.</p>
            <p>Last updated: {new Date().toLocaleDateString()} • Real-time data</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CfoDashboard;