import { Navigate, Outlet } from "react-router-dom";

export const PublicRoute = ({ user }: { user: User | null }) => {
  if (!user) {
    return <Outlet />;
  }

  return <Navigate to={"/dashboard"} replace />;
};
