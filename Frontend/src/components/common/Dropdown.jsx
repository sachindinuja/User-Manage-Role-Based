import React from "react";

function Dropdown({ name, value, onChange, status }) {
  return (
    <div className="flex flex-col">
      <label htmlFor={name} className="my-1 font-semibold text-gray-500">
        {name}
      </label>
      <select
        className="px-3 py-3 w-[80%] text-gray-700 bg-gray-50 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
        value={value}
        onChange={onChange}
      >
        {status.map((option, index) => (
          <option key={index} value={option}>
            {option.toString()}
          </option>
        ))}
      </select>
    </div>
  );
}

export default Dropdown;
