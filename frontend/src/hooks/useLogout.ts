import { useQueryClient } from "@tanstack/react-query";
import useOverlayStore from "./useOverlayStore";
import { authStorage } from "@/utils/authStorage";
import { useAuthStore } from "@/store/authStore";

export const useLogout = () => {
  const { logout: clearUserState } = useAuthStore();
  const queryClient = useQueryClient();
  const { onClose } = useOverlayStore();

  const logout = () => {
    queryClient.clear();
    authStorage.clear();
    onClose();
    clearUserState();
  };
  return { logout };
};
