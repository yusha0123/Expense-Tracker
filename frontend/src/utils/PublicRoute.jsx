import { Navigate, Outlet } from "react-router-dom";
import PropTypes from "prop-types";

export const PublicRoute = ({ user }) => {
  if (!user) {
    return <Outlet />;
  }

  return <Navigate to={"/dashboard"} replace />;
};

PublicRoute.propTypes = {
  user: PropTypes.shape({
    email: PropTypes.string.isRequired,
    token: PropTypes.string.isRequired,
    isPremium: PropTypes.bool.isRequired,
  }),
};
