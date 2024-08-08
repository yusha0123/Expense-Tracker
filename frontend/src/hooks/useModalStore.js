import { create } from "zustand";

export const modalTypes = {
    DOWNLOAD_MODAL: "DownloadModal",
    RESET_PASSWORD_MODAL: "ResetPasswordModal",
};

const useModalStore = create((set) => ({
    type: null,
    isOpen: false,
    onOpen: (type) => {
        set({ isOpen: true, type });
    },
    onClose: () => set({ type: null, isOpen: false }),
}));

export default useModalStore;
