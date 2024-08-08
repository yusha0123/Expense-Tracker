import { Suspense } from "react";
import { Navigate, Outlet } from "react-router-dom";
import Navbar from "../components/Navbar";
import { Loading } from "../components/Loading";
import PropTypes from "prop-types";

export const PrivateRoute = ({ user, isPremiumRoute }) => {
  if (isPremiumRoute) {
    if (user && user.isPremium) {
      return (
        <>
          <Navbar />
          <Suspense fallback={<Loading />}>
            <main className="mt-16 md:mt-20">
              <Outlet />
            </main>
          </Suspense>
        </>
      );
    }

    if (user && !user.isPremium) {
      return <Navigate to={"/dashboard"} replace />;
    }

    return <Navigate to={"/auth?action=login"} replace />;
  } else {
    if (user) {
      return (
        <>
          <Navbar />
          <Suspense fallback={<Loading />}>
            <main className="mt-16 md:mt-20">
              <Outlet />
            </main>
          </Suspense>
        </>
      );
    }
    return <Navigate to={"/auth?action=login"} replace />;
  }
};

PrivateRoute.propTypes = {
  isPremiumRoute: PropTypes.bool,
  user: PropTypes.shape({
    email: PropTypes.string.isRequired,
    token: PropTypes.string.isRequired,
    isPremium: PropTypes.bool.isRequired,
  }),
};
