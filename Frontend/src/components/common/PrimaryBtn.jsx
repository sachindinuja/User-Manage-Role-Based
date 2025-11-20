import React from "react";

function PrimaryBtn({ name, icon, onClick, disabled }) {
  return (
    <div>
      <button
        className={`flex gap-2 p-2 text-white rounded-md bg-primary ${
          disabled ? "opacity-50 cursor-not-allowed" : ""
        }`}
        onClick={onClick}
        disabled={disabled}
      >
        {icon}
        {name}
      </button>
    </div>
  );
}

export default PrimaryBtn;
