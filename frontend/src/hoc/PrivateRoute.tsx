import { Suspense } from "react";
import { Navigate, Outlet } from "react-router-dom";
import { Loading } from "../components/Loading";
import Navbar from "../components/Navbar";

export const PrivateRoute = ({
  user,
  isPremiumRoute,
}: {
  user: User | null;
  isPremiumRoute: boolean;
}) => {
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
