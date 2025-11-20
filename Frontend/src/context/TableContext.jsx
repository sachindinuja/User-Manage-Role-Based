/* eslint-disable react-refresh/only-export-components */
import React, { useState, createContext, useContext } from "react";

const TableContext = createContext();

// Custom hook to use the TableContext
export const useTable = () => {
  return useContext(TableContext);
};

export const TableProvider = ({ children }) => {
  // store open/close state for each table
  const [openTables, setOpenTables] = useState({});

  const toggleTable = (tableName) => {
    setOpenTables((prevState) => ({
      ...prevState,
      [tableName]: !prevState[tableName],
    }));
  };

  const value = { openTables, toggleTable };
  return (
    <TableContext.Provider value={value}>{children}</TableContext.Provider>
  );
};
