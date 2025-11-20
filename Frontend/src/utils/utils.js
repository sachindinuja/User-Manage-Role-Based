import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

import * as XLSX from "xlsx";
import { saveAs } from "file-saver";

import Swal from "sweetalert2";

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

// format te values
export function formatNumber(num) {
  if (num >= 1_000_000)
    return (num / 1_000_000).toFixed(1).replace(/\.0$/, "") + "M";
  if (num >= 1_000) return (num / 1_000).toFixed(1).replace(/\.0$/, "") + "K";
  return num;
}

// Random Color Generator
// Utility to generate an array of random colors
export function getRandomColors(count) {
  return Array.from(
    { length: count },
    () =>
      `#${Math.floor(Math.random() * 16777215)
        .toString(16)
        .padStart(6, "0")}`
  );
}

export const handleExport = (data, title) => {
  const confirmed = window.confirm("Do you want to download the Excel file?");
  if (!confirmed) return;
  // Step 1: Convert JSON to worksheet
  const worksheet = XLSX.utils.json_to_sheet(data);

  // Step 2: Create a workbook
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "CalculationData");

  // Step 3: Generate Excel file (in binary string format)
  const excelBuffer = XLSX.write(workbook, {
    bookType: "xlsx",
    type: "array",
  });

  // Step 4: Save using file-saver
  const dataBlob = new Blob([excelBuffer], {
    type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8",
  });

  saveAs(dataBlob, `${title}_excel.xlsx`);
};

// Trigger scheme status when first scheme is defined
export function isFirstSchemeDefined() {
  return localStorage.getItem("firstSchemeDefined") === "true";
}
export function setFirstSchemeDefined() {
  localStorage.setItem("firstSchemeDefined", "true");
}
export function resetFirstSchemeDefined() {
  localStorage.setItem("firstSchemeDefined", "false");
}

export async function fetchIsFirstSchemeDefined(apiUrl) {
  try {
    const response = await fetch(apiUrl);
    const schemes = await response.json();

    const hasScheme = schemes && schemes.length > 0;
    localStorage.setItem("firstSchemeDefined", hasScheme ? "true" : "false");
    return hasScheme;
  } catch (error) {
    console.error("Error checking schemes:", error);
    return false;
  }
}

// handling prompt to create scheme for rule changes
let intervalRef = null;

export function startSchemePromptInterval() {
  if (!intervalRef) {
    intervalRef = setInterval(() => {
      Swal.fire({
        title: "New Scheme Required",
        text: "You have made changes to rules. Please create a new scheme to apply these changes.",
        icon: "info",
        confirmButtonText: "Create Scheme",
        allowOutsideClick: false,
        allowEscapeKey: false,
      }).then((result) => {
        if (result.isConfirmed) {
          stopSchemePromptInterval();
          window.location.href = "/salesincentive/newschema";
        }
      });
    }, 1000 * 10); // every 5 seconds
  }
}

export function stopSchemePromptInterval() {
  if (intervalRef) {
    clearInterval(intervalRef);
    intervalRef = null;
  }
}
