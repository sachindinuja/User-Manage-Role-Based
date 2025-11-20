import React, { useState } from "react";
import PageHeader from "../../components/common/PageHeader";
import DataTable from "../../components/common/DataTable";
import DropDownTwo from "../../components/common/DropDownTwo";
import OverviewSection from "../../components/sales-incentive/OverviewSection";

function SummaryReport({ summaryReportData }) {
  // console.log("Summary Report Data: ", summaryReportData);
  const initialFilteringOptions = {
    sales_month_filter: "ALL",
    sales_channel_filter: "ALL",
    sales_person_filter: "ALL",
    calculation_type_filter: "ALL",
  };

  const [filteringOptions, setFilteringOptions] = useState(
    initialFilteringOptions
  );
  const [searchQuery, setSearchQuery] = useState("");

  const columns = [
    "Service Number",
    "Sales Channel",
    "Sales Month",
    "Slab Level",
    "Total PCR",
    "Eligible PCR",
    "Active Sales",
    "Total TX",
    "Stage 1 Incentive",
    "Stage 2 Incentive",
    "Stage 3 Incentive",
    "Calculation Type",
    "Salary Month",
  ];
  const data = summaryReportData
    .sort((a, b) => b.employee_number.localeCompare(a.employee_number))
    .filter(
      (item) =>
        (filteringOptions.sales_month_filter === "ALL" ||
          item.sales_month === filteringOptions.sales_month_filter) &&
        (filteringOptions.sales_person_filter === "ALL" ||
          item.employee_number === filteringOptions.sales_person_filter) &&
        (filteringOptions.sales_channel_filter === "ALL" ||
          item.sales_chanal === filteringOptions.sales_channel_filter) &&
        item.calculation_type === "REAL_STAGE1"
    )
    .filter(
      (item) =>
        searchQuery.trim() === "" ||
        item.employee_number
          .toLowerCase()
          .includes(searchQuery.trim().toLowerCase())
    )
    .map((item) => ({
      id: item.id,
      "Service Number": item.employee_number,
      "Sales Channel": item.sales_chanal,
      "Sales Month": item.sales_month,
      "Slab Level": item.slab_level,
      "Total PCR": item.total_pcr,
      "Eligible PCR": item.eligible_pcr,
      "Active Sales": item.active_sales,
      "Total FTTH": item.total_ftth,
      "Total PEO": item.total_peo,
      "Total LTE": item.total_lte,
      "Total COPPER": item.total_copper,
      "Total TX": item.total_tx,
      "Stage 1 Incentive": item.stage1_incentive,
      "Stage 2 Incentive": item.stage2_incentive,
      "Stage 3 Incentive": item.stage3_incentive,
      "Calculation Type": item.calculation_type,
      "Salary Month": new Date(item.calculation_date).toLocaleString(
        "default",
        { month: "short", year: "numeric", day: "numeric" }
      ),
    }));

  const filteredItems = summaryReportData
    .sort((a, b) => b.employee_number.localeCompare(a.employee_number))
    .filter(
      (item) =>
        (filteringOptions.sales_month_filter === "ALL" ||
          item.sales_month === filteringOptions.sales_month_filter) &&
        (filteringOptions.sales_person_filter === "ALL" ||
          item.employee_number === filteringOptions.sales_person_filter) &&
        (filteringOptions.sales_channel_filter === "ALL" ||
          item.sales_chanal === filteringOptions.sales_channel_filter) &&
        item.calculation_type === "REAL_STAGE1"
    )
    .filter(
      (item) =>
        searchQuery.trim() === "" ||
        item.employee_number
          .toLowerCase()
          .includes(searchQuery.trim().toLowerCase())
    );

  // Calculate totals
  const totals = {
    total_pcr: filteredItems.reduce(
      (sum, item) => sum + (Number(item.total_pcr) || 0),
      0
    ),
    eligible_pcr: filteredItems.reduce(
      (sum, item) => sum + (Number(item.eligible_pcr) || 0),
      0
    ),
    active_sales: filteredItems.reduce(
      (sum, item) => sum + (Number(item.active_sales) || 0),
      0
    ),
    total_tx: filteredItems.reduce(
      (sum, item) => sum + (Number(item.total_tx) || 0),
      0
    ),
    stage1_incentive: filteredItems.reduce(
      (sum, item) => sum + (Number(item.stage1_incentive) || 0),
      0
    ),
    stage2_incentive: filteredItems.reduce(
      (sum, item) => sum + (Number(item.stage2_incentive) || 0),
      0
    ),
    stage3_incentive: filteredItems.reduce(
      (sum, item) => sum + (Number(item.stage3_incentive) || 0),
      0
    ),
  };

  // Prepare overview cards data
  const overviewCards = [
    { label: "Total PCR", value: totals.total_pcr },
    { label: "Total Eligible PCR", value: totals.eligible_pcr },
    { label: "Total Active Sales", value: totals.active_sales },
    { label: "Total TX", value: totals.total_tx },
    { label: "Total Stage 1 Incentive", value: totals.stage1_incentive },
    { label: "Total Stage 2 Incentive", value: totals.stage2_incentive },
    { label: "Total Stage 3 Incentive", value: totals.stage3_incentive },
  ];

  // filter data for dropdowns
  const FilteredData = {
    sales_months: [
      "ALL",
      ...new Set(summaryReportData.map((item) => item.sales_month)),
    ],
    sales_persons: [
      "ALL",
      ...new Set(summaryReportData.map((item) => item.employee_number)),
    ],
    sales_channel: [
      "ALL",
      ...new Set(summaryReportData.map((item) => item.sales_chanal)),
    ],
    stages: [
      "ALL",
      ...new Set(summaryReportData.map((item) => item.calculation_type)),
    ],
  };

  return (
    <div className="block">
      <PageHeader
        title={"Summary Overview"}
        placeholder={"Search by Service Number"}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
      />

      {/* filterations */}
      <div className="grid grid-cols-3 gap-5 px-10 my-10">
        <div>
          <p className="text-white mb-2 text-lg font-medium">Sales Month</p>
          <DropDownTwo
            status={FilteredData.sales_months}
            value={filteringOptions.sales_month_filter}
            onChange={(e) =>
              setFilteringOptions({
                ...filteringOptions,
                sales_month_filter: e.target.value,
              })
            }
          />
        </div>
        <div>
          <p className="text-white mb-2 text-lg font-medium">Sales Channel</p>
          <DropDownTwo
            status={FilteredData.sales_channel}
            value={filteringOptions.sales_channel_filter}
            onChange={(e) =>
              setFilteringOptions({
                ...filteringOptions,
                sales_channel_filter: e.target.value,
              })
            }
          />
        </div>
        <div>
          <p className="text-white mb-2 text-lg font-medium">Sales Person</p>
          <DropDownTwo
            status={FilteredData.sales_persons}
            value={filteringOptions.sales_person_filter}
            onChange={(e) =>
              setFilteringOptions({
                ...filteringOptions,
                sales_person_filter: e.target.value,
              })
            }
          />
        </div>
      </div>

      {/* overview section */}
      <div className="px-10">
        <OverviewSection cards={overviewCards} />
      </div>

      {/* data table */}
      <DataTable columns={columns} data={data} title="Summary Report" />
    </div>
  );
}

export default SummaryReport;
