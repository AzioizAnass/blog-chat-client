import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext.tsx";

const PrivateRoute = () => {
    const { isAuthenticated } = useAuth(); 

    if (!isAuthenticated) {
      return <Navigate to="/login" replace />;
    }
  
    return <Outlet />;
  };

export default PrivateRoute;
