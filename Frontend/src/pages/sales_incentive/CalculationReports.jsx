import React, { useEffect, useState } from "react";
import PageHeader from "../../components/common/PageHeader";
import { FileClock, FileText, FileX } from "lucide-react";
import DetailReport from "./DetailReport";
import SummaryReport from "./SummaryReport";
import SummaryFile from "./IneligibleReport";
import { fetchAll } from "../../services/fetchData";
import IneligibleReport from "./IneligibleReport";

function CalculationReports() {
  const VITE_SIA_CS_SUMMARY_DATA_URL = import.meta.env
    .VITE_SIA_CS_SUMMARY_DATA_URL;
  const VITE_SIA_CS_DETAILED_DATA_URL = import.meta.env
    .VITE_SIA_CS_DETAILED_DATA_URL;
  const VITE_SIA_CS_TERMINATION_DATA_URL = import.meta.env
    .VITE_SIA_CS_TERMINATION_DATA_URL;

  const [activeTab, setActiveTab] = useState("summary");
  const [response, setResponse] = useState([]);

  const [summaryCount, setSummaryCount] = useState(0);
  const [detailedCount, setDetailedCount] = useState(0);
  const [terminationCount, setTerminationCount] = useState(0);

  // fetch data from API For Calculation Report
  const fetchCalculationReportData = async () => {
    let data = [];
    if (activeTab === "summary") {
      data = await fetchAll(VITE_SIA_CS_SUMMARY_DATA_URL);
      console.log("summary Report data: ", data);
      setSummaryCount(data.length);
    } else if (activeTab === "detailed") {
      data = await fetchAll(VITE_SIA_CS_DETAILED_DATA_URL);
      console.log("Detailed Report data: ", data);
      setDetailedCount(data.length);
    } else if (activeTab === "termination") {
      data = await fetchAll(VITE_SIA_CS_TERMINATION_DATA_URL);
      console.log("Termination Report data: ", data);
      setTerminationCount(data.length);
    }
    setResponse(data);
  };

  useEffect(() => {
    fetchCalculationReportData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeTab]);

  return (
    <div className="block">
      {/* page Header */}
      <PageHeader title={"Calculation Reports"} />

      {/* tab view section for report categories */}
      <div className="flex gap-10 mt-10 items-center p-2 bg-black/20 rounded-md">
        <div
          className={`flex gap-2 text-white items-center font-semibold  ${
            activeTab === "summary"
              ? "border-blue-500 border-b-4 bg-blue-500/40 rounded-xl"
              : "border-transparent"
          } p-3`}
          onClick={() => setActiveTab("summary")}
        >
          <FileClock />
          <p>
            SUMMARY REPORT{" "}
            <span className="p-1 rounded-full bg-blue-600 text-sm">
              {summaryCount}
            </span>
          </p>
        </div>
        <div
          className={`flex gap-2 text-white items-center font-semibold  ${
            activeTab === "detailed"
              ? "border-yellow-500 border-b-4 bg-yellow-500/40 rounded-xl"
              : "border-transparent"
          } p-3`}
          onClick={() => setActiveTab("detailed")}
        >
          <FileText />
          <p>
            DETAILED REPORT{" "}
            <span className="p-1 rounded-full bg-yellow-600 text-sm">
              {detailedCount}
            </span>
          </p>
        </div>
        <div
          className={`flex gap-2 text-white items-center font-semibold  ${
            activeTab === "termination"
              ? "border-red-500 border-b-4 bg-red-500/40 rounded-xl"
              : "border-transparent"
          } p-3`}
          onClick={() => setActiveTab("termination")}
        >
          <FileX />
          <p>
            INELIGIBLE REPORT{" "}
            <span className="p-1 rounded-full bg-red-500 text-sm">
              {terminationCount}
            </span>
          </p>
        </div>
      </div>

      {/* Main content according to report category*/}
      <main className="mt-10 p-5 bg-black/30 rounded-lg shadow-lg">
        <div>
          {activeTab === "summary" && (
            <SummaryReport summaryReportData={response} />
          )}
        </div>
        <div>
          {activeTab === "detailed" && (
            <DetailReport detailedReportData={response} />
          )}
        </div>
        <div>
          {activeTab === "termination" && (
            <IneligibleReport terminationReportData={response} />
          )}
        </div>
      </main>
    </div>
  );
}

export default CalculationReports;
