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

function BearerRates() {
  const { loginUserData } = useAuth();
  const userName = loginUserData.user?.name;


  const { openModal, closeModal } = useModal();

  // State to store fetched data
  const [response, setResponse] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("Active");

  // API URL for SIA_DL_BEARER_RATES
  const VITE_SIA_DL_BEARER_RATES_URL = import.meta.env.VITE_SIA_DL_BEARER_RATES_URL;

  // Initial payload aligned with SiaDlBearerRate model
  const initialPayload = {
    ID: "",
    BEARER_RATE_ID: "",
    SERVICE_TYPE: "",
    ORDER_TYPE: "",
    COMPLIANCE: "",
    SLAB_1: "",
    SLAB_2: "",
    SLAB_3: "",
    SLAB_4: "",
    SLAB_5: "",
    SLAB_6: "",
    CREATED_DATE: "",
    CREATED_USER: userName,
    UPDATED_DATE: "",
    UPDATED_USER: userName,
    STATUS: "Active",
  };

  // State for form payload
  const [payload, setPayload] = useState(initialPayload);
  const ruleName = "bearerRates";

  // Handle form submission to add data
  const handleSubmit = async () => {
    const errors = validations(payload, ruleName, false, response);
    
    if (errors.length > 0) {
      errors.forEach((err) => toast.warning(err));
      return;
    }
    try {
      const response = await submitData(VITE_SIA_DL_BEARER_RATES_URL, {
        ...payload,
        SLAB_1: payload.SLAB_1 ? parseFloat(payload.SLAB_1) : null,
        SLAB_2: payload.SLAB_2 ? parseFloat(payload.SLAB_2) : null,
        SLAB_3: payload.SLAB_3 ? parseFloat(payload.SLAB_3) : null,
        SLAB_4: payload.SLAB_4 ? parseFloat(payload.SLAB_4) : null,
        SLAB_5: payload.SLAB_5 ? parseFloat(payload.SLAB_5) : null,
        SLAB_6: payload.SLAB_6 ? parseFloat(payload.SLAB_6) : null,
      });
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
    openModal("addBearerRate");
  };

  // Fetch data on component mount and when statusFilter changes
  useEffect(() => {
    getData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [statusFilter]);

  // Table columns aligned with the hand-drawn sketch and SiaDlBearerRate model
  const columns = [
    "Service Type",
    "Order Type",
    "Compliance",
    "Slab 1",
    "Slab 2",
    "Slab 3",
    "Slab 4",
    "Slab 5",
    "Slab 6",
    "Status",
    
  ];

  // Map response data to table format
  const data = response
    .filter((item) =>
      item.SERVICE_TYPE.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.ORDER_TYPE.toLowerCase().includes(searchQuery.toLowerCase())
    )
    .sort((a, b) => a.ID - b.ID)
    .map((item) => ({
      id: item.ID,
      "Service Type": item.SERVICE_TYPE,
      "Order Type": item.ORDER_TYPE,
      Compliance: item.COMPLIANCE,
      "Slab 1": item.SLAB_1 || "",
      "Slab 2": item.SLAB_2 || "",
      "Slab 3": item.SLAB_3 || "",
      "Slab 4": item.SLAB_4 || "",
      "Slab 5": item.SLAB_5 || "",
      "Slab 6": item.SLAB_6 || "",
      Status: item.STATUS,
    }));

  // Fetch data from API
  const getData = async () => {
    let data = [];
    if (statusFilter === "Active") {
      data = await fetchData(VITE_SIA_DL_BEARER_RATES_URL);
    } else {
      data = await fetchInactiveData(VITE_SIA_DL_BEARER_RATES_URL);
    }
    setResponse(data);
  };

  // Fetch data for updating a specific record
  const handleUpdate = async (id) => {
    
    const selectedData = response.find((item) => item.ID === id);
    if (selectedData) {
      if(selectedData.STATUS === "Inactive"){
        toast.warning("Cannot be update Inactive record.");
        return;
      }
      toast.info(`Fetching data for update...`);
      setPayload({
        ID: selectedData.ID,
        BEARER_RATE_ID: selectedData.BEARER_RATE_ID,
        SERVICE_TYPE: selectedData.SERVICE_TYPE,
        ORDER_TYPE: selectedData.ORDER_TYPE,
        COMPLIANCE: selectedData.COMPLIANCE,
        SLAB_1: selectedData.SLAB_1,
        SLAB_2: selectedData.SLAB_2,
        SLAB_3: selectedData.SLAB_3,
        SLAB_4: selectedData.SLAB_4,
        SLAB_5: selectedData.SLAB_5,
        SLAB_6: selectedData.SLAB_6,
        CREATED_DATE: selectedData.CREATED_DATE,
        CREATED_USER: selectedData.CREATED_USER,
        UPDATED_DATE: selectedData.UPDATED_DATE,
        UPDATED_USER: selectedData.UPDATED_USER,
        STATUS: selectedData.STATUS,
      });
      openModal("updateBearerRate");
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
          VITE_SIA_DL_BEARER_RATES_URL,
          payload.ID,
          {
            ...payload,
            SLAB_1: payload.SLAB_1 ? parseFloat(payload.SLAB_1) : null,
            SLAB_2: payload.SLAB_2 ? parseFloat(payload.SLAB_2) : null,
            SLAB_3: payload.SLAB_3 ? parseFloat(payload.SLAB_3) : null,
            SLAB_4: payload.SLAB_4 ? parseFloat(payload.SLAB_4) : null,
            SLAB_5: payload.SLAB_5 ? parseFloat(payload.SLAB_5) : null,
            SLAB_6: payload.SLAB_6 ? parseFloat(payload.SLAB_6) : null,
          }
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

    if(statusFilter === "Inactive"){
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
          await updateData(VITE_SIA_DL_BEARER_RATES_URL, id, updatedPayload);
          toast.success("Bearer Rate Inactivated");
          getData(); // Refresh table
        } catch (error) {
          toast.error("Failed to Inactivate", error);
        }
      } else {
        toast.info("Inactivation cancelled");
      }
    }
  };

  return (
    <div className="block">
      <ToastContainer position="top-right" theme="colored" />
      <PageHeader
        title="Bearer Rates"
        placeholder={"Search by Service Type or Order Type"}
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
        title="Bearer Rates List"
      />
      <div className="flex justify-end pr-2 m-4">
        <PrimaryBtn
          name="Add New Bearer Rate"
          icon={<PlusCircle />}
          onClick={handleAddData}
        />
      </div>
      <ModalPopup
        title="Add Bearer Rate"
        sideImg={sideImg}
        modalName="addBearerRate"
      >
        <div className="grid w-full grid-cols-2 gap-5 px-10 ml-5">
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
            name="Compliance"
            type="text"
            value={payload.COMPLIANCE}
            onChange={(e) =>
              setPayload({ ...payload, COMPLIANCE: e.target.value })
            }
          />
          <Input
            name="Slab 1"
            type="number"
            step="0.01"
            value={payload.SLAB_1}
            onChange={(e) =>
              setPayload({ ...payload, SLAB_1: e.target.value })
            }
          />
          <Input
            name="Slab 2"
            type="number"
            step="0.01"
            value={payload.SLAB_2}
            onChange={(e) =>
              setPayload({ ...payload, SLAB_2: e.target.value })
            }
          />
          <Input
            name="Slab 3"
            type="number"
            step="0.01"
            value={payload.SLAB_3}
            onChange={(e) =>
              setPayload({ ...payload, SLAB_3: e.target.value })
            }
          />
          <Input
            name="Slab 4"
            type="number"
            step="0.01"
            value={payload.SLAB_4}
            onChange={(e) =>
              setPayload({ ...payload, SLAB_4: e.target.value })
            }
          />
          <Input
            name="Slab 5"
            type="number"
            step="0.01"
            value={payload.SLAB_5}
            onChange={(e) =>
              setPayload({ ...payload, SLAB_5: e.target.value })
            }
          />
          <Input
            name="Slab 6"
            type="number"
            step="0.01"
            value={payload.SLAB_6}
            onChange={(e) =>
              setPayload({ ...payload, SLAB_6: e.target.value })
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
        title="Update Bearer Rate"
        sideImg={sideImg}
        modalName="updateBearerRate"
      >
        <div className="grid w-full grid-cols-2 gap-5 px-10 ml-5">
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
            name="Compliance"
            type="text"
            value={payload.COMPLIANCE}
            onChange={(e) =>
              setPayload({ ...payload, COMPLIANCE: e.target.value })
            }
          />
          <Input
            name="Slab 1"
            type="number"
            step="0.01"
            value={payload.SLAB_1}
            onChange={(e) =>
              setPayload({ ...payload, SLAB_1: e.target.value })
            }
          />
          <Input
            name="Slab 2"
            type="number"
            step="0.01"
            value={payload.SLAB_2}
            onChange={(e) =>
              setPayload({ ...payload, SLAB_2: e.target.value })
            }
          />
          <Input
            name="Slab 3"
            type="number"
            step="0.01"
            value={payload.SLAB_3}
            onChange={(e) =>
              setPayload({ ...payload, SLAB_3: e.target.value })
            }
          />
          <Input
            name="Slab 4"
            type="number"
            step="0.01"
            value={payload.SLAB_4}
            onChange={(e) =>
              setPayload({ ...payload, SLAB_4: e.target.value })
            }
          />
          <Input
            name="Slab 5"
            type="number"
            step="0.01"
            value={payload.SLAB_5}
            onChange={(e) =>
              setPayload({ ...payload, SLAB_5: e.target.value })
            }
          />
          <Input
            name="Slab 6"
            type="number"
            step="0.01"
            value={payload.SLAB_6}
            onChange={(e) =>
              setPayload({ ...payload, SLAB_6: e.target.value })
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

export default BearerRates;