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

function BlacklistPackages() {
  const { loginUserData } = useAuth();
  const userName = loginUserData.user?.name;


  const { openModal, closeModal } = useModal();

  // State to store fetched data
  const [response, setResponse] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("Active");
  const [dropdownOptions, setDropdownOptions] = useState([""]);

  // API URL for SIA_DL_BLACKLIST_PACKAGES
  const VITE_SIA_DL_BLACKLIST_PCR_URL = import.meta.env.VITE_SIA_DL_BLACKLIST_PCR_URL;

  // Initial payload aligned with SiaDlBlacklistPackages model
  const initialPayload = {
    ID: "",
    BLP_ID: "",
    TARIFF_ID: "",
    PACKAGE_NAME: "",
    CREATED_DATE: "",
    CREATED_USER: userName,
    UPDATED_DATE: "",
    UPDATED_USER: userName,
    STATUS: "Active",
  };

  // State for form payload
  const [payload, setPayload] = useState(initialPayload);
  const ruleName = "blackList";

  // Handle form submission to add data
  const handleSubmit = async () => {
    const errors = validations(payload, ruleName, false, response);
    
    if (errors.length > 0) {
      errors.forEach((err) => toast.warning(err));
      return; // Prevent submission
    }
    try {
      const response = await submitData(VITE_SIA_DL_BLACKLIST_PCR_URL, payload);
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
    openModal("addBlacklistPackage");
  };

  // Fetch data on component mount and when statusFilter changes
  useEffect(() => {
    getData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [statusFilter]);

  // Table columns aligned with SiaDlBlacklistPackages model
  const columns = [
    
    "Tariff ID",
    "Package Name",
    "Status",
  ];

  // Map response data to table format
  const data = response
    .filter((item) =>
      item.PACKAGE_NAME.toLowerCase().includes(searchQuery.toLowerCase())
    )
    .sort((a, b) => a.ID - b.ID)
    .map((item) => ({
      id: item.ID,
      "BLP ID": item.BLP_ID,
      "Tariff ID": item.TARIFF_ID,
      "Package Name": item.PACKAGE_NAME,
      Status: item.STATUS,
    }));

  // Fetch data from API
  const getData = async () => {
    let data = [];
    if (statusFilter === "Active") {
      data = await fetchData(VITE_SIA_DL_BLACKLIST_PCR_URL);
    } else {
      data = await fetchInactiveData(VITE_SIA_DL_BLACKLIST_PCR_URL);
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
        BLP_ID: selectedData.BLP_ID,
        TARIFF_ID: selectedData.TARIFF_ID,
        PACKAGE_NAME: selectedData.PACKAGE_NAME,
        CREATED_DATE: selectedData.CREATED_DATE,
        CREATED_USER: selectedData.CREATED_USER,
        UPDATED_DATE: selectedData.UPDATED_DATE,
        UPDATED_USER: selectedData.UPDATED_USER,
        STATUS: selectedData.STATUS,
      });
      openModal("updateBlacklistPackage");
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
          VITE_SIA_DL_BLACKLIST_PCR_URL,
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
          await updateData(VITE_SIA_DL_BLACKLIST_PCR_URL, id, updatedPayload);
          toast.success("Blacklist Package Inactivated");
          getData(); // Refresh table
        } catch (error) {
          toast.error("Failed to Inactivate", error);
        }
      } else {
        toast.info("Inactivation cancelled");
      }
    }
  };

  // get unique package values and set to dropdown options
  const getUniqueValues = () => {
    const uniquePackages = [
      ...new Set(response.map((item) => item.PACKAGE_NAME).filter(Boolean)),
    ];
    setDropdownOptions(uniquePackages);
  };

  useEffect(() => {
    getUniqueValues();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [response]);

  return (
    <div className="block">
      <ToastContainer position="top-right" theme="colored" />
      <PageHeader
        title="Blacklist Packages"
        placeholder={"Search by Package Name"}
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
        title="Blacklist Packages List"
      />
      <div className="flex justify-end pr-2 m-4">
        <PrimaryBtn
          name="Add New Blacklist Package"
          icon={<PlusCircle />}
          onClick={handleAddData}
        />
      </div>
      <ModalPopup
        title="Add Blacklist Package"
        sideImg={sideImg}
        modalName="addBlacklistPackage"
      >
        <div className="grid w-full grid-cols-2 gap-5 px-10 ml-5">
          <Input
            name="Tariff ID"
            type="text"
            value={payload.TARIFF_ID}
            onChange={(e) =>
              setPayload({ ...payload, TARIFF_ID: e.target.value })
            }
          />
          <DropdownThree
            name="Package"
            value={payload.PACKAGE_NAME}
            status={dropdownOptions}
            onChange={(e) => {
              const selected = e.target.value;

              if (selected === "add_new") {
                const newOption = prompt("Enter new package name:");
                if (newOption) {
                  setDropdownOptions((prev) => [...prev, newOption]);
                  setPayload((prev) => ({
                    ...prev,
                    PACKAGE_NAME: newOption,
                  }));
                }
              } else {
                setPayload((prev) => ({
                  ...prev,
                  PACKAGE_NAME: selected,
                }));
              }
            }}
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
        title="Update Blacklist Package"
        sideImg={sideImg}
        modalName="updateBlacklistPackage"
      >
        <div className="grid w-full grid-cols-2 gap-5 px-10 ml-5">
          <Input
            name="Tariff ID"
            type="text"
            value={payload.TARIFF_ID}
            onChange={(e) =>
              setPayload({ ...payload, TARIFF_ID: e.target.value })
            }
          />
          <Input
            name="Package Name"
            type="text"
            value={payload.PACKAGE_NAME}
            onChange={(e) =>
              setPayload({ ...payload, PACKAGE_NAME: e.target.value })
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

export default BlacklistPackages;