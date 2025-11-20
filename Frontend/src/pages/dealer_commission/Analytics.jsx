import React, { useState, useMemo } from 'react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  LineChart, Line, PieChart, Pie, Cell
} from 'recharts';
import {
  DollarSign, Users, Activity, TrendingUp, Map, Package, Award, 
  Search, RotateCcw, Star
} from 'lucide-react';

const DealerCommissionDashboard = () => {
  // Filter state
  const [filters, setFilters] = useState({
    year: 'All',
    month: 'All',
    region: 'All',
    rtom: 'All',
    salesChannel: 'All',
    search: ''
  });

  // Active tab state
  const [activeTab, setActiveTab] = useState('Sales Performance');

  // Sample data
  const salesData = [
    { id: 1, sellerName: 'Talentfort', region: 'Metro', rtom: 'KON', salesChannel: 'Talentfort', year: '2024', month: 'January', revenue: 245000, commission: 12250, sales: 45, ftthSales: 20 },
    { id: 2, sellerName: 'Jane Smith', region: 'Central', rtom: 'RTOM 2', salesChannel: 'Dealer Channel', year: '2024', month: 'February', revenue: 180000, commission: 9000, sales: 35, ftthSales: 15 },
    { id: 3, sellerName: 'Mike Johnson', region: 'Western', rtom: 'RTOM 1', salesChannel: 'Direct Sales', year: '2023', month: 'December', revenue: 320000, commission: 16000, sales: 60, ftthSales: 25 },
    { id: 4, sellerName: 'Sarah Wilson', region: 'Southern', rtom: 'RTOM 3', salesChannel: 'Dealer Channel', year: '2024', month: 'March', revenue: 210000, commission: 10500, sales: 42, ftthSales: 18 },
    { id: 5, sellerName: 'David Brown', region: 'Central', rtom: 'RTOM 2', salesChannel: 'Direct Sales', year: '2024', month: 'January', revenue: 165000, commission: 8250, sales: 30, ftthSales: 12 }
  ];

  const stageData = {
    stage1: [
      { bearerType: 'FTTH', sales: 3, tx: 1, active: 2, pcr: 2000 },
      { bearerType: 'IPTV', sales: 8, tx: 1, active: 7, pcr: 7000 },
      { bearerType: 'LTE', sales: 12, tx: 1, active: 11, pcr: 11000 },
      { bearerType: 'ADSL', sales: 2, tx: 0, active: 2, pcr: 2000 }
    ],
    stage2: [
      { bearerType: 'FTTH', sales: 5, tx: 1, active: 4, pcr: 4000 },
      { bearerType: 'IPTV', sales: 6, tx: 0, active: 6, pcr: 6000 },
      { bearerType: 'LTE', sales: 4, tx: 1, active: 3, pcr: 3000 },
      { bearerType: 'ADSL', sales: 3, tx: 0, active: 3, pcr: 3000 }
    ]
  };

  const yearlyChartData = [
    { name: 'FTTH', sltInternal: 120, dealer: 80 },
    { name: 'LTE', sltInternal: 90, dealer: 110 },
    { name: 'IPTV', sltInternal: 70, dealer: 60 }
  ];

  const monthlyChartData = [
    { name: 'FTTH', sltInternal: 25, dealer: 20 },
    { name: 'LTE', sltInternal: 18, dealer: 22 },
    { name: 'IPTV', sltInternal: 15, dealer: 12 }
  ];

  const lineChartData1 = [
    { name: 'FTTH', internOrders: 45, dealerOrders: 40 },
    { name: 'LTE', internOrders: 40, dealerOrders: 44 },
    { name: 'IPTV', internOrders: 27, dealerOrders: 32 }
  ];

  const lineChartData2 = [
    { name: 'FTTH', internRevenue: 200, dealerRevenue: 160 },
    { name: 'LTE', internRevenue: 180, dealerRevenue: 176 },
    { name: 'IPTV', internRevenue: 135, dealerRevenue: 128 }
  ];

  const pieData1 = [
    { name: 'Direct Sales', value: 65, color: '#3B82F6' },
    { name: 'Dealer Channel', value: 35, color: '#10B981' }
  ];

  const pieData2 = [
    { name: 'Direct Sales', value: 45, color: '#3B82F6' },
    { name: 'Dealer Channel', value: 55, color: '#10B981' }
  ];

  const pieData3 = [
    { name: 'Direct Sales', value: 580, color: '#8B5CF6' },
    { name: 'Dealer Channel', value: 420, color: '#06B6D4' }
  ];

  const pieData4 = [
    { name: 'Direct Sales', value: 360, color: '#8B5CF6' },
    { name: 'Dealer Channel', value: 440, color: '#06B6D4' }
  ];

  const channelBarData1 = [
    { name: 'Direct Sales', internOrders: 65, dealerOrders: 45 },
    { name: 'Dealer Channel', internOrders: 35, dealerOrders: 55 }
  ];

  const channelBarData2 = [
    { name: 'Direct Sales', internRevenue: 580, dealerRevenue: 360 },
    { name: 'Dealer Channel', internRevenue: 420, dealerRevenue: 440 }
  ];

  // Filter data
  const filteredData = useMemo(() => {
    return salesData.filter(item => {
      const matchesYear = filters.year === 'All' || item.year === filters.year;
      const matchesMonth = filters.month === 'All' || item.month === filters.month;
      const matchesRegion = filters.region === 'All' || item.region === filters.region;
      const matchesRtom = filters.rtom === 'All' || item.rtom === filters.rtom;
      const matchesSalesChannel = filters.salesChannel === 'All' || item.salesChannel === filters.salesChannel;
      const matchesSearch = filters.search === '' || 
        item.sellerName.toLowerCase().includes(filters.search.toLowerCase()) ||
        item.region.toLowerCase().includes(filters.search.toLowerCase()) ||
        item.rtom.toLowerCase().includes(filters.search.toLowerCase());
      
      return matchesYear && matchesMonth && matchesRegion && matchesRtom && matchesSalesChannel && matchesSearch;
    });
  }, [filters]);

  // Calculate statistics
  const stats = useMemo(() => {
    const totalRevenue = filteredData.reduce((sum, item) => sum + item.revenue, 0);
    const totalCommissions = filteredData.reduce((sum, item) => sum + item.commission, 0);
    const totalSales = filteredData.reduce((sum, item) => sum + item.sales, 0);
    const ftthSales = filteredData.reduce((sum, item) => sum + item.ftthSales, 0);
    const uniqueRegions = new Set(filteredData.map(item => item.region)).size;
    const uniqueSellers = new Set(filteredData.map(item => item.sellerName)).size;
    const avgCommissionRate = totalRevenue > 0 ? (totalCommissions / totalRevenue) * 100 : 0;
    
    return {
      totalRevenue: Math.round(totalRevenue / 1000),
      totalCommissions: Math.round(totalCommissions / 1000),
      totalSales,
      ftthSales,
      uniqueRegions,
      uniqueSellers,
      avgCommissionRate: avgCommissionRate.toFixed(1)
    };
  }, [filteredData]);

  // Top performers
  const topPerformers = useMemo(() => {
    return [...filteredData]
      .sort((a, b) => b.sales - a.sales)
      .slice(0, 5)
      .map((item, index) => ({
        ...item,
        rank: index + 1,
        progress: (item.sales / 50) * 100
      }));
  }, [filteredData]);

  // Calculate stage totals
  const stage1Total = stageData.stage1.reduce((acc, item) => ({
    sales: acc.sales + item.sales,
    tx: acc.tx + item.tx,
    active: acc.active + item.active,
    pcr: acc.pcr + item.pcr
  }), { sales: 0, tx: 0, active: 0, pcr: 0 });

  const stage2Total = stageData.stage2.reduce((acc, item) => ({
    sales: acc.sales + item.sales,
    tx: acc.tx + item.tx,
    active: acc.active + item.active,
    pcr: acc.pcr + item.pcr
  }), { sales: 0, tx: 0, active: 0, pcr: 0 });

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const resetFilters = () => {
    setFilters({
      year: 'All',
      month: 'All',
      region: 'All',
      rtom: 'All',
      salesChannel: 'All',
      search: ''
    });
  };

  const getRankIcon = (rank) => {
    switch(rank) {
      case 1: return <Award className="w-5 h-5 text-yellow-500" />;
      case 2: return <Award className="w-5 h-5 text-gray-400" />;
      case 3: return <Award className="w-5 h-5 text-orange-600" />;
      default: return <Star className="w-5 h-5 text-blue-400" />;
    }
  };

  const getRankBg = (rank) => {
    switch(rank) {
      case 1: return 'bg-gradient-to-r from-yellow-400 to-yellow-600';
      case 2: return 'bg-gradient-to-r from-gray-300 to-gray-500';
      case 3: return 'bg-gradient-to-r from-orange-400 to-orange-600';
      default: return 'bg-gradient-to-r from-blue-400 to-blue-600';
    }
  };

  return (
    <div className="flex-h-screen">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="text-center">
          <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent mb-2">
            Dealer Commission Analytics
          </h1>
          <p className="text-gray-300 text-lg">Comprehensive comparison and performance insights</p>
        </div>

        {/* Filters */}
        <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-lg p-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4 mb-4">
            {/* <select 
              value={filters.year} 
              onChange={(e) => handleFilterChange('year', e.target.value)}
              className="bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-white"
            >
              <option value="All">Years</option>
              <option value="2023">2023</option>
              <option value="2024">2024</option>
              <option value="2025">2025</option>
            </select> */}

            <select 
              value={filters.month} 
              onChange={(e) => handleFilterChange('month', e.target.value)}
              className="bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-white"
            >
              <option value="All">Salary Months</option>
              <option value="January">2025 January</option>
              <option value="February">2025 February</option>
              <option value="March">2025 March</option>
              <option value="December">2025 December</option>
            </select>

            <select 
              value={filters.region} 
              onChange={(e) => handleFilterChange('region', e.target.value)}
              className="bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-white"
            >
              <option value="All">All Regions</option>
              <option value="Western">Western</option>
              <option value="Central">Central</option>
              <option value="Southern">Southern</option>
            </select>

            <select 
              value={filters.rtom} 
              onChange={(e) => handleFilterChange('rtom', e.target.value)}
              className="bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-white"
            >
              <option value="All">All RTOMs</option>
              <option value="RTOM 1">RTOM 1</option>
              <option value="RTOM 2">RTOM 2</option>
              <option value="RTOM 3">RTOM 3</option>
            </select>

            <select 
              value={filters.salesChannel} 
              onChange={(e) => handleFilterChange('salesChannel', e.target.value)}
              className="bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-white"
            >
              <option value="All">All Channels</option>
              <option value="Direct Sales">Direct Sales</option>
              <option value="Dealer Channel">Dealer Channel</option>
            </select>

            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search by dealer"
                value={filters.search}
                onChange={(e) => handleFilterChange('search', e.target.value)}
                className="w-full bg-white/10 border border-white/20 rounded-lg pl-10 pr-3 py-2 text-white placeholder-gray-400"
              />
            </div>
          </div>
          
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
            <button 
              onClick={resetFilters}
              className="bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-all duration-200 hover:scale-105"
            >
              <RotateCcw className="w-4 h-4" />
              Reset Filters
            </button>
            <p className="text-gray-300">Showing {filteredData.length} records</p>
          </div>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
          {[
            { title: 'Total Active Dealers', value: stats.uniqueSellers, subtitle: 'Dealers', icon: Users, gradient: 'from-blue-500/20 to-cyan-500/20 border-blue-500/30' },
            { title: 'Total PCR', value: stats.totalSales, subtitle: 'Dealers commision', icon: Activity, gradient: 'from-green-500/20 to-emerald-500/20 border-green-500/30' },
            { title: 'Total TX', value: stats.uniqueRegions, subtitle: 'terminations', icon: Map, gradient: 'from-purple-500/20 to-pink-500/20 border-purple-500/30' },
            { title: 'Total Eligible PCR', value: stats.uniqueRegions, subtitle: 'eligible pcr', icon: Map, gradient: 'from-purple-500/20 to-pink-500/20 border-purple-500/30' },
            { title: 'Grand Total', value: '3', subtitle: 'Grand total', icon: Package, gradient: 'from-cyan-500/20 to-blue-500/20 border-cyan-500/30' }
          ].map((stat, index) => (
            <div key={index} className={`bg-gradient-to-r ${stat.gradient} p-6 rounded-lg border border-white/20 hover:scale-105 transition-transform duration-200`}>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-white/80 text-sm">{stat.title}</p>
                  <p className="text-2xl font-bold text-white">{stat.value}</p>
                  {stat.growth && <p className="text-white/80 text-sm">{stat.growth} growth</p>}
                  {stat.subtitle && <p className="text-white/80 text-sm">{stat.subtitle}</p>}
                </div>
                <stat.icon className="w-8 h-8 text-white" />
              </div>
            </div>
          ))}
        </div>

        {/* Stage Tables and Top Performers */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Stage Tables */}
          <div className="lg:col-span-2 space-y-6">
            {/* Stage 1 */}
            <div className="bg-gradient-to-br from-blue-500/20 to-cyan-500/20 backdrop-blur-md border border-white/20 rounded-lg p-6">
              <h3 className="text-xl font-bold text-white mb-4 bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">SALES MONTH - APRIL  STAGE 1 </h3>
              
              {/* Stage 1 Stats */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
                {[
                  { title: 'Total sales', value: stats.uniqueSellers, subtitle: 'sales', icon: Users, gradient: 'from-blue-500/20 to-cyan-500/20 border-blue-500/30' },
                  { title: 'Total TX', value: stats.totalSales, subtitle: 'Terminations', icon: Activity, gradient: 'from-green-500/20 to-emerald-500/20 border-green-500/30' },
                  { title: 'Total Active Sales', value: stats.uniqueRegions, subtitle: 'Active sales', icon: Map, gradient: 'from-purple-500/20 to-pink-500/20 border-purple-500/30' },
                  { title: 'Total Active Sales PCR', value: stats.uniqueRegions, subtitle: 'Active sales PCR', icon: Map, gradient: 'from-purple-500/20 to-pink-500/20 border-purple-500/30' },
                  { title: 'Eligible PCR', value: '3', subtitle: 'Stage 1 realese', icon: Package, gradient: 'from-cyan-500/20 to-blue-500/20 border-cyan-500/30' }
                ].map((stat, index) => (
                  <div key={index} className={`bg-gradient-to-r ${stat.gradient} p-6 rounded-lg border border-white/20 hover:scale-105 transition-transform duration-200`}>
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-white/80 text-sm">{stat.title}</p>
                        <p className="text-2xl font-bold text-white">{stat.value}</p>
                        {stat.growth && <p className="text-white/80 text-sm">{stat.growth} growth</p>}
                        {stat.subtitle && <p className="text-white/80 text-sm">{stat.subtitle}</p>}
                      </div>
                      <stat.icon className="w-8 h-8 text-white" />
                    </div>
                  </div>
                ))}
              </div>

              {/* Stage 1 Table */}
              <div className="overflow-x-auto mt-6">
                <table className="w-full text-white">
                  <thead>
                    <tr className="border-b border-white/20">
                      <th className="text-left py-2">BEARER TYPES</th>
                      <th className="text-center py-2">SALES</th>
                      <th className="text-center py-2">TX</th>
                      <th className="text-center py-2">ACTIVE</th>
                      <th className="text-center py-2">PCR (LKR)</th>
                    </tr>
                  </thead>
                  <tbody>
                    {stageData.stage1.map((row, index) => (
                      <tr key={index} className="border-b border-white/10">
                        <td className="py-2 font-medium">{row.bearerType}</td>
                        <td className="text-center py-2">{row.sales}</td>
                        <td className="text-center py-2">{row.tx}</td>
                        <td className="text-center py-2">{row.active}</td>
                        <td className="text-center py-2">{row.pcr}</td>
                      </tr>
                    ))}
                    <tr className="bg-white/10 border-t-2 border-white/30">
                      <td className="py-2 font-bold">TOTAL</td>
                      <td className="text-center py-2 font-bold">{stage1Total.sales}</td>
                      <td className="text-center py-2 font-bold">{stage1Total.tx}</td>
                      <td className="text-center py-2 font-bold">{stage1Total.active}</td>
                      <td className="text-center py-2 font-bold">{stage1Total.pcr}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            {/* Stage 2 */}
            <div className="bg-gradient-to-br from-purple-500/20 to-pink-500/20 backdrop-blur-md border border-white/20 rounded-lg p-6">
              <h3 className="text-xl font-bold text-white mb-4 bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent  ">SALES MONTH - FEBRUARY   STAGE 2</h3>

              {/* Stage 2 Stats */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
                {[
                  { title: 'Total sales', value: stats.uniqueSellers, subtitle: 'sales', icon: Users, gradient: 'from-blue-500/20 to-cyan-500/20 border-blue-500/30' },
                  { title: 'Total TX', value: stats.totalSales, subtitle: 'Terminations', icon: Activity, gradient: 'from-green-500/20 to-emerald-500/20 border-green-500/30' },
                  { title: 'Total Active Sales', value: stats.uniqueRegions, subtitle: 'Active sales', icon: Map, gradient: 'from-purple-500/20 to-pink-500/20 border-purple-500/30' },
                  { title: 'Total Active Sales PCR', value: stats.uniqueRegions, subtitle: 'Active sales PCR', icon: Map, gradient: 'from-pink-500/20 to-purple-500/20 border-pink-500/30' },
                  { title: 'Eligible PCR', value: '3', subtitle: 'Stage 1 realese', icon: Package, gradient: 'from-cyan-500/20 to-blue-500/20 border-cyan-500/30' }
                ].map((stat, index) => (
                  <div key={index} className={`bg-gradient-to-r ${stat.gradient} p-6 rounded-lg border border-white/20 hover:scale-105 transition-transform duration-200`}>
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-white/80 text-sm">{stat.title}</p>
                        <p className="text-2xl font-bold text-white">{stat.value}</p>
                        {stat.growth && <p className="text-white/80 text-sm">{stat.growth} growth</p>}
                        {stat.subtitle && <p className="text-white/80 text-sm">{stat.subtitle}</p>}
                      </div>
                      <stat.icon className="w-8 h-8 text-white" />
                    </div>
                  </div>
                ))}
              </div>

              {/* Stage 2 Table */}
              <div className="overflow-x-auto mt-6">
                <table className="w-full text-white">
                  <thead>
                    <tr className="border-b border-white/20">
                      <th className="text-left py-2">BEARER TYPES</th>
                      <th className="text-center py-2">SALES</th>
                      <th className="text-center py-2">TX</th>
                      <th className="text-center py-2">ACTIVE</th>
                      <th className="text-center py-2">PCR (LKR)</th>
                    </tr>
                  </thead>
                  <tbody>
                    {stageData.stage2.map((row, index) => (
                      <tr key={index} className="border-b border-white/10">
                        <td className="py-2 font-medium">{row.bearerType}</td>
                        <td className="text-center py-2">{row.sales}</td>
                        <td className="text-center py-2">{row.tx}</td>
                        <td className="text-center py-2">{row.active}</td>
                        <td className="text-center py-2">{row.pcr}</td>
                      </tr>
                    ))}
                    <tr className="bg-white/10 border-t-2 border-white/30">
                      <td className="py-2 font-bold">TOTAL</td>
                      <td className="text-center py-2 font-bold">{stage2Total.sales}</td>
                      <td className="text-center py-2 font-bold">{stage2Total.tx}</td>
                      <td className="text-center py-2 font-bold">{stage2Total.active}</td>
                      <td className="text-center py-2 font-bold">{stage2Total.pcr}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* Top Performers */}
          <div className="bg-gradient-to-br from-green-500/20 to-emerald-500/20 backdrop-blur-md border border-white/20 rounded-lg p-6">
            <div className="flex items-center gap-2 mb-6">
              <TrendingUp className="w-6 h-6 text-green-400" />
              <h3 className="text-xl font-bold text-white">Top Performers</h3>
            </div>
            
            <div className="space-y-4">
              {topPerformers.map((performer) => (
                <div key={performer.id} className={`${getRankBg(performer.rank)} p-4 rounded-lg`}>
                  <div className="flex items-center gap-3 mb-2">
                    {getRankIcon(performer.rank)}
                    <div>
                      <p className="font-bold text-white">{performer.sellerName}</p>
                      <p className="text-white/80 text-sm">{performer.sales} total sales</p>
                    </div>
                  </div>
                  <div className="text-white/90 text-sm mb-2">
                    <p>Revenue: LKR {Math.round(performer.revenue / 1000)}K</p>
                    <p>Commission: LKR {Math.round(performer.commission / 1000)}K</p>
                  </div>
                  <div className="bg-white/20 rounded-full h-2">
                    <div 
                      className="bg-gradient-to-r from-green-400 to-emerald-400 h-2 rounded-full transition-all duration-500"
                      style={{ width: `${Math.min(performer.progress, 100)}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex flex-wrap gap-2">
          {['Sales Performance', 'Regions Presence', 'Product Performance'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-6 py-3 rounded-lg font-medium transition-all duration-200 hover:scale-105 ${
                activeTab === tab
                  ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white'
                  : 'bg-white/10 text-gray-300 hover:bg-white/20'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Chart Content */}
        <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-lg p-6">
          {activeTab === 'Sales Performance' && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div>
                <h3 className="text-xl font-bold text-white mb-4">Yearly Sales Comparison (K)</h3>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={yearlyChartData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#ffffff20" />
                    <XAxis dataKey="name" stroke="#ffffff80" />
                    <YAxis stroke="#ffffff80" />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: '#1f2937', 
                        border: '1px solid #374151',
                        borderRadius: '8px'
                      }} 
                    />
                    <Legend />
                    <Bar dataKey="sltInternal" fill="#8B5CF6" name="SLT Internal Revenue" />
                    <Bar dataKey="dealer" fill="#06B6D4" name="Dealer Revenue" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
              
              <div>
                <h3 className="text-xl font-bold text-white mb-4">Monthly Sales Comparison</h3>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={monthlyChartData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#ffffff20" />
                    <XAxis dataKey="name" stroke="#ffffff80" />
                    <YAxis stroke="#ffffff80" />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: '#1f2937', 
                        border: '1px solid #374151',
                        borderRadius: '8px'
                      }} 
                    />
                    <Legend />
                    <Bar dataKey="sltInternal" fill="#FCD34D" name="SLT Internal" />
                    <Bar dataKey="dealer" fill="#EF4444" name="Dealer" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          )}

          {activeTab === 'Regions Presence' && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div>
                <h3 className="text-xl font-bold text-white mb-4">Service Orders by Type</h3>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={lineChartData1}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#ffffff20" />
                    <XAxis dataKey="name" stroke="#ffffff80" />
                    <YAxis stroke="#ffffff80" />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: '#1f2937', 
                        border: '1px solid #374151',
                        borderRadius: '8px'
                      }} 
                    />
                    <Legend />
                    <Line type="monotone" dataKey="internOrders" stroke="#3B82F6" name="Intern Orders" strokeWidth={2} />
                    <Line type="monotone" dataKey="dealerOrders" stroke="#10B981" name="Dealer Orders" strokeWidth={2} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
              
              <div>
                <h3 className="text-xl font-bold text-white mb-4">Revenue Comparison (K)</h3>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={lineChartData2}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#ffffff20" />
                    <XAxis dataKey="name" stroke="#ffffff80" />
                    <YAxis stroke="#ffffff80" />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: '#1f2937', 
                        border: '1px solid #374151',
                        borderRadius: '8px'
                      }} 
                    />
                    <Legend />
                    <Line type="monotone" dataKey="internRevenue" stroke="#8B5CF6" name="Intern Revenue" strokeWidth={2} />
                    <Line type="monotone" dataKey="dealerRevenue" stroke="#06B6D4" name="Dealer Revenue" strokeWidth={2} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
          )}

          {activeTab === 'Product Performance' && (
            <div className="space-y-6">
              {/* Pie Charts */}
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
                <div>
                  <h3 className="text-lg font-bold text-white mb-4">Intern Orders Distribution</h3>
                  <ResponsiveContainer width="100%" height={250}>
                    <PieChart>
                      <Pie
                        data={pieData1}
                        cx="50%"
                        cy="50%"
                        outerRadius={80}
                        dataKey="value"
                      >
                        {pieData1.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip 
                        contentStyle={{ 
                          backgroundColor: '#1f2937', 
                          border: '1px solid #374151',
                          borderRadius: '8px'
                        }} 
                      />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                </div>

                <div>
                  <h3 className="text-lg font-bold text-white mb-4">Dealer Orders Distribution</h3>
                  <ResponsiveContainer width="100%" height={250}>
                    <PieChart>
                      <Pie
                        data={pieData2}
                        cx="50%"
                        cy="50%"
                        outerRadius={80}
                        dataKey="value"
                      >
                        {pieData2.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip 
                        contentStyle={{ 
                          backgroundColor: '#1f2937', 
                          border: '1px solid #374151',
                          borderRadius: '8px'
                        }} 
                      />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                </div>

                <div>
                  <h3 className="text-lg font-bold text-white mb-4">Intern Revenue Distribution</h3>
                  <ResponsiveContainer width="100%" height={250}>
                    <PieChart>
                      <Pie
                        data={pieData3}
                        cx="50%"
                        cy="50%"
                        outerRadius={80}
                        dataKey="value"
                      >
                        {pieData3.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip 
                        contentStyle={{ 
                          backgroundColor: '#1f2937', 
                          border: '1px solid #374151',
                          borderRadius: '8px'
                        }} 
                      />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                </div>

                <div>
                  <h3 className="text-lg font-bold text-white mb-4">Dealer Revenue Distribution</h3>
                  <ResponsiveContainer width="100%" height={250}>
                    <PieChart>
                      <Pie
                        data={pieData4}
                        cx="50%"
                        cy="50%"
                        outerRadius={80}
                        dataKey="value"
                      >
                        {pieData4.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip 
                        contentStyle={{ 
                          backgroundColor: '#1f2937', 
                          border: '1px solid #374151',
                          borderRadius: '8px'
                        }} 
                      />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Bar Charts */}
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
                <div>
                  <h3 className="text-lg font-bold text-white mb-4">Intern Orders Distribution</h3>
                  <ResponsiveContainer width="100%" height={250}>
                    <PieChart>
                      <Pie
                        data={pieData1}
                        cx="50%"
                        cy="50%"
                        outerRadius={80}
                        dataKey="value"
                      >
                        {pieData1.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip 
                        contentStyle={{ 
                          backgroundColor: '#1f2937', 
                          border: '1px solid #374151',
                          borderRadius: '8px'
                        }} 
                      />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                </div>

                <div>
                  <h3 className="text-lg font-bold text-white mb-4">Dealer Orders Distribution</h3>
                  <ResponsiveContainer width="100%" height={250}>
                    <PieChart>
                      <Pie
                        data={pieData2}
                        cx="50%"
                        cy="50%"
                        outerRadius={80}
                        dataKey="value"
                      >
                        {pieData2.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip 
                        contentStyle={{ 
                          backgroundColor: '#1f2937', 
                          border: '1px solid #374151',
                          borderRadius: '8px'
                        }} 
                      />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                </div>

                <div>
                  <h3 className="text-lg font-bold text-white mb-4">Intern Revenue Distribution</h3>
                  <ResponsiveContainer width="100%" height={250}>
                    <PieChart>
                      <Pie
                        data={pieData3}
                        cx="50%"
                        cy="50%"
                        outerRadius={80}
                        dataKey="value"
                      >
                        {pieData3.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip 
                        contentStyle={{ 
                          backgroundColor: '#1f2937', 
                          border: '1px solid #374151',
                          borderRadius: '8px'
                        }} 
                      />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                </div>

                <div>
                  <h3 className="text-lg font-bold text-white mb-4">Dealer Revenue Distribution</h3>
                  <ResponsiveContainer width="100%" height={250}>
                    <PieChart>
                      <Pie
                        data={pieData4}
                        cx="50%"
                        cy="50%"
                        outerRadius={80}
                        dataKey="value"
                      >
                        {pieData4.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip 
                        contentStyle={{ 
                          backgroundColor: '#1f2937', 
                          border: '1px solid #374151',
                          borderRadius: '8px'
                        }} 
                      />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </div>

            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DealerCommissionDashboard;