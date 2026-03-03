export interface User {
    email: string;
    isPremium: boolean;
    token: string;
}

export interface AuthState {
    user: User | null;
    showConfetti: boolean;
    isInitializing: boolean;

    login: (token: string) => void;
    logout: () => void;
    upgrade: () => void;
    toggleConfetti: () => void;
    initialize: () => Promise<void>;
}

export interface DecodedToken {
    email: string;
    isPremium: boolean;
}