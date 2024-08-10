import { create } from "zustand";

type OverlayType = "DOWNLOAD_MODAL" | "RESET_PASSWORD_MODAL" | "DRAWER" | "DELETE_DIALOG"


interface OverlayStore {
    type: OverlayType | null;
    isOpen: boolean;
    data?: string;
    onOpen: (type: OverlayType, data?: string) => void;
    onClose: () => void;
}

const useOverlayStore = create<OverlayStore>((set) => ({
    type: null,
    isOpen: false,
    data: undefined,
    onOpen: (type, data) => {
        set({ isOpen: true, type, data });
    },
    onClose: () => set({ type: null, isOpen: false, data: undefined }),
}));

export default useOverlayStore;
