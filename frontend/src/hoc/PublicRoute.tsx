import { Loading } from "@/components/Loading";
import { User } from "@/types/auth";
import { Navigate, Outlet } from "react-router-dom";

export const PublicRoute = ({
  user,
  isInitializing,
}: {
  user: User | null;
  isInitializing: boolean;
}) => {
  if (isInitializing) {
    return <Loading />;
  }

  if (!user) {
    return <Outlet />;
  }

  return <Navigate to={"/dashboard"} replace />;
};
