import React from "react";
import ShinyText from "../common/ShinyText";
import SplitText from "../common/SplitText";
import SpotlightCard from "../common/SpotLightCard";
import DropDownTwo from "../common/DropDownTwo";

function DashboardCover() {
  return (
    <div className="flex p-5 h-180 items-center my-2 rounded-2xl bg-gradient-to-tl from-[#0b1d6f] to-55% from-30% shadow-lg">
      <div className="w-[70%] bg-transparent flex flex-col justify-center items-center">
        <ShinyText
          text="Sales Incentive Dashboard"
          disabled={false}
          speed={3}
          className="text-8xl font-bold mb-4 text-center"
        />
        <ShinyText
          text="Explore more about sales Incentive performance"
          disabled={false}
          speed={3}
          className="text-2xl"
        />
      </div>
      <div className="w-[30%] bg-transparent">
        <SpotlightCard className="text-white" spotlightColor="#6333db">
          <div className="flex flex-col gap-15">
            <DropDownTwo
              name="Select Module"
              status={["Sales Incentive", "Dealer", "SME", "Manager Incentive"]}
            />
            <DropDownTwo
              name="Year"
              status={["2022", "2023", "2024", "2025"]}
            />
            <DropDownTwo
              name="Salary Month"
              status={["January", "February", "March", "April"]}
            />
            <DropDownTwo name="Region" status={["METRO", "R1", "R2", "R3"]} />
          </div>
        </SpotlightCard>
      </div>
    </div>
  );
}

export default DashboardCover;
