import React from "react";

function Input({ name, type, value, onChange, readOnly, list }) {
  return (
    <div className="flex flex-col">
      <label
        htmlFor="Service Number"
        className="my-1 font-semibold text-gray-500"
      >
        {name}
        <span className="text-red-600"> *</span>
      </label>
      <input
        type={type}
        name={name}
        readOnly={readOnly}
        value={value}
        list={list}
        onChange={onChange}
        className="w-[80%] border-2 border-gray-200 rounded-lg p-2"
      />
    </div>
  );
}

export default Input;
