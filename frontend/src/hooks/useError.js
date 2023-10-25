import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { useLogout } from "./useLogout";

export const useError = () => {
  const { logout } = useLogout();
  const navigate = useNavigate();
  const verify = (error) => {
    if (error?.response?.status == 401) {
      toast.error("Session expired!");
      logout();
      navigate("/auth?action=login");
    } else {
      toast.error("Something went wrong!");
    }
  };
  return { verify };
};
