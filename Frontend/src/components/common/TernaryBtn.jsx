import React from "react";

function TernaryBtn({ name, icon, onClick }) {
  return (
    <div>
      <button
        className="flex gap-2 p-2 text-white rounded-md bg-success"
        onClick={onClick}
      >
        {icon}
        {name}
      </button>
    </div>
  );
}

export default TernaryBtn;
