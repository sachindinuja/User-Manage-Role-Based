import React from "react";

function DropdownThree({ name, value, onChange, status }) {
  return (
    <div className="flex flex-col">
      <label htmlFor="dropdown" className="font-semibold text-gray-500">
        {name}
      </label>
      <select
        className="px-3 text-black py-3 w-[80%] bg-white/20 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        value={value}
        onChange={onChange}
      >
        {/* Placeholder option */}
        <option value="" disabled>
          {`-- Select an ${name} --`}
        </option>

        {status.map((option, index) => (
          <option key={index} value={option} className="text-black">
            {option.toString()}
          </option>
        ))}

        {/* Separator */}
        <option disabled>──────────────────────────────</option>

        {/* Add New Option */}
        <option value="add_new">➕ Add New...</option>
      </select>
    </div>
  );
}

export default DropdownThree;
