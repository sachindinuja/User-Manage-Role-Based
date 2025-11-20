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

function SlabDema() {
  const { loginUserData } = useAuth();
  const userName = loginUserData.user?.name;

  const { openModal, closeModal } = useModal();

  // State to store fetched data
  const [response, setResponse] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("Active");

  // API URL for SIA_DL_SLAB_LEVELS
  const VITE_SIA_DL_SLAB_LEVELS_URL = import.meta.env.VITE_SIA_DL_SLAB_LEVELS_URL;

  // Initial payload aligned with SiaDlSlabLevels model
  const initialPayload = {
    ID: "",
    SLAB_ID: "",
    SLAB_LEVEL: "",
    UPPER_RANGE: "",
    LOWER_RANGE: "",
    CREATED_DATE: "",
    CREATED_USER: userName,
    UPDATED_DATE: "",
    UPDATED_USER: userName,
    STATUS: "Active",
  };

  // State for form payload
  const [payload, setPayload] = useState(initialPayload);
  const ruleName = "slabDemarcation";

  // Handle form submission to add data
  const handleSubmit = async () => {
    const errors = validations(payload, ruleName, false, response);
    
    if (errors.length > 0) {
      errors.forEach((err) => toast.warning(err));
      return; // Prevent submission
    }
    try {
      const response = await submitData(VITE_SIA_DL_SLAB_LEVELS_URL, {
        ...payload,
        UPPER_RANGE: parseFloat(payload.UPPER_RANGE),
        LOWER_RANGE: parseFloat(payload.LOWER_RANGE),
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
    openModal("addSlabDemarcation");
  };

  // Fetch data on component mount and when statusFilter changes
  useEffect(() => {
    getData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [statusFilter]);

  // Table columns aligned with SiaDlSlabLevels model
  const columns = [
    
    "Slab Level",
    "Upper Range",
    "Lower Range",
    "Status",
  ];

  // Map response data to table format
  const data = response
    .filter((item) =>
      item.SLAB_LEVEL.toLowerCase().includes(searchQuery.toLowerCase())
    )
    .sort((a, b) => a.ID - b.ID)
    .map((item) => ({
      id: item.ID,
      "Slab ID": item.SLAB_ID,
      "Slab Level": item.SLAB_LEVEL,
      "Upper Range": item.UPPER_RANGE,
      "Lower Range": item.LOWER_RANGE,
      Status: item.STATUS,
    }));

  // Fetch data from API
  const getData = async () => {
    let data = [];
    if (statusFilter === "Active") {
      data = await fetchData(VITE_SIA_DL_SLAB_LEVELS_URL);
    } else {
      data = await fetchInactiveData(VITE_SIA_DL_SLAB_LEVELS_URL);
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
        SLAB_ID: selectedData.SLAB_ID,
        SLAB_LEVEL: selectedData.SLAB_LEVEL,
        UPPER_RANGE: selectedData.UPPER_RANGE,
        LOWER_RANGE: selectedData.LOWER_RANGE,
        CREATED_DATE: selectedData.CREATED_DATE,
        CREATED_USER: selectedData.CREATED_USER,
        UPDATED_DATE: selectedData.UPDATED_DATE,
        UPDATED_USER: selectedData.UPDATED_USER,
        STATUS: selectedData.STATUS,
      });
      openModal("updateSlabDemarcation");
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
          VITE_SIA_DL_SLAB_LEVELS_URL,
          payload.ID,
          {
            ...payload,
            UPPER_RANGE: parseFloat(payload.UPPER_RANGE),
            LOWER_RANGE: parseFloat(payload.LOWER_RANGE),
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
          await updateData(VITE_SIA_DL_SLAB_LEVELS_URL, id, updatedPayload);
          toast.success("Slab Demarcation Inactivated");
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
        title="Slab Demarcation"
        placeholder={"Search by Slab Level"}
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
        title="Slab Demarcation List"
      />
      <div className="flex justify-end pr-2 m-4">
        <PrimaryBtn
          name="Add New Slab Demarcation"
          icon={<PlusCircle />}
          onClick={handleAddData}
        />
      </div>
      <ModalPopup
        title="Add Slab Demarcation"
        sideImg={sideImg}
        modalName="addSlabDemarcation"
      >
        <div className="grid w-full grid-cols-2 gap-5 px-10 ml-5">
          <Input
            name="Slab Level"
            type="text"
            value={payload.SLAB_LEVEL}
            onChange={(e) =>
              setPayload({ ...payload, SLAB_LEVEL: e.target.value })
            }
          />
          <Input
            name="Upper Range"
            type="number"
            step="0.01"
            value={payload.UPPER_RANGE}
            onChange={(e) =>
              setPayload({ ...payload, UPPER_RANGE: e.target.value })
            }
          />
          <Input
            name="Lower Range"
            type="number"
            step="0.01"
            value={payload.LOWER_RANGE}
            onChange={(e) =>
              setPayload({ ...payload, LOWER_RANGE: e.target.value })
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
        title="Update Slab Demarcation"
        sideImg={sideImg}
        modalName="updateSlabDemarcation"
      >
        <div className="grid w-full grid-cols-2 gap-5 px-10 ml-5">
          <Input
            name="Slab Level"
            type="text"
            value={payload.SLAB_LEVEL}
            onChange={(e) =>
              setPayload({ ...payload, SLAB_LEVEL: e.target.value })
            }
          />
          <Input
            name="Upper Range"
            type="number"
            step="0.01"
            value={payload.UPPER_RANGE}
            onChange={(e) =>
              setPayload({ ...payload, UPPER_RANGE: e.target.value })
            }
          />
          <Input
            name="Lower Range"
            type="number"
            step="0.01"
            value={payload.LOWER_RANGE}
            onChange={(e) =>
              setPayload({ ...payload, LOWER_RANGE: e.target.value })
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

export default SlabDema;