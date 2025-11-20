import React from "react";

function CustomButton({ name, icon, onClick, css }) {
  return (
    <div>
      <button
        className={`flex gap-2 p-2 text-white rounded-md ${css} w-auto font-semibold`}
        onClick={onClick}
      >
        {icon}
        {name}
      </button>
    </div>
  );
}

export default CustomButton;
