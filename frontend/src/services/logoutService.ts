
import { authStorage } from "@/utils/authStorage";
import { useAuthStore } from "@/store/authStore";
import useOverlayStore from "@/hooks/useOverlayStore";
import { queryClient } from "@/lib/queryClient";

let isRedirecting = false;

export const forceLogout = () => {
    if (isRedirecting) return;
    isRedirecting = true;

    queryClient.clear();
    authStorage.clear();

    useAuthStore.getState().logout();
    useOverlayStore.getState().onClose();

    window.location.href = "/auth?action=login";
};