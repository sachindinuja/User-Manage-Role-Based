import React, { useState, useEffect } from "react";
import PageHeader from "../../components/common/PageHeader";
import DCard from "../../components/common/DCard";
import DataTable from "../../components/dealer_commission/DataTable";
import { formatNumber } from "../../utils/utils";
import axios from "axios";

function SummaryReport() {
  const [summaryReportData, setSummaryReportData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState("stage1");
  const [searchTerm, setSearchTerm] = useState("");

  // API endpoint from .env
  const API_URL = import.meta.env.VITE_SIA_DL_SALES_COUN_TREPOR;

  // Fetch data from API
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await axios.get(API_URL);
        setSummaryReportData(response.data);
        setLoading(false);
      } catch {
        setError("Failed to fetch data from the API.");
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // Define columns for Stage 1
  const stage1Columns = [
    "Dealer Name",
    "Sub Dealer",
    "Sales Count",
    "Slab",
    "FTTH Stage 1",
    "BB Stage 1",
    "Megaline Stage 1",
    "LTE Stage 1",
    "IPTV Stage 1",
    "Total Stage 1",
    "Payment Stage 1",
  ];

  // Define columns for Stage 2
  const stage2Columns = [
    "Dealer Name",
    "Sub Dealer",
    "Sales Count Stage 2",
    "Slab Stage 2",
    "FTTH Stage 2",
    "BB Stage 2",
    "Megaline Stage 2",
    "LTE Stage 2",
    "IPTV Stage 2",
    "Total Stage 2",
    "Payment Stage 2",
  ];

  // Filter data based on search term
  const filteredData = summaryReportData.filter(item => 
    item.DEALER_NAME?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.SUB_DEALER?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Map API data to Stage 1 table
  const stage1Data = filteredData.map((item) => ({
    "Dealer Name": item.DEALER_NAME,
    "Sub Dealer": item.SUB_DEALER,
    "Sales Count": item.SALES_COUNT,
    "Slab": item.SLAB,
    "FTTH Stage 1": formatNumber(item.FTTH_STG1 || 0),
    "BB Stage 1": formatNumber(item.BB_STG1 || 0),
    "Megaline Stage 1": formatNumber(item.MEGALINE_STG1 || 0),
    "LTE Stage 1": formatNumber(item.LTE_STG1 || 0),
    "IPTV Stage 1": formatNumber(item.IPTV_STG1 || 0),
    "Total Stage 1": formatNumber(item.TOT_STG1 || 0),
    "Payment Stage 1": formatNumber(item.PAYMRNT_STG1 || 0),
  }));

  // Map API data to Stage 2 table
  const stage2Data = filteredData.map((item) => ({
    "Dealer Name": item.DEALER_NAME,
    "Sub Dealer": item.SUB_DEALER,
    "Sales Count Stage 2": item.SALES_COUNT_STG2,
    "Slab Stage 2": item.SLAB_STG2,
    "FTTH Stage 2": formatNumber(item.FTTH_STG2 || 0),
    "BB Stage 2": formatNumber(item.BB_STG2 || 0),
    "Megaline Stage 2": formatNumber(item.MEGALINE_STG2 || 0),
    "LTE Stage 2": formatNumber(item.LTE_STG2 || 0),
    "IPTV Stage 2": formatNumber(item.IPTV_STG2 || 0),
    "Total Stage 2": formatNumber(item.TOT_STG2 || 0),
    "Payment Stage 2": formatNumber(item.PAYMRNT_STG2 || 0),
  }));

  // Calculate totals for Stage 1 based on filteredData
  const totalSalesCount = filteredData.reduce(
    (sum, item) => sum + (Number(item.SALES_COUNT) || 0),
    0
  );
  const totalFTTHStage1 = filteredData.reduce(
    (sum, item) => sum + (Number(item.FTTH_STG1) || 0),
    0
  );
  const totalBBStage1 = filteredData.reduce(
    (sum, item) => sum + (Number(item.BB_STG1) || 0),
    0
  );
  const totalMegalineStage1 = filteredData.reduce(
    (sum, item) => sum + (Number(item.MEGALINE_STG1) || 0),
    0
  );
  const totalLTEStage1 = filteredData.reduce(
    (sum, item) => sum + (Number(item.LTE_STG1) || 0),
    0
  );
  const totalIPTVStage1 = filteredData.reduce(
    (sum, item) => sum + (Number(item.IPTV_STG1) || 0),
    0
  );
  const totalStage1 = filteredData.reduce(
    (sum, item) => sum + (Number(item.TOT_STG1) || 0),
    0
  );
  const totalPaymentStage1 = filteredData.reduce(
    (sum, item) => sum + (Number(item.PAYMRNT_STG1) || 0),
    0
  );

  // Calculate totals for Stage 2 based on filteredData
  const totalSalesCountStage2 = filteredData.reduce(
    (sum, item) => sum + (Number(item.SALES_COUNT_STG2) || 0),
    0
  );
  const totalFTTHStage2 = filteredData.reduce(
    (sum, item) => sum + (Number(item.FTTH_STG2) || 0),
    0
  );
  const totalBBStage2 = filteredData.reduce(
    (sum, item) => sum + (Number(item.BB_STG2) || 0),
    0
  );
  const totalMegalineStage2 = filteredData.reduce(
    (sum, item) => sum + (Number(item.MEGALINE_STG2) || 0),
    0
  );
  const totalLTEStage2 = filteredData.reduce(
    (sum, item) => sum + (Number(item.LTE_STG2) || 0),
    0
  );
  const totalIPTVStage2 = filteredData.reduce(
    (sum, item) => sum + (Number(item.IPTV_STG2) || 0),
    0
  );
  const totalStage2 = filteredData.reduce(
    (sum, item) => sum + (Number(item.TOT_STG2) || 0),
    0
  );
  const totalPaymentStage2 = filteredData.reduce(
    (sum, item) => sum + (Number(item.PAYMRNT_STG2) || 0),
    0
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your summary report...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center bg-red-50 p-6 rounded-lg border border-red-200">
          <p className="text-red-700 font-medium">Oops! Something went wrong</p>
          <p className="text-red-600 text-sm mt-1">{error}</p>
          <button 
            onClick={() => window.location.reload()} 
            className="mt-4 px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="block">
      {/* Header */}
      <PageHeader
        title="Summary Report Dashboard"
        subtitle="Comprehensive overview of dealer performance across all stages"
      />

      {/* Search and Filter Section */}
      <div className="p-6 rounded-lg shadow-sm mb-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-end gap-4">
          <div className="md:w-1/3">
            <label className="block text-sm font-medium text-white mb-2">
              Search Dealers
            </label>
            <input
              type="text"
              placeholder="Search by dealer name or sub dealer..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full p-3 border border-gray-600 rounded-lg bg-gray-900 text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors placeholder-gray-400"
            />
          </div>
          <div className="flex items-center gap-2 text-sm text-white">
            <span>Total Records:</span>
            <span className="font-semibold text-blue-600">{filteredData.length}</span>
          </div>
        </div>
      </div>

      {/* Key Metrics Overview */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-white mb-6">
          Performance Metrics
        </h2>
        
        {/* Stage 1 Metrics */}
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-white mb-4">
            Stage 1 Performance
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <DCard>
              <div className="text-center p-4">
                <h4 className="text-sm font-medium text-white mb-1">Total Sales Count</h4>
                <p className="text-2xl font-bold text-blue-600">{formatNumber(totalSalesCount)}</p>
                <p className="text-xs text-gray-500 mt-1">Units Sold</p>
              </div>
            </DCard>
            <DCard>
              <div className="text-center p-4">
                <h4 className="text-sm font-medium text-white mb-1">Total Revenue</h4>
                <p className="text-2xl font-bold text-green-600">LKR {formatNumber(totalStage1)}</p>
                <p className="text-xs text-gray-500 mt-1">Stage 1 Revenue</p>
              </div>
            </DCard>
            <DCard>
              <div className="text-center p-4">
                <h4 className="text-sm font-medium text-white mb-1">Total Payments</h4>
                <p className="text-2xl font-bold text-purple-600">LKR {formatNumber(totalPaymentStage1)}</p>
                <p className="text-xs text-gray-500 mt-1">Stage 1 Payments</p>
              </div>
            </DCard>
          </div>
        </div>

        {/* Stage 2 Metrics */}
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-white mb-4">
            Stage 2 Performance
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <DCard>
              <div className="text-center p-4">
                <h4 className="text-sm font-medium text-white mb-1">Total Sales Count</h4>
                <p className="text-2xl font-bold text-blue-600">{formatNumber(totalSalesCountStage2)}</p>
                <p className="text-xs text-gray-500 mt-1">Units Sold</p>
              </div>
            </DCard>
            <DCard>
              <div className="text-center p-4">
                <h4 className="text-sm font-medium text-white mb-1">Total Revenue</h4>
                <p className="text-2xl font-bold text-green-600">LKR {formatNumber(totalStage2)}</p>
                <p className="text-xs text-gray-500 mt-1">Stage 2 Revenue</p>
              </div>
            </DCard>
            <DCard>
              <div className="text-center p-4">
                <h4 className="text-sm font-medium text-white mb-1">Total Payments</h4>
                <p className="text-2xl font-bold text-purple-600">LKR {formatNumber(totalPaymentStage2)}</p>
                <p className="text-xs text-gray-500 mt-1">Stage 2 Payments</p>
              </div>
            </DCard>
          </div>
        </div>
      </div>

      {/* Service Breakdown */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-white mb-6">
          Service Performance Breakdown
        </h2>
        
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          <DCard>
            <div className="text-center p-3">
              <h4 className="text-xs font-medium text-white mb-1">FTTH</h4>
              <p className="text-sm font-bold text-blue-600">Stage 1: {formatNumber(totalFTTHStage1)}</p>
              <p className="text-sm font-bold text-green-600">Stage 2: {formatNumber(totalFTTHStage2)}</p>
            </div>
          </DCard>
          <DCard>
            <div className="text-center p-3">
              <h4 className="text-xs font-medium text-white mb-1">BB</h4>
              <p className="text-sm font-bold text-blue-600">Stage 1: {formatNumber(totalBBStage1)}</p>
              <p className="text-sm font-bold text-green-600">Stage 2: {formatNumber(totalBBStage2)}</p>
            </div>
          </DCard>
          <DCard>
            <div className="text-center p-3">
              <h4 className="text-xs font-medium text-white mb-1">Megaline</h4>
              <p className="text-sm font-bold text-blue-600">Stage 1: {formatNumber(totalMegalineStage1)}</p>
              <p className="text-sm font-bold text-green-600">Stage 2: {formatNumber(totalMegalineStage2)}</p>
            </div>
          </DCard>
          <DCard>
            <div className="text-center p-3">
              <h4 className="text-xs font-medium text-white mb-1">LTE</h4>
              <p className="text-sm font-bold text-blue-600">Stage 1: {formatNumber(totalLTEStage1)}</p>
              <p className="text-sm font-bold text-green-600">Stage 2: {formatNumber(totalLTEStage2)}</p>
            </div>
          </DCard>
          <DCard>
            <div className="text-center p-3">
              <h4 className="text-xs font-medium text-white mb-1">IPTV</h4>
              <p className="text-sm font-bold text-blue-600">Stage 1: {formatNumber(totalIPTVStage1)}</p>
              <p className="text-sm font-bold text-green-600">Stage 2: {formatNumber(totalIPTVStage2)}</p>
            </div>
          </DCard>
        </div>
      </div>

      {/* Detailed Reports Section */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-white mb-6">
          Detailed Reports
        </h2>
        
        {/* Tab Navigation */}
        <div className="flex border-b border-gray-200 mb-6">
          <button
            onClick={() => setActiveTab("stage1")}
            className={`px-6 py-3 text-sm font-medium border-b-2 transition-colors ${
              activeTab === "stage1"
                ? "border-blue-500 text-blue-600 bg-blue-50"
                : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
            }`}
          >
            Stage 1 Report ({stage1Data.length} dealers)
          </button>
          <button
            onClick={() => setActiveTab("stage2")}
            className={`px-6 py-3 text-sm font-medium border-b-2 transition-colors ${
              activeTab === "stage2"
                ? "border-blue-500 text-blue-600 bg-blue-50"
                : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
            }`}
          >
            Stage 2 Report ({stage2Data.length} dealers)
          </button>
        </div>

        {/* Tab Content */}
        {activeTab === "stage1" && (
          <div className="space-y-4">
            <DataTable
              columns={stage1Columns}
              data={stage1Data}
              title="Stage 1 Detailed Summary Report"
            />
          </div>
        )}

        {activeTab === "stage2" && (
          <div className="space-y-4">
            <DataTable
              columns={stage2Columns}
              data={stage2Data}
              title="Stage 2 Detailed Summary Report"
            />
          </div>
        )}
      </div>

      {/* Footer Info */}
      <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 text-center">
        <p className="text-sm text-gray-600">
          Report generated with {summaryReportData.length} total records | 
          Currently showing {filteredData.length} filtered results | 
          Data refreshed automatically
        </p>
      </div>
    </div>
  );
}

export default SummaryReport;