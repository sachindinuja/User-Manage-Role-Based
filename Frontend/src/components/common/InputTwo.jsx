import React from "react";

function InputTwo({ name, type, value, onChange }) {
  return (
    <div className="flex flex-col">
      <label htmlFor="Service Number" className="font-semibold text-white">
        {name}
      </label>
      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        className="w-[80%] border-2 border-gray-200 rounded-lg p-2 text-white"
      />
    </div>
  );
}

export default InputTwo;
