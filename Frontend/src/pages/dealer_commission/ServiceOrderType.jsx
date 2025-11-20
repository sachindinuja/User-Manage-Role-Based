import React, { useEffect, useState } from "react";
import PageHeader from "../../components/common/PageHeader";
import ActionTable from "../../components/common/ActionTable";
import PrimaryBtn from "../../components/common/PrimaryBtn";
import ModalPopup from "../../components/common/ModalPopup";
import { useModal } from "../../context/ModalContext";
import { PlusCircle } from "lucide-react";
import {
  fetchData,
  fetchInactiveData,
  submitData,
  updateData,
} from "../../services/fetchData";
import sideImg from "../../assets/images/dealer.png";
import Input from "../../components/common/Input";
import Dropdown from "../../components/common/Dropdown";
import { ToastContainer, toast } from "react-toastify";
import Swal from "sweetalert2";
import ToggleBtn from "../../components/common/ToggleBtn";
import { useAuth } from "../../context/Auth.context";
import { validations } from "../../utils/DealerValidation";
import DropdownThree from "../../components/common/DropdownThree";

function ServiceOrderType() {
  const { loginUserData } = useAuth();
  const userName = loginUserData.user?.name;

  const { openModal, closeModal } = useModal();

  // State to store fetched data
  const [response, setResponse] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("Active");
  const [dropdownOptions, setDropdownOptions] = useState([""]);

  // API URL for SIA_DL_SO_TYPES
  const VITE_SIA_DL_SO_TYPES_URL = import.meta.env.VITE_SIA_DL_SO_TYPES_URL;

  // Initial payload aligned with SiaDlSoTypes model
  const initialPayload = {
    ID: "",
    SO_TYPE_ID: "",
    PRODUCT: "",
    SERVICE_TYPE: "",
    ORDER_TYPE: "",
    CREATED_DATE: "",
    CREATED_USER: userName,
    UPDATED_DATE: "",
    UPDATED_USER: userName,
    STATUS: "Active",
  };

  // State for form payload
  const [payload, setPayload] = useState(initialPayload);
  const ruleName = "serviceOrderType";

  // Handle form submission to add data
  const handleSubmit = async () => {
    const errors = validations(payload, ruleName, false, response);
    
    if (errors.length > 0) {
      errors.forEach((err) => toast.warning(err));
      return; // Prevent submission
    }
    try {
      const response = await submitData(VITE_SIA_DL_SO_TYPES_URL, payload);
      toast.success("Data submitted successfully!", response);
      getData(); // Refresh table data
      closeModal();
    } catch (error) {
      toast.error("Error submitting data:", error);
    }
  };

  // Open modal to add new data
  const handleAddData = () => {
    setPayload(initialPayload); // Reset payload
    openModal("addProduct");
  };

  // Fetch data on component mount and when statusFilter changes
  useEffect(() => {
    getData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [statusFilter]);

  // Table columns aligned with SiaDlSoTypes model
  const columns = [
    
    "Product",
    "Service Type",
    "Order Type",
    "Status",
  ];

  // Map response data to table format
  const data = response
    .filter((item) =>
      item.PRODUCT.toLowerCase().includes(searchQuery.toLowerCase())
    )
    .sort((a, b) => a.ID - b.ID)
    .map((item) => ({
      id: item.ID,
      "SO Type ID": item.SO_TYPE_ID,
      Product: item.PRODUCT,
      "Service Type": item.SERVICE_TYPE,
      "Order Type": item.ORDER_TYPE,
      Status: item.STATUS,
    }));

  // Fetch data from API
  const getData = async () => {
    let data = [];
    if (statusFilter === "Active") {
      data = await fetchData(VITE_SIA_DL_SO_TYPES_URL);
    } else {
      data = await fetchInactiveData(VITE_SIA_DL_SO_TYPES_URL);
    }
    setResponse(data);
  };

  // Fetch data for updating a specific record
  const handleUpdate = async (id) => {
    
    const selectedData = response.find((item) => item.ID === id);
    if (selectedData) {
      if (selectedData.STATUS ==="Inactive") {
        toast.warning("Cannot be update Inactive record.");
        return;
      }
        toast.info(`Fetching data for update...`);
        setPayload({
        ID: selectedData.ID,
        PRODUCT: selectedData.PRODUCT,
        SERVICE_TYPE: selectedData.SERVICE_TYPE,
        ORDER_TYPE: selectedData.ORDER_TYPE,
        CREATED_DATE: selectedData.CREATED_DATE,
        CREATED_USER: selectedData.CREATED_USER,
        UPDATED_DATE: selectedData.UPDATED_DATE,
        UPDATED_USER: selectedData.UPDATED_USER,
        STATUS: selectedData.STATUS,
        });
      openModal("updateProduct");
    } else {
      toast.error("Data not found for the selected ID.");
    }
  };

  // Handle update submission
  const handleUpdatedData = async () => {
    const errors = validations(payload, ruleName, true);
    
    if (errors.length > 0) {
      errors.forEach((err) => toast.warning(err));
      return; // Prevent update
    }
    try {
      if (payload.ID) {
        const updatedData = await updateData(
          VITE_SIA_DL_SO_TYPES_URL,
          payload.ID,
          payload
        );
        toast.success("Data updated successfully!", updatedData);
        getData(); // Refresh table data
        closeModal();
      }
    } catch (error) {
      toast.error("Error updating data:", error);
    }
  };

  // Handle inactivation with confirmation
  const handleInactive = async (id) => {
    const selectedData = response.find((item) => item.ID === id);

    if (statusFilter === "Inactive"){
      toast.warning("Cannot active inactive data.");
      return;
    }

    if (selectedData && selectedData.STATUS === "Active") {
      const result = await Swal.fire({
        title: "Are you sure?",
        text: "This cannot be reverted",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#34a853",
        cancelButtonColor: "#d33",
        confirmButtonText: "Yes, inactivate it!",
      });

      if (result.isConfirmed) {
        try {
          const updatedPayload = { ...selectedData, STATUS: "Inactive" };
          await updateData(VITE_SIA_DL_SO_TYPES_URL, id, updatedPayload);
          toast.success("Rule Inactivated");
          getData(); // Refresh table
        } catch (error) {
          toast.error("Failed to Inactivate", error);
        }
      } else {
        toast.info("Inactivation cancelled");
      }
    }
  };

  // get unique product values and set to dropdown options
    const getUniqueValues = () => {
      const uniqueProducts = [
        ...new Set(response.map((item) => item.PRODUCT).filter(Boolean)),
      ];
      setDropdownOptions(uniqueProducts);
    };
  
    useEffect(() => {
      getUniqueValues();
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [response]);
    
  return (
    <div className="block">
      <ToastContainer position="top-right" theme="colored" />
      <PageHeader
        title="Service Order Type"
        placeholder={"Search by Product"}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
      />

      {/* Active/Inactive toggle button */}
      <ToggleBtn
        statusFilter={statusFilter}
        setStatusFilter={setStatusFilter}
      />

      <ActionTable
        columns={columns}
        data={data}
        handleUpdate={handleUpdate}
        isInactive={true}
        handleInactive={handleInactive}
        title="Service Order Type List"
      />
      <div className="flex justify-end pr-2 m-4">
        <PrimaryBtn
          name="Add New Product"
          icon={<PlusCircle />}
          onClick={handleAddData}
        />
      </div>
      <ModalPopup
        title="Service Order Type"
        sideImg={sideImg}
        modalName="addProduct"
      >
        <div className="grid w-full grid-cols-2 gap-5 px-10 ml-5">
          
          <DropdownThree
            name="Product"
            value={payload.PRODUCT}
            status={dropdownOptions}
            onChange={(e) => {
              const selected = e.target.value;

              if (selected === "add_new") {
                const newOption = prompt("Enter new product name:");
                if (newOption) {
                  setDropdownOptions((prev) => [...prev, newOption]);
                  setPayload((prev) => ({
                    ...prev,
                    PRODUCT: newOption,
                  }));
                }
              } else {
                setPayload((prev) => ({
                  ...prev,
                  PRODUCT: selected,
                }));
              }
            }}
          />
          <Input
            name="Service Type"
            type="text"
            value={payload.SERVICE_TYPE}
            onChange={(e) =>
              setPayload({ ...payload, SERVICE_TYPE: e.target.value })
            }
          />
          <Input
            name="Order Type"
            type="text"
            value={payload.ORDER_TYPE}
            onChange={(e) =>
              setPayload({ ...payload, ORDER_TYPE: e.target.value })
            }
          />
          <Input
            name="Created User"
            type="text"
            value={payload.CREATED_USER}
            onChange={(e) =>
              setPayload({ ...payload, CREATED_USER: e.target.value })
            }
          />
        </div>
        <div className="flex justify-center w-full gap-10 mt-10">
          <button
            className="w-32 p-2 text-white rounded-md bg-success"
            onClick={handleSubmit}
          >
            Submit
          </button>
          <button
            className="w-32 p-2 text-white rounded-md bg-warning"
            onClick={closeModal}
          >
            Cancel
          </button>
        </div>
      </ModalPopup>

      {/* Update Modal */}
      <ModalPopup
        title="Update Service Order Type"
        sideImg={sideImg}
        modalName="updateProduct"
      >
        <div className="grid w-full grid-cols-2 gap-5 px-10 ml-5">
          
          <Input
            name="Product"
            type="text"
            value={payload.PRODUCT}
            onChange={(e) =>
              setPayload({ ...payload, PRODUCT: e.target.value })
            }
          />
          <Input
            name="Service Type"
            type="text"
            value={payload.SERVICE_TYPE}
            onChange={(e) =>
              setPayload({ ...payload, SERVICE_TYPE: e.target.value })
            }
          />
          <Input
            name="Order Type"
            type="text"
            value={payload.ORDER_TYPE}
            onChange={(e) =>
              setPayload({ ...payload, ORDER_TYPE: e.target.value })
            }
          />
          <Dropdown
            name="Status"
            value={payload.STATUS}
            status={["Active", "Inactive"]}
            onChange={(e) =>
              setPayload({ ...payload, STATUS: e.target.value })
            }
          />
          <Input
            name="Updated User"
            type="text"
            value={payload.UPDATED_USER}
            onChange={(e) =>
              setPayload({ ...payload, UPDATED_USER: e.target.value })
            }
          />
        </div>
        <div className="flex justify-center w-full gap-10 mt-10">
          <button
            className="w-32 p-2 text-white rounded-md bg-primary"
            onClick={handleUpdatedData}
          >
            Update
          </button>
          <button
            className="w-32 p-2 text-white rounded-md bg-warning"
            onClick={closeModal}
          >
            Cancel
          </button>
        </div>
      </ModalPopup>
    </div>
  );
}

export default ServiceOrderType;