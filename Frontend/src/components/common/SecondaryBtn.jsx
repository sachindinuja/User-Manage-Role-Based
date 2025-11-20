import React from "react";

function SecondaryBtn({ name, icon, onClick }) {
  return (
    <div>
      <button
        className="flex gap-2 p-2 text-white rounded-md bg-warning"
        onClick={onClick}
      >
        {icon}
        {name}
      </button>
    </div>
  );
}

export default SecondaryBtn;
