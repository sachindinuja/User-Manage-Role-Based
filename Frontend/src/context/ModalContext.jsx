import React, { createContext, useContext, useState } from "react";

// Create the context
const ModalContext = createContext();

// Custom hook to use the ModalContext
export const useModal = () => useContext(ModalContext);

// Provider component
export const ModalProvider = ({ children }) => {
  const [activeModal, setActiveModal] = useState(null);

  const openModal = (modalName) => {
    setActiveModal(modalName);
  };
  const closeModal = () => {
    setActiveModal(null);
  };

  return (
    <ModalContext.Provider value={{ activeModal, openModal, closeModal }}>
      {children}
    </ModalContext.Provider>
  );
};
