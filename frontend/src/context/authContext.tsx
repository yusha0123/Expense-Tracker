import { jwtDecode } from "jwt-decode";
import { createContext, useEffect, useReducer, ReactNode } from "react";

interface AuthState {
  user: User | null;
  showConfetti: boolean;
  isInitializing: boolean;
}

type AuthAction =
  | { type: "LOGIN"; payload: User }
  | { type: "LOGOUT" }
  | { type: "UPGRADE" }
  | { type: "TOGGLE_CONFETTI" }
  | { type: "SET_INITIALIZING"; payload: boolean };

interface AuthContextType {
  state: AuthState;
  dispatch: React.Dispatch<AuthAction>;
}

export const AuthContext = createContext<AuthContextType | undefined>(
  undefined
);

const authReducer = (state: AuthState, action: AuthAction): AuthState => {
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

export const AuthContextProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [state, dispatch] = useReducer(authReducer, {
    user: null,
    showConfetti: false,
    isInitializing: true,
  });

  useEffect(() => {
    const initializeAuth = async () => {
      dispatch({ type: "SET_INITIALIZING", payload: true });

      try {
        const token = localStorage.getItem("user");

        if (token && typeof token === "string") {
          const decoded: DecodedToken = jwtDecode(token);

          if (!("email" in decoded) || !("isPremium" in decoded)) {
            throw new Error("Decoded token is missing required properties.");
          }

          const user = {
            email: decoded.email,
            isPremium: decoded.isPremium,
            token,
          };

          dispatch({
            type: "LOGIN",
            payload: user,
          });
        }
      } catch (error) {
        console.error("Error decoding token:", error);
        dispatch({ type: "LOGOUT" });
      } finally {
        dispatch({ type: "SET_INITIALIZING", payload: false });
      }
    };

    initializeAuth();
  }, []);

  return (
    <AuthContext.Provider value={{ state, dispatch }}>
      {children}
    </AuthContext.Provider>
  );
};
