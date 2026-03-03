import { create } from "zustand";
import { jwtDecode } from "jwt-decode";
import { authStorage } from "@/utils/authStorage";
import { AuthState, DecodedToken } from "@/types/auth";

export const useAuthStore = create<AuthState>((set, get) => ({
    user: null,
    showConfetti: false,
    isInitializing: true,

    // LOGIN
    login: (token: string) => {
        try {
            const decoded: DecodedToken = jwtDecode(token);

            const user = {
                email: decoded.email,
                isPremium: decoded.isPremium,
                token,
            };

            authStorage.setToken(token);

            set({ user });
        } catch (err) {
            console.error("Invalid token", err);
            authStorage.clear();
            set({ user: null });
        }
    },

    // LOGOUT
    logout: () => {
        authStorage.clear();
        set({
            user: null,
            showConfetti: false,
        });
    },

    // UPGRADE
    upgrade: () => {
        const user = get().user;
        if (!user) return;

        set({
            user: { ...user, isPremium: true },
        });
    },

    toggleConfetti: () =>
        set((state) => ({ showConfetti: !state.showConfetti })),

    initialize: async () => {
        set({ isInitializing: true });

        try {
            const token = authStorage.getToken();

            if (token) {
                const decoded: DecodedToken = jwtDecode(token);

                set({
                    user: {
                        email: decoded.email,
                        isPremium: decoded.isPremium,
                        token,
                    },
                });
            }
        } catch (err) {
            console.error("Token init failed", err);
            authStorage.clear();
            set({ user: null });
        } finally {
            set({ isInitializing: false });
        }
    },
}));