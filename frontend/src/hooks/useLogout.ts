import { useAuthContext } from "./useAuthContext";
import { useQueryClient } from "@tanstack/react-query";

export const useLogout = () => {
  const { dispatch } = useAuthContext();
  const queryClient = useQueryClient();

  const logout = async () => {
    queryClient.clear();
    localStorage.removeItem("user");
    dispatch({
      type: "LOGOUT",
    });
  };
  return { logout };
};
