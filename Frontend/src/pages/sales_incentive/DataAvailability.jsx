import React, { useEffect, useState } from "react";
import PageHeader from "../../components/common/PageHeader";
import CalendarCard from "../../components/common/CalendarCard";
import { calendarData } from "../../data/sales_incentive/calendarData";
import { fetchAll } from "../../services/fetchData";
import ModalPopup from "../../components/common/ModalPopup";
import { useModal } from "../../context/ModalContext";
import SideImg from "../../assets/images/popup4.png";
import Loader from "../../components/common/Loader";

function DataAvailability() {
  const VITE_SIA_CS_DATA_LAB = import.meta.env.VITE_SIA_CS_DATA_LAB;
  // get calendar view data
  const [calendarViewData, setCalendarViewData] = useState([]);
  const { openModal, closeModal } = useModal();
  const [hoveredMonth, setHoveredMonth] = useState(null);
  const [loading, setLoading] = useState(false);

  // fetched data from datalab for calendar view
  const getCalendarData = async () => {
    let data = [];
    try {
      setLoading(true);
      data = await fetchAll(VITE_SIA_CS_DATA_LAB);
      setCalendarViewData(data);
      setLoading(false);
    } catch (error) {
      console.error("there is error with fetching data from data lab", error);
    }
  };

  useEffect(() => {
    getCalendarData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Handler to open modal with month
  const handleCardHover = (month) => {
    setHoveredMonth(month);
    openModal("dataAvailability");
  };

  // Handler to close modal
  const handleModalClose = () => {
    closeModal("dataAvailability");
    setHoveredMonth(null);
  };

  // Filter data for hovered month
  const monthData = hoveredMonth
    ? calendarViewData.filter((item) => {
        const itemMonth = new Date(
          item.service_order_status_updated_dtm
        ).toLocaleString("default", { month: "long" });
        return itemMonth === hoveredMonth;
      })
    : [];

  const monthDataFiltered = {
    serviceNames: [...new Set(monthData.map((item) => item.service_name))],
    orderTypes: [...new Set(monthData.map((item) => item.order_type))],
    orderSubTypes: [...new Set(monthData.map((item) => item.order_sub_type))],
    orderSalesOffices: [
      ...new Set(monthData.map((item) => item.order_sales_office)),
    ],
    orderSalesSources: [
      ...new Set(monthData.map((item) => item.order_sales_source)),
    ],
    OrderRegisterdOffices: [
      ...new Set(monthData.map((item) => item.order_registered_office)),
    ],
  };

  // console.log("month Data", monthData);
  console.log("filtered month Data", monthDataFiltered);
  return (
    <>
      {/* add page header */}
      <PageHeader title={"Data Availability"} />

      {/* data labels */}
      <div className="flex justify-center my-5 gap-10">
        <div className="flex items-center gap-2 text-white">
          <div className="bg-gray-500 p-5 rounded-md"></div>
          <p className="font-semibold">No Data</p>
        </div>
        <div className="flex items-center gap-2 text-white">
          <div className="bg-yellow-500 p-5 rounded-md"></div>
          <p className="font-semibold">Data Available</p>
        </div>
        <div className="flex items-center gap-2 text-white">
          <div className="bg-blue-500 p-5 rounded-md"></div>
          <p className="font-semibold">Confirmed</p>
        </div>
        <div className="flex items-center gap-2 text-white">
          <div className="bg-green-500 p-5 rounded-md"></div>
          <p className="font-semibold">Data Processing</p>
        </div>
        <div className="flex items-center gap-2 text-white">
          <div className="bg-red-500 p-5 rounded-md"></div>
          <p className="font-semibold">Successfully Processed</p>
        </div>
      </div>

      {/* add calendar cards to display data */}
      {loading ? (
        <Loader />
      ) : (
        <CalendarCard
          data={calendarData}
          viewData={calendarViewData}
          onCardHover={handleCardHover}
          onCardLeave={handleModalClose}
        />
      )}

      {/* adding Popup Modal to display fetch data */}
      <ModalPopup
        title={`${hoveredMonth} Data Availability`}
        sideImg={SideImg}
        modalName={"dataAvailability"}
      >
        {loading ? (
          <Loader />
        ) : (
          <div className="grid grid-cols-1 px-5 gap-2">
            {monthData.length > 0 ? (
              <div className="bg-transparent shadow-2xl rounded-md p-10">
                {/* unique service names */}
                <div className="mb-5">
                  <h1 className="font-semibold text-[15px] mb-2 text-gray-700">
                    Product based Sales Data
                  </h1>
                  <div className="grid grid-cols-3 gap-3">
                    {monthDataFiltered.serviceNames.map((serviceName, idx) => {
                      // For this service name, get all order types
                      const orderTypes = [
                        ...new Set(
                          monthData
                            .filter(
                              (item) =>
                                item.service_name === serviceName &&
                                (item.order_type === "New Connection" ||
                                  item.order_type === "Service Upgrade")
                            )
                            .map((item) => item.order_type)
                        ),
                      ];

                      // Check if any row for this serviceName has order_sub_type === "Re-Connection"
                      const hasReconnection = monthData.some(
                        (item) =>
                          item.service_name === serviceName &&
                          item.order_sub_type === "Re-Connection"
                      );
                      return (
                        <div key={idx}>
                          {/* CREATE and CREATE-UPGRADE SAME NO. */}
                          {orderTypes.map((orderType, j) => {
                            const rowCount = monthData.filter(
                              (item) =>
                                item.service_name === serviceName &&
                                item.order_type === orderType
                            ).length;

                            let label = "";
                            if (orderType === "New Connection") {
                              label = "CREATE";
                            } else if (orderType === "Service Upgrade") {
                              label = "CREATE-UPGRADE SAME NO.";
                            }

                            return (
                              <div
                                key={j}
                                className="flex items-center justify-between gap-3 text-sm py-1 border-b border-gray-100 h-auto"
                              >
                                <div className="w-full background-img2 py-2 px-5 h-auto shadow-md rounded-md">
                                  <h1 className="flex justify-between p-1 text-2xl text-gray-700 font-semibold mb-2">
                                    {serviceName}
                                    <span className="ml-1 bg-primary text-white rounded-md px-5">
                                      {rowCount}
                                    </span>
                                  </h1>
                                  <div className="flex items-center gap-2">
                                    <h1 className="p-1 bg-white w-48 rounded-md">
                                      {orderType}
                                    </h1>
                                    <h1 className="p-1 bg-white rounded-md w-56">
                                      {label}
                                    </h1>
                                  </div>
                                </div>
                              </div>
                            );
                          })}
                          {/* CREATE-RECON */}
                          {hasReconnection && (
                            <div className="flex items-center justify-between gap-2 text-sm py-1 border-b border-gray-100">
                              <div className="w-full background-img2 py-2 px-5 h-auto shadow-md rounded-md">
                                <h1 className="flex justify-between p-1 text-2xl text-gray-700 font-semibold mb-2">
                                  {serviceName}
                                  <span className="ml-1 bg-primary text-white rounded-md px-5">
                                    {
                                      monthData.filter(
                                        (item) =>
                                          item.service_name === serviceName &&
                                          item.order_sub_type ===
                                            "Re-Connection"
                                      ).length
                                    }
                                  </span>
                                </h1>
                                <div className="flex items-center gap-2">
                                  <h1 className="p-1 bg-white w-48 rounded-md">
                                    Re-Connection
                                  </h1>
                                  <h1 className="p-1 bg-white rounded-md w-56">
                                    CREATE-RECON
                                  </h1>
                                </div>
                              </div>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
                <div className="flex items-center justify-center gap-2">
                  <button className="bg-blue-500 text-white py-2 px-4 rounded-md w-32">
                    Confirm
                  </button>
                  <button
                    className="bg-gray-500 text-white py-2 px-4 rounded-md w-32"
                    onClick={handleModalClose}
                  >
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              <div className="bg-white shadow-2xl rounded-md p-10 text-center">
                <h1 className="font-semibold text-[25px] text-gray-900">
                  Data Not available for {hoveredMonth}
                </h1>
                <Loader />
              </div>
            )}
          </div>
        )}
      </ModalPopup>
    </>
  );
}

export default DataAvailability;
