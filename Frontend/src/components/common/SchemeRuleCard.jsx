import React from "react";
import { CheckIcon } from "lucide-react";

export function SchemeRuleCard({ label, checked, onChange, status }) {
  return (
    <div
      onClick={onChange}
      className={`
        relative p-4 rounded-lg cursor-pointer transition-all
        ${
          checked
            ? "bg-green-500 border-2 border-green-500"
            : "bg-gray-500 hover:border-gray-500"
        }
      `}
    >
      <div className="flex justify-between items-start mb-2">
        <h3 className="font-medium text-xl text-white">{label}</h3>
        <div
          className={`
          w-5 h-5 rounded-full flex items-center justify-center
          ${checked ? "bg-white" : "bg-black/30"}
        `}
        >
          {checked && <CheckIcon className="h-3 w-3 text-blue-600" />}
        </div>
      </div>
      <div className="text-sm text-gray-100">{status}</div>
    </div>
  );
}
