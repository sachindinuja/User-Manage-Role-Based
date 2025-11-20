import React, { useState } from "react";
import PageHeader from "../../components/common/PageHeader";
import DropdownOne from "../../components/common/DropdownOne";
import DataTable from "../../components/common/DataTable";
import { Calculator, FileSpreadsheet } from "lucide-react";
import { toast, ToastContainer } from "react-toastify";
import CustomButton from "../../components/common/CustomButton";
import { submitData } from "../../services/fetchData";
import { formatNumber } from "../../utils/utils";

function IncentiveCalculation() {
  const [salesMonth, setSalesMonth] = useState("");
  const [calculationType, setCalculationType] = useState("");
  const [tableData, setTableData] = useState([]);
  const [loading, setLoading] = useState(false);

  const VITE_SIA_CALCULATION = import.meta.env.VITE_SIA_CALCULATION;
  const VITE_SIA_CS_SUMMARY_DATA_URL = import.meta.env
    .VITE_SIA_CS_SUMMARY_DATA_URL;
  // Month and calculation type options
  const monthOptions = [
    "JAN2025",
    "FEB2025",
    "MAR2025",
    "APR2025",
    "MAY2025",
    "JUN2025",
    "JUL2025",
    "AUG2025",
    "SEP2025",
    "OCT2025",
    "NOV2025",
    "DEC2025",
    "JAN2024",
    "FEB2024",
    "MAR2024",
    "APR2024",
    "MAY2024",
    "JUN2024",
    "JUL2024",
    "AUG2024",
    "SEP2024",
    "OCT2024",
    "NOV2024",
    "DEC2024",
  ];

  const calculationTypeOptions = ["assumed", "real-stage1"];

  // Define columns based on calculation type
  const getColumns = () => {
    const baseColumns = [
      "Employee Number",
      "Sales Channel",
      "Sales Month",
      "Slab Level",
      "Total PCR",
      "Eligible PCR",
      "Total FTTH",
      "Total LTE",
      "Total PEO",
      "Total Copper",
      "Active Sales",
      "Total TX",
    ];

    if (calculationType === "assumed") {
      return [...baseColumns, "Assumed Incentive", "Calculation Date"];
    } else if (calculationType === "real-stage1") {
      return [...baseColumns, "Stage1 Incentive", "Calculation Date"];
    } else {
      return [
        ...baseColumns,
        "Assumed Incentive",
        "Stage1 Incentive",
        "Calculation Date",
      ];
    }
  };

  const payload = {
    sales_month: salesMonth,
    calculation_type: calculationType,
  };

  // Run calculation (POST method)
  const runCalculation = async () => {
    if (!salesMonth || !calculationType) {
      toast.warning("Please select both Sales Month and Calculation Type");
      return;
    }

    setLoading(true);
    toast.info("Running calculation...");

    try {
      // Run the calculation
      const calcResponse = await submitData(VITE_SIA_CALCULATION, payload);
      toast.success(calcResponse.message);
      getSummaryData();
    } catch (err) {
      toast.error(`Failed to run calculation: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  // Get summary data (GET method) - FIXED: This function is now properly connected to the button
  const getSummaryData = async () => {
    setLoading(true);

    try {
      // Fetch the summary data
      const summaryResponse = await fetch(VITE_SIA_CS_SUMMARY_DATA_URL);
      if (!summaryResponse.ok) {
        throw new Error(`HTTP error! status: ${summaryResponse.status}`);
      }
      const summaryData = await summaryResponse.json();

      // Filter data based on selected criteria
      let filteredData = summaryData;

      if (salesMonth) {
        filteredData = filteredData.filter(
          (item) => item.sales_month === salesMonth
        );
      }

      if (calculationType) {
        // Convert frontend type to backend format
        const backendType =
          calculationType === "assumed" ? "ASSUMED" : "REAL_STAGE1";
        filteredData = filteredData.filter(
          (item) => item.calculation_type === backendType
        );
      }

      // Transform data for table display
      const transformedData = filteredData.map((item) => {
        const baseData = {
          "Employee Number": item.employee_number,
          "Sales Channel": item.sales_chanal,
          "Sales Month": item.sales_month,
          "Slab Level": item.slab_level,
          "Total PCR": `${parseFloat(item.total_pcr || 0).toFixed(2)}`,
          "Eligible PCR": `${parseFloat(item.eligible_pcr || 0).toFixed(2)}`,
          "Total FTTH": item.total_ftth || 0,
          "Total LTE": item.total_lte || 0,
          "Total PEO": item.total_peo || 0,
          "Total Copper": item.total_copper || 0,
          "Active Sales": item.active_sales || 0,
          "Total TX": item.total_tx || 0,
          "Calculation Date": new Date(item.calculation_date).toLocaleString(),
        };

        if (calculationType === "assumed") {
          baseData["Assumed Incentive"] = `${parseFloat(
            item.assumed_incentive || 0
          ).toFixed(2)}`;
        } else if (calculationType === "real-stage1") {
          baseData["Stage1 Incentive"] = `${parseFloat(
            item.stage1_incentive || 0
          ).toFixed(2)}`;
        } else {
          baseData["Assumed Incentive"] = `${parseFloat(
            item.assumed_incentive || 0
          ).toFixed(2)}`;
          baseData["Stage1 Incentive"] = `${parseFloat(
            item.stage1_incentive || 0
          ).toFixed(2)}`;
        }

        return baseData;
      });

      setTableData(transformedData);
      toast.success(`Found ${transformedData.length} records`);
    } catch (err) {
      toast.error(`Failed to fetch summary data: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  // Handle dropdown changes
  const handleSalesMonthChange = (value) => {
    setSalesMonth(value);
  };

  const handleCalculationTypeChange = (value) => {
    setCalculationType(value);
  };

  // Calculate total incentive amount
  const calculateTotal = () => {
    if (tableData.length === 0) return "0.00";

    const total = tableData.reduce((sum, item) => {
      let incentiveAmount = 0;

      if (calculationType === "assumed" && item["Assumed Incentive"]) {
        incentiveAmount = parseFloat(
          item["Assumed Incentive"].replace("LKR ", "")
        );
      } else if (
        calculationType === "real-stage1" &&
        item["Stage1 Incentive"]
      ) {
        incentiveAmount = parseFloat(
          item["Stage1 Incentive"].replace("LKR ", "")
        );
      }

      return sum + incentiveAmount;
    }, 0);

    return total.toFixed(2);
  };

  return (
    <div className="block">
      <ToastContainer position="top-center" theme="colored" />
      <PageHeader title={"Incentive Calculation"} />

      <div className="flex mt-5 min-h-185 gap-5">
        {/* left section of calculation*/}
        <div className="flex flex-col gap-5 w-[25%] bg-white rounded-2xl py-20 px-10">
          <div className="flex flex-col justify-center items-center h-40 w-full bg-white inset-ring-2 inset-ring-gray-400 px-5 shadow-2xl rounded-2xl">
            <h1 className="text-md">TOTAL INCENTIVE AMOUNT</h1>
            <h1 className="text-6xl font-bold text-green-600">
              {formatNumber(calculateTotal())}
            </h1>
            <button className="absolute bg-green-600 text-white px-4 py-2 rounded-2xl mt-38">
              View More
            </button>
          </div>
          <DropdownOne
            name="Sales Month"
            value={salesMonth}
            options={["", ...monthOptions]}
            onSelect={handleSalesMonthChange}
          />
          <DropdownOne
            name="Calculation Type"
            value={calculationType}
            options={["", ...calculationTypeOptions]}
            onSelect={handleCalculationTypeChange}
          />
          {/* <DropdownOne
            name="Scheme"
            value={calculationType}
            options={["JAN 2025", "FEB 2025", "MAR 2025"]}
            onSelect={handleCalculationTypeChange}
          /> */}
          <div className="flex  items-center">
            <CustomButton
              name={"Calculate"}
              icon={<Calculator size={32} />}
              onClick={runCalculation}
              css={
                "bg-gradient-to-r from-primary via-orange to-warning flex items-center px-10"
              }
            />
          </div>
        </div>

        {/* right section of calculation */}
        <div className="flex flex-col gap-5 w-full bg-white rounded-2xl">
          {/* Header */}
          <div className="bg-green-500 text-white rounded-tr-2xl rounded-tl-2xl p-4 text-center text-3xl">
            <h1>Incentive Calculation Summary</h1>
          </div>

          {/* summary content UI*/}
          <div className="px-20">
            <DropdownOne
              name="Employee Number"
              value={calculationType}
              options={["998", "999", "1000"]}
              onSelect={handleCalculationTypeChange}
            />
            <div className="grid grid-cols-3 mt-2 ">
              <div className="border-b-2 border-gray-200 p-5">
                <h1 className="text-sm">SALES MONTH</h1>
                <p className="text-gray-700 text-3xl font-bold mt-2">
                  JAN-2025
                </p>
              </div>
              <div className="border-b-2 border-r-2 border-l-2 border-gray-200 p-5">
                <h1 className="text-sm">SALES CHANNEL</h1>
                <p className="text-gray-700 text-3xl font-bold mt-2">RTO-MT</p>
              </div>
              <div className="border-b-2 border-gray-200 p-5">
                <h1 className="text-sm">SALARY MONTH</h1>
                <p className="text-gray-700 text-3xl font-bold mt-2">
                  MAY 2025
                </p>
              </div>
              <div className="border-b-2 border-gray-200 p-5">
                <h1 className="text-sm">SLAB LEVEL</h1>
                <p className="text-gray-700 text-3xl font-bold mt-2">3</p>
              </div>
              <div className="border-b-2 border-r-2 border-l-2 border-gray-200 p-5">
                <h1 className="text-sm">ACTIVE SALES</h1>
                <p className="text-green-600 text-3xl font-bold mt-2">200</p>
              </div>
              <div className="border-b-2 border-gray-200 p-5">
                <h1 className="text-sm">TOTAL TX</h1>
                <p className="text-red-600 text-3xl font-bold mt-2">5</p>
              </div>
            </div>
            <div className="grid grid-cols-6 mt-3 ">
              <div className="border-b-2 border-gray-200 p-5 col-span-3 text-center">
                <h1 className="text-sm">TOTAL PCR</h1>
                <p className="text-green-600 text-4xl font-bold mt-2">
                  68500.00
                </p>
              </div>
              <div className="border-b-2 border-l-2 border-gray-200 p-5 col-span-3 text-center">
                <h1 className="text-sm">TOTAL COMMISSION</h1>
                <p className="text-green-600 text-4xl font-bold mt-2">
                  68500.00
                </p>
              </div>
              <div className="border-b-2 border-r-2 border-gray-200 p-5 col-span-2">
                <h1 className="text-sm">STAGE 1 INCENTIVE</h1>
                <p className="text-gray-700 text-3xl font-bold mt-2">
                  10000.00
                </p>
              </div>
              <div className="border-b-2 border-r-2 border-l-2 border-gray-200 p-5 col-span-2">
                <h1 className="text-sm">STAGE 2 INCENTIVE</h1>
                <p className="text-gray-700 text-3xl font-bold mt-2">0.00</p>
              </div>
              <div className="border-b-2 border-l-2 border-gray-200 p-5 col-span-2">
                <h1 className="text-sm">STAGE 3 INCENTIVE</h1>
                <p className="text-gray-700 text-3xl font-bold mt-2">0.00</p>
              </div>
            </div>
          </div>
          {/* footer */}
          <div className="bg-green-500 grid grid-cols-4 text-white rounded-br-2xl rounded-bl-2xl text-center text-3xl h-full">
            <h1 className="col-span-3 p-4">Incentive Calculation Summary</h1>
            <h1 className="bg-amber-400 rounded-br-2xl px-4 py-8 font-bold">
              Proceed Payment
            </h1>
          </div>
        </div>
      </div>

      {/* Calculation data table */}
      <div className="mt-10">
        <DataTable
          columns={getColumns()}
          data={tableData}
          title="Incentive Summary Report"
        />
      </div>
    </div>
  );
}

export default IncentiveCalculation;
