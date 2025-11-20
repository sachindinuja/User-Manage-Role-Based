import React from "react";
import { Route, Routes } from "react-router-dom";
import Signin from "./components/common/Signin";
import SalesLayout from "./pages/sales_incentive/SalesLayout.jsx";
import CfoDashboard from "./pages/user_levels/CfoDashboard.jsx";
import WaitingPage from "./WaitingPage.jsx";
import ProtectedRoute from "./ProtectedRoute.jsx";
import ForbiddenPage from "./components/common/ForbiddenPage.jsx";
import DealerLayout from "./pages/dealer_commission/DealerLayout.jsx";
import Gmcbsdashboard from "./pages/user_levels/Gm-CBS-Dashboards.jsx";
import AccountantsDashboard from "./pages/user_levels/AccountantsDashboard.jsx";
import AssistantManagerDash from "./pages/user_levels/AssistantManagerDash.jsx";
import DgmCBSDashboard from "./pages/user_levels/DgmCBSDashboard.jsx";
import GMCSSDashboard from "./pages/user_levels/GM-CSS-Dashboard.jsx";
import SalesDgmCmDash from "./pages/user_levels/SalesDgmCmDash.jsx";
import SalesPersonDash from "./pages/user_levels/SalesPersonDashboard.jsx";
import DGMMetroDashboard from "./pages/user_levels/DGM-Metro-Dashboard.jsx";

function App() {
  // Get the user string from sessionStorage
  // const userString = sessionStorage.getItem("user");
  // Parse it to an object
  // const user = userString ? JSON.parse(userString) : null;
  // Access the user_role
  // const userRole = user ? user.user_role : null;

  // console.log(userRole);
  return (
    <div>
      <Routes>
        {/* Public routes */}
        <Route path="/" element={<Signin />} />
        <Route path="/lobby" element={<WaitingPage />} />
        <Route path="/403" element={<ForbiddenPage />} />
        {/* Modules routes */}
        <Route
          path="/salesincentive/*"
          element={
            <ProtectedRoute allowedRoles={["Regional General Manager"]}>
              <SalesLayout tag="All rights reserved © 2025 Sachin" />
            </ProtectedRoute>
          }
        />
        <Route
          path="/dealer/*"
          element={
            <ProtectedRoute allowedRoles={["Manager Dealer Management"]}>
              <DealerLayout />
            </ProtectedRoute>
          }
        />
        <Route
          path="/incentive/*"
          element={<div>This is Incentive module</div>}
        />
        <Route
          path="/manager-incentive/*"
          element={<div>This is Manager Incentive module</div>}
        />
        <Route
          path="/contact-center/*"
          element={<div>This is Contact center module</div>}
        />
        <Route
          path="/multi-tenant/*"
          element={<div>This is Multi tenant module</div>}
        />
        <Route
          path="/employee-sales/*"
          element={<div>This is Employee Sales module</div>}
        />
        <Route
          path="/micro-business/*"
          element={<div>This is Micro Business module</div>}
        />
        
        <Route path="/cfo-dashboard" element={<CfoDashboard />} />
        <Route path="/gm-cbs-dashboard" element={<Gmcbsdashboard />} />{" "}
        
        <Route path="/accountant" element={<AccountantsDashboard />} />
        <Route path="/assist-manager" element={<AssistantManagerDash />} />
        <Route path="/gm-css" element={<GMCSSDashboard />} /> 
        <Route path="/dgm-metro" element={<DGMMetroDashboard />} />{" "}
        
        <Route path="/dgm-cbs" element={<DgmCBSDashboard />} /> 
        <Route path="/sales-dgm-cm" element={<SalesDgmCmDash />} />
        <Route
          path="/sales-person-dashboard"
          element={<SalesPersonDash />}
        />{" "}
        
      </Routes>
    </div>
  );
}

export default App;
