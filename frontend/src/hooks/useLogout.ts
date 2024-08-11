import { useAuthContext } from "./useAuthContext";
import { useQueryClient } from "@tanstack/react-query";
import useOverlayStore from "./useOverlayStore";

export const useLogout = () => {
  const { dispatch } = useAuthContext();
  const queryClient = useQueryClient();
  const { onClose } = useOverlayStore();

  const logout = () => {
    queryClient.clear();
    onClose();
    dispatch({
      type: "LOGOUT",
    });
  };
  return { logout };
};
