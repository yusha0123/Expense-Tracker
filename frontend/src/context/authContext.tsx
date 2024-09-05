import { jwtDecode } from "jwt-decode";
import { createContext, useEffect, useReducer, ReactNode } from "react";

interface AuthState {
  user: User | null;
  showConfetti: boolean;
}

type AuthAction =
  | { type: "LOGIN"; payload: User }
  | { type: "LOGOUT" }
  | { type: "UPGRADE" }
  | { type: "TOGGLE_CONFETTI" };

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
      return { user, showConfetti: state.showConfetti };
    }
    case "LOGOUT": {
      localStorage.removeItem("user");
      return { user: null, showConfetti: false };
    }
    case "UPGRADE":
      return { ...state, user: { ...state.user!, isPremium: true } };
    case "TOGGLE_CONFETTI":
      return { ...state, showConfetti: !state.showConfetti };
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
  });

  useEffect(() => {
    try {
      const token = localStorage.getItem("user");

      if (token && typeof token === "string") {
        const decoded: DecodedToken = jwtDecode(token);

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
      dispatch({
        type: "LOGOUT",
      });
    }
  }, []);

  return (
    <AuthContext.Provider value={{ state, dispatch }}>
      {children}
    </AuthContext.Provider>
  );
};
