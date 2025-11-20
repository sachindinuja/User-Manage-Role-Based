import React, { useState, useMemo, useEffect, useRef } from 'react';
import * as Chart from 'chart.js';

const DgmCBSDashboard = () => {
  const [selectedYear, setSelectedYear] = useState('2024');
  const [selectedSalaryMonth, setSelectedSalaryMonth] = useState('January');
  const [selectedModule, setSelectedModule] = useState('All');
  const [selectedRegion, setSelectedRegion] = useState('Metro');

  const stackedChartRef = useRef(null);
  const donutChartRef = useRef(null);
  const salesChartRef = useRef(null);
  const commissionChartRef = useRef(null);
  const regionChartRef = useRef(null);
  const statusChartRef = useRef(null);

  const chartInstances = useRef({});

  const rtomsByRegion = useMemo(() => ({
    Metro: ['Fort', 'Maradana', 'Nugegoda', 'Kotte', 'Havelock', 'Panadura', 'Ratmalana', 'Kelaniya', 'Kadawatha'],
    Region1: ['Kandy', 'Gampola', 'Matale', 'Kurunegala', 'Chilaw', 'Anuradhapura', 'Polonnaruwa', 'Negombo', 'Kuliyapitiya', 'Nittambuwa', 'Homagama'],
    Region2: ['Kegalle', 'Avissawella', 'Ratnapura', 'Badulla', 'Bandarawela', 'Hatton', 'Nuwara Eliya', 'Kalutara', 'Galle', 'Matara', 'Hambantota', 'Ambalangoda'],
    Region3: ['Jaffna', 'Trincomalee', 'Mannar', 'Kilinochchi', 'Mullaitivu', 'Ampara', 'Batticaloa', 'Pottuvil', 'Anuradhapura/Polonnaruwa overlap']
  }), []);

  const colors = useMemo(() => [
    '#4887ec', '#10B981', '#A855F7', '#F472B6', '#6EE7B7', '#9333EA', '#34D399', '#D946EF', '#6B7280', '#7C3AED',
  ], []);

  useEffect(() => {
    Chart.Chart.register(
      Chart.CategoryScale,
      Chart.LinearScale,
      Chart.BarElement,
      Chart.ArcElement,
      Chart.Title,
      Chart.Tooltip,
      Chart.Legend
    );

    return () => Object.values(chartInstances.current).forEach(chart => chart?.destroy());
  }, []);

  useEffect(() => {
    if (stackedChartRef.current) {
      const ctx = stackedChartRef.current.getContext('2d');
      if (chartInstances.current.stacked) chartInstances.current.stacked.destroy();
      const stackedData = Object.keys(rtomsByRegion).map(region => ({
        region,
        ...Object.fromEntries(rtomsByRegion[region].map(rtom => [rtom, Math.floor(Math.random() * 50) + 10]))
      }));
      const allRtoms = Array.from(
        new Set(Object.values(rtomsByRegion).flat())
        );
      const datasets = allRtoms.map((rtom, index) => ({
        label: rtom,
        data: stackedData.map(item => item[rtom] || 0),
        backgroundColor: colors[index % colors.length],
        borderColor: colors[index % colors.length],
        borderWidth: 1
      }));
      chartInstances.current.stacked = new Chart.Chart(ctx, {
        type: 'bar',
        data: { labels: Object.keys(rtomsByRegion), datasets },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: { legend: { display: false }, tooltip: { backgroundColor: '#1E3A8A', titleColor: '#FFF', bodyColor: '#D1D5DB', borderColor: '#4B5563', borderWidth: 1 } },
          scales: { x: { stacked: true, ticks: { color: '#D1D5DB', font: { family: 'Arial', size: 12 } }, grid: { color: '#374151' } }, y: { stacked: true, ticks: { color: '#D1D5DB', font: { family: 'Arial', size: 12 }, callback: value => `${value}M` }, grid: { color: '#374151' } } }
        }
      });
    }
  }, [rtomsByRegion, colors]);

  useEffect(() => {
    if (donutChartRef.current) {
      const ctx = donutChartRef.current.getContext('2d');
      if (chartInstances.current.donut) chartInstances.current.donut.destroy();
      chartInstances.current.donut = new Chart.Chart(ctx, {
        type: 'doughnut',
        data: { labels: ['LTE', 'FTTH', 'Copper'], datasets: [{ data: [1200, 1200, 170], backgroundColor: ['#C780FA', '#E84855', '#2EC4B6'], borderWidth: 2, borderColor: '#1E3A8A' }] },
        options: { responsive: true, maintainAspectRatio: false, plugins: { legend: { position: 'bottom', labels: { color: '#D1D5DB', font: { family: 'Arial', size: 12 } } }, tooltip: { backgroundColor: '#1E3A8A', titleColor: '#FFF', bodyColor: '#D1D5DB', borderColor: '#4B5563', borderWidth: 1 } } }
      });
    }
  }, []);

  useEffect(() => {
    if (salesChartRef.current) {
      const ctx = salesChartRef.current.getContext('2d');
      if (chartInstances.current.sales) chartInstances.current.sales.destroy();
      chartInstances.current.sales = new Chart.Chart(ctx, {
        type: 'bar',
        data: { labels: ['FTTH', 'LTE', 'Copper'], datasets: [
          { label: 'PEO', data: [280, 300, 350], backgroundColor: '#E84855' },
          { label: 'Voice', data: [320, 280, 300], backgroundColor: '#6BCB77' },
          { label: 'BB', data: [180, 200, 250], backgroundColor: '#C780FA' },
          { label: 'Coupon', data: [220, 180, 200], backgroundColor: '#5DADE2' }
        ] },
        options: { responsive: true, maintainAspectRatio: false, plugins: { legend: { labels: { color: '#D1D5DB', font: { family: 'Arial', size: 12 } } }, tooltip: { backgroundColor: '#1E3A8A', titleColor: '#FFF', bodyColor: '#D1D5DB', borderColor: '#4B5563', borderWidth: 1 } }, scales: { x: { ticks: { color: '#D1D5DB', font: { family: 'Arial', size: 12 } }, grid: { color: '#374151' } }, y: { ticks: { color: '#D1D5DB', font: { family: 'Arial', size: 12 } }, grid: { color: '#374151' } } } }
      });
    }
  }, []);

  useEffect(() => {
    if (commissionChartRef.current) {
      const ctx = commissionChartRef.current.getContext('2d');
      if (chartInstances.current.commission) chartInstances.current.commission.destroy();
      chartInstances.current.commission = new Chart.Chart(ctx, {
        type: 'bar',
        data: { labels: ['FTTH', 'LTE', 'Copper'], datasets: [
          { label: 'PEO', data: [480, 500, 450], backgroundColor: '#E84855' },
          { label: 'Voice', data: [420, 380, 400], backgroundColor: '#6BCB77' },
          { label: 'BB', data: [380, 400, 350], backgroundColor: '#C780FA' },
          { label: 'Coupon', data: [320, 280, 300], backgroundColor: '#5DADE2' }
        ] },
        options: { responsive: true, maintainAspectRatio: false, plugins: { legend: { labels: { color: '#D1D5DB', font: { family: 'Arial', size: 12 } } }, tooltip: { backgroundColor: '#1E3A8A', titleColor: '#FFF', bodyColor: '#D1D5DB', borderColor: '#4B5563', borderWidth: 1 } }, scales: { x: { ticks: { color: '#D1D5DB', font: { family: 'Arial', size: 12 } }, grid: { color: '#374151' } }, y: { ticks: { color: '#D1D5DB', font: { family: 'Arial', size: 12 } }, grid: { color: '#374151' } } } }
      });
    }
  }, []);

  useEffect(() => {
    if (regionChartRef.current) {
      const ctx = regionChartRef.current.getContext('2d');
      if (chartInstances.current.region) chartInstances.current.region.destroy();
      const regionData = selectedRegion === 'Metro' ? { PEO: [30, 42, 30], Voice: [32, 38, 28], BB: [28, 35, 25] } : { PEO: [20, 35, 25], Voice: [25, 30, 20], BB: [22, 28, 20] };
      chartInstances.current.region = new Chart.Chart(ctx, {
        type: 'bar',
        data: { labels: ['FTTH', 'LTE', 'Copper'], datasets: [
          { label: 'PEO', data: regionData.PEO, backgroundColor: '#E84855' },
          { label: 'Voice', data: regionData.Voice, backgroundColor: '#6BCB77' },
          { label: 'BB', data: regionData.BB, backgroundColor: '#C780FA' }
        ] },
        options: { responsive: true, maintainAspectRatio: false, plugins: { legend: { labels: { color: '#D1D5DB', font: { family: 'Arial', size: 12 } } }, tooltip: { backgroundColor: '#1E3A8A', titleColor: '#FFF', bodyColor: '#D1D5DB', borderColor: '#4B5563', borderWidth: 1 } }, scales: { x: { ticks: { color: '#D1D5DB', font: { family: 'Arial', size: 12 } }, grid: { color: '#374151' } }, y: { ticks: { color: '#D1D5DB', font: { family: 'Arial', size: 12 } }, grid: { color: '#374151' } } } }
      });
    }
  }, [selectedRegion]);

  useEffect(() => {
    if (statusChartRef.current) {
      const ctx = statusChartRef.current.getContext('2d');
      if (chartInstances.current.status) chartInstances.current.status.destroy();
      chartInstances.current.status = new Chart.Chart(ctx, {
        type: 'doughnut',
        data: { labels: ['Paid/Completed', 'Not Paid/Not Completed'], datasets: [{ data: [70, 30], backgroundColor: ['#A855F7', '#5D688D'], borderWidth: 2, borderColor: '#1E3A8A' }] },
        options: { responsive: true, maintainAspectRatio: false, plugins: { legend: { position: 'bottom', labels: { color: '#D1D5DB', font: { family: 'Arial', size: 12 } } }, tooltip: { backgroundColor: '#1E3A8A', titleColor: '#FFF', bodyColor: '#D1D5DB', borderColor: '#4B5563', borderWidth: 1 } } }
      });
    }
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0F0579] to-[#1E3A8A] p-6 md:p-8 lg:p-12 text-white">
      <div className="max-w-7xl mx-auto">
        <header className="mb-8">
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-[#D1D5DB] to-[#F3F4F6]">
            DGM CBS/Manager CBS/Engineer CBS Dashboard
          </h1>
          <p className="text-gray-300 mt-2 text-base md:text-lg">Real-time insights for sales and commission performance</p>
          <div className="flex flex-wrap gap-4 mt-6">
            <div className="flex-1 min-w-[160px]">
              <label className="block text-gray-200 text-sm font-medium mb-2">Year & Month</label>
              <select
                value={selectedYear}
                onChange={(e) => setSelectedYear(e.target.value)}
                className="w-full bg-[#6B46C1] text-white px-4 py-2.5 rounded-lg border border-[#553C9A] focus:ring-2 focus:ring-[#A855F7] focus:border-[#A855F7] transition duration-200 shadow-sm hover:shadow-md"
              >
                <option value="2024">2024</option>
                <option value="2023">2023</option>
                <option value="2022">2022</option>
              </select>
            </div>
            <div className="flex-1 min-w-[160px]">
              <label className="block text-gray-200 text-sm font-medium mb-2">Salary Month</label>
              <select
                value={selectedSalaryMonth}
                onChange={(e) => setSelectedSalaryMonth(e.target.value)}
                className="w-full bg-[#6B46C1] text-white px-4 py-2.5 rounded-lg border border-[#553C9A] focus:ring-2 focus:ring-[#A855F7] focus:border-[#A855F7] transition duration-200 shadow-sm hover:shadow-md"
              >
                <option value="January">January</option>
                <option value="February">February</option>
                <option value="March">March</option>
                <option value="April">April</option>
                <option value="May">May</option>
                <option value="June">June</option>
              </select>
            </div>
            <div className="flex-1 min-w-[160px]">
              <label className="block text-gray-200 text-sm font-medium mb-2">Module</label>
              <select
                value={selectedModule}
                onChange={(e) => setSelectedModule(e.target.value)}
                className="w-full bg-[#6B46C1] text-white px-4 py-2.5 rounded-lg border border-[#553C9A] focus:ring-2 focus:ring-[#A855F7] focus:border-[#A855F7] transition duration-200 shadow-sm hover:shadow-md"
              >
                <option value="All">All</option>
                <option value="Sales">Sales</option>
                <option value="Commission">Commission</option>
              </select>
            </div>
          </div>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
          <div className="bg-[#17285C]/80 rounded-xl p-6 shadow-lg hover:shadow-xl transition-shadow duration-300 border border-[#2A4580]">
            <h3 className="text-xl font-semibold text-white mb-4">Total Commission of All RTOMs</h3>
            <div className="h-80"><canvas ref={stackedChartRef}></canvas></div>
          </div>
          <div className="bg-[#17285C]/80 rounded-xl p-6 shadow-lg hover:shadow-xl transition-shadow duration-300 border border-[#2A4580]">
            <h3 className="text-xl font-semibold text-white mb-4">Total Sales Count by Bearer Type of Regions</h3>
            <div className="h-80 flex items-center justify-center relative">
              <canvas ref={donutChartRef}></canvas>
              <span className="absolute text-3xl font-bold text-white drop-shadow-md">1570</span>
            </div>
          </div>
          <div className="bg-[#17285C]/80 rounded-xl p-6 shadow-lg hover:shadow-xl transition-shadow duration-300 border border-[#2A4580]">
            <h3 className="text-xl font-semibold text-white mb-4">Total Sales Count of all RTOMs by Bearer Type</h3>
            <div className="h-80"><canvas ref={salesChartRef}></canvas></div>
          </div>
          <div className="bg-[#17285C]/80 rounded-xl p-6 shadow-lg hover:shadow-xl transition-shadow duration-300 border border-[#2A4580]">
            <h3 className="text-xl font-semibold text-white mb-4">Total Commission Amount of all RTOMs by Bearer Type</h3>
            <div className="h-80"><canvas ref={commissionChartRef}></canvas></div>
          </div>
          <div className="bg-[#17285C]/80 rounded-xl p-6 shadow-lg hover:shadow-xl transition-shadow duration-300 border border-[#2A4580]">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-semibold text-white">Total Sales Count of Specific Region by Bearer Type</h3>
              <select
                value={selectedRegion}
                onChange={(e) => setSelectedRegion(e.target.value)}
                className="bg-[#6B46C1] text-white px-3 py-1.5 rounded-lg border border-[#553C9A] focus:ring-2 focus:ring-[#A855F7] focus:border-[#A855F7] transition duration-200 shadow-sm hover:shadow-md"
              >
                <option value="Metro">Metro</option>
                <option value="Region1">Region 1</option>
                <option value="Region2">Region 2</option>
                <option value="Region3">Region 3</option>
              </select>
            </div>
            <div className="h-72"><canvas ref={regionChartRef}></canvas></div>
          </div>
          <div className="bg-[#17285C]/80 rounded-xl p-6 shadow-lg hover:shadow-xl transition-shadow duration-300 border border-[#2A4580]">
            <h3 className="text-xl font-semibold text-white mb-4">Paid/Completed Commission</h3>
            <div className="h-80 flex items-center justify-center relative">
              <canvas ref={statusChartRef}></canvas>
              <span className="absolute text-3xl font-bold text-white drop-shadow-md">70%</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DgmCBSDashboard;