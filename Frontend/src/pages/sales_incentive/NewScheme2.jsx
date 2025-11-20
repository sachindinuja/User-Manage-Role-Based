import React, { useEffect, useState } from "react";
import PageHeader from "../../components/common/PageHeader";
import { SchemeRuleCard } from "../../components/common/SchemeRuleCard";
import { fetchRuleDataAndPush } from "../../data/sales_incentive/schemeData";
import { fetchData, submitData } from "../../services/fetchData";
import { SchemeTable } from "../../components/common/SchemeTable";
import { ToastContainer, toast } from "react-toastify";
import AIBtn from "../../components/common/AIBtn";
import { Plus } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { setFirstSchemeDefined } from "../../utils/utils";
import { useModal } from "../../context/ModalContext";
import sideImg from "../../assets/images/userSideImg.png";
import ModalPopup from "../../components/common/ModalPopup";
import Input from "../../components/common/Input";
import Dropdown from "../../components/common/Dropdown";
import { useAuth } from "../../context/Auth.context";

function NewScheme2() {
  const navigate = useNavigate();
  const { openModal, closeModal } = useModal();

  const { loginUserData } = useAuth();
  const userName = loginUserData.user?.name;

  const VITE_SIA_SCHEME_URL = import.meta.env.VITE_SIA_SCHEME_URL;
  const ruleApiMap = {
    productEligibility: import.meta.env.VITE_SIA_SO_TYPES_URL,
    slabLevel: import.meta.env.VITE_SIA_SLAB_LEVELS_URL,
    paymentStages: import.meta.env.VITE_SIA_PAYMENT_STAGES_URL,
    exclusionPackages: import.meta.env.VITE_SIA_EXCLUSION_PCKG_URL,
    bearerPackages: import.meta.env.VITE_SIA_BEARER_PCR_URL,
    peoPackages: import.meta.env.VITE_SIA_PEO_RATES_URL,
    bbPackages: import.meta.env.VITE_SIA_BB_PCKG_PCR_URL,
    LtebbPackages: import.meta.env.VITE_SIA_LTE_BB_URL,
    LtebbPCRPackages: import.meta.env.VITE_SIA_LTE_BB_PCR_URL,
    unlimitedVoice: import.meta.env.VITE_SIA_UNLIMITED_VOICE_URL,
  };
  const [rules, setRules] = useState({
    productEligibility: false,
    slabLevel: false,
    paymentStages: false,
    exclusionPackages: false,
    bearerPackages: false,
    peoPackages: false,
    bbPackages: false,
    LtebbPackages: false,
    LtebbPCRPackages: false,
    unlimitedVoice: false,
  });

  // create payload state object
  const [formData, setFormData] = useState({
    SCHEME_NUM: "",
    SCHEME_NAME: "",
    STATUS: "Active",
    START_DATE: "",
    ATTACHMENT: null,
    ATTACHMENT_URL: null,
    CREATE_DATE: "",
    CREATE_USER: userName,
    UPDATE_DATE: "",
    UPDATE_USER: "",
    RULES_DATA: [],
  });

  // store all the fetch rule data
  const [activeData, setActiveData] = useState([]);
  // store table data per rule
  const [tableData, setTableData] = useState({});

  // mapped the active data get all IDS and keys
  useEffect(() => {
    const updatedRules = activeData.flatMap((rule) =>
      rule.data.map((item) => ({
        TABLE_NAME: rule.key, // fallback
        RT_ID: item.ID.toString(),
      }))
    );
    setFormData((prev) => ({
      ...prev,
      RULES_DATA: updatedRules,
    }));
  }, [activeData]);

  // define function to fetch data when toggle RuleCard
  const handleRuleToggle = async (ruleKey) => {
    const isCurrentlyActive = rules[ruleKey];
    const nextState = !isCurrentlyActive;

    setRules((prev) => ({
      ...prev,
      [ruleKey]: nextState,
    }));

    if (nextState) {
      const alreadyFetched = activeData.some((item) => item.key === ruleKey);
      if (!alreadyFetched && ruleApiMap[ruleKey]) {
        await fetchRuleDataAndPush(ruleKey, ruleApiMap[ruleKey], setActiveData);
      }
    } else {
      setActiveData((prevData) =>
        prevData.filter((item) => item.key !== ruleKey)
      );
    }
  };

  // remove all changed row ids from local storage if any rule card is toggle on
  function clearActiveChangedRowIds(rules) {
    Object.entries(rules).forEach(([key, isActive]) => {
      if (isActive) {
        localStorage.removeItem(key);
      }
    });
  }
  const handleSubmit = async () => {
    console.log("Submitting with userName:", userName);
    const payload = {
      ...formData,
      START_DATE: formData.START_DATE || null,
      ATTACHMENT: null,
      CREATE_USER: formData.CREATE_USER || userName,
    };
    console.log("Payload being submitted:", payload);

    try {
      // Check if this is the first scheme
      const existingSchemes = await fetchData(VITE_SIA_SCHEME_URL);
      if (!existingSchemes || existingSchemes.length === 0) {
        setFirstSchemeDefined();
      }
      const response = await submitData(VITE_SIA_SCHEME_URL, payload);
      toast.success("Submitted successfully:", response);
      // Remove all changed row ids for all rules
      clearActiveChangedRowIds(rules);
      navigate("/salesincentive/schema", { replace: true });
    } catch (error) {
      toast.error("Error submitting scheme:", error);
    }
  };

  // fetch and format rule specific data
  const handleGetActiveRules = async (ruleKey) => {
    const url = ruleApiMap[ruleKey];
    if (!url) return;

    try {
      const response = await fetchData(url);
      const filtered = response.filter((item) => item.STATUS === "Active");

      const data = {
        columns: ["RULE_ID", "RULE SPECIFIC", "STATUS"],
        data: filtered.map((item) => ({
          ONE: item.ID,
          TWO:
            item.PRODUCT ||
            item.TARIFF_ID ||
            item.SLAB_LEVEL ||
            item.STAGE_ID ||
            "N/A",
          STATUS: item.STATUS,
        })),
        IDS: filtered.map((item) => item.ID),
      };

      setTableData((prev) => ({
        ...prev,
        [ruleKey]: data,
      }));
    } catch (err) {
      console.error(`❌ Failed to fetch data for ${ruleKey}:`, err);
    }
  };

  return (
    <>
      <ToastContainer position="top-right" theme="colored" />
      <PageHeader title={"Create New Calulation Rule"} />

      {/* view active rules */}
      <div className="flex mt-5 h-auto gap-5">
        <div className="flex flex-col gap-5 w-[20%]">
          <div className="grid grid-cols-1 gap-4">
            <SchemeRuleCard
              label="Product Eligibility"
              checked={rules.productEligibility}
              onChange={() => {
                handleRuleToggle("productEligibility");
                handleGetActiveRules("productEligibility");
              }}
              status={rules.productEligibility ? "Active" : "Inactive"}
            />
            <SchemeRuleCard
              label="Slab Level"
              checked={rules.slabLevel}
              onChange={() => {
                handleRuleToggle("slabLevel");
                handleGetActiveRules("slabLevel");
              }}
              status={rules.slabLevel ? "Active" : "Inactive"}
            />
            <SchemeRuleCard
              label="Payment Stages"
              checked={rules.paymentStages}
              onChange={() => {
                handleRuleToggle("paymentStages");
                handleGetActiveRules("paymentStages");
              }}
              status={rules.paymentStages ? "Active" : "Inactive"}
            />
            <SchemeRuleCard
              label="Exclusion Packages"
              checked={rules.exclusionPackages}
              onChange={() => {
                handleRuleToggle("exclusionPackages");
                handleGetActiveRules("exclusionPackages");
              }}
              status={rules.exclusionPackages ? "Active" : "Inactive"}
            />
            <SchemeRuleCard
              label="Bearer Packages"
              checked={rules.bearerPackages}
              onChange={() => {
                handleRuleToggle("bearerPackages");
                handleGetActiveRules("bearerPackages");
              }}
              status={rules.bearerPackages ? "Active" : "Inactive"}
            />
            <SchemeRuleCard
              label="peo Packages"
              checked={rules.peoPackages}
              onChange={() => {
                handleRuleToggle("peoPackages");
                handleGetActiveRules("peoPackages");
              }}
              status={rules.peoPackages ? "Active" : "Inactive"}
            />
            <SchemeRuleCard
              label="BB Packages"
              checked={rules.bbPackages}
              onChange={() => {
                handleRuleToggle("bbPackages");
                handleGetActiveRules("bbPackages");
              }}
              status={rules.bbPackages ? "Active" : "Inactive"}
            />
            <SchemeRuleCard
              label="LTE BB Packages"
              checked={rules.LtebbPackages}
              onChange={() => {
                handleRuleToggle("LtebbPackages");
                handleGetActiveRules("LtebbPackages");
              }}
              status={rules.LtebbPackages ? "Active" : "Inactive"}
            />
            <SchemeRuleCard
              label="LTE BB PCR Packages"
              checked={rules.LtebbPCRPackages}
              onChange={() => {
                handleRuleToggle("LtebbPCRPackages");
                handleGetActiveRules("LtebbPCRPackages");
              }}
              status={rules.LtebbPCRPackages ? "Active" : "Inactive"}
            />
            <SchemeRuleCard
              label="Unlimited Voice Packages"
              checked={rules.unlimitedVoice}
              onChange={() => {
                handleRuleToggle("unlimitedVoice");
                handleGetActiveRules("unlimitedVoice");
              }}
              status={rules.unlimitedVoice ? "Active" : "Inactive"}
            />
          </div>
          {/* button div */}
          <div className="w-full flex justify-center mt-10">
            <AIBtn
              name={"Create Cal Rule"}
              onClick={() => {
                openModal("CreateNewScheme");
              }}
              icon={<Plus color="white" />}
            />
          </div>
        </div>

        {/* display data tables */}
        <div className="w-full grid grid-cols-4 gap-2 h-fit backdrop-blur-2xl p-2">
          {Object.entries(tableData).map(
            ([key, value], index) =>
              rules[key] && ( // show only if rule is toggled ON
                <div
                  key={index}
                  className="bg-black/30 p-3 rounded-lg h-[30vh] overflow-y-auto"
                >
                  <h3 className="text-white font-semibold mb-2 capitalize">
                    {key.replace(/([A-Z])/g, " $1")}
                  </h3>
                  <SchemeTable
                    column={value.columns}
                    products={value.data}
                    TABLE_NAME={key}
                    setRuleId={() => {}}
                  />
                </div>
              )
          )}
        </div>
        {/* Add new scheme Modal  */}
        <ModalPopup
          title="Create New Scheme"
          sideImg={sideImg}
          modalName="CreateNewScheme"
        >
          {/* form */}
          <div className="grid grid-cols-2 gap-2 mt-5 px-10">
            <Input
              name={"Scheme Number"}
              type={"text"}
              value={formData.SCHEME_NUM}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, SCHEME_NUM: e.target.value }))
              }
            />
            <Input
              name={"Scheme Name"}
              type={"text"}
              value={formData.SCHEME_NAME}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  SCHEME_NAME: e.target.value,
                }))
              }
            />
            <Dropdown
              name={"Status"}
              status={["Active", "Inactive"]}
              value={formData.STATUS}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, STATUS: e.target.value }))
              }
            />
            <Input
              name={"Start Date"}
              type={"date"}
              value={formData.START_DATE}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, START_DATE: e.target.value }))
              }
            />
          </div>
          <div className="flex justify-center w-full gap-10 mt-10">
            <button
              className="w-32 p-2 text-white rounded-md bg-primary"
              onClick={handleSubmit}
            >
              Create Scheme
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
    </>
  );
}

export default NewScheme2;
