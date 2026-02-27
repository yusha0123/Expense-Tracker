import { useAuthContext } from "./useAuthContext";
import { useQueryClient } from "@tanstack/react-query";
import useOverlayStore from "./useOverlayStore";
import { authStorage } from "@/utils/authStorage";

export const useLogout = () => {
  const { dispatch } = useAuthContext();
  const queryClient = useQueryClient();
  const { onClose } = useOverlayStore();

  const logout = () => {
    queryClient.clear();
    authStorage.clear();
    onClose();
    dispatch({
      type: "LOGOUT",
    });
  };
  return { logout };
};
