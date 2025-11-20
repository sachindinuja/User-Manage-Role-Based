import React, { useEffect, useState } from "react";
import { Fade } from "react-awesome-reveal";
import { useAuth } from "../../context/Auth.context";
import ShinyText from "../../components/common/ShinyText";
import { BarChart } from "../../components/chartComponents/BarChart";
import { fetchAll } from "../../services/fetchData";
import { DoughnutChart } from "../../components/chartComponents/DoughnutChart";
import { ProgressChart } from "../../components/chartComponents/ProgressChart";
import DropDownTwo from "../../components/common/DropDownTwo";
import Input from "../../components/common/Input";
import InputTwo from "../../components/common/InputTwo";
import PageHeader from "../../components/common/PageHeader";
import StageCards from "../../components/sales-incentive/StageCards";

function Analytics() {
  const { loginUserData } = useAuth();
  const userName = loginUserData.user?.name;

  // fetching data from summary data table for dashboard charts
  const VITE_SIA_CS_SUMMARY_DATA_URL = import.meta.env
    .VITE_SIA_CS_SUMMARY_DATA_URL;
  const VITE_SIA_CS_DETAILED_DATA_URL = import.meta.env
    .VITE_SIA_CS_DETAILED_DATA_URL;

  const [filteredSummaryData, setFilteredSummaryData] = useState([]);
  const [filteredDetailedData, setFilteredDetailedData] = useState([]);

  const fetchSummaryData = async () => {
    let data = [];
    try {
      data = await fetchAll(VITE_SIA_CS_SUMMARY_DATA_URL);
      // filter the data which is equal to REAL STAGE
      const filteredData = data.filter(
        (item) => item.calculation_type === "REAL_STAGE1"
      );
      setFilteredSummaryData(filteredData);
      console.log("summary Table Data: ", filteredData);
    } catch (error) {
      console.error(error);
    }
  };
  const fetchDetailedData = async () => {
    let data = [];
    try {
      data = await fetchAll(VITE_SIA_CS_DETAILED_DATA_URL);
      // filter the data which is equal to REAL STAGE
      const filteredData = data.filter(
        (item) => item.calculation_type === "REAL_STAGE1"
      );
      setFilteredDetailedData(filteredData);
      console.log("Detailed Table Data: ", filteredData);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchSummaryData();
    fetchDetailedData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Total Commission by Sales Channel
  const channelColors = {
    Default: "#A3A3A3",
  };
  const pcrByChannel = {};

  filteredSummaryData.forEach((item) => {
    const channel = item.sales_chanal;
    const eligible = parseFloat(item.eligible_pcr) || 0;

    if (!pcrByChannel[channel]) {
      pcrByChannel[channel] = 0;
    }
    pcrByChannel[channel] += eligible;
  });

  const TotalCommission = {
    labels: Object.keys(pcrByChannel),
    datasets: [
      {
        label: "Total Commission (LKR)",
        data: Object.values(pcrByChannel),
        backgroundColor: Object.keys(pcrByChannel).map(
          (ch) => channelColors[ch] || "#00c950"
        ),
        borderColor: "#",
        borderWidth: 1,
      },
    ],
  };

  // Total Sales Count by Bearer Type pie chart data
  const ftthCount = filteredSummaryData.reduce(
    (sum, item) => sum + (item.total_ftth || 0),
    0
  );
  const lteCount = filteredSummaryData.reduce(
    (sum, item) => sum + (item.total_lte || 0),
    0
  );
  const copperCount = filteredSummaryData.reduce(
    (sum, item) => sum + (item.total_copper || 0),
    0
  );

  const bearerTypeData = {
    labels: ["FTTH", "LTE", "COPPER"],
    datasets: [
      {
        data: [ftthCount, lteCount, copperCount],
        backgroundColor: [
          "#132cb5", // FTTH
          "#ffb900", // PEO
          "#316bc9", // COPPER
        ],
        borderColor: [
          "#132cb5", // FTTH
          "#ffb900",
          "#316bc9",
        ],
        borderWidth: 1,
      },
    ],
  };

  // Total Sales count by Bearer Type Grouped bar charts
  // Helper function to extract bearer and package
  const parseCategory = (incCategory) => {
    const [pkg, bearerRaw] = incCategory.split("-");
    let packageName;
    if (pkg === "AB") packageName = "VOICE";
    else if (pkg === "BB") packageName = "BB";
    else if (pkg === "PEO") packageName = "PEO";
    else if (pkg === "CUPON") packageName = "CUPON";
    else packageName = pkg;

    let bearer = "";
    if (bearerRaw?.toUpperCase().includes("FTTH")) bearer = "FTTH";
    else if (bearerRaw?.toUpperCase().includes("LTE")) bearer = "LTE";
    else if (bearerRaw?.toUpperCase().includes("COPPER")) bearer = "COPPER";
    else bearer = bearerRaw;

    return { bearer, package: packageName };
  };

  // Grouping logic
  const grouped = {};

  filteredDetailedData.forEach(({ inc_category }) => {
    const { bearer, package: pkg } = parseCategory(inc_category);

    if (!grouped[bearer]) {
      grouped[bearer] = { PEO: 0, BB: 0, VOICE: 0, CUPON: 0 };
    }

    if (grouped[bearer][pkg] !== undefined) {
      grouped[bearer][pkg]++;
    }
  });

  // Convert to Chart.js format
  const bearers = Object.keys(grouped); // X-axis: FTTH, LTE, etc.
  const packages = ["PEO", "BB", "VOICE", "CUPON"]; // Grouped bars

  const totalSalesCountByBearerType = {
    labels: bearers, // Bearer Types
    datasets: packages.map((pkg, idx) => ({
      label: pkg,
      data: bearers.map((b) => grouped[b][pkg] || 0),
      backgroundColor: ["#97dd0a", "#f44336", "#2196f3", "#ffc107"][idx], // optional
    })),
  };

  // Grouping logic for commission by bearer type
  const groupedCommission = {};

  filteredDetailedData.forEach(({ inc_category, bearer_commission }) => {
    const { bearer, package: pkg } = parseCategory(inc_category);

    if (!groupedCommission[bearer]) {
      groupedCommission[bearer] = { PEO: 0, BB: 0, VOICE: 0, CUPON: 0 };
    }

    if (groupedCommission[bearer][pkg] !== undefined) {
      groupedCommission[bearer][pkg] += parseFloat(bearer_commission) || 0;
    }
  });
  const totalCommissionByBearerType = {
    labels: bearers, // Bearer Types (reuse from above)
    datasets: packages.map((pkg, idx) => ({
      label: pkg,
      data: bearers.map((b) => groupedCommission[b][pkg] || 0),
      backgroundColor: ["#97dd0a", "#f44336", "#2196f3", "#ffc107"][idx],
    })),
  };

  const stages = [
    {
      stage_color: "bg-gray-600",
      stage_name: "stage 1",
      Total_sales: 38,
    },
    {
      stage_color: "bg-zinc-600",
      stage_name: "stage 2",
      Total_sales: 52,
    },
    {
      stage_color: "bg-slate-600",
      stage_name: "stage 3",
      Total_sales: 70,
    },
  ];

  return (
    <div>
      <ShinyText
        text="Sales Incentive Dashboard"
        disabled={false}
        speed={3}
        className="text-5xl font-bold"
      />
      <h1 className="p-2 text-xl text-white">
        Hello!{" "}
        <span className="text-secondary">
          <ShinyText
            text={userName}
            disabled={false}
            speed={3}
            className="custom-class"
          />
        </span>
      </h1>

      {/* Filteration options for search options */}
      <div className="flex justify-end items-center ">
        <PageHeader placeholder={"Search by SID"} />
      </div>
      {/* Filteration options for charts */}
      <div className="grid grid-cols-3 gap-10 ">
        <DropDownTwo
          name="Salary Month"
          status={["All", "JAN", "FEB", "MAR"]}
        />
        <DropDownTwo name="Region" status={["METRO", "R1", "R2", "R3"]} />
        <DropDownTwo
          name="Sales Channel"
          status={["RTO_KL", "RTO_NG", "RTO_SG", "R2_KL", "R2_NG", "R2_SG"]}
        />
      </div>

      {/* charts goes here */}
      <div className="flex flex-col gap-5">
        <StageCards stages={stages} bearerTypeData={bearerTypeData} />
      </div>

      <main className="grid grid-cols-4 gap-5 mt-5">
        {/* Sales Count by Bearer Type */}
        <div className="col-span-2 p-5 rounded-lg shadow-md bg-black/50 backdrop-blur-2xl">
          <h2 className="p-2 mb-5 font-semibold text-white">
            Sales Count by Bearer Type
          </h2>
          <BarChart data={totalSalesCountByBearerType} />
        </div>
        {/* Commission by Bearer Type */}
        <div className="col-span-2 p-5 rounded-lg shadow-md bg-black/50 backdrop-blur-2xl">
          <h2 className="p-2 mb-5 font-semibold text-white">
            Commission by Bearer Type
          </h2>
          <BarChart data={totalCommissionByBearerType} />
        </div>
      </main>
    </div>
  );
}

export default Analytics;
