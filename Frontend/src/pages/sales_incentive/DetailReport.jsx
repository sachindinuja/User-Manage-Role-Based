import React, { useState } from "react";
import PageHeader from "../../components/common/PageHeader";
import DataTable from "../../components/common/DataTable";
import DropDownTwo from "../../components/common/DropDownTwo";
import AIBtn from "../../components/common/AIBtn";
import { FilterIcon } from "lucide-react";
import OverviewSection from "../../components/sales-incentive/OverviewSection";
import { SummaryOverviewCardData } from "../../data/sales_incentive/Reports";

function DetailReport({ detailedReportData }) {
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
    "OSS SOID",
    "Tariff ID",
    "INC Category",
    "BSS Status",
    "PCR Amount",
    "Bearer Commission",
    "Calculation Type",
    "Order Type",
    "Order Sub Type",
    "Performa Eligibility",
    "Cupon Sales",
    "Salary Month",
  ];
  const data = detailedReportData
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
      "Service ID": item.service_id,
      "Service Number": item.employee_number,
      "Sales Channel": item.sales_chanal,
      "Sales Month": item.sales_month,
      "Account Number": item.account_num,
      "OSS SOID": item.order_line_oss_order_id,
      "Tariff ID": item.tariff_id,
      "Tariff Name": item.tariff_name,
      "INC Category": item.inc_category,
      "BSS Status": item.bss_status,
      "PCR Amount": item.pcr_amount,
      "Bearer Commission": item.bearer_commission,
      "Calculation Type": item.calculation_type,
      "Order Type": item.order_type,
      "Order Sub Type": item.order_sub_type,
      "Performa Eligibility": item.performa_eligibility,
      "Cupon Sales": item.cupon_sales,
      "Customer Type": item.customer_type,
      "Salary Month": new Date(item.calculation_date).toLocaleString(
        "default",
        { month: "long", day: "numeric", year: "numeric" }
      ),
    }));

  const filteredItems = detailedReportData
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
      (sum, item) => sum + (Number(item.pcr_amount) || 0),
      0
    ),
    total_bearer_commission: filteredItems.reduce(
      (sum, item) => sum + (Number(item.bearer_commission) || 0),
      0
    ),
  };

  // Find the searched salesperson's data if searchQuery is present
  let searchedPerson = null;
  if (searchQuery.trim() !== "") {
    searchedPerson = filteredItems.find(
      (item) =>
        item.employee_number &&
        item.employee_number
          .toLowerCase()
          .includes(searchQuery.trim().toLowerCase())
    );
  }

  // Prepare overview cards data
  const overviewCards = [
    { label: "Total PCR", value: totals.total_pcr },
    { label: "Total Bearer Commission", value: totals.total_bearer_commission },
  ];

  // If searching for a salesperson, add their Sales Channel and Salary Month
  if (searchedPerson) {
    overviewCards.push(
      { label: "Sales Channel", value: searchedPerson.sales_chanal },
      {
        label: "Salary Month",
        value: searchedPerson.calculation_date
          ? new Date(searchedPerson.calculation_date).toLocaleString(
              "default",
              {
                month: "long",
                year: "numeric",
              }
            )
          : "",
      }
    );
  }

  // filter data for dropdowns
  const FilteredData = {
    sales_months: [
      "ALL",
      ...new Set(detailedReportData.map((item) => item.sales_month)),
    ],
    sales_persons: [
      "ALL",
      ...new Set(detailedReportData.map((item) => item.employee_number)),
    ],
    sales_channel: [
      "ALL",
      ...new Set(detailedReportData.map((item) => item.sales_chanal)),
    ],
    stages: [
      "ALL",
      ...new Set(detailedReportData.map((item) => item.calculation_type)),
    ],
  };

  return (
    <div className="block">
      <PageHeader
        title={"Detailed Overview"}
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
      <div className="px-10 my-5">
        <OverviewSection cards={overviewCards} />
      </div>

      {/* data table */}
      <DataTable columns={columns} data={data} title="Detailed Report" />
    </div>
  );
}

export default DetailReport;
