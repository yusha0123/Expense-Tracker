import { redirect } from "react-router-dom";
import { toast } from "react-toastify";
import { useLogout } from "./useLogout";

export const useError = () => {
  const { logout } = useLogout();

  const verify = (error) => {
    if (error?.response?.status == 401) {
      toast.error("Session expired!");
      logout();
      redirect("/auth?action=login");
    } else {
      toast.error("Something went wrong!");
    }
  };
  return { verify };
};
