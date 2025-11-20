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
import sideImg from "../../assets/images/userSideImg.png";
import Input from "../../components/common/Input";
import Dropdown from "../../components/common/Dropdown";
import { ToastContainer, toast } from "react-toastify";
import Swal from "sweetalert2";
import ToggleBtn from "../../components/common/ToggleBtn";
import { validations } from "../../utils/FormValidations";
import AIBtn from "../../components/common/AIBtn";
import { useAuth } from "../../context/Auth.context";
import DropdownThree from "../../components/common/DropdownThree";

function ProdEligibility() {
  const { loginUserData } = useAuth();
  const userName = loginUserData.user?.name;
  const { openModal, closeModal } = useModal();

  // creating a state to setData
  const [response, setResponse] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("Active");
  const [dropdownOptions, setDropdownOptions] = useState([""]);

  // fetching values for suggestions
  const [orderTypes, setOrderTypes] = useState([]);
  const [orderSubTypes, setOrderSubTypes] = useState([]);
  const [serviceTypes, setServiceTypes] = useState([]);
  const [salesDescriptions, setSalesDescriptions] = useState([]);

  const [changedRowIds, setChangedRowIds] = useState([]);

  //add API URL here for easy access for all the functions in this page
  const VITE_SIA_SO_TYPES_URL = import.meta.env.VITE_SIA_SO_TYPES_URL;

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

  useEffect(() => {
    setOrderTypes([
      ...new Set(response.map((item) => item.ORDER_TYPE).filter(Boolean)),
    ]);
    setOrderSubTypes([
      ...new Set(response.map((item) => item.ORDER_SUB_TYPE).filter(Boolean)),
    ]);
    setServiceTypes([
      ...new Set(response.map((item) => item.SERVICE_TYPE).filter(Boolean)),
    ]);
    setSalesDescriptions([
      ...new Set(
        response.map((item) => item.SALES_DESCRIPTION).filter(Boolean)
      ),
    ]);
  }, [response]);

  const initialPayload = {
    ID: "",
    PRODUCT: "",
    SALES_DESCRIPTION: "",
    SERVICE_TYPE: "",
    ORDER_TYPE: "",
    ORDER_SUB_TYPE: "",
    SLAB_ELIGIBILITY: true,
    PCR_ELIGIBILITY: true,
    CREATED_DATE: "",
    CREATED_USER: userName,
    UPDATED_DATE: "",
    UPDATED_USER: userName,
    STATUS: "Active",
  };

  // create a state object to set the data
  const [payload, setPayload] = useState(initialPayload);
  const ruleName = "productEligibility";

  // handle the form submission to add the data
  const handleSubmit = async () => {
    const errors = validations(payload, ruleName, false, response);

    if (errors.length > 0) {
      errors.forEach((err) => toast.warning(err));
      return; // Prevent submission
    }
    try {
      const response = await submitData(VITE_SIA_SO_TYPES_URL, payload);
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
  //opening the modal to add data
  const handleAddData = () => {
    setPayload(initialPayload); // Reset the payload to initial state
    openModal("addProduct");
  };

  useEffect(() => {
    getData(); // calling the function when loading
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [statusFilter]);

  const columns = [
    "id",
    "Product",
    "Sales Description",
    "Service type",
    "Order type",
    "Order sub type",
    "Considered for PCR",
    "Considered for slab",
    "Status",
    "Created Date",
  ];
  const data = response
    .filter((item) =>
      item.PRODUCT.toLowerCase().includes(searchQuery.toLowerCase())
    )
    .sort((a, b) => a.ID - b.ID)
    .map((item) => ({
      id: item.ID,
      Product: item.PRODUCT,
      "Sales Description": item.SALES_DESCRIPTION,
      "Service type": item.SERVICE_TYPE,
      "Order type": item.ORDER_TYPE,
      "Order sub type": item.ORDER_SUB_TYPE,
      "Considered for PCR": item.PCR_ELIGIBILITY ? "True" : "False",
      "Considered for slab": item.SLAB_ELIGIBILITY ? "True" : "False",
      Status: item.STATUS,
      "Created User": item.CREATED_USER,
      "Created Date": new Date(item.CREATED_DATE).toLocaleString("default", {
        month: "long",
        day: "numeric",
        year: "numeric",
      }), // Convert to local date string with timeitem.STATUS,
      "Updated User": item.UPDATED_USER,
      "Updated Date": new Date(item.UPDATED_DATE).toLocaleString("default", {
        month: "long",
        day: "numeric",
        year: "numeric",
      }),
    }));

  // writing a function to get the data from database
  const getData = async () => {
    let data = [];
    if (statusFilter === "Active") {
      data = await fetchData(VITE_SIA_SO_TYPES_URL);
    } else {
      data = await fetchInactiveData(VITE_SIA_SO_TYPES_URL);
    }
    setResponse(data);
  };

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
        PRODUCT: selectedData.PRODUCT,
        SALES_DESCRIPTION: selectedData.SALES_DESCRIPTION,
        SERVICE_TYPE: selectedData.SERVICE_TYPE,
        ORDER_TYPE: selectedData.ORDER_TYPE,
        ORDER_SUB_TYPE: selectedData.ORDER_SUB_TYPE,
        SLAB_ELIGIBILITY: selectedData.SLAB_ELIGIBILITY,
        PCR_ELIGIBILITY: selectedData.PCR_ELIGIBILITY,
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
          VITE_SIA_SO_TYPES_URL,
          payload.ID,
          payload
        );
        toast.success("Data updated successfully!", updatedData);
        getData(); // Refresh the table data
        closeModal(); // close the modal popup
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
          await updateData(VITE_SIA_SO_TYPES_URL, id, updatedPayload);
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
        title="Product Eligibility"
        placeholder={"Search by Product"}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
      />

      {/* acive inactive toggle button */}
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
        title="Product Eligibility List"
        changedRowIds={changedRowIds}
        isActiveTab={statusFilter === "Active"}
      />
      <div className="flex justify-end pr-2 mt-5">
        <AIBtn
          name="Add New Product"
          icon={<PlusCircle />}
          onClick={handleAddData}
        />
      </div>
      <ModalPopup
        title="Add New Product Eligibility"
        sideImg={sideImg}
        modalName="addProduct"
      >
        <div className="grid w-full grid-cols-3 gap-5 px-10 ml-5">
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
            name="Sales Description"
            type="text"
            value={payload.SALES_DESCRIPTION}
            list="salesDescriptions"
            onChange={(e) =>
              setPayload({ ...payload, SALES_DESCRIPTION: e.target.value })
            }
          />
          <datalist id="salesDescriptions">
            {salesDescriptions.map((desc, idx) => (
              <option key={idx} value={desc} className="bg-amber-500" />
            ))}
          </datalist>
          <Input
            name="Service Type"
            type="text"
            value={payload.SERVICE_TYPE}
            list="serviceTypes"
            onChange={(e) =>
              setPayload({ ...payload, SERVICE_TYPE: e.target.value })
            }
          />
          <datalist id="serviceTypes">
            {serviceTypes.map((type, idx) => (
              <option key={idx} value={type} />
            ))}
          </datalist>

          <Input
            name="Order Type"
            type="text"
            value={payload.ORDER_TYPE}
            list="orderTypes"
            onChange={(e) =>
              setPayload({ ...payload, ORDER_TYPE: e.target.value })
            }
          />
          <datalist id="orderTypes">
            {orderTypes.map((type, idx) => (
              <option key={idx} value={type} />
            ))}
          </datalist>

          <Input
            name="Order Sub Type"
            type="text"
            value={payload.ORDER_SUB_TYPE}
            list="orderSubTypes"
            onChange={(e) =>
              setPayload({ ...payload, ORDER_SUB_TYPE: e.target.value })
            }
          />
          <datalist id="orderSubTypes">
            {orderSubTypes.map((type, idx) => (
              <option key={idx} value={type} />
            ))}
          </datalist>
          <Dropdown
            name="Considered for PCR"
            value={payload.PCR_ELIGIBILITY}
            status={["True", "False"]}
            onChange={(e) =>
              setPayload({
                ...payload,
                PCR_ELIGIBILITY: e.target.value === "True",
              })
            }
          />
          <Dropdown
            name="Considered for slab"
            value={payload.SLAB_ELIGIBILITY}
            status={["True", "False"]}
            onChange={(e) =>
              setPayload({
                ...payload,
                SLAB_ELIGIBILITY: e.target.value === "True",
              })
            }
          />
          <Input
            name="Created user"
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

      {/* update Modal  */}
      <ModalPopup
        title="Update Product Eligibility"
        sideImg={sideImg}
        modalName="updateProduct"
      >
        <div className="grid w-full grid-cols-3 gap-5 px-10 ml-5">
          <Input
            name="Product"
            type="text"
            value={payload.PRODUCT}
            onChange={(e) =>
              setPayload({ ...payload, PRODUCT: e.target.value })
            }
          />
          <Input
            name="Sales Description"
            type="text"
            value={payload.SALES_DESCRIPTION}
            onChange={(e) =>
              setPayload({ ...payload, SALES_DESCRIPTION: e.target.value })
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
            name="Order Sub Type"
            type="text"
            value={payload.ORDER_SUB_TYPE}
            onChange={(e) =>
              setPayload({ ...payload, ORDER_SUB_TYPE: e.target.value })
            }
          />
          <Dropdown
            name="Considered for PCR"
            value={payload.PCR_ELIGIBILITY}
            status={[true, false]}
            onChange={(e) =>
              setPayload({
                ...payload,
                PCR_ELIGIBILITY: e.target.value,
              })
            }
          />
          <Dropdown
            name="Considered for slab"
            value={payload.SLAB_ELIGIBILITY}
            status={[true, false]}
            onChange={(e) =>
              setPayload({
                ...payload,
                SLAB_ELIGIBILITY: e.target.value,
              })
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
          <Input
            name="Updated user"
            type="text"
            value={payload.UPDATED_USER}
            readOnly
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

export default ProdEligibility;
