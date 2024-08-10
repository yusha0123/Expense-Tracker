import { create } from "zustand";

type OverlayType = "DOWNLOAD_MODAL" | "RESET_PASSWORD_MODAL"

interface AdditionalData {
    id?: string
}

interface OverlayStore {
    type: OverlayType | null;
    isOpen: boolean;
    additionalData: AdditionalData;
    onOpen: (type: OverlayType, data?: AdditionalData) => void;
    onClose: () => void;
}

const useOverlayStore = create<OverlayStore>((set) => ({
    type: null,
    isOpen: false,
    additionalData: {},
    onOpen: (type, data) => {
        set({ isOpen: true, type, additionalData: { ...data } });
    },
    onClose: () => set({ type: null, isOpen: false, additionalData: {} }),
}));

export default useOverlayStore;
