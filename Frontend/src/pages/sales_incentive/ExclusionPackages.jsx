import React, { useEffect, useState } from "react";
import PageHeader from "../../components/common/PageHeader";
import ActionTable from "../../components/common/ActionTable";
import PrimaryBtn from "../../components/common/PrimaryBtn";
import ModalPopup from "../../components/common/ModalPopup";
import { useModal } from "../../context/ModalContext";
import {
  fetchData,
  fetchInactiveData,
  submitData,
  updateData,
} from "../../services/fetchData";
import sideImg from "../../assets/images/userSideImg.png";
import { PlusCircle } from "lucide-react";
import Input from "../../components/common/Input";
import { toast, ToastContainer } from "react-toastify";
import Dropdown from "../../components/common/Dropdown";
import Swal from "sweetalert2";
import ToggleBtn from "../../components/common/ToggleBtn";
import { validations } from "../../utils/FormValidations";
import AIBtn from "../../components/common/AIBtn";
import { useAuth } from "../../context/Auth.context";
import { isFirstSchemeDefined } from "../../utils/utils";

function ExclusionPackages() {
  const { loginUserData } = useAuth();
  const userName = loginUserData.user?.name;

  const { openModal, closeModal } = useModal();

  // creating a state to setData
  const [response, setResponse] = React.useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("Active");

  const [changedRowIds, setChangedRowIds] = useState([]);

  // Restore changedRowIds from localStorage on mount
  useEffect(() => {
    const storedChangedRowIds = localStorage.getItem(ruleName);
    if (storedChangedRowIds) {
      setChangedRowIds(JSON.parse(storedChangedRowIds));
      // Swal.fire({
      //   title: "New Scheme Required",
      //   text: "You have made changes to rules. Please create a new scheme to apply these changes.",
      //   icon: "info",
      //   confirmButtonText: "Create Scheme",
      // }).then((result) => {
      //   if (result.isConfirmed) {
      //     window.location.href = "/salesincentive/newschema";
      //   }
      // });
    } else {
      setChangedRowIds([]);
    }
  }, []);

  // Call this when a rule is changed (add/update/inactivate)
  const handleRuleChange = (id) => {
    setChangedRowIds((prev) => {
      const updated = [...prev, id];
      localStorage.setItem(ruleName, JSON.stringify(updated));
      return updated;
    });

    Swal.fire({
      title: "New Scheme Required",
      text: "You have made changes to rules. Please create a new scheme to apply these changes.",
      icon: "info",
      confirmButtonText: "Create Scheme",
    }).then((result) => {
      if (result.isConfirmed) {
        window.location.href = "/salesincentive/newschema";
      }
    });
  };

  //add API URL here for easy access for all the functions in this page
  const VITE_SIA_EXCLUSION_PCKG_URL = import.meta.env
    .VITE_SIA_EXCLUSION_PCKG_URL;

  // create a state object to set the data
  const initialPayload = {
    ID: "",
    EXP_ID: "",
    TARIFF_ID: "",
    TARIFF_NAME: "",
    EXCLUSION: true,
    CREATED_DATE: "",
    CREATED_USER: userName,
    UPDATED_DATE: "",
    UPDATED_USER: userName,
    STATUS: "Active",
  };
  const [payload, setPayload] = useState(initialPayload);
  const ruleName = "exclusionPackages";

  // handle the form submission to add the data
  const handleSubmit = async () => {
    const errors = validations(payload, ruleName, false, response);

    if (errors.length > 0) {
      errors.forEach((err) => toast.warning(err));
      return; // Prevent submission
    }
    try {
      const response = await submitData(VITE_SIA_EXCLUSION_PCKG_URL, payload);
      toast.success("Data submitted successfully!", response);
      handleRuleChange(response.ID);
      getData(); // Refresh the table data
      // After handleRuleChange
      Swal.fire({
        title: "New Scheme Required",
        text: "You have made changes to rules. Please create a new scheme to apply these changes.",
        icon: "info",
        confirmButtonText: "Create Scheme",
      }).then((result) => {
        if (result.isConfirmed) {
          window.location.href = "/salesincentive/newschema";
        }
      });
      closeModal();
    } catch (error) {
      toast.error("Error submitting data:", error);
    }
  };

  const handleAddData = () => {
    setPayload(initialPayload);
    openModal("addPackage");
  };

  useEffect(() => {
    getData(); // calling the function when loading
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [statusFilter]);

  // writing a function to get the data from database
  const getData = async () => {
    let data = [];
    if (statusFilter === "Active") {
      data = await fetchData(VITE_SIA_EXCLUSION_PCKG_URL);
    } else {
      data = await fetchInactiveData(VITE_SIA_EXCLUSION_PCKG_URL);
    }
    setResponse(data);
  };

  const columns = [
    "id",
    "EXP_ID",
    "Tariff ID",
    "Tariff Name",
    "Exclusion",
    "Status",
  ];
  const data = response
    .filter((item) =>
      item.TARIFF_ID.toLowerCase().includes(searchQuery.toLowerCase())
    )
    .sort((a, b) => a.ID - b.ID)
    .map((item) => ({
      id: item.ID,
      EXP_ID: item.EXP_ID,
      "Tariff ID": item.TARIFF_ID,
      "Tariff Name": item.TARIFF_NAME,
      Exclusion: item.EXCLUSION ? "Yes" : "No",
      Status: item.STATUS,
    }));

  // fetching data for update when clicking on the update button of a row
  const handleUpdate = async (id) => {
    toast.info(`Fetching data for update...`);
    console.log(id);
    // find the data from the response array using the id
    const selectedData = response.find((item) => item.ID === id);
    // set the payload with the selected data
    if (selectedData) {
      setPayload({
        ID: selectedData.ID,
        EXP_ID: selectedData.EXP_ID,
        TARIFF_ID: selectedData.TARIFF_ID,
        TARIFF_NAME: selectedData.TARIFF_NAME,
        EXCLUSION: selectedData.EXCLUSION,
        CREATED_DATE: selectedData.CREATED_DATE,
        CREATED_USER: selectedData.CREATED_USER,
        UPDATED_DATE: selectedData.UPDATED_DATE,
        UPDATED_USER: selectedData.UPDATED_USER,
        STATUS: selectedData.STATUS,
      });
      openModal("updateExPackage");
    } else {
      toast.error("Data not found for the selected ID.");
    }
  };
  // updating the database with the updated data when click on update button in form
  const handleUpdatedData = async () => {
    const errors = validations(payload, ruleName, true);

    if (errors.length > 0) {
      errors.forEach((err) => toast.warning(err));
      return; // Prevent update
    }
    try {
      if (payload.ID) {
        const updatedData = await updateData(
          VITE_SIA_EXCLUSION_PCKG_URL,
          payload.ID,
          payload
        );
        toast.success("Data updated successfully!", updatedData);
        getData(); // Refresh the table data
        closeModal();
      }
    } catch (error) {
      toast.error("Error updating data:", error);
    }
  };

  // handling the inactivation of data with SWAL alert lib
  const handleInactive = async (id) => {
    const selectedData = response.find((item) => item.ID === id);
    if (selectedData && selectedData.STATUS === "Active") {
      const result = await Swal.fire({
        title: "Are you sure?",
        text: "This cannot be revert",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#34a853",
        cancelButtonColor: "#d33",
        confirmButtonText: "Yes, inactivate it!",
      });

      if (result.isConfirmed) {
        try {
          const updatedPayload = { ...selectedData, STATUS: "Inactive" };
          await updateData(VITE_SIA_EXCLUSION_PCKG_URL, id, updatedPayload);
          toast.success("Rule Inactivated");
          handleRuleChange(id);
          getData(); // Refresh table
          // After handleRuleChange
          Swal.fire({
            title: "New Scheme Required",
            text: "You have made changes to rules. Please create a new scheme to apply these changes.",
            icon: "info",
            confirmButtonText: "Create Scheme",
          }).then((result) => {
            if (result.isConfirmed) {
              window.location.href = "/salesincentive/newschema";
            }
          });
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
      {/* Page header */}
      <PageHeader
        title="Exclusion Packages"
        placeholder={"Search by Tariff ID"}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
      />
      {/* acive inactive toggle button */}
      <ToggleBtn
        statusFilter={statusFilter}
        setStatusFilter={setStatusFilter}
      />

      {/* Action Table */}
      <ActionTable
        columns={columns}
        data={data}
        title={"Exclusion Package Report"}
        handleUpdate={handleUpdate}
        isInactive={true}
        handleInactive={handleInactive}
        changedRowIds={changedRowIds}
        isFirstSchemeDefined={isFirstSchemeDefined()}
        isActiveTab={statusFilter === "Active"}
      />
      {/* Modal popup */}
      <div className="flex justify-end pr-2 mt-5">
        <AIBtn
          name="New Package"
          icon={<PlusCircle />}
          onClick={handleAddData}
        />
      </div>
      {/* new adding modal */}
      <ModalPopup
        title="Add New Exclusion Packages"
        sideImg={sideImg}
        modalName="addPackage"
      >
        <div className="grid w-full grid-cols-3 gap-5 px-10">
          <Input
            name="EXP_ID"
            type="text"
            value={payload.EXP_ID}
            onChange={(e) => setPayload({ ...payload, EXP_ID: e.target.value })}
          />
          <Input
            name="Tariff ID"
            type="text"
            value={payload.TARIFF_ID}
            onChange={(e) =>
              setPayload({ ...payload, TARIFF_ID: e.target.value })
            }
          />
          <Input
            name="Tariff Name"
            type="text"
            value={payload.TARIFF_NAME}
            onChange={(e) =>
              setPayload({ ...payload, TARIFF_NAME: e.target.value })
            }
          />
          <Dropdown
            name="Exclusion"
            value={payload.EXCLUSION}
            status={[true, false]}
            onChange={(e) =>
              setPayload({
                ...payload,
                EXCLUSION: e.target.value,
              })
            }
          />
          <Input
            name="Created User"
            type="text"
            readOnly
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

      {/* update modal */}
      <ModalPopup
        title="Update Exclusion Packages"
        sideImg={sideImg}
        modalName="updateExPackage"
      >
        <div className="grid w-full grid-cols-3 gap-5 px-10">
          <Input
            name="EXP_ID"
            type="text"
            value={payload.EXP_ID}
            onChange={(e) => setPayload({ ...payload, EXP_ID: e.target.value })}
          />
          <Input
            name="Tariff ID"
            type="text"
            value={payload.TARIFF_ID}
            onChange={(e) =>
              setPayload({ ...payload, TARIFF_ID: e.target.value })
            }
          />
          <Input
            name="Tariff Name"
            type="text"
            value={payload.TARIFF_NAME}
            onChange={(e) =>
              setPayload({ ...payload, TARIFF_NAME: e.target.value })
            }
          />
          <Dropdown
            name="Exclusion"
            value={payload.EXCLUSION}
            status={[true, false]}
            onChange={(e) =>
              setPayload({
                ...payload,
                EXCLUSION: e.target.value,
              })
            }
          />
          <Input
            name="Updated User"
            type="text"
            readOnly
            value={payload.UPDATED_USER}
            onChange={(e) =>
              setPayload({ ...payload, UPDATED_USER: e.target.value })
            }
          />
          {/* <Dropdown
            name="Status"
            value={payload.STATUS}
            status={["Active", "Inactive"]}
            onChange={(e) =>
              setPayload({
                ...payload,
                STATUS: e.target.value,
              })
            }
          /> */}
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

export default ExclusionPackages;
