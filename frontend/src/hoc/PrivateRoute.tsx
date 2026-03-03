import { Suspense } from "react";
import { Navigate, Outlet } from "react-router-dom";
import { Loading } from "@/components/Loading";
import Navbar from "@/components/Navbar";
import { User } from "@/types/auth";

export const PrivateRoute = ({
  user,
  isPremiumRoute,
  isInitializing,
}: {
  user: User | null;
  isPremiumRoute: boolean;
  isInitializing: boolean;
}) => {
  if (isInitializing) {
    return <Loading />;
  }

  // Not logged in → always go to login
  if (!user) {
    return <Navigate to="/auth?action=login" replace />;
  }

  // Premium route but user not premium → dashboard
  if (isPremiumRoute && !user.isPremium) {
    return <Navigate to="/dashboard" replace />;
  }

  // Allowed access
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
};