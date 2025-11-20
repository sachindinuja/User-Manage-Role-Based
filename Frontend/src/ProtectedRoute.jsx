import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "./context/Auth.context";

const ProtectedRoute = ({ children, allowedRoles }) => {
  const { loginUserData } = useAuth();

  if (!loginUserData) {
    // Waiting for context to load from sessionStorage
    return <div>Loading...</div>; // or your <Loader />
  }

  // If no login data, redirect to login page
  if (!loginUserData || !loginUserData.token || !loginUserData.user) {
    return <Navigate to="/" replace />;
  }

  const userRole = loginUserData.user.user_role;

  // If role is not allowed
  if (allowedRoles && !allowedRoles.includes(userRole)) {
    return <Navigate to="/403" replace />;
  }

  return children;
};

export default ProtectedRoute;
