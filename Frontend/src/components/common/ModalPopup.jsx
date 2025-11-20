import { X } from "lucide-react";
import React from "react";
import { useModal } from "../../context/ModalContext";

function ModalPopup({ title, sideImg, children, modalName }) {
  const { activeModal, closeModal } = useModal();

  if (activeModal !== modalName) {
    return null;
  }

  return (
    <div>
      <div className="fixed inset-0 z-50 flex items-center justify-center ">
        {/* Dark overlay */}
        <div className="absolute inset-0 bg-black/50"></div>
        <div className="absolute inset-0 backdrop-blur-md"></div>
        {/* Main content */}
        <div className="relative z-10 flex flex-col p-5 overflow-y-auto bg-white rounded-lg shadow-2xl w-350 h-[80vh]">
          <div className="flex items-center justify-end" onClick={closeModal}>
            <X className="p-2 bg-gray-200 rounded-full" size={40} />
          </div>
          {/* for the image and title */}
          <div className="flex justify-between pl-10 pr-20">
            <h2 className="text-4xl font-semibold w-60 text-primary">
              {title}
            </h2>
            <img
              src={sideImg}
              alt=""
              className="h-80 rounded-md transform scale-80"
            />
          </div>
          {/* childrens comes after this */}
          <div className="mt-2">{children}</div>
        </div>
      </div>
    </div>
  );
}

export default ModalPopup;
