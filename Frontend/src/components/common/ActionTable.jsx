import {
  AlertCircle,
  Eye,
  FileDown,
  FileText,
  Sheet,
  SquarePen,
  Trash2,
} from "lucide-react";
import React, { useState } from "react";
import PrimaryBtn from "./PrimaryBtn";
import SecondaryBtn from "./SecondaryBtn";
import { generateHtml2Pdf, generatePDF } from "../../utils/pdfUtil";
import TernaryBtn from "./TernaryBtn";
import { handleExport } from "../../utils/utils";
import { useNavigate } from "react-router-dom";
import CustomButton from "./CustomButton";

function ActionTable({
  columns,
  data,
  handleUpdate,
  title,
  handleInactive,
  isInactive,
  changedRowIds = [],
  isActiveTab,
  handleViewMore,
}) {
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 10;

  // Calculate the indices for slicing the data
  const startIndex = (currentPage - 1) * rowsPerPage;
  const endIndex = startIndex + rowsPerPage;
  const paginatedData = data.slice(startIndex, endIndex);

  // Calculate total pages
  const totalPages = Math.ceil(data.length / rowsPerPage);

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  // generate a full Report for all the data
  const handleGeneratePDF = () => {
    generatePDF(columns, data, title);
    console.log(columns);
  };

  // display row data as tool tip on hover
  const handleDisplayRow = (e) => {
    const rowIndex = e.currentTarget.rowIndex - 1;
    const rowData = paginatedData[rowIndex];
    const tooltipContent = Object.entries(rowData)
      .map(([key, value]) => `${key}: ${value}`)
      .join("\n");
    e.currentTarget.title = tooltipContent;
  };

  // handle single data report generation
  const handleReportGenerate = (id) => {
    const rowData = data.find((item) => item.id === id);
    generateHtml2Pdf(rowData, title);
    console.log("RowData: ", rowData);
  };

  // viewmore button click

  return (
    <div className="w-full">
      <div className="flex justify-end mb-4 gap-2">
        <button
          onClick={handleGeneratePDF}
          className="flex gap-2 px-4 py-2 text-white rounded-md bg-gradient-to-r from-secondary to-success"
        >
          <FileText />
          PDF
        </button>
        <button
          onClick={() => handleExport(data, title)}
          className="flex gap-1 p-2 bg-gradient-to-r from-warning to-primary to-65% rounded-md text-white font-semibold"
        >
          <Sheet />
          EXCEL
        </button>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full bg-black/30 overflow-x-auto">
          <thead className="text-white rounded-md bg-primary">
            <tr>
              {columns.map((col, index) => (
                <th key={index} className="p-2 font-semibold text-center">
                  {col}
                </th>
              ))}
              <th className="p-2 font-semibold text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {/* Display paginated rows */}
            {paginatedData.map((row, rowIndex) => (
              <tr
                key={rowIndex}
                className={`border-b-2 border-primary/30 hover:bg-black/30 backdrop-blur-2xl`}
                onMouseOver={handleDisplayRow}
              >
                {columns.map((col, colIndex) => (
                  <td
                    key={colIndex}
                    className={`text-center text-gray-100 px-2 ${
                      changedRowIds.includes(row.id)
                        ? "text-yellow-500 font-bold"
                        : ""
                    }`}
                  >
                    {col === "Status" ? (
                      <span
                        className={`font-semibold ${
                          row[col] === "Active"
                            ? "bg-green-500 text-white py-1 px-2 rounded-md"
                            : "bg-warning text-white py-1 px-2 rounded-md"
                        }`}
                      >
                        {row[col] || "N/A"}
                      </span>
                    ) : (
                      row[col] || "N/A"
                    )}
                  </td>
                ))}
                <td className="flex justify-center gap-5 p-2 text-gray-600">
                  {changedRowIds.includes(row.id) && (
                    <div className="relative h-5 w-5 p-4 bg-yellow-600 rounded-xl">
                      <div className="bg-yellow-300 p-3 rounded-2xl -ml-3 -mt-3 opacity-80"></div>
                    </div>
                  )}
                  {isActiveTab && (
                    <>
                      <PrimaryBtn
                        name="Update"
                        icon={<SquarePen />}
                        onClick={() => handleUpdate(row.id)}
                        disabled={!changedRowIds.includes(row.id)}
                      />
                      {isInactive && (
                        <SecondaryBtn
                          name="Inactive"
                          icon={<Trash2 />}
                          onClick={() => handleInactive(row.id)}
                        />
                      )}
                    </>
                  )}
                  {handleViewMore && (
                    <CustomButton
                      name="View Scheme"
                      icon={<Eye />}
                      css={"bg-gradient-to-r from-primary to-warning"}
                      onClick={() => handleViewMore(row.id)}
                    />
                  )}
                  <TernaryBtn
                    name={"Report"}
                    icon={<FileDown />}
                    onClick={() => handleReportGenerate(row.id)}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination Controls */}
      <div className="flex items-center justify-between mt-4">
        <button
          onClick={handlePreviousPage}
          disabled={currentPage === 1}
          className={`px-4 py-2 rounded ${
            currentPage === 1
              ? "bg-gray-300 text-gray-500 cursor-not-allowed"
              : "bg-primary text-white"
          }`}
        >
          Previous
        </button>
        <span className="text-gray-200">
          Page {currentPage} of {totalPages}
        </span>
        <button
          onClick={handleNextPage}
          disabled={currentPage === totalPages}
          className={`px-4 py-2 rounded ${
            currentPage === totalPages
              ? "bg-gray-300 text-gray-500 cursor-not-allowed"
              : "bg-primary text-white"
          }`}
        >
          Next
        </button>
      </div>
      {/* simple alert for changed */}
      {changedRowIds.length > 0 && (
        <div className="flex items-center gap-3 text-white p-5 my-2 bg-yellow-400 rounded-2xl mx-[35%] text-2xl">
          <AlertCircle color="yellow" size={50} />
          <div className="block">
            <h2 className="text-black font-semibold">
              New Calculation Rule Month (CRM) Required
            </h2>
            <p className="text-gray-800 text-sm">
              {changedRowIds.length} rule(s) have been changed. Create New CRM
              before calculation process.
            </p>
            <button
              className="bg-primary p-2 rounded-md mt-3 inset-ring-2 inset-ring-secondary"
              onClick={() => {
                navigate("/salesincentive/newschema", { replace: true });
              }}
            >
              Create CRM
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default ActionTable;
