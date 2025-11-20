import { FileDown, FileText, RotateCw, Trash2 } from "lucide-react";
import React, { useState } from "react";
import PrimaryBtn from "../common/PrimaryBtn.jsx";
import SecondaryBtn from "../common/SecondaryBtn.jsx";
import TernaryBtn from "../common/TernaryBtn.jsx";
import { generateHtml2Pdf, generatePDF } from "../../utils/pdfUtil";

function DataTable({ columns, data, title }) {
  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 50;

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
    const rowData = data[e.currentTarget.rowIndex - 1];
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

  return (
    <div className="w-full">
      <div className="flex justify-end mb-4">
        <button
          onClick={handleGeneratePDF}
          className="flex gap-2 px-4 py-2 text-white rounded-md bg-gradient-to-r from-secondary to-success"
        >
          <FileText />
          PDF
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
                className="border-b-2 border-primary/30 bg-white hover:bg-gray-100"
                onMouseOver={handleDisplayRow}
              >
                {columns.map((col, colIndex) => (
                  <td
                    key={colIndex}
                    className="text-center text-gray-900 px-2 "
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
    </div>
  );
}

export default DataTable;
