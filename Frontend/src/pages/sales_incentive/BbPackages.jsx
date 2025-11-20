import React, { useEffect, useState } from "react";
import ModalPopup from "../../components/common/ModalPopup";
import PageHeader from "../../components/common/PageHeader";
import ActionTable from "../../components/common/ActionTable";
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
import Swal from "sweetalert2";
import ToggleBtn from "../../components/common/ToggleBtn";
import { validations } from "../../utils/FormValidations";
import AIBtn from "../../components/common/AIBtn";
import { useAuth } from "../../context/Auth.context";
import { isFirstSchemeDefined } from "../../utils/utils";

function BBPCR() {
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
  const VITE_SIA_BB_PCKG_PCR_URL = import.meta.env.VITE_SIA_BB_PCKG_PCR_URL;

  // create a state object to set the data
  const initialPayload = {
    ID: "",
    BB_PCR_ID: "",
    TARIFF_ID: "",
    TARIFF_NAME: "",
    RENTAL_WO_TAX: "",
    PCR: "",
    ADDITIONAL_COST: "",
    SERVICE_TYPE: "",
    ORDER_TYPE: "",
    CREATED_DATE: "",
    CREATED_USER: userName,
    UPDATED_DATE: "",
    UPDATED_USER: userName,
    STATUS: "Active",
  };
  const [payload, setPayload] = useState(initialPayload);
  const ruleName = "bbPackages";

  // handle the form submission to add the data
  const handleSubmit = async () => {
    const errors = validations(payload, ruleName, false, response);

    if (errors.length > 0) {
      errors.forEach((err) => toast.warning(err));
      return; // Prevent submission
    }
    try {
      const response = await submitData(VITE_SIA_BB_PCKG_PCR_URL, payload);
      toast.success("Data submitted successfully!", response);
      // console.log("Data submitted successfully:", response);
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
      // console.error("Error submitting data:", error);
      toast.error("Error submitting data:", error);
    }
  };

  const handleAddData = () => {
    setPayload(initialPayload);
    openModal("addBearerPCR");
  };

  useEffect(() => {
    getData(); // calling the function when loading
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [statusFilter]);

  // writing a function to get the data from database
  const getData = async () => {
    let data = [];
    if (statusFilter === "Active") {
      data = await fetchData(VITE_SIA_BB_PCKG_PCR_URL);
    } else {
      data = await fetchInactiveData(VITE_SIA_BB_PCKG_PCR_URL);
    }
    setResponse(data);
  };

  const columns = [
    "id",
    "BB PCR ID",
    "Tariff ID",
    "Tariff Name",
    "Rental Wo Tax",
    "PCR",
    "Additional Cost",
    "Service Type",
    "Order Type",
    "Status",
  ];
  const data = response
    .filter((item) =>
      item.BB_PCR_ID.toLowerCase().includes(searchQuery.toLowerCase())
    )
    .sort((a, b) => a.ID - b.ID)
    .map((item) => ({
      id: item.ID,
      "BB PCR ID": item.BB_PCR_ID,
      "Tariff ID": item.TARIFF_ID,
      "Tariff Name": item.TARIFF_NAME,
      "Rental Wo Tax": item.RENTAL_WO_TAX,
      PCR: item.PCR,
      "Additional Cost": item.ADDITIONAL_COST,
      "Service Type": item.SERVICE_TYPE,
      "Order Type": item.ORDER_TYPE,
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
        BB_PCR_ID: selectedData.BB_PCR_ID,
        TARIFF_ID: selectedData.TARIFF_ID,
        TARIFF_NAME: selectedData.TARIFF_NAME,
        RENTAL_WO_TAX: selectedData.RENTAL_WO_TAX,
        PCR: selectedData.PCR,
        ADDITIONAL_COST: selectedData.ADDITIONAL_COST,
        SERVICE_TYPE: selectedData.SERVICE_TYPE,
        ORDER_TYPE: selectedData.ORDER_TYPE,
        UPDATED_USER: selectedData.UPDATED_USER,
        STATUS: selectedData.STATUS,
      });
      openModal("updateBearerPCR");
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
          VITE_SIA_BB_PCKG_PCR_URL,
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
          await updateData(VITE_SIA_BB_PCKG_PCR_URL, id, updatedPayload);
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
        title="BB Package PCR"
        placeholder="Search by BB PCR ID"
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
        title={"BB Package PCR Report"}
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
          name="New BB Package PCR"
          icon={<PlusCircle />}
          onClick={handleAddData}
        />
      </div>

      {/* add new data modal */}
      <ModalPopup
        title="Add New BB Package PCR"
        sideImg={sideImg}
        modalName="addBearerPCR"
      >
        <div className="grid w-full grid-cols-3 gap-5 px-10">
          <Input
            name="BB PCR ID"
            type="text"
            value={payload.BB_PCR_ID}
            onChange={(e) =>
              setPayload({ ...payload, BB_PCR_ID: e.target.value })
            }
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
          <Input
            name="Rental Wo Tax"
            type="text"
            value={payload.RENTAL_WO_TAX}
            onChange={(e) =>
              setPayload({ ...payload, RENTAL_WO_TAX: e.target.value })
            }
          />
          <Input
            name="PCR"
            type="text"
            value={payload.PCR}
            onChange={(e) => setPayload({ ...payload, PCR: e.target.value })}
          />
          <Input
            name="Additional Cost"
            type="text"
            value={payload.ADDITIONAL_COST}
            onChange={(e) =>
              setPayload({ ...payload, ADDITIONAL_COST: e.target.value })
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

      {/* update Modal */}
      <ModalPopup
        title="Update BB Package PCR"
        sideImg={sideImg}
        modalName="updateBearerPCR"
      >
        <div className="grid w-full grid-cols-3 gap-5 px-10">
          <Input
            name="BB PCR ID"
            type="text"
            value={payload.BB_PCR_ID}
            onChange={(e) =>
              setPayload({ ...payload, BB_PCR_ID: e.target.value })
            }
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
          <Input
            name="Rental Wo Tax"
            type="text"
            value={payload.RENTAL_WO_TAX}
            onChange={(e) =>
              setPayload({ ...payload, RENTAL_WO_TAX: e.target.value })
            }
          />
          <Input
            name="PCR"
            type="text"
            value={payload.PCR}
            onChange={(e) => setPayload({ ...payload, PCR: e.target.value })}
          />
          <Input
            name="Additional Cost"
            type="text"
            value={payload.ADDITIONAL_COST}
            onChange={(e) =>
              setPayload({ ...payload, ADDITIONAL_COST: e.target.value })
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

export default BBPCR;
