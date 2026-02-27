import { create } from "zustand";

type OverlayType =
    | "DOWNLOAD_MODAL"
    | "RESET_PASSWORD_MODAL"
    | "DRAWER"
    | "DELETE_DIALOG"
    | "EDIT_DIALOG";

export interface ExpensePayload {
    _id: string;
    amount: number;
    category: string;
    description: string;
}

interface OverlayStore {
    type: OverlayType | null;
    isOpen: boolean;
    data?: string | ExpensePayload;
    onOpen: (type: OverlayType, data?: string | ExpensePayload) => void;
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
