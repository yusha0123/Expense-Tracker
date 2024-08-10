import axios, { AxiosError } from "axios";
import { redirect } from "react-router-dom";
import { toast } from "react-toastify";
import { useLogout } from "./useLogout";

export const useError = () => {
  const { logout } = useLogout();

  const verify = (error: AxiosError | unknown) => {
    if (axios.isAxiosError(error)) {
      if (error.response?.status === 401) {
        toast.error("Session expired!");
        logout();
        redirect("/auth?action=login");
      } else {
        toast.error("Something went wrong!");
      }
    } else {
      toast.error("An unexpected error occurred!");
    }
  };

  return { verify };
};
