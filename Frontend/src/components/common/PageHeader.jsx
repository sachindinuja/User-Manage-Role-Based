import { SearchIcon } from "lucide-react";
import React from "react";

function PageHeader({ title, placeholder, searchQuery, setSearchQuery }) {
  return (
    <div className="flex items-center justify-between p-2">
      <h1 className="text-3xl font-semibold text-white">{title}</h1>
      {placeholder && (
        <div className="flex items-center w-auto p-1 text-white rounded-lg border-1 bg-white/10 ">
          <input
            type="text"
            placeholder={placeholder}
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
            }}
            className="mr-2 outline-none"
          />
          <SearchIcon />
        </div>
      )}
    </div>
  );
}

export default PageHeader;
