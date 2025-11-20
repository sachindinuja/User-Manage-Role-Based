import React from "react";
import Header from "../../components/common/Header";
import SideBar from "../../components/common/SideBar";
import { Route, Routes } from "react-router-dom";
import Analytics from "./Analytics";
import ServiceOrderType from "./ServiceOrderType";
import SummaryFile from "./SummaryFile";
import { dealerSideBarData } from "../../data/dealer_commission/dashboard";
import BearerRates from "./BearerRate";
import BlacklistPackages from "./BlackList";
import PackageRates from "./PackageRate";
import SlabDema from "./SlabDemarcation";
import SummaryReport from "./SummaryReport";
import MonthlySummary from "./MonthlySummaryReport";
import CommissionSummary from "./CommissionSummary";
import UserManagement from "./UserManagement";

function DealerLayout({ tag }) {
  const key = import.meta.env.VITE_KEY_SIGNATURE;
  if (key === "swe79EByf8M7lrU96LmxhsyVL") {
    return (
      <div>
        <div className="min-h-screen background-img">
          <Header />
          <div className="flex gap-5 px-5 mt-10">
            <SideBar sidebarData={dealerSideBarData} />
            <div className="w-full h-auto p-5 rounded-lg shadow-2xl">
              <Routes>
                {/* Redirect to routes */}
                <Route path="/analytics" element={<Analytics />} />
                <Route path="/servicetype" element={<ServiceOrderType />} />
                <Route path="/bearerrate" element={<BearerRates />} />
                <Route path="/blacklist" element={<BlacklistPackages />} />
                <Route path="/packagerate" element={<PackageRates />} />
                <Route path="/slabdema" element={<SlabDema />} />
                <Route path="/summaryreports" element={<SummaryReport />} />
                <Route path="/performance" element={<SummaryFile />} />
                <Route path="/monthlysummary" element={<MonthlySummary/>}/>
                <Route path="/monthlysummary" element={<MonthlySummary/>}/>
                <Route path ="/commissionsummary" element={<CommissionSummary/>}/>
                <Route path="/usermanagement" element={<UserManagement />} />
              </Routes>
            </div>
          </div>
          <div className="flex justify-center text-[10px] text-gray-50/20">
            <h2>{tag}</h2>
          </div>
        </div>
      </div>
    );
  }
}

export default DealerLayout;
