
export const authReducer = (state: AuthState, action: AuthAction): AuthState => {
    switch (action.type) {
        case "LOGIN": {
            const user = action.payload;
            localStorage.setItem("user", user.token as string);
            return { ...state, user };
        }
        case "LOGOUT": {
            localStorage.removeItem("user");
            return { ...state, user: null, showConfetti: false };
        }
        case "UPGRADE":
            return { ...state, user: { ...state.user!, isPremium: true } };
        case "TOGGLE_CONFETTI":
            return { ...state, showConfetti: !state.showConfetti };
        case "SET_INITIALIZING":
            return { ...state, isInitializing: action.payload };
        default:
            return state;
    }
};
