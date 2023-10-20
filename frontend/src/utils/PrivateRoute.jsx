import React, { Suspense } from "react";
import { Navigate, Outlet } from "react-router-dom";
import Navbar from "../components/Navbar";
import { Loading } from "../components/Loading";

export const PrivateRoute = ({ user, isPremiumRoute }) => {
  if (isPremiumRoute) {
    if (user && user.isPremium) {
      return (
        <>
          <Navbar />
          <Suspense fallback={<Loading />}>
            <Outlet />
          </Suspense>
        </>
      );
    }
    if (user && !user.isPremium) {
      return <Navigate to={"/dashboard"} replace />;
    }
    return <Navigate to={"/auth"} replace />;
  } else {
    if (user) {
      return (
        <>
          <Navbar />
          <Suspense fallback={<Loading />}>
            <Outlet />
          </Suspense>
        </>
      );
    }
    return <Navigate to={"/auth"} replace />;
  }
};
