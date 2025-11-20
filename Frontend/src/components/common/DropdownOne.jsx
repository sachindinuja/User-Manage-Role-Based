import React from "react";

function DropdownOne({ name, value = "", onSelect, options = [] }) {
  return (
    <div className="flex flex-col">
      <label htmlFor={name} className="font-semibold text-black mb-1">
        {name}
      </label>
      <select
        id={name}
        value={value}
        onChange={(e) => onSelect(e.target.value)}
        className="px-3 text-black py-3 w-[80%] bg-white/20 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
      >
        {options.map((option, index) => (
          <option
            key={index}
            value={option}
            className="text-black bg-transparent"
          >
            {option || "Select..."}
          </option>
        ))}
      </select>
    </div>
  );
}

export default DropdownOne;
