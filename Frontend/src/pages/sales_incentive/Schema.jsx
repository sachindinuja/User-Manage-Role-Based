import React, { useEffect, useState } from "react";
import PageHeader from "../../components/common/PageHeader";
import ActionTable from "../../components/common/ActionTable";
import { fetchData } from "../../services/fetchData";
import {
  setFirstSchemeDefined,
  resetFirstSchemeDefined,
} from "../../utils/utils";
import { useModal } from "../../context/ModalContext";
import ModalPopup from "../../components/common/ModalPopup";
import sideImg from "../../assets/images/userSideImg.png";
import {
  CalendarCheck,
  CalendarFold,
  ClipboardCheck,
  Copy,
  SquareCheckBig,
} from "lucide-react";

function Schema() {
  const VITE_SIA_SCHEME_URL = import.meta.env.VITE_SIA_SCHEME_URL;
  const [response, setResponse] = useState([]);
  const [rowData, setRowData] = useState({});
  const { openModal } = useModal();
  const [isCreatingInstant, setIsCreatingInstant] = useState(false);

  const getData = async () => {
    let data = [];
    data = await fetchData(VITE_SIA_SCHEME_URL);
    setResponse(data);
    if (data.length > 0) {
      setFirstSchemeDefined(); // If There is a scheme
    } else {
      resetFirstSchemeDefined(); // If there is No scheme defined
    }
  };

  useEffect(() => {
    getData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const columns = [
    "Schemes Number",
    "Schemes Name",
    "Schemes Start Date",
    "Status",
  ];
  const data = response
    .sort((a, b) => a.ID - b.ID)
    .map((item) => ({
      id: item.ID,
      "Schemes Number": item.SCHEME_NUM,
      "Schemes Name": item.SCHEME_NAME,
      "Schemes Start Date": item.START_DATE,
      Status: item.STATUS,
    }));

  const handleViewMore = (id) => {
    openModal("ViewMore");
    try {
      const selectedData = response.find((item) => item.ID === id);
      if (selectedData) {
        setRowData(selectedData);
      }
      console.log("RowData: ", rowData);
    } catch (error) {
      console.error("Error: ", error);
    }
  };
  // Function to get the month abbreviation
  const getMonthAbbreviation = (date) => {
    const months = [
      "JAN",
      "FEB",
      "MAR",
      "APR",
      "MAY",
      "JUN",
      "JUL",
      "AUG",
      "SEP",
      "OCT",
      "NOV",
      "DEC",
    ];
    return months[date.getMonth()];
  };

  // Function to get the last month's scheme
  const getLastMonthScheme = () => {
    if (response.length === 0) return null;

    // Sort by creation date to get the most recent scheme
    const sortedSchemes = [...response].sort(
      (a, b) => new Date(b.CREATE_DATE) - new Date(a.CREATE_DATE)
    );
    console.log("Sorted Schemes: ", sortedSchemes);

    return sortedSchemes[0];
  };

  // Function to create instant rule scheme
  const handleInstantRuleScheme = async () => {
    const lastScheme = getLastMonthScheme();

    if (!lastScheme) {
      alert("No existing scheme found to copy from.");
      return;
    }

    setIsCreatingInstant(true);

    try {
      const currentDate = new Date();
      const currentMonthAbbr = getMonthAbbreviation(currentDate);

      // Create new scheme number with IRS prefix and current month
      const newSchemeNumber = `${lastScheme.SCHEME_NUM}IRS${currentMonthAbbr}`;

      // Prepare the new scheme data
      const newSchemeData = {
        SCHEME_NUM: newSchemeNumber,
        SCHEME_NAME: `${lastScheme.SCHEME_NAME} - Copy`,
        START_DATE: currentDate.toISOString().split("T")[0], // Current date as start date
        STATUS: lastScheme.STATUS,
        CREATE_DATE: currentDate.toISOString(),
        RULES: lastScheme.RULES, // Copy all rules from the original scheme
      };

      // API call to create new scheme
      const response = await fetch(VITE_SIA_SCHEME_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newSchemeData),
      });

      if (response.ok) {
        alert(
          `Instant Rule Scheme created successfully! New scheme number: ${newSchemeNumber}`
        );
        // Refresh the data to show the new scheme
        await getData();
      } else {
        throw new Error("Failed to create instant rule scheme");
      }
    } catch (error) {
      console.error("Error creating instant rule scheme: ", error);
      alert("Failed to create instant rule scheme. Please try again.");
    } finally {
      setIsCreatingInstant(false);
    }
  };

  return (
    <div className="block">
      <PageHeader title={"View Calculation Rules"} />

      {/* calculation data table */}
      <ActionTable
        columns={columns}
        data={data}
        title="Scheme Report"
        handleViewMore={handleViewMore}
      />
      {/* Instant Rule Scheme Button */}
      <div className="mb-4 flex justify-end px-4">
        <button
          onClick={handleInstantRuleScheme}
          disabled={isCreatingInstant || response.length === 0}
          className="flex items-center gap-2 bg-orange-500 hover:bg-orange-600 disabled:bg-gray-400 text-white px-4 py-2 rounded-lg transition-colors duration-200"
        >
          <Copy size={20} />
          {isCreatingInstant ? "Creating..." : "Instant Rule Scheme"}
        </button>
      </div>

      {/* Modal to View more data */}
      <ModalPopup
        title="View Scheme Details"
        sideImg={sideImg}
        modalName="ViewMore"
      >
        <div className="grid w-full grid-cols-4 gap-5 px-10 ml-5">
          <div className="flex gap-3 bg-white p-3 rounded-2xl shadow-md inset-ring-1 inset-ring-gray-400/30">
            <ClipboardCheck size={38} color="#ff8000" />
            <div>
              <p className="text-xl font-semibold ">Scheme Name</p>
              <p className="text-sm my-1">{rowData.SCHEME_NAME}</p>
            </div>
          </div>
          <div className="flex gap-3 bg-white p-3 rounded-2xl shadow-md inset-ring-1 inset-ring-gray-400/30">
            <CalendarCheck size={38} color="#ff8000" />
            <div>
              <p className="text-xl font-semibold ">Start Date</p>
              <p className="text-sm my-1">
                {new Date(rowData.START_DATE).toLocaleString("en-US", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </p>
            </div>
          </div>
          <div className="flex gap-3 bg-white p-3 rounded-2xl shadow-md inset-ring-1 inset-ring-gray-400/30">
            <CalendarFold size={38} color="#ff8000" />
            <div>
              <p className="text-xl font-semibold ">Created Date</p>
              <p className="text-sm my-1">
                {new Date(rowData.CREATE_DATE).toLocaleString("en-US", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </p>
            </div>
          </div>
          <div className="flex gap-3 bg-white p-3 rounded-2xl shadow-md inset-ring-1 inset-ring-gray-400/30">
            <CalendarFold size={38} color="#ff8000" />
            <div>
              <p className="text-xl font-semibold ">Created User</p>
              <p className="text-sm my-1">{rowData.CREATE_USER}</p>
            </div>
          </div>
        </div>

        {/* rules section */}
        <div className="grid w-full grid-cols-4 gap-5 px-10 ml-5 mt-10  p-4">
          {(() => {
            // Group RT_IDs by TABLE_NAME
            const tableMap = {};
            rowData.RULES?.forEach((rule) => {
              if (!tableMap[rule.TABLE_NAME]) {
                tableMap[rule.TABLE_NAME] = [];
              }
              tableMap[rule.TABLE_NAME].push(rule.RT_ID);
            });

            // Render each unique TABLE_NAME with its RT_IDs
            return Object.entries(tableMap).map(([tableName, rtIds], idx) => (
              <div
                className="flex flex-col gap-2 bg-white p-3 rounded-2xl shadow-md inset-ring-1 inset-ring-gray-400/30"
                key={idx}
              >
                <div className="flex items-center gap-3">
                  <SquareCheckBig size={32} color="#ff8000" />
                  <p className="text-xl font-semibold">{tableName}</p>
                </div>
                <div className="flex flex-wrap gap-2 mt-2">
                  {rtIds
                    .sort((a, b) => a - b)
                    .map((rtId, i) => (
                      <span
                        key={i}
                        className="text-sm inset-ring-1 inset-ring-gray-400 rounded-md p-2 w-12 text-center"
                      >
                        {rtId}
                      </span>
                    ))}
                </div>
              </div>
            ));
          })()}
        </div>
      </ModalPopup>
    </div>
  );
}

export default Schema;
