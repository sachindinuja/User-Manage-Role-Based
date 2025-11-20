import React from "react";
import Header from "../../components/common/Header";
import SideBar from "../../components/common/SideBar";
import { Route, Routes } from "react-router-dom";
import Analytics from "./Analytics";
import UserManagement from "./UserManagement";
import ProdEligibility from "./ProdEligibility";
import SlabLevel from "./SlabLevel";
import PaymentStages from "./PaymentStages";
import ExclusionPackages from "./ExclusionPackages";
import BearerPcr from "./BearerPcr";
import PeoPackages from "./PeoPackages";
import BbPackages from "./BbPackages";
import DataAvailability from "./DataAvailability";
import IncentiveCalculation from "./IncentiveCalculation";
import Schema from "./Schema";
import LTEBBPackage from "./LteBbPackage";
import LTEBBPackagePCR from "./LteBbPackagepcr";
import UnlimitedVoicePackages from "./UnlimitedVoicePackages";
import { TableProvider } from "../../context/TableContext";
import NewScheme2 from "./NewScheme2";
import { SalesSidebarData } from "../../data/sales_incentive/dashboard";
import CalculationReports from "./CalculationReports";

function SalesLayout({ tag }) {
  const key = import.meta.env.VITE_KEY_SIGNATURE;
  if (key === "swe79EByf8M7lrU96LmxhsyVL") {
    return (
      <div>
        {/* Main layout of the application */}
        <div className="min-h-screen background-img">
          {/* Header component */}
          <Header />
          {/* Sidebar component */}
          <div className="flex gap-5 px-5 mt-10">
            <SideBar sidebarData={SalesSidebarData} />

            {/* Main content area */}
            <div className="w-full min-h-screen p-5 rounded-lg shadow-2xl">
              <Routes>
                {/* Dashboard routes */}
                <Route path="/usermanage" element={<UserManagement />} />
                <Route path="/analytics" element={<Analytics />} />

                {/* Rules Page Routes */}
                <Route
                  path="/producteligibility"
                  element={<ProdEligibility />}
                />
                <Route path="/slablevel" element={<SlabLevel />} />
                <Route path="/paymentstages" element={<PaymentStages />} />
                <Route
                  path="/exclusionpackages"
                  element={<ExclusionPackages />}
                />
                <Route path="/bearerpcr" element={<BearerPcr />} />
                <Route path="/peopackages" element={<PeoPackages />} />
                <Route path="/bbpackages" element={<BbPackages />} />
                <Route path="/ltepackage" element={<LTEBBPackage />} />
                <Route path="/ltepackagepcr" element={<LTEBBPackagePCR />} />
                <Route
                  path="/unlimitedvoice"
                  element={<UnlimitedVoicePackages />}
                />
                <Route
                  path="/dataavailability"
                  element={<DataAvailability />}
                />

                {/* Process Coms Routes */}
                <Route path="/calculation" element={<IncentiveCalculation />} />
                <Route path="/schema" element={<Schema />} />
                <Route
                  path="/newschema"
                  element={
                    <TableProvider>
                      <NewScheme2 />
                    </TableProvider>
                  }
                />

                {/* Reports page Routes */}
                <Route
                  path="/Calculationreport"
                  element={<CalculationReports />}
                />
                {/* <Route path="/detailreport" element={<DetailReport />} />
                <Route path="/summaryreport" element={<SummaryReport />} />
                <Route path="/packagesummary" element={<PackagesSummary />} />
                <Route path="/summaryfile" element={<SummaryFile />} /> */}

                {/* Notices page Routes */}
                <Route path="/notices" element={<div>Notices Page</div>} />
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

export default SalesLayout;
