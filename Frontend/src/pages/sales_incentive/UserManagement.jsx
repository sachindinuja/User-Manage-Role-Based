import React, { useEffect } from "react";
import ActionTable from "../../components/common/ActionTable";
import PageHeader from "../../components/common/PageHeader";
import ModalPopup from "../../components/common/ModalPopup";
import { useModal } from "../../context/ModalContext";
import PrimaryBtn from "../../components/common/PrimaryBtn";
import { PlusCircle } from "lucide-react";
import sideImg from "../../assets/images/userSideImg.png";
import Input from "../../components/common/Input";
import { fetchAuthData } from "../../services/auth.service";

function UserManagement() {
  const VITE_SIA_ALL_USERS_URL = import.meta.env.VITE_SIA_ALL_USERS_URL;
  const accessToken = sessionStorage.getItem("access_token");

  const { openModal, closeModal } = useModal();

  // creating a state to setData
  const [response, setResponse] = React.useState([]);

  const handleUpdate = () => {
    openModal("updateUser");
  };

  useEffect(() => {
    getData(); // calling the function when loading
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // get users informations from database
  const getData = async () => {
    let data = [];
    data = await fetchAuthData(VITE_SIA_ALL_USERS_URL, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
    setResponse(data);
  };

  const columns = [
    "Service Number",
    "Name",
    "User Category",
    "Designation",
    "Email",
    "Contact No",
    "Status",
  ];
  const data = response.map((item) => ({
    "Service Number": item.service_id,
    Name: item.name,
    "User Category": item.user_category,
    Designation: item.designation,
    Email: item.email,
    "Contact No": item.contact_number,
    Status: item.is_active ? "Active" : "Inactive",
  }));
  return (
    <div className="block">
      {/* Page header should first come in */}
      <PageHeader title="User Management" />
      <ActionTable
        columns={columns}
        data={data}
        title={"USERS"}
        handleUpdate={handleUpdate}
      />

      <ModalPopup
        title="New User Profile Complete"
        sideImg={sideImg}
        modalName="updateUser"
      >
        <div className="grid w-full grid-cols-2 gap-5 px-10">
          <Input label="Service Number" type="text" />
          <Input label="Name" type="text" />
          <Input label="User Level" type="text" />
          <Input label="Status" type="text" />
        </div>
        <div className="flex justify-center w-full gap-10 mt-10">
          <button className="w-32 p-2 text-white rounded-md bg-success">
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
    </div>
  );
}

export default UserManagement;
