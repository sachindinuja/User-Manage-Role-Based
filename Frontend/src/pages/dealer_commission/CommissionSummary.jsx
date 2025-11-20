import React, { useState } from "react";
import PageHeader from "../../components/common/PageHeader";
import DataTable from "../../components/dealer_commission/DataTable";
import DCard from "../../components/common/DCard";
import { months, years, data } from "../../data/dealer_commission/CommissionSummaryData";

function DealerCommissionSummary() {
  const [selectedMonth, setSelectedMonth] = useState("January");
  const [selectedYear, setSelectedYear] = useState("2024");

  const getShortMonthName = (fullMonth) => {
    const monthMap = {
      January: "Jan", February: "Feb", March: "Mar", April: "Apr",
      May: "May", June: "Jun", July: "Jul", August: "Aug",
      September: "Sep", October: "Oct", November: "Nov", December: "Dec",
    };
    return monthMap[fullMonth];
  };

  const shortMonth = getShortMonthName(selectedMonth);

  const columns = [
    "Product",
    `${shortMonth} Count`,
    `${shortMonth} Commission`,
    "Total Count",
    "Total Commission",
  ];

  const filteredData = data.filter(item => item.Year === selectedYear);

  const grandTotal = filteredData.find(item => item.Product === "Grand Total");
  const selectedMonthIndex = months.indexOf(selectedMonth);
  const ytdCommission = grandTotal
    ? months.slice(0, selectedMonthIndex + 1).reduce((sum, month) => {
        const shortMonthName = getShortMonthName(month);
        return sum + (grandTotal[`${shortMonthName} Commission`] || 0);
      }, 0)
    : 0;

  return (
    <div className="block">
      <PageHeader title={`Dealer Commission Summary ${selectedYear}`} />

      {/* Filters and Summary Cards */}
      <main>
        <div className="grid grid-cols-3 gap-4 mb-6">
          <DCard>
            <h1>Year</h1>
            <select
              value={selectedYear}
              onChange={(e) => setSelectedYear(e.target.value)}
              className="bg-transparent text-white w-full p-2"
            >
              {years.map((year) => (
                <option key={year} value={year} className="text-black">{year}</option>
              ))}
            </select>
          </DCard>

          <DCard>
            <h1>Month</h1>
            <select
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(e.target.value)}
              className="bg-transparent text-white w-full p-2"
            >
              {months.map((month) => (
                <option key={month} value={month} className="text-black">{month}</option>
              ))}
            </select>
          </DCard>

          <DCard>
            <h1>Total Products</h1>
            <p>{filteredData.filter(item => item.Product !== "Total" && item.Product !== "Grand Total").length}</p>
          </DCard>
        </div>

        {/* Count & Commission Cards */}
        <div className="grid grid-cols-3 gap-4">
          <DCard>
            <h1>Total Count</h1>
            <p>{grandTotal ? grandTotal[`${shortMonth} Count`] : 0}</p>
          </DCard>
          <DCard>
            <h1>Total Commission (LKR)</h1>
            <p>{grandTotal ? grandTotal[`${shortMonth} Commission`].toFixed(2) : "0.00"}</p>
          </DCard>
          <DCard>
            <h1>Grand Total (LKR)</h1>
            <p>{ytdCommission.toFixed(2)}</p>
          </DCard>
        </div>
      </main>

      {/* Data Table */}
      <div className="m-4">
        <DataTable
          columns={columns}
          data={filteredData}
          title={`Dealer Commission Details - ${selectedMonth} ${selectedYear}`}
        />
      </div>
    </div>
  );
}

export default DealerCommissionSummary;
