import React from "react";

function CalendarCard({ data, viewData, onCardHover }) {
  // console.log("CalendarCard data", viewData);

  const monthFilterData = (monthName) => {
    return viewData.filter((item) => {
      const itemMonth = new Date(
        item.service_order_status_updated_dtm
      ).toLocaleString("default", { month: "long" });
      return itemMonth === monthName;
    });
  };

  return (
    <div className="grid grid-cols-5 gap-4 p-5">
      {data.map((item, index) => {
        const filteredData = monthFilterData(item.month);
        const isAvailable = filteredData.length > 0;
        // console.log("month is: ", filteredData);
        return (
          <div
            className={`p-4 text-2xl h-auto rounded-2xl bg-white hover:scale-103 shadow-2xl`}
            key={index}
            onClick={() => onCardHover && onCardHover(item.month)}
          >
            <div
              className={`${
                isAvailable ? "bg-yellow-200" : "bg-gray-200"
              } w-12 h-12 p-3 rounded-md`}
            >
              <div
                className={`w-10 h-10 rounded-md ${
                  isAvailable ? "bg-yellow-500" : "bg-gray-500"
                }`}
              ></div>
            </div>

            <p className="font-bold text-gray-900 text-[25px] mt-8">
              {item.month}
            </p>
            <p
              className={`${
                isAvailable ? "text-yellow-500 font-semibold" : "text-gray-500"
              } text-[18px] mt-1`}
            >
              {filteredData.length} Records
            </p>
          </div>
        );
      })}
    </div>
  );
}

export default CalendarCard;
