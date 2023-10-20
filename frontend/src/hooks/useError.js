import showToast from "./showToast";
import { useToast } from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import { useLogout } from "./useLogout";

export const useError = () => {
  const { logout } = useLogout();
  const toast = useToast();
  const navigate = useNavigate();
  const verify = (error) => {
    if (error.response.status == 401) {
      showToast(toast, "Unautorized Access!", "error", "Please login again!");
      logout();
      navigate("/auth");
    } else {
      showToast(toast, "Something went Wrong!", "error");
    }
  };
  return { verify };
};
