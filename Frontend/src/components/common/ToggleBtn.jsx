import React from "react";

function ToggleBtn({ statusFilter, setStatusFilter }) {
  return (
    <div className="flex justify-center gap-2 p-1 mt-10 rounded-2xl">
      <button
        className={
          statusFilter === "Active"
            ? "bg-success text-white p-2 rounded-md w-32"
            : "w-32 p-2 rounded-md bg-gray-400 text-gray-100"
        }
        onClick={() => setStatusFilter("Active")}
      >
        Active
      </button>
      <button
        className={
          statusFilter === "Inactive"
            ? "bg-warning text-white p-2 rounded-md w-32"
            : "w-32 p-2 rounded-md bg-gray-400 text-gray-100"
        }
        onClick={() => setStatusFilter("Inactive")}
      >
        Inactive
      </button>
    </div>
  );
}

export default ToggleBtn;
